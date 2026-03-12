"use client";

import { useEffect, useRef } from "react";
import { getAstroSiteUrl } from "@/lib/astro-url";

type LivePreviewProps = {
  url: string;
  currentRoute?: string;
  currentCollection?: string;
  currentSlug?: string;
};

export function LivePreview({ url, currentRoute, currentCollection, currentSlug }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const es = new EventSource("/api/live");
    es.addEventListener("content-updated", (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data);
        let shouldReload = false;

        if (data.type === "page" && currentRoute) {
          const pagePath = data.key === "index" ? "/en/" : `/en/${data.key.replace(/__/g, "/")}`;
          if (url.includes(pagePath) || url === `${getAstroSiteUrl()}${pagePath}`) {
            shouldReload = true;
          }
        }

        if (data.type === "collection" && currentCollection && currentSlug) {
          if (data.collection === currentCollection && data.slug === currentSlug) {
            shouldReload = true;
          }
        }

        if (shouldReload && iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
      } catch {}
    });

    return () => es.close();
  }, [url, currentRoute, currentCollection, currentSlug]);

  return (
    <iframe
      ref={iframeRef}
      src={url}
      title="Live Preview"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        minHeight: 400,
      }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
