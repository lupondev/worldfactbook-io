"use client";

export function AdminSignOutLink() {
  return (
    <button
      type="button"
      className="font-mono text-xs text-muted underline decoration-dotted hover:text-cream"
      onClick={async () => {
        await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
        window.location.href = "/admin/login";
      }}
    >
      Sign out
    </button>
  );
}
