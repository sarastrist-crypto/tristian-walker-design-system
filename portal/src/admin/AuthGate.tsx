import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";
import { Eyebrow } from "@/components";

interface AuthGateProps {
  children: (email: string) => ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const supabase = getSupabase();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function onSendLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    if (!supabase) return;
    const fd = new FormData(e.currentTarget);
    const target = String(fd.get("email") ?? "").trim();
    const { error } = await supabase.auth.signInWithOtp({
      email: target,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setSent(true);
  }

  async function signOut() {
    await supabase?.auth.signOut();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-base">
        <p className="text-muted font-body">Checking session…</p>
      </main>
    );
  }

  if (!supabase) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-base px-6">
        <div className="max-w-narrative text-center">
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-4 font-heading text-3xl text-fg">Supabase not configured.</h1>
          <p className="mt-2 text-muted font-body">
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>.
          </p>
        </div>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-base px-6">
        <div className="w-full max-w-md bg-surface rounded-md shadow-md p-8">
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-4 font-heading text-3xl text-fg">Sign in</h1>
          <p className="mt-2 text-muted font-body text-sm">
            Magic link to the allowlisted address.
          </p>
          {sent ? (
            <p className="mt-6 text-fg font-body">
              Check your inbox. The link expires in an hour.
            </p>
          ) : (
            <form onSubmit={onSendLink} className="mt-6 grid gap-4">
              <label>
                <span className="field-label">Email</span>
                <input className="field" type="email" name="email" required />
              </label>
              {errorMsg && (
                <p className="text-sm" style={{ color: "var(--error)" }}>{errorMsg}</p>
              )}
              <button type="submit" className="btn-primary">Send magic link</button>
            </form>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="bg-dark text-light px-6 py-4 flex items-center justify-between">
        <span className="font-body text-sm tracking-wide-x uppercase">
          Admin · {email}
        </span>
        <button onClick={signOut} className="text-sm font-body text-light/70 hover:text-accent">
          Sign out
        </button>
      </header>
      {children(email)}
    </>
  );
}
