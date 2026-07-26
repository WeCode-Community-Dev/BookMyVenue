import { Lock } from "lucide-react";
import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="text-center">
        <Lock className="mx-auto h-12 w-12 text-zinc-400" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">
          Access Denied
        </h1>
        <p className="mt-2 text-base text-zinc-500">
          You do not have permission to access this page.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            &larr; Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
