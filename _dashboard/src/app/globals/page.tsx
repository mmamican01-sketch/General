export default function GlobalsPage() {
  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h1 className="title" style={{ margin: 0 }}>
          Globals
        </h1>
        <a className="button secondary" href="/">
          Back
        </a>
      </div>

      <div className="grid grid-3">
        <a className="card" href="/globals/header">
          <h2 style={{ marginTop: 0 }}>Header</h2>
          <p className="muted">Edit `src/content-store/en/globals/header.json`</p>
        </a>
        <a className="card" href="/globals/footer">
          <h2 style={{ marginTop: 0 }}>Footer</h2>
          <p className="muted">Edit `src/content-store/en/globals/footer.json`</p>
        </a>
      </div>
    </div>
  );
}
