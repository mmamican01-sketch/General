import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

export default function GlobalsPage() {
  return (
    <DashboardShell breadcrumbs={["Globals"]}>
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="title" style={{ margin: 0 }}>Globals</h1>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>Site-wide header and footer</p>
          </div>
          <Link className="button secondary" href="/">
            Back
          </Link>
        </div>

        <div className="grid grid-3">
          <Link className="card" href="/globals/header" style={{ display: "block" }}>
            <h2 style={{ marginTop: 0 }}>Header</h2>
            <p className="muted">Edit header.json</p>
          </Link>
          <Link className="card" href="/globals/footer" style={{ display: "block" }}>
            <h2 style={{ marginTop: 0 }}>Footer</h2>
            <p className="muted">Edit footer.json</p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
