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
import { Shield, Check } from "lucide-react";

export default async function SignupPage() {
  if (await hasSession()) redirect("/dashboard");

  const features = [
    "Track unlimited subscriptions",
    "BNPL installment management",
    "Monthly payment calendar",
    "Payment reminders",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-2">
          {/* Left side - Features */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
                <Shield className="h-4 w-4 text-background" />
              </div>
              <span className="text-base font-semibold tracking-tight">GajiGuard</span>
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight">
              Start tracking your subscriptions today
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of users managing their recurring payments with
              ease.
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10">
                    <Check className="h-3 w-3 text-foreground" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Form */}
          <Card className="border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Create an account</CardTitle>
              <CardDescription className="text-xs">
                Get started with GajiGuard in under a minute.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm mode="signup" />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-foreground hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
