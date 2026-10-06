export interface ElevationZone {
  name: string;
  minElevation: number;
  maxElevation: number;
  path: string; // SVG path command in 1000x1000 coordinate space
  type: 'peak' | 'mid' | 'lowland' | 'delta';
}

export interface RiverPath {
  name: string;
  d: string;
  width: number;
}

export interface PopulationCluster {
  name: string;
  x: number; // 0 to 1000
  y: number; // 0 to 1000
  radius: number;
  density: 'dark_red' | 'red' | 'white';
  populationText: string;
}

export interface CountryGeometry {
  countryId: string;
  viewBox: string;
  boundaryPath: string; // Outer boundary of the real country
  islands?: string[]; // Any offshore islands
  elevationZones: ElevationZone[];
  rivers: RiverPath[];
  populationClusters: PopulationCluster[];
}

export const COUNTRY_GEOMETRIES: Record<string, CountryGeometry> = {
  bangladesh: {
    countryId: 'bangladesh',
    viewBox: '0 0 1000 1000',
    // Realistic Bangladesh boundary: northern curve, eastern Sylhet/Chittagong protrusions, southern Bay of Bengal delta coastline
    boundaryPath: 'M 350,120 C 450,110 550,130 620,170 C 690,210 740,260 760,330 C 780,390 730,440 760,510 C 800,580 840,680 850,780 C 850,860 800,920 740,940 C 710,910 680,840 650,830 C 600,820 570,880 500,880 C 420,880 390,830 330,840 C 260,850 200,860 170,810 C 150,730 180,660 190,580 C 200,490 180,410 200,340 C 220,260 260,180 350,120 Z',
    elevationZones: [
      // High Peaks (RED) - Chittagong Hill Tracts & Northeast Borders
      {
        name: 'Chittagong Hill Tracts & Saka Haphong',
        minElevation: 300,
        maxElevation: 1052,
        type: 'peak',
        path: 'M 740,560 C 780,610 820,700 830,800 C 800,850 760,820 750,740 C 730,680 720,620 740,560 Z'
      },
      {
        name: 'Sylhet Meghalaya Border Ridges',
        minElevation: 150,
        maxElevation: 400,
        type: 'peak',
        path: 'M 600,180 C 660,190 710,230 730,280 C 710,310 660,280 620,250 C 590,220 580,190 600,180 Z'
      },
      // Mid Elevations (YELLOW) - Barind Tract & Madhupur Tract
      {
        name: 'Barind Plateau & Northwest Plain',
        minElevation: 25,
        maxElevation: 85,
        type: 'mid',
        path: 'M 220,230 C 280,190 350,180 380,240 C 370,320 310,380 250,380 C 210,350 200,280 220,230 Z'
      },
      {
        name: 'Madhupur Forested Terrace',
        minElevation: 15,
        maxElevation: 35,
        type: 'mid',
        path: 'M 440,360 C 500,350 530,390 520,470 C 470,490 440,440 440,360 Z'
      },
      // Lowlands (GREEN) - Vast delta floodplains (0 - 15m)
      {
        name: 'Ganges-Brahmaputra-Meghna Floodplain',
        minElevation: 4,
        maxElevation: 15,
        type: 'lowland',
        path: 'M 260,390 C 350,380 430,480 430,580 C 430,680 350,750 260,740 C 220,670 210,500 260,390 Z'
      },
      // Deep Delta (FLOODS FIRST at 1 - 5m)
      {
        name: 'Coastal Sundarbans & Meghna Estuary',
        minElevation: 0,
        maxElevation: 4,
        type: 'delta',
        path: 'M 180,720 C 300,720 400,750 510,750 C 600,750 690,780 730,860 C 690,920 580,880 490,880 C 380,880 290,850 180,810 Z'
      }
    ],
    rivers: [
      { name: 'Padma River', d: 'M 240,430 C 320,460 420,530 510,580 C 580,630 630,730 650,830', width: 14 },
      { name: 'Jamuna / Brahmaputra', d: 'M 420,130 C 430,240 410,340 420,450 C 430,510 500,570 510,580', width: 16 },
      { name: 'Meghna River', d: 'M 640,240 C 620,360 580,480 540,560 C 550,640 600,730 620,830', width: 14 }
    ],
    populationClusters: [
      { name: 'Dhaka Mega Urban Core', x: 500, y: 520, radius: 110, density: 'dark_red', populationText: '22 Million (Ultra Dense: 28,000/km²)' },
      { name: 'Chittagong Port Corridor', x: 740, y: 720, radius: 75, density: 'dark_red', populationText: '5.3 Million (Industrial Core)' },
      { name: 'Khulna Southwest Delta', x: 340, y: 680, radius: 60, density: 'red', populationText: '1.6 Million (Vulnerable Delta)' },
      { name: 'Rajshahi Western Division', x: 260, y: 360, radius: 55, density: 'red', populationText: '850,000' },
      { name: 'Sylhet Basin Center', x: 670, y: 310, radius: 50, density: 'red', populationText: '900,000' },
      { name: 'Barisal Lowland Center', x: 490, y: 730, radius: 45, density: 'red', populationText: '500,000' },
      { name: 'Sundarbans Mangrove Reserve', x: 250, y: 810, radius: 90, density: 'white', populationText: 'Sparse Forest (<50/km²)' },
      { name: 'Hill Tracts Forest Reserve', x: 790, y: 750, radius: 70, density: 'white', populationText: 'Highlands & Nature Reserve (<100/km²)' }
    ]
  },

  netherlands: {
    countryId: 'netherlands',
    viewBox: '0 0 1000 1000',
    // Netherlands authentic outline with North Sea coast, IJsselmeer lake bay, Zeeland islands, Limburg tail
    boundaryPath: 'M 350,150 C 450,130 600,120 720,150 C 800,200 840,320 830,420 C 810,500 760,560 740,650 C 720,720 730,830 710,930 C 660,950 630,860 620,780 C 580,750 490,750 430,770 C 370,790 310,810 260,780 C 230,730 260,670 240,620 C 200,580 180,510 220,440 C 240,380 270,320 290,240 C 310,190 330,160 350,150 Z',
    elevationZones: [
      // High Peak (RED) - Vaalserberg & South Limburg Hills (up to 322m)
      {
        name: 'Vaalserberg & Limburg Highlands',
        minElevation: 80,
        maxElevation: 322,
        type: 'peak',
        path: 'M 640,810 C 690,830 730,890 710,930 C 650,940 620,860 640,810 Z'
      },
      // Mid Elevations (YELLOW) - Veluwe & Utrecht Ridges (25 - 80m)
      {
        name: 'Veluwe & Utrecht Hill Ridges',
        minElevation: 25,
        maxElevation: 80,
        type: 'mid',
        path: 'M 510,400 C 620,380 670,440 650,540 C 580,580 500,540 480,470 C 470,430 490,410 510,400 Z'
      },
      // Lowlands (GREEN) - Above sea level coastal plains (0 - 25m)
      {
        name: 'Groningen & Eastern Uplands',
        minElevation: 1,
        maxElevation: 25,
        type: 'lowland',
        path: 'M 600,160 C 740,160 820,240 810,380 C 740,430 660,370 600,320 Z'
      },
      // Below Sea Level & Polders (BLUE/DELTA) - Submerged first at 1-3m!
      {
        name: 'Randstad Polders & Zeeland Delta (-7m to 0m)',
        minElevation: -7,
        maxElevation: 1,
        type: 'delta',
        path: 'M 220,360 C 330,320 440,360 450,520 C 430,640 330,730 230,710 C 180,620 180,480 220,360 Z'
      }
    ],
    rivers: [
      { name: 'Rhine (Rijn) River', d: 'M 740,580 C 620,570 510,560 410,570 C 310,580 220,590', width: 14 },
      { name: 'Meuse (Maas) River', d: 'M 660,780 C 620,700 580,630 480,610 C 370,610 250,650', width: 12 },
      { name: 'IJssel River', d: 'M 600,560 C 620,480 640,400 620,340', width: 10 }
    ],
    populationClusters: [
      { name: 'Amsterdam Metropolitan Ring', x: 380, y: 380, radius: 95, density: 'dark_red', populationText: '2.5M (Randstad Core)' },
      { name: 'Rotterdam Port Conurbation', x: 320, y: 550, radius: 85, density: 'dark_red', populationText: '1.4M (Port Basin)' },
      { name: 'The Hague (Den Haag)', x: 290, y: 470, radius: 70, density: 'dark_red', populationText: '1.1M' },
      { name: 'Utrecht Central Hub', x: 480, y: 460, radius: 65, density: 'red', populationText: '650,000' },
      { name: 'Eindhoven Tech Corridor', x: 550, y: 680, radius: 60, density: 'red', populationText: '780,000' },
      { name: 'Veluwe Forest Nature Reserve', x: 570, y: 460, radius: 65, density: 'white', populationText: 'National Park (<80/km²)' },
      { name: 'Friesland Rural Marshes', x: 580, y: 220, radius: 70, density: 'white', populationText: 'Pasture Lowlands (<120/km²)' }
    ]
  },

  united_states: {
    countryId: 'united_states',
    viewBox: '0 0 1000 1000',
    // Continental USA outline
    boundaryPath: 'M 140,250 C 250,260 380,260 520,280 C 640,270 760,250 860,280 C 890,340 850,420 870,490 C 890,560 840,650 820,740 C 820,830 780,880 750,860 C 720,780 660,760 580,750 C 500,750 440,820 380,820 C 300,800 240,730 200,690 C 140,640 100,520 110,400 C 120,320 120,270 140,250 Z',
    elevationZones: [
      // High Peaks (RED) - Rocky Mountains & Sierra Nevada (> 2000m)
      {
        name: 'Rocky Mountain Range & Cascades',
        minElevation: 2000,
        maxElevation: 4421,
        type: 'peak',
        path: 'M 220,270 C 310,280 340,380 330,520 C 310,650 250,680 220,590 C 190,480 200,350 220,270 Z'
      },
      // Mid Elevations (YELLOW) - Great Plains & Appalachian Mountains (200 - 1500m)
      {
        name: 'Appalachian Highlands & Midwest Plateau',
        minElevation: 200,
        maxElevation: 1500,
        type: 'mid',
        path: 'M 350,300 C 500,320 620,340 760,380 C 780,500 740,640 680,680 C 560,670 420,650 350,560 Z'
      },
      // Lowlands (GREEN) - Central Mississippi River Valley (30 - 200m)
      {
        name: 'Mississippi Basin Plains',
        minElevation: 30,
        maxElevation: 200,
        type: 'lowland',
        path: 'M 480,360 C 600,370 650,480 640,620 C 570,690 490,690 460,560 Z'
      },
      // Coastal Deltas (DELTA) - Gulf Coast, Florida & Eastern Seaboard (0 - 30m)
      {
        name: 'Gulf Coast, Florida & Atlantic Lowlands',
        minElevation: 0,
        maxElevation: 30,
        type: 'delta',
        path: 'M 380,780 C 470,730 600,720 700,740 C 760,760 830,840 780,880 C 730,850 670,770 560,760 C 470,760 410,810 380,780 Z'
      }
    ],
    rivers: [
      { name: 'Mississippi River', d: 'M 540,320 C 560,420 540,530 560,650 C 570,710 560,770', width: 14 },
      { name: 'Ohio River', d: 'M 710,430 C 660,460 610,500 560,530', width: 10 },
      { name: 'Missouri River', d: 'M 330,330 C 420,380 490,440 540,470', width: 11 }
    ],
    populationClusters: [
      { name: 'New York / NE Megalopolis', x: 810, y: 370, radius: 95, density: 'dark_red', populationText: '20M (Ultra Dense)' },
      { name: 'Los Angeles Coastal Basin', x: 170, y: 590, radius: 85, density: 'dark_red', populationText: '13M' },
      { name: 'Chicago Great Lakes Hub', x: 620, y: 390, radius: 75, density: 'dark_red', populationText: '9.5M' },
      { name: 'Houston / Texas Coast', x: 510, y: 760, radius: 70, density: 'red', populationText: '7.1M (Severe Flood Risk)' },
      { name: 'Miami & South Florida', x: 780, y: 840, radius: 65, density: 'red', populationText: '6.2M (Vulnerable Delta)' },
      { name: 'Great Basin Desert', x: 250, y: 440, radius: 80, density: 'white', populationText: 'Arid Basin (<5/km²)' },
      { name: 'Montana & Wyoming Plains', x: 340, y: 320, radius: 80, density: 'white', populationText: 'Sparse Grazing Lands (<3/km²)' }
    ]
  },

  japan: {
    countryId: 'japan',
    viewBox: '0 0 1000 1000',
    // Japan archipelago (Hokkaido, Honshu arc, Shikoku, Kyushu)
    boundaryPath: 'M 750,150 C 820,180 860,250 820,320 C 760,330 710,260 700,200 Z M 650,330 C 710,380 730,470 690,560 C 620,620 530,680 430,730 C 370,760 300,810 230,860 C 190,830 210,760 250,710 C 330,670 420,620 480,560 C 530,500 580,410 650,330 Z M 390,750 C 440,740 480,770 450,820 C 410,830 370,800 390,750 Z M 230,820 C 290,810 310,870 280,930 C 230,940 190,890 230,820 Z',
    elevationZones: [
      // High Peaks (RED) - Japanese Alps & Mt Fuji (> 2500m)
      {
        name: 'Mount Fuji & Central Alpine Spine',
        minElevation: 2000,
        maxElevation: 3776,
        type: 'peak',
        path: 'M 560,500 C 610,480 640,540 600,590 C 550,580 540,530 560,500 Z'
      },
      // Mid Elevations (YELLOW) - Tohoku & Chugoku Mountain Ranges (300 - 1800m)
      {
        name: 'Tohoku & Chugoku Forested Ridges',
        minElevation: 300,
        maxElevation: 1800,
        type: 'mid',
        path: 'M 640,360 C 680,410 670,490 630,540 C 520,620 450,680 370,720 C 340,690 410,640 480,580 Z'
      },
      // Lowlands (GREEN) - Foothills & Valleys (50 - 300m)
      {
        name: 'Foothills & Agricultural Basins',
        minElevation: 50,
        maxElevation: 300,
        type: 'lowland',
        path: 'M 690,440 C 720,490 690,560 660,600 C 580,660 500,710 420,740 Z'
      },
      // Coastal Deltas & Low Plains (DELTA) - Kanto, Osaka & Nobi Plains (0 - 50m)
      {
        name: 'Kanto (Tokyo), Osaka & Nagoya Coastal Deltas',
        minElevation: 0,
        maxElevation: 50,
        type: 'delta',
        path: 'M 620,560 C 680,570 700,630 650,660 C 590,670 560,620 620,560 Z M 480,660 C 530,660 540,710 490,730 C 450,720 450,680 480,660 Z'
      }
    ],
    rivers: [
      { name: 'Shinano River', d: 'M 580,520 C 600,480 620,430 630,390', width: 9 },
      { name: 'Tone River (Kanto)', d: 'M 580,550 C 620,560 660,580 690,610', width: 11 },
      { name: 'Yodo River (Osaka)', d: 'M 510,650 C 490,680 470,700', width: 8 }
    ],
    populationClusters: [
      { name: 'Greater Tokyo Megalopolis', x: 650, y: 600, radius: 110, density: 'dark_red', populationText: '37 Million (World\'s Largest)' },
      { name: 'Keihanshin (Osaka/Kyoto/Kobe)', x: 480, y: 700, radius: 80, density: 'dark_red', populationText: '19 Million' },
      { name: 'Chukyo (Nagoya Metropolitan)', x: 560, y: 640, radius: 65, density: 'red', populationText: '9 Million' },
      { name: 'Fukuoka / Kitakyushu', x: 250, y: 800, radius: 55, density: 'red', populationText: '2.5 Million' },
      { name: 'Sapporo Urban Basin', x: 770, y: 240, radius: 50, density: 'red', populationText: '2 Million' },
      { name: 'Hokkaido Wilderness & Forests', x: 800, y: 190, radius: 80, density: 'white', populationText: 'Forested Mountains (<30/km²)' },
      { name: 'Japan Alps Mountain Core', x: 570, y: 530, radius: 55, density: 'white', populationText: 'Steep Crags (<20/km²)' }
    ]
  },

  philippines: {
    countryId: 'philippines',
    viewBox: '0 0 1000 1000',
    // Philippines island chain: Luzon in north, Visayas in middle, Mindanao in south
    boundaryPath: 'M 420,120 C 510,130 550,220 530,340 C 510,420 460,490 530,550 C 580,600 660,670 650,750 C 630,840 560,920 450,910 C 370,890 390,810 430,760 C 480,720 540,680 500,620 C 440,580 390,520 410,440 C 430,370 380,260 400,180 Z',
    elevationZones: [
      {
        name: 'Mount Apo & Central Mindanao Cordillera',
        minElevation: 1200,
        maxElevation: 2954,
        type: 'peak',
        path: 'M 540,760 C 610,770 630,840 580,880 C 520,860 510,800 540,760 Z'
      },
      {
        name: 'Sierra Madre & Cordillera Central (Luzon)',
        minElevation: 500,
        maxElevation: 2500,
        type: 'peak',
        path: 'M 460,170 C 510,180 530,280 500,360 C 460,340 450,240 460,170 Z'
      },
      {
        name: 'Central Luzon Agricultural Plain',
        minElevation: 10,
        maxElevation: 80,
        type: 'mid',
        path: 'M 430,280 C 480,290 490,380 460,440 C 420,430 410,340 430,280 Z'
      },
      {
        name: 'Manila Bay & Coastal Lowlands (0 - 10m)',
        minElevation: 0,
        maxElevation: 10,
        type: 'delta',
        path: 'M 430,410 C 480,410 490,480 460,510 C 420,490 420,440 430,410 Z'
      }
    ],
    rivers: [
      { name: 'Cagayan River', d: 'M 490,380 C 480,290 480,200 480,140', width: 10 },
      { name: 'Pasig & Marikina River', d: 'M 470,440 C 450,450 435,460', width: 8 }
    ],
    populationClusters: [
      { name: 'Metro Manila Mega Core', x: 450, y: 460, radius: 85, density: 'dark_red', populationText: '14.7 Million (Extreme Density)' },
      { name: 'Metro Cebu (Visayas)', x: 550, y: 640, radius: 55, density: 'red', populationText: '3.2 Million' },
      { name: 'Davao City (Mindanao)', x: 580, y: 840, radius: 55, density: 'red', populationText: '1.8 Million' },
      { name: 'Sierra Madre Rainforest Spine', x: 500, y: 260, radius: 60, density: 'white', populationText: 'Protected Forest Reserve' }
    ]
  },

  italy: {
    countryId: 'italy',
    viewBox: '0 0 1000 1000',
    // Italy boot shape with Alps in north, Po valley, Apennine spine, Calabria toe, Puglia heel, Sicily
    boundaryPath: 'M 220,200 C 350,180 550,190 680,240 C 650,290 560,320 540,380 C 580,440 650,530 730,620 C 820,680 870,720 840,780 C 780,780 730,730 680,720 C 630,740 590,830 560,910 C 500,920 480,850 510,790 C 540,730 520,650 470,570 C 420,490 380,410 330,370 C 260,370 230,290 220,200 Z M 380,850 C 470,830 500,890 440,940 C 370,950 330,890 380,850 Z',
    elevationZones: [
      // High Peaks (RED) - Alps & Monte Bianco / Mont Blanc (up to 4810m)
      {
        name: 'The Italian Alps & Mont Blanc / Monte Rosa',
        minElevation: 1800,
        maxElevation: 4810,
        type: 'peak',
        path: 'M 230,210 C 360,190 540,200 660,250 C 610,280 470,260 360,260 C 280,260 240,240 230,210 Z'
      },
      // Apennine Mountain Spine (YELLOW) (500 - 2900m)
      {
        name: 'Apennine Mountain Spine',
        minElevation: 500,
        maxElevation: 2912,
        type: 'mid',
        path: 'M 400,380 C 470,390 540,460 610,550 C 680,630 640,730 570,820 C 530,790 550,710 520,630 C 470,550 430,470 400,380 Z'
      },
      // Lowlands (GREEN) - Central Tuscany & Hills (50 - 500m)
      {
        name: 'Tuscany & Umbrian Lowlands',
        minElevation: 50,
        maxElevation: 500,
        type: 'lowland',
        path: 'M 370,410 C 450,420 480,500 450,560 C 390,530 360,460 370,410 Z'
      },
      // Deep Delta & Po Valley (DELTA) - Venice Lagoon & Po Valley (0 - 50m, Venice <2m!)
      {
        name: 'Po Valley & Venetian Lagoon Acqua Alta Basin',
        minElevation: -3,
        maxElevation: 50,
        type: 'delta',
        path: 'M 280,270 C 420,270 560,280 640,320 C 620,380 520,380 400,360 C 310,360 270,320 280,270 Z'
      }
    ],
    rivers: [
      { name: 'Po River', d: 'M 270,310 C 380,310 490,320 590,335 C 620,340 640,350', width: 14 },
      { name: 'Arno River (Florence)', d: 'M 460,430 C 430,440 390,445', width: 9 },
      { name: 'Tiber (Tevere) River (Rome)', d: 'M 480,510 C 475,560 460,600', width: 9 }
    ],
    populationClusters: [
      { name: 'Milan Lombardy Megacity Hub', x: 370, y: 290, radius: 90, density: 'dark_red', populationText: '8.2M (Industrial Core)' },
      { name: 'Rome Capital Conurbation', x: 470, y: 590, radius: 85, density: 'dark_red', populationText: '4.3M' },
      { name: 'Naples & Campania Basin', x: 570, y: 690, radius: 75, density: 'dark_red', populationText: '3.1M' },
      { name: 'Venice & Veneto Coastal Delta', x: 580, y: 320, radius: 65, density: 'red', populationText: '2.6M (Severe Acqua Alta Risk)' },
      { name: 'Turin Piedmont Core', x: 270, y: 300, radius: 60, density: 'red', populationText: '1.7M' },
      { name: 'Alpine Glacial Peaks', x: 380, y: 210, radius: 65, density: 'white', populationText: 'Alps Glaciers (<20/km²)' }
    ]
  },

  united_kingdom: {
    countryId: 'united_kingdom',
    viewBox: '0 0 1000 1000',
    // UK outline: Great Britain & Northern Ireland
    boundaryPath: 'M 520,120 C 580,150 610,240 570,330 C 540,400 580,480 650,530 C 720,580 750,670 710,750 C 660,820 550,830 460,820 C 370,820 310,760 360,680 C 410,640 430,550 400,480 C 370,420 390,320 440,240 Z M 240,450 C 310,440 330,510 290,560 C 230,560 210,490 240,450 Z',
    elevationZones: [
      {
        name: 'Scottish Highlands & Ben Nevis',
        minElevation: 600,
        maxElevation: 1345,
        type: 'peak',
        path: 'M 470,160 C 560,170 580,260 520,330 C 450,300 440,220 470,160 Z'
      },
      {
        name: 'Pennines & Cambrian Mountains',
        minElevation: 200,
        maxElevation: 890,
        type: 'mid',
        path: 'M 460,420 C 530,420 540,530 480,590 C 420,570 410,480 460,420 Z'
      },
      {
        name: 'Midlands & Southern Downs',
        minElevation: 20,
        maxElevation: 200,
        type: 'lowland',
        path: 'M 480,600 C 600,590 650,670 590,750 C 490,750 440,680 480,600 Z'
      },
      {
        name: 'Thames Estuary & The Fens (-4m to 15m)',
        minElevation: -4,
        maxElevation: 15,
        type: 'delta',
        path: 'M 600,540 C 680,550 720,620 680,680 C 620,670 590,600 600,540 Z'
      }
    ],
    rivers: [
      { name: 'River Thames (London)', d: 'M 510,720 C 570,720 630,725 680,720', width: 12 },
      { name: 'River Severn', d: 'M 440,580 C 470,640 480,710', width: 11 }
    ],
    populationClusters: [
      { name: 'Greater London Metropolitan Core', x: 630, y: 720, radius: 95, density: 'dark_red', populationText: '9.5M (High Density)' },
      { name: 'Manchester / NW Urban Belt', x: 490, y: 520, radius: 75, density: 'dark_red', populationText: '4.8M' },
      { name: 'West Midlands (Birmingham)', x: 500, y: 620, radius: 70, density: 'dark_red', populationText: '3.8M' },
      { name: 'Scottish Highlands', x: 500, y: 220, radius: 75, density: 'white', populationText: 'Grampians & Glens (<15/km²)' }
    ]
  },

  brazil: {
    countryId: 'brazil',
    viewBox: '0 0 1000 1000',
    // Brazil massive territory: Amazon basin to Atlantic coast, southern cone
    boundaryPath: 'M 220,240 C 370,180 580,210 740,320 C 840,410 880,530 820,680 C 760,780 680,880 580,940 C 510,950 490,870 510,780 C 420,720 330,680 270,580 C 190,490 160,360 220,240 Z',
    elevationZones: [
      {
        name: 'Pico da Neblina & Serra do Mar Highlands',
        minElevation: 1200,
        maxElevation: 2995,
        type: 'peak',
        path: 'M 670,650 C 750,670 780,760 720,810 C 640,780 640,700 670,650 Z'
      },
      {
        name: 'Brazilian Highlands Plateau (Planalto)',
        minElevation: 400,
        maxElevation: 1200,
        type: 'mid',
        path: 'M 490,480 C 660,460 760,550 710,680 C 590,730 460,670 490,480 Z'
      },
      {
        name: 'Amazon Rainforest Basin',
        minElevation: 20,
        maxElevation: 150,
        type: 'lowland',
        path: 'M 260,280 C 460,260 580,330 550,460 C 410,500 280,460 260,280 Z'
      },
      {
        name: 'Pantanal Wetlands & Coastal Deltas',
        minElevation: 0,
        maxElevation: 50,
        type: 'delta',
        path: 'M 380,620 C 470,630 480,720 420,760 C 360,740 350,660 380,620 Z M 520,840 C 600,850 610,920 540,930 Z'
      }
    ],
    rivers: [
      { name: 'Amazon River', d: 'M 220,330 C 360,340 500,320 640,330 C 720,340 760,350', width: 22 },
      { name: 'Paraná River', d: 'M 560,560 C 540,680 510,810', width: 14 }
    ],
    populationClusters: [
      { name: 'São Paulo Megacity Ring', x: 670, y: 730, radius: 95, density: 'dark_red', populationText: '22M (Financial Heart)' },
      { name: 'Rio de Janeiro Coastal Conurbation', x: 740, y: 710, radius: 85, density: 'dark_red', populationText: '13M' },
      { name: 'Porto Alegre (RS Flood Basin)', x: 560, y: 880, radius: 65, density: 'red', populationText: '4.4M (2024 Catastrophe)' },
      { name: 'Amazon Dense Rainforest', x: 380, y: 360, radius: 110, density: 'white', populationText: 'Deep Amazon Basin (<2/km²)' }
    ]
  },

  vietnam: {
    countryId: 'vietnam',
    viewBox: '0 0 1000 1000',
    // Distinctive S-curve coastline: Red River delta in north, narrow waist, Mekong Delta in south
    boundaryPath: 'M 420,120 C 540,130 630,220 580,310 C 510,380 470,460 510,540 C 560,620 610,710 570,810 C 520,890 410,920 370,840 C 360,760 440,710 450,620 C 430,530 380,460 370,380 C 350,290 350,190 420,120 Z',
    elevationZones: [
      {
        name: 'Fansipan & Northern Tonkin Alps',
        minElevation: 1200,
        maxElevation: 3147,
        type: 'peak',
        path: 'M 370,160 C 460,170 480,240 430,290 C 380,270 360,210 370,160 Z'
      },
      {
        name: 'Annamite Mountain Spine (Trường Sơn)',
        minElevation: 400,
        maxElevation: 2000,
        type: 'mid',
        path: 'M 440,360 C 500,420 540,560 500,670 C 460,620 440,510 440,360 Z'
      },
      {
        name: 'Central Coast Narrow Plains',
        minElevation: 10,
        maxElevation: 80,
        type: 'lowland',
        path: 'M 500,440 C 540,490 560,590 540,660 C 510,610 490,520 500,440 Z'
      },
      {
        name: 'Mekong & Red River Deltas (0 - 5m Extreme Flood Risk)',
        minElevation: 0,
        maxElevation: 5,
        type: 'delta',
        path: 'M 480,240 C 560,240 590,310 520,330 C 460,310 460,260 480,240 Z M 390,780 C 480,770 540,840 490,900 C 410,910 380,840 390,780 Z'
      }
    ],
    rivers: [
      { name: 'Red River (Sông Hồng)', d: 'M 390,170 C 450,230 490,260 530,280', width: 13 },
      { name: 'Mekong River Delta Branches', d: 'M 440,730 C 450,780 460,830 470,880', width: 16 }
    ],
    populationClusters: [
      { name: 'Ho Chi Minh City Conurbation', x: 470, y: 780, radius: 85, density: 'dark_red', populationText: '13.5M (Mega Delta Core)' },
      { name: 'Hanoi Red River Capital', x: 500, y: 270, radius: 80, density: 'dark_red', populationText: '8.5M' },
      { name: 'Da Nang Coastal Hub', x: 520, y: 530, radius: 55, density: 'red', populationText: '1.2M' },
      { name: 'Annamite Mountain Forests', x: 460, y: 470, radius: 65, density: 'white', populationText: 'Dense Rainforest (<50/km²)' }
    ]
  },

  egypt: {
    countryId: 'egypt',
    viewBox: '0 0 1000 1000',
    // Egypt: Mediterranean coast, Nile delta triangle, Sinai peninsula, Red Sea coast, Western Desert
    boundaryPath: 'M 220,240 C 370,240 500,230 650,230 C 720,260 780,320 740,410 C 720,490 770,610 820,730 C 780,780 650,780 480,780 C 320,780 220,780 220,620 C 220,480 220,340 220,240 Z',
    elevationZones: [
      {
        name: 'Mount Catherine & Sinai Peaks',
        minElevation: 1000,
        maxElevation: 2629,
        type: 'peak',
        path: 'M 680,310 C 740,320 760,400 710,430 C 670,410 660,350 680,310 Z'
      },
      {
        name: 'Eastern Desert & Red Sea Hills',
        minElevation: 300,
        maxElevation: 1500,
        type: 'mid',
        path: 'M 570,380 C 670,420 730,560 760,710 C 680,720 620,620 580,480 Z'
      },
      {
        name: 'Western Desert Tablelands',
        minElevation: 50,
        maxElevation: 300,
        type: 'lowland',
        path: 'M 250,290 C 440,290 460,540 440,730 C 270,730 250,520 250,290 Z'
      },
      {
        name: 'Nile Delta & Alexandria Mediterranean Coast (0 - 5m Flood Threat)',
        minElevation: -2,
        maxElevation: 10,
        type: 'delta',
        path: 'M 440,240 C 560,230 620,280 570,350 C 480,350 440,300 440,240 Z'
      }
    ],
    rivers: [
      { name: 'River Nile', d: 'M 570,780 C 560,670 540,530 520,390 C 500,340 470,270', width: 14 }
    ],
    populationClusters: [
      { name: 'Greater Cairo Urban Agglomeration', x: 520, y: 350, radius: 95, density: 'dark_red', populationText: '22 Million (Ultra High Density)' },
      { name: 'Alexandria Mediterranean Port', x: 460, y: 250, radius: 75, density: 'dark_red', populationText: '5.4 Million (Sinking Delta Risk)' },
      { name: 'Nile Delta Agricultural Cities', x: 530, y: 280, radius: 70, density: 'red', populationText: '12 Million' },
      { name: 'Western Sahara Desert', x: 320, y: 520, radius: 100, density: 'white', populationText: 'Hyper-Arid Void (<1/km²)' }
    ]
  },

  germany: {
    countryId: 'germany',
    viewBox: '0 0 1000 1000',
    // Germany: North Sea & Baltic coast in north, central uplands, Bavarian Alps in south
    boundaryPath: 'M 390,140 C 500,130 630,150 710,210 C 760,290 730,410 750,510 C 780,610 730,730 690,830 C 610,870 520,890 440,880 C 370,860 320,780 340,680 C 310,580 270,490 280,380 C 290,290 320,210 390,140 Z',
    elevationZones: [
      {
        name: 'Bavarian Alps & Zugspitze',
        minElevation: 1000,
        maxElevation: 2962,
        type: 'peak',
        path: 'M 460,830 C 580,830 680,840 670,880 C 570,890 470,880 460,830 Z'
      },
      {
        name: 'Central Uplands & Black Forest (Mittelgebirge)',
        minElevation: 300,
        maxElevation: 1493,
        type: 'mid',
        path: 'M 350,520 C 520,500 680,540 680,720 C 540,780 410,760 350,670 Z'
      },
      {
        name: 'Northern German Lowland Plain',
        minElevation: 10,
        maxElevation: 100,
        type: 'lowland',
        path: 'M 340,240 C 540,230 670,250 670,440 C 510,450 360,450 340,240 Z'
      },
      {
        name: 'North Sea Coastal Marshes & Wadden Sea (0 - 10m)',
        minElevation: -3,
        maxElevation: 10,
        type: 'delta',
        path: 'M 350,150 C 470,140 560,160 520,240 C 410,240 350,210 350,150 Z'
      }
    ],
    rivers: [
      { name: 'Rhine River (Rhein)', d: 'M 370,760 C 360,650 340,540 330,440 C 320,380', width: 14 },
      { name: 'Elbe River', d: 'M 680,480 C 610,410 540,330 470,240', width: 12 },
      { name: 'Danube River (Donau)', d: 'M 420,790 C 520,780 610,770 690,780', width: 12 }
    ],
    populationClusters: [
      { name: 'Rhine-Ruhr Polycentric Hub', x: 340, y: 490, radius: 95, density: 'dark_red', populationText: '11 Million (Heavy Industrial Core)' },
      { name: 'Berlin Metropolitan Region', x: 640, y: 360, radius: 80, density: 'dark_red', populationText: '4.8 Million' },
      { name: 'Munich Bavarian Capital', x: 570, y: 790, radius: 75, density: 'dark_red', populationText: '3.1 Million' },
      { name: 'Frankfurt Rhine-Main', x: 420, y: 610, radius: 70, density: 'red', populationText: '2.4 Million' },
      { name: 'Hamburg Port Region', x: 480, y: 260, radius: 70, density: 'red', populationText: '2.5 Million' },
      { name: 'Bavarian Alps High Peaks', x: 560, y: 860, radius: 60, density: 'white', populationText: 'Alpine Slopes (<30/km²)' }
    ]
  },

  australia: {
    countryId: 'australia',
    viewBox: '0 0 1000 1000',
    boundaryPath: 'M 210,320 C 370,240 610,230 740,330 C 850,420 890,560 840,710 C 780,810 670,860 550,850 C 410,860 270,790 190,680 C 140,550 150,410 210,320 Z M 670,910 C 730,900 740,960 690,970 C 650,960 650,920 670,910 Z',
    elevationZones: [
      {
        name: 'Great Dividing Range & Mt Kosciuszko',
        minElevation: 800,
        maxElevation: 2228,
        type: 'peak',
        path: 'M 740,410 C 810,470 830,640 760,780 C 710,750 740,600 720,490 Z'
      },
      {
        name: 'Western Plateau & MacDonnell Ranges',
        minElevation: 300,
        maxElevation: 1500,
        type: 'mid',
        path: 'M 230,390 C 440,360 480,560 430,710 C 260,710 220,530 230,390 Z'
      },
      {
        name: 'Murray-Darling River Basin',
        minElevation: 30,
        maxElevation: 250,
        type: 'lowland',
        path: 'M 540,520 C 680,510 720,660 640,770 C 540,760 510,650 540,520 Z'
      },
      {
        name: 'Lake Eyre & Coastal Flood Deltas (0 - 30m, Lake Eyre -15m!)',
        minElevation: -15,
        maxElevation: 30,
        type: 'delta',
        path: 'M 460,570 C 540,560 560,650 490,670 C 440,650 440,590 460,570 Z'
      }
    ],
    rivers: [
      { name: 'Murray River', d: 'M 710,740 C 650,730 580,750 520,770', width: 14 },
      { name: 'Darling River', d: 'M 680,530 C 640,610 610,680 580,750', width: 12 },
      { name: 'Brisbane River', d: 'M 780,520 C 820,530 840,540', width: 9 }
    ],
    populationClusters: [
      { name: 'Sydney Coastal Conurbation', x: 790, y: 720, radius: 85, density: 'dark_red', populationText: '5.3 Million' },
      { name: 'Melbourne Port Phillip Hub', x: 690, y: 810, radius: 85, density: 'dark_red', populationText: '5.1 Million' },
      { name: 'Brisbane River Basin Core', x: 820, y: 530, radius: 75, density: 'dark_red', populationText: '2.6 Million' },
      { name: 'Perth Western Coast', x: 210, y: 690, radius: 65, density: 'red', populationText: '2.2 Million' },
      { name: 'Adelaide Gulf Hub', x: 530, y: 770, radius: 60, density: 'red', populationText: '1.4 Million' },
      { name: 'Great Victoria Desert / Outback', x: 380, y: 530, radius: 110, density: 'white', populationText: 'Arid Outback Void (<0.1/km²)' }
    ]
  }
};
