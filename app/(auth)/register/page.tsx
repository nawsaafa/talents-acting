import Link from "next/link";
import { Card, CardBody } from "@/components/ui";

const registrationTypes = [
  {
    title: "Talent",
    description: "Actors, comedians, and performers looking to showcase their profiles and connect with industry professionals.",
    href: "/register/talent",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Professional",
    description: "Casting directors, film directors, producers, and other film industry professionals seeking talent.",
    href: "/register/professional",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Company",
    description: "Production companies, talent agencies, and organizations looking to access our talent database.",
    href: "/register/company",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
        <p className="mt-2 text-gray-600">Choose how you want to join Talents Acting</p>
      </div>

      <div className="space-y-4">
        {registrationTypes.map((type) => (
          <Link key={type.title} href={type.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-primary-100 text-primary-600 rounded-lg">
                  {type.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{type.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{type.description}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
