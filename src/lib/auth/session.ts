import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function hasSession(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function getSessionUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function getSessionEmail(): Promise<string | null> {
  const user = await getSessionUser();
  return user?.email ?? null;
}

/**
 * Require an authenticated session or throw.
 * Use this at the top of every mutating server action.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}
