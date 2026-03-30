"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1280) setCollapsed(true);

    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = () => {
      if (mq.matches) setIsMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <SidebarNav
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        isOverlay={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header className="sticky-header dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <nav className="breadcrumb">
              <span>Dashboard</span>
              {breadcrumbs?.map((b, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="breadcrumb-sep">/</span>
                  <span className={i === breadcrumbs.length - 1 ? "breadcrumb-current" : ""}>
                    {b}
                  </span>
                </span>
              ))}
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {status && (
              <span
                style={{
                  fontSize: 12,
                  color:
                    status === "saved"
                      ? "var(--color-success)"
                      : status === "saving"
                      ? "var(--color-warning)"
                      : "var(--color-error)",
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
                className={status && status !== "saved" ? "preview-link-warning" : undefined}
                title={status && status !== "saved" ? "You have unsaved changes" : undefined}
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
