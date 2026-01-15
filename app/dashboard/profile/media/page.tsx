import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout";
import { Button, Card, CardBody } from "@/components/ui";
import { auth } from "@/lib/auth/auth";
import { getTalentProfileByUserId } from "@/lib/talents/queries";
import { MediaGallery } from "@/components/media";
import { ArrowLeft, User } from "lucide-react";

export const metadata = {
  title: "Media Gallery | Dashboard - Acting Institute",
  description: "Manage your photos and videos",
};

export default async function MediaPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/profile/media");
  }

  // Check if user is a talent
  if (session.user.role !== "TALENT" && session.user.role !== "ADMIN") {
    return (
      <Container className="py-8">
        <Card>
          <CardBody className="text-center py-12">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Media Gallery Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Media gallery is only available for talent profiles.
            </p>
            <Link href="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Fetch user's talent profile
  const profile = await getTalentProfileByUserId(session.user.id);

  // No profile yet - redirect to create
  if (!profile) {
    redirect("/dashboard/profile");
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
        <p className="mt-2 text-gray-600">
          Upload photos and add video links to showcase your talent
        </p>
      </div>

      {/* Media Gallery Component */}
      <Card>
        <CardBody>
          <MediaGallery
            photos={profile.photos || []}
            videoUrls={profile.videoUrls || []}
            primaryPhoto={profile.photo}
          />
        </CardBody>
      </Card>
    </Container>
  );
}
