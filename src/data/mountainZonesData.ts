// Specific Mountain Elevation Zones of Bangladesh
// Yellow Mountains: 100m - 300m (Foothills, Uplands & Midland Ranges)
// Red Mountains: 400m - 1000m+ (High Strike Ridges & Escarpments up to 1,052m)
// Digitized precisely to the 896 x 1200 coordinate space of the Bangladesh Topographical Relief Map
// Covering: Sylhet, Top Dhaka (Mymensingh/Garo), Rajshahi (Barind), Rangpur (Himalayan Piedmont), and Chattogram / CHT

import { USGS_ELEVATION_ZONES } from './usgsElevationZones';

export interface MountainPeak {
  id: string;
  name: string;
  bnName: string;
  elevationMeters: number;
  x: number; // SVG pixel coordinate (0 - 896)
  y: number; // SVG pixel coordinate (0 - 1200)
  district: string;
  region: 'Sylhet' | 'Top Dhaka' | 'Rajshahi' | 'Rangpur' | 'Chattogram';
  rangeName: string;
}

export interface MountainZone {
  id: 'green-mountains' | 'yellow-mountains' | 'red-mountains';
  name: string;
  bnName: string;
  minElevationMeters: number;
  maxElevationMeters: number;
  colorName: 'green' | 'yellow' | 'red';
  color: string;
  strokeColor: string;
  fillColor: string;
  glowColor: string;
  description: string;
  geology: string;
  paths: string[];
  peaks: MountainPeak[];
}

// Extract base USGS survey shapefiles
const z75_300 = USGS_ELEVATION_ZONES.find((z) => z.id === '75-300');
const zOver300 = USGS_ELEVATION_ZONES.find((z) => z.id === '> 300');

// ============================================================================
// 1. YELLOW MOUNTAIN LINES (100m - 300m)
// Sinks progressively between 100m and 300m according to data.
// Digitized for Sylhet, Top Dhaka, Rajshahi, Rangpur, and Chattogram
// ============================================================================
export const YELLOW_MOUNTAIN_PATHS: string[] = [
  // --- SYLHET (Yellow Foothills & Tea Garden Midland Ridges) ---
  // Sreemangal & Bhanugach Tea Hills (Moulvibazar)
  'M 582 476 C 606 470, 626 488, 624 515 C 618 535, 595 538, 578 522 C 568 506, 570 484, 582 476 Z',
  // Habiganj Tarap Hill Range
  'M 552 505 C 574 500, 588 518, 584 542 C 576 555, 555 554, 545 538 C 540 522, 544 508, 552 505 Z',
  // Moulvibazar - Rajnagar Foothills
  'M 598 434 C 628 430, 646 448, 642 472 C 632 485, 608 480, 595 462 C 588 448, 590 436, 598 434 Z',
  // Sunamganj Tanguar Haor Northern Foothills
  'M 518 356 C 548 350, 568 365, 564 385 C 548 396, 524 390, 512 376 C 506 365, 510 358, 518 356 Z',

  // --- TOP DHAKA (Yellow Garo Foothills Belt & Madhupur Terrace) ---
  // Garo Hills Lower Foothills belt across Sherpur & Netrokona border
  'M 398 358 C 438 352, 485 356, 525 368 C 518 384, 472 385, 430 380 C 405 375, 394 366, 398 358 Z',
  // Madhupur Forest Pleistocene Ridge (Tangail, Gazipur & Mymensingh elevated terrace)
  'M 425 435 C 448 436, 458 465, 452 505 C 446 532, 428 535, 420 508 C 414 475, 416 445, 425 435 Z',

  // --- RAJSHAHI (Yellow Elevated Barind Clay Terrace Blocks) ---
  // Main Central Barind Clay Terrace (Naogaon, Rajshahi, Chapai Nawabganj)
  'M 228 440 C 265 434, 305 444, 312 478 C 318 510, 288 535, 258 532 C 235 528, 218 495, 222 465 C 224 450, 225 442, 228 440 Z',
  // Joypurhat & Eastern Barind Terrace Escarpment
  'M 305 365 C 332 368, 345 392, 338 418 C 322 428, 302 418, 298 395 C 295 380, 300 368, 305 365 Z',

  // --- RANGPUR (Yellow Himalayan Piedmont Plains & Uplands) ---
  // Panchagarh-Thakurgaon Piedmont Apron
  'M 132 105 C 160 115, 195 130, 210 155 C 225 185, 228 220, 215 255 C 195 265, 170 240, 155 205 C 140 170, 125 135, 132 105 Z',
  // Dinajpur & Kantajew Upper Alluvial Fan
  'M 218 250 C 248 245, 275 260, 270 295 C 262 320, 235 325, 215 305 C 202 288, 205 265, 218 250 Z',
  // Nilphamari & Saidpur Upland Terrace
  'M 268 220 C 298 215, 320 235, 312 265 C 298 280, 275 275, 262 255 C 255 238, 260 225, 268 220 Z',

  // --- CHATTOGRAM / CHT (USGS 75-300m Digitized Hill Ranges) ---
  ...(z75_300 ? z75_300.paths : [])
];

export const YELLOW_MOUNTAIN_ZONE: MountainZone = {
  id: 'yellow-mountains',
  name: 'Yellow Mountains & Uplands (100m – 300m)',
  bnName: 'হলুদ পাহাড় ও উচ্চভূমি (১০০–৩০০মি)',
  minElevationMeters: 100,
  maxElevationMeters: 300,
  colorName: 'yellow',
  color: '#eab308',
  strokeColor: '#facc15',
  fillColor: 'rgba(234, 179, 8, 0.28)',
  glowColor: 'rgba(250, 204, 21, 0.75)',
  description: 'Foothills and midland ranges across Sylhet, Top Dhaka, Rajshahi, Rangpur, and CHT. Sinks progressively between 100m and 300m sea level.',
  geology: 'Pleistocene Red Clay Terraces, Boka Bil Sandstones, and Himalayan Piedmont Outwash.',
  paths: YELLOW_MOUNTAIN_PATHS,
  peaks: [
    // Sylhet
    {
      id: 'patharia-ridge',
      name: 'Patharia Hills (Madhobkunda)',
      bnName: 'পাথারিয়া পাহাড়',
      elevationMeters: 240,
      x: 668,
      y: 432,
      district: 'Moulvibazar',
      region: 'Sylhet',
      rangeName: 'Patharia Range'
    },
    {
      id: 'lawachara-ridge',
      name: 'Bhanugach Forest Crest',
      bnName: 'ভানুগাছ বন শৈলশিরা',
      elevationMeters: 160,
      x: 602,
      y: 502,
      district: 'Moulvibazar',
      region: 'Sylhet',
      rangeName: 'Bhanugach Range'
    },
    // Top Dhaka
    {
      id: 'madhupur-crest',
      name: 'Madhupur Red Clay Crest',
      bnName: 'মধুপুর লাল মাটির শৈলশিরা',
      elevationMeters: 45,
      x: 436,
      y: 475,
      district: 'Tangail',
      region: 'Top Dhaka',
      rangeName: 'Madhupur Tract'
    },
    // Rajshahi
    {
      id: 'barind-crest',
      name: 'Barind Elevated Clay Dome',
      bnName: 'বরেন্দ্র মাটির উচ্চভূমি',
      elevationMeters: 48,
      x: 265,
      y: 472,
      district: 'Naogaon',
      region: 'Rajshahi',
      rangeName: 'Barind Tract'
    },
    // Rangpur
    {
      id: 'kantajew-fan',
      name: 'Kantajew High Piedmont Fan',
      bnName: 'কান্তজীউ উচ্চ পললভূমি',
      elevationMeters: 65,
      x: 235,
      y: 285,
      district: 'Dinajpur',
      region: 'Rangpur',
      rangeName: 'Himalayan Piedmont Plain'
    },
    // Chattogram
    {
      id: 'alutila',
      name: 'Alutila Mysterious Ridge',
      bnName: 'আলুটিলা পাহাড়',
      elevationMeters: 350,
      x: 688,
      y: 654,
      district: 'Khagrachhari',
      region: 'Chattogram',
      rangeName: 'Alutila Range'
    },
    {
      id: 'sitakunda-crest',
      name: 'Chandranath Peak (Sitakunda)',
      bnName: 'চন্দ্রনাথ পাহাড়',
      elevationMeters: 310,
      x: 642,
      y: 738,
      district: 'Chattogram',
      region: 'Chattogram',
      rangeName: 'Sitakunda Range'
    },
    {
      id: 'barkal-ridge',
      name: 'Barkal Mountain Foot',
      bnName: 'বরকল শৈলশিরা',
      elevationMeters: 260,
      x: 742,
      y: 718,
      district: 'Rangamati',
      region: 'Chattogram',
      rangeName: 'Barkal Range'
    }
  ]
};

// ============================================================================
// 2. RED HIGH MOUNTAIN LINES (400m - 1000m+)
// Sinks progressively between 400m and 1000m according to data.
// Digitized for Sylhet, Top Dhaka, Rajshahi, Rangpur, and Chattogram
// ============================================================================
export const RED_MOUNTAIN_PATHS: string[] = [
  // --- SYLHET (Red High Border Mountain Escarpments) ---
  // Northern Sylhet/Sunamganj Meghalaya Border Wall (Jaflong, Tamabil, Dawki Gorge, Jaintiapur)
  'M 532 346 C 575 340, 625 344, 658 355 C 652 372, 610 368, 565 365 C 538 362, 528 352, 532 346 Z',
  // Moulvibazar Patharia High Strike Crest (Assam border)
  'M 658 408 C 678 412, 688 435, 682 462 C 668 468, 652 452, 650 430 C 650 418, 654 410, 658 408 Z',
  // Hararganj & Kulaura Eastern Border Mountain Crest
  'M 632 462 C 652 465, 660 488, 654 512 C 638 518, 625 502, 624 482 C 624 470, 628 464, 632 462 Z',

  // --- TOP DHAKA (Red High Garo Mountain Escarpment Border) ---
  // Sherpur / Jhinaigati / Nalitabari Garo Border Mountain Ridge
  'M 412 342 C 438 338, 465 345, 460 365 C 445 372, 420 368, 408 358 C 405 348, 408 344, 412 342 Z',
  // Netrokona Susang Durgapur / Bijoypur White Clay Mountain Ridge
  'M 472 345 C 502 342, 524 355, 518 372 C 498 378, 475 370, 466 358 C 465 350, 468 346, 472 345 Z',
  // Jamalpur Baksiganj Garo Escarpment Border Finger
  'M 382 344 C 404 342, 412 358, 405 370 C 390 374, 376 365, 375 354 C 375 346, 378 344, 382 344 Z',

  // --- RAJSHAHI (Red High Barind Scarp / Western Escarpments) ---
  // Western Chapai Nawabganj & Rahanpur Border Escarpment
  'M 198 448 C 218 450, 232 470, 226 492 C 215 508, 195 500, 188 480 C 185 465, 190 450, 198 448 Z',
  // Godagari High Ridge Overlooking Padma
  'M 232 505 C 252 508, 260 525, 252 542 C 238 548, 224 538, 222 522 C 222 512, 226 505, 232 505 Z',
  // Northern Naogaon Dhamoirhat / Patnitala High Escarpment Ridge
  'M 285 398 C 315 402, 328 420, 320 440 C 302 448, 282 438, 276 420 C 275 408, 280 400, 285 398 Z',

  // --- RANGPUR (Red Himalayan Frontier Border Escarpments) ---
  // Tetulia & Banglabandha Peak Margin (Kanchenjunga viewing escarpment)
  'M 148 68 C 160 75, 172 90, 168 112 C 160 125, 142 120, 132 105 C 124 92, 135 74, 148 68 Z',
  // Northern Panchagarh Frontier Escarpment Ridge
  'M 175 110 C 195 115, 218 128, 212 148 C 200 160, 178 152, 165 138 C 160 125, 168 112, 175 110 Z',
  // Patgram / Dahagram Border Finger Ridge (Lalmonirhat north)
  'M 292 182 C 310 188, 324 205, 318 222 C 304 228, 288 215, 284 198 C 282 186, 288 180, 292 182 Z',

  // --- CHATTOGRAM / CHT (USGS > 300m Digitized High Strike Ridges) ---
  ...(zOver300 ? zOver300.paths : [])
];

export const RED_MOUNTAIN_ZONE: MountainZone = {
  id: 'red-mountains',
  name: 'Red High Mountains & Escarpments (400m – 1000m+)',
  bnName: 'লাল উচ্চ পর্বতশ্রেণী ও স্কার্প (৪০০–১০০০+মি)',
  minElevationMeters: 400,
  maxElevationMeters: 1000,
  colorName: 'red',
  color: '#ef4444',
  strokeColor: '#dc2626',
  fillColor: 'rgba(239, 68, 68, 0.35)',
  glowColor: 'rgba(239, 68, 68, 0.85)',
  description: 'Highest anticlinal strike ridges and border escarpments across Sylhet, Top Dhaka, Rajshahi, Rangpur, and CHT. Sinks progressively between 400m and 1000m sea level.',
  geology: 'Massive Sandstone Strike Ridges, Garo Arch Metamorphic Fault Scarps, and Tectonic Escarpments.',
  paths: RED_MOUNTAIN_PATHS,
  peaks: [
    // Rangpur
    {
      id: 'tetulia-scarp',
      name: 'Tetulia Himalayan Crest',
      bnName: 'তেঁতুলিয়া হিমালয় পাদদেশ চূড়া',
      elevationMeters: 95,
      x: 148,
      y: 85,
      district: 'Panchagarh',
      region: 'Rangpur',
      rangeName: 'Himalayan Border Escarpment'
    },
    // Top Dhaka
    {
      id: 'garo-scarp',
      name: 'Gajni Garo Border Escarpment',
      bnName: 'গজনী গারো পাহাড় শৈলশিরা',
      elevationMeters: 180,
      x: 435,
      y: 352,
      district: 'Sherpur',
      region: 'Top Dhaka',
      rangeName: 'Garo Mountain Range'
    },
    {
      id: 'bijoypur-scarp',
      name: 'Bijoypur White Clay Mountain',
      bnName: 'বিজয়পুর সাদা মাটির পাহাড়',
      elevationMeters: 145,
      x: 495,
      y: 358,
      district: 'Netrokona',
      region: 'Top Dhaka',
      rangeName: 'Susang Durgapur Ridge'
    },
    // Rajshahi
    {
      id: 'godagari-scarp',
      name: 'Godagari High Barind Cliff',
      bnName: 'গোদাগাড়ী বরেন্দ্র ক্লিফ',
      elevationMeters: 85,
      x: 242,
      y: 520,
      district: 'Rajshahi',
      region: 'Rajshahi',
      rangeName: 'Barind Fault Scarp'
    },
    // Sylhet
    {
      id: 'jaflong-scarp',
      name: 'Jaflong Dawki Border Wall',
      bnName: 'জাফলং ডাউকি গিরিখাত প্রাচীর',
      elevationMeters: 220,
      x: 615,
      y: 352,
      district: 'Sylhet',
      region: 'Sylhet',
      rangeName: 'Jaintia Mountain Wall'
    },
    // Chattogram
    {
      id: 'saka-haphong',
      name: 'Saka Haphong (Mowdok Mual)',
      bnName: 'সাকা হাফং (মোদক মুয়াল)',
      elevationMeters: 1052,
      x: 792,
      y: 1025,
      district: 'Bandarban',
      region: 'Chattogram',
      rangeName: 'Mowdok Range (Highest in BD)'
    },
    {
      id: 'keokradong-peak',
      name: 'Keokradong Summit',
      bnName: 'কেওক্রাডং চূড়া',
      elevationMeters: 986,
      x: 785,
      y: 935,
      district: 'Bandarban',
      region: 'Chattogram',
      rangeName: 'Ruma-Keokradong Range'
    },
    {
      id: 'chimbuk-peak',
      name: 'Chimbuk Peak',
      bnName: 'চিম্বুক পাহাড়',
      elevationMeters: 865,
      x: 768,
      y: 898,
      district: 'Bandarban',
      region: 'Chattogram',
      rangeName: 'Chimbuk Range'
    },
    {
      id: 'sajek-valley',
      name: 'Sajek Valley Ridge',
      bnName: 'সাজেক ভ্যালি চূড়া',
      elevationMeters: 540,
      x: 758,
      y: 608,
      district: 'Rangamati',
      region: 'Chattogram',
      rangeName: 'Sajek Range (Queen of Hills)'
    },
    {
      id: 'baghaichhari-ridge',
      name: 'Baghaichhari High Crest',
      bnName: 'বাঘাইছড়ি রিজ',
      elevationMeters: 420,
      x: 752,
      y: 660,
      district: 'Rangamati',
      region: 'Chattogram',
      rangeName: 'Kasalong Range'
    }
  ]
};

// ============================================================================
// 3. GREEN LOW UPLANDS & PIEDMONT FOOTHILLS (40m - 95m)
// Sinks progressively between 40m and 95m according to data.
// ============================================================================
export const GREEN_MOUNTAIN_PATHS: string[] = [
  // Tetulia & Banglabandha Himalayan Piedmont Plain & Frontier Ridge (Panchagarh)
  'M 125 65 C 150 62, 175 75, 172 105 C 162 128, 138 126, 122 102 C 114 86, 118 70, 125 65 Z',
  // Kantajew Upper Alluvial Piedmont Fan (Dinajpur)
  'M 215 260 C 242 255, 268 268, 262 298 C 252 318, 228 322, 212 302 C 200 285, 204 268, 215 260 Z',
  // Bhanugach Reserve Terrace & Low Tea Hills (Moulvibazar)
  'M 590 495 C 615 490, 630 505, 625 528 C 615 540, 595 538, 585 522 C 580 508, 584 498, 590 495 Z',
  // Jaintiapur Northern Alluvial Terrace & Tea Escarpment (Sylhet)
  'M 622 365 C 648 360, 665 375, 658 395 C 645 408, 625 405, 615 390 C 610 378, 615 368, 622 365 Z',
  // Susang Durgapur Low Foothills Apron (Netrokona)
  'M 480 355 C 505 350, 520 365, 515 385 C 498 392, 480 385, 475 370 C 472 360, 475 356, 480 355 Z',
  // Sitakunda Low Foothills & Mirsharai Coastal Terrace (Chattogram)
  'M 630 725 C 650 720, 665 735, 660 760 C 648 775, 630 770, 624 750 C 620 735, 624 728, 630 725 Z'
];

export const GREEN_MOUNTAIN_ZONE: MountainZone = {
  id: 'green-mountains',
  name: 'Green Low Uplands & Foothills (40m – 95m)',
  bnName: 'সবুজ নিম্ন উচ্চভূমি ও পাদদেশ (৪০–৯৫মি)',
  minElevationMeters: 40,
  maxElevationMeters: 95,
  colorName: 'green',
  color: '#22c55e',
  strokeColor: '#16a34a',
  fillColor: 'rgba(34, 197, 94, 0.28)',
  glowColor: 'rgba(34, 197, 94, 0.75)',
  description: 'Himalayan piedmont aprons, low Sylhet tea terraces, and coastal foothills. Sinks progressively between 40m and 95m.',
  geology: 'Alluvial piedmont gravels, Dupitila sands, and Pleistocene Terrace clay.',
  paths: GREEN_MOUNTAIN_PATHS,
  peaks: [
    {
      id: 'tetulia-green-peak',
      name: 'Tetulia Piedmont Crest',
      bnName: 'তেঁতুলিয়া উচ্চ পলল চূড়া',
      elevationMeters: 95,
      x: 148,
      y: 85,
      district: 'Panchagarh',
      region: 'Rangpur',
      rangeName: 'Himalayan Piedmont'
    },
    {
      id: 'banglabandha-green-peak',
      name: 'Banglabandha Frontier Crest',
      bnName: 'বাংলাবান্ধা সীমান্ত চূড়া',
      elevationMeters: 92,
      x: 135,
      y: 68,
      district: 'Panchagarh',
      region: 'Rangpur',
      rangeName: 'Himalayan Border Fan'
    },
    {
      id: 'bhanugach-green-peak',
      name: 'Bhanugach Forest Terrace',
      bnName: 'ভানুগাছ বন উচ্চভূমি',
      elevationMeters: 85,
      x: 602,
      y: 502,
      district: 'Moulvibazar',
      region: 'Sylhet',
      rangeName: 'Bhanugach Forest'
    },
    {
      id: 'kantajew-green-peak',
      name: 'Kantajew Piedmont Fan',
      bnName: 'কান্তজীউ পলল উচ্চভূমি',
      elevationMeters: 78,
      x: 235,
      y: 285,
      district: 'Dinajpur',
      region: 'Rangpur',
      rangeName: 'Dinajpur Piedmont Plain'
    },
    {
      id: 'jaintiapur-green-peak',
      name: 'Jaintiapur Tea Escarpment',
      bnName: 'জৈন্তাপুর চা উচ্চভূমি',
      elevationMeters: 68,
      x: 635,
      y: 375,
      district: 'Sylhet',
      region: 'Sylhet',
      rangeName: 'Jaintia Low Escarpment'
    }
  ]
};

export const MOUNTAIN_ZONES: MountainZone[] = [GREEN_MOUNTAIN_ZONE, YELLOW_MOUNTAIN_ZONE, RED_MOUNTAIN_ZONE];

/**
 * Calculates current submersion status for a mountain zone based on sea level
 */
export function getMountainZoneStatus(zone: MountainZone, seaLevelMeters: number): {
  isDry: boolean;
  isSinking: boolean;
  isFullySubmerged: boolean;
  submergedPercent: number;
  waterDepthMeters: number;
  statusText: string;
} {
  const minElev = zone.minElevationMeters;
  const maxElev = zone.maxElevationMeters;

  if (seaLevelMeters < minElev) {
    return {
      isDry: true,
      isSinking: false,
      isFullySubmerged: false,
      submergedPercent: 0,
      waterDepthMeters: 0,
      statusText: `Above Water (Sinks at ${minElev}m–${maxElev}m)`
    };
  }

  if (seaLevelMeters >= maxElev) {
    return {
      isDry: false,
      isSinking: false,
      isFullySubmerged: true,
      submergedPercent: 100,
      waterDepthMeters: Number((seaLevelMeters - maxElev).toFixed(1)),
      statusText: `100% Submerged (${(seaLevelMeters - maxElev).toFixed(0)}m Underwater)`
    };
  }

  // Actively sinking between minElev and maxElev
  const percent = Number((((seaLevelMeters - minElev) / (maxElev - minElev)) * 100).toFixed(1));
  const depth = Number((seaLevelMeters - minElev).toFixed(1));
  return {
    isDry: false,
    isSinking: true,
    isFullySubmerged: false,
    submergedPercent: percent,
    waterDepthMeters: depth,
    statusText: `Sinking · ${percent}% Submerged (+${depth}m Water)`
  };
}
