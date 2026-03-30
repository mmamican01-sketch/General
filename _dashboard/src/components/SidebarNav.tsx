"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronsLeft, ChevronsRight, X } from "lucide-react";

type PageItem = { key: string; path: string };
type CollectionItem = { slug: string; file: string };
type Collection = { collection: string; route: string; items: CollectionItem[] };
type IndexData = { pages?: PageItem[]; collections?: Collection[] };

type SidebarNavProps = {
  collapsed?: boolean;
  onToggle?: () => void;
  isOverlay?: boolean;
  onClose?: () => void;
};

export function SidebarNav({
  collapsed = false,
  onToggle,
  isOverlay = false,
  onClose,
}: SidebarNavProps) {
  const pathname = usePathname();
  const [index, setIndex] = useState<IndexData | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ collections: true });

  useEffect(() => {
    fetch("/api/index")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex({ pages: [], collections: [] }));
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const matchesSearch = (text: string) => {
    if (!search.trim()) return true;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  const pages = (index?.pages || []).filter((p) => matchesSearch(p.key));
  const collections = (index?.collections || []).filter((c) =>
    matchesSearch(c.collection) || c.items.some((i) => matchesSearch(i.slug))
  );

  const toggle = (key: string) => {
    setExpanded((e) => ({ ...e, [key]: !e[key] }));
  };

  const isRail = collapsed && !isOverlay;

  const sidebarClass = [
    "sidebar",
    isRail ? "sidebar-collapsed" : "",
    isOverlay ? "sidebar-overlay" : "",
  ].filter(Boolean).join(" ");

  const handleNavClick = () => {
    if (isOverlay && onClose) onClose();
  };

  return (
    <aside className={sidebarClass}>
      <div style={{ padding: "0 12px 16px", display: "flex", alignItems: "center", justifyContent: isRail ? "center" : "space-between" }}>
        {isRail ? (
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggle}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronsRight size={16} />
          </button>
        ) : (
          <>
            <Link href="/" style={{ fontWeight: 600, fontSize: 18, padding: "0 8px" }} onClick={handleNavClick}>
              AFGT Dashboard
            </Link>
            {isOverlay ? (
              <button
                type="button"
                className="sidebar-collapse-btn"
                onClick={onClose}
                title="Close"
                aria-label="Close navigation"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="sidebar-collapse-btn"
                onClick={onToggle}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {!isRail && (
        <div style={{ padding: "0 20px 12px" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                minHeight: 44,
                padding: "8px 12px 8px 36px",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                fontSize: 13,
                background: "var(--bg)",
              }}
            />
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflow: "auto" }}>
        {isRail ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0" }}>
            <Link
              href="/pages"
              className="sidebar-link"
              data-active={isActive("/pages").toString()}
              title="Pages"
              onClick={handleNavClick}
            >
              P
            </Link>
            <Link
              href="/collections"
              className="sidebar-link"
              data-active={isActive("/collections").toString()}
              title="Collections"
              onClick={handleNavClick}
            >
              C
            </Link>
            <Link
              href="/globals"
              className="sidebar-link"
              data-active={isActive("/globals").toString()}
              title="Globals"
              onClick={handleNavClick}
            >
              G
            </Link>
            <Link
              href="/media"
              className="sidebar-link"
              data-active={isActive("/media").toString()}
              title="Media"
              onClick={handleNavClick}
            >
              M
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ padding: "4px 20px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
                Content
              </div>
              <Link
                href="/pages"
                className="sidebar-link"
                data-active={isActive("/pages").toString()}
                onClick={handleNavClick}
              >
                Pages
              </Link>
              {pages.length > 0 && (
                <div style={{ paddingLeft: 12 }}>
                  {pages.slice(0, 8).map((p) => (
                    <Link
                      key={p.key}
                      href={`/pages/${p.key}`}
                      className="sidebar-sub"
                      data-active={isActive(`/pages/${p.key}`).toString()}
                      onClick={handleNavClick}
                    >
                      {p.key}
                    </Link>
                  ))}
                  {pages.length > 8 && (
                    <div style={{ padding: "4px 12px", fontSize: 12, color: "var(--muted)" }}>
                      +{pages.length - 8} more
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => toggle("collections")}
                className="sidebar-toggle"
              >
                <span style={{ fontSize: 10 }}>{expanded.collections ? "▼" : "▶"}</span>
                Collections
              </button>
              {expanded.collections &&
                collections.map((c) => {
                  const collKey = `coll-${c.collection}`;
                  const isCollExpanded = expanded[collKey] ?? true;
                  const filteredItems = c.items.filter((i) => matchesSearch(i.slug));
                  return (
                    <div key={c.collection} style={{ marginLeft: 12 }}>
                      <button
                        type="button"
                        onClick={() => toggle(collKey)}
                        className="sidebar-coll-toggle"
                      >
                        <span style={{ fontSize: 10 }}>{isCollExpanded ? "▼" : "▶"}</span>
                        {c.collection}
                      </button>
                      {isCollExpanded &&
                        filteredItems.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/collections/${c.collection}/${item.slug}`}
                            className="sidebar-sub"
                            data-active={isActive(`/collections/${c.collection}/${item.slug}`).toString()}
                            style={{ paddingLeft: 24 }}
                            onClick={handleNavClick}
                          >
                            {item.slug}
                          </Link>
                        ))}
                    </div>
                  );
                })}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ padding: "4px 20px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
                Settings
              </div>
              <Link
                href="/globals"
                className="sidebar-link"
                data-active={isActive("/globals").toString()}
                onClick={handleNavClick}
              >
                Globals
              </Link>
              <Link
                href="/media"
                className="sidebar-link"
                data-active={isActive("/media").toString()}
                onClick={handleNavClick}
              >
                Media
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
