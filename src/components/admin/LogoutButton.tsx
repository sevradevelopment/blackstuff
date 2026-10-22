"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="rounded-full border border-forest/20 px-3 py-1.5 text-sm text-forest hover:bg-sand"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      Logi välja
    </button>
  );
}

export { LogoutButton as AdminLogoutButton };
