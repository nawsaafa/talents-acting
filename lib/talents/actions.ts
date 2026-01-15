"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { Role, ValidationStatus } from "@prisma/client";
import {
  createProfileSchema,
  updateProfileSchema,
  type CreateProfileInput,
  type UpdateProfileInput,
} from "./validation";
import { getTalentProfileByUserId } from "./queries";

type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

// Create a new talent profile
export async function createTalentProfile(
  input: CreateProfileInput
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to create a profile" };
  }

  // Only talents can create talent profiles
  if (session.user.role !== Role.TALENT) {
    return { success: false, error: "Only talent users can create talent profiles" };
  }

  // Check if user already has a profile
  const existingProfile = await getTalentProfileByUserId(session.user.id);
  if (existingProfile) {
    return { success: false, error: "You already have a talent profile" };
  }

  // Validate input
  const parsed = createProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Validate age range logic
  if (data.ageRangeMin > data.ageRangeMax) {
    return { success: false, error: "Minimum age cannot be greater than maximum age" };
  }

  try {
    const profile = await prisma.talentProfile.create({
      data: {
        userId: session.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        ageRangeMin: data.ageRangeMin,
        ageRangeMax: data.ageRangeMax,
        photo: data.photo,
        dateOfBirth: data.dateOfBirth,
        location: data.location,
        bio: data.bio,
        height: data.height,
        physique: data.physique,
        ethnicAppearance: data.ethnicAppearance,
        hairColor: data.hairColor,
        eyeColor: data.eyeColor,
        hairLength: data.hairLength,
        beardType: data.beardType,
        hasTattoos: data.hasTattoos,
        hasScars: data.hasScars,
        tattooDescription: data.tattooDescription,
        scarDescription: data.scarDescription,
        languages: data.languages,
        accents: data.accents,
        athleticSkills: data.athleticSkills,
        musicalInstruments: data.musicalInstruments,
        performanceSkills: data.performanceSkills,
        danceStyles: data.danceStyles,
        isAvailable: data.isAvailable,
        dailyRate: data.dailyRate,
        rateNegotiable: data.rateNegotiable,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        validationStatus: ValidationStatus.PENDING,
      },
    });

    revalidatePath("/talents");
    revalidatePath("/dashboard/profile");

    return { success: true, data: { id: profile.id } };
  } catch (error) {
    console.error("Failed to create talent profile:", error);
    return { success: false, error: "Failed to create profile. Please try again." };
  }
}

// Update an existing talent profile
export async function updateTalentProfile(
  input: UpdateProfileInput
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to update your profile" };
  }

  // Get current profile
  const existingProfile = await getTalentProfileByUserId(session.user.id);
  if (!existingProfile) {
    return { success: false, error: "Profile not found" };
  }

  // Validate input
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Validate age range if both provided
  if (
    data.ageRangeMin !== undefined &&
    data.ageRangeMax !== undefined &&
    data.ageRangeMin > data.ageRangeMax
  ) {
    return { success: false, error: "Minimum age cannot be greater than maximum age" };
  }

  try {
    await prisma.talentProfile.update({
      where: { userId: session.user.id },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.ageRangeMin !== undefined && { ageRangeMin: data.ageRangeMin }),
        ...(data.ageRangeMax !== undefined && { ageRangeMax: data.ageRangeMax }),
        ...(data.photo !== undefined && { photo: data.photo }),
        ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.height !== undefined && { height: data.height }),
        ...(data.physique !== undefined && { physique: data.physique }),
        ...(data.ethnicAppearance !== undefined && {
          ethnicAppearance: data.ethnicAppearance,
        }),
        ...(data.hairColor !== undefined && { hairColor: data.hairColor }),
        ...(data.eyeColor !== undefined && { eyeColor: data.eyeColor }),
        ...(data.hairLength !== undefined && { hairLength: data.hairLength }),
        ...(data.beardType !== undefined && { beardType: data.beardType }),
        ...(data.hasTattoos !== undefined && { hasTattoos: data.hasTattoos }),
        ...(data.hasScars !== undefined && { hasScars: data.hasScars }),
        ...(data.tattooDescription !== undefined && {
          tattooDescription: data.tattooDescription,
        }),
        ...(data.scarDescription !== undefined && {
          scarDescription: data.scarDescription,
        }),
        ...(data.languages !== undefined && { languages: data.languages }),
        ...(data.accents !== undefined && { accents: data.accents }),
        ...(data.athleticSkills !== undefined && {
          athleticSkills: data.athleticSkills,
        }),
        ...(data.musicalInstruments !== undefined && {
          musicalInstruments: data.musicalInstruments,
        }),
        ...(data.performanceSkills !== undefined && {
          performanceSkills: data.performanceSkills,
        }),
        ...(data.danceStyles !== undefined && { danceStyles: data.danceStyles }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.dailyRate !== undefined && { dailyRate: data.dailyRate }),
        ...(data.rateNegotiable !== undefined && {
          rateNegotiable: data.rateNegotiable,
        }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
      },
    });

    revalidatePath("/talents");
    revalidatePath("/dashboard/profile");
    revalidatePath(`/talents/${existingProfile.id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update talent profile:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}

// Update profile photo
export async function updateProfilePhoto(photoUrl: string): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  try {
    await prisma.talentProfile.update({
      where: { userId: session.user.id },
      data: { photo: photoUrl },
    });

    revalidatePath("/talents");
    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to update profile photo:", error);
    return { success: false, error: "Failed to update photo" };
  }
}

// Delete talent profile (soft delete by setting isPublic to false)
export async function deleteTalentProfile(): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  try {
    await prisma.talentProfile.update({
      where: { userId: session.user.id },
      data: { isPublic: false },
    });

    revalidatePath("/talents");
    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete talent profile:", error);
    return { success: false, error: "Failed to delete profile" };
  }
}

// Redirect helper for after profile creation
export async function redirectToProfile() {
  redirect("/dashboard/profile");
}
