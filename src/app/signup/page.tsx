import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { hasSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  if (await hasSession()) redirect("/dashboard");
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-slate-600">Start tracking subscriptions in under a minute.</p>
        <div className="mt-5">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-semibold text-teal-700" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
