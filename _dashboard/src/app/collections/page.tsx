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
        <div className="page-header">
          <div>
            <h1 className="title" style={{ margin: 0 }}>Collections</h1>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
              Dynamic content from <code>src/content-store/collections/</code>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card">Loading…</div>
        ) : collections.length === 0 ? (
          <div className="card empty-state">
            <h3>No collections found</h3>
            <p>Add a collection folder to <code>src/content-store/collections/</code> to get started.</p>
          </div>
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
