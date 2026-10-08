import { CountryFloodData } from '../types/flood';

export const COUNTRIES_DATA: CountryFloodData[] = [
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    flag: '🇧🇩',
    continent: 'Asia',
    population: 173000000,
    urbanPopulationPercent: 39,
    coastalVulnerablePercent: 68,
    totalAreaKm2: 147570,
    densityPerKm2: 1172,
    highestPoint: {
      name: 'Mowdok Mual (Saka Haphong)',
      elevationMeters: 1052
    },
    lowestPoint: {
      name: 'Bay of Bengal Coastline',
      elevationMeters: 0
    },
    averageElevationMeters: 12,
    topographyType: 'delta',
    terrainRoughness: 0.15,
    forestCoverPercent: 14,
    waterCoverPercent: 24,
    cities: [
      { name: 'Dhaka', x: 0.05, y: 0.02, elevationMeters: 8, population: 22000000, isCapital: true },
      { name: 'Chittagong (Chattogram)', x: 0.35, y: -0.32, elevationMeters: 12, population: 5300000 },
      { name: 'Khulna', x: -0.28, y: -0.25, elevationMeters: 4, population: 1600000 },
      { name: 'Sylhet', x: 0.38, y: 0.42, elevationMeters: 22, population: 1050000 },
      { name: 'Rajshahi', x: -0.42, y: 0.22, elevationMeters: 23, population: 950000 },
      { name: 'Barisal', x: -0.05, y: -0.38, elevationMeters: 4, population: 620000 },
      { name: 'Rangpur', x: -0.32, y: 0.62, elevationMeters: 34, population: 400000 },
      { name: 'Cox\'s Bazar', x: 0.45, y: -0.55, elevationMeters: 6, population: 300000 }
    ],
    floodHistoryParagraphs: [
      'Bangladesh sits across the vast delta formed by the convergence of the Ganges, Brahmaputra (Jamuna), and Meghna rivers. Over 80% of its territory constitutes a low-lying floodplain, with more than half the country lying under 6 meters above sea level. Every monsoon season (June to September), glacial meltwater from the Himalayas joins tropical torrential monsoon rains, inundating between 20% to 25% of the country under normal conditions and over 60% during catastrophic super-floods.',
      'The catastrophic mega-flood of 1998 remains one of modern history\'s most devastating hydrological crises. Driven by simultaneous peak flows of the Ganges and Brahmaputra, over 68% of Bangladesh was submerged for 75 consecutive days. Over 30 million people were displaced, 1,050 lives were lost, and 2 million metric tons of rice crops were decimated, posing severe food security threats that required nationwide emergency airlift operations.',
      'In response to recurrent inundations and tropical cyclone storm surges from the Bay of Bengal, Bangladesh engineered an internationally acclaimed multi-tier disaster preparedness network. This includes over 14,000 km of coastal flood embankments (polders), 4,000+ elevated multi-purpose cyclone/flood shelters, and the Community Early Warning Flag System that mobilized tens of thousands of trained village volunteers, dramatically curtailing casualties in recent 2020 and 2022 flood seasons.'
    ],
    historicalFloods: [
      {
        year: 1998,
        name: 'The Great Bangladesh Super Flood',
        waterLevelOrSurge: 'Over 2.5m above danger levels',
        casualties: '1,050 deaths',
        affectedPeople: '31,000,000 displaced',
        damageCost: '$3.4 Billion USD',
        summary: 'Submerged 68% of the nation for two and a half months as Ganges and Brahmaputra rivers crested concurrently with unprecedented monsoon cloudbursts.',
        primaryCause: 'Simultaneous glacial runoff & triple-river monsoon confluence'
      },
      {
        year: 1988,
        name: 'Record Brahmaputra Inundation',
        waterLevelOrSurge: '1.4m record crest',
        casualties: '2,300 deaths',
        affectedPeople: '45,000,000 affected',
        damageCost: '$2.1 Billion USD',
        summary: 'Flooded Dhaka International Airport and severed national highways; catalyzed the global Flood Action Plan (FAP) partnership.',
        primaryCause: 'Record monsoon downpour in Assam and Meghalaya basins'
      },
      {
        year: 2022,
        name: 'Sylhet Flash Flood Crisis',
        waterLevelOrSurge: 'Flash flood cresting in 48 hours',
        casualties: '141 deaths',
        affectedPeople: '7,200,000 marooned',
        damageCost: '$1.0 Billion USD',
        summary: 'Record-shattering 972 mm rainfall in upstream Cherrapunji triggered instantaneous flooding across 85% of Sylhet and Sunamganj divisions.',
        primaryCause: 'Extreme upstream torrential cloudburst in Meghalaya hills'
      },
      {
        year: 2020,
        name: 'Prolonged Pandemic Monsoon Inundation',
        waterLevelOrSurge: '1.1m above danger mark',
        casualties: '257 deaths',
        affectedPeople: '5,500,000 affected',
        damageCost: '$700 Million USD',
        summary: 'Over a third of the country remained submerged during the height of COVID-19 lockdowns, testing community resilience.',
        primaryCause: 'Continuous 5-wave monsoon deluge over 4 months'
      }
    ],
    annualAverageRainfallMm: 2320,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 8 },
      { month: 'Feb', rainfallMm: 25 },
      { month: 'Mar', rainfallMm: 65 },
      { month: 'Apr', rainfallMm: 145 },
      { month: 'May', rainfallMm: 285 },
      { month: 'Jun', rainfallMm: 460 },
      { month: 'Jul', rainfallMm: 525 },
      { month: 'Aug', rainfallMm: 410 },
      { month: 'Sep', rainfallMm: 310 },
      { month: 'Oct', rainfallMm: 160 },
      { month: 'Nov', rainfallMm: 32 },
      { month: 'Dec', rainfallMm: 5 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 2190, anomalyPercent: -5.6 },
      { decade: '1980s', annualAverageMm: 2310, anomalyPercent: -0.4 },
      { decade: '1990s', annualAverageMm: 2420, anomalyPercent: +4.3 },
      { decade: '2000s', annualAverageMm: 2360, anomalyPercent: +1.7 },
      { decade: '2010s', annualAverageMm: 2480, anomalyPercent: +6.9 },
      { decade: '2020s', annualAverageMm: 2540, anomalyPercent: +9.5 }
    ],
    record24HrRainfallMm: 433,
    recordRainfallLocation: 'Sandwip Coastal Island (Bay of Bengal)',
    floodDefenseSystems: [
      'Coastal Embankment Project (139 Polders & 5,800 km Dykes)',
      'Dhaka West Flood Protection Wall & Gorai River Regulator',
      '4,000+ Elevated Cyclone and Monsoon Community Shelters',
      'Satellite-Telemetry Flood Forecasting & Warning Centre (FFWC)'
    ]
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    flag: '🇳🇱',
    continent: 'Europe',
    population: 18000000,
    urbanPopulationPercent: 93,
    coastalVulnerablePercent: 72,
    totalAreaKm2: 41850,
    densityPerKm2: 531,
    highestPoint: {
      name: 'Vaalserberg (Limburg)',
      elevationMeters: 322
    },
    lowestPoint: {
      name: 'Zuidplaspolder (Nieuwerkerk aan den IJssel)',
      elevationMeters: -7
    },
    averageElevationMeters: 30,
    topographyType: 'lowland',
    terrainRoughness: 0.1,
    forestCoverPercent: 11,
    waterCoverPercent: 18,
    cities: [
      { name: 'Amsterdam', x: -0.1, y: 0.2, elevationMeters: -2, population: 920000, isCapital: true },
      { name: 'Rotterdam', x: -0.22, y: -0.05, elevationMeters: -4, population: 660000 },
      { name: 'The Hague (Den Haag)', x: -0.26, y: 0.08, elevationMeters: 1, population: 550000 },
      { name: 'Utrecht', x: 0.02, y: 0.05, elevationMeters: 5, population: 365000 },
      { name: 'Eindhoven', x: 0.15, y: -0.32, elevationMeters: 17, population: 240000 },
      { name: 'Groningen', x: 0.35, y: 0.58, elevationMeters: 7, population: 235000 },
      { name: 'Maastricht', x: 0.22, y: -0.65, elevationMeters: 49, population: 122000 }
    ],
    floodHistoryParagraphs: [
      'Approximately 26% of the Netherlands lies beneath global sea level, and another 29% is vulnerable to severe river flooding from the Rhine, Meuse, and Scheldt rivers. Over centuries of hydraulic innovation, the Dutch reclaimed thousands of square kilometers of fertile lowlands called "polders", relying on historic windmills, modern electric pumping stations, and complex dyke networks to prevent the North Sea from swallowing the economic heartland.',
      'The cataclysmic North Sea Flood of February 1, 1953, reshaped Dutch history. A violent storm surge coupled with a spring high tide breached 67 dykes along Zeeland and South Holland, drowning 1,836 people and devastating 200,000 hectares of land. The catastrophe spurred the Dutch parliament to pledge "Never Again", enacting the monumental Delta Act that would become the world benchmark for hydraulic defense engineering.',
      'Today, the Netherlands is defended by the Delta Works—heralded by civil engineers as one of the Seven Wonders of the Modern World. The system incorporates storm surge barriers like the Oosterscheldekering and Maeslantkering, massive automated floating gates as wide as the Eiffel Tower. In the 21st century, recognizing climate extremes, the Dutch launched the "Room for the River" paradigm, restoring natural floodplains alongside structural barriers.'
    ],
    historicalFloods: [
      {
        year: 1953,
        name: 'The North Sea Flood (Watersnoodramp)',
        waterLevelOrSurge: '5.6m above NAP (Normal Amsterdam Watermark)',
        casualties: '1,836 deaths',
        affectedPeople: '100,000 evacuated',
        damageCost: '€1.5 Billion (adjusted)',
        summary: 'Massive storm surge breached sea walls across Zeeland and South Holland; led to the creation of the world-famous Delta Works defense project.',
        primaryCause: 'Historic North Sea gale gale force 12 & spring high tide'
      },
      {
        year: 1995,
        name: 'Meuse & Rhine River Basin Evacuation',
        waterLevelOrSurge: 'Near-record river crest',
        casualties: '0 deaths (preemptive)',
        affectedPeople: '250,000 evacuated',
        damageCost: '€450 Million',
        summary: 'Near-catastrophic high river discharge threatened dyke collapses, triggering the largest peacetime evacuation in Dutch history.',
        primaryCause: 'Sudden alpine snowmelt combined with weeks of heavy rain'
      },
      {
        year: 2021,
        name: 'European Summer Floods (Limburg)',
        waterLevelOrSurge: 'Record discharge on Meuse (3,300 m³/s)',
        casualties: '0 deaths in NL (fortified dykes)',
        affectedPeople: '10,000 evacuated in Roermond/Venlo',
        damageCost: '€400 Million',
        summary: 'Torrential downpours devastated neighboring Germany and Belgium, but Dutch dyke upgrades prevented fatalities.',
        primaryCause: 'Cut-off low-pressure system "Bernd" stalling over Central Europe'
      }
    ],
    annualAverageRainfallMm: 850,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 68 },
      { month: 'Feb', rainfallMm: 55 },
      { month: 'Mar', rainfallMm: 58 },
      { month: 'Apr', rainfallMm: 44 },
      { month: 'May', rainfallMm: 56 },
      { month: 'Jun', rainfallMm: 68 },
      { month: 'Jul', rainfallMm: 78 },
      { month: 'Aug', rainfallMm: 84 },
      { month: 'Sep', rainfallMm: 76 },
      { month: 'Oct', rainfallMm: 82 },
      { month: 'Nov', rainfallMm: 80 },
      { month: 'Dec', rainfallMm: 79 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 790, anomalyPercent: -7.1 },
      { decade: '1980s', annualAverageMm: 830, anomalyPercent: -2.4 },
      { decade: '1990s', annualAverageMm: 880, anomalyPercent: +3.5 },
      { decade: '2000s', annualAverageMm: 865, anomalyPercent: +1.8 },
      { decade: '2010s', annualAverageMm: 875, anomalyPercent: +2.9 },
      { decade: '2020s', annualAverageMm: 910, anomalyPercent: +7.0 }
    ],
    record24HrRainfallMm: 116,
    recordRainfallLocation: 'De Bilt (Utrecht)',
    floodDefenseSystems: [
      'Delta Works: Maeslantkering, Oosterscheldekering & Haringvlietdam',
      'Afsluitdijk 32-kilometer Enclosure Dyke (IJsselmeer)',
      'Room for the River (Ruimte voor de Rivier) Floodplain Relocation',
      '17,500 km of Primary and Secondary Sea & River Dykes'
    ]
  },
  {
    id: 'united_states',
    name: 'United States',
    flag: '🇺🇸',
    continent: 'North America',
    population: 340000000,
    urbanPopulationPercent: 83,
    coastalVulnerablePercent: 40,
    totalAreaKm2: 9833517,
    densityPerKm2: 37,
    highestPoint: {
      name: 'Denali (Mt. McKinley, Alaska)',
      elevationMeters: 6190
    },
    lowestPoint: {
      name: 'Badwater Basin (Death Valley, California)',
      elevationMeters: -86
    },
    averageElevationMeters: 760,
    topographyType: 'basin',
    terrainRoughness: 0.6,
    forestCoverPercent: 33,
    waterCoverPercent: 7,
    cities: [
      { name: 'Washington, D.C.', x: 0.38, y: 0.12, elevationMeters: 22, population: 690000, isCapital: true },
      { name: 'New York City', x: 0.45, y: 0.22, elevationMeters: 10, population: 8300000 },
      { name: 'Los Angeles', x: -0.48, y: -0.15, elevationMeters: 87, population: 3850000 },
      { name: 'Chicago', x: 0.12, y: 0.24, elevationMeters: 181, population: 2650000 },
      { name: 'Houston', x: -0.05, y: -0.38, elevationMeters: 13, population: 2300000 },
      { name: 'Miami', x: 0.36, y: -0.52, elevationMeters: 2, population: 450000 },
      { name: 'New Orleans', x: 0.11, y: -0.42, elevationMeters: -2, population: 370000 },
      { name: 'Seattle', x: -0.46, y: 0.52, elevationMeters: 53, population: 750000 }
    ],
    floodHistoryParagraphs: [
      'The United States experiences virtually every hydrological hazard on Earth, ranging from Mississippi River delta overtopping and Atlantic hurricane storm surges to Pacific atmospheric rivers that dump feet of precipitation against the Sierra Nevada. With 127 million people living in coastal shoreline counties, coastal and riverine flood defense forms one of the largest infrastructure responsibilities in North America.',
      'The Great Mississippi Flood of 1927 was the most destructive river flood in U.S. history. After months of torrential winter rain, the Mississippi River breached levees in 145 locations, submerging 27,000 square miles under up to 30 feet of water across seven states. The disaster displaced over 600,000 people and prompted Congress to pass the Flood Control Act of 1928, creating the world\'s longest levee and spillway network operated by the U.S. Army Corps of Engineers.',
      'In recent decades, urban flood vulnerability was starkly exposed by Hurricane Katrina in 2005, where storm surge overwhelmed New Orleans\' floodwall system, leaving 80% of the city submerged. Subsequent disasters, including Hurricane Harvey in 2017—which unleashed an astounding 60.58 inches (1,539 mm) of rain over Texas—have driven intense modern investments in smart stormwater detention, nature-based wetland restoration, and updated FEMA flood maps.'
    ],
    historicalFloods: [
      {
        year: 2005,
        name: 'Hurricane Katrina & Levee Breaches',
        waterLevelOrSurge: '8.5m (28 ft) coastal storm surge',
        casualties: '1,833 deaths',
        affectedPeople: '1,000,000+ displaced',
        damageCost: '$161 Billion USD',
        summary: 'Storm surge crushed navigation canal floodwalls, submerging 80% of New Orleans for weeks and creating a historic humanitarian crisis.',
        primaryCause: 'Category 5 hurricane surge striking flawed federal levee system'
      },
      {
        year: 2017,
        name: 'Hurricane Harvey Houston Deluge',
        waterLevelOrSurge: 'Record 1,539 mm (60.58 in) rain',
        casualties: '107 deaths',
        affectedPeople: '300,000 structures damaged',
        damageCost: '$125 Billion USD',
        summary: 'Stalled tropical system dropped trillions of gallons of water across metropolitan Houston, overwhelming bayous and reservoirs.',
        primaryCause: 'Stalled cyclone pumping moisture from warm Gulf of Mexico'
      },
      {
        year: 1927,
        name: 'The Great Mississippi Flood',
        waterLevelOrSurge: '30 ft deep in delta lowlands',
        casualties: '500+ deaths',
        affectedPeople: '637,000 displaced',
        damageCost: '$1 Billion (1927 USD)',
        summary: 'Inundated 27,000 square miles across 7 states, driving the Great Migration and revolutionizing federal water management.',
        primaryCause: 'Cascading spring storms across Ohio and Mississippi basins'
      },
      {
        year: 2012,
        name: 'Superstorm Sandy Inundation',
        waterLevelOrSurge: '4.3m (14 ft) surge at NYC Battery',
        casualties: '233 deaths',
        affectedPeople: '2,000,000 without power',
        damageCost: '$70 Billion USD',
        summary: 'Record storm surge flooded NYC subway tunnels, Lower Manhattan financial district, and barrier island communities.',
        primaryCause: 'Hybrid post-tropical cyclone merging with winter nor\'easter'
      }
    ],
    annualAverageRainfallMm: 760,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 52 },
      { month: 'Feb', rainfallMm: 50 },
      { month: 'Mar', rainfallMm: 62 },
      { month: 'Apr', rainfallMm: 64 },
      { month: 'May', rainfallMm: 76 },
      { month: 'Jun', rainfallMm: 74 },
      { month: 'Jul', rainfallMm: 72 },
      { month: 'Aug', rainfallMm: 70 },
      { month: 'Sep', rainfallMm: 64 },
      { month: 'Oct', rainfallMm: 58 },
      { month: 'Nov', rainfallMm: 56 },
      { month: 'Dec', rainfallMm: 62 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 740, anomalyPercent: -2.6 },
      { decade: '1980s', annualAverageMm: 755, anomalyPercent: -0.6 },
      { decade: '1990s', annualAverageMm: 770, anomalyPercent: +1.3 },
      { decade: '2000s', annualAverageMm: 765, anomalyPercent: +0.7 },
      { decade: '2010s', annualAverageMm: 785, anomalyPercent: +3.3 },
      { decade: '2020s', annualAverageMm: 805, anomalyPercent: +5.9 }
    ],
    record24HrRainfallMm: 1262,
    recordRainfallLocation: 'Waialeale & Kauai (Hawaii) / Alvin (Texas 1,090mm)',
    floodDefenseSystems: [
      'US Army Corps Mississippi River Levee & Morganza Spillway Network',
      'New Orleans Hurricane & Storm Damage Risk Reduction System (HSDRRS)',
      'Lake Okeechobee Herbert Hoover Dike (Florida)',
      'New York City "Big U" East Side Coastal Resiliency Surge Barriers'
    ]
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    population: 124000000,
    urbanPopulationPercent: 92,
    coastalVulnerablePercent: 55,
    totalAreaKm2: 377975,
    densityPerKm2: 332,
    highestPoint: {
      name: 'Mount Fuji (Shizuoka/Yamanashi)',
      elevationMeters: 3776
    },
    lowestPoint: {
      name: 'Hachirogata Polder (Akita)',
      elevationMeters: -4
    },
    averageElevationMeters: 438,
    topographyType: 'archipelago',
    terrainRoughness: 0.75,
    forestCoverPercent: 68,
    waterCoverPercent: 3,
    cities: [
      { name: 'Tokyo', x: 0.28, y: -0.05, elevationMeters: 17, population: 14000000, isCapital: true },
      { name: 'Yokohama', x: 0.27, y: -0.12, elevationMeters: 14, population: 3770000 },
      { name: 'Osaka', x: 0.05, y: -0.22, elevationMeters: 12, population: 2750000 },
      { name: 'Nagoya', x: 0.15, y: -0.18, elevationMeters: 15, population: 2320000 },
      { name: 'Sapporo', x: 0.45, y: 0.65, elevationMeters: 48, population: 1970000 },
      { name: 'Fukuoka', x: -0.42, y: -0.38, elevationMeters: 8, population: 1610000 },
      { name: 'Sendai', x: 0.35, y: 0.18, elevationMeters: 37, population: 1090000 },
      { name: 'Hiroshima', x: -0.22, y: -0.28, elevationMeters: 6, population: 1190000 }
    ],
    floodHistoryParagraphs: [
      'Japan is a mountainous archipelago where over 70% of the land area consists of steep, forested terrain. Consequently, the vast majority of Japan\'s 124 million citizens, critical industries, and agricultural land are concentrated within narrow alluvial coastal plains and river basins. Rivers in Japan are short and steep, behaving more like cascading waterfalls during Pacific typhoons and summer "guerrilla" rainstorms.',
      'Throughout the 20th century, catastrophic typhoons repeatedly wrought immense damage. Typhoon Vera (Isewan Typhoon) in 1959 battered Nagoya and central Japan with a 3.89-meter storm surge, drowning over 5,000 citizens and destroying 150,000 homes. This monumental tragedy accelerated nationwide disaster legislation and led to comprehensive river channel straightening, super-levees, and mountain sabo erosion check-dams.',
      'Tokyo\'s defense against megacity inundation relies on the Metropolitan Area Outer Underground Discharge Channel (G-Cans)—the world\'s largest underground flood diversion cavern. Situated 50 meters beneath Kasukabe, it features 59 massive pillars and Boeing 737-powered turbine pumps that divert up to 200 tons of floodwater per second directly into the Edo River, shielding Tokyo\'s dense lowlands from catastrophic inundation.'
    ],
    historicalFloods: [
      {
        year: 1959,
        name: 'Typhoon Vera (Isewan Typhoon)',
        waterLevelOrSurge: '3.89m storm surge in Ise Bay',
        casualties: '5,098 dead or missing',
        affectedPeople: '1,500,000 displaced',
        damageCost: '$2.3 Billion (1959 USD)',
        summary: 'Violent Pacific typhoon surge broke coastal seawalls, submerging Nagoya lowlands for over a month.',
        primaryCause: 'Historic typhoon category 5 striking during astronomical high tide'
      },
      {
        year: 2018,
        name: 'Western Japan Torrential Rain Disaster',
        waterLevelOrSurge: 'Record 1,800 mm cumulative rainfall',
        casualties: '225 deaths',
        affectedPeople: '23,000 homes inundated',
        damageCost: '$9.8 Billion USD',
        summary: 'Massive linear rainbands triggered severe river dyke breaches in Kurashiki (Mabi district) and landslides across Hiroshima and Ehime.',
        primaryCause: 'Stagnant seasonal Baiu front fueled by supercharged Pacific vapor'
      },
      {
        year: 2019,
        name: 'Typhoon Hagibis Megacity Impact',
        waterLevelOrSurge: 'Over 1,000 mm rain in Hakone in 48 hours',
        casualties: '98 deaths',
        affectedPeople: '85,000 houses flooded',
        damageCost: '$15 Billion USD',
        summary: 'Over 140 river dyke failures occurred across Honshu; Tokyo\'s G-Cans underground channel diverted 12 million tons of water, saving the capital.',
        primaryCause: 'Massive Category 5 typhoon with unprecedented rain footprint'
      }
    ],
    annualAverageRainfallMm: 1668,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 52 },
      { month: 'Feb', rainfallMm: 56 },
      { month: 'Mar', rainfallMm: 117 },
      { month: 'Apr', rainfallMm: 124 },
      { month: 'May', rainfallMm: 137 },
      { month: 'Jun', rainfallMm: 167 },
      { month: 'Jul', rainfallMm: 153 },
      { month: 'Aug', rainfallMm: 168 },
      { month: 'Sep', rainfallMm: 209 },
      { month: 'Oct', rainfallMm: 197 },
      { month: 'Nov', rainfallMm: 92 },
      { month: 'Dec', rainfallMm: 59 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 1620, anomalyPercent: -2.8 },
      { decade: '1980s', annualAverageMm: 1640, anomalyPercent: -1.6 },
      { decade: '1990s', annualAverageMm: 1680, anomalyPercent: +0.7 },
      { decade: '2000s', annualAverageMm: 1690, anomalyPercent: +1.3 },
      { decade: '2010s', annualAverageMm: 1735, anomalyPercent: +4.0 },
      { decade: '2020s', annualAverageMm: 1770, anomalyPercent: +6.1 }
    ],
    record24HrRainfallMm: 940,
    recordRainfallLocation: 'Hakone (Kanagawa Prefecture, Typhoon Hagibis)',
    floodDefenseSystems: [
      'G-Cans Underground Discharge Channel (50m deep, 200m³/s pumps)',
      'Tokyo 5-River Super-Levees and Arakawa River Regulating Basin',
      'Thousands of Mountain Sabo Check-Dams for debris flow mitigation',
      'Multi-tiered Automated Tsunami and Storm Surge Seawall Gates'
    ]
  },
  {
    id: 'philippines',
    name: 'Philippines',
    flag: '🇵🇭',
    continent: 'Asia',
    population: 117000000,
    urbanPopulationPercent: 48,
    coastalVulnerablePercent: 62,
    totalAreaKm2: 300000,
    densityPerKm2: 390,
    highestPoint: {
      name: 'Mount Apo (Mindanao)',
      elevationMeters: 2954
    },
    lowestPoint: {
      name: 'Philippine Sea Coast',
      elevationMeters: 0
    },
    averageElevationMeters: 442,
    topographyType: 'archipelago',
    terrainRoughness: 0.65,
    forestCoverPercent: 23,
    waterCoverPercent: 5,
    cities: [
      { name: 'Manila', x: -0.15, y: 0.25, elevationMeters: 7, population: 14700000, isCapital: true },
      { name: 'Quezon City', x: -0.12, y: 0.3, elevationMeters: 38, population: 2960000 },
      { name: 'Davao City', x: 0.28, y: -0.55, elevationMeters: 22, population: 1770000 },
      { name: 'Cebu City', x: 0.12, y: -0.15, elevationMeters: 10, population: 960000 },
      { name: 'Zamboanga', x: -0.18, y: -0.62, elevationMeters: 16, population: 970000 },
      { name: 'Cagayan de Oro', x: 0.18, y: -0.42, elevationMeters: 10, population: 720000 }
    ],
    floodHistoryParagraphs: [
      'Comprising an archipelago of more than 7,600 islands situated directly inside the world\'s most active tropical cyclone basin (the Western North Pacific), the Philippines is struck by an average of 20 named storms annually, with approximately 8 to 9 making direct landfall. Coastal communities and river deltas such as Metro Manila, Pampanga, and the Cagayan Valley routinely face catastrophic flood deluges.',
      'Typhoon Haiyan (Super Typhoon Yolanda) in November 2013 was one of the most powerful tropical cyclones ever recorded, generating catastrophic storm surges over 5 to 6 meters high that swept clean across Tacloban City and coastal Leyte. Over 6,300 lives were lost, primarily from the sheer velocity and drowning depth of the wall of seawater.',
      'In recent years, the Philippine government, along with international partners, has prioritized comprehensive flood mitigation through projects like the Metro Manila Flood Management Master Plan, elevating roads, building large retarding basins along the Marikina River, and installing telemetry-based river basin warning stations across all major islands.'
    ],
    historicalFloods: [
      {
        year: 2013,
        name: 'Super Typhoon Haiyan (Yolanda)',
        waterLevelOrSurge: '5 to 6m catastrophic storm surge',
        casualties: '6,300+ deaths',
        affectedPeople: '16,000,000 affected',
        damageCost: '$2.98 Billion USD',
        summary: 'Unprecedented 315 km/h winds and storm surge wiped out coastal settlements across Eastern Visayas and Tacloban.',
        primaryCause: 'Category 5 Super Typhoon with intense low-pressure surge'
      },
      {
        year: 2009,
        name: 'Typhoon Ketsana (Ondoy)',
        waterLevelOrSurge: '455 mm rain in 24 hours',
        casualties: '464 deaths',
        affectedPeople: '4,900,000 affected',
        damageCost: '$1.09 Billion USD',
        summary: 'Deluged Metro Manila with a month\'s worth of rain in six hours, submerging 80% of the capital region.',
        primaryCause: 'Monsoon-enhanced tropical storm stalling over Southern Luzon'
      },
      {
        year: 2020,
        name: 'Typhoon Vamco (Ulysses)',
        waterLevelOrSurge: 'Marikina River crest 22.0m',
        casualties: '102 deaths',
        affectedPeople: '4,100,000 affected',
        damageCost: '$418 Million USD',
        summary: 'Dam releases and extreme rainfall triggered worst flooding in decades across Cagayan Valley and Marikina.',
        primaryCause: 'Saturated soil from consecutive typhoons and dam release peaks'
      }
    ],
    annualAverageRainfallMm: 2400,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 80 },
      { month: 'Feb', rainfallMm: 50 },
      { month: 'Mar', rainfallMm: 45 },
      { month: 'Apr', rainfallMm: 60 },
      { month: 'May', rainfallMm: 160 },
      { month: 'Jun', rainfallMm: 280 },
      { month: 'Jul', rainfallMm: 410 },
      { month: 'Aug', rainfallMm: 480 },
      { month: 'Sep', rainfallMm: 390 },
      { month: 'Oct', rainfallMm: 240 },
      { month: 'Nov', rainfallMm: 140 },
      { month: 'Dec', rainfallMm: 110 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 2310, anomalyPercent: -3.7 },
      { decade: '1980s', annualAverageMm: 2350, anomalyPercent: -2.0 },
      { decade: '1990s', annualAverageMm: 2410, anomalyPercent: +0.4 },
      { decade: '2000s', annualAverageMm: 2440, anomalyPercent: +1.6 },
      { decade: '2010s', annualAverageMm: 2510, anomalyPercent: +4.5 },
      { decade: '2020s', annualAverageMm: 2580, anomalyPercent: +7.5 }
    ],
    record24HrRainfallMm: 1168,
    recordRainfallLocation: 'Baguio City (Benguet Province)',
    floodDefenseSystems: [
      'Manggahan Floodway and Pasig-Marikina River Channel Improvement',
      'Valenzuela-Obando-Meycauayan (BOMSLICE) Pumping Stations',
      'Project NOAH (Nationwide Operational Assessment of Hazards) Radar',
      'Coastal Mangrove Greenbelts and Nature-Based Seawalls'
    ]
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    continent: 'Europe',
    population: 59000000,
    urbanPopulationPercent: 71,
    coastalVulnerablePercent: 38,
    totalAreaKm2: 301340,
    densityPerKm2: 196,
    highestPoint: {
      name: 'Monte Bianco (Mont Blanc, Valle d\'Aosta)',
      elevationMeters: 4810
    },
    lowestPoint: {
      name: 'Le Contane (Jolanda di Savoia, Ferrara)',
      elevationMeters: -3.4
    },
    averageElevationMeters: 538,
    topographyType: 'basin',
    terrainRoughness: 0.7,
    forestCoverPercent: 32,
    waterCoverPercent: 2,
    cities: [
      { name: 'Rome', x: 0.05, y: -0.15, elevationMeters: 21, population: 2800000, isCapital: true },
      { name: 'Milan', x: -0.25, y: 0.42, elevationMeters: 120, population: 1400000 },
      { name: 'Naples', x: 0.18, y: -0.32, elevationMeters: 17, population: 920000 },
      { name: 'Turin', x: -0.42, y: 0.38, elevationMeters: 239, population: 850000 },
      { name: 'Palermo', x: 0.12, y: -0.72, elevationMeters: 14, population: 630000 },
      { name: 'Genoa', x: -0.28, y: 0.25, elevationMeters: 19, population: 560000 },
      { name: 'Venice (Venezia)', x: 0.08, y: 0.45, elevationMeters: 1, population: 250000 },
      { name: 'Florence', x: -0.05, y: 0.12, elevationMeters: 50, population: 360000 }
    ],
    floodHistoryParagraphs: [
      'Italy possesses a dramatically varied terrain: the snowcapped Alps in the north, the Apennine spine traversing its center, and the vast agricultural Po River Valley. Its extensive Mediterranean coastline and historic coastal lagoons make it uniquely susceptible to both rapid mountain flash floods (torrenti) and tidal storm surges (acqua alta).',
      'The catastrophic flood of November 4, 1966, struck both Venice and Florence simultaneously. In Venice, sea levels surged 194 cm above normal, submerging St. Mark\'s Square under more than a meter of water for 22 hours. In Florence, the Arno River burst its banks at 67 km/h, drowning 101 people and inundating the historic Uffizi Gallery, Biblioteca Nazionale, and thousands of Renaissance masterpieces in oil, sludge, and mud.',
      'In October 2020, after decades of construction, Venice activated the MOSE (Modulo Sperimentale Elettromeccanico) system—a series of 78 yellow submerged barrier gates at the three inlets connecting the Venetian Lagoon with the Adriatic Sea. When high tides approach 110 cm, compressed air empties the gates, causing them to pivot upwards and isolate the historic lagoon from sea surges.'
    ],
    historicalFloods: [
      {
        year: 1966,
        name: 'The Dual Flood of Venice & Florence',
        waterLevelOrSurge: '194 cm tide in Venice / 4,500 m³/s on Arno',
        casualties: '135 deaths nationwide',
        affectedPeople: '50,000 families displaced',
        damageCost: '$2 Billion (1966 USD)',
        summary: 'Catastrophic double catastrophe destroying Renaissance art libraries in Florence and inundating Venice under record saltwater surge.',
        primaryCause: 'Historic Mediterranean cyclone stalled against alpine barrier'
      },
      {
        year: 2019,
        name: 'Venice Acqua Alta Surge',
        waterLevelOrSurge: '187 cm peak tide (second highest in history)',
        casualties: '2 deaths',
        affectedPeople: 'Over 85% of Venice flooded',
        damageCost: '€1 Billion',
        summary: 'St. Mark\'s Basilica crypt inundated with corrosive saltwater; accelerated completion of the MOSE barrier system.',
        primaryCause: 'Scirocco storm winds converging with astronomical full moon tide'
      },
      {
        year: 2023,
        name: 'Emilia-Romagna Flash Floods',
        waterLevelOrSurge: '23 rivers burst banks simultaneously',
        casualties: '17 deaths',
        affectedPeople: '50,000 displaced',
        damageCost: '€8.8 Billion',
        summary: 'Six months\' worth of rain fell in 36 hours across Ravenna, Forlì, and Cesena, causing over 300 landslides.',
        primaryCause: 'Consecutive Mediterranean tropical-like cyclones (Medicanes)'
      }
    ],
    annualAverageRainfallMm: 950,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 65 },
      { month: 'Feb', rainfallMm: 60 },
      { month: 'Mar', rainfallMm: 68 },
      { month: 'Apr', rainfallMm: 72 },
      { month: 'May', rainfallMm: 65 },
      { month: 'Jun', rainfallMm: 45 },
      { month: 'Jul', rainfallMm: 30 },
      { month: 'Aug', rainfallMm: 42 },
      { month: 'Sep', rainfallMm: 80 },
      { month: 'Oct', rainfallMm: 120 },
      { month: 'Nov', rainfallMm: 135 },
      { month: 'Dec', rainfallMm: 88 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 920, anomalyPercent: -3.1 },
      { decade: '1980s', annualAverageMm: 910, anomalyPercent: -4.2 },
      { decade: '1990s', annualAverageMm: 940, anomalyPercent: -1.0 },
      { decade: '2000s', annualAverageMm: 960, anomalyPercent: +1.0 },
      { decade: '2010s', annualAverageMm: 990, anomalyPercent: +4.2 },
      { decade: '2020s', annualAverageMm: 1030, anomalyPercent: +8.4 }
    ],
    record24HrRainfallMm: 496,
    recordRainfallLocation: 'Rossiglione (Liguria, October 2021)',
    floodDefenseSystems: [
      'MOSE (Modulo Sperimentale Elettromeccanico) 78 Submerged Lagoon Gates',
      'Po River Basin Authority Diversion Canals and Cavo Napoleonico',
      'Arno River Upstream Retardation Basins (Bilancino Dam & Roffia)',
      'Genoa Bisagno Stream Underground Overflow Diversion Tunnel'
    ]
  },
  {
    id: 'united_kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    continent: 'Europe',
    population: 68000000,
    urbanPopulationPercent: 84,
    coastalVulnerablePercent: 42,
    totalAreaKm2: 242495,
    densityPerKm2: 281,
    highestPoint: {
      name: 'Ben Nevis (Grampian Mountains, Scotland)',
      elevationMeters: 1345
    },
    lowestPoint: {
      name: 'The Fens (Holme Fen, Cambridgeshire)',
      elevationMeters: -4
    },
    averageElevationMeters: 162,
    topographyType: 'coastal_plain',
    terrainRoughness: 0.45,
    forestCoverPercent: 13,
    waterCoverPercent: 1.5,
    cities: [
      { name: 'London', x: 0.18, y: -0.18, elevationMeters: 11, population: 9000000, isCapital: true },
      { name: 'Manchester', x: 0.02, y: 0.12, elevationMeters: 38, population: 2800000 },
      { name: 'Birmingham', x: 0.05, y: -0.05, elevationMeters: 140, population: 2600000 },
      { name: 'Glasgow', x: -0.15, y: 0.52, elevationMeters: 26, population: 1700000 },
      { name: 'Edinburgh', x: -0.02, y: 0.55, elevationMeters: 47, population: 530000 },
      { name: 'Cardiff', x: -0.18, y: -0.22, elevationMeters: 15, population: 360000 },
      { name: 'Belfast', x: -0.42, y: 0.32, elevationMeters: 17, population: 345000 }
    ],
    floodHistoryParagraphs: [
      'The United Kingdom faces persistent flood threats from maritime Atlantic depressions, river basin saturation (Severn, Thames, Ouse), and dangerous North Sea funnel storm surges that funnel water into the English Channel and the Thames Estuary.',
      'The infamous 1953 North Sea surge claimed 307 British lives, flooded 160,000 acres of farmland, and shut down coastal oil refineries in Essex and Kent. This catastrophe proved that London was at grave risk of a catastrophic storm surge that could submerge the Houses of Parliament, Underground transit lines, and the City of London financial core.',
      'In response, Britain constructed the Thames Barrier at Woolwich Reach, operational since 1982. Spanning 520 meters across the River Thames with 10 rotating steel drum gates, each weighing over 3,300 tons, the barrier has been closed over 200 times to protect central London from tidal surges.'
    ],
    historicalFloods: [
      {
        year: 1953,
        name: 'The East Coast North Sea Surge',
        waterLevelOrSurge: 'Over 3m above predicted tide',
        casualties: '307 deaths in UK',
        affectedPeople: '32,000 evacuated',
        damageCost: '£50 Million (1953 value)',
        summary: 'Extreme North Sea gale funnel surge breached 1,200 coastal sea walls from Lincolnshire to Kent.',
        primaryCause: 'Atmospheric low pressure paired with spring tide and hurricane-force winds'
      },
      {
        year: 2007,
        name: 'Summer Floods of England & Wales',
        waterLevelOrSurge: 'Wettest May-July on record since 1766',
        casualties: '13 deaths',
        affectedPeople: '55,000 homes flooded; 350,000 without tap water',
        damageCost: '£3.2 Billion',
        summary: 'Severn and Trent rivers burst banks, submerging Mythe Water Treatment works in Gloucestershire.',
        primaryCause: 'Stagnant polar front jet stream dumping 414 mm summer rain'
      },
      {
        year: 2015,
        name: 'Storm Desmond Lake District Deluge',
        waterLevelOrSurge: '341.4 mm rain in 24 hours (UK Record)',
        casualties: '3 deaths',
        affectedPeople: '16,000 properties flooded',
        damageCost: '£1.6 Billion',
        summary: 'Atmospheric river caused catastrophic inundation across Cumbria, Carlisle, and Lancashire.',
        primaryCause: 'Warm Atlantic atmospheric conveyor belt stalling over Cumbrian fells'
      }
    ],
    annualAverageRainfallMm: 1150,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 121 },
      { month: 'Feb', rainfallMm: 89 },
      { month: 'Mar', rainfallMm: 85 },
      { month: 'Apr', rainfallMm: 72 },
      { month: 'May', rainfallMm: 70 },
      { month: 'Jun', rainfallMm: 73 },
      { month: 'Jul', rainfallMm: 78 },
      { month: 'Aug', rainfallMm: 89 },
      { month: 'Sep', rainfallMm: 96 },
      { month: 'Oct', rainfallMm: 127 },
      { month: 'Nov', rainfallMm: 121 },
      { month: 'Dec', rainfallMm: 129 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 1080, anomalyPercent: -6.0 },
      { decade: '1980s', annualAverageMm: 1130, anomalyPercent: -1.7 },
      { decade: '1990s', annualAverageMm: 1160, anomalyPercent: +0.8 },
      { decade: '2000s', annualAverageMm: 1175, anomalyPercent: +2.1 },
      { decade: '2010s', annualAverageMm: 1205, anomalyPercent: +4.7 },
      { decade: '2020s', annualAverageMm: 1240, anomalyPercent: +7.8 }
    ],
    record24HrRainfallMm: 341.4,
    recordRainfallLocation: 'Honister Pass (Cumbria, December 2015)',
    floodDefenseSystems: [
      'Thames Barrier (Woolwich Reach, 10 steel rotating sectors)',
      'Jubilee River 11.6 km Flood Relief Channel (Maidenhead and Windsor)',
      'Somerset Levels 20-Year Flood Action Plan & Pumping Stations',
      'Hull Tidal Surge Barrier and Humber Estuary Defenses'
    ]
  },
  {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    continent: 'South America',
    population: 215000000,
    urbanPopulationPercent: 87,
    coastalVulnerablePercent: 28,
    totalAreaKm2: 8515767,
    densityPerKm2: 25,
    highestPoint: {
      name: 'Pico da Neblina (Amazonas)',
      elevationMeters: 2995
    },
    lowestPoint: {
      name: 'Atlantic Ocean Coast',
      elevationMeters: 0
    },
    averageElevationMeters: 320,
    topographyType: 'basin',
    terrainRoughness: 0.35,
    forestCoverPercent: 59,
    waterCoverPercent: 4.5,
    cities: [
      { name: 'Brasília', x: 0.15, y: -0.15, elevationMeters: 1172, population: 3100000, isCapital: true },
      { name: 'São Paulo', x: 0.22, y: -0.42, elevationMeters: 760, population: 12300000 },
      { name: 'Rio de Janeiro', x: 0.35, y: -0.38, elevationMeters: 11, population: 6700000 },
      { name: 'Salvador', x: 0.45, y: -0.12, elevationMeters: 8, population: 2900000 },
      { name: 'Fortaleza', x: 0.48, y: 0.18, elevationMeters: 21, population: 2700000 },
      { name: 'Belo Horizonte', x: 0.28, y: -0.32, elevationMeters: 858, population: 2500000 },
      { name: 'Manaus', x: -0.22, y: 0.12, elevationMeters: 92, population: 2200000 },
      { name: 'Porto Alegre', x: 0.08, y: -0.68, elevationMeters: 10, population: 1500000 }
    ],
    floodHistoryParagraphs: [
      'Brazil contains the world\'s largest freshwater river basin—the Amazon River—which discharges roughly 20% of the entire world\'s river flow into the ocean. While the Amazon\'s seasonal flood pulse (várzea) is a natural ecological rhythm, urbanized regions in the south and southeast face devastating consequences from extreme precipitation events, exacerbated by urban sprawl over steep hillsides (morros).',
      'The catastrophe in Rio Grande do Sul in April–May 2024 stands as the worst climate disaster in Brazilian history. Relentless atmospheric moisture blocked over southern Brazil dumped more than 700 mm of rain within days, causing the Guaíba River to swell past 5.35 meters—surpassing the historic 1941 flood benchmark. More than 450 municipalities were affected, Porto Alegre\'s international airport was submerged, and over 600,000 people were displaced.',
      'In response to recurrent landslide and flood crises in urban centers like the Região Serrana of Rio de Janeiro and São Paulo\'s Tietê basin, Brazil established the National Center for Monitoring and Early Warning of Natural Disasters (CEMADEN), mapping high-risk geological areas and deploying automated sirens.'
    ],
    historicalFloods: [
      {
        year: 2024,
        name: 'The Great Rio Grande do Sul Catastrophe',
        waterLevelOrSurge: 'Guaíba River record crest 5.35m',
        casualties: '183 deaths',
        affectedPeople: '2,300,000 affected; 600,000+ displaced',
        damageCost: 'R$ 50 Billion ($9.5 Billion USD)',
        summary: 'Massive rainfall submerged the capital city of Porto Alegre, flooded 450 cities, and caused unprecedented infrastructure disruption.',
        primaryCause: 'Atmospheric blocking coupled with extreme tropical moisture and El Niño'
      },
      {
        year: 2011,
        name: 'Região Serrana Landslides & Flash Floods',
        waterLevelOrSurge: '260 mm rain in 24 hours on steep slopes',
        casualties: '918 deaths',
        affectedPeople: '30,000 homeless',
        damageCost: '$2.5 Billion USD',
        summary: 'Deadliest natural disaster in Brazilian history; triggered massive debris flows through Nova Friburgo, Teresópolis, and Petrópolis.',
        primaryCause: 'South Atlantic Convergence Zone (SACZ) stalling over coastal mountain range'
      },
      {
        year: 1941,
        name: 'Historic Porto Alegre Flood',
        waterLevelOrSurge: '4.76m record Guaíba crest',
        casualties: '20+ deaths',
        affectedPeople: '70,000 homeless (quarter of city)',
        damageCost: 'Extensive historic loss',
        summary: 'Flooded downtown Porto Alegre for 40 days, which led to the construction of the Mauá Wall defense system.',
        primaryCause: '22 consecutive days of torrential autumn rains'
      }
    ],
    annualAverageRainfallMm: 1780,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 240 },
      { month: 'Feb', rainfallMm: 220 },
      { month: 'Mar', rainfallMm: 210 },
      { month: 'Apr', rainfallMm: 130 },
      { month: 'May', rainfallMm: 95 },
      { month: 'Jun', rainfallMm: 75 },
      { month: 'Jul', rainfallMm: 60 },
      { month: 'Aug', rainfallMm: 65 },
      { month: 'Sep', rainfallMm: 105 },
      { month: 'Oct', rainfallMm: 155 },
      { month: 'Nov', rainfallMm: 195 },
      { month: 'Dec', rainfallMm: 230 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 1720, anomalyPercent: -3.3 },
      { decade: '1980s', annualAverageMm: 1750, anomalyPercent: -1.6 },
      { decade: '1990s', annualAverageMm: 1780, anomalyPercent: 0.0 },
      { decade: '2000s', annualAverageMm: 1800, anomalyPercent: +1.1 },
      { decade: '2010s', annualAverageMm: 1830, anomalyPercent: +2.8 },
      { decade: '2020s', annualAverageMm: 1890, anomalyPercent: +6.1 }
    ],
    record24HrRainfallMm: 534,
    recordRainfallLocation: 'São Sebastião (São Paulo Coast, Feb 2023)',
    floodDefenseSystems: [
      'Mauá Wall (Muro da Mauá) 2.6 km floodwall in Porto Alegre',
      'CEMADEN Geotechnical Early Warning Radar and Siren Network',
      'Tietê & Pinheiros River Deepening and Polder Basins in São Paulo',
      'Amazonian Basin Automated Hydrometric Telemetry Stations'
    ]
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    flag: '🇻🇳',
    continent: 'Asia',
    population: 100000000,
    urbanPopulationPercent: 39,
    coastalVulnerablePercent: 55,
    totalAreaKm2: 331210,
    densityPerKm2: 314,
    highestPoint: {
      name: 'Fansipan (Phan Xi Păng, Lào Cai)',
      elevationMeters: 3147
    },
    lowestPoint: {
      name: 'South China Sea (East Sea) Coast',
      elevationMeters: 0
    },
    averageElevationMeters: 398,
    topographyType: 'delta',
    terrainRoughness: 0.55,
    forestCoverPercent: 47,
    waterCoverPercent: 6,
    cities: [
      { name: 'Hanoi', x: -0.15, y: 0.52, elevationMeters: 16, population: 8500000, isCapital: true },
      { name: 'Ho Chi Minh City', x: 0.12, y: -0.42, elevationMeters: 19, population: 9300000 },
      { name: 'Da Nang', x: 0.15, y: 0.12, elevationMeters: 10, population: 1200000 },
      { name: 'Hai Phong', x: -0.05, y: 0.55, elevationMeters: 4, population: 2000000 },
      { name: 'Can Tho (Mekong Delta)', x: 0.05, y: -0.52, elevationMeters: 2, population: 1300000 },
      { name: 'Nha Trang', x: 0.28, y: -0.22, elevationMeters: 6, population: 530000 },
      { name: 'Hue', x: 0.12, y: 0.18, elevationMeters: 14, population: 490000 }
    ],
    floodHistoryParagraphs: [
      'Vietnam\'s geography is defined by two massive agricultural deltas: the Red River Delta in the north and the expansive Mekong River Delta in the south, interconnected by a long, narrow coastal plain backed by the Annamite Mountain Range. The Mekong Delta produces over 50% of the country\'s rice and sits on average less than two meters above sea level, making it one of the planet\'s most climate-vulnerable zones.',
      'The 1971 Red River Flood remains Vietnam\'s deadliest disaster in recorded history. Torrential rains caused dyke failures across northern provinces, submerging more than 250,000 hectares of cropland and taking an estimated 100,000 lives during wartime conditions. In modern times, the Mekong Delta faces the double hazard of seasonal flooding and low-flow saltwater intrusion that threatens the nation\'s food supply.',
      'To safeguard its territory, Vietnam maintains the ancient Red River Dyke system—a 3,000-kilometer engineering network begun over a millennium ago. In the southern deltas, the focus has shifted toward "living with floods" (sống chung với lũ), incorporating elevated cluster settlements, mangrove coastal belts, and smart tidal sluices such as the Cai Lon - Cai Be super-project.'
    ],
    historicalFloods: [
      {
        year: 1971,
        name: 'The Great Red River Flood',
        waterLevelOrSurge: 'Over 14.1m water mark in Hanoi',
        casualties: '100,000 estimated deaths',
        affectedPeople: '2,700,000 affected',
        damageCost: 'Wartime catastrophic loss',
        summary: 'Massive dyke breaches along the Red River devastated northern Vietnam during the Vietnam War.',
        primaryCause: 'Historic continuous monsoon rainfall in upstream Yunnan and northern mountains'
      },
      {
        year: 2000,
        name: 'Historic Mekong Delta Inundation',
        waterLevelOrSurge: '5.06m at Tan Chau station',
        casualties: '539 deaths (300+ children)',
        affectedPeople: '5,000,000 affected',
        damageCost: '$285 Million USD',
        summary: 'Submerged 90% of Dong Thap and An Giang provinces for three months; revolutionized national child swim safety programs.',
        primaryCause: 'Simultaneous upstream Mekong peak and extreme monsoon'
      },
      {
        year: 2024,
        name: 'Typhoon Yagi Northern Flood Crisis',
        waterLevelOrSurge: 'Historic Red River and Thao River crests',
        casualties: '344 deaths and missing',
        affectedPeople: 'Thousands displaced',
        damageCost: '$3.3 Billion USD',
        summary: 'Category 5 Super Typhoon Yagi caused widespread landslides in Lao Cai and Yen Bai and brought the Red River in Hanoi to a 20-year high.',
        primaryCause: 'Intense typhoon landfall accompanied by prolonged mountainous downpours'
      }
    ],
    annualAverageRainfallMm: 1820,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 22 },
      { month: 'Feb', rainfallMm: 28 },
      { month: 'Mar', rainfallMm: 45 },
      { month: 'Apr', rainfallMm: 85 },
      { month: 'May', rainfallMm: 210 },
      { month: 'Jun', rainfallMm: 270 },
      { month: 'Jul', rainfallMm: 290 },
      { month: 'Aug', rainfallMm: 330 },
      { month: 'Sep', rainfallMm: 280 },
      { month: 'Oct', rainfallMm: 165 },
      { month: 'Nov', rainfallMm: 65 },
      { month: 'Dec', rainfallMm: 30 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 1750, anomalyPercent: -3.8 },
      { decade: '1980s', annualAverageMm: 1780, anomalyPercent: -2.2 },
      { decade: '1990s', annualAverageMm: 1810, anomalyPercent: -0.5 },
      { decade: '2000s', annualAverageMm: 1840, anomalyPercent: +1.0 },
      { decade: '2010s', annualAverageMm: 1890, anomalyPercent: +3.8 },
      { decade: '2020s', annualAverageMm: 1940, anomalyPercent: +6.5 }
    ],
    record24HrRainfallMm: 792,
    recordRainfallLocation: 'Bach Ma (Thua Thien Hue, Nov 1999)',
    floodDefenseSystems: [
      'Ancient Red River Dyke System (over 3,000 km of fortified earth and concrete)',
      'Cai Lon - Cai Be Tidal Sluice Gate System (Mekong Delta)',
      'Hoa Binh and Son La Multi-Purpose Hydropower Flood Retention Reservoirs',
      'Living with Floods (Sống chung với lũ) Elevated Residential Clusters'
    ]
  },
  {
    id: 'egypt',
    name: 'Egypt',
    flag: '🇪🇬',
    continent: 'Africa',
    population: 112000000,
    urbanPopulationPercent: 44,
    coastalVulnerablePercent: 22,
    totalAreaKm2: 1002450,
    densityPerKm2: 111,
    highestPoint: {
      name: 'Mount Catherine (Gabal Katrîna, Sinai)',
      elevationMeters: 2629
    },
    lowestPoint: {
      name: 'Qattara Depression (Matrouh)',
      elevationMeters: -133
    },
    averageElevationMeters: 321,
    topographyType: 'delta',
    terrainRoughness: 0.25,
    forestCoverPercent: 0.1,
    waterCoverPercent: 0.6,
    cities: [
      { name: 'Cairo', x: 0.05, y: 0.25, elevationMeters: 23, population: 22000000, isCapital: true },
      { name: 'Alexandria', x: -0.15, y: 0.42, elevationMeters: 5, population: 5300000 },
      { name: 'Giza', x: 0.03, y: 0.22, elevationMeters: 20, population: 4300000 },
      { name: 'Port Said', x: 0.25, y: 0.42, elevationMeters: 3, population: 780000 },
      { name: 'Suez', x: 0.22, y: 0.22, elevationMeters: 7, population: 750000 },
      { name: 'Luxor', x: 0.15, y: -0.32, elevationMeters: 89, population: 500000 },
      { name: 'Aswan', x: 0.12, y: -0.58, elevationMeters: 106, population: 380000 }
    ],
    floodHistoryParagraphs: [
      'For millennia, Egyptian civilization revolved around the annual flood pulse of the Nile River (the Inundation or Akhet), which deposited fertile black silt across the arid river valley. However, severe flood years brought death and ruin, while drought years produced famine. This ancient dynamic was permanently transformed in 1970 with the completion of the Aswan High Dam.',
      'The Aswan High Dam created Lake Nasser—one of the largest man-made reservoirs on Earth—providing 169 billion cubic meters of flood storage capacity. The dam shielded Egypt from devastating Nile overtopping during the mega-floods of 1975 and 1988, while providing water during African droughts. In modern times, the major flood danger has shifted to the low-lying Nile Delta and the Mediterranean coast around Alexandria.',
      'Alexandria, founded by Alexander the Great in 331 BCE, sits largely within a few meters of the Mediterranean Sea. Sinking at roughly 2 to 3 millimeters per year due to natural sediment compaction and gas extraction, coastal Alexandria faces existential risks from rising sea levels and intense winter Mediterranean storms (nawas).'
    ],
    historicalFloods: [
      {
        year: 1946,
        name: 'The Historic Great Nile Inundation',
        waterLevelOrSurge: 'Nile peak reached 33.4 feet at Roda Nilometer',
        casualties: 'Hundreds dead, thousands homeless',
        affectedPeople: 'Entire Nile Valley inundated',
        damageCost: 'Severe agricultural collapse',
        summary: 'One of the highest recorded Nile floods of the 20th century before the Aswan High Dam halted natural river inundations.',
        primaryCause: 'Historic Ethiopian monsoon downpours on the Blue Nile'
      },
      {
        year: 2015,
        name: 'Alexandria Severe Coastal Deluge',
        waterLevelOrSurge: 'Severe coastal flash floods & canal overflow',
        casualties: '6 deaths',
        affectedPeople: 'Hundreds of thousands impacted',
        damageCost: '$150 Million USD',
        summary: 'Severe storm "Nawa" overwhelmed century-old storm sewers and flooded tunnels and ground floors across Alexandria.',
        primaryCause: 'Severe Mediterranean winter storm coupled with high sea surge'
      },
      {
        year: 2020,
        name: 'The "Dragon Storm" Deluge',
        waterLevelOrSurge: 'Severe nationwide flash floods in desert wadis',
        casualties: '21 deaths',
        affectedPeople: 'Nationwide shutdown of transit and schools',
        damageCost: '$200 Million USD',
        summary: 'Unprecedented convective cyclone brought continuous torrential rain across Cairo, Sinai wadis, and Upper Egypt.',
        primaryCause: 'Rare cyclone merging tropical moisture and Mediterranean trough'
      }
    ],
    annualAverageRainfallMm: 51,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 12 },
      { month: 'Feb', rainfallMm: 9 },
      { month: 'Mar', rainfallMm: 6 },
      { month: 'Apr', rainfallMm: 2 },
      { month: 'May', rainfallMm: 1 },
      { month: 'Jun', rainfallMm: 0 },
      { month: 'Jul', rainfallMm: 0 },
      { month: 'Aug', rainfallMm: 0 },
      { month: 'Sep', rainfallMm: 0 },
      { month: 'Oct', rainfallMm: 3 },
      { month: 'Nov', rainfallMm: 8 },
      { month: 'Dec', rainfallMm: 10 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 45, anomalyPercent: -11.7 },
      { decade: '1980s', annualAverageMm: 48, anomalyPercent: -5.8 },
      { decade: '1990s', annualAverageMm: 50, anomalyPercent: -1.9 },
      { decade: '2000s', annualAverageMm: 52, anomalyPercent: +2.0 },
      { decade: '2010s', annualAverageMm: 56, anomalyPercent: +9.8 },
      { decade: '2020s', annualAverageMm: 62, anomalyPercent: +21.5 }
    ],
    record24HrRainfallMm: 105,
    recordRainfallLocation: 'Sinai Peninsula Wadi Flash Flood (2020)',
    floodDefenseSystems: [
      'Aswan High Dam and Lake Nasser Emergency Spillway (Toshka Lakes)',
      'Alexandria Coastal Sea Wall and Tetrapod Wave-Breaker Arrays',
      'Nile Delta Climate Change Adaptation Project (69 km sand dykes)',
      'Sinai Desert Wadi Retention Dams and Groundwater Recharge Basins'
    ]
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    continent: 'Europe',
    population: 84000000,
    urbanPopulationPercent: 77,
    coastalVulnerablePercent: 20,
    totalAreaKm2: 357022,
    densityPerKm2: 235,
    highestPoint: {
      name: 'Zugspitze (Bavarian Alps)',
      elevationMeters: 2962
    },
    lowestPoint: {
      name: 'Neuendorf-Sachsenbande (Wilstermarsch)',
      elevationMeters: -3.5
    },
    averageElevationMeters: 263,
    topographyType: 'basin',
    terrainRoughness: 0.5,
    forestCoverPercent: 32,
    waterCoverPercent: 2.2,
    cities: [
      { name: 'Berlin', x: 0.28, y: 0.32, elevationMeters: 34, population: 3750000, isCapital: true },
      { name: 'Hamburg', x: 0.05, y: 0.48, elevationMeters: 6, population: 1900000 },
      { name: 'Munich (München)', x: 0.18, y: -0.45, elevationMeters: 519, population: 1500000 },
      { name: 'Cologne (Köln)', x: -0.32, y: 0.08, elevationMeters: 53, population: 1080000 },
      { name: 'Frankfurt', x: -0.15, y: -0.08, elevationMeters: 112, population: 760000 },
      { name: 'Stuttgart', x: -0.12, y: -0.32, elevationMeters: 247, population: 630000 },
      { name: 'Düsseldorf', x: -0.35, y: 0.15, elevationMeters: 38, population: 620000 }
    ],
    floodHistoryParagraphs: [
      'Germany is traversed by some of Western Europe\'s most vital commercial waterways: the Rhine, the Elbe, the Danube, and the Oder. While northern Germany possesses low-lying coastal marshes bordering the North and Baltic seas, the central and southern regions feature narrow, steep-sided river valleys nestled within mountain ranges such as the Eifel, Harz, and Alps.',
      'In July 2021, Low-Pressure System "Bernd" triggered the deadliest natural disaster in modern Germany in six decades. Up to 182 mm of rain fell in under 24 hours onto pre-saturated ground across Rhineland-Palatinate and North Rhine-Westphalia. The picturesque Ahr River swelled from a normal depth of one meter into a ferocious ten-meter torrent, destroying 62 bridges and killing 135 people in the Ahr Valley alone.',
      'Following the catastrophic Elbe floods of 2002 and the 2021 disaster, Germany revamped its flood action strategies. The nation introduced cell-broadcast emergency alerts (DE-Alert), accelerated polder and retention basin construction along the Rhine, and dismantled rigid river canalization in favor of natural flood retention zones.'
    ],
    historicalFloods: [
      {
        year: 2021,
        name: 'The Ahr Valley & Western Germany Flash Flood',
        waterLevelOrSurge: 'Ahr River swelled from 1m to 10m',
        casualties: '189 deaths in Germany',
        affectedPeople: 'Over 40,000 residents heavily affected',
        damageCost: '€33 Billion ($36 Billion USD)',
        summary: 'Deadliest German disaster since 1962; catastrophic flash flooding tore away entire historic villages and rail lines in the Eifel region.',
        primaryCause: 'Stagnant cut-off low "Bernd" dropping 182 mm onto saturated terrain'
      },
      {
        year: 2002,
        name: 'The Central European Elbe & Danube Flood (Jahrhundertflut)',
        waterLevelOrSurge: 'Elbe reached 9.40m in Dresden (Historic record)',
        casualties: '21 deaths in Germany',
        affectedPeople: '300,000 evacuated across Saxony',
        damageCost: '€11.6 Billion',
        summary: 'Inundated Dresden\'s historic Semperoper, Zwinger Palace, and central train station; spurred total overhaul of dyke systems.',
        primaryCause: 'Vb weather system drawing Mediterranean moisture into Central Europe'
      },
      {
        year: 1962,
        name: 'The Great Hamburg North Sea Surge',
        waterLevelOrSurge: '5.70m above sea level in Hamburg harbour',
        casualties: '315 deaths in Hamburg',
        affectedPeople: '60,000 made homeless',
        damageCost: 'DM 800 Million',
        summary: 'North Sea hurricane-force gale drove water up the Elbe, breaching dykes in 60 places and submerging Wilhelmsburg.',
        primaryCause: 'Storm Vincinette hurricane gale during high spring tide'
      }
    ],
    annualAverageRainfallMm: 789,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 61 },
      { month: 'Feb', rainfallMm: 49 },
      { month: 'Mar', rainfallMm: 57 },
      { month: 'Apr', rainfallMm: 48 },
      { month: 'May', rainfallMm: 65 },
      { month: 'Jun', rainfallMm: 76 },
      { month: 'Jul', rainfallMm: 78 },
      { month: 'Aug', rainfallMm: 69 },
      { month: 'Sep', rainfallMm: 60 },
      { month: 'Oct', rainfallMm: 56 },
      { month: 'Nov', rainfallMm: 63 },
      { month: 'Dec', rainfallMm: 67 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 740, anomalyPercent: -6.2 },
      { decade: '1980s', annualAverageMm: 770, anomalyPercent: -2.4 },
      { decade: '1990s', annualAverageMm: 800, anomalyPercent: +1.4 },
      { decade: '2000s', annualAverageMm: 815, anomalyPercent: +3.3 },
      { decade: '2010s', annualAverageMm: 810, anomalyPercent: +2.7 },
      { decade: '2020s', annualAverageMm: 845, anomalyPercent: +7.1 }
    ],
    record24HrRainfallMm: 312,
    recordRainfallLocation: 'Zinnwald-Georgenfeld (Ore Mountains, August 2002)',
    floodDefenseSystems: [
      'Rhine Integrated Flood Management Program (Polders with 250M m³ capacity)',
      'Hamburg Hafencity Elevated Flood Podiums and Mobile Surge Floodwalls',
      'Federal BBK DE-Alert Satellite-Assisted Cell Broadcast Warning Network',
      'Dresden and Elbe Basin Fortified Quayside Flood Barriers'
    ]
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    population: 27000000,
    urbanPopulationPercent: 86,
    coastalVulnerablePercent: 85,
    totalAreaKm2: 7692024,
    densityPerKm2: 3.5,
    highestPoint: {
      name: 'Mount Kosciuszko (New South Wales)',
      elevationMeters: 2228
    },
    lowestPoint: {
      name: 'Lake Eyre (Kati Thanda, South Australia)',
      elevationMeters: -15
    },
    averageElevationMeters: 330,
    topographyType: 'basin',
    terrainRoughness: 0.35,
    forestCoverPercent: 17,
    waterCoverPercent: 1.8,
    cities: [
      { name: 'Canberra', x: 0.28, y: -0.42, elevationMeters: 580, population: 460000, isCapital: true },
      { name: 'Sydney', x: 0.35, y: -0.38, elevationMeters: 19, population: 5300000 },
      { name: 'Melbourne', x: 0.22, y: -0.58, elevationMeters: 31, population: 5100000 },
      { name: 'Brisbane', x: 0.38, y: -0.15, elevationMeters: 28, population: 2600000 },
      { name: 'Perth', x: -0.48, y: -0.42, elevationMeters: 18, population: 2200000 },
      { name: 'Adelaide', x: 0.05, y: -0.48, elevationMeters: 50, population: 1400000 },
      { name: 'Darwin', x: -0.05, y: 0.55, elevationMeters: 30, population: 150000 },
      { name: 'Cairns', x: 0.25, y: 0.32, elevationMeters: 10, population: 160000 }
    ],
    floodHistoryParagraphs: [
      'Australia is a continent of climatic extremes, famous for the phrase "a sunburnt country... of droughts and flooding rains." With over 85% of its population living within 50 kilometers of the coast and across major river basins like the Murray-Darling and Brisbane rivers, weather oscillations driven by La Niña and the Indian Ocean Dipole can flip severe multi-year droughts into multi-basin deluge disasters.',
      'The 2010–2011 Queensland Floods submerged an area larger than France and Germany combined. Consecutive tropical cyclones and a record-strength La Niña saturated river catchments across eastern Australia, culminating in the flooding of Brisbane, where the river peaked at 4.46 meters. Thirty-five people died, and 75% of Queensland was declared a disaster zone.',
      'In February–March 2022, Eastern Australia suffered its costliest flood event when an atmospheric river stalled over South East Queensland and Northern New South Wales. In Lismore, the Wilsons River rose to an unprecedented 14.4 meters, overtopping the city\'s flood levee by over two meters and forcing hundreds of residents to seek rescue on rooftops.'
    ],
    historicalFloods: [
      {
        year: 2022,
        name: 'Eastern Australia / Lismore Catastrophe',
        waterLevelOrSurge: 'Wilsons River record 14.4m crest',
        casualties: '24 deaths',
        affectedPeople: 'Over 100,000 impacted',
        damageCost: '$6.7 Billion AUD ($4.5 Billion USD)',
        summary: 'Atmospheric river triggered catastrophic levee failures in Lismore and flooded thousands of homes across Brisbane and Sydney.',
        primaryCause: 'Consecutive La Niña rain bombs and stalled atmospheric rivers'
      },
      {
        year: 2011,
        name: 'The Queensland Mega-Floods & Brisbane River Crest',
        waterLevelOrSurge: 'Brisbane River peak 4.46m',
        casualties: '35 deaths',
        affectedPeople: '200,000+ affected across 70 towns',
        damageCost: '$2.38 Billion AUD',
        summary: 'Inundated three-quarters of Queensland; catastrophic flash flood swept through Toowoomba and the Lockyer Valley.',
        primaryCause: 'Super La Niña event combined with Cyclone Tasha'
      },
      {
        year: 1974,
        name: 'Brisbane Australia Day Floods',
        waterLevelOrSurge: 'Brisbane River peak 5.45m',
        casualties: '16 deaths',
        affectedPeople: '8,500 homes inundated',
        damageCost: '$980 Million AUD (adjusted)',
        summary: 'Cyclone Wanda dumped 642 mm of rain in 36 hours; prompted construction of the Wivenhoe Dam.',
        primaryCause: 'Tropical Cyclone Wanda crossing northern NSW/QLD border'
      }
    ],
    annualAverageRainfallMm: 465,
    monthlyRainfall: [
      { month: 'Jan', rainfallMm: 62 },
      { month: 'Feb', rainfallMm: 68 },
      { month: 'Mar', rainfallMm: 54 },
      { month: 'Apr', rainfallMm: 32 },
      { month: 'May', rainfallMm: 28 },
      { month: 'Jun', rainfallMm: 24 },
      { month: 'Jul', rainfallMm: 20 },
      { month: 'Aug', rainfallMm: 18 },
      { month: 'Sep', rainfallMm: 22 },
      { month: 'Oct', rainfallMm: 30 },
      { month: 'Nov', rainfallMm: 44 },
      { month: 'Dec', rainfallMm: 52 }
    ],
    decadalRainfall: [
      { decade: '1970s', annualAverageMm: 490, anomalyPercent: +5.3 },
      { decade: '1980s', annualAverageMm: 450, anomalyPercent: -3.2 },
      { decade: '1990s', annualAverageMm: 460, anomalyPercent: -1.1 },
      { decade: '2000s', annualAverageMm: 435, anomalyPercent: -6.5 },
      { decade: '2010s', annualAverageMm: 470, anomalyPercent: +1.1 },
      { decade: '2020s', annualAverageMm: 510, anomalyPercent: +9.6 }
    ],
    record24HrRainfallMm: 907,
    recordRainfallLocation: 'Crohamhurst (Queensland, 1893)',
    floodDefenseSystems: [
      'Wivenhoe Dam (1.96 Million Megaliters Flood Mitigation Storage)',
      'Brisbane River Flood Warning Network & Gauge Telemetry',
      'Lismore CBD Concrete Flood Levee and Spillway',
      'Bureau of Meteorology (BOM) Next-Gen Doppler Radar Network'
    ]
  }
];
