import type { Language } from "@/types/settings";
import { ROLE_TEXTS, type RoleTextTree } from "@/lib/roleTexts";

/**
 * Look up a custom-role text by dotted path (`rolePermissions.events.manage.label`),
 * with `{{var}}` interpolation and `_one` / `_other` plurals (via `count`).
 * Falls back to English, then to `fallback`, then to the key itself.
 */
export function roleText(
  language: Language,
  key: string,
  vars?: Record<string, string | number>,
  fallback?: string,
): string {
  const find = (tree: RoleTextTree | undefined, path: string): string | undefined => {
    let node: string | RoleTextTree | undefined = tree;
    for (const part of path.split(".")) {
      if (!node || typeof node === "string") return undefined;
      node = node[part];
    }
    return typeof node === "string" ? node : undefined;
  };
  const candidates =
    vars && typeof vars.count === "number"
      ? [`${key}_${vars.count === 1 ? "one" : "other"}`, key]
      : [key];
  let text: string | undefined;
  for (const tree of [ROLE_TEXTS[language], ROLE_TEXTS.en]) {
    for (const c of candidates) {
      text = find(tree, c);
      if (text !== undefined) break;
    }
    if (text !== undefined) break;
  }
  const out = text ?? fallback ?? key;
  return out.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars?.[name] ?? ""));
}
