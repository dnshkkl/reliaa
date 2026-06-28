// Lightweight cookie-based admin authentication.
//
// A session cookie holds "<username>:<hmac>" where the hmac is signed with
// SESSION_SECRET. Verification recomputes the hmac, so the cookie cannot be
// forged without the secret. Web Crypto is used so this works both in Node
// route handlers and in the (edge) middleware.

export const SESSION_COOKIE = "reliaa_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. See .env.example.");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(signature);
}

/** Validate the username/password against the configured admin credentials. */
export function validateCredentials(
  username: string,
  password: string
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    throw new Error(
      "ADMIN_USERNAME / ADMIN_PASSWORD are not set. See .env.example."
    );
  }
  return username === expectedUser && password === expectedPass;
}

/** Create a signed session token for the given (already-validated) username. */
export async function createSessionToken(username: string): Promise<string> {
  const signature = await hmac(username, getSecret());
  return `${username}:${signature}`;
}

/** Returns true if the token is a valid, untampered session cookie. */
export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const idx = token.lastIndexOf(":");
  if (idx === -1) return false;
  const username = token.slice(0, idx);
  const signature = token.slice(idx + 1);
  if (username !== process.env.ADMIN_USERNAME) return false;
  const expected = await hmac(username, getSecret());
  // constant-time-ish comparison
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}
