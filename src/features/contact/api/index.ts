import { FORMSPREE_URL } from "../constants";
import type { ContactMessagePayload } from "../types";

export async function sendContactMessage(payload: ContactMessagePayload): Promise<boolean> {
  const res = await fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send contact message");
  }

  return true;
}
