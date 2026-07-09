import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "../../packages/infrastructure/src/drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/85cf62fecdc7a7e6b6dd60686687edcabe6850290c4279cee81984ceb96526e6.sqlite",
  },
});
