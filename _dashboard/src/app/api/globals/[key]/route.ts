import { NextResponse } from "next/server";
import { ensureStoreDirs, toGlobalFilePath } from "@/lib/workspace";
import { pageSchema, readJsonFile, writeJsonFile } from "@/lib/content-store";
import { requireAuthApi } from "@/lib/auth";

type Params = { params: Promise<{ key: string }> };

function isGlobalKey(key: string) {
  return key === "header" || key === "footer";
}

export async function GET(_: Request, { params }: Params) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const { key } = await params;
    if (!isGlobalKey(key)) return NextResponse.json({ error: "Invalid global key" }, { status: 400 });
    const data = await readJsonFile(toGlobalFilePath(key));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const { key } = await params;
    if (!isGlobalKey(key)) return NextResponse.json({ error: "Invalid global key" }, { status: 400 });
    const body = await req.json();
    const parsed = pageSchema.parse(body);
    await writeJsonFile(toGlobalFilePath(key), parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
