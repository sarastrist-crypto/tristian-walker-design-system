import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  const dim = "rgba(248,245,239,0.7)";
  const dimmer = "rgba(248,245,239,0.5)";
  return (
    <footer className="bg-dark px-6 py-12 border-t-[5px] border-accent">
      <div className="max-w-narrative mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
        <p className="font-body text-sm tracking-wide-x uppercase" style={{ color: dim }}>
          Tristian Walker
        </p>
        <nav className="flex items-center gap-6">
          <a
            href="https://tristianwalker.com"
            className="font-body text-sm transition-colors hover:text-accent"
            style={{ color: dim }}
          >
            tristianwalker.com
          </a>
          <Link
            to="/privacy"
            className="font-body text-sm transition-colors hover:text-accent"
            style={{ color: dim }}
          >
            Privacy
          </Link>
        </nav>
        <p className="font-body text-xs" style={{ color: dimmer }}>
          © {year}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
