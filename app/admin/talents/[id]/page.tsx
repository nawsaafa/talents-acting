import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTalentForReview } from '@/lib/admin/queries';
import { ValidationActions } from '@/components/admin/ValidationActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

const VALIDATION_STATUS_STYLES = {
  PENDING: {
    bg: 'bg-[var(--color-gold)]/20',
    text: 'text-[var(--color-gold)]',
    border: 'border-[var(--color-gold)]/30',
    label: 'Pending Review',
  },
  APPROVED: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Approved',
  },
  REJECTED: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'Rejected',
  },
  SUSPENDED: {
    bg: 'bg-[var(--color-surface-light)]/30',
    text: 'text-[var(--color-text-muted)]',
    border: 'border-[var(--color-surface-light)]/30',
    label: 'Suspended',
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
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/admin/talents"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Queue
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            {talent.photo ? (
              <Image
                src={talent.photo}
                alt={talent.firstName}
                width={96}
                height={96}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--color-surface-light)]/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 flex items-center justify-center">
                <span
                  className="text-3xl font-bold text-[var(--color-gold)]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {talent.firstName[0]}
                </span>
              </div>
            )}
            <div>
              <h1
                className="text-3xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {talent.firstName} {talent.lastName}
              </h1>
              <p className="mt-1 text-[var(--color-text-muted)]">{talent.user.email}</p>
              <span
                className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 text-sm font-medium rounded-xl border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {statusStyle.label}
              </span>
            </div>
          </div>

          {talent.validationStatus === 'PENDING' && (
            <ValidationActions profileId={talent.id} profileType="talent" showLabels />
          )}
        </div>
      </div>

      {/* Rejection Reason */}
      {talent.rejectionReason && (
        <div className="relative overflow-hidden rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600" />
          <div className="pl-4">
            <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Rejection Reason
            </h3>
            <p className="text-[var(--color-text-secondary)]">{talent.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <InfoCard title="Basic Information">
          <InfoRow label="Gender" value={talent.gender} />
          <InfoRow label="Age Range" value={`${talent.ageRangeMin} - ${talent.ageRangeMax}`} />
          {talent.height && <InfoRow label="Height" value={`${talent.height} cm`} />}
          {talent.physique && <InfoRow label="Physique" value={talent.physique} />}
          {talent.ethnicAppearance && (
            <InfoRow label="Ethnic Appearance" value={talent.ethnicAppearance} />
          )}
          {talent.location && <InfoRow label="Location" value={talent.location} />}
        </InfoCard>

        {/* Physical Attributes */}
        <InfoCard title="Physical Attributes">
          {talent.hairColor && <InfoRow label="Hair Color" value={talent.hairColor} />}
          {talent.hairLength && <InfoRow label="Hair Length" value={talent.hairLength} />}
          {talent.eyeColor && <InfoRow label="Eye Color" value={talent.eyeColor} />}
          {talent.beardType && <InfoRow label="Beard Type" value={talent.beardType} />}
          <InfoRow label="Tattoos" value={talent.hasTattoos ? 'Yes' : 'No'} />
          <InfoRow label="Scars" value={talent.hasScars ? 'Yes' : 'No'} />
        </InfoCard>

        {/* Contact Info */}
        <InfoCard title="Contact Information">
          <InfoRow label="Account Email" value={talent.user.email} />
          {talent.contactEmail && <InfoRow label="Contact Email" value={talent.contactEmail} />}
          {talent.contactPhone && <InfoRow label="Phone" value={talent.contactPhone} />}
        </InfoCard>

        {/* Availability */}
        <InfoCard title="Availability & Rates">
          <InfoRow
            label="Available"
            value={talent.isAvailable ? 'Yes' : 'No'}
            highlight={talent.isAvailable}
          />
          {talent.dailyRate && (
            <InfoRow label="Daily Rate" value={`$${Number(talent.dailyRate)}`} />
          )}
          <InfoRow label="Rate Negotiable" value={talent.rateNegotiable ? 'Yes' : 'No'} />
        </InfoCard>
      </div>

      {/* Bio */}
      {talent.bio && (
        <InfoCard title="Bio">
          <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
            {talent.bio}
          </p>
        </InfoCard>
      )}

      {/* Skills */}
      <InfoCard title="Skills">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talent.languages.length > 0 && <SkillGroup label="Languages" items={talent.languages} />}
          {talent.accents.length > 0 && <SkillGroup label="Accents" items={talent.accents} />}
          {talent.performanceSkills.length > 0 && (
            <SkillGroup label="Performance" items={talent.performanceSkills} />
          )}
          {talent.athleticSkills.length > 0 && (
            <SkillGroup label="Athletic" items={talent.athleticSkills} />
          )}
          {talent.danceStyles.length > 0 && <SkillGroup label="Dance" items={talent.danceStyles} />}
          {talent.musicalInstruments.length > 0 && (
            <SkillGroup label="Music" items={talent.musicalInstruments} />
          )}
        </div>
      </InfoCard>

      {/* Meta Info */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]/30 border border-[var(--color-surface-light)]/10 p-5">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--color-text-muted)]">
          <MetaItem label="Profile ID" value={talent.id} mono />
          <MetaItem label="User ID" value={talent.userId} mono />
          <MetaItem label="Created" value={new Date(talent.createdAt).toLocaleString()} />
          <MetaItem label="Updated" value={new Date(talent.updatedAt).toLocaleString()} />
          {talent.validatedAt && (
            <MetaItem label="Validated" value={new Date(talent.validatedAt).toLocaleString()} />
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[100px]" />
      <h2
        className="relative text-lg font-semibold text-[var(--color-text-primary)] mb-4"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {title}
      </h2>
      <div className="relative">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[var(--color-surface-light)]/10 last:border-0">
      <dt className="text-[var(--color-text-muted)]">{label}</dt>
      <dd
        className={`font-medium ${highlight ? 'text-emerald-400' : 'text-[var(--color-text-primary)]'}`}
      >
        {value}
      </dd>
    </div>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-1.5 text-sm bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20 rounded-lg"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="font-medium text-[var(--color-text-secondary)]">{label}:</span>{' '}
      <span className={mono ? 'font-mono text-xs' : ''}>{value}</span>
    </div>
  );
}
