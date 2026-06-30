import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authProvider } from "@/infrastructure/providers";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await authProvider.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
