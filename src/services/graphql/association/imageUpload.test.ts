import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const request = vi.fn();
vi.mock("@/core/graphql-client", () => ({ getGraphQLClient: () => ({ request }) }));

import {
  getAssociationAvatarUploadUrl,
  getAssociationCoverUploadUrl,
  uploadAssociationAvatar,
} from "./operations";

const file = new File(["png-bytes"], "logo.png", { type: "image/png" });

describe("association image upload", () => {
  beforeEach(() => request.mockReset());
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ["logo", getAssociationAvatarUploadUrl, "getAssociationAvatarUploadUrl"],
    ["banner", getAssociationCoverUploadUrl, "getAssociationCoverUploadUrl"],
  ] as const)("asks for the %s upload URL with the arguments the API requires", async (_label, fn, field) => {
    request.mockResolvedValue({ [field]: { uploadUrl: "https://upload.test/x", fileUrl: "https://cdn.test/x.png" } });

    const result = await fn("assoc-1", file);

    const [document, variables] = request.mock.calls[0];
    expect(variables).toEqual({ associationId: "assoc-1", filename: "logo.png", contentType: "image/png" });
    expect(document).toContain("filename: $filename");
    expect(document).toContain("contentType: $contentType");
    // The API's type has fileUrl; asking for fileKey fails validation.
    expect(document).toMatch(/\bfileUrl\b/);
    expect(document).not.toMatch(/\bfileKey\b/);
    expect(result.fileUrl).toBe("https://cdn.test/x.png");
  });

  it("uploads with exactly the headers the URL was signed over", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await uploadAssociationAvatar("https://upload.test/x", file);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://upload.test/x");
    expect(init.method).toBe("PUT");
    expect(init.headers).toEqual({
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    });
  });

  it("signs and uploads a file with no type as image/jpeg in both steps", async () => {
    const untyped = new File(["x"], "photo");
    request.mockResolvedValue({ getAssociationAvatarUploadUrl: { uploadUrl: "u", fileUrl: "f" } });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await getAssociationAvatarUploadUrl("assoc-1", untyped);
    await uploadAssociationAvatar("u", untyped);

    expect(request.mock.calls[0][1].contentType).toBe("image/jpeg");
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBe("image/jpeg");
  });

  it("reports a refused upload instead of claiming success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(uploadAssociationAvatar("u", file)).rejects.toThrow("Image upload failed");
  });
});
