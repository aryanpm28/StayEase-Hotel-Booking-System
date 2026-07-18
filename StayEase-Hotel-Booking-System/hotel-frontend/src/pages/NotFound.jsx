import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-brass">Error 404</span>
      <h1 className="mt-3 font-display text-3xl text-ink">This room doesn't exist</h1>
      <p className="mt-2 text-sm text-ink/60">
        The page you're looking for has checked out.
      </p>
      <Link to="/" className="mt-6 rounded-full bg-ink px-6 py-3 text-ivory">
        Back to the lobby
      </Link>
    </div>
  );
}
