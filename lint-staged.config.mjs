// @ts-check

/**
 * Lint-staged configuration for BookMyVenue monorepo.
 *
 * Each sub-project has its own pattern and commands:
 * - ESLint runs only on the matched (staged) files
 * - TypeScript check runs on the full project when any TS file changes
 * - Unit test suite runs after typecheck
 */
export default {
	// Client project — lint changed files only, full tsc, and unit tests
	"client/src/**/*.{ts,tsx}": [
		(files) => `pnpm --filter client exec eslint --no-warn-ignored ${files.join(" ")}`,
		() => "pnpm --filter client exec tsc --noEmit",
		() => "pnpm --filter client test",
	],

	// Admin project — lint changed files only, full tsc, and unit tests
	"admin/src/**/*.{ts,tsx}": [
		(files) => `pnpm --filter admin exec eslint --no-warn-ignored ${files.join(" ")}`,
		() => "pnpm --filter admin exec tsc --noEmit",
		() => "pnpm --filter admin test",
	],

	// Server project — lint changed files only, full tsc, and unit tests
	"server/src/**/*.ts": [
		(files) => `pnpm --filter server exec eslint --no-warn-ignored ${files.join(" ")}`,
		() => "pnpm --filter server exec tsc --noEmit",
		() => "pnpm --filter server test",
	],
};
