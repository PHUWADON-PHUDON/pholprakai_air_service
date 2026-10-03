import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;

function adminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  return username && password ? { username, password } : null;
}

function signature(payload: string, password: string) {
  return createHmac("sha256", `admin-session-v1:${password}`)
    .update(payload)
    .digest("base64url");
}

export function hasAdminCredentials() {
  return adminCredentials() !== null;
}

export function checkAdminCredentials(username: string, password: string) {
  const admin = adminCredentials();
  if (!admin) return false;

  const submittedHash = createHash("sha256").update(password).digest();
  const configuredHash = createHash("sha256").update(admin.password).digest();
  return username === admin.username && timingSafeEqual(submittedHash, configuredHash);
}

export function createAdminSession() {
  const admin = adminCredentials();
  if (!admin) throw new Error("Admin credentials are not configured");

  const payload = Buffer.from(JSON.stringify({
    username: admin.username,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  })).toString("base64url");

  return `${payload}.${signature(payload, admin.password)}`;
}

export function readAdminSession(token: string | undefined) {
  const admin = adminCredentials();
  if (!admin || !token) return null;

  const [payload, tokenSignature, extra] = token.split(".");
  if (!payload || !tokenSignature || extra) return null;

  const expected = Buffer.from(signature(payload, admin.password), "base64url");
  const actual = Buffer.from(tokenSignature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof session === "object" && session !== null &&
      "username" in session && session.username === admin.username &&
      "expiresAt" in session && typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    ) {
      return admin.username;
    }
  } catch {
    return null;
  }

  return null;
}
