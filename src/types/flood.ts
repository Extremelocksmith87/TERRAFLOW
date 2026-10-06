export interface CityPoint {
  name: string;
  x: number; // normalized grid -1 to 1
  y: number; // normalized grid -1 to 1
  elevationMeters: number;
  population: number;
  isCapital?: boolean;
}

export interface FloodEvent {
  year: number;
  name: string;
  waterLevelOrSurge: string;
  casualties: string;
  affectedPeople: string;
  damageCost: string;
  summary: string;
  primaryCause: string;
}

export interface RainfallRecord {
  month: string;
  rainfallMm: number;
}

export interface DecadalRainfall {
  decade: string;
  annualAverageMm: number;
  anomalyPercent: number;
}

export interface CountryFloodData {
  id: string;
  name: string;
  flag: string;
  continent: string;
  population: number;
  urbanPopulationPercent: number;
  coastalVulnerablePercent: number;
  totalAreaKm2: number;
  densityPerKm2: number;
  highestPoint: {
    name: string;
    elevationMeters: number;
  };
  lowestPoint: {
    name: string;
    elevationMeters: number;
  };
  averageElevationMeters: number;
  // Topography parameters for 3D procedural terrain generation
  topographyType: 'delta' | 'lowland' | 'plains'| 'mountainous' | 'archipelago' | 'basin' | 'coastal_plain';
  terrainRoughness: number;
  forestCoverPercent: number;
  waterCoverPercent: number;
  cities: CityPoint[];
  // Historical data
  floodHistoryParagraphs: string[];
  historicalFloods: FloodEvent[];
  annualAverageRainfallMm: number;
  monthlyRainfall: RainfallRecord[];
  decadalRainfall: DecadalRainfall[];
  record24HrRainfallMm: number;
  recordRainfallLocation: string;
  floodDefenseSystems: string[];
}

export interface GuideItem {
  id: number;
  title: string;
  description: string;
  category: 'prepare' | 'warning' | 'evacuate' | 'recovery' | 'health';
  actionIcon: string;
  priority: 'critical' | 'high' | 'recommended';
}

export interface DontItem {
  id: number;
  rule: string;
  dangerExplanation: string;
  safeAlternative: string;
  iconName: string;
}
