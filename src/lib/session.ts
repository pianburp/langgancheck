import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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
