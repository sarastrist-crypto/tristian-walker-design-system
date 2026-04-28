import { Eyebrow } from "./Eyebrow";
import { env, formatCampaignEnd } from "@/lib/env";

type Props = {
  locked?: boolean;
};

export function BookFunnelHandoff({ locked = false }: Props) {
  return (
    <section
      id="get-the-book"
      aria-disabled={locked}
      className={[
        "bg-warm px-6 py-24 sm:py-32 border-t border-black/5 transition-opacity duration-700 ease-out",
        locked ? "opacity-50 pointer-events-none select-none" : "opacity-100",
      ].join(" ")}
    >
      <div className="max-w-narrative mx-auto text-center">
        <Eyebrow>The Whole Book</Eyebrow>
        <h2 className="mt-6 font-heading text-4xl sm:text-5xl font-light text-fg leading-[1.15]">
          If the first chapter <em className="text-accent italic">stayed with you</em>, take the rest.
        </h2>

        <p className="mt-6 text-fg-muted text-lg font-body max-w-[50ch] mx-auto">
          The full book is yours, free, through {formatCampaignEnd()}. Pick the format
          that fits your reader and BookFunnel will deliver it. Kindle, Apple Books,
          Kobo, or PDF — whichever way you read.
        </p>

        <div className="mt-12">
          {locked ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="btn-primary opacity-60 cursor-not-allowed"
            >
              Send your response above first ↑
            </button>
          ) : (
            <a
              href={env.VITE_BOOKFUNNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Get the Full Book — Free
            </a>
          )}
        </div>

        <p className="mt-6 text-sm text-fg-subtle font-body max-w-md mx-auto">
          BookFunnel will email you the file in your preferred format. It works on
          Kindle, Apple Books, Kobo, or PDF.
        </p>
      </div>
    </section>
  );
}
