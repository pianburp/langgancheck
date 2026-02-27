import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "gajiguard_session";

export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return Boolean(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect("/login");
}
