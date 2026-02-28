import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { hasSession } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

export default async function LoginPage() {
  if (await hasSession()) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm border">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-foreground">
              <Shield className="h-5 w-5 text-background" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Welcome back</CardTitle>
              <CardDescription className="text-xs">
                Sign in to access your dashboard and track your subscriptions.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AuthForm mode="login" />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-foreground hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
