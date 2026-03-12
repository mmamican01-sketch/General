"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (open) {
      Promise.all([fetch("/api/index"), fetch("/api/media")])
        .then(async ([indexRes, mediaRes]) => {
          const index = await indexRes.json();
          const mediaApi = await mediaRes.json();
          const fromIndex: MediaItem[] = (index.media || []).filter((m: MediaItem) => m.type?.startsWith("image/"));
          const fromApi: MediaItem[] = (mediaApi.files || []).map((f: { path: string }) => ({ path: f.path, type: "image" }));
          const seen = new Set(fromIndex.map((m) => m.path));
          for (const m of fromApi) {
            if (!seen.has(m.path)) {
              seen.add(m.path);
              fromIndex.push(m);
            }
          }
          setMedia(fromIndex);
        })
        .catch(() => setMedia([]));
    }
  }, [open]);

  const images = media.filter((m) => m.type?.startsWith("image/") || !m.type);

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button type="button" className="button secondary" onClick={() => setOpen(true)}>
          {label}
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
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--card)",
              borderRadius: 12,
              padding: 24,
              maxWidth: 560,
              maxHeight: "80vh",
              overflow: "auto",
              zIndex: 9999,
            }}
          >
            <Dialog.Title style={{ margin: "0 0 16px", fontSize: 18 }}>Select image</Dialog.Title>
            <div
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
