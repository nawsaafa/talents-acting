import { Lock, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

interface PremiumSectionProps {
  isUnlocked: boolean;
  children: React.ReactNode;
}

export function PremiumSection({ isUnlocked, children }: PremiumSectionProps) {
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content placeholder */}
      <div className="blur-sm select-none pointer-events-none opacity-50">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      {/* Overlay with CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Premium Content</h4>
          <p className="text-sm text-gray-600 mb-4 max-w-xs">
            Contact information and full details are available to verified
            professionals and companies.
          </p>
          <Link href="/register">
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Register to Access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
