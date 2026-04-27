import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

interface ResponseRow {
  id: string;
  first_name: string;
  city: string | null;
  role_context: string | null;
  reading_status: string | null;
  response_text: string;
  consent_publish: boolean;
  approved_for_site: boolean;
  source: string;
  created_at: string;
}

export function ResponsesTable() {
  const supabase = getSupabase();
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function load() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setErrorMsg(error.message);
    else setRows((data ?? []) as ResponseRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [supabase]);

  async function toggleApproved(id: string, next: boolean) {
    if (!supabase) return;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, approved_for_site: next } : r)));
    const { error } = await supabase
      .from("responses")
      .update({ approved_for_site: next })
      .eq("id", id);
    if (error) {
      setErrorMsg(error.message);
      void load();
    }
  }

  function exportCsv() {
    const header = [
      "created_at",
      "first_name",
      "city",
      "role_context",
      "reading_status",
      "consent_publish",
      "approved_for_site",
      "source",
      "response_text",
    ];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header.map((k) => escape((r as unknown as Record<string, unknown>)[k])).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="px-6 py-12 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl text-fg">Responses</h2>
        <button onClick={exportCsv} className="btn-outline text-xs">
          Export CSV
        </button>
      </div>
      {errorMsg && <p className="mb-4 text-sm" style={{ color: "var(--error)" }}>{errorMsg}</p>}
      {loading ? (
        <p className="text-muted font-body">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted font-body">No responses yet.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="bg-surface rounded-md p-5 shadow-sm border border-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted">
                    {new Date(r.created_at).toLocaleString()} · {r.first_name}
                    {r.city ? ` · ${r.city}` : ""}{r.role_context ? ` · ${r.role_context}` : ""}
                  </p>
                  <p className="mt-2 font-heading text-fg whitespace-pre-wrap leading-relaxed">
                    {r.response_text}
                  </p>
                  <p className="mt-2 text-xs text-subtle font-body uppercase tracking-wide-x">
                    {r.reading_status?.replace("_", " ")} · {r.source} · consent: {r.consent_publish ? "yes" : "no"}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-body">
                  <input
                    type="checkbox"
                    checked={r.approved_for_site}
                    onChange={(e) => toggleApproved(r.id, e.target.checked)}
                    disabled={!r.consent_publish}
                    className="accent-[var(--accent-primary)]"
                  />
                  <span>Publish</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
