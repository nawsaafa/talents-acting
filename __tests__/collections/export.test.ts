import { describe, it, expect } from 'vitest';
import { prepareExportData, generateCSV, generateExportFilename } from '@/lib/collections/export';
import type { CollectionWithTalents } from '@/lib/collections/types';

// Helper to create mock collection data
function createMockCollection(
  name: string,
  talents: Array<{
    firstName: string;
    gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';
    ageRangeMin: number;
    ageRangeMax: number;
    location?: string;
    physique?: 'SLIM' | 'AVERAGE' | 'ATHLETIC' | 'MUSCULAR' | 'CURVY' | 'PLUS_SIZE';
  }>
): CollectionWithTalents {
  return {
    id: 'collection-123',
    name,
    description: 'Test collection',
    ownerId: 'owner-456',
    talents: talents.map((t, i) => ({
      id: `talent-${i}`,
      talentProfileId: `profile-${i}`,
      firstName: t.firstName,
      photo: null,
      gender: t.gender,
      ageRangeMin: t.ageRangeMin,
      ageRangeMax: t.ageRangeMax,
      location: t.location || null,
      physique: t.physique || null,
      addedAt: new Date(),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('prepareExportData', () => {
  it('should prepare export data with correct structure', () => {
    const collection = createMockCollection('Test Collection', [
      {
        firstName: 'John',
        gender: 'MALE',
        ageRangeMin: 25,
        ageRangeMax: 35,
        location: 'Casablanca',
      },
    ]);

    const result = prepareExportData(collection);

    expect(result.collectionName).toBe('Test Collection');
    expect(result.exportedAt).toBeDefined();
    expect(result.talents).toHaveLength(1);
    expect(result.talents[0]).toEqual({
      firstName: 'John',
      gender: 'Male',
      ageRange: '25-35',
      location: 'Casablanca',
      physique: '',
    });
  });

  it('should transform gender enum to labels', () => {
    const collection = createMockCollection('Test', [
      { firstName: 'A', gender: 'MALE', ageRangeMin: 20, ageRangeMax: 30 },
      { firstName: 'B', gender: 'FEMALE', ageRangeMin: 20, ageRangeMax: 30 },
      { firstName: 'C', gender: 'NON_BINARY', ageRangeMin: 20, ageRangeMax: 30 },
      { firstName: 'D', gender: 'OTHER', ageRangeMin: 20, ageRangeMax: 30 },
    ]);

    const result = prepareExportData(collection);

    expect(result.talents[0].gender).toBe('Male');
    expect(result.talents[1].gender).toBe('Female');
    expect(result.talents[2].gender).toBe('Non-Binary');
    expect(result.talents[3].gender).toBe('Other');
  });

  it('should transform physique enum to labels', () => {
    const collection = createMockCollection('Test', [
      { firstName: 'A', gender: 'MALE', ageRangeMin: 20, ageRangeMax: 30, physique: 'SLIM' },
      { firstName: 'B', gender: 'MALE', ageRangeMin: 20, ageRangeMax: 30, physique: 'ATHLETIC' },
      { firstName: 'C', gender: 'MALE', ageRangeMin: 20, ageRangeMax: 30, physique: 'PLUS_SIZE' },
    ]);

    const result = prepareExportData(collection);

    expect(result.talents[0].physique).toBe('Slim');
    expect(result.talents[1].physique).toBe('Athletic');
    expect(result.talents[2].physique).toBe('Plus Size');
  });

  it('should handle empty collections', () => {
    const collection = createMockCollection('Empty Collection', []);

    const result = prepareExportData(collection);

    expect(result.collectionName).toBe('Empty Collection');
    expect(result.talents).toHaveLength(0);
  });

  it('should handle missing optional fields', () => {
    const collection = createMockCollection('Test', [
      { firstName: 'Test', gender: 'MALE', ageRangeMin: 20, ageRangeMax: 25 },
    ]);

    const result = prepareExportData(collection);

    expect(result.talents[0].location).toBe('');
    expect(result.talents[0].physique).toBe('');
  });
});

describe('generateCSV', () => {
  it('should generate valid CSV with headers', () => {
    const collection = createMockCollection('Test Collection', [
      { firstName: 'John', gender: 'MALE', ageRangeMin: 25, ageRangeMax: 35 },
    ]);

    const csv = generateCSV(collection);

    expect(csv).toContain('# Collection: Test Collection');
    expect(csv).toContain('# Talents: 1');
    expect(csv).toContain('Name,Gender,Age Range,Location,Physique');
    expect(csv).toContain('John,Male,25-35');
  });

  it('should escape commas in values', () => {
    const collection = createMockCollection('Test', [
      { firstName: 'John, Jr.', gender: 'MALE', ageRangeMin: 20, ageRangeMax: 30 },
    ]);

    const csv = generateCSV(collection);

    expect(csv).toContain('"John, Jr."');
  });

  it('should escape quotes in values', () => {
    const collection = createMockCollection('Test "Special"', []);

    const csv = generateCSV(collection);

    expect(csv).toContain('"Test ""Special"""');
  });

  it('should handle newlines in values', () => {
    const collection = createMockCollection('Test\nCollection', []);

    const csv = generateCSV(collection);

    expect(csv).toContain('"Test\nCollection"');
  });

  it('should generate CSV for multiple talents', () => {
    const collection = createMockCollection('Test', [
      { firstName: 'Alice', gender: 'FEMALE', ageRangeMin: 20, ageRangeMax: 25 },
      { firstName: 'Bob', gender: 'MALE', ageRangeMin: 30, ageRangeMax: 40 },
      { firstName: 'Charlie', gender: 'NON_BINARY', ageRangeMin: 25, ageRangeMax: 35 },
    ]);

    const csv = generateCSV(collection);
    const lines = csv.split('\n');

    // Header comment lines + empty line + header + 3 talents
    expect(
      lines.filter((l) => l.startsWith('Alice') || l.startsWith('Bob') || l.startsWith('Charlie'))
    ).toHaveLength(3);
  });

  it('should handle empty collection', () => {
    const collection = createMockCollection('Empty', []);

    const csv = generateCSV(collection);

    expect(csv).toContain('# Collection: Empty');
    expect(csv).toContain('# Talents: 0');
    expect(csv).toContain('Name,Gender,Age Range,Location,Physique');
  });
});

describe('generateExportFilename', () => {
  it('should generate filename with sanitized collection name', () => {
    const filename = generateExportFilename('My Collection');

    expect(filename).toMatch(/^collection-my-collection-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it('should handle special characters in name', () => {
    const filename = generateExportFilename('Test @#$% Collection!');

    expect(filename).toMatch(/^collection-test-collection-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it('should handle consecutive special characters', () => {
    const filename = generateExportFilename('Test---Collection');

    expect(filename).toMatch(/^collection-test-collection-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it('should handle leading/trailing special characters', () => {
    const filename = generateExportFilename('---Test---');

    expect(filename).toMatch(/^collection-test-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it('should handle unicode characters', () => {
    const filename = generateExportFilename('Casting Paris');

    expect(filename).toMatch(/^collection-casting-paris-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it('should lowercase the name', () => {
    const filename = generateExportFilename('UPPERCASE NAME');

    expect(filename).toContain('uppercase-name');
  });

  it('should include current date', () => {
    const filename = generateExportFilename('Test');
    const today = new Date().toISOString().split('T')[0];

    expect(filename).toContain(today);
  });
});
