"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";

type CollectionItem = { slug: string; file: string };

export default function CollectionItemsPage() {
  const params = useParams<{ collection: string }>();
  const router = useRouter();
  const collection = params?.collection ?? "";
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const canCreate = ["insights", "products"].includes(collection);

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

  async function handleCreate() {
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
    if (!slug) {
      setCreateError("Enter a valid slug (e.g. my-new-insight)");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNewSlug("");
        router.push(`/collections/${collection}/${slug}`);
      } else {
        setCreateError(data.error || Array.isArray(data.error) ? data.error.join("; ") : "Failed to create");
      }
    } catch {
      setCreateError("Failed to create");
    } finally {
      setCreating(false);
    }
  }

  return (
    <DashboardShell breadcrumbs={["Collections", collection]}>
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="title" style={{ margin: 0 }}>{collection}</h1>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <Link className="button secondary" href="/collections">
            Back
          </Link>
        </div>

        {canCreate && (
          <div className="card" style={{ marginBottom: 24 }}>
            <label className="field-label" htmlFor="new-collection-slug">Create new</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input
                id="new-collection-slug"
                className="input"
                placeholder="Slug (e.g. my-new-insight)"
                value={newSlug}
                onChange={(e) => { setNewSlug(e.target.value); setCreateError(null); }}
                style={{ flex: "1 1 200px", minWidth: 180 }}
              />
              <button className="button" onClick={handleCreate} disabled={creating}>
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
            {createError && <div style={{ marginTop: 8, fontSize: 13, color: "var(--color-error)" }}>{createError}</div>}
          </div>
        )}

        {loading ? (
          <div className="card">Loading…</div>
        ) : items.length === 0 ? (
          <div className="card empty-state">
            <h3>No items yet</h3>
            <p>{canCreate ? "Create an item above to get started." : "This collection is empty."}</p>
          </div>
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
