import { beforeEach, describe, expect, it } from "vitest";
import { clearAdminSession, signOutAdmin } from "./adminAuthStore";
import { draftKey, loadDraft, saveDraft } from "@/lib/composerDraft";

const key = draftKey("admin-1", "assoc-1");

beforeEach(() => {
  localStorage.clear();
  saveDraft(key, { text: "half a post", visibility: "PUBLIC", mentions: [] });
});

describe("sign-out and post drafts", () => {
  it("a forced logout (expired or rejected session) keeps the admin's own draft", () => {
    clearAdminSession();
    expect(loadDraft(key)?.text).toBe("half a post");
  });

  it("an explicit sign-out deletes every draft in this browser", () => {
    saveDraft(draftKey("admin-2", "assoc-1"), { text: "another admin", visibility: "PUBLIC", mentions: [] });
    signOutAdmin();
    expect(loadDraft(key)).toBeNull();
    expect(loadDraft(draftKey("admin-2", "assoc-1"))).toBeNull();
  });
});
