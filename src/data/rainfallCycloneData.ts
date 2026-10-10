export type WeatherMode = 'light_rain' | 'heavy_rain' | 'monsoon' | 'cyclone';

export interface HistoricalWeatherEvent {
  id: string;
  year: number;
  name: string;
  type: 'cyclone' | 'monsoon' | 'cloudburst';
  category?: string;
  magnitudeLabel: string;
  rainfallMm: number;
  surgeMeters: number;
  casualties: string;
  affectedPeople: string;
  damageCost: string;
  summary: string;
  affectedDistrictIds: string[];
}

export interface FutureClimatePrediction {
  year: number;
  title: string;
  projectedRainIncreasePercent: number;
  projectedSurgeIncreaseMeters: number;
  cycloneIntensity: string;
  riskSummary: string;
  vulnerableDistrictCount: number;
  settings: {
    mode: WeatherMode;
    rainMagnitudeMm: number;
    cycloneCategory: number;
  };
}

// 8 Landmark Historical Weather Calamities in Bangladesh
export const HISTORICAL_WEATHER_EVENTS: HistoricalWeatherEvent[] = [
  {
    id: 'bhola-1970',
    year: 1970,
    name: '1970 Great Bhola Cyclone',
    type: 'cyclone',
    category: 'Category 4 Super Cyclone',
    magnitudeLabel: 'Cat 4 · 225 km/h · 9.0m Tidal Surge',
    rainfallMm: 280,
    surgeMeters: 9.0,
    casualties: '300,000 - 500,000 deaths (Deadliest in human history)',
    affectedPeople: '10,000,000 affected',
    damageCost: '$86.4M USD (1970)',
    summary: 'A monster storm surge overwhelmed low-lying islands of the Ganges Delta, drowning entire populations on Bhola Island, Hatia, and coastal Barishal.',
    affectedDistrictIds: [
      'bhola', 'patuakhali', 'barguna', 'barishal', 'pirojpur', 'jhalokathi',
      'noakhali', 'lakshmipur', 'chattogram', 'coxsbazar', 'chandpur', 'feni'
    ]
  },
  {
    id: 'monsoon-1988',
    year: 1988,
    name: '1988 Mega-Monsoon Confluence Deluge',
    type: 'monsoon',
    magnitudeLabel: 'Continuous 4-week deluge · 1.4m river crest above danger',
    rainfallMm: 450,
    surgeMeters: 1.5,
    casualties: '2,379 deaths',
    affectedPeople: '45,000,000 affected (60% country submerged)',
    damageCost: '$2.1 Billion USD',
    summary: 'Synchronized cresting of the Brahmaputra, Ganges, and Meghna inundated Dhaka Airport and severed highway links, prompting the global Flood Action Plan.',
    affectedDistrictIds: [
      'dhaka', 'gazipur', 'narayanganj', 'munshiganj', 'manikganj', 'faridpur', 'madaripur',
      'shariatpur', 'rajbari', 'sirajganj', 'pabna', 'bogura', 'tangail', 'chandpur',
      'sunamganj', 'netrokona', 'kishoreganj', 'kurigram', 'gaibandha', 'jamalpur'
    ]
  },
  {
    id: 'gorky-1991',
    year: 1991,
    name: '1991 Super Cyclone Gorky',
    type: 'cyclone',
    category: 'Category 5 Super Cyclone',
    magnitudeLabel: 'Cat 5 · 260 km/h · 6.1m Tidal Surge',
    rainfallMm: 320,
    surgeMeters: 6.1,
    casualties: '138,866 deaths',
    affectedPeople: '15,000,000 homeless',
    damageCost: '$1.78 Billion USD',
    summary: 'Hit Chittagong and coastal islands at high tide. The 6-meter surge breached massive dikes, destroyed industrial zones, and beached naval vessels.',
    affectedDistrictIds: [
      'chattogram', 'coxsbazar', 'noakhali', 'feni', 'lakshmipur', 'bhola',
      'rangamati', 'bandarban', 'khagrachhari', 'chandpur', 'barishal'
    ]
  },
  {
    id: 'monsoon-1998',
    year: 1998,
    name: '1998 70-Day Record Super Deluge',
    type: 'monsoon',
    magnitudeLabel: '75 consecutive days submerged · 68% territory under water',
    rainfallMm: 520,
    surgeMeters: 2.2,
    casualties: '1,050 deaths',
    affectedPeople: '31,000,000 displaced',
    damageCost: '$3.4 Billion USD',
    summary: 'The longest flood in national records. Over two-thirds of Bangladesh remained submerged as 2 million tons of rice crops were destroyed.',
    affectedDistrictIds: [
      'dhaka', 'narayanganj', 'gazipur', 'munshiganj', 'manikganj', 'faridpur', 'madaripur',
      'shariatpur', 'rajbari', 'gopalganj', 'sirajganj', 'pabna', 'bogura', 'tangail',
      'chandpur', 'sunamganj', 'netrokona', 'kishoreganj', 'habiganj', 'moulvibazar',
      'kurigram', 'gaibandha', 'jamalpur', 'sherpur', 'brahmanbaria', 'cumilla'
    ]
  },
  {
    id: 'sidr-2007',
    year: 2007,
    name: '2007 Cyclone Sidr',
    type: 'cyclone',
    category: 'Category 5 Cyclone',
    magnitudeLabel: 'Cat 5 · 260 km/h · 5.5m Surge',
    rainfallMm: 290,
    surgeMeters: 5.5,
    casualties: '4,234 deaths (thousands saved by shelters)',
    affectedPeople: '8,900,000 affected',
    damageCost: '$1.7 Billion USD',
    summary: 'Slammed the Sundarbans mangrove reserve and southwestern delta. 4,000 shelters built after 1991 prevented high casualties.',
    affectedDistrictIds: [
      'bagerhat', 'barguna', 'patuakhali', 'pirojpur', 'jhalokathi', 'barishal',
      'satkhira', 'khulna', 'bhola', 'jhenaidah', 'magura', 'narail'
    ]
  },
  {
    id: 'aila-2009',
    year: 2009,
    name: '2009 Cyclone Aila',
    type: 'cyclone',
    category: 'Category 1 Severe Cyclonic Storm',
    magnitudeLabel: 'Cat 1 · 120 km/h · 3.5m Saline Surge',
    rainfallMm: 240,
    surgeMeters: 3.5,
    casualties: '190 deaths',
    affectedPeople: '3,900,000 affected',
    damageCost: '$1.0 Billion USD',
    summary: 'Prolonged saltwater inundation washed away coastal polders in Satkhira and Khulna, salinizing agricultural soil for over two years.',
    affectedDistrictIds: ['satkhira', 'khulna', 'bagerhat', 'barguna', 'patuakhali', 'pirojpur']
  },
  {
    id: 'amphan-2020',
    year: 2020,
    name: '2020 Super Cyclone Amphan',
    type: 'cyclone',
    category: 'Category 5 Cyclone',
    magnitudeLabel: 'Cat 5 · 260 km/h · 4.8m Surge',
    rainfallMm: 260,
    surgeMeters: 4.8,
    casualties: '31 deaths',
    affectedPeople: '10,000,000 affected',
    damageCost: '$1.5 Billion USD',
    summary: 'Made landfall during COVID-19 pandemic. Successful evacuation of 2.4 million citizens into shelters averted major fatalities.',
    affectedDistrictIds: [
      'satkhira', 'khulna', 'bagerhat', 'jashore', 'barguna', 'patuakhali',
      'pirojpur', 'barishal', 'bhola', 'chuadanga', 'jhenaidah'
    ]
  },
  {
    id: 'remal-2024',
    year: 2024,
    name: '2024 Cyclone Remal & Feni Cloudburst',
    type: 'cloudburst',
    category: 'Category 1 Cyclone & Transboundary Flash Deluge',
    magnitudeLabel: 'Cat 1 · 135 km/h · 3.2m Surge & 550mm Cloudburst',
    rainfallMm: 550,
    surgeMeters: 3.2,
    casualties: '71 deaths',
    affectedPeople: '5,800,000 stranded',
    damageCost: '$1.2 Billion USD',
    summary: 'Triggered unprecedented upstream flash floods across Feni, Cumilla, and Noakhali, alongside coastal tidal surge inundations.',
    affectedDistrictIds: [
      'feni', 'cumilla', 'noakhali', 'lakshmipur', 'brahmanbaria', 'chattogram',
      'coxsbazar', 'chandpur', 'patuakhali', 'barguna', 'bhola'
    ]
  }
];

// Predictive Future Scenarios based on IPCC AR6 and BMD (Bangladesh Meteorological Department)
export const FUTURE_CLIMATE_PREDICTIONS: FutureClimatePrediction[] = [
  {
    year: 2030,
    title: '2030 Accelerated Monsoon Flash Inundations',
    projectedRainIncreasePercent: 12,
    projectedSurgeIncreaseMeters: 0.4,
    cycloneIntensity: '+10% wind speed / Category 3 frequency surge',
    riskSummary: 'Increased pre-monsoon cloudburst frequency in Meghalaya/Assam upstream catchments increases flash flood risk in Haor basins by 45%.',
    vulnerableDistrictCount: 22,
    settings: {
      mode: 'heavy_rain',
      rainMagnitudeMm: 160,
      cycloneCategory: 2
    }
  },
  {
    year: 2050,
    title: '2050 Global Warming Deluge & High-Tide Surges',
    projectedRainIncreasePercent: 22,
    projectedSurgeIncreaseMeters: 1.2,
    cycloneIntensity: 'Category 4 & 5 Bay of Bengal storm frequency +35%',
    riskSummary: 'Higher baseline sea surface temperatures fuel rapid cyclone intensification. Storm surges push 35 km farther inland into Barishal and Khulna.',
    vulnerableDistrictCount: 36,
    settings: {
      mode: 'cyclone',
      rainMagnitudeMm: 310,
      cycloneCategory: 4
    }
  },
  {
    year: 2075,
    title: '2075 Extended Triple-Basin Monsoon Torrent',
    projectedRainIncreasePercent: 28,
    projectedSurgeIncreaseMeters: 1.8,
    cycloneIntensity: 'Super Cyclone surges reaching 6.5m peak',
    riskSummary: 'Ganges, Jamuna, and Meghna river basins experience overlapping 90-day crests, putting delta cities under recurring waterlogging.',
    vulnerableDistrictCount: 46,
    settings: {
      mode: 'monsoon',
      rainMagnitudeMm: 460,
      cycloneCategory: 4
    }
  },
  {
    year: 2100,
    title: '2100 Extreme Compound Deluge & Megacyclone',
    projectedRainIncreasePercent: 35,
    projectedSurgeIncreaseMeters: 2.6,
    cycloneIntensity: 'Category 5+ Megacyclones with 8m+ storm walls',
    riskSummary: 'Compound disaster scenario: catastrophic 500mm+ precipitation coincided with extreme Bay of Bengal cyclone surge submerging 56 of 64 districts.',
    vulnerableDistrictCount: 56,
    settings: {
      mode: 'cyclone',
      rainMagnitudeMm: 580,
      cycloneCategory: 5
    }
  }
];

export interface ResearchSource {
  title: string;
  organization: string;
  year: string;
  keyFinding: string;
}

// Authoritative scientific research sources on Bangladesh meteorology and flood hydrology
export const SCIENTIFIC_RESEARCH_SOURCES: ResearchSource[] = [
  {
    title: 'Daily Precipitation Thresholds & Meteorological Standards',
    organization: 'Bangladesh Meteorological Department (BMD), Ministry of Defence',
    year: '2023',
    keyFinding: 'Light Rain (1–10 mm/day) and Moderate Rain (11–22 mm/day) produce 0% flood hazard in Bangladesh; precipitation is fully absorbed by agricultural soils, river khals, and wetlands. Heavy rain is classified at 44–88 mm/day, and Very Heavy rain at >88 mm/day.'
  },
  {
    title: 'Annual Flood Hydrology & Inundation Reports (1954–2024)',
    organization: 'Flood Forecasting and Warning Centre (FFWC), Bangladesh Water Development Board (BWDB)',
    year: '2024',
    keyFinding: 'Normal seasonal monsoon floods cover 20–22% of Bangladesh’s floodplain. Widespread inundations (e.g. 1988, 1998) are driven by transboundary river confluence (Brahmaputra, Ganges, Meghna draining catchments 12x larger than Bangladesh), not local rainfall alone.'
  },
  {
    title: 'Mathematical Modelling of Coastal Storm Surges in the Bay of Bengal',
    organization: 'Institute of Water Modelling (IWM) & CEGIS, Dhaka',
    year: '2022',
    keyFinding: 'Cyclonic storm surges are strictly confined to the coastal belt and estuarine islands (Cat 1: 1.4m surge, Cat 3: 3.8m, Cat 5: 6–9m), submerging between 2.5% to 20% of coastal land. High northern and western inland elevations remain completely dry.'
  },
  {
    title: 'IPCC Sixth Assessment Report (AR6) - Chapter 10: Asia & Cross-Chapter Delta Paper',
    organization: 'Intergovernmental Panel on Climate Change (IPCC)',
    year: '2022',
    keyFinding: 'Extreme pre-monsoon cloudbursts in upstream Meghalaya/Assam catchments cause localized flash flooding in Haor basins; compound sea level rise increases coastal polder salinity and surge exposure.'
  },
  {
    title: 'Disaster Management Reference Handbook - Bangladesh',
    organization: 'Ministry of Disaster Management and Relief (MoDMR) & CFE-DM',
    year: '2023',
    keyFinding: 'Detailed empirical fatality and displacement data from 1970 Bhola, 1991 Gorky, 2007 Sidr, and 2024 Remal, demonstrating that modern multi-purpose cyclone shelters have reduced mortality rates by over 95%.'
  }
];

// District IDs grouped by natural hydrological vulnerability
export const HAOR_BASIN_DISTRICTS = ['sunamganj', 'netrokona', 'kishoreganj', 'habiganj', 'sylhet', 'moulvibazar'];

export const NORTHERN_TISTA_JAMUNA_DISTRICTS = [
  'kurigram', 'gaibandha', 'lalmonirhat', 'nilphamari', 'rangpur',
  'bogura', 'sirajganj', 'jamalpur', 'sherpur', 'pabna'
];

export const CENTRAL_CONFLUENCE_DISTRICTS = [
  'dhaka', 'narayanganj', 'gazipur', 'manikganj', 'munshiganj',
  'faridpur', 'madaripur', 'shariatpur', 'rajbari', 'gopalganj', 'chandpur'
];

export const COASTAL_CYCLONE_SURGE_DISTRICTS = [
  'barguna', 'patuakhali', 'bhola', 'pirojpur', 'jhalokathi', 'barishal',
  'satkhira', 'khulna', 'bagerhat', 'noakhali', 'lakshmipur', 'feni',
  'chattogram', 'coxsbazar'
];

export const EASTERN_HILL_TRACTS = ['khagrachhari', 'rangamati', 'bandarban', 'coxsbazar'];

// Mountainous and steep foothill districts with high vulnerability to intense downpours,
// mountain torrents (Pahari Dhol), valley flash floods, and landslides/mudslides
export const MOUNTAINOUS_DOWNPOUR_DISTRICTS = [
  'bandarban',
  'rangamati',
  'khagrachhari',
  'coxsbazar',
  'chattogram',
  'sylhet',
  'moulvibazar',
  'habiganj',
  'sunamganj',
  'netrokona',
  'sherpur'
];

/**
 * Scientifically calibrated flood calculation based on BMD, FFWC, and IWM hydrological records.
 * - Light rain (10–40mm): 0% flooding, 0 districts. Normal absorption.
 * - Heavy rain (44–200mm): Mountainous downpours trigger flash floods & landslide risk (1.8% - 8.5% area).
 * - Monsoon deluge (150–600mm): Major river confluence inundation (18% normal to 65% extreme).
 * - Cyclone (Cat 1–5): Coastal storm surges confined to southern Bay of Bengal coast (2.5% - 20% area).
 */
export function calculateWeatherFloodImpact(
  mode: WeatherMode,
  rainMagnitudeMm: number,
  cycloneCategory: number
) {
  const atRiskDistricts = new Set<string>();
  const floodedZones = new Set<string>();
  let equivalentSurgeMeters = 0;
  let dangerLevel: 'Low' | 'Moderate' | 'Severe' | 'Catastrophic' = 'Low';
  let floodedPercent = 0;

  if (mode === 'light_rain') {
    // Light rain: 10 - 40 mm/day
    // BMD standard: Normal daily shower. 100% absorbed by soils, agricultural fields, and river khals.
    // ZERO riverine flood, ZERO coastal surge, ZERO districts at risk.
    dangerLevel = 'Low';
    equivalentSurgeMeters = 0;
    floodedPercent = 0.0;
    // atRiskDistricts and floodedZones remain strictly empty!
  } else if (mode === 'heavy_rain') {
    // Heavy rain: 44 - 200 mm/day (BMD standard: Heavy 44-88mm, Very Heavy >88mm)
    // No massive regional river submersion (floodedZones remains empty), but steep mountainous
    // catchments and low-lying haor depressions face localized flash flood torrents ("Pahari Dhol")
    // marked with careful exclamation alerts and localized water accumulation circles.
    if (rainMagnitudeMm <= 70) {
      dangerLevel = 'Moderate';
      equivalentSurgeMeters = 0.4;
      floodedPercent = 1.2;
      [
        'sunamganj', 'sylhet', 'netrokona', 'bandarban', 'rangamati', 'coxsbazar'
      ].forEach((id) => atRiskDistricts.add(id));
    } else if (rainMagnitudeMm <= 120) {
      dangerLevel = 'Severe';
      equivalentSurgeMeters = 0.8;
      floodedPercent = 2.4;
      [
        'sunamganj', 'sylhet', 'netrokona', 'moulvibazar', 'habiganj',
        'bandarban', 'rangamati', 'khagrachhari', 'coxsbazar', 'chattogram',
        'kurigram', 'sherpur'
      ].forEach((id) => atRiskDistricts.add(id));
    } else {
      dangerLevel = 'Catastrophic';
      equivalentSurgeMeters = 1.4;
      floodedPercent = 4.2;
      [
        'sunamganj', 'sylhet', 'netrokona', 'moulvibazar', 'habiganj',
        'bandarban', 'rangamati', 'khagrachhari', 'coxsbazar', 'chattogram',
        'kurigram', 'gaibandha', 'lalmonirhat', 'sherpur', 'feni',
        'sirajganj', 'bogura'
      ].forEach((id) => atRiskDistricts.add(id));
    }
  } else if (mode === 'monsoon') {
    // Monsoon Deluge: 150 - 600 mm accumulated precipitation + transboundary river confluence
    // FFWC standard: Normal monsoon ~20-22%, High ~35%, Extreme (1988/1998) 60-68%
    if (rainMagnitudeMm <= 250) {
      // Moderate early monsoon
      dangerLevel = 'Moderate';
      equivalentSurgeMeters = 1.2;
      HAOR_BASIN_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      ['kurigram', 'gaibandha', 'sirajganj', 'jamalpur'].forEach((id) => atRiskDistricts.add(id));
      floodedPercent = Number((16 + ((rainMagnitudeMm - 150) / 100) * 6).toFixed(1)); // 16% - 22%
    } else if (rainMagnitudeMm <= 380) {
      // Peak seasonal monsoon
      dangerLevel = 'Severe';
      equivalentSurgeMeters = 1.8;
      floodedZones.add('0-3'); // low coastal shelf & lowest depression beds
      HAOR_BASIN_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      NORTHERN_TISTA_JAMUNA_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      ['faridpur', 'madaripur', 'shariatpur', 'chandpur', 'munshiganj'].forEach((id) => atRiskDistricts.add(id));
      floodedPercent = Number((23 + ((rainMagnitudeMm - 250) / 130) * 12).toFixed(1)); // 23% - 35%
    } else if (rainMagnitudeMm <= 480) {
      // High monsoon deluge (approaching 1988 scale)
      dangerLevel = 'Catastrophic';
      equivalentSurgeMeters = 2.4;
      floodedZones.add('0-3');
      HAOR_BASIN_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      NORTHERN_TISTA_JAMUNA_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      CENTRAL_CONFLUENCE_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      ['barishal', 'pirojpur', 'jhalokathi', 'chandpur', 'cumilla', 'brahmanbaria', 'feni'].forEach((id) =>
        atRiskDistricts.add(id)
      );
      floodedPercent = Number((36 + ((rainMagnitudeMm - 380) / 100) * 16).toFixed(1)); // 36% - 52%
    } else {
      // Historic 100-year super-monsoon deluge (1998 record deluge scale)
      dangerLevel = 'Catastrophic';
      equivalentSurgeMeters = 3.2;
      floodedZones.add('0-3');
      floodedZones.add('3-10');
      HAOR_BASIN_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      NORTHERN_TISTA_JAMUNA_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      CENTRAL_CONFLUENCE_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      COASTAL_CYCLONE_SURGE_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      ['tangail', 'rajbari', 'magura', 'narail'].forEach((id) => atRiskDistricts.add(id));
      floodedPercent = Number(Math.min(68, 53 + ((rainMagnitudeMm - 480) / 120) * 15).toFixed(1)); // 53% - 68%
    }
  } else if (mode === 'cyclone') {
    // Tropical Cyclone: Category 1 to 5 Bay of Bengal storm surge
    // Grounded in IWM/CEGIS coastal models & BMD empirical records:
    // Barishal is at 4.0m elevation, ~100 km inland along Kirtankhola river.
    // Cat 1 (1.2m-1.8m surge) & Cat 2 (2.0m-2.8m surge) only inundate exposed outer seaward barrier chars
    // (outer Barguna, outer Patuakhali/Kuakata, outer Bhola). Barishal remains completely safe and dry!
    // Cat 3 (3.2m-4.2m surge) floods lower estuarine polders; Barishal is at alert threshold.
    // Cat 4 (5.5m-7.5m surge) & Cat 5 (7.0m-9.2m surge, e.g. 1970 Bhola) breach inland river embankments and flood Barishal.
    const cat = Math.max(1, Math.min(5, Math.round(cycloneCategory)));

    if (cat === 1) {
      // Cat 1 (119-153 km/h): Surge 1.2m - 1.8m. Storm surge along outer coastal fringes & beaches throughout the coast.
      // Barishal (4m elevation) remains completely dry!
      dangerLevel = 'Moderate';
      equivalentSurgeMeters = 1.5;
      floodedZones.add('0-3');
      ['barguna', 'patuakhali', 'bhola', 'satkhira', 'coxsbazar'].forEach((id) => atRiskDistricts.add(id));
      floodedPercent = 2.8; // ~4,100 km² slightly enhanced coastal wash
    } else if (cat === 2) {
      // Cat 2 (154-177 km/h): Surge 2.0m - 2.8m. Inundates exposed coastal mangrove fringes & outer chars throughout coast.
      // Barishal (4m elevation) remains safe and dry!
      dangerLevel = 'Moderate';
      equivalentSurgeMeters = 2.4;
      floodedZones.add('0-3');
      ['barguna', 'patuakhali', 'bhola', 'pirojpur', 'satkhira', 'bagerhat', 'noakhali', 'coxsbazar', 'chattogram'].forEach(
        (id) => atRiskDistricts.add(id)
      );
      floodedPercent = 5.2; // ~7,600 km²
    } else if (cat === 3) {
      // Cat 3 (178-208 km/h): Surge 3.2m - 4.2m. Coastal intertidal shelf & lower polders submerged throughout the coast.
      // Barishal reaches outer tidal warning threshold.
      dangerLevel = 'Severe';
      equivalentSurgeMeters = 3.6;
      floodedZones.add('0-3');
      [
        'barguna', 'patuakhali', 'bhola', 'pirojpur', 'satkhira', 'bagerhat',
        'noakhali', 'lakshmipur', 'coxsbazar', 'chattogram', 'feni', 'jhalokathi'
      ].forEach((id) => atRiskDistricts.add(id));
      floodedPercent = 8.9; // ~13,100 km²
    } else if (cat === 4) {
      // Cat 4 (209-251 km/h): Surge 5.5m - 7.5m (e.g. 1970 Bhola, 2007 Sidr).
      // Monster surge wall overcomes 4m threshold throughout southern delta, pushing up river into Barishal.
      dangerLevel = 'Catastrophic';
      equivalentSurgeMeters = 6.2;
      floodedZones.add('0-3');
      floodedZones.add('3-10');
      COASTAL_CYCLONE_SURGE_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      ['chandpur', 'shariatpur', 'madaripur', 'gopalganj'].forEach((id) => atRiskDistricts.add(id));
      floodedPercent = 15.6; // ~23,000 km²
    } else {
      // Cat 5 (252+ km/h): Surge 7.0m - 9.2m (e.g. 1991 Gorky, Cat 5 super-cyclones).
      // Catastrophic tidal wall penetrates deep into southern delta, submerging Barishal completely.
      dangerLevel = 'Catastrophic';
      equivalentSurgeMeters = 8.6;
      floodedZones.add('0-3');
      floodedZones.add('3-10');
      COASTAL_CYCLONE_SURGE_DISTRICTS.forEach((id) => atRiskDistricts.add(id));
      ['chandpur', 'shariatpur', 'madaripur', 'gopalganj', 'munshiganj', 'narail'].forEach((id) =>
        atRiskDistricts.add(id)
      );
      floodedPercent = 21.0; // ~31,000 km²
    }
  }

  // Calculate realistic impacted population and area
  const count = atRiskDistricts.size;
  const estimatedFloodedAreaKm2 = Math.round((floodedPercent / 100) * 147570);
  const estimatedAffectedPop = count === 0 ? 0 : Math.round(count * 850000 * (dangerLevel === 'Catastrophic' ? 1.0 : 0.6));

  return {
    atRiskDistrictIds: Array.from(atRiskDistricts),
    floodedZoneIds: Array.from(floodedZones),
    equivalentSurgeMeters,
    dangerLevel,
    floodedPercent,
    estimatedFloodedAreaKm2,
    estimatedAffectedPop
  };
}

export interface ResearchedCycloneMagnitude {
  category: number;
  categoryName: string;
  windSpeedKmh: string;
  centralPressureHpa: string;
  surgeRangeMeters: string;
  averageSurgeMeters: number;
  floodedAreaKm2: number;
  floodedPercentLand: number;
  researchSource: string;
  historicalAnalogue: string;
  historicalCasualties: string;
  inundationDescription: string;
  barishalStatus: string;
  atRiskDistrictNames: string[];
}

export const RESEARCHED_CYCLONE_CATEGORY_DATA: Record<number, ResearchedCycloneMagnitude> = {
  1: {
    category: 1,
    categoryName: 'Category 1 · Cyclonic Storm',
    windSpeedKmh: '119 – 153 km/h (65–82 knots)',
    centralPressureHpa: '985 – 990 hPa',
    surgeRangeMeters: '1.2m – 1.8m',
    averageSurgeMeters: 1.5,
    floodedAreaKm2: 4130,
    floodedPercentLand: 2.8,
    researchSource: 'BMD & Institute of Water Modelling (IWM) Bay of Bengal Hydrodynamic Surge Model (2022)',
    historicalAnalogue: 'Cyclone Aila (2009) & Cyclone Komen (2015)',
    historicalCasualties: '190 casualties; high saltwater intrusion into polders',
    inundationDescription: 'Storm surge inundation strictly confined to outer seaward barrier islands, Kuakata beach fringes, and outer Sundarbans mangrove mudflats. 5 coastal districts face high tidal flooding.',
    barishalStatus: 'Barishal (4.0m MSL elevation, 100km inland) remains completely dry and safe.',
    atRiskDistrictNames: ['Barguna', 'Patuakhali', 'Bhola', 'Satkhira', "Cox's Bazar"]
  },
  2: {
    category: 2,
    categoryName: 'Category 2 · Severe Cyclonic Storm',
    windSpeedKmh: '154 – 177 km/h (83–95 knots)',
    centralPressureHpa: '970 – 984 hPa',
    surgeRangeMeters: '2.0m – 2.8m',
    averageSurgeMeters: 2.4,
    floodedAreaKm2: 7670,
    floodedPercentLand: 5.2,
    researchSource: 'BWDB Flood Forecasting and Warning Centre (FFWC) & CEGIS Storm Surge Studies (2022)',
    historicalAnalogue: 'Cyclone Mora (2017) & Cyclone Roanu (2016)',
    historicalCasualties: '135 casualties; widespread coastal embankment damage',
    inundationDescription: 'Surge washes over coastal embankments into Pirojpur, Bagerhat, Hatiya Island, and Chattogram outer coast. Seaward polders experience 1–2m saltwater wash across 9 coastal districts.',
    barishalStatus: 'Barishal city (4.0m MSL) remains safe and above the 2.4m surge line.',
    atRiskDistrictNames: ['Barguna', 'Patuakhali', 'Bhola', 'Pirojpur', 'Satkhira', 'Bagerhat', 'Noakhali', "Cox's Bazar", 'Chattogram']
  },
  3: {
    category: 3,
    categoryName: 'Category 3 · Very Severe Cyclonic Storm',
    windSpeedKmh: '178 – 208 km/h (96–112 knots)',
    centralPressureHpa: '945 – 969 hPa',
    surgeRangeMeters: '3.2m – 4.2m',
    averageSurgeMeters: 3.6,
    floodedAreaKm2: 13130,
    floodedPercentLand: 8.9,
    researchSource: 'Ministry of Disaster Management & Relief (MoDMR) Reference Handbook (2023) & BMD Standards',
    historicalAnalogue: 'Cyclone Bulbul (2019) & Cyclone Sitrang (2022)',
    historicalCasualties: '35 casualties; multi-purpose cyclone shelters saved ~1.5M evacuees',
    inundationDescription: 'Severe estuarine storm surge floods lower intertidal delta shelf across 12 coastal districts. Saline surge reaches lower Meghna estuaries, Lakshmipur, and Feni coastal plains.',
    barishalStatus: 'Barishal reaches outer estuarine flood alert threshold (+3.6m surge approaching 4.0m levee).',
    atRiskDistrictNames: ['Barguna', 'Patuakhali', 'Bhola', 'Pirojpur', 'Satkhira', 'Bagerhat', 'Noakhali', 'Lakshmipur', "Cox's Bazar", 'Chattogram', 'Feni', 'Jhalokathi']
  },
  4: {
    category: 4,
    categoryName: 'Category 4 · Extremely Severe Cyclonic Storm',
    windSpeedKmh: '209 – 251 km/h (113–135 knots)',
    centralPressureHpa: '920 – 944 hPa',
    surgeRangeMeters: '5.5m – 7.5m',
    averageSurgeMeters: 6.2,
    floodedAreaKm2: 23020,
    floodedPercentLand: 15.6,
    researchSource: 'IPCC AR6 Cross-Chapter Paper 2 on Deltas & MoDMR National Disaster Records (2023)',
    historicalAnalogue: '1970 Great Bhola Cyclone & Cyclone Sidr (2007) & Cyclone Remal (2024)',
    historicalCasualties: '1970 Bhola: 300,000–500,000 (pre-shelters); 2007 Sidr: 4,234 (shelters saved hundreds of thousands)',
    inundationDescription: 'Devastating monster surge breaches 4.0m elevation levees, flooding deep inland into Barishal City, Chandpur, Shariatpur, and Madaripur. Over 18 districts face catastrophic saltwater submersion.',
    barishalStatus: 'Barishal City (4.0m MSL) is inundated under +2.2m of tidal surge seawater.',
    atRiskDistrictNames: [
      'Barguna', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokathi', 'Barishal',
      'Satkhira', 'Khulna', 'Bagerhat', 'Noakhali', 'Lakshmipur', 'Feni',
      'Chattogram', "Cox's Bazar", 'Chandpur', 'Shariatpur', 'Madaripur', 'Gopalganj'
    ]
  },
  5: {
    category: 5,
    categoryName: 'Category 5 · Super Cyclone',
    windSpeedKmh: '252+ km/h (136+ knots)',
    centralPressureHpa: '< 920 hPa (Record 898 hPa)',
    surgeRangeMeters: '7.0m – 9.2m',
    averageSurgeMeters: 8.6,
    floodedAreaKm2: 30990,
    floodedPercentLand: 21.0,
    researchSource: 'World Meteorological Organization (WMO) & IWM Extreme Surge Hydrodynamic Modelling (2022)',
    historicalAnalogue: '1991 Super Cyclone Gorky & Super Cyclone Amphan (2020)',
    historicalCasualties: '1991 Gorky: 138,866 deaths; 2020 Amphan: 26 deaths (modern cyclone early warning & 4,500 shelters)',
    inundationDescription: 'Mega-tidal wave overcomes all coastal defenses, transforming the entire southern delta into an open saltwater sea. Deep inundation penetrates up to Munshiganj and Narail across 20 districts.',
    barishalStatus: 'Barishal City is submerged under +4.6m of violent ocean water.',
    atRiskDistrictNames: [
      'Barguna', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokathi', 'Barishal',
      'Satkhira', 'Khulna', 'Bagerhat', 'Noakhali', 'Lakshmipur', 'Feni',
      'Chattogram', "Cox's Bazar", 'Chandpur', 'Shariatpur', 'Madaripur', 'Gopalganj',
      'Munshiganj', 'Narail'
    ]
  }
};
