import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

export default function Home() {
  return (
    <DashboardShell>
      <div className="container">
        <h1 className="title">AFGT Dashboard</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Manage content that syncs live with Astro. Uses Astro dev server for instant reflection.
        </p>

        <div className="grid grid-3">
          <Link className="card" href="/pages" style={{ display: "block" }}>
            <h2 style={{ marginTop: 0 }}>Pages</h2>
            <p className="muted">Edit static page slots</p>
          </Link>
          <Link className="card" href="/collections" style={{ display: "block" }}>
            <h2 style={{ marginTop: 0 }}>Collections</h2>
            <p className="muted">Edit products, commodities, etc.</p>
          </Link>
          <Link className="card" href="/globals" style={{ display: "block" }}>
            <h2 style={{ marginTop: 0 }}>Globals</h2>
            <p className="muted">Header & footer</p>
          </Link>
          <Link className="card" href="/media" style={{ display: "block" }}>
            <h2 style={{ marginTop: 0 }}>Media</h2>
            <p className="muted">Upload assets</p>
          </Link>
        </div>

        <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
          Run <code>npm run dev:all</code> from Astro_Site to start both Astro (4321) and Dashboard (3100).
        </p>
      </div>
    </DashboardShell>
  );
}
