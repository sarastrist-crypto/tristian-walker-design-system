import { AuthGate } from "@/admin/AuthGate";
import { ResponsesTable } from "@/admin/ResponsesTable";

export function Admin() {
  return (
    <AuthGate>
      {() => (
        <main className="min-h-screen bg-base">
          <ResponsesTable />
        </main>
      )}
    </AuthGate>
  );
}
