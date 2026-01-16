'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Button, Input, Select } from '@/components/ui';
import { registerCompany } from '@/lib/auth/actions';

const industryOptions = [
  { value: 'Film Production', label: 'Film Production' },
  { value: 'TV Broadcasting', label: 'TV Broadcasting' },
  { value: 'Talent Agency', label: 'Talent Agency' },
  { value: 'Advertising Agency', label: 'Advertising Agency' },
  { value: 'Theater Production', label: 'Theater Production' },
  { value: 'Event Production', label: 'Event Production' },
  { value: 'Other', label: 'Other' },
];

export default function CompanyRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await registerCompany(formData);

      if (result.success) {
        router.push('/login?registered=true&pending=true');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-gray-900">Company Registration</h1>
        <p className="text-sm text-gray-600">Register your company to access talent</p>
      </CardHeader>
      <CardBody>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg">
            Company accounts require admin approval before accessing premium content.
          </div>

          <Input label="Company Name" name="companyName" required placeholder="Acme Productions" />

          <Select label="Industry" name="industry" options={industryOptions} />

          <Input
            label="Login Email"
            name="email"
            type="email"
            required
            placeholder="admin@company.com"
            helperText="This will be your login email"
          />

          <Input
            label="Contact Email"
            name="contactEmail"
            type="email"
            required
            placeholder="contact@company.com"
            helperText="Public contact email for your company"
          />

          <Input
            label="Contact Phone (Optional)"
            name="contactPhone"
            type="tel"
            placeholder="+1 234 567 8900"
          />

          <Input
            label="Website (Optional)"
            name="website"
            type="url"
            placeholder="https://company.com"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="City (Optional)" name="city" placeholder="Los Angeles" />
            <Input label="Country (Optional)" name="country" placeholder="United States" />
          </div>

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

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Company Account
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
