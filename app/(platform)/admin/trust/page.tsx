import Link from "next/link";

import { TrustDashboardTabs } from "@/components/admin/trust/TrustDashboardTabs";
import { AdminSignOutLink } from "@/components/admin/trust/AdminSignOut";

export const dynamic = "force-dynamic";

export default function AdminTrustPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Admin</p>
          <h1 className="font-display text-4xl text-cream">Trust dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Decision engine observability: overview metrics, validation queue, change diffs, and audit trail.
          </p>
        </div>
        <AdminSignOutLink />
      </div>

      <div className="mt-8">
        <TrustDashboardTabs />
      </div>

      <p className="mt-12 font-mono text-xs text-muted">
        <Link href="/" className="text-gold hover:underline">
          ← Back to site
        </Link>
      </p>
    </main>
  );
}
