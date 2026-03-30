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
  const [showPreview, setShowPreview] = useState(true);
  const [savedAt, setSavedAt] = useState<string>("");

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
        setSavedAt(new Date().toLocaleTimeString());
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
  const isProductsCollection = collection.toLowerCase() === "products";
  const productContentFieldOrder = [
    "title",
    "description",
    "overview",
    "specifications",
    "origins",
    "certifications",
    "cta",
  ];
  const seoFieldKeys = ["seo", "seoTitle", "seoDescription", "ogImage"];
  const genericContentFieldKeys = allFieldKeys.filter(
    (fieldKey) => !seoFieldKeys.includes(fieldKey)
  );

  if (!collection || !slug) return null;

  return (
    <DashboardShell
      breadcrumbs={["Collections", collection, slug]}
      status={status}
      previewUrl={previewUrl}
    >
      <div className="editor-layout">
        <div className="editor-form">
          <div className="container" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Link className="button secondary" href={`/collections/${collection}`}>
                ← Back
              </Link>
            </div>

            {error && (
              <div style={{ padding: 12, marginBottom: 16, background: "#fef2f2", border: "1px solid var(--color-error)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--color-error)" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="card">Loading…</div>
            ) : doc ? (
              <Tabs.Root defaultValue="content">
                <Tabs.List className="editor-tabs">
                  <Tabs.Trigger value="content" className="editor-tab">
                    Content
                  </Tabs.Trigger>
                  <Tabs.Trigger value="seo" className="editor-tab">
                    SEO
                  </Tabs.Trigger>
                  <Tabs.Trigger value="media" className="editor-tab">
                    Media
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="content">
                  {isProductsCollection ? (
                    <>
                      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>Product Content</div>
                      {productContentFieldOrder
                        .filter((fieldKey) => allFieldKeys.includes(fieldKey))
                        .map((fieldKey) =>
                          fieldKey === "cta" ? (
                            <div className="card" style={{ marginBottom: 16 }} key="cta">
                              <h4 style={{ margin: "0 0 8px" }}>CTA</h4>
                              <label className="field-label" htmlFor="cta-label">Label</label>
                              <input
                                id="cta-label"
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
                              <label className="field-label" htmlFor="cta-link">Link</label>
                              <input
                                id="cta-link"
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
                          ) : (
                            <SchemaFormField
                              key={fieldKey}
                              fieldKey={fieldKey}
                              fieldType={schema[fieldKey] ?? "string"}
                              value={doc[fieldKey]}
                              onChange={(v) => update(fieldKey, v)}
                            />
                          )
                        )}
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>Collection Content</div>
                      {genericContentFieldKeys.map((fieldKey) => (
                        <SchemaFormField
                          key={fieldKey}
                          fieldKey={fieldKey}
                          fieldType={schema[fieldKey] ?? "string"}
                          value={doc[fieldKey]}
                          onChange={(v) => update(fieldKey, v)}
                        />
                      ))}
                    </>
                  )}
                </Tabs.Content>

                <Tabs.Content value="seo">
                  {allFieldKeys.includes("seo") ? (
                    <>
                      <div className="card" style={{ marginBottom: 16 }}>
                        <label className="field-label" htmlFor="coll-seo-title">Meta Title</label>
                        <input
                          id="coll-seo-title"
                          className="input"
                          value={(doc.seo as { title?: string })?.title ?? ""}
                          onChange={(e) => update("seo", { ...((doc.seo as object) || {}), title: e.target.value })}
                        />
                      </div>
                      <div className="card" style={{ marginBottom: 16 }}>
                        <label className="field-label" htmlFor="coll-seo-desc">Meta Description</label>
                        <textarea
                          id="coll-seo-desc"
                          className="textarea"
                          rows={3}
                          value={(doc.seo as { description?: string })?.description ?? ""}
                          onChange={(e) => update("seo", { ...((doc.seo as object) || {}), description: e.target.value })}
                        />
                      </div>
                      <div className="card" style={{ marginBottom: 16 }}>
                        <label className="field-label">OG Image</label>
                        <MediaPicker
                          value={(doc.seo as { image?: string })?.image ?? ""}
                          onChange={(v) => update("seo", { ...((doc.seo as object) || {}), image: v })}
                        />
                      </div>
                    </>
                  ) : null}
                  {["seoTitle", "seoDescription", "ogImage"]
                    .filter((fieldKey) => allFieldKeys.includes(fieldKey))
                    .map((fieldKey) => (
                      <SchemaFormField
                        key={fieldKey}
                        fieldKey={fieldKey}
                        fieldType={schema[fieldKey] ?? (fieldKey === "ogImage" ? "string(url)" : "string")}
                        value={doc[fieldKey]}
                        onChange={(v) => update(fieldKey, v)}
                      />
                    ))}
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
                  {isProductsCollection && !allFieldKeys.some((k) => k.toLowerCase() === "heroimage") && (
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
              <>
                <div className="editor-save">
                  <button
                    type="button"
                    className={`button${status === "saving" ? " button-saving" : ""}`}
                    onClick={save}
                    disabled={status === "saving" || status === "saved"}
                    style={{ width: "100%" }}
                  >
                    {status === "saving" ? "Saving…" : "Save"}
                  </button>
                  <p className="editor-note">
                    التغييرات تُنشر على الموقع فقط عند الضغط على Save. بعد الحفظ، انتظر ~15 ثانية لإعادة البناء.
                  </p>
                  {savedAt && <p className="save-meta">Last saved at {savedAt}</p>}
                </div>
                <button
                  type="button"
                  className="button secondary preview-toggle"
                  onClick={() => setShowPreview((v) => !v)}
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="editor-preview" style={{ display: showPreview ? undefined : "none" }}>
          <div className="preview-frame">
            <div className="preview-header">Live Preview</div>
            <LivePreview
              url={`${getAstroSiteUrl()}${previewUrl}`}
              currentCollection={collection}
              currentSlug={slug}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
