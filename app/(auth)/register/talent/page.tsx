'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Button, Input, Select } from '@/components/ui';
import { registerTalent } from '@/lib/auth/actions';

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'OTHER', label: 'Other' },
];

export default function TalentRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await registerTalent(formData);

      if (result.success) {
        router.push('/login?registered=true');
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
        <h1 className="text-xl font-bold text-gray-900">Talent Registration</h1>
        <p className="text-sm text-gray-600">Create your talent profile to get discovered</p>
      </CardHeader>
      <CardBody>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" required placeholder="John" />
            <Input label="Last Name" name="lastName" required placeholder="Doe" />
          </div>

          <Input label="Email" name="email" type="email" required placeholder="john@example.com" />

          <Select label="Gender" name="gender" required options={genderOptions} />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Playable Age"
              name="ageRangeMin"
              type="number"
              required
              min={1}
              max={100}
              placeholder="18"
            />
            <Input
              label="Max Playable Age"
              name="ageRangeMax"
              type="number"
              required
              min={1}
              max={100}
              placeholder="30"
            />
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
            Create Talent Account
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
