"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

type PageItem = {
  key: string;
  path: string;
  file: string;
  slots: Array<{ key: string; type: string }>;
};

export default function PagesListPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newKey, setNewKey] = useState("");

  const load = () => {
    fetch("/api/index")
      .then((r) => r.json())
      .then((data) => setPages(data.pages || []))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function createPage() {
    if (!newKey.trim()) return;
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey.trim() }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Failed to create");
    else {
      setNewKey("");
      load();
    }
  }

  return (
    <DashboardShell breadcrumbs={["Pages"]}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 className="title" style={{ margin: 0 }}>
            Pages
          </h1>
          <Link className="button secondary" href="/">
            Back
          </Link>
        </div>

        {error && <p style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</p>}

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="row">
            <input
              className="input"
              placeholder="New page key (e.g. my-page)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <button className="button" onClick={createPage}>
              Create
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card">Loading…</div>
        ) : (
          <div className="card">
            <ul className="list">
              {pages.map((p) => (
                <li key={p.key}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{p.key}</strong>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {p.path} • {p.slots.length} slots
                      </div>
                    </div>
                    <Link className="button secondary" href={`/pages/${p.key}`}>
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
