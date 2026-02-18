import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const slotSchema = z.object({
  type: z.enum(["text", "href", "image"]).or(z.string().min(1)),
  value: z.string(),
  note: z.string().optional(),
});

export const pageSchema = z.object({
  routeKey: z.string().min(1),
  route: z.string().min(1),
  generatedAt: z.string().min(1).optional(),
  slots: z.record(z.string(), slotSchema),
  warnings: z.array(z.string()).optional(),
});

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function listJsonFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".json"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}
