import Link from "next/link";
import { notFound } from "next/navigation";
import { getTalentForReview } from "@/lib/admin/queries";
import { Card } from "@/components/ui/Card";
import { ValidationActions } from "@/components/admin/ValidationActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

const VALIDATION_STATUS_STYLES = {
  PENDING: {
    bg: "bg-[var(--color-warning-50)]",
    text: "text-[var(--color-warning)]",
    label: "Pending Review",
  },
  APPROVED: {
    bg: "bg-[var(--color-success-50)]",
    text: "text-[var(--color-success)]",
    label: "Approved",
  },
  REJECTED: {
    bg: "bg-[var(--color-error-50)]",
    text: "text-[var(--color-error)]",
    label: "Rejected",
  },
  SUSPENDED: {
    bg: "bg-[var(--color-neutral-100)]",
    text: "text-[var(--color-neutral-600)]",
    label: "Suspended",
  },
};

export default async function TalentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const talent = await getTalentForReview(id);

  if (!talent) {
    notFound();
  }

  const statusStyle = VALIDATION_STATUS_STYLES[talent.validationStatus];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/talents"
        className="inline-flex items-center text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Queue
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {talent.photo ? (
            <img
              src={talent.photo}
              alt={talent.firstName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center">
              <span className="text-2xl font-medium text-[var(--color-neutral-500)]">
                {talent.firstName[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
              {talent.firstName} {talent.lastName}
            </h1>
            <p className="text-[var(--color-neutral-600)]">{talent.user.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
          </div>
        </div>

        {talent.validationStatus === "PENDING" && (
          <ValidationActions profileId={talent.id} profileType="talent" showLabels />
        )}
      </div>

      {/* Rejection Reason */}
      {talent.rejectionReason && (
        <Card padding="md" className="border-l-4 border-l-[var(--color-error)]">
          <h3 className="font-medium text-[var(--color-error)] mb-1">Rejection Reason</h3>
          <p className="text-[var(--color-neutral-700)]">{talent.rejectionReason}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Basic Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Gender</dt>
              <dd className="font-medium">{talent.gender}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Age Range</dt>
              <dd className="font-medium">{talent.ageRangeMin} - {talent.ageRangeMax}</dd>
            </div>
            {talent.height && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Height</dt>
                <dd className="font-medium">{talent.height} cm</dd>
              </div>
            )}
            {talent.physique && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Physique</dt>
                <dd className="font-medium">{talent.physique}</dd>
              </div>
            )}
            {talent.ethnicAppearance && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Ethnic Appearance</dt>
                <dd className="font-medium">{talent.ethnicAppearance}</dd>
              </div>
            )}
            {talent.location && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Location</dt>
                <dd className="font-medium">{talent.location}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Physical Attributes */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Physical Attributes
          </h2>
          <dl className="space-y-3">
            {talent.hairColor && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Hair Color</dt>
                <dd className="font-medium">{talent.hairColor}</dd>
              </div>
            )}
            {talent.hairLength && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Hair Length</dt>
                <dd className="font-medium">{talent.hairLength}</dd>
              </div>
            )}
            {talent.eyeColor && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Eye Color</dt>
                <dd className="font-medium">{talent.eyeColor}</dd>
              </div>
            )}
            {talent.beardType && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Beard Type</dt>
                <dd className="font-medium">{talent.beardType}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Tattoos</dt>
              <dd className="font-medium">{talent.hasTattoos ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Scars</dt>
              <dd className="font-medium">{talent.hasScars ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </Card>

        {/* Contact Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Contact Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Account Email</dt>
              <dd className="font-medium">{talent.user.email}</dd>
            </div>
            {talent.contactEmail && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Contact Email</dt>
                <dd className="font-medium">{talent.contactEmail}</dd>
              </div>
            )}
            {talent.contactPhone && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Phone</dt>
                <dd className="font-medium">{talent.contactPhone}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Availability */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Availability & Rates
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Available</dt>
              <dd className="font-medium">{talent.isAvailable ? "Yes" : "No"}</dd>
            </div>
            {talent.dailyRate && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Daily Rate</dt>
                <dd className="font-medium">${Number(talent.dailyRate)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Rate Negotiable</dt>
              <dd className="font-medium">{talent.rateNegotiable ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Bio */}
      {talent.bio && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Bio</h2>
          <p className="text-[var(--color-neutral-700)] whitespace-pre-wrap">{talent.bio}</p>
        </Card>
      )}

      {/* Skills */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talent.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {talent.languages.map((lang) => (
                  <span key={lang} className="px-2 py-1 text-sm bg-[var(--color-neutral-100)] rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
          {talent.accents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-2">Accents</h3>
              <div className="flex flex-wrap gap-2">
                {talent.accents.map((accent) => (
                  <span key={accent} className="px-2 py-1 text-sm bg-[var(--color-neutral-100)] rounded">
                    {accent}
                  </span>
                ))}
              </div>
            </div>
          )}
          {talent.performanceSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-2">Performance</h3>
              <div className="flex flex-wrap gap-2">
                {talent.performanceSkills.map((skill) => (
                  <span key={skill} className="px-2 py-1 text-sm bg-[var(--color-neutral-100)] rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {talent.athleticSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-2">Athletic</h3>
              <div className="flex flex-wrap gap-2">
                {talent.athleticSkills.map((skill) => (
                  <span key={skill} className="px-2 py-1 text-sm bg-[var(--color-neutral-100)] rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {talent.danceStyles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-2">Dance</h3>
              <div className="flex flex-wrap gap-2">
                {talent.danceStyles.map((style) => (
                  <span key={style} className="px-2 py-1 text-sm bg-[var(--color-neutral-100)] rounded">
                    {style}
                  </span>
                ))}
              </div>
            </div>
          )}
          {talent.musicalInstruments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-2">Music</h3>
              <div className="flex flex-wrap gap-2">
                {talent.musicalInstruments.map((instrument) => (
                  <span key={instrument} className="px-2 py-1 text-sm bg-[var(--color-neutral-100)] rounded">
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Meta Info */}
      <Card padding="md" className="bg-[var(--color-neutral-50)]">
        <div className="flex flex-wrap gap-6 text-sm text-[var(--color-neutral-500)]">
          <div>
            <span className="font-medium">Profile ID:</span> {talent.id}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {talent.userId}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(talent.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{" "}
            {new Date(talent.updatedAt).toLocaleString()}
          </div>
          {talent.validatedAt && (
            <div>
              <span className="font-medium">Validated:</span>{" "}
              {new Date(talent.validatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
