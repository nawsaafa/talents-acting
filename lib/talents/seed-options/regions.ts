// Moroccan region options from legacy WordPress system
// 17 predefined regions + "Out of Morocco" option

export const MOROCCAN_REGIONS = [
  'Grand Casablanca',
  'Rabat-Sale-Zemmour-Zaer',
  'Doukhala-Abda',
  'Tanger-Tetouan',
  'Marrakech-Tensift-Al Haouz',
  'Agadir-Sous-Massa-Draa',
  'Oued Ed-Dahab-Lagouira',
  'Laayoune-Boujdour-Sakia el Hamra',
  'Guelmim-Es Smara',
  'Fes-Boulemane',
  'Meknes-Tafilalet',
  'Oujda-Oriental',
  'Taza-Al Hoceima-Taounate',
  'Tadla-Azilal',
  'Gharb-Chrarda-Beni Hssen',
  'Chaouia-Ouardigha',
  'Out of Morocco',
] as const;

export type MoroccanRegion = (typeof MOROCCAN_REGIONS)[number];

export const MOROCCAN_REGION_OPTIONS = MOROCCAN_REGIONS.map((region) => ({
  value: region,
  label: region,
}));

// Short labels for UI where space is limited
export const MOROCCAN_REGION_SHORT_LABELS: Record<MoroccanRegion, string> = {
  'Grand Casablanca': 'Casablanca',
  'Rabat-Sale-Zemmour-Zaer': 'Rabat-Sale',
  'Doukhala-Abda': 'Doukhala',
  'Tanger-Tetouan': 'Tanger',
  'Marrakech-Tensift-Al Haouz': 'Marrakech',
  'Agadir-Sous-Massa-Draa': 'Agadir',
  'Oued Ed-Dahab-Lagouira': 'Dakhla',
  'Laayoune-Boujdour-Sakia el Hamra': 'Laayoune',
  'Guelmim-Es Smara': 'Guelmim',
  'Fes-Boulemane': 'Fes',
  'Meknes-Tafilalet': 'Meknes',
  'Oujda-Oriental': 'Oujda',
  'Taza-Al Hoceima-Taounate': 'Taza',
  'Tadla-Azilal': 'Beni Mellal',
  'Gharb-Chrarda-Beni Hssen': 'Kenitra',
  'Chaouia-Ouardigha': 'Settat',
  'Out of Morocco': 'International',
};

// Count for validation
export const MOROCCAN_REGION_COUNT = 17;
