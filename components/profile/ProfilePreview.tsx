"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Lock,
  MapPin,
  Mail,
  Phone,
  Star,
  Calendar,
  Ruler,
  DollarSign,
} from "lucide-react";
import type { TalentProfile } from "@prisma/client";
import { cn } from "@/lib/utils";

type ViewMode = "public" | "premium";

interface ProfilePreviewProps {
  profile: Partial<TalentProfile>;
  className?: string;
}


export function ProfilePreview({ profile, className }: ProfilePreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("public");

  const isPremium = viewMode === "premium";

  // Format arrays for display
  const formatArray = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) return null;
    return arr.join(", ");
  };

  // Format height
  const formatHeight = (cm: number | null | undefined) => {
    if (!cm) return null;
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return `${cm}cm (${feet}'${inches}")`;
  };

  // Format date of birth (premium only)
  const formatDOB = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format rate
  const formatRate = (rate: number | null | undefined, negotiable: boolean | null | undefined) => {
    if (!rate) return null;
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(rate));
    return `${formatted}/day${negotiable ? " (negotiable)" : ""}`;
  };

  return (
    <div className={cn("rounded-lg border bg-white", className)}>
      {/* Toggle */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Preview Mode</p>
          <div className="flex rounded-lg border bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("public")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                viewMode === "public"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Eye className="w-4 h-4" />
              Public
            </button>
            <button
              type="button"
              onClick={() => setViewMode("premium")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                viewMode === "premium"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Star className="w-4 h-4" />
              Professional
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {viewMode === "public"
            ? "This is how visitors see your profile"
            : "This is how verified professionals see your profile"}
        </p>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex gap-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            {profile.photo ? (
              <div className="relative w-32 h-40 rounded-lg overflow-hidden">
                <Image
                  src={profile.photo}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-40 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">
                  {profile.firstName?.[0] ?? "?"}
                </span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {profile.gender && (
                <span className="px-2 py-0.5 bg-gray-100 rounded">
                  {profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase().replace("_", " ")}
                </span>
              )}
              {profile.ageRangeMin && profile.ageRangeMax && (
                <span>
                  Plays {profile.ageRangeMin}-{profile.ageRangeMax} years
                </span>
              )}
            </div>

            {profile.location && (
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            )}

            {/* Premium contact info */}
            {isPremium && (
              <div className="mt-3 space-y-1">
                {profile.contactEmail && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {profile.contactEmail}
                  </div>
                )}
                {profile.contactPhone && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {profile.contactPhone}
                  </div>
                )}
              </div>
            )}

            {/* Hidden contact info placeholder for public view */}
            {!isPremium && (profile.contactEmail || profile.contactPhone) && (
              <div className="mt-3 flex items-center gap-1 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                Contact info visible to professionals
              </div>
            )}
          </div>
        </div>

        {/* Physical Attributes */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Physical Attributes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.height && (
              <div>
                <span className="text-xs text-gray-500">Height</span>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  {formatHeight(profile.height)}
                </p>
              </div>
            )}
            {profile.physique && (
              <div>
                <span className="text-xs text-gray-500">Physique</span>
                <p className="text-sm font-medium">
                  {profile.physique.charAt(0) + profile.physique.slice(1).toLowerCase().replace("_", " ")}
                </p>
              </div>
            )}
            {profile.hairColor && (
              <div>
                <span className="text-xs text-gray-500">Hair</span>
                <p className="text-sm font-medium">
                  {profile.hairColor.charAt(0) + profile.hairColor.slice(1).toLowerCase()}
                  {profile.hairLength && `, ${profile.hairLength.toLowerCase()}`}
                </p>
              </div>
            )}
            {profile.eyeColor && (
              <div>
                <span className="text-xs text-gray-500">Eyes</span>
                <p className="text-sm font-medium">
                  {profile.eyeColor.charAt(0) + profile.eyeColor.slice(1).toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {(formatArray(profile.languages) ||
          formatArray(profile.performanceSkills) ||
          formatArray(profile.athleticSkills)) && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Skills
            </h2>
            <div className="space-y-2">
              {formatArray(profile.languages) && (
                <div>
                  <span className="text-xs text-gray-500">Languages:</span>
                  <span className="ml-2 text-sm">{formatArray(profile.languages)}</span>
                </div>
              )}
              {formatArray(profile.performanceSkills) && (
                <div>
                  <span className="text-xs text-gray-500">Performance:</span>
                  <span className="ml-2 text-sm">{formatArray(profile.performanceSkills)}</span>
                </div>
              )}
              {formatArray(profile.athleticSkills) && (
                <div>
                  <span className="text-xs text-gray-500">Athletic:</span>
                  <span className="ml-2 text-sm">{formatArray(profile.athleticSkills)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Biography */}
        {profile.bio && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Biography
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}

        {/* Professional Info (Premium) */}
        {isPremium && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h2 className="text-sm font-semibold text-purple-900 uppercase tracking-wide mb-3 flex items-center gap-1">
              <Star className="w-4 h-4" />
              Professional Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {profile.dailyRate && (
                <div>
                  <span className="text-xs text-purple-700">Daily Rate</span>
                  <p className="text-sm font-medium text-purple-900 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {formatRate(Number(profile.dailyRate), profile.rateNegotiable)}
                  </p>
                </div>
              )}
              {profile.dateOfBirth && (
                <div>
                  <span className="text-xs text-purple-700">Date of Birth</span>
                  <p className="text-sm font-medium text-purple-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDOB(profile.dateOfBirth)}
                  </p>
                </div>
              )}
              <div>
                <span className="text-xs text-purple-700">Availability</span>
                <p className="text-sm font-medium text-purple-900">
                  {profile.isAvailable !== false ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Public rate indicator */}
        {!isPremium && profile.dailyRate && (
          <div className="mt-6 flex items-center gap-1 text-sm text-gray-400">
            <Lock className="w-4 h-4" />
            Rate information visible to professionals
          </div>
        )}
      </div>
    </div>
  );
}
