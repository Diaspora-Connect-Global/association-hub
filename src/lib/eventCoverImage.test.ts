import { describe, it, expect, vi } from "vitest";
import { COVER_MAX_BYTES, resolveCoverImageUrl, usableCoverImageUrl, validateCoverFile } from "./eventCoverImage";

describe("usableCoverImageUrl", () => {
  it("keeps http(s) URLs", () => {
    expect(usableCoverImageUrl("https://storage.googleapis.com/b/o.jpg?X=1")).toBe("https://storage.googleapis.com/b/o.jpg?X=1");
  });
  it("drops blob:, data:, javascript:, relative and empty values", () => {
    for (const v of ["blob:https://x/43213c4a", "data:image/png;base64,AAAA", "javascript:alert(1)", "/a.png", "", null, undefined]) {
      expect(usableCoverImageUrl(v)).toBeUndefined();
    }
  });
});

describe("validateCoverFile", () => {
  it("accepts raster images and refuses svg, other types and oversize files", () => {
    expect(validateCoverFile({ type: "image/png", size: 10 })).toBeNull();
    expect(validateCoverFile({ type: "image/svg+xml", size: 10 })).toBe("type");
    expect(validateCoverFile({ type: "application/pdf", size: 10 })).toBe("type");
    expect(validateCoverFile({ type: "image/jpeg", size: COVER_MAX_BYTES + 1 })).toBe("size");
  });
});

describe("resolveCoverImageUrl", () => {
  it("uploads a picked file and returns its public URL", async () => {
    const upload = vi.fn().mockResolvedValue("https://cdn.example/c.png");
    const file = new File(["x"], "c.png", { type: "image/png" });
    expect(await resolveCoverImageUrl(file, upload)).toBe("https://cdn.example/c.png");
    expect(upload).toHaveBeenCalledWith(file);
  });
  it("never lets a blob: or data: value through", async () => {
    const upload = vi.fn();
    expect(await resolveCoverImageUrl("blob:https://x/1", upload)).toBeUndefined();
    expect(await resolveCoverImageUrl("data:image/png;base64,AA", upload)).toBeUndefined();
    expect(upload).not.toHaveBeenCalled();
  });
  it("refuses to upload a non-image file", async () => {
    const upload = vi.fn();
    await expect(resolveCoverImageUrl(new File(["x"], "a.html", { type: "text/html" }), upload)).rejects.toThrow();
    expect(upload).not.toHaveBeenCalled();
  });
  it("sends nothing when no file was picked (edit keeps the saved cover)", async () => {
    expect(await resolveCoverImageUrl(null, vi.fn())).toBeUndefined();
  });
});
