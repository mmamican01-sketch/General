/**
 * Returns the base path from Astro config (e.g. '' for root, '/General' for GitHub Pages).
 * Use when building hrefs so they work with base path deployments.
 */
export function getBasePath(): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

/** Builds an href with the correct base path for the current deployment. */
export function withBase(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }
  const base = getBasePath();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
