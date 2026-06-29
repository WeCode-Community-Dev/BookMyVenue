import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5000/api";

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  // In Next.js 15+, params is a Promise. Let's await it to be compatible.
  const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params));
  const pathStr = resolvedParams.path.join("/");
  const query = req.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/${pathStr}${query}`;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("bmv_access_token")?.value;
  let refreshToken = cookieStore.get("bmv_refresh_token")?.value;

  // 1. Intercept Logout
  if (pathStr === "auth/logout" && req.method === "POST") {
    try {
      if (refreshToken) {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error("Backend logout error in proxy:", err);
    }

    // Clear browser cookies
    cookieStore.delete("bmv_access_token");
    cookieStore.delete("bmv_refresh_token");
    cookieStore.delete("bmv_user_role");
    return NextResponse.json({ message: "Logged out successfully" });
  }

  // 2. Block direct manual refresh requests from client-side JS
  if (pathStr === "auth/refresh") {
    return NextResponse.json({ message: "Refresh token rotation is handled automatically by proxy." }, { status: 400 });
  }

  // Helper to fetch backend with bearer token
  const makeRequest = async (token?: string) => {
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length"); // Let fetch recalculate content length

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      // Read request body as ArrayBuffer to handle both JSON and binary payloads (e.g. multipart file uploads)
      const arrayBuffer = await req.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        options.body = arrayBuffer;
      }
    }

    return fetch(targetUrl, options);
  };

  // 3. Make initial request to backend
  let response = await makeRequest(accessToken);

  // 4. Intercept 401 Unauthorized to perform silent token refresh
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.accessToken;
        refreshToken = refreshData.refreshToken;

        // Save rotated tokens in secure HttpOnly cookies
        cookieStore.set("bmv_access_token", accessToken!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60, // 15 minutes
        });

        cookieStore.set("bmv_refresh_token", refreshToken!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // Retry the original request with the new access token
        response = await makeRequest(accessToken);
      } else {
        // Refresh token has expired/invalidated, clear credentials
        cookieStore.delete("bmv_access_token");
        cookieStore.delete("bmv_refresh_token");
        cookieStore.delete("bmv_user_role");
      }
    } catch (err) {
      console.error("Token refresh failed in proxy:", err);
    }
  }

  // 5. Intercept Login or Registration success to save cookies and sanitize client response
  const isAuthSuccess = (pathStr === "auth/login" || pathStr === "users/register") && req.method === "POST" && response.ok;
  if (isAuthSuccess) {
    try {
      const responseData = await response.json();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = responseData;

      cookieStore.set("bmv_access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });

      cookieStore.set("bmv_refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      cookieStore.set("bmv_user_role", user.role, {
        httpOnly: false, // Let client JS read it for quick UI layouts
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      // Strip tokens from JSON body before sending to client JS
      return NextResponse.json({ user });
    } catch (err) {
      console.error("Authentication mapping failed in proxy:", err);
    }
  }

  // 6. Return response with original headers and status
  const responseData = await response.arrayBuffer();
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-encoding");

  return new NextResponse(responseData, {
    status: response.status,
    headers: responseHeaders,
  });
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE
};
