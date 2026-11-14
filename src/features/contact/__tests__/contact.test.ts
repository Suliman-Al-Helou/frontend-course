import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { sendContactMessage } from "../api";
import { WHATSAPP_URL, SUPPORT_EMAIL, FORMSPREE_URL } from "../constants";

describe("Contact Feature", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exports valid canonical support channels", () => {
    expect(WHATSAPP_URL).toContain("wa.me");
    expect(SUPPORT_EMAIL).toContain("@");
    expect(FORMSPREE_URL).toContain("formspree.io");
  });

  it("sendContactMessage posts payload and returns true on 200 OK", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const payload = {
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      message: "Testing contact message",
    };

    const result = await sendContactMessage(payload);

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      FORMSPREE_URL,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it("sendContactMessage throws an error when fetch fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      sendContactMessage({
        name: "Fail",
        email: "fail@example.com",
        message: "Fail message",
      }),
    ).rejects.toThrow("Failed to send contact message");
  });
});
