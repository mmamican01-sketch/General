import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

export default function GlobalsPage() {
  return (
    <DashboardShell breadcrumbs={["Globals"]}>
      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <h1 className="title" style={{ margin: 0 }}>
            Globals
          </h1>
          <Link className="button secondary" href="/">
            Back
          </Link>
        </div>

        <div className="grid grid-3">
          <Link className="card" href="/globals/header" style={{ display: "block" }}>
          <h2 style={{ marginTop: 0 }}>Header</h2>
          <p className="muted">Edit `src/content-store/en/globals/header.json`</p>
        </Link>
        <Link className="card" href="/globals/footer" style={{ display: "block" }}>
          <h2 style={{ marginTop: 0 }}>Footer</h2>
          <p className="muted">Edit `src/content-store/en/globals/footer.json`</p>
        </Link>
      </div>
    </div>
    </DashboardShell>
  );
}
