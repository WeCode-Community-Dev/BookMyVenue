import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

// Generates strongly-typed API definitions from the live FastAPI OpenAPI schema.
// Run with the API up:  OPENAPI_URL=http://localhost:8000/openapi.json pnpm generate
const OPENAPI_URL = process.env.OPENAPI_URL ?? 'http://localhost:8000/openapi.json'
const OUT = fileURLToPath(new URL('../src/types.ts', import.meta.url))

async function generate() {
  const ast = await openapiTS(new URL(OPENAPI_URL))
  const banner = '// AUTO-GENERATED — do not edit. Run `pnpm generate` in packages/api-client to refresh.\n\n'
  writeFileSync(OUT, banner + astToString(ast))
  console.log(`Wrote ${OUT}`)
}

generate().catch((err) => {
  console.error('Type generation failed:', err)
  process.exit(1)
})
