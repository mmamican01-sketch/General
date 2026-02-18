type SlotEntry = {
  type?: string;
  value?: unknown;
  note?: string;
};

type ContentDoc = {
  routeKey?: string;
  route?: string;
  generatedAt?: string;
  slots?: Record<string, SlotEntry>;
  warnings?: string[];
};

const pageModulesNew = import.meta.glob("../content-store/en/pages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const pageModulesLegacy = import.meta.glob("../content-store/pages/en/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const globalModulesNew = import.meta.glob("../content-store/en/globals/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const globalModulesLegacy = import.meta.glob("../content-store/globals/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const warned = new Set<string>();

function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[content-store] ${message}`);
}

function findModule<T>(modules: Record<string, T>, fileName: string): T | undefined {
  const entry = Object.entries(modules).find(([key]) => key.endsWith(fileName));
  return entry?.[1];
}

export async function loadPageContent(routeKey: string): Promise<ContentDoc> {
  const fileName = `${routeKey}.json`;
  const fromNew = findModule(pageModulesNew, fileName);
  if (fromNew) return fromNew;

  const fromLegacy = findModule(pageModulesLegacy, fileName);
  if (fromLegacy) return fromLegacy;

  warnOnce(`Missing page content file for routeKey "${routeKey}"`);
  return {};
}

export async function loadGlobalContent(key: "header" | "footer"): Promise<ContentDoc> {
  const fileName = `${key}.json`;
  const fromNew = findModule(globalModulesNew, fileName);
  if (fromNew) return fromNew;

  const fromLegacy = findModule(globalModulesLegacy, `${key}.en.json`) ?? findModule(globalModulesLegacy, fileName);
  if (fromLegacy) return fromLegacy;

  warnOnce(`Missing global content file for key "${key}"`);
  return {};
}

export function getSlot(content: ContentDoc | null | undefined, key: string, fallback: string): string {
  const value = content?.slots?.[key]?.value;
  if (typeof value === "string") {
    return value.length > 0 ? value : fallback;
  }
  warnOnce(`Missing slot "${key}"`);
  return fallback;
}
