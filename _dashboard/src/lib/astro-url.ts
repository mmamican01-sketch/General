// Astro site URL - uses current host when accessed via internal IP (LAN)
// On client: protocol + hostname + :4321 (works when dashboard opened via 192.168.x.x:3100)
// On server: localhost:4321
export function getAstroSiteUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:4321`;
  }
  return "http://localhost:4321";
}
