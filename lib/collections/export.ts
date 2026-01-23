import { Gender, Physique } from '@prisma/client';
import type { CollectionWithTalents, CollectionExportData } from './types';

// Gender labels for export
const GENDER_LABELS: Record<Gender, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

// Physique labels for export
const PHYSIQUE_LABELS: Record<Physique, string> = {
  SLIM: 'Slim',
  AVERAGE: 'Average',
  ATHLETIC: 'Athletic',
  MUSCULAR: 'Muscular',
  CURVY: 'Curvy',
  PLUS_SIZE: 'Plus Size',
};

/**
 * Convert collection data to export format
 */
export function prepareExportData(collection: CollectionWithTalents): CollectionExportData {
  return {
    collectionName: collection.name,
    exportedAt: new Date().toISOString(),
    talents: collection.talents.map((talent) => ({
      firstName: talent.firstName,
      gender: GENDER_LABELS[talent.gender],
      ageRange: `${talent.ageRangeMin}-${talent.ageRangeMax}`,
      location: talent.location || '',
      physique: talent.physique ? PHYSIQUE_LABELS[talent.physique] : '',
    })),
  };
}

/**
 * Escape a value for CSV format
 */
function escapeCSVValue(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Generate CSV string from collection data
 */
export function generateCSV(collection: CollectionWithTalents): string {
  const exportData = prepareExportData(collection);
  const lines: string[] = [];

  // Add header comment with metadata
  lines.push(`# Collection: ${escapeCSVValue(exportData.collectionName)}`);
  lines.push(`# Exported: ${exportData.exportedAt}`);
  lines.push(`# Talents: ${exportData.talents.length}`);
  lines.push('');

  // Add CSV header
  const headers = ['Name', 'Gender', 'Age Range', 'Location', 'Physique'];
  lines.push(headers.join(','));

  // Add talent rows
  for (const talent of exportData.talents) {
    const row = [
      escapeCSVValue(talent.firstName),
      escapeCSVValue(talent.gender),
      escapeCSVValue(talent.ageRange),
      escapeCSVValue(talent.location),
      escapeCSVValue(talent.physique),
    ];
    lines.push(row.join(','));
  }

  return lines.join('\n');
}

/**
 * Generate filename for CSV export
 */
export function generateExportFilename(collectionName: string): string {
  // Sanitize collection name for filename
  const sanitized = collectionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const date = new Date().toISOString().split('T')[0];
  return `collection-${sanitized}-${date}.csv`;
}
