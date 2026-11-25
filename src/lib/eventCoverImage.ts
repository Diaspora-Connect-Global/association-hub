/**
 * Event cover images.
 *
 * Only a real http(s) address is a usable saved cover. A `blob:` URL is a
 * browser-local preview that dies with the tab, a `data:` URL is a multi-MB inline
 * image, and a relative or `javascript:` value can never load from the bucket, so
 * none of those may be saved or rendered.
 */
export function usableCoverImageUrl(value: string | null | undefined): string | undefined {
  const url = value?.trim();
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

/** Raster formats only: SVG can carry script, so it is never accepted as a cover. */
export const COVER_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const COVER_MAX_BYTES = 5 * 1024 * 1024;

export function validateCoverFile(file: { type: string; size: number }): "type" | "size" | null {
  if (!(COVER_ALLOWED_TYPES as readonly string[]).includes(file.type)) return "type";
  if (file.size > COVER_MAX_BYTES) return "size";
  return null;
}

/**
 * The `coverImageUrl` to send on createEvent / updateEvent: a picked file is
 * uploaded and its public URL returned; a saved http(s) URL is kept; everything
 * else (blob:, data:, empty) yields undefined, which leaves the saved cover alone.
 */
export async function resolveCoverImageUrl(
  banner: unknown,
  upload: (file: File) => Promise<string>,
): Promise<string | undefined> {
  if (typeof File !== "undefined" && banner instanceof File) {
    if (validateCoverFile(banner)) throw new Error("Unsupported cover image");
    return usableCoverImageUrl(await upload(banner));
  }
  return typeof banner === "string" ? usableCoverImageUrl(banner) : undefined;
}
