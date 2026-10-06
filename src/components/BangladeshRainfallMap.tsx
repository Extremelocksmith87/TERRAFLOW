import React, { useState, useRef, useMemo } from 'react';
import bangladeshMapImg from '../assets/images/bangladesh_srtm_topography_1791130914468.jpg';
import { BANGLADESH_CITIES, BangladeshCity } from '../data/bangladeshCitiesData';
import { USGS_ELEVATION_ZONES } from '../data/usgsElevationZones';
import { WeatherMode, MOUNTAINOUS_DOWNPOUR_DISTRICTS } from '../data/rainfallCycloneData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  CloudRain,
  Wind,
  Layers,
  MapPin,
  Waves
} from 'lucide-react';

interface BangladeshRainfallMapProps {
  weatherMode: WeatherMode;
  rainMagnitudeMm: number;
  cycloneCategory: number;
  atRiskDistrictIds: string[];
  floodedZoneIds: string[];
  equivalentSurgeMeters: number;
  dangerLevel: 'Low' | 'Moderate' | 'Severe' | 'Catastrophic';
  selectedDistrict: BangladeshCity | null;
  onSelectDistrict: (district: BangladeshCity | null) => void;
}

export const BangladeshRainfallMap: React.FC<BangladeshRainfallMapProps> = ({
  weatherMode,
  rainMagnitudeMm,
  cycloneCategory,
  atRiskDistrictIds,
  floodedZoneIds,
  equivalentSurgeMeters,
  dangerLevel,
  selectedDistrict,
  onSelectDistrict
}) => {
  // Pan and zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSurveyContours, setShowSurveyContours] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(3.5, prev + 0.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.7, prev - 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Convert district percentages to 896x1200 viewBox coordinates
  const getCityCoordinates = (xPercent: number, yPercent: number) => {
    const xMin = 75;
    const xMax = 825;
    const yMin = 70;
    const yMax = 1040;
    const x = xMin + (xPercent / 100) * (xMax - xMin);
    const y = yMin + (yPercent / 100) * (yMax - yMin);
    return { x, y };
  };

  const atRiskSet = useMemo(() => new Set(atRiskDistrictIds), [atRiskDistrictIds]);
  const floodedZonesSet = useMemo(() => new Set(floodedZoneIds), [floodedZoneIds]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#f1f5f9] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl select-none flex flex-col min-h-0"
    >
      {/* 1. TOP STATUS OVERLAY */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-xs ${
              weatherMode === 'cyclone'
                ? 'bg-rose-500'
                : weatherMode === 'monsoon'
                ? 'bg-blue-600'
                : weatherMode === 'heavy_rain'
                ? 'bg-indigo-600'
                : 'bg-sky-500'
            }`}
          >
            {weatherMode === 'cyclone' ? (
              <Wind className="w-4 h-4 animate-spin" />
            ) : (
              <CloudRain className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="font-fun text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>
                {weatherMode === 'cyclone'
                  ? `Category ${cycloneCategory} Tropical Cyclone`
                  : weatherMode === 'monsoon'
                  ? `Monsoon Deluge (${rainMagnitudeMm} mm/day)`
                  : weatherMode === 'heavy_rain'
                  ? `Heavy Cloudburst (${rainMagnitudeMm} mm/day)`
                  : `Light Rainfall (${rainMagnitudeMm} mm/day)`}
              </span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                  dangerLevel === 'Catastrophic'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : dangerLevel === 'Severe'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : dangerLevel === 'Moderate'
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {dangerLevel} Risk
              </span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              ⚠️ {atRiskDistrictIds.length} of 64 Districts Alert · Surge/Depth: +{equivalentSurgeMeters}m
            </span>
          </div>
        </div>

        {/* Live Flooded Stat Badge */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2">
          <Waves className="w-4 h-4 text-[#0c445f]" />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Alert Area: </span>
            <span
              className={`font-mono font-bold ${
                atRiskDistrictIds.length > 25 ? 'text-rose-600' : 'text-[#0c445f]'
              }`}
            >
              {atRiskDistrictIds.length} Districts Alert
            </span>
          </div>
        </div>
      </div>

      {/* 2. ZOOM & RESET CONTROLS */}
      <div className="absolute right-3 top-16 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-md border border-slate-200 flex flex-col gap-1 z-30">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Map View"
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-amber-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. MAP LEGEND */}
      <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-slate-200 text-xs hidden sm:flex flex-col gap-1.5 z-30 max-w-[240px]">
        <div className="font-fun font-bold text-[11px] text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          Flood & Inundation Map Legend
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
            !
          </span>
          <span className="text-slate-800 font-bold">Flood Risk District Alert</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-3.5 h-3.5 rounded-full bg-[#0c445f] border border-sky-400 shrink-0 shadow-xs" />
          <span className="text-slate-700 font-bold">Ocean Inundation Water</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-3.5 h-3.5 rounded-full bg-[#15803d] shrink-0 shadow-xs" />
          <span className="text-slate-600">Safe Dry Elevations</span>
        </div>
      </div>

      {/* 4. MAIN MAP STAGE */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 w-full h-full min-h-0 min-w-0 cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden p-2"
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
          className="relative w-full h-full max-w-full max-h-full flex items-center justify-center"
        >
          <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
            {/* The Authentic Topographical Relief Map Image of Bangladesh */}
            <img
              src={bangladeshMapImg}
              alt="Authentic Topographical Relief Map of Bangladesh"
              className="max-w-full max-h-full object-contain filter drop-shadow-lg select-none pointer-events-none"
            />

            {/* SVG OVERLAY (Exact 896 x 1200 viewBox matching the relief map image) */}
            <svg
              viewBox="0 0 896 1200"
              className="absolute inset-0 w-full h-full max-w-full max-h-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Authentic Bay of Bengal Ocean Water Gradients */}
                <linearGradient id="rainOceanWater" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0a3950" stopOpacity="1" />
                  <stop offset="35%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="70%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0e4f6e" stopOpacity="0.98" />
                </linearGradient>

                <linearGradient id="rainDeepSubmersion" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#082b3d" stopOpacity="1" />
                  <stop offset="40%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0a3c54" stopOpacity="1" />
                </linearGradient>

                {/* Exclamation badge pulse glow */}
                <radialGradient id="alertBadgeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#dc2626" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ---------------- 1. FLOOD WATER LAYER (Turns flooded areas into deep ocean blue #0c445f) ---------------- */}
              <g className="rainfall-flood-water-layer">
                {/* Render flooded elevation zones only when actively flooded */}
                {USGS_ELEVATION_ZONES.map((zone) => {
                  const isZoneFlooded = floodedZonesSet.has(zone.id);
                  if (!isZoneFlooded) return null;

                  return (
                    <g key={`rain-flood-zone-${zone.id}`}>
                      {/* Pass 1: Broad border drowning stroke (submerges boundaries in solid ocean blue) */}
                      {zone.paths.map((p, i) => (
                        <path
                          key={`rain-drown-${zone.id}-${i}`}
                          d={p}
                          fill="#0c445f"
                          opacity={0.95}
                          stroke="#0c445f"
                          strokeWidth={22}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      ))}
                      {/* Pass 2: Deep ocean surface */}
                      {zone.paths.map((p, i) => (
                        <path
                          key={`rain-surf-${zone.id}-${i}`}
                          d={p}
                          fill="url(#rainOceanWater)"
                          opacity={0.96}
                          stroke="#0c445f"
                          strokeWidth={10}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      ))}
                    </g>
                  );
                })}

                {/* Highlight specific at-risk flood districts with blue flood surge overlay */}
                {/* Under Light Rain, atRiskSet is empty so 0 discs are drawn */}
                {/* Under Heavy Rain, shows a little flooding around affected valleys and mountain basins */}
                {BANGLADESH_CITIES.map((city) => {
                  const isAtRisk = atRiskSet.has(city.id);
                  if (!isAtRisk) return null;

                  const coords = getCityCoordinates(city.xPercent, city.yPercent);
                  const isMountainous = MOUNTAINOUS_DOWNPOUR_DISTRICTS.includes(city.id);
                  const radius = isMountainous && weatherMode === 'heavy_rain' ? 36 : city.isDivisionCapital ? 32 : 24;

                  return (
                    <g key={`district-surge-disc-${city.id}`}>
                      {/* Mountain valley downpour runoff pulse */}
                      {isMountainous && weatherMode === 'heavy_rain' && (
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={radius + 8}
                          fill="#0284c7"
                          fillOpacity={0.3}
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={radius}
                        fill="#0c445f"
                        fillOpacity={0.75}
                        stroke="#0c445f"
                        strokeWidth={5}
                      />
                    </g>
                  );
                })}
              </g>

              {/* ---------------- 2. CYCLONE RADAR VORTEX OVERLAY (When Cyclone Mode Active) ---------------- */}
              {weatherMode === 'cyclone' && (
                <g className="cyclone-storm-surge-overlay">
                  {/* Rotating Cyclonic Eye on Bay of Bengal */}
                  <g transform="translate(480, 1020)">
                    <circle cx="0" cy="0" r="140" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="12,12" opacity="0.6" className="animate-spin" />
                    <circle cx="0" cy="0" r="95" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8,8" opacity="0.7" />
                    <circle cx="0" cy="0" r="50" fill="none" stroke="#ef4444" strokeWidth="3.5" opacity="0.8" />
                    <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      EYE
                    </text>
                  </g>

                  {/* Surge Vector Arrows pushing into Southern Delta */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const startX = 280 + i * 55;
                    const startY = 1080;
                    return (
                      <g key={`surge-vector-${i}`}>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={startX + 15}
                          y2={startY - 65}
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          opacity="0.85"
                        />
                        <polygon
                          points={`${startX + 15},${startY - 70} ${startX + 10},${startY - 60} ${startX + 20},${startY - 60}`}
                          fill="#38bdf8"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ---------------- 3. RAIN PARTICLES OVERLAY (When Rain/Monsoon Active) ---------------- */}
              {weatherMode !== 'cyclone' && (
                <g className="rainfall-particles">
                  {Array.from({
                    length: weatherMode === 'monsoon' ? 140 : weatherMode === 'heavy_rain' ? 80 : 35
                  }).map((_, i) => {
                    const x = ((i * 67 + 31) % 760) + 70;
                    const y = ((i * 89 + 17) % 980) + 70;
                    const len = weatherMode === 'monsoon' ? 24 : weatherMode === 'heavy_rain' ? 16 : 8;
                    return (
                      <line
                        key={`rain-drop-${i}`}
                        x1={x}
                        y1={y}
                        x2={x - 3}
                        y2={y + len}
                        stroke="#38bdf8"
                        strokeWidth={weatherMode === 'monsoon' ? 1.8 : 1.2}
                        strokeOpacity={0.65}
                      />
                    );
                  })}
                </g>
              )}

              {/* ---------------- 4. 64 DISTRICTS PINS & SMALL EXCLAMATION ALERTS ---------------- */}
              <g className="districts-and-exclamation-alerts">
                {BANGLADESH_CITIES.map((city) => {
                  const isAtRisk = atRiskSet.has(city.id);
                  const isSelected = selectedDistrict?.id === city.id;
                  const coords = getCityCoordinates(city.xPercent, city.yPercent);

                  return (
                    <g
                      key={`district-marker-${city.id}`}
                      className="cursor-pointer pointer-events-auto transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDistrict(city);
                      }}
                    >
                      {/* IF DISTRICT IS AT RISK: RENDER THE SMALL EXCLAMATION BADGE! */}
                      {isAtRisk ? (
                        (() => {
                          const isMountainous = MOUNTAINOUS_DOWNPOUR_DISTRICTS.includes(city.id);
                          const isMountainDownpour = isMountainous && weatherMode === 'heavy_rain';
                          return (
                            <g transform={`translate(${coords.x}, ${coords.y})`}>
                              {/* Pulsing Ripple */}
                              <circle
                                cx="0"
                                cy="0"
                                r={isMountainDownpour ? 16 : 14}
                                fill={isMountainDownpour ? '#f59e0b' : '#ef4444'}
                                opacity="0.35"
                                className="animate-ping"
                              />
                              <circle
                                cx="0"
                                cy="0"
                                r={isMountainDownpour ? 12 : 11}
                                fill={isMountainDownpour ? '#d97706' : '#dc2626'}
                                stroke="#ffffff"
                                strokeWidth="2"
                                shadow-md="true"
                              />
                              {/* Exclamation Mark Text */}
                              <text
                                x="0"
                                y="4"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="11"
                                fontWeight="900"
                                fontFamily="sans-serif"
                              >
                                !
                              </text>

                              {/* District Name Label with Warning Highlight */}
                              <g transform="translate(14, 3)">
                                <rect
                                  x="-2"
                                  y="-10"
                                  width={city.name.length * (isMountainDownpour ? 6.2 : 5.8) + (isMountainDownpour ? 32 : 18)}
                                  height="13"
                                  rx="3"
                                  fill={isMountainDownpour ? '#78350f' : '#991b1b'}
                                  fillOpacity={0.94}
                                  stroke={isMountainDownpour ? '#fcd34d' : '#fca5a5'}
                                  strokeWidth="0.8"
                                />
                                <text
                                  x="2"
                                  y="-1"
                                  fill="#ffffff"
                                  fontSize="7.5"
                                  fontWeight="bold"
                                  fontFamily="sans-serif"
                                >
                                  {isMountainDownpour ? `🏔️ ${city.name} (Downpour)` : `⚠️ ${city.name}`}
                                </text>
                              </g>
                            </g>
                          );
                        })()
                      ) : (
                        /* Above-Water Safe District Pin */
                        <g transform={`translate(${coords.x}, ${coords.y})`}>
                          <circle
                            cx="0"
                            cy="0"
                            r={city.isDivisionCapital ? 4.5 : 3.2}
                            fill={city.isDivisionCapital ? '#0f172a' : '#334155'}
                            stroke="#ffffff"
                            strokeWidth={isSelected ? 2 : 1.2}
                          />
                          {/* District Label */}
                          <g transform="translate(6, 3)">
                            <rect
                              x="-1"
                              y="-9"
                              width={city.name.length * 5.4 + 14}
                              height="11"
                              rx="2.5"
                              fill="#ffffff"
                              fillOpacity={0.88}
                              stroke="#cbd5e1"
                              strokeWidth="0.5"
                            />
                            <text
                              x="2"
                              y="-1"
                              fill="#0f172a"
                              fontSize="6.5"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                            >
                              {city.name}
                            </text>
                          </g>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 5. SELECTED DISTRICT DETAIL ALERT POPUP */}
      {selectedDistrict && (
        <div className="absolute bottom-10 left-3 right-3 sm:left-auto sm:right-3 sm:w-84 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border-2 border-slate-200 z-30 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{selectedDistrict.name}</span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                {selectedDistrict.bnName}
              </span>
            </div>
            <button
              onClick={() => onSelectDistrict(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Division:</span>
              <strong className="text-slate-800">{selectedDistrict.division}</strong>
            </div>
            <div className="flex justify-between">
              <span>Ground Elevation:</span>
              <strong className="font-mono text-sky-800">{selectedDistrict.elevationMeters}m</strong>
            </div>
            <div className="flex justify-between">
              <span>Population:</span>
              <strong className="text-slate-800">{selectedDistrict.population.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Flood Threat Status:</span>
              {atRiskSet.has(selectedDistrict.id) ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  ⚠️ At High Risk of Flooding
                </span>
              ) : (
                <span className="text-emerald-600 font-bold">Safe & Above Surge</span>
              )}
            </div>
          </div>

          {atRiskSet.has(selectedDistrict.id) ? (
            <div className="mt-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 leading-snug">
              {weatherMode === 'heavy_rain' && MOUNTAINOUS_DOWNPOUR_DISTRICTS.includes(selectedDistrict.id) ? (
                <>
                  🏔️ <strong>Mountain Downpour & Landslide Hazard:</strong> Steep hill terrain cannot absorb sudden cloudburst downpours. High-velocity mountain runoff ('Pahari Dhol') triggers rapid flash floods in valleys and critical landslide/hill collapse hazards.
                </>
              ) : weatherMode === 'cyclone' ? (
                <>
                  🚨 <strong>Coastal Storm Surge Warning:</strong> Dangerous Bay of Bengal storm surge and saline flooding expected. Evacuate to elevated cyclone shelters.
                </>
              ) : (
                <>
                  🚨 <strong>Hydrological Inundation Alert:</strong> Elevated river crests and flash flood runoff expected across local valleys.
                </>
              )}
            </div>
          ) : weatherMode === 'light_rain' ? (
            <div className="mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
              ✅ <strong>Normal Safe Condition:</strong> Daily light rainfall (10–40 mm/day) is completely absorbed by agricultural soils and wetlands. 0% flood hazard.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
