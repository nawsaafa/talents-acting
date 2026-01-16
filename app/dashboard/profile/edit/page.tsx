import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout";
import { ProfileWizard } from "@/components/profile";
import { auth } from "@/lib/auth/auth";
import { getTalentProfileByUserId } from "@/lib/talents/queries";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Edit Profile | Dashboard - Acting Institute",
  description: "Create or update your talent profile",
};

export default async function ProfileEditPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/profile/edit");
  }

  // Check if user is a talent
  if (session.user.role !== "TALENT" && session.user.role !== "ADMIN") {
    redirect("/dashboard/profile");
  }

  // Fetch existing profile (if any)
  const profile = await getTalentProfileByUserId(session.user.id);
  const mode = profile ? "edit" : "create";

  return (
    <Container className="py-8 max-w-4xl">
      {/* Back Link */}
      <Link
        href="/dashboard/profile"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === "create" ? "Create Your Profile" : "Edit Profile"}
        </h1>
        <p className="mt-2 text-gray-600">
          {mode === "create"
            ? "Complete these steps to get discovered by casting directors and production companies."
            : "Update your profile information. Changes will be reviewed before going public."}
        </p>
      </div>

      {/* Profile Wizard */}
      <ProfileWizard
        initialData={profile ?? undefined}
        profileId={profile?.id}
      />
    </Container>
  );
}
