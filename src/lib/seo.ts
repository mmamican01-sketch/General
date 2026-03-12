const DEFAULT_SITE = "https://general-gjpn.vercel.app";

export function normalizeUrl(site: string | URL | undefined, path: string): string {
  const base = new URL(site?.toString() ?? DEFAULT_SITE);
  const rawPath = (path || "/").trim();

  let pathname = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  pathname = pathname.replace(/\/{2,}/g, "/");

  if (!pathname.endsWith("/")) {
    pathname = `${pathname}/`;
  }

  return new URL(pathname, base).toString();
}
