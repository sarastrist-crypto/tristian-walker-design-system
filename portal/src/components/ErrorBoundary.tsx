import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string | null;
}

// Top-level safety net. If anything in the tree throws during render or
// commit, we show a brand-styled fallback instead of a blank page.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Portal error boundary caught:", error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-screen flex items-center justify-center bg-base px-6">
        <div className="text-center max-w-narrative">
          <p
            className="font-body text-xs uppercase mb-4"
            style={{ color: "var(--accent-primary)", letterSpacing: "0.4em" }}
          >
            Something went sideways
          </p>
          <h1 className="font-heading text-4xl font-light text-fg leading-tight">
            Refresh, <em className="text-accent italic">and try again</em>.
          </h1>
          <p className="mt-6 text-muted font-body max-w-md mx-auto">
            If the problem persists, email{" "}
            <a
              href="mailto:tristian@thequietlinebook.com"
              className="text-accent underline-offset-4 hover:underline"
            >
              tristian@thequietlinebook.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mt-8"
          >
            Reload
          </button>
        </div>
      </main>
    );
  }
}
