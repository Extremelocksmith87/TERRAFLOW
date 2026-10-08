// Specific Mountain Elevation Zones of Bangladesh
// Yellow Mountains: 100m - 300m (Foothills & Low Mountain Ranges)
// Red Mountains: 400m - 1000m+ (Chittagong High Strike Ridges & Peaks up to 1,052m)
// Digitized precisely to the 896 x 1200 coordinate space of the Bangladesh Topographical Relief Map

import { USGS_ELEVATION_ZONES } from './usgsElevationZones';

export interface MountainPeak {
  id: string;
  name: string;
  bnName: string;
  elevationMeters: number;
  x: number; // SVG pixel coordinate (0 - 896)
  y: number; // SVG pixel coordinate (0 - 1200)
  district: string;
  rangeName: string;
}

export interface MountainZone {
  id: 'yellow-mountains' | 'red-mountains';
  name: string;
  bnName: string;
  minElevationMeters: number;
  maxElevationMeters: number;
  colorName: 'yellow' | 'red';
  color: string;
  strokeColor: string;
  fillColor: string;
  glowColor: string;
  description: string;
  geology: string;
  paths: string[];
  peaks: MountainPeak[];
}

// Extract exact digitized contours from USGS OFR 97-470H ArcView shapefiles
const z75_300 = USGS_ELEVATION_ZONES.find((z) => z.id === '75-300');
const zOver300 = USGS_ELEVATION_ZONES.find((z) => z.id === '> 300');

// 1. YELLOW MOUNTAINS: 100m - 300m
// These represent the lower foothills, anticline terraces, and low strike valleys of CHT and Sylhet
export const YELLOW_MOUNTAIN_ZONE: MountainZone = {
  id: 'yellow-mountains',
  name: 'Yellow Mountains (100m – 300m)',
  bnName: 'হলুদ পাহাড় ও পাদদেশ (১০০–৩০০মি)',
  minElevationMeters: 100,
  maxElevationMeters: 300,
  colorName: 'yellow',
  color: '#eab308',
  strokeColor: '#facc15',
  fillColor: 'rgba(234, 179, 8, 0.28)',
  glowColor: 'rgba(250, 204, 21, 0.75)',
  description: 'Sylhet Hills, Khagrachhari, Rangamati Midlands & CHT Low Foothills. Sinks progressively between 100m and 300m sea level.',
  geology: 'Miocene Boka Bil & Tipam Sandstone Formations forming folded low anticlines.',
  paths: z75_300 ? z75_300.paths : [],
  peaks: [
    {
      id: 'alutila',
      name: 'Alutila Mysterious Ridge',
      bnName: 'আলুটিলা পাহাড়',
      elevationMeters: 350,
      x: 688,
      y: 654,
      district: 'Khagrachhari',
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
      rangeName: 'Barkal Range'
    },
    {
      id: 'ruma-foothills',
      name: 'Ruma Valley Foothills',
      bnName: 'রুমা উপত্যকা পাদদেশ',
      elevationMeters: 150,
      x: 746,
      y: 838,
      district: 'Bandarban',
      rangeName: 'Sangu Valley Margin'
    },
    {
      id: 'patharia-ridge',
      name: 'Patharia Hills (Madhobkunda)',
      bnName: 'পাথারিয়া পাহাড়',
      elevationMeters: 240,
      x: 668,
      y: 432,
      district: 'Moulvibazar',
      rangeName: 'Patharia Range'
    }
  ]
};

// 2. RED MOUNTAINS: 400m - 1000m+
// These represent the highest anticlinal mountain ranges in Bangladesh along the Myanmar/India border
export const RED_MOUNTAIN_ZONE: MountainZone = {
  id: 'red-mountains',
  name: 'Red High Mountains (400m – 1000m+)',
  bnName: 'লাল উচ্চ পর্বতশ্রেণী (৪০০–১০০০+মি)',
  minElevationMeters: 400,
  maxElevationMeters: 1000,
  colorName: 'red',
  color: '#ef4444',
  strokeColor: '#dc2626',
  fillColor: 'rgba(239, 68, 68, 0.35)',
  glowColor: 'rgba(239, 68, 68, 0.85)',
  description: 'Chittagong High Strike Ridges including Saka Haphong (1,052m), Keokradong (986m), Chimbuk (865m) and Sajek Valley (540m). Sinks progressively between 400m and 1000m sea level.',
  geology: 'Surma Group Turbidites & Massive Sandstone Strike Ridges upthrusted by Indo-Burma Tectonic Plate subduction.',
  paths: zOver300 ? zOver300.paths : [],
  peaks: [
    {
      id: 'saka-haphong',
      name: 'Saka Haphong (Mowdok Mual)',
      bnName: 'সাকা হাফং (মোদক মুয়াল)',
      elevationMeters: 1052,
      x: 792,
      y: 1025,
      district: 'Bandarban',
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
      rangeName: 'Kasalong Range'
    }
  ]
};

export const MOUNTAIN_ZONES: MountainZone[] = [YELLOW_MOUNTAIN_ZONE, RED_MOUNTAIN_ZONE];

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
