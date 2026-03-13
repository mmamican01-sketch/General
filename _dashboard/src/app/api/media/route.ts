import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ensureStoreDirs, MEDIA_ROOT, SYSTEM_ROOT } from "@/lib/workspace";
import { requireAuthApi } from "@/lib/auth";

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function GET() {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const entries = await fs.readdir(MEDIA_ROOT, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        path: `/assets/figma/${name}`,
      }));
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext);
    const name = `${safeFileName(base)}-${Date.now()}${safeFileName(ext)}`;
    const target = path.join(MEDIA_ROOT, name);
    await fs.writeFile(target, bytes);

    const publicPath = `/assets/figma/${name}`;
    try {
      const invPath = path.join(SYSTEM_ROOT, "MEDIA_INVENTORY.json");
      const invRaw = await fs.readFile(invPath, "utf8").catch(() => '{"assets":[]}');
      const inv = JSON.parse(invRaw) as { assets?: Array<{ path: string; publicUrl?: string; type?: string }> };
      const assets = inv.assets || [];
      if (!assets.some((a) => (a.publicUrl ?? a.path).includes(name))) {
        assets.push({
          path: `public/assets/figma/${name}`,
          publicUrl: publicPath,
          type: "image",
        });
        inv.assets = assets;
        await fs.writeFile(invPath, JSON.stringify(inv, null, 2), "utf8");
      }
    } catch {
      /* ignore inventory update errors */
    }

    return NextResponse.json({
      ok: true,
      file: {
        name,
        path: publicPath,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
