// Astro site URL - uses production URL in production, localhost in development
export function getAstroSiteUrl(): string {
  // In production, use the live site URL
  if (process.env.NODE_ENV === "production") {
    return "https://afgtglobal.com";
  }
  
  // In development, use current host when accessed via internal IP (LAN)
  // On client: protocol + hostname + :4321 (works when dashboard opened via 192.168.x.x:3100)
  // On server: localhost:4321
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:4321`;
  }
  return "http://localhost:4321";
}
