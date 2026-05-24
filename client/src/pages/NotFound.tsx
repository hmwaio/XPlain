import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-6">
          <div className="absolute inset-0 blur-[120px] bg-accent/10 rounded-full" />
          <h1 className="relative text-7xl sm:text-8xl font-extrabold tracking-tight">
            404
          </h1>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold">Page not found</h2>

        <p className="mt-3 text-secondary">
          The page you're looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center px-6 h-12 rounded-2xl bg-accent text-black font-semibold hover:bg-accent-hover transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
