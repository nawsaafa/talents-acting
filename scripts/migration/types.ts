/**
 * TypeScript interfaces for WordPress data migration
 * Defines structures for parsing WordPress exports and transforming to Prisma format
 */

// =============================================================================
// WordPress Export Types
// =============================================================================

/**
 * WordPress user record from wp_users table
 */
export interface WordPressUser {
  ID: string;
  user_login: string;
  user_email: string;
  user_registered: string;
  display_name: string;
  user_status: string;
}

/**
 * WordPress user meta record from wp_usermeta table
 */
export interface WordPressUserMeta {
  user_id: string;
  meta_key: string;
  meta_value: string;
}

/**
 * WordPress attachment (media) record
 */
export interface WordPressAttachment {
  ID: string;
  post_author: string;
  guid: string;
  post_mime_type: string;
  post_title: string;
}

/**
 * Complete WordPress export structure (JSON format)
 */
export interface WordPressExport {
  users: WordPressUser[];
  usermeta: WordPressUserMeta[];
  attachments?: WordPressAttachment[];
  site_url?: string;
  export_date?: string;
}

// =============================================================================
// Parsed WordPress Profile
// =============================================================================

/**
 * Parsed WordPress talent profile with all meta fields extracted
 */
export interface ParsedWordPressProfile {
  // User info
  userId: string;
  email: string;
  displayName: string;
  registeredAt: string;

  // Basic info from meta
  firstName?: string;
  lastName?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  birthDate?: string;
  birthPlace?: string;

  // Physical attributes
  height?: number;
  physique?: string;
  ethnicAppearance?: string;
  hairColor?: string;
  eyeColor?: string;
  hairLength?: string;
  beardType?: string;
  hasTattoos?: boolean;
  hasScars?: boolean;
  tattooDescription?: string;
  scarDescription?: string;

  // Skills (arrays)
  languages?: string[];
  accents?: string[];
  athleticSkills?: string[];
  musicalInstruments?: string[];
  performanceSkills?: string[];
  danceStyles?: string[];

  // Media
  photos?: string[];
  videoUrls?: string[];
  presentationVideo?: string;
  showreel?: string;

  // Availability
  isAvailable?: boolean;
  availabilityTypes?: string[];
  dailyRate?: number;
  rateNegotiable?: boolean;

  // Contact and bio
  bio?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  imdbUrl?: string;
  portfolio?: string[];
  socialMedia?: Record<string, string>;
}

// =============================================================================
// Migration Types
// =============================================================================

/**
 * Result of migrating a single user
 */
export interface UserMigrationResult {
  success: boolean;
  legacyId: string;
  newUserId?: string;
  email: string;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Result of migrating a single profile
 */
export interface ProfileMigrationResult {
  success: boolean;
  legacyId: string;
  newProfileId?: string;
  userId: string;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Result of migrating media files
 */
export interface MediaMigrationResult {
  success: boolean;
  sourcePath: string;
  destinationPath?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Complete migration report
 */
export interface MigrationReport {
  startedAt: Date;
  completedAt?: Date;
  dryRun: boolean;

  // Counts
  usersTotal: number;
  usersSucceeded: number;
  usersFailed: number;
  usersSkipped: number;

  profilesTotal: number;
  profilesSucceeded: number;
  profilesFailed: number;
  profilesSkipped: number;

  mediaTotal: number;
  mediaSucceeded: number;
  mediaFailed: number;
  mediaSkipped: number;

  // Detailed results
  userResults: UserMigrationResult[];
  profileResults: ProfileMigrationResult[];
  mediaResults: MediaMigrationResult[];

  // Errors summary
  errors: string[];
  warnings: string[];
}

// =============================================================================
// Validation Types
// =============================================================================

/**
 * Validation issue found in data
 */
export interface ValidationIssue {
  type: 'error' | 'warning';
  field: string;
  message: string;
  legacyId: string;
  value?: unknown;
}

/**
 * Validation result for a single profile
 */
export interface ValidationResult {
  isValid: boolean;
  legacyId: string;
  issues: ValidationIssue[];
}

/**
 * Complete validation report
 */
export interface ValidationReport {
  totalProfiles: number;
  validProfiles: number;
  invalidProfiles: number;
  results: ValidationResult[];
  errorCount: number;
  warningCount: number;
}

// =============================================================================
// Migration Options
// =============================================================================

/**
 * Options for running the migration
 */
export interface MigrationOptions {
  /** Run without making database changes */
  dryRun: boolean;

  /** Path to WordPress export file (JSON) */
  exportFile: string;

  /** Path to WordPress uploads directory (for media) */
  uploadsDir?: string;

  /** Destination directory for migrated media */
  mediaDestination?: string;

  /** Skip users that already exist (by email) */
  skipExisting: boolean;

  /** Force password reset for migrated users */
  forcePasswordReset: boolean;

  /** Batch size for database operations */
  batchSize: number;

  /** Verbose logging */
  verbose: boolean;
}

/**
 * Default migration options
 */
export const DEFAULT_MIGRATION_OPTIONS: MigrationOptions = {
  dryRun: false,
  exportFile: '',
  uploadsDir: undefined,
  mediaDestination: 'public/uploads/migrated',
  skipExisting: true,
  forcePasswordReset: true,
  batchSize: 10,
  verbose: false,
};
