import { Link } from "react-router-dom";
import { Eyebrow, Footer } from "@/components";

export function Privacy() {
  return (
    <>
      <main className="bg-base px-6 pt-24 pb-32">
        <div className="max-w-reading mx-auto">
          <Link
            to="/"
            className="font-body text-xs uppercase tracking-wide-x text-muted hover:text-accent transition-colors"
            style={{ letterSpacing: "0.2em" }}
          >
            ← Back to the book
          </Link>

          <div className="mt-12 text-center mb-12">
            <Eyebrow>Privacy</Eyebrow>
            <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-light text-fg leading-[1.15]">
              The short version, <em className="text-accent italic">in plain English</em>.
            </h1>
          </div>

          <article className="reader">
            <p>
              This page collects very little, on purpose. It's a reading portal,
              not a marketing funnel. Here is exactly what happens when you use it.
            </p>

            <h2>What gets stored</h2>

            <p>
              <strong>If you read Chapter 1:</strong> the site stores an anonymous
              session ID and how far you scrolled. No name, no email, no IP
              address. The session ID lives in your browser tab and disappears
              when you close it.
            </p>

            <p>
              <strong>If you ask BookFunnel for the full book:</strong> BookFunnel
              collects your email and delivers the file. They are the source of
              record. Their privacy policy lives at{" "}
              <a href="https://bookfunnel.com/privacy" className="underline">
                bookfunnel.com/privacy
              </a>
              . When BookFunnel notifies us of a delivery, we record your email
              and a flag indicating whether you opted into Tristian's notes. That's it.
            </p>

            <p>
              <strong>If you send a reader response:</strong> we store the words
              you wrote, your first name, optional city, optional role, your
              reading status, and (if you provide one) an email address. We also
              store a one-way hash of your IP for spam mitigation — not the IP
              itself.
            </p>

            <h2>What gets shared</h2>

            <p>
              Your response is read by Tristian. If you check the box that says
              he can use it on his website, he will email you to confirm before
              anything is published. Nothing goes public without that round trip.
            </p>

            <p>
              No third-party analytics. No advertising pixels. No cookies for
              tracking — only the session-storage entry described above.
            </p>

            <h2>Where the data lives</h2>

            <p>
              In a Supabase database, on Tristian's account. Backups follow
              Supabase's standard retention. Email is sent through Resend.
            </p>

            <h2>How to delete what's yours</h2>

            <p>
              Email{" "}
              <a href="mailto:tristian@thequietlinebook.com" className="underline">
                tristian@thequietlinebook.com
              </a>{" "}
              with the email address or first name you used. Your row is gone
              within a week.
            </p>

            <h2>Children</h2>

            <p>
              The book is for adults. The site is not directed at children under
              16, and we don't knowingly collect anything from them.
            </p>

            <h2>Changes</h2>

            <p>
              If this policy changes, the date at the top of the page changes
              with it. There is no other notification mechanism — that is the
              point.
            </p>

            <hr />

            <p className="text-muted">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              .
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
