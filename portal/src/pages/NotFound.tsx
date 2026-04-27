import { Link } from "react-router-dom";
import { Eyebrow } from "@/components";

export function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-base px-6">
      <div className="text-center max-w-narrative">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-6 font-heading text-5xl font-light text-fg">
          Not <em className="text-accent italic">here</em>.
        </h1>
        <p className="mt-4 text-muted font-body">
          Whatever you were looking for has drifted somewhere else.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Back to the start
        </Link>
      </div>
    </main>
  );
}
