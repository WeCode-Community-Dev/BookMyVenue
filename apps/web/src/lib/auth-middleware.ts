// Auth middleware — verifies the session from the request cookies via Better Auth.
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createAuth } from "@/lib/auth";
import { getCloudflareEnv } from "@/lib/cloudflare-env";

export const requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const auth = createAuth();
  const request = getRequest();

  if (!request?.headers) {
    throw new Error("Unauthorized: No request headers available");
  }

  // Better Auth resolves session from cookies automatically
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    throw new Error("Unauthorized: No valid session");
  }

  return next({
    context: {
      userId: session.user.id,
      session,
      // Provide a DB handle for use in the DI container
      db: getCloudflareEnv().DB,
    },
  });
});
