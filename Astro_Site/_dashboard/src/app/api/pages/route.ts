import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureStoreDirs, isSafeKey, PAGES_ROOT, toPageFilePath } from "@/lib/workspace";
import { listJsonFiles, writeJsonFile } from "@/lib/content-store";
import { requireAuthApi } from "@/lib/auth";

const createSchema = z.object({
  key: z.string().min(1),
  route: z.string().min(1).optional(),
});

export async function GET() {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const files = await listJsonFiles(PAGES_ROOT);
    const pages = files.map((name) => ({
      key: name.replace(/\.json$/i, ""),
      file: name,
    }));
    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const payload = createSchema.parse(await req.json());
    if (!isSafeKey(payload.key)) {
      return NextResponse.json({ error: "Invalid key format" }, { status: 400 });
    }
    const filePath = toPageFilePath(payload.key);
    const template = {
      routeKey: payload.key,
      route: payload.route ?? `/en/${payload.key === "index" ? "" : payload.key}`.replace(/\/+$/, "/"),
      generatedAt: new Date().toISOString(),
      slots: {},
    };
    await writeJsonFile(filePath, template);
    return NextResponse.json({ ok: true, filePath });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
