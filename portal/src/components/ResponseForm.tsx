import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eyebrow } from "./Eyebrow";
import { responseSchema } from "@/lib/validators";
import { env } from "@/lib/env";

type Status = "idle" | "submitting" | "ok" | "error";

type Props = {
  onSubmitted?: () => void;
};

const READING_STATUSES = [
  { value: "just_started", label: "Just started" },
  { value: "mid_book", label: "Mid-book" },
  { value: "finished", label: "Finished" },
  { value: "came_back", label: "Came back to it" },
];

const PROFILE_KEY = "tql.reader-profile.v1";

type ReaderProfile = { first_name?: string; email?: string };

function loadProfile(): ReaderProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      first_name: typeof parsed.first_name === "string" ? parsed.first_name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return {};
  }
}

function saveProfile(profile: ReaderProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* localStorage unavailable — fail silently */
  }
}

export function ResponseForm({ onSubmitted }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<ReaderProfile>({});
  const [giveTo, setGiveTo] = useState("");
  const whyRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const showWhy = giveTo.trim().length >= 2;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      first_name: String(fd.get("first_name") ?? "").trim(),
      city: String(fd.get("city") ?? "").trim(),
      role_context: String(fd.get("role_context") ?? "").trim(),
      reading_status: String(fd.get("reading_status") ?? ""),
      question_id: String(fd.get("question_id") ?? "default"),
      response_text: String(fd.get("response_text") ?? "").trim(),
      give_to: String(fd.get("give_to") ?? "").trim(),
      give_to_why: String(fd.get("give_to_why") ?? "").trim(),
      consent_publish: fd.get("consent_publish") === "on",
      email: String(fd.get("email") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
    };

    const parsed = responseSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg("Please check the form — some fields look off.");
      return;
    }

    saveProfile({ first_name: payload.first_name, email: payload.email });

    try {
      const res = await fetch(`${env.VITE_API_BASE}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        "Something went wrong sending that. Tristian still wants to hear from you — try again in a moment."
      );
    }
  }

  if (status === "ok") {
    return (
      <section id="respond" className="bg-before-you-go px-6 py-24 sm:py-32 border-t border-black/5">
        <div className="max-w-narrative mx-auto text-center fade-up">
          <Eyebrow>Received</Eyebrow>
          <h2 className="mt-6 font-heading text-3xl sm:text-4xl font-light text-fg leading-[1.15]">
            Thank you. <em className="text-accent italic">It will be read.</em>
          </h2>
          <p className="mt-4 text-fg-muted font-body">
            Your book is unlocked just below — Kindle, Apple Books, Kobo, or PDF.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="respond"
      className="bg-before-you-go px-6 py-24 sm:py-32 border-t border-black/5"
    >
      <div className="max-w-narrative mx-auto">
        <div className="text-center mb-12">
          <Eyebrow>Before You Go</Eyebrow>
          <h2 className="mt-6 font-heading text-4xl sm:text-5xl font-light text-fg leading-[1.15]">
            One line back, <em className="text-accent italic">before the book.</em>
          </h2>
          <p className="mt-6 text-fg-muted text-lg font-body max-w-[52ch] mx-auto">
            {env.VITE_RESPONSE_QUESTION}
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5">
          <input type="hidden" name="question_id" value="default" />

          {/* Honeypot — should remain empty. */}
          <div className="honeypot" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <label>
            <span className="field-label">Your response</span>
            <textarea
              className="field min-h-[180px]"
              name="response_text"
              required
              maxLength={4000}
              rows={6}
              placeholder="A line. A scene. A feeling. Whatever stayed."
            />
          </label>

          <label>
            <span className="field-label">If you could give this chapter to anyone, who would you give it to?</span>
            <input
              className="field"
              type="text"
              name="give_to"
              maxLength={200}
              value={giveTo}
              onChange={(e) => setGiveTo(e.target.value)}
              placeholder="A name, a relationship, a role…"
            />
          </label>

          <label
            ref={whyRef}
            className={[
              "field-fade-in",
              showWhy ? "field-fade-in--in" : "field-fade-in--out",
            ].join(" ")}
            aria-hidden={!showWhy}
          >
            <span className="field-label">
              Why them?
            </span>
            <input
              className="field"
              type="text"
              name="give_to_why"
              maxLength={800}
              tabIndex={showWhy ? 0 : -1}
              placeholder="Just a line. The first thing that comes to mind."
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-5 mt-2">
            <label>
              <span className="field-label">First name</span>
              <input
                className="field"
                type="text"
                name="first_name"
                required
                maxLength={60}
                defaultValue={profile.first_name ?? ""}
              />
            </label>
            <label>
              <span className="field-label">
                Email <span className="opacity-60 normal-case">— so we can send the book</span>
              </span>
              <input
                className="field"
                type="email"
                name="email"
                required
                maxLength={120}
                defaultValue={profile.email ?? ""}
              />
            </label>
          </div>

          <label>
            <span className="field-label">Where are you with the book?</span>
            <select className="field" name="reading_status" required defaultValue="">
              <option value="" disabled>Choose one</option>
              {READING_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>

          <details className="text-sm text-fg-muted font-body">
            <summary className="cursor-pointer select-none opacity-70 hover:opacity-100">
              Add city or role <span className="opacity-60">(optional)</span>
            </summary>
            <div className="grid sm:grid-cols-2 gap-5 mt-4">
              <label>
                <span className="field-label">City</span>
                <input className="field" type="text" name="city" maxLength={80} />
              </label>
              <label>
                <span className="field-label">Role or context</span>
                <input
                  className="field"
                  type="text"
                  name="role_context"
                  maxLength={200}
                  placeholder="e.g. ER nurse, second-year associate"
                />
              </label>
            </div>
          </details>

          <label className="flex items-start gap-3 text-sm text-fg-muted font-body">
            <input
              type="checkbox"
              name="consent_publish"
              className="mt-1 accent-[var(--accent-primary)]"
            />
            <span>
              Tristian can use this on his website. He'll send it back before publishing.
            </span>
          </label>

          {errorMsg && (
            <p className="text-sm" style={{ color: "var(--error, #B23A2E)" }}>{errorMsg}</p>
          )}

          <div className="mt-2">
            <button
              type="submit"
              className="btn-primary"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Send & unlock the book"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
