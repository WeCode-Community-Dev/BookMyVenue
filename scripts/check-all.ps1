#Requires -Version 5.1
<#
.SYNOPSIS
  Run the full local quality gate: API (ruff, alembic, pytest) then frontend (lint, typecheck, build).

.DESCRIPTION
  From the repo root:
    .\scripts\check-all.ps1

  Steps (API, then monorepo frontend):
    1. ruff check .
    2. ruff check . --fix
    3. ruff format .
    4. ruff format . --check
    5. alembic upgrade head
    6. pytest
    7. pnpm lint
    8. pnpm typecheck
    9. pnpm build

.PARAMETER SkipMigrations
  Skip `alembic upgrade head` (useful when the DB is unavailable).

.PARAMETER SkipFrontend
  Run API checks only.

.PARAMETER SkipApi
  Run frontend checks only.
#>
[CmdletBinding()]
param(
    [switch]$SkipMigrations,
    [switch]$SkipFrontend,
    [switch]$SkipApi
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-Step {
    param(
        [string]$Name,
        [scriptblock]$Action
    )
    Write-Step $Name
    & $Action
    if ($LASTEXITCODE -ne 0 -and $null -ne $LASTEXITCODE) {
        throw "Step failed (exit $LASTEXITCODE): $Name"
    }
}

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ApiDir = Join-Path $RepoRoot "apps\api"
$VenvActivate = Join-Path $ApiDir ".venv\Scripts\Activate.ps1"

if (-not $SkipApi) {
    if (-not (Test-Path $VenvActivate)) {
        throw "API venv not found at $VenvActivate. Create it with: cd apps\api; uv sync --all-extras"
    }

    Push-Location $ApiDir
    try {
        Write-Step "Activating API virtualenv"
        . $VenvActivate

        Invoke-Step "ruff check ." { ruff check . }
        Invoke-Step "ruff check . --fix" { ruff check . --fix }
        Invoke-Step "ruff format ." { ruff format . }
        Invoke-Step "ruff format . --check" { ruff format . --check }

        if (-not $SkipMigrations) {
            Invoke-Step "alembic upgrade head" { alembic upgrade head }
        }
        else {
            Write-Step "Skipping alembic upgrade head"
        }

        Invoke-Step "pytest" { pytest }
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipFrontend) {
    Push-Location $RepoRoot
    try {
        Invoke-Step "pnpm lint" { pnpm lint }
        Invoke-Step "pnpm typecheck" { pnpm typecheck }
        Invoke-Step "pnpm build" { pnpm build }
    }
    finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "All checks passed." -ForegroundColor Green
