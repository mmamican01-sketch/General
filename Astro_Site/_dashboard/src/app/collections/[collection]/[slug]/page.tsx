"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { DashboardShell } from "@/components/DashboardShell";
import { LivePreview } from "@/components/LivePreview";
import { SchemaFormField } from "@/components/SchemaFormField";
import { MediaPicker } from "@/components/MediaPicker";
import { getAstroSiteUrl } from "@/lib/astro-url";

type CollectionDoc = Record<string, unknown>;

export default function CollectionItemEditor() {
  const params = useParams<{ collection: string; slug: string }>();
  const collection = params?.collection ?? "";
  const slug = params?.slug ?? "";

  const [doc, setDoc] = useState<CollectionDoc | null>(null);
  const [schema, setSchema] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const previewUrl = `/en/${collection}/${slug}`;

  const load = useCallback(() => {
    if (!collection || !slug) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/content?collection=${encodeURIComponent(collection)}&slug=${encodeURIComponent(slug)}&locale=en`),
      fetch("/api/index"),
    ])
      .then(async ([contentRes, indexRes]) => {
        const data = await contentRes.json();
        const index = await indexRes.json();
        setDoc(data);
        setError(null);
        const coll = (index.collections || []).find((c: { collection: string }) => c.collection === collection);
        const itemSchema = coll?.items?.find((i: { slug: string }) => i.slug === slug)?.schema || coll?.items?.[0]?.schema || {};
        setSchema(itemSchema);
      })
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [collection, slug]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    if (!doc || !collection || !slug) return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch(`/api/content?collection=${encodeURIComponent(collection)}&slug=${encodeURIComponent(slug)}&locale=en`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("saved");
      } else {
        setStatus("unsaved");
        const errMsg = Array.isArray(data.error) ? data.error.join("; ") : (data.error || data.message || `Save failed (${res.status})`);
        setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
      }
    } catch (err) {
      setStatus("unsaved");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }, [doc, collection, slug]);

  const update = useCallback((fieldKey: string, value: unknown) => {
    setDoc((d) => (d ? { ...d, [fieldKey]: value } : null));
    setStatus("unsaved");
    setError(null);
  }, []);

  const allFieldKeys = Object.keys({ ...schema, ...doc }).filter((k) => k !== "slug");

  if (!collection || !slug) return null;

  return (
    <DashboardShell
      breadcrumbs={["Collections", collection, slug]}
      status={status}
      previewUrl={previewUrl}
    >
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: "0 0 420px", overflow: "auto", borderRight: "1px solid var(--line)" }}>
          <div className="container" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Link className="button secondary" href={`/collections/${collection}`}>
                ← Back
              </Link>
            </div>

            {error && (
              <div style={{ padding: 12, marginBottom: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#b91c1c" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="card">Loading…</div>
            ) : doc ? (
              <Tabs.Root defaultValue="content">
                <Tabs.List style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  <Tabs.Trigger value="content" style={{ padding: "8px 16px", border: "1px solid var(--line)", background: "transparent", borderRadius: 6, cursor: "pointer" }}>
                    Content
                  </Tabs.Trigger>
                  <Tabs.Trigger value="seo" style={{ padding: "8px 16px", border: "1px solid var(--line)", background: "transparent", borderRadius: 6, cursor: "pointer" }}>
                    SEO
                  </Tabs.Trigger>
                  <Tabs.Trigger value="media" style={{ padding: "8px 16px", border: "1px solid var(--line)", background: "transparent", borderRadius: 6, cursor: "pointer" }}>
                    Media
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="content">
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>Basic Info</div>
                  {["title", "description"].map((fieldKey) =>
                    allFieldKeys.includes(fieldKey) ? (
                      <SchemaFormField
                        key={fieldKey}
                        fieldKey={fieldKey}
                        fieldType={schema[fieldKey] ?? "string"}
                        value={doc[fieldKey]}
                        onChange={(v) => update(fieldKey, v)}
                      />
                    ) : null
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Overview</div>
                  {["overview"].map((fieldKey) =>
                    allFieldKeys.includes(fieldKey) ? (
                      <SchemaFormField
                        key={fieldKey}
                        fieldKey={fieldKey}
                        fieldType={schema[fieldKey] ?? "string"}
                        value={doc[fieldKey]}
                        onChange={(v) => update(fieldKey, v)}
                      />
                    ) : null
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Specifications</div>
                  {["specifications"].map((fieldKey) =>
                    allFieldKeys.includes(fieldKey) ? (
                      <SchemaFormField
                        key={fieldKey}
                        fieldKey={fieldKey}
                        fieldType={schema[fieldKey] ?? "string"}
                        value={doc[fieldKey]}
                        onChange={(v) => update(fieldKey, v)}
                      />
                    ) : null
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Origins & Certifications</div>
                  {["origins", "certifications"].map((fieldKey) =>
                    allFieldKeys.includes(fieldKey) ? (
                      <SchemaFormField
                        key={fieldKey}
                        fieldKey={fieldKey}
                        fieldType={schema[fieldKey] ?? "string"}
                        value={doc[fieldKey]}
                        onChange={(v) => update(fieldKey, v)}
                      />
                    ) : null
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Call to Action</div>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: "0 0 8px" }}>CTA</h4>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Label</label>
                    <input
                      className="input"
                      value={(doc.cta as { label?: string })?.label ?? ""}
                      onChange={(e) =>
                        update("cta", {
                          ...((doc.cta as object) || {}),
                          label: e.target.value,
                        })
                      }
                      style={{ marginBottom: 8 }}
                    />
                    <label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Link</label>
                    <input
                      className="input"
                      value={(doc.cta as { href?: string })?.href ?? ""}
                      onChange={(e) =>
                        update("cta", {
                          ...((doc.cta as object) || {}),
                          href: e.target.value,
                        })
                      }
                    />
                  </div>
                </Tabs.Content>

                <Tabs.Content value="seo">
                  <div className="card" style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Meta Title</label>
                    <input
                      className="input"
                      value={(doc.seo as { title?: string })?.title ?? ""}
                      onChange={(e) => update("seo", { ...((doc.seo as object) || {}), title: e.target.value })}
                    />
                  </div>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Meta Description</label>
                    <textarea
                      className="textarea"
                      rows={3}
                      value={(doc.seo as { description?: string })?.description ?? ""}
                      onChange={(e) => update("seo", { ...((doc.seo as object) || {}), description: e.target.value })}
                    />
                  </div>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>OG Image</label>
                    <MediaPicker
                      value={(doc.seo as { image?: string })?.image ?? ""}
                      onChange={(v) => update("seo", { ...((doc.seo as object) || {}), image: v })}
                    />
                  </div>
                </Tabs.Content>

                <Tabs.Content value="media">
                  {allFieldKeys
                    .filter((k) => ["heroImage", "heroimage"].includes(k.toLowerCase()) || (schema[k] || "").toLowerCase().includes("url") || (schema[k] || "").toLowerCase().includes("image"))
                    .map((fieldKey) => (
                      <SchemaFormField
                        key={fieldKey}
                        fieldKey={fieldKey}
                        fieldType={schema[fieldKey] ?? "string(url)"}
                        value={doc[fieldKey]}
                        onChange={(v) => update(fieldKey, v)}
                      />
                    ))}
                  {!allFieldKeys.some((k) => k.toLowerCase() === "heroimage") && (
                    <SchemaFormField
                      fieldKey="heroImage"
                      fieldType="string(url)"
                      value={doc.heroImage}
                      onChange={(v) => update("heroImage", v)}
                    />
                  )}
                </Tabs.Content>
              </Tabs.Root>
            ) : (
              <div className="card">Failed to load content.</div>
            )}

            {doc && (
              <button type="button" className="button" onClick={save} style={{ marginTop: 16, width: "100%" }}>
                Save
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: 16 }}>
          <LivePreview
            url={`${getAstroSiteUrl()}${previewUrl}`}
            currentCollection={collection}
            currentSlug={slug}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
