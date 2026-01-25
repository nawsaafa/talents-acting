import {
  LANGUAGES,
  LANGUAGE_COUNT,
  ATHLETIC_SKILLS,
  ATHLETIC_SKILL_COUNT,
  MUSICAL_INSTRUMENTS,
  MUSICAL_INSTRUMENT_COUNT,
  DANCE_STYLES,
  DANCE_STYLE_COUNT,
  MOROCCAN_DANCE_STYLES,
  INTERNATIONAL_DANCE_STYLES,
  PERFORMANCE_SKILLS,
  PERFORMANCE_SKILL_COUNT,
  ACCENTS,
  ACCENT_COUNT,
  MOROCCAN_ACCENTS,
  ENGLISH_ACCENTS,
  FRENCH_ACCENTS,
  ARABIC_ACCENTS,
  SPANISH_ACCENTS,
  OTHER_ACCENTS,
  MOROCCAN_REGIONS,
  MOROCCAN_REGION_COUNT,
  SEED_OPTION_COUNTS,
} from '@/lib/talents/seed-options';

describe('Seed Options', () => {
  describe('Languages', () => {
    it('should have correct count', () => {
      expect(LANGUAGES.length).toBe(LANGUAGE_COUNT);
      expect(LANGUAGES.length).toBe(8);
    });

    it('should have no duplicates', () => {
      const unique = new Set(LANGUAGES);
      expect(unique.size).toBe(LANGUAGES.length);
    });

    it('should include key Morocco languages', () => {
      expect(LANGUAGES).toContain('Moroccan Darija');
      expect(LANGUAGES).toContain('Arabic');
      expect(LANGUAGES).toContain('French');
      expect(LANGUAGES).toContain('English');
      expect(LANGUAGES).toContain('Berber');
    });
  });

  describe('Athletic Skills', () => {
    it('should have correct count', () => {
      expect(ATHLETIC_SKILLS.length).toBe(ATHLETIC_SKILL_COUNT);
      expect(ATHLETIC_SKILLS.length).toBe(29);
    });

    it('should have no duplicates', () => {
      const unique = new Set(ATHLETIC_SKILLS);
      expect(unique.size).toBe(ATHLETIC_SKILLS.length);
    });

    it('should include common film skills', () => {
      expect(ATHLETIC_SKILLS).toContain('Swimming');
      expect(ATHLETIC_SKILLS).toContain('Horse Riding');
      expect(ATHLETIC_SKILLS).toContain('Martial Arts');
      expect(ATHLETIC_SKILLS).toContain('Fencing');
    });
  });

  describe('Musical Instruments', () => {
    it('should have correct count', () => {
      expect(MUSICAL_INSTRUMENTS.length).toBe(MUSICAL_INSTRUMENT_COUNT);
      expect(MUSICAL_INSTRUMENTS.length).toBe(28);
    });

    it('should have no duplicates', () => {
      const unique = new Set(MUSICAL_INSTRUMENTS);
      expect(unique.size).toBe(MUSICAL_INSTRUMENTS.length);
    });

    it('should include traditional Moroccan instruments', () => {
      expect(MUSICAL_INSTRUMENTS).toContain('Oud');
      expect(MUSICAL_INSTRUMENTS).toContain('Bendir');
      expect(MUSICAL_INSTRUMENTS).toContain('Guembri');
      expect(MUSICAL_INSTRUMENTS).toContain('Qraqeb');
    });
  });

  describe('Dance Styles', () => {
    it('should have correct count', () => {
      expect(DANCE_STYLES.length).toBe(DANCE_STYLE_COUNT);
      expect(DANCE_STYLES.length).toBe(33);
    });

    it('should have no duplicates', () => {
      const unique = new Set(DANCE_STYLES);
      expect(unique.size).toBe(DANCE_STYLES.length);
    });

    it('should include 6 Moroccan traditional dances', () => {
      expect(MOROCCAN_DANCE_STYLES).toContain('Ahidous');
      expect(MOROCCAN_DANCE_STYLES).toContain('Ahwach');
      expect(MOROCCAN_DANCE_STYLES).toContain('Chaabi');
      expect(MOROCCAN_DANCE_STYLES).toContain('Gnawa');
      expect(MOROCCAN_DANCE_STYLES).toContain('Guedra');
      expect(MOROCCAN_DANCE_STYLES).toContain('Reggada');
      expect(MOROCCAN_DANCE_STYLES.length).toBe(6);
    });

    it('should combine Moroccan and international styles', () => {
      expect(DANCE_STYLES.length).toBe(
        MOROCCAN_DANCE_STYLES.length + INTERNATIONAL_DANCE_STYLES.length
      );
    });
  });

  describe('Performance Skills', () => {
    it('should have correct count', () => {
      expect(PERFORMANCE_SKILLS.length).toBe(PERFORMANCE_SKILL_COUNT);
      expect(PERFORMANCE_SKILLS.length).toBe(25);
    });

    it('should have no duplicates', () => {
      const unique = new Set(PERFORMANCE_SKILLS);
      expect(unique.size).toBe(PERFORMANCE_SKILLS.length);
    });

    it('should include key performance skills', () => {
      expect(PERFORMANCE_SKILLS).toContain('Stand-up Comedy');
      expect(PERFORMANCE_SKILLS).toContain('Improvisation');
      expect(PERFORMANCE_SKILLS).toContain('Voice Acting');
      expect(PERFORMANCE_SKILLS).toContain('Stage Combat');
      expect(PERFORMANCE_SKILLS).toContain('Mo-Cap');
    });
  });

  describe('Accents', () => {
    it('should have correct count', () => {
      expect(ACCENTS.length).toBe(ACCENT_COUNT);
      expect(ACCENTS.length).toBe(72);
    });

    it('should have no duplicates', () => {
      const unique = new Set(ACCENTS);
      expect(unique.size).toBe(ACCENTS.length);
    });

    it('should include Moroccan regional accents', () => {
      expect(MOROCCAN_ACCENTS).toContain('Casaoui');
      expect(MOROCCAN_ACCENTS).toContain('Rbati');
      expect(MOROCCAN_ACCENTS).toContain('Marrakchi');
      expect(MOROCCAN_ACCENTS.length).toBe(7);
    });

    it('should have correct regional group counts', () => {
      expect(ENGLISH_ACCENTS.length).toBe(8);
      expect(FRENCH_ACCENTS.length).toBe(7);
      expect(ARABIC_ACCENTS.length).toBe(10);
      expect(SPANISH_ACCENTS.length).toBe(5);
    });

    it('should combine all regional groups', () => {
      const totalFromGroups =
        MOROCCAN_ACCENTS.length +
        ENGLISH_ACCENTS.length +
        FRENCH_ACCENTS.length +
        ARABIC_ACCENTS.length +
        SPANISH_ACCENTS.length +
        OTHER_ACCENTS.length;
      expect(ACCENTS.length).toBe(totalFromGroups);
    });
  });

  describe('Moroccan Regions', () => {
    it('should have correct count', () => {
      expect(MOROCCAN_REGIONS.length).toBe(MOROCCAN_REGION_COUNT);
      expect(MOROCCAN_REGIONS.length).toBe(17);
    });

    it('should have no duplicates', () => {
      const unique = new Set(MOROCCAN_REGIONS);
      expect(unique.size).toBe(MOROCCAN_REGIONS.length);
    });

    it('should include major cities/regions', () => {
      expect(MOROCCAN_REGIONS).toContain('Grand Casablanca');
      expect(MOROCCAN_REGIONS).toContain('Rabat-Sale-Zemmour-Zaer');
      expect(MOROCCAN_REGIONS).toContain('Marrakech-Tensift-Al Haouz');
      expect(MOROCCAN_REGIONS).toContain('Tanger-Tetouan');
    });

    it('should include Out of Morocco option', () => {
      expect(MOROCCAN_REGIONS).toContain('Out of Morocco');
    });
  });

  describe('Summary Counts', () => {
    it('should match actual array lengths', () => {
      expect(SEED_OPTION_COUNTS.languages).toBe(LANGUAGES.length);
      expect(SEED_OPTION_COUNTS.athleticSkills).toBe(ATHLETIC_SKILLS.length);
      expect(SEED_OPTION_COUNTS.musicalInstruments).toBe(MUSICAL_INSTRUMENTS.length);
      expect(SEED_OPTION_COUNTS.danceStyles).toBe(DANCE_STYLES.length);
      expect(SEED_OPTION_COUNTS.performanceSkills).toBe(PERFORMANCE_SKILLS.length);
      expect(SEED_OPTION_COUNTS.accents).toBe(ACCENTS.length);
      expect(SEED_OPTION_COUNTS.moroccanRegions).toBe(MOROCCAN_REGIONS.length);
    });

    it('should have correct total', () => {
      const calculatedTotal =
        LANGUAGES.length +
        ATHLETIC_SKILLS.length +
        MUSICAL_INSTRUMENTS.length +
        DANCE_STYLES.length +
        PERFORMANCE_SKILLS.length +
        ACCENTS.length +
        MOROCCAN_REGIONS.length;
      expect(SEED_OPTION_COUNTS.total).toBe(calculatedTotal);
      expect(SEED_OPTION_COUNTS.total).toBe(212);
    });
  });

  describe('ASCII Encoding', () => {
    const allOptions = [
      ...LANGUAGES,
      ...ATHLETIC_SKILLS,
      ...MUSICAL_INSTRUMENTS,
      ...DANCE_STYLES,
      ...PERFORMANCE_SKILLS,
      ...ACCENTS,
      ...MOROCCAN_REGIONS,
    ];

    it('should only contain ASCII characters', () => {
      allOptions.forEach((option) => {
        // Check if string contains only ASCII characters (0-127)
         
        const isAscii = /^[\x00-\x7F]*$/.test(option);
        expect(isAscii).toBe(true);
      });
    });

    it('should not contain special Unicode characters', () => {
      allOptions.forEach((option) => {
        // No Arabic, French diacritics, etc.
        expect(option).not.toMatch(/[\u0600-\u06FF]/); // Arabic
        expect(option).not.toMatch(/[\u00C0-\u00FF]/); // Latin Extended
      });
    });
  });
});
