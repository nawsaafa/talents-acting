import { OptionCategoryCard } from '@/components/admin/OptionCategoryCard';
import {
  LANGUAGES,
  LANGUAGE_COUNT,
  ATHLETIC_SKILLS,
  ATHLETIC_SKILL_COUNT,
  MUSICAL_INSTRUMENTS,
  MUSICAL_INSTRUMENT_COUNT,
  MUSICAL_INSTRUMENT_GROUPS,
  DANCE_STYLES,
  DANCE_STYLE_COUNT,
  DANCE_STYLE_GROUPS,
  PERFORMANCE_SKILLS,
  PERFORMANCE_SKILL_COUNT,
  ACCENTS,
  ACCENT_COUNT,
  ACCENT_GROUPS,
  MOROCCAN_REGIONS,
  MOROCCAN_REGION_COUNT,
  SEED_OPTION_COUNTS,
} from '@/lib/talents/seed-options';

export default function AdminOptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Options</h1>
          <p className="text-gray-600 mt-1">
            View all predefined options for talent profiles. Total: {SEED_OPTION_COUNTS.total}{' '}
            options across {Object.keys(SEED_OPTION_COUNTS).length - 1} categories.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <OptionCategoryCard title="Languages" count={LANGUAGE_COUNT} options={LANGUAGES} />

        <OptionCategoryCard
          title="Athletic Skills"
          count={ATHLETIC_SKILL_COUNT}
          options={ATHLETIC_SKILLS}
        />

        <OptionCategoryCard
          title="Musical Instruments"
          count={MUSICAL_INSTRUMENT_COUNT}
          options={MUSICAL_INSTRUMENTS}
          groups={MUSICAL_INSTRUMENT_GROUPS}
        />

        <OptionCategoryCard
          title="Dance Styles"
          count={DANCE_STYLE_COUNT}
          options={DANCE_STYLES}
          groups={DANCE_STYLE_GROUPS}
        />

        <OptionCategoryCard
          title="Performance Skills"
          count={PERFORMANCE_SKILL_COUNT}
          options={PERFORMANCE_SKILLS}
        />

        <OptionCategoryCard
          title="Accents"
          count={ACCENT_COUNT}
          options={ACCENTS}
          groups={ACCENT_GROUPS}
        />

        <OptionCategoryCard
          title="Moroccan Regions"
          count={MOROCCAN_REGION_COUNT}
          options={MOROCCAN_REGIONS}
        />
      </div>

      {/* Summary Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{SEED_OPTION_COUNTS.languages}</div>
            <div className="text-sm text-gray-600">Languages</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {SEED_OPTION_COUNTS.athleticSkills}
            </div>
            <div className="text-sm text-gray-600">Athletic Skills</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {SEED_OPTION_COUNTS.musicalInstruments}
            </div>
            <div className="text-sm text-gray-600">Instruments</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{SEED_OPTION_COUNTS.danceStyles}</div>
            <div className="text-sm text-gray-600">Dance Styles</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {SEED_OPTION_COUNTS.performanceSkills}
            </div>
            <div className="text-sm text-gray-600">Performance Skills</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{SEED_OPTION_COUNTS.accents}</div>
            <div className="text-sm text-gray-600">Accents</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {SEED_OPTION_COUNTS.moroccanRegions}
            </div>
            <div className="text-sm text-gray-600">Regions</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">{SEED_OPTION_COUNTS.total}</div>
            <div className="text-sm text-blue-700 font-medium">Total Options</div>
          </div>
        </div>
      </div>
    </div>
  );
}
