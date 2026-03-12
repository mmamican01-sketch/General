"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

type PageItem = { key: string; path: string };
type CollectionItem = { slug: string; file: string };
type Collection = { collection: string; route: string; items: CollectionItem[] };
type IndexData = { pages?: PageItem[]; collections?: Collection[] };

export function SidebarNav() {
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

  return (
    <aside
      style={{
        width: 260,
        borderRight: "1px solid var(--line)",
        background: "var(--card)",
        padding: "16px 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link href="/" style={{ padding: "0 20px 16px", display: "block", fontWeight: 600, fontSize: 18 }}>
        AFGT Dashboard
      </Link>

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
              padding: "8px 12px 8px 36px",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              fontSize: 13,
              background: "var(--bg)",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ padding: "4px 20px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
            Content
          </div>
          <Link
            href="/pages"
            style={{
              display: "block",
              padding: "8px 20px",
              fontSize: 14,
              color: isActive("/pages") ? "var(--brand)" : "var(--text)",
              background: isActive("/pages") ? "rgba(17,24,39,0.06)" : "transparent",
            }}
          >
            Pages
          </Link>
          {pages.length > 0 && (
            <div style={{ paddingLeft: 12 }}>
              {pages.slice(0, 8).map((p) => (
                <Link
                  key={p.key}
                  href={`/pages/${p.key}`}
                  style={{
                    display: "block",
                    padding: "6px 12px",
                    fontSize: 13,
                    color: isActive(`/pages/${p.key}`) ? "var(--brand)" : "var(--muted)",
                    background: isActive(`/pages/${p.key}`) ? "rgba(17,24,39,0.06)" : "transparent",
                  }}
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
            style={{
              width: "100%",
              padding: "8px 20px",
              fontSize: 14,
              textAlign: "left",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--text)",
            }}
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
                    style={{
                      width: "100%",
                      padding: "6px 12px",
                      fontSize: 13,
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--muted)",
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ fontSize: 10 }}>{isCollExpanded ? "▼" : "▶"}</span>
                    {c.collection}
                  </button>
                  {isCollExpanded &&
                    filteredItems.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/collections/${c.collection}/${item.slug}`}
                        style={{
                          display: "block",
                          padding: "6px 12px 6px 24px",
                          fontSize: 13,
                          color: isActive(`/collections/${c.collection}/${item.slug}`) ? "var(--brand)" : "var(--muted)",
                          background: isActive(`/collections/${c.collection}/${item.slug}`) ? "rgba(17,24,39,0.06)" : "transparent",
                        }}
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
            style={{
              display: "block",
              padding: "8px 20px",
              fontSize: 14,
              color: isActive("/globals") ? "var(--brand)" : "var(--text)",
              background: isActive("/globals") ? "rgba(17,24,39,0.06)" : "transparent",
            }}
          >
            Globals
          </Link>
          <Link
            href="/media"
            style={{
              display: "block",
              padding: "8px 20px",
              fontSize: 14,
              color: isActive("/media") ? "var(--brand)" : "var(--text)",
              background: isActive("/media") ? "rgba(17,24,39,0.06)" : "transparent",
            }}
          >
            Media
          </Link>
        </div>
      </div>
    </aside>
  );
}
