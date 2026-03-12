"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

type CollectionInfo = {
  collection: string;
  route: string;
  items: Array<{ slug: string; file: string }>;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/index")
      .then((r) => r.json())
      .then((data) => {
        setCollections(data.collections || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell breadcrumbs={["Collections"]}>
      <div className="container">
        <h1 className="title">Collections</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Dynamic content from <code>src/content-store/collections/</code>
        </p>

        {loading ? (
          <div className="card">Loading…</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {collections.map((c) => (
              <Link
                key={c.collection}
                href={`/collections/${c.collection}`}
                className="card"
                style={{ display: "block" }}
              >
                <h3 style={{ marginTop: 0 }}>{c.collection}</h3>
                <p className="muted" style={{ margin: "4px 0", fontSize: 13 }}>
                  {c.items.length} items
                </p>
                <code style={{ fontSize: 11, color: "var(--muted)" }}>{c.route}</code>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
