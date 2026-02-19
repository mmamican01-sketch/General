"use client";

import { getAstroSiteUrl } from "@/lib/astro-url";
import { SidebarNav } from "./SidebarNav";

export function DashboardShell({
  children,
  breadcrumbs,
  status,
  previewUrl,
}: {
  children: React.ReactNode;
  breadcrumbs?: string[];
  status?: "saved" | "unsaved" | "saving";
  previewUrl?: string;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarNav />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            borderBottom: "1px solid var(--line)",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--card)",
          }}
        >
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            {breadcrumbs?.map((b, i) => (
              <span key={i}>
                {i > 0 && <span style={{ color: "var(--muted)", margin: "0 4px" }}>/</span>}
                {b}
              </span>
            )) ?? <span>Dashboard</span>}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {status && (
              <span
                style={{
                  fontSize: 12,
                  color:
                    status === "saved"
                      ? "#059669"
                      : status === "saving"
                      ? "#d97706"
                      : "#b91c1c",
                }}
              >
                {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Unsaved"}
              </span>
            )}
            {previewUrl && (
              <a
                href={`${getAstroSiteUrl()}${previewUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  padding: "6px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                }}
              >
                Open in site
              </a>
            )}
          </div>
        </header>

        <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      </main>
    </div>
  );
}
