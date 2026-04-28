import { Suspense } from "react";

import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
          <p className="font-mono text-sm text-muted">Loading…</p>
        </main>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}
