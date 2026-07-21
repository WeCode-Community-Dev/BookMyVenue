"""Machine-to-machine endpoint that runs background jobs on demand.

Triggered by scheduled GitHub Actions crons (see .github/workflows/jobs.yml),
which pass the cadence-group job names and the shared X-Job-Token secret. This
replaces the in-process APScheduler in production so the free web service can
sleep when idle (ENABLE_JOBS stays false).
"""

import hmac
import logging

from fastapi import APIRouter, Header, HTTPException, Query

from app.core.config import settings
from app.jobs.runner import JOBS, run_job

logger = logging.getLogger(__name__)

router = APIRouter()


def _authorize(x_job_token: str | None) -> None:
    if not settings.job_runner_token:
        # No token configured -> endpoint is intentionally disabled.
        raise HTTPException(status_code=503, detail="Job runner is not configured")
    if not x_job_token or not hmac.compare_digest(x_job_token, settings.job_runner_token):
        raise HTTPException(status_code=401, detail="Invalid job token")


@router.post("/run-jobs")
def run_jobs(
    jobs: str = Query(
        ..., description="Comma-separated job names, e.g. hold_expiry,payment_reminders"
    ),
    x_job_token: str | None = Header(default=None, alias="X-Job-Token"),
):
    _authorize(x_job_token)

    names = [n.strip() for n in jobs.split(",") if n.strip()]
    if not names:
        raise HTTPException(status_code=400, detail="No jobs specified")

    unknown = [n for n in names if n not in JOBS]
    if unknown:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown job(s): {', '.join(unknown)}. Valid: {', '.join(JOBS)}",
        )

    results: dict[str, int] = {}
    for name in names:
        results[name] = run_job(name)

    logger.info("run-jobs completed: %s", results)
    return {"results": results, "ran": len(results)}
