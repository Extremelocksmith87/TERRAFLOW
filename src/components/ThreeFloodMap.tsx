import React, { useEffect, useRef, useState } from 'react';
import { CountryFloodData } from '../types/flood';
import { REAL_COUNTRY_GEO, RealCountryGeo } from '../data/realCountryGeoData';
import L from 'leaflet';
import { RotateCcw, ZoomIn, ZoomOut, Users, Waves, AlertTriangle, ShieldCheck, MapPin, Layers, Map as MapIcon } from 'lucide-react';

interface ThreeFloodMapProps {
  country: CountryFloodData;
  seaLevelMeters: number;
  iceMeltPercent: number;
  rainIntensity: number; // 0: off, 1: light, 2: heavy, 3: deluge
  showPopulationOverlay: boolean;
  onTogglePopulationOverlay: () => void;
  floodedPercent: number;
  submergedCities: string[];
}

export const ThreeFloodMap: React.FC<ThreeFloodMapProps> = ({
  country,
  seaLevelMeters,
  iceMeltPercent,
  rainIntensity,
  showPopulationOverlay,
  onTogglePopulationOverlay,
  floodedPercent,
  submergedCities
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Basemap style: 'osm' (OpenStreetMap) | 'topo' (Esri World Topo) | 'carto' (Light)
  const [basemapType, setBasemapType] = useState<'osm' | 'topo' | 'carto'>('osm');

  // Country geo data
  const geoData: RealCountryGeo = REAL_COUNTRY_GEO[country.id] || REAL_COUNTRY_GEO['bangladesh'];

  // Initialize Leaflet Real Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove existing map if any
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // 1. Create Leaflet map centered on the actual country
    const map = L.map(mapContainerRef.current, {
      center: geoData.center,
      zoom: geoData.defaultZoom,
      zoomControl: false,
      attributionControl: false
    });
    leafletMapRef.current = map;

    // 2. Add real downloaded map tile layer
    // Esri World Topo / OpenStreetMap / CartoDB
    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (basemapType === 'topo') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    } else if (basemapType === 'carto') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 18,
      minZoom: 4
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Layer group for dynamic topography, flood, and population layers
    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;

    // Fit map bounds to country
    map.fitBounds(geoData.bounds, { padding: [25, 25] });

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [country.id, basemapType, geoData]);

  // Update dynamic layers (Topography, Floodwater, Population, Cities)
  useEffect(() => {
    const map = leafletMapRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (showPopulationOverlay) {
      // ==========================================
      // POPULATION MAP MODE: ONLY DARK RED, RED, AND WHITE
      // (Requirement: "dislocate the user from the flood map and only show population with dark red red and white")
      // ==========================================

      // 1. Base country polygon in white (rural/low density baseline)
      const countryPolygon = L.polygon(geoData.boundaryCoordinates, {
        color: '#64748b',
        weight: 3,
        fillColor: '#ffffff',
        fillOpacity: 0.88
      });
      group.addLayer(countryPolygon);

      // 2. Demographic density circles in Dark Red, Red, and White
      geoData.populationZones.forEach((zone) => {
        let fillColor = '#ffffff';
        let strokeColor = '#94a3b8';
        let fillOpacity = 0.85;

        if (zone.density === 'dark_red') {
          // Ultra High Density (e.g. Dhaka, Chittagong): Dark Red
          fillColor = '#881337'; // Dark Red
          strokeColor = '#4c0519';
          fillOpacity = 0.85;
        } else if (zone.density === 'red') {
          // Urban Density (e.g. Khulna, Sylhet, Rajshahi): Red
          fillColor = '#ef4444'; // Red
          strokeColor = '#b91c1c';
          fillOpacity = 0.75;
        } else {
          // Rural / Nature Reserve (e.g. Sundarbans, Hill Tracts): White
          fillColor = '#ffffff';
          strokeColor = '#cbd5e1';
          fillOpacity = 0.95;
        }

        const circle = L.circle(zone.center, {
          radius: zone.radiusMeters,
          color: strokeColor,
          weight: 2,
          fillColor: fillColor,
          fillOpacity: fillOpacity
        });

        circle.bindTooltip(`<strong>${zone.label}</strong>`, {
          permanent: false,
          direction: 'top'
        });

        group.addLayer(circle);
      });

      // 3. City Population Pins
      country.cities.forEach((city) => {
        // Approximate city GPS coords or use actual coords
        const cityCoord = getCityCoordinates(country.id, city.name);
        const isMega = city.population > 3000000;

        const iconHtml = `
          <div style="background: ${isMega ? '#881337' : '#ef4444'}; color: white; border: 2px solid white; border-radius: 9999px; padding: 2px 7px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; items-center; gap: 4px;">
            <span>${city.name}</span>
            <span style="opacity: 0.9; font-family: monospace;">${(city.population / 1000000).toFixed(1)}M</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: '',
          iconAnchor: [35, 12]
        });

        const marker = L.marker(cityCoord, { icon: customIcon });
        group.addLayer(marker);
      });
    } else {
      // ==========================================
      // TOPOGRAPHICAL FLOOD MAP MODE:
      // Peak: RED, Mid: YELLOW, Lowlands: GREEN, Water: BLUE, Cities: GREY.
      // And layer dynamic floodwater directly over the real map!
      // ==========================================

      // 1. Base country boundary outline
      const countryOutline = L.polygon(geoData.boundaryCoordinates, {
        color: '#0369a1',
        weight: 3.5,
        fillColor: '#16a34a', // Lowland & forest green
        fillOpacity: 0.35
      });
      group.addLayer(countryOutline);

      // 2. Layer Real Elevation Zones over the actual map:
      // Red for Highest Peak, Yellow for Mid-Elevations, Green for Lowlands
      geoData.elevationZones.forEach((zone) => {
        let zoneFillColor = '#16a34a';
        let zoneStrokeColor = '#15803d';

        if (zone.type === 'peak') {
          zoneFillColor = '#ef4444'; // RED for highest peak
          zoneStrokeColor = '#b91c1c';
        } else if (zone.type === 'mid') {
          zoneFillColor = '#facc15'; // YELLOW for mid plateaus
          zoneStrokeColor = '#ca8a04';
        } else if (zone.type === 'delta') {
          zoneFillColor = '#22c55e'; // GREEN for delta
          zoneStrokeColor = '#16a34a';
        }

        // Check if this elevation zone is submerged under current sea level!
        const isSubmerged = seaLevelMeters >= zone.minElevation;
        if (isSubmerged) {
          // Submerged land turns into vibrant flood blue with animated opacity!
          zoneFillColor = '#0284c7';
          zoneStrokeColor = '#0369a1';
        }

        const elevPoly = L.polygon(zone.coordinates, {
          color: zoneStrokeColor,
          weight: 2,
          fillColor: zoneFillColor,
          fillOpacity: isSubmerged ? 0.72 : 0.45
        });

        elevPoly.bindTooltip(
          `<strong>${zone.name}</strong><br/>Elevation: ${zone.minElevation}m - ${zone.maxElevation}m<br/>Status: <span style="color: ${isSubmerged ? '#0284c7' : '#15803d'}; font-weight: bold;">${isSubmerged ? '🌊 SUBMERGED' : '✓ Above Sea Level'}</span>`,
          { direction: 'top' }
        );

        group.addLayer(elevPoly);
      });

      // 3. Real Rivers drawn in Blue
      geoData.rivers.forEach((river) => {
        const riverLine = L.polyline(river.coordinates, {
          color: '#0284c7', // Vibrant River Blue
          weight: river.weight,
          opacity: 0.85,
          lineCap: 'round'
        });
        riverLine.bindTooltip(`<strong>${river.name}</strong>`, { direction: 'center' });
        group.addLayer(riverLine);
      });

      // 4. FLOOD INUNDATION LAYER (Over the actual country map)
      // When sea level rises, low-lying regions flood dynamically!
      if (seaLevelMeters > 3) {
        // Coastal surge buffer over boundary
        const floodSurge = L.polygon(geoData.boundaryCoordinates, {
          color: '#0284c7',
          weight: Math.min(25, (seaLevelMeters / 100) * 15 + 2),
          opacity: 0.7,
          fillColor: '#0284c7',
          fillOpacity: Math.min(0.75, (seaLevelMeters / 500) * 0.5 + (floodedPercent / 100) * 0.4)
        });
        group.addLayer(floodSurge);
      }

      // 5. City Markers on the real map (Slight GREYISH tone, turn red when submerged)
      country.cities.forEach((city) => {
        const cityCoord = getCityCoordinates(country.id, city.name);
        const isSubmerged = submergedCities.includes(city.name);

        const iconHtml = `
          <div style="background: ${isSubmerged ? '#e11d48' : '#64748b'}; color: white; border: 2px solid white; border-radius: 9999px; padding: 2px 7px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; items-center; gap: 4px; ${isSubmerged ? 'animation: pulse 1.5s infinite;' : ''}">
            <span>${isSubmerged ? '🌊 ' : ''}${city.name}</span>
            <span style="opacity: 0.9; font-family: monospace; font-size: 10px;">${city.elevationMeters}m</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: '',
          iconAnchor: [35, 12]
        });

        const marker = L.marker(cityCoord, { icon: customIcon });
        marker.bindTooltip(
          `<strong>${city.name}</strong><br/>Elevation: ${city.elevationMeters}m<br/>Population: ${city.population.toLocaleString()}<br/>Status: <strong>${isSubmerged ? '⚠️ SUBMERGED' : '✓ Safe Above Water'}</strong>`,
          { direction: 'top' }
        );
        group.addLayer(marker);
      });
    }
  }, [country, seaLevelMeters, showPopulationOverlay, floodedPercent, submergedCities, geoData]);

  // Map Controls
  const handleZoomIn = () => leafletMapRef.current?.zoomIn();
  const handleZoomOut = () => leafletMapRef.current?.zoomOut();
  const handleReset = () => {
    leafletMapRef.current?.fitBounds(geoData.bounds, { padding: [25, 25] });
  };

  return (
    <div className="relative w-full h-[500px] md:h-[620px] bg-slate-100 rounded-3xl overflow-hidden border-4 border-sky-300 shadow-xl select-none">
      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Header */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between pointer-events-none gap-2 z-[1000]">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border-2 border-sky-200 flex items-center gap-2.5">
          <span className="text-3xl filter drop-shadow-xs">{country.flag}</span>
          <div>
            <h3 className="font-fun text-base font-bold text-slate-900 leading-tight">
              {country.name} · Actual Real Map {showPopulationOverlay ? '(Population Mode)' : '(Topography & Flood Layer)'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {showPopulationOverlay
                ? 'Showing Pure Demographic Population (Dark Red · Red · White)'
                : `Actual Map with Elevation Contours & Live Sea Inundation (+${seaLevelMeters}m)`}
            </p>
          </div>
        </div>

        {/* Live Flooded Badge */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border-2 border-sky-300 flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-600 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Land Submerged: </span>
            <span
              className={`font-fun font-bold text-sm ${
                floodedPercent > 40
                  ? 'text-rose-600'
                  : floodedPercent > 15
                  ? 'text-amber-600'
                  : 'text-cyan-700'
              }`}
            >
              {floodedPercent.toFixed(1)}% (+{seaLevelMeters}m)
            </span>
          </div>
        </div>
      </div>

      {/* Left Control Bar (Population Dislocate Toggle & Zoom) */}
      <div className="absolute left-4 top-24 flex flex-col gap-2 z-[1000]">
        {/* Requirement: "the population map should dislocate the user from the flood map and only show population with dark red red and white" */}
        <button
          onClick={onTogglePopulationOverlay}
          title={showPopulationOverlay ? 'Return to Flood Map' : 'Switch to Population Map (Dark Red, Red, White)'}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
            showPopulationOverlay
              ? 'btn-cartoon-rose text-white ring-2 ring-rose-400'
              : 'btn-cartoon-amber text-slate-900'
          }`}
        >
          {showPopulationOverlay ? (
            <>
              <Layers className="w-4 h-4" />
              <span>Show Flood Map</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4 text-rose-950" />
              <span>See Population</span>
            </>
          )}
        </button>

        {/* Real Basemap Switcher (OpenStreetMap vs Topo vs Carto) */}
        <div className="bg-white/95 rounded-2xl p-1.5 shadow-md border-2 border-sky-200 flex flex-col gap-1 text-[11px] font-bold text-slate-700">
          <span className="text-[10px] text-slate-400 uppercase text-center px-1">Actual Basemap</span>
          <button
            onClick={() => setBasemapType('osm')}
            className={`px-2 py-1 rounded-xl transition-colors ${
              basemapType === 'osm' ? 'bg-sky-600 text-white' : 'hover:bg-sky-100'
            }`}
          >
            Street Map
          </button>
          <button
            onClick={() => setBasemapType('topo')}
            className={`px-2 py-1 rounded-xl transition-colors ${
              basemapType === 'topo' ? 'bg-sky-600 text-white' : 'hover:bg-sky-100'
            }`}
          >
            Topo Relief
          </button>
          <button
            onClick={() => setBasemapType('carto')}
            className={`px-2 py-1 rounded-xl transition-colors ${
              basemapType === 'carto' ? 'bg-sky-600 text-white' : 'hover:bg-sky-100'
            }`}
          >
            Clean Map
          </button>
        </div>

        {/* Map Navigation Buttons */}
        <div className="bg-white/95 rounded-2xl p-1 shadow-md border-2 border-sky-200 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl text-slate-700 hover:bg-sky-100 transition-colors flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl text-slate-700 hover:bg-sky-100 transition-colors flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View to Country"
            className="p-2 rounded-xl text-slate-700 hover:bg-sky-100 transition-colors flex items-center justify-center border-t border-slate-100"
          >
            <RotateCcw className="w-4 h-4 text-sky-600" />
          </button>
        </div>
      </div>

      {/* Dynamic Legend Overlay */}
      <div className="absolute right-4 top-20 bg-white/95 backdrop-blur-md px-3.5 py-3 rounded-2xl shadow-md border-2 border-sky-200 text-xs hidden sm:flex flex-col gap-1.5 z-[1000] max-w-[220px]">
        {showPopulationOverlay ? (
          <>
            <div className="font-fun font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-600" />
              Population Density
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#881337] border border-[#4c0519] shrink-0 shadow-xs" />
              <span className="text-slate-800 font-bold">Dark Red: High Density</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] border border-[#b91c1c] shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Red: Urban / Metro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ffffff] border-2 border-slate-300 shrink-0 shadow-xs" />
              <span className="text-slate-600 font-medium">White: Rural & Nature</span>
            </div>
          </>
        ) : (
          <>
            <div className="font-fun font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-0.5">
              Topography Over Actual Map
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-600 shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Peak Elevation (Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Mid Plateau (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-emerald-700 shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Forests/Plains (Green)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 border border-sky-600 shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Water / Inundated (Blue)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-500 border border-slate-600 shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Cities (Greyish Tone)</span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Floating Instructions Bar */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border-2 border-sky-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 z-[1000]">
        <div>
          <strong className="text-slate-800">Actual Real Map:</strong> Drag to pan • Scroll to zoom •{' '}
          {showPopulationOverlay ? (
            <span className="text-rose-700 font-bold">Population Mode Active (Dark Red, Red, White)</span>
          ) : (
            <span className="text-sky-700 font-bold">Topography Layer Active (Floods dynamically with Sea Level slider)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {submergedCities.length > 0 ? (
            <span className="flex items-center gap-1.5 text-rose-700 font-bold bg-rose-100 px-3 py-1 rounded-xl border border-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              {submergedCities.length} {submergedCities.length === 1 ? 'City' : 'Cities'} Submerged
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              All Major Cities Above Water
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper: real GPS coordinates for country cities
function getCityCoordinates(countryId: string, cityName: string): [number, number] {
  const cityMap: Record<string, [number, number]> = {
    // Bangladesh
    'Dhaka': [23.8103, 90.4125],
    'Chittagong (Chattogram)': [22.3569, 91.7832],
    'Khulna': [22.8456, 89.5403],
    'Sylhet': [24.8949, 91.8687],
    'Rajshahi': [24.3745, 88.6042],
    'Barisal': [22.7010, 90.3535],
    'Rangpur': [25.7439, 89.2752],
    'Cox\'s Bazar': [21.4272, 92.0058],

    // Netherlands
    'Amsterdam': [52.3676, 4.9041],
    'Rotterdam': [51.9244, 4.4777],
    'The Hague (Den Haag)': [52.0705, 4.3007],
    'Utrecht': [52.0907, 5.1214],
    'Eindhoven': [51.4416, 5.4697],
    'Groningen': [53.2194, 6.5665],
    'Maastricht': [50.8514, 5.6910],

    // USA
    'Washington, D.C.': [38.9072, -77.0369],
    'New York City': [40.7128, -74.0060],
    'Los Angeles': [34.0522, -118.2437],
    'Chicago': [41.8781, -87.6298],
    'Houston': [29.7604, -95.3698],
    'Miami': [25.7617, -80.1918],
    'New Orleans': [29.9511, -90.0715],
    'Seattle': [47.6062, -122.3321],

    // Japan
    'Tokyo': [35.6762, 139.6503],
    'Yokohama': [35.4437, 139.6380],
    'Osaka': [34.6937, 135.5023],
    'Nagoya': [35.1815, 136.9066],
    'Sapporo': [43.0618, 141.3545],
    'Fukuoka': [33.5904, 130.4017],
    'Sendai': [38.2682, 140.8694],
    'Hiroshima': [34.3853, 132.4553],

    // Philippines
    'Manila': [14.5995, 120.9842],
    'Quezon City': [14.6760, 121.0437],
    'Davao City': [7.1907, 125.4553],
    'Cebu City': [10.3157, 123.8854],
    'Zamboanga': [6.9214, 122.0790],
    'Cagayan de Oro': [8.4542, 124.6319],

    // Italy
    'Rome': [41.9028, 12.4964],
    'Milan': [45.4642, 9.1900],
    'Naples': [40.8518, 14.2681],
    'Turin': [45.0703, 7.6869],
    'Palermo': [38.1157, 13.3615],
    'Genoa': [44.4056, 8.9463],
    'Venice (Venezia)': [45.4408, 12.3155],
    'Florence': [43.7696, 11.2558],

    // UK
    'London': [51.5074, -0.1278],
    'Manchester': [53.4808, -2.2426],
    'Birmingham': [52.4862, -1.8904],
    'Glasgow': [55.8642, -4.2518],
    'Edinburgh': [55.9533, -3.1883],
    'Cardiff': [51.4816, -3.1791],
    'Belfast': [54.5973, -5.9301],

    // Brazil
    'Brasília': [-15.7975, -47.8919],
    'São Paulo': [-23.5505, -46.6333],
    'Rio de Janeiro': [-22.9068, -43.1729],
    'Salvador': [-12.9777, -38.5016],
    'Porto Alegre': [-30.0346, -51.2177],

    // Vietnam
    'Hanoi': [21.0285, 105.8542],
    'Ho Chi Minh City': [10.8231, 106.6297],
    'Da Nang': [16.0544, 108.2022],

    // Egypt
    'Cairo': [30.0444, 31.2357],
    'Alexandria': [31.2001, 29.9187],

    // Germany
    'Berlin': [52.5200, 13.4050],
    'Hamburg': [53.5511, 9.9937],
    'Munich (München)': [48.1351, 11.5820],

    // Australia
    'Canberra': [-35.2809, 149.1300],
    'Sydney': [-33.8688, 151.2093],
    'Melbourne': [-37.8136, 144.9631],
    'Brisbane': [-27.4698, 153.0251],
    'Perth': [-31.9505, 115.8605]
  };

  return cityMap[cityName] || [23.685, 90.3563];
}
