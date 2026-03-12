import { NextResponse } from "next/server";
import { requireAuthApi } from "@/lib/auth";
import { triggerRebuild } from "@/lib/trigger-rebuild";

export async function POST() {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;

    triggerRebuild();
    return NextResponse.json({ ok: true, message: "Rebuild started" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
