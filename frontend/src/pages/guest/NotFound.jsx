import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-6xl font-bold tracking-tight text-gray-900">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        Back to Home
      </Link>
    </main>
  );
};

export default NotFound;
