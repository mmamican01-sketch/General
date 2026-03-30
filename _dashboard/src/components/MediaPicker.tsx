"use client";

import { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { getAstroSiteUrl } from "@/lib/astro-url";

type MediaItem = { path: string; type: string };

export function MediaPicker({
  value,
  onChange,
  label = "Select image",
}: {
  value: string;
  onChange: (path: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = () => {
    setLoadingMedia(true);
    fetch("/api/media")
      .then(async (res) => {
        const data = await res.json();
        const files: Array<{ path: string }> = data.files || [];
        const items: MediaItem[] = files.map((f) => ({ path: f.path, type: "image" }));
        setMedia(items);
      })
      .catch(() => setMedia([]))
      .finally(() => setLoadingMedia(false));
  };

  useEffect(() => {
    if (open) loadMedia();
  }, [open]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/media", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.file?.path) {
        onChange(data.file.path);
        loadMedia();
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const images = media;

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <div className="row" style={{ marginBottom: 8, gap: 8 }}>
        <button type="button" className="button secondary" onClick={() => setOpen(true)}>
          {label}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {value && (
          <button
            type="button"
            className="button secondary"
            onClick={() => navigator.clipboard.writeText(value)}
          >
            Copy URL
          </button>
        )}
      </div>
      {value && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={value.startsWith("/") ? `${getAstroSiteUrl()}${value}` : value}
            alt="Preview"
            style={{ maxWidth: 120, maxHeight: 80, objectFit: "contain", border: "1px solid var(--line)", borderRadius: 6 }}
          />
        </div>
      )}
      <input
        type="text"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/assets/figma/..."
      />

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
            }}
          />
          <Dialog.Content
            className="media-picker-dialog"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--card)",
              borderRadius: 12,
              padding: 24,
              maxHeight: "80vh",
              overflow: "auto",
              zIndex: 9999,
            }}
          >
            <Dialog.Title style={{ margin: "0 0 16px", fontSize: 18 }}>Select image</Dialog.Title>
            <p className="muted" style={{ margin: "0 0 16px", fontSize: 13 }}>
              جميع الصور من قسم Media. الصور المرفوعة هنا تُحفظ تلقائياً في قسم Media.
            </p>
            {loadingMedia ? (
              <p className="muted">Loading…</p>
            ) : images.length === 0 ? (
              <p className="muted">لا توجد صور. استخدم "Upload image" لرفع صورة.</p>
            ) : (
            <div
              className="media-picker-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {images.map((m) => (
                <button
                  key={m.path}
                  type="button"
                  onClick={() => {
                    const path = m.path.startsWith("/") ? m.path : `/${m.path.replace(/^public\//, "")}`;
                    onChange(path);
                    setOpen(false);
                  }}
                  style={{
                    padding: 8,
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={m.path.startsWith("/") ? `${getAstroSiteUrl()}${m.path}` : `${getAstroSiteUrl()}/${m.path.replace(/^public\//, "")}`}
                    alt=""
                    style={{ width: "100%", height: 60, objectFit: "contain" }}
                  />
                  <div className="muted" style={{ fontSize: 10, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m.path.split("/").pop()}
                  </div>
                </button>
              ))}
            </div>
            )}
            <div style={{ marginTop: 16 }}>
              <Dialog.Close asChild>
                <button type="button" className="button secondary">
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
