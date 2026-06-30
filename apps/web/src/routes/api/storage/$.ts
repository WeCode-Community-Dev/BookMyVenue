// Catch-all API route for Cloudflare R2 storage operations.
// Handles file uploads, public asset serving, and secure invoice downloads.

import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/lib/auth";
import { getCloudflareEnv } from "@/lib/cloudflare-env";
import { buildServices } from "@/infrastructure/services";

export const Route = createFileRoute("/api/storage/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const pathSegments = url.pathname.replace(/^\/api\/storage\//, "").split("/");
        const type = pathSegments[0]; // "public" or "private"
        const bucketName = pathSegments[1]; // "venue-images" or "invoices"
        const filePath = pathSegments.slice(2).join("/");

        if (!bucketName || !filePath) {
          return new Response("Malformed URL", { status: 400 });
        }

        const env = getCloudflareEnv();

        if (type === "public" && bucketName === "venue-images") {
          const file = await env.VENUE_IMAGES.get(filePath);
          if (!file) return new Response("File Not Found", { status: 404 });

          const headers = new Headers();
          file.writeHttpMetadata(headers);
          headers.set("etag", file.httpEtag);
          headers.set("Cache-Control", "public, max-age=31536000"); // cache public assets for 1 year
          return new Response(file.body, { headers });
        }

        if (type === "private" && bucketName === "invoices") {
          // 1. Resolve user session to enforce access control
          const auth = createAuth();
          const session = await auth.api.getSession({ headers: request.headers });
          if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
          }

          // 2. Load the booking metadata to check ownership (only customer, host, or admin)
          const svc = buildServices({ db: env.DB, userId: session.user.id });

          // Find booking ID from invoice PDF path
          // Invoice paths are structured as: "invoices/BOOKING_UUID.pdf" or similar
          const bookingId = filePath.replace(/\.pdf$/, "");
          const booking = await svc.bookingsRepo.findWithVenue(bookingId);

          if (!booking) {
            return new Response("Invoice Booking Not Found", { status: 404 });
          }

          const isAdminUser = await svc.userRolesRepo.isAdmin(session.user.id);
          const isOwner = booking.customer_id === session.user.id;
          const isHost = booking.venues?.host_id === session.user.id;

          if (!isAdminUser && !isOwner && !isHost) {
            return new Response("Forbidden: Access Denied", { status: 403 });
          }

          // 3. Retrieve and stream the PDF from private R2 bucket
          const file = await env.INVOICES.get(filePath);
          if (!file) return new Response("Invoice File Not Found", { status: 404 });

          const headers = new Headers();
          file.writeHttpMetadata(headers);
          headers.set("etag", file.httpEtag);
          headers.set("Content-Type", "application/pdf");
          headers.set("Content-Disposition", `inline; filename="invoice-${bookingId}.pdf"`);
          return new Response(file.body, { headers });
        }

        return new Response("Invalid asset request", { status: 400 });
      },

      POST: async ({ request }) => {
        const url = new URL(request.url);
        const operation = url.pathname.replace(/^\/api\/storage\//, "");

        const env = getCloudflareEnv();
        const auth = createAuth();
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user) {
          return new Response("Unauthorized", { status: 401 });
        }

        if (operation === "upload") {
          const formData = await request.formData();
          const bucket = formData.get("bucket") as string;
          const path = formData.get("path") as string;
          const file = formData.get("file") as File;

          if (!bucket || !path || !file) {
            return new Response("Missing required parameters", { status: 400 });
          }

          const bucketBinding = bucket === "venue-images" ? env.VENUE_IMAGES : env.INVOICES;
          if (!bucketBinding) {
            return new Response(`Bucket binding ${bucket} not found`, { status: 500 });
          }

          const arrayBuffer = await file.arrayBuffer();
          await bucketBinding.put(path, arrayBuffer, {
            httpMetadata: { contentType: file.type || "application/octet-stream" },
          });

          return new Response(JSON.stringify({ path }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        if (operation === "delete") {
          const body = (await request.json()) as { bucket: string; paths: string[] };
          const { bucket, paths } = body;

          if (!bucket || !paths || !Array.isArray(paths)) {
            return new Response("Invalid parameters", { status: 400 });
          }

          const bucketBinding = bucket === "venue-images" ? env.VENUE_IMAGES : env.INVOICES;
          if (!bucketBinding) {
            return new Response(`Bucket binding ${bucket} not found`, { status: 500 });
          }

          // Enforce host/owner verification on deletes
          if (bucket === "venue-images") {
            // Paths are structured as "USER_ID/UUID-filename"
            // Ensure paths belong to current user
            const unauthorizedPath = paths.find((p) => !p.startsWith(`${session.user.id}/`));
            const svc = buildServices({ db: env.DB, userId: session.user.id });
            const isAdminUser = await svc.userRolesRepo.isAdmin(session.user.id);

            if (unauthorizedPath && !isAdminUser) {
              return new Response("Forbidden: Cannot delete other user's files", { status: 403 });
            }
          }

          await Promise.all(paths.map((p) => bucketBinding.delete(p)));
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response("Invalid operation", { status: 400 });
      },
    },
  },
});
