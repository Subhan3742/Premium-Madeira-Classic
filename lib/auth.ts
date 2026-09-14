import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const ADMIN_ROW_ID = "admin";

export async function createToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Credentials live in the database once the admin has changed them.
 * Until then, the ADMIN_EMAIL / ADMIN_PASSWORD env vars act as the defaults.
 */
async function getStoredCredentials() {
  return prisma.adminCredential.findUnique({ where: { id: ADMIN_ROW_ID } });
}

export async function getAdminEmail() {
  const stored = await getStoredCredentials();
  return stored?.email ?? process.env.ADMIN_EMAIL ?? "";
}

export async function validateAdminCredentials(email: string, password: string) {
  const stored = await getStoredCredentials();
  const normalized = email.trim().toLowerCase();

  if (stored) {
    if (stored.email.toLowerCase() !== normalized) return false;
    return bcrypt.compare(password, stored.passwordHash);
  }

  return (
    normalized === (process.env.ADMIN_EMAIL ?? "").toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  );
}

export async function updateAdminCredentials(input: {
  email: string;
  password?: string;
}) {
  const stored = await getStoredCredentials();
  const email = input.email.trim().toLowerCase();

  // When no new password is given, keep the existing one (hashing the env default on first save).
  const passwordHash = input.password
    ? await bcrypt.hash(input.password, 12)
    : stored?.passwordHash ?? (await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "", 12));

  return prisma.adminCredential.upsert({
    where: { id: ADMIN_ROW_ID },
    update: { email, passwordHash },
    create: { id: ADMIN_ROW_ID, email, passwordHash },
  });
}
