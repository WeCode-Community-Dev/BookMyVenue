// Auth attacher — ensures server function calls from the browser include cookies.
// With Better Auth, cookies are sent automatically by the browser. This middleware
// is effectively a no-op but kept for structural compatibility with the middleware chain.
import { createMiddleware } from "@tanstack/react-start";

export const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => next());
