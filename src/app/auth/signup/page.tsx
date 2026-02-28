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
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Check } from "lucide-react";

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
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
          {/* Left side - Features */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">GajiGuard</span>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              Start tracking your subscriptions today
            </h1>
            <p className="mt-2 text-muted-foreground">
              Join thousands of users managing their recurring payments with
              ease.
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Get started with GajiGuard in under a minute.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm mode="signup" />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:underline"
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
