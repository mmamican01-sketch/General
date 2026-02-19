"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";

type CollectionItem = { slug: string; file: string };

export default function CollectionItemsPage() {
  const params = useParams<{ collection: string }>();
  const collection = params?.collection ?? "";
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collection) return;
    fetch("/api/index")
      .then((r) => r.json())
      .then((data) => {
        const coll = (data.collections || []).find((c: { collection: string }) => c.collection === collection);
        setItems(coll?.items || []);
      })
      .finally(() => setLoading(false));
  }, [collection]);

  return (
    <DashboardShell breadcrumbs={["Collections", collection]}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 className="title" style={{ margin: 0 }}>
            {collection}
          </h1>
          <Link className="button secondary" href="/collections">
            Back
          </Link>
        </div>

        {loading ? (
          <div className="card">Loading…</div>
        ) : (
          <ul className="list">
            {items.map((item) => (
              <li key={item.slug}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <strong>{item.slug}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>{item.file}</div>
                  </div>
                  <Link className="button secondary" href={`/collections/${collection}/${item.slug}`}>
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}
