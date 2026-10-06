export interface GeoElevationZone {
  name: string;
  minElevation: number;
  maxElevation: number;
  type: 'peak' | 'mid' | 'lowland' | 'delta';
  coordinates: [number, number][]; // [lat, lng]
}

export interface GeoRiver {
  name: string;
  coordinates: [number, number][]; // [lat, lng]
  weight: number;
}

export interface GeoPopulationZone {
  name: string;
  center: [number, number]; // [lat, lng]
  radiusMeters: number;
  density: 'dark_red' | 'red' | 'white';
  label: string;
}

export interface RealCountryGeo {
  id: string;
  center: [number, number]; // [lat, lng]
  defaultZoom: number;
  bounds: [[number, number], [number, number]]; // [southWest, northEast]
  boundaryCoordinates: [number, number][]; // outer boundary
  elevationZones: GeoElevationZone[];
  rivers: GeoRiver[];
  populationZones: GeoPopulationZone[];
}

export const REAL_COUNTRY_GEO: Record<string, RealCountryGeo> = {
  bangladesh: {
    id: 'bangladesh',
    center: [23.685, 90.3563],
    defaultZoom: 7,
    bounds: [[20.5, 88.0], [26.7, 92.7]],
    // Real Geographic Outline of Bangladesh
    boundaryCoordinates: [
      [26.634, 88.423],
      [26.412, 88.912],
      [26.152, 89.654],
      [25.812, 89.923],
      [25.184, 89.871],
      [25.176, 91.542],
      [25.112, 92.213],
      [24.812, 92.512],
      [24.234, 91.954],
      [23.951, 91.312],
      [23.412, 91.354],
      [23.012, 92.012],
      [22.812, 92.412],
      [21.854, 92.654],
      [21.212, 92.354],
      [20.712, 92.312],
      [20.912, 91.812],
      [21.512, 91.854],
      [22.112, 91.454],
      [22.212, 90.754],
      [21.712, 90.412],
      [21.812, 89.812],
      [21.612, 89.154],
      [22.212, 89.012],
      [22.812, 88.912],
      [23.512, 88.612],
      [24.112, 88.312],
      [24.712, 88.112],
      [25.212, 88.512],
      [25.812, 88.212],
      [26.312, 88.312],
      [26.634, 88.423]
    ],
    elevationZones: [
      // High Peak (RED): Chittagong Hill Tracts & Saka Haphong (300m - 1052m)
      {
        name: 'Chittagong Hill Tracts & Mowdok Mual',
        minElevation: 250,
        maxElevation: 1052,
        type: 'peak',
        coordinates: [
          [22.8, 92.1],
          [22.9, 92.5],
          [22.2, 92.7],
          [21.5, 92.5],
          [21.3, 92.2],
          [21.8, 92.0],
          [22.4, 92.1]
        ]
      },
      // Mid Plateau (YELLOW): Madhupur Tract (20-40m) & Barind Tract (25-85m)
      {
        name: 'Barind Tract (Northwest Plateau)',
        minElevation: 25,
        maxElevation: 85,
        type: 'mid',
        coordinates: [
          [25.2, 88.2],
          [25.6, 88.8],
          [24.8, 89.2],
          [24.3, 88.5],
          [24.6, 88.2]
        ]
      },
      {
        name: 'Madhupur Clay Terrace',
        minElevation: 18,
        maxElevation: 40,
        type: 'mid',
        coordinates: [
          [24.6, 90.0],
          [24.8, 90.4],
          [24.1, 90.5],
          [23.9, 90.2]
        ]
      },
      // Lowlands (GREEN): Central Floodplains (5-18m)
      {
        name: 'Central Basin Floodplain',
        minElevation: 5,
        maxElevation: 18,
        type: 'lowland',
        coordinates: [
          [24.5, 89.2],
          [24.8, 91.0],
          [23.5, 91.1],
          [23.1, 89.8],
          [23.5, 89.2]
        ]
      },
      // Coastal Delta & Sundarbans (DELTA, Submerged at 0-5m!)
      {
        name: 'Sundarbans & Meghna Coastal Delta',
        minElevation: 0,
        maxElevation: 5,
        type: 'delta',
        coordinates: [
          [22.8, 88.9],
          [23.0, 90.8],
          [22.5, 91.3],
          [21.6, 91.9],
          [20.9, 92.3],
          [21.6, 89.1],
          [22.2, 89.0]
        ]
      }
    ],
    rivers: [
      {
        name: 'Padma River',
        weight: 6,
        coordinates: [
          [24.5, 88.2],
          [24.1, 89.0],
          [23.8, 89.8],
          [23.3, 90.6]
        ]
      },
      {
        name: 'Jamuna / Brahmaputra',
        weight: 7,
        coordinates: [
          [25.9, 89.8],
          [25.1, 89.7],
          [24.4, 89.6],
          [23.8, 89.8]
        ]
      },
      {
        name: 'Meghna River',
        weight: 6,
        coordinates: [
          [24.8, 91.2],
          [24.0, 90.9],
          [23.3, 90.6],
          [22.5, 90.7],
          [21.8, 91.1]
        ]
      }
    ],
    populationZones: [
      {
        name: 'Dhaka Metropolitan Conurbation',
        center: [23.81, 90.41],
        radiusMeters: 38000,
        density: 'dark_red',
        label: 'Dhaka: 22 Million (Ultra Dense: >28,000/km²)'
      },
      {
        name: 'Chittagong Port & Coastal Belt',
        center: [22.35, 91.78],
        radiusMeters: 28000,
        density: 'dark_red',
        label: 'Chittagong: 5.3 Million (Industrial Core)'
      },
      {
        name: 'Khulna Delta Hub',
        center: [22.84, 89.54],
        radiusMeters: 22000,
        density: 'red',
        label: 'Khulna: 1.6 Million (Vulnerable Delta)'
      },
      {
        name: 'Rajshahi Division',
        center: [24.37, 88.60],
        radiusMeters: 20000,
        density: 'red',
        label: 'Rajshahi: 850,000'
      },
      {
        name: 'Sylhet Division',
        center: [24.89, 91.86],
        radiusMeters: 20000,
        density: 'red',
        label: 'Sylhet: 900,000'
      },
      {
        name: 'Barisal Lowland Center',
        center: [22.70, 90.35],
        radiusMeters: 18000,
        density: 'red',
        label: 'Barisal: 500,000'
      },
      {
        name: 'Sundarbans Forest Reserve',
        center: [22.0, 89.5],
        radiusMeters: 55000,
        density: 'white',
        label: 'Sundarbans Mangrove Reserve (Unpopulated / <25/km²)'
      },
      {
        name: 'Chittagong Hill Tracts Protected Wilderness',
        center: [22.3, 92.3],
        radiusMeters: 45000,
        density: 'white',
        label: 'Hill Tracts Nature Reserve (<60/km²)'
      }
    ]
  },

  netherlands: {
    id: 'netherlands',
    center: [52.1326, 5.2913],
    defaultZoom: 7,
    bounds: [[50.7, 3.3], [53.6, 7.3]],
    boundaryCoordinates: [
      [53.5, 6.8],
      [53.3, 7.2],
      [52.8, 7.1],
      [52.3, 7.0],
      [51.8, 6.8],
      [51.8, 6.0],
      [51.2, 6.0],
      [50.8, 6.0],
      [50.75, 5.7],
      [51.2, 5.5],
      [51.4, 4.9],
      [51.3, 4.2],
      [51.4, 3.4],
      [51.7, 3.6],
      [52.0, 4.0],
      [52.5, 4.5],
      [53.0, 4.8],
      [53.5, 6.0],
      [53.5, 6.8]
    ],
    elevationZones: [
      {
        name: 'Vaalserberg & South Limburg Hills',
        minElevation: 80,
        maxElevation: 322,
        type: 'peak',
        coordinates: [
          [50.85, 5.6],
          [50.95, 5.9],
          [50.75, 6.0],
          [50.75, 5.7]
        ]
      },
      {
        name: 'Veluwe & Utrecht Hill Ridge',
        minElevation: 25,
        maxElevation: 80,
        type: 'mid',
        coordinates: [
          [52.3, 5.7],
          [52.4, 6.0],
          [51.9, 6.0],
          [52.0, 5.5]
        ]
      },
      {
        name: 'Groningen & Eastern Uplands',
        minElevation: 1,
        maxElevation: 25,
        type: 'lowland',
        coordinates: [
          [53.3, 6.3],
          [53.2, 7.0],
          [52.6, 6.9],
          [52.6, 6.1]
        ]
      },
      {
        name: 'Randstad & Zeeland Polders (-7m to 0m)',
        minElevation: -7,
        maxElevation: 1,
        type: 'delta',
        coordinates: [
          [52.6, 4.5],
          [52.4, 5.2],
          [51.8, 4.9],
          [51.4, 3.5],
          [51.9, 4.0]
        ]
      }
    ],
    rivers: [
      {
        name: 'Rhine (Rijn)',
        weight: 6,
        coordinates: [
          [51.8, 6.1],
          [51.9, 5.6],
          [51.9, 5.0],
          [51.9, 4.3]
        ]
      }
    ],
    populationZones: [
      {
        name: 'Randstad (Amsterdam/Rotterdam/Hague)',
        center: [52.1, 4.6],
        radiusMeters: 45000,
        density: 'dark_red',
        label: 'Randstad: 8.5M (Ultra Dense: >1,500/km²)'
      },
      {
        name: 'Eindhoven Brainport Corridor',
        center: [51.44, 5.47],
        radiusMeters: 25000,
        density: 'red',
        label: 'Eindhoven: 800,000'
      },
      {
        name: 'Veluwe Nature Reserve',
        center: [52.15, 5.85],
        radiusMeters: 25000,
        density: 'white',
        label: 'Veluwe Forest (<75/km²)'
      }
    ]
  }
};
