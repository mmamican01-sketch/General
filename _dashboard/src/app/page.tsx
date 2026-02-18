export default function Home() {
  return (
    <div className="container">
      <h1 className="title">AFGT Dashboard</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Manage EN page slots, globals, and media assets that write to Astro content-store.
      </p>

      <div className="grid grid-3">
        <a className="card" href="/pages">
          <h2 style={{ marginTop: 0 }}>Pages</h2>
          <p className="muted">Edit `src/content-store/en/pages/*.json`</p>
        </a>
        <a className="card" href="/globals">
          <h2 style={{ marginTop: 0 }}>Globals</h2>
          <p className="muted">Edit `header.json` and `footer.json`</p>
        </a>
        <a className="card" href="/media">
          <h2 style={{ marginTop: 0 }}>Media</h2>
          <p className="muted">Upload assets to `/public/assets/figma`</p>
        </a>
      </div>
    </div>
  );
}
