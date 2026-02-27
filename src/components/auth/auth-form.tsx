"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setError("");
    setIsSubmitting(true);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Email and password are required.");
      setIsSubmitting(false);
      return;
    }

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const response = await fetch(endpoint, { method: "POST" });
    setIsSubmitting(false);
    if (!response.ok) {
      setError("Authentication failed. Try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Email
        <input
          aria-label="Email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          aria-label="Password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}
      </button>
    </form>
  );
}
