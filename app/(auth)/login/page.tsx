"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, Button, Input, Loading } from "@/components/ui";
import { login } from "@/lib/auth/actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registered = searchParams.get("registered") === "true";
  const pending = searchParams.get("pending") === "true";

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-gray-900">Sign In</h1>
        <p className="text-sm text-gray-600">Welcome back to Talents Acting</p>
      </CardHeader>
      <CardBody>
        <form action={handleSubmit} className="space-y-4">
          {registered && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              {pending
                ? "Account created! Your account is pending admin approval. You can sign in but premium features will be limited until approved."
                : "Account created successfully! You can now sign in."}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Do not have an account?{" "}
            <Link href="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
