import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { ensureStoreDirs, isSafeKey, toPageFilePath } from "@/lib/workspace";
import { pageSchema, readJsonFile, writeJsonFile } from "@/lib/content-store";
import { requireAuthApi } from "@/lib/auth";

type Params = { params: Promise<{ key: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const { key } = await params;
    if (!isSafeKey(key)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    const filePath = toPageFilePath(key);
    const data = await readJsonFile(filePath);
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
    if (!isSafeKey(key)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    const body = await req.json();
    const parsed = pageSchema.parse(body);
    const filePath = toPageFilePath(key);
    await writeJsonFile(filePath, parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    await ensureStoreDirs();
    const { key } = await params;
    if (!isSafeKey(key)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    const filePath = toPageFilePath(key);
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 404 });
  }
}
