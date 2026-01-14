"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, Button, Input, Select } from "@/components/ui";
import { registerProfessional } from "@/lib/auth/actions";

const professionOptions = [
  { value: "Casting Director", label: "Casting Director" },
  { value: "Film Director", label: "Film Director" },
  { value: "Producer", label: "Producer" },
  { value: "Assistant Director", label: "Assistant Director" },
  { value: "Talent Agent", label: "Talent Agent" },
  { value: "Talent Manager", label: "Talent Manager" },
  { value: "Other", label: "Other" },
];

export default function ProfessionalRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await registerProfessional(formData);

      if (result.success) {
        router.push("/login?registered=true&pending=true");
      } else {
        setError(result.error || "Registration failed");
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
        <h1 className="text-xl font-bold text-gray-900">Professional Registration</h1>
        <p className="text-sm text-gray-600">Get access to our talent database</p>
      </CardHeader>
      <CardBody>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg">
            Professional accounts require admin approval before accessing premium content.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              required
              placeholder="Jane"
            />
            <Input
              label="Last Name"
              name="lastName"
              required
              placeholder="Smith"
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="jane@production.com"
          />

          <Select
            label="Profession"
            name="profession"
            required
            options={professionOptions}
          />

          <Input
            label="Company (Optional)"
            name="company"
            placeholder="Production Company Name"
          />

          <Input
            label="Reason for Access"
            name="accessReason"
            required
            placeholder="Why do you need access to the talent database?"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="Min 8 characters"
            helperText="Must include uppercase, lowercase, and number"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Create Professional Account
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/register" className="text-primary-600 hover:text-primary-500">
            Choose a different account type
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
