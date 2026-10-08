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

  // Cyclone storm surge limit based on category
  // Barishal is at (446, 744) with 4.0m elevation
  // Cat 1 (1.5m surge): coastal wavefront at y=880 (well south of Barishal)
  // Cat 2 (2.4m surge): coastal wavefront at y=820 (south of Barishal)
  // Cat 3 (3.6m surge): coastal wavefront at y=770 (south of Barishal city)
  // Cat 4 (6.2m surge): coastal wavefront at y=725 (pushes inland to Barishal)
  // Cat 5 (8.6m surge): coastal wavefront at y=665 (deep delta inundation)
  const cycloneWavefrontY = useMemo(() => {
    if (cycloneCategory <= 1) return 880;
    if (cycloneCategory <= 2) return 820;
    if (cycloneCategory <= 3) return 770;
    if (cycloneCategory <= 4) return 725;
    return 665;
  }, [cycloneCategory]);

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
              <Wind className="w-4 h-4" />
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
        {weatherMode === 'heavy_rain' && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-4 h-4 rounded-full bg-sky-100 border border-sky-300 text-sky-700 text-[10px] flex items-center justify-center font-bold">
              💧
            </span>
            <span className="text-sky-800 font-semibold">Waterlogging (All Places)</span>
          </div>
        )}
        {weatherMode === 'cyclone' && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white shrink-0 shadow-xs" />
            <span className="text-rose-700 font-bold">Cyclonic Radar Eye & Eyewall</span>
          </div>
        )}
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

                {/* Cyclone storm surge mask - prevents premature flooding near Barisal (4m elevation) at Cat 1-3 */}
                <mask id="cycloneSurgeMask">
                  <rect x="0" y="0" width="896" height="1200" fill="black" />
                  {/* Coastal surge pushes from Bay of Bengal (y=1200) northward up to cycloneWavefrontY */}
                  <path
                    d={`M 0 1200 L 0 ${cycloneWavefrontY} C 260 ${cycloneWavefrontY - 30}, 440 ${cycloneWavefrontY - 20}, 620 ${cycloneWavefrontY - 25}, 896 ${cycloneWavefrontY} L 896 1200 Z`}
                    fill="white"
                  />
                  {/* Barishal city 4m elevation levee protection during Cat 1, 2, and 3 */}
                  {cycloneCategory <= 3 && (
                    <circle cx="446" cy="744" r="36" fill="black" />
                  )}
                </mask>

                {/* Radar eyewall gradient */}
                <radialGradient id="eyewallConvectionGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#ea580c" stopOpacity="0.8" />
                  <stop offset="85%" stopColor="#eab308" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ---------------- 1. FLOOD WATER LAYER (Turns flooded areas into deep ocean blue #0c445f) ---------------- */}
              <g className="rainfall-flood-water-layer">
                {/* A. Realistic coastal storm surge flood throughout the coast during Cyclone mode (slightly increased inland coastal wash) */}
                {weatherMode === 'cyclone' && (
                  <g className="cyclone-coastal-surge-throughout-coast">
                    {/* Base ocean storm surge wash along entire shoreline from Satkhira to Teknaf (slightly more inland flooding at the coast) */}
                    <path
                      d="M 150 1200 L 150 885 C 215 865, 280 875, 335 855 C 385 845, 445 850, 485 840 C 525 810, 580 795, 620 815 C 670 830, 705 895, 730 965 C 750 1025, 760 1095, 765 1200 Z"
                      fill="url(#rainOceanWater)"
                      opacity={
                        cycloneCategory <= 1
                          ? 0.76
                          : cycloneCategory <= 2
                          ? 0.84
                          : cycloneCategory <= 3
                          ? 0.90
                          : cycloneCategory <= 4
                          ? 0.96
                          : 0.99
                      }
                    />
                    {/* Coastal estuarine surge washes into river mouths & islands (Hatiya, Sandwip, Sundarbans, Bhola, Kutubdia) */}
                    <ellipse cx="640" cy="825" rx="48" ry="30" fill="url(#rainOceanWater)" opacity={0.75} />
                    <ellipse cx="530" cy="820" rx="44" ry="28" fill="url(#rainOceanWater)" opacity={0.75} />
                    <ellipse cx="440" cy="855" rx="52" ry="32" fill="url(#rainOceanWater)" opacity={0.78} />
                    <ellipse cx="310" cy="845" rx="56" ry="34" fill="url(#rainOceanWater)" opacity={0.78} />
                    <ellipse cx="710" cy="980" rx="36" ry="24" fill="url(#rainOceanWater)" opacity={0.72} />
                    <ellipse cx="230" cy="880" rx="45" ry="28" fill="url(#rainOceanWater)" opacity={0.74} />

                    {/* Dynamic tidal surge wavefront line hugging the entire coast */}
                    <path
                      d="M 150 885 C 215 865, 280 875, 335 855 C 385 845, 445 850, 485 840 C 525 810, 580 795, 620 815 C 670 830, 705 895, 730 965 C 750 1025, 760 1095, 765 1200"
                      fill="none"
                      stroke="#0c445f"
                      strokeWidth={
                        cycloneCategory <= 1
                          ? 16
                          : cycloneCategory <= 2
                          ? 24
                          : cycloneCategory <= 3
                          ? 32
                          : cycloneCategory <= 4
                          ? 42
                          : 52
                      }
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      opacity={0.94}
                    />
                    {/* Outer foaming breakers along the sea edge */}
                    <path
                      d="M 150 885 C 215 865, 280 875, 335 855 C 385 845, 445 850, 485 840 C 525 810, 580 795, 620 815 C 670 830, 705 895, 730 965 C 750 1025, 760 1095, 765 1200"
                      fill="none"
                      stroke="#7dd3fc"
                      strokeWidth={Math.max(3.2, cycloneCategory * 2.1)}
                      strokeDasharray="12 8"
                      opacity={0.88}
                    />
                  </g>
                )}

                {/* B. Render riverine flooded elevation zones strictly during Monsoon (NO flood showing in Heavy Rain) */}
                {weatherMode === 'monsoon' &&
                  USGS_ELEVATION_ZONES.map((zone) => {
                    const isZoneFlooded = floodedZonesSet.has(zone.id);
                    if (!isZoneFlooded) return null;

                    return (
                      <g key={`rain-flood-zone-${zone.id}`}>
                        {/* Border drowning stroke */}
                        {zone.paths.map((p, i) => (
                          <path
                            key={`rain-drown-${zone.id}-${i}`}
                            d={p}
                            fill="#0c445f"
                            opacity={0.92}
                            stroke="#0c445f"
                            strokeWidth={18}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        ))}
                        {/* Deep ocean surface */}
                        {zone.paths.map((p, i) => (
                          <path
                            key={`rain-surf-${zone.id}-${i}`}
                            d={p}
                            fill="url(#rainOceanWater)"
                            opacity={0.95}
                            stroke="#0c445f"
                            strokeWidth={8}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        ))}
                      </g>
                    );
                  })}
              </g>

              {/* ---------------- 2. REALISTIC CYCLONE RADAR VORTEX OVERLAY (When Cyclone Mode Active) ---------------- */}
              {weatherMode === 'cyclone' && (
                <g className="realistic-cyclone-vortex-overlay">
                  {/* Rotating Multi-Stage Cyclonic Radar Spiral Eye & Feeder Rainbands (Stationary, Crisp) */}
                  <g transform="translate(480, 1025)">
                    {/* Logarithmic Spiral Rainbands Curling Counter-Clockwise into Bay of Bengal Coast */}
                    <g style={{ transformOrigin: '0px 0px' }}>
                      {/* Feeder Band 1: Southwestern maritime spiral sweeping across Sundarbans & Khulna */}
                      <path
                        d="M -270 170 C -220 75, -130 0, -45 -15 C -15 -20, 30 -5, 20 25 C 10 55, -25 50, -35 25"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={12 + cycloneCategory * 2.5}
                        strokeLinecap="round"
                        opacity={0.55}
                      />
                      <path
                        d="M -270 170 C -220 75, -130 0, -45 -15 C -15 -20, 30 -5, 20 25 C 10 55, -25 50, -35 25"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth={5 + cycloneCategory * 1.5}
                        strokeLinecap="round"
                        opacity={0.72}
                      />

                      {/* Feeder Band 2: Southeastern maritime band sweeping towards Chattogram & Cox's Bazar */}
                      <path
                        d="M 270 130 C 190 25, 95 -40, 15 -25 C -18 -15, -28 10, -12 25 C 2 40, 38 25, 32 -5"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={11 + cycloneCategory * 2}
                        strokeLinecap="round"
                        opacity={0.55}
                      />
                      <path
                        d="M 270 130 C 190 25, 95 -40, 15 -25 C -18 -15, -28 10, -12 25 C 2 40, 38 25, 32 -5"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth={4.5 + cycloneCategory * 1.2}
                        strokeLinecap="round"
                        opacity={0.68}
                      />

                      {/* Feeder Band 3: Tight inner convective spiral wrapping into the eyewall */}
                      <path
                        d="M -150 65 C -115 -50, 12 -85, 85 -42 C 125 -10, 115 52, 52 62 C 12 72, -18 42, -8 12"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={14 + cycloneCategory * 2.2}
                        strokeLinecap="round"
                        opacity={0.6}
                      />
                      <path
                        d="M -150 65 C -115 -50, 12 -85, 85 -42 C 125 -10, 115 52, 52 62 C 12 72, -18 42, -8 12"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth={6 + cycloneCategory * 1.5}
                        strokeLinecap="round"
                        opacity={0.82}
                      />

                      {/* Feeder Band 4: Outer convective boundary arc */}
                      <path
                        d="M -330 110 C -270 -40, -125 -135, 45 -135 C 190 -135, 310 -55, 340 75"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth={5}
                        strokeDasharray="14,10"
                        opacity={0.48}
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Concentric Eyewall Convection Rings (Radar dBZ Reflectivity Scale) */}
                    {/* Ring 3: Outer convective margin */}
                    <circle
                      cx="0"
                      cy="0"
                      r={Math.max(10, 24 - cycloneCategory * 2.5) + 40}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeDasharray="10,8"
                      opacity="0.55"
                    />
                    {/* Ring 2: Moderate convection band (amber/orange) */}
                    <circle
                      cx="0"
                      cy="0"
                      r={Math.max(10, 24 - cycloneCategory * 2.5) + 24}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={cycloneCategory >= 3 ? 7 : 5}
                      opacity="0.75"
                    />
                    {/* Ring 1: Eyewall Convective Core (Crimson violent convection) */}
                    <circle
                      cx="0"
                      cy="0"
                      r={Math.max(10, 24 - cycloneCategory * 2.5) + 10}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth={cycloneCategory >= 4 ? 11 : 7}
                      opacity="0.9"
                    />

                    {/* Central Calm Cyclonic Eye (Dark barometric pressure minimum) */}
                    <circle
                      cx="0"
                      cy="0"
                      r={Math.max(10, 24 - cycloneCategory * 2.5)}
                      fill="#071b28"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                    />
                    <text
                      x="0"
                      y="-2"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={cycloneCategory >= 4 ? '7.5' : '8.5'}
                      fontWeight="bold"
                    >
                      CAT {cycloneCategory}
                    </text>
                    <text
                      x="0"
                      y="7"
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="6"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {cycloneCategory === 1
                        ? '990 hPa'
                        : cycloneCategory === 2
                        ? '975 hPa'
                        : cycloneCategory === 3
                        ? '950 hPa'
                        : cycloneCategory === 4
                        ? '920 hPa'
                        : '890 hPa'}
                    </text>
                  </g>

                  {/* Cyclonic Inflowing Wind Vector Streamlines */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i * 60) * (Math.PI / 180);
                    const rStart = 190;
                    const rEnd = 95;
                    const x1 = 480 + Math.cos(angle) * rStart;
                    const y1 = 1025 + Math.sin(angle) * (rStart * 0.7);
                    const x2 = 480 + Math.cos(angle + 0.5) * rEnd;
                    const y2 = 1025 + Math.sin(angle + 0.5) * (rEnd * 0.7);
                    return (
                      <g key={`cyclone-wind-streamline-${i}`}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="5,4"
                          opacity="0.75"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ---------------- 3. VERY SLIGHT ATMOSPHERIC RAIN & RIPPLES EFFECT ---------------- */}
              {/* Very slight atmospheric overcast tint across the map */}
              <rect
                x="0"
                y="0"
                width="896"
                height="1200"
                fill="#0369a1"
                opacity={
                  weatherMode === 'monsoon'
                    ? 0.05
                    : weatherMode === 'heavy_rain'
                    ? 0.04
                    : weatherMode === 'cyclone'
                    ? 0.03
                    : 0.02
                }
                pointerEvents="none"
              />

              {/* Gentle Falling Rain Streaks (VERY slight translucent diagonal rain lines) */}
              <g className="subtle-rain-streaks" pointerEvents="none">
                {Array.from({
                  length:
                    weatherMode === 'monsoon'
                      ? 110
                      : weatherMode === 'heavy_rain'
                      ? 75
                      : weatherMode === 'cyclone'
                      ? 85
                      : 40
                }).map((_, i) => {
                  const x = ((i * 73 + 37) % 760) + 70;
                  const y = ((i * 97 + 19) % 980) + 70;
                  const isCyclone = weatherMode === 'cyclone';
                  // Gentle slant: 3px horizontal for rain, 12px for wind-whipped cyclone squall
                  const dx = isCyclone ? -12 : -3;
                  const dy = isCyclone ? 12 : weatherMode === 'monsoon' ? 18 : weatherMode === 'heavy_rain' ? 14 : 9;
                  const op =
                    weatherMode === 'monsoon'
                      ? 0.28
                      : weatherMode === 'heavy_rain'
                      ? 0.24
                      : isCyclone
                      ? 0.25
                      : 0.18;

                  return (
                    <line
                      key={`subtle-rain-drop-${i}`}
                      x1={x}
                      y1={y}
                      x2={x + dx}
                      y2={y + dy}
                      stroke="#7dd3fc"
                      strokeWidth={weatherMode === 'monsoon' ? 1.4 : weatherMode === 'heavy_rain' ? 1.2 : 1.0}
                      strokeOpacity={op}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>

              {/* Very slight water surface micro-ripples on river mouths & water bodies */}
              <g className="subtle-water-ripples" pointerEvents="none">
                {[
                  { x: 480, y: 880 }, // Lower Meghna estuary
                  { x: 380, y: 920 }, // Tetulia / Sundarbans inlet
                  { x: 570, y: 840 }, // Sandwip channel
                  { x: 620, y: 380 }, // Sylhet haor waters
                  { x: 420, y: 780 }, // Lower Kirtankhola / Barishal channel
                  { x: 310, y: 880 }, // Pasur river mouth
                ].map((pt, idx) => (
                  <circle
                    key={`micro-ripple-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={weatherMode === 'monsoon' || weatherMode === 'heavy_rain' ? 8 : 6}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    opacity={weatherMode === 'light_rain' ? 0.15 : 0.22}
                  />
                ))}
              </g>

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
                      {/* IF DISTRICT IS AT RISK: RENDER EXCLAMATION BADGE (WITH LITTLE WATER CIRCLE IN HEAVY RAIN) */}
                      {isAtRisk ? (
                        (() => {
                          const isHeavyRain = weatherMode === 'heavy_rain';
                          return (
                            <g transform={`translate(${coords.x}, ${coords.y})`}>
                              {/* Little water circle around exclamations predicted to flood in heavy rain */}
                              {isHeavyRain ? (
                                <>
                                  {/* Outer water ripple circle */}
                                  <circle
                                    cx="0"
                                    cy="0"
                                    r={25}
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth={1.2}
                                    strokeDasharray="4 3"
                                    opacity={0.8}
                                  />
                                  {/* Mid water puddle circle */}
                                  <circle
                                    cx="0"
                                    cy="0"
                                    r={19}
                                    fill="#0284c7"
                                    fillOpacity={0.24}
                                    stroke="#38bdf8"
                                    strokeWidth={1.6}
                                  />
                                  {/* Inner water pool */}
                                  <circle
                                    cx="0"
                                    cy="0"
                                    r={13}
                                    fill="#38bdf8"
                                    fillOpacity={0.32}
                                    stroke="#7dd3fc"
                                    strokeWidth={1.2}
                                  />
                                </>
                              ) : (
                                <circle
                                  cx="0"
                                  cy="0"
                                  r={14}
                                  fill="#ef4444"
                                  opacity="0.25"
                                />
                              )}

                              <circle
                                cx="0"
                                cy="0"
                                r={isHeavyRain ? 9.5 : 11}
                                fill={isHeavyRain ? '#e11d48' : '#dc2626'}
                                stroke="#ffffff"
                                strokeWidth="1.8"
                              />
                              {/* Exclamation Mark Text */}
                              <text
                                x="0"
                                y="3.5"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="900"
                                fontFamily="sans-serif"
                              >
                                !
                              </text>

                              {/* District Name Label */}
                              <g transform="translate(14, 3)">
                                <rect
                                  x="-2"
                                  y="-10"
                                  width={isHeavyRain ? city.name.length * 5.8 + 62 : city.name.length * 6.2 + 20}
                                  height="13"
                                  rx="3"
                                  fill={isHeavyRain ? '#0369a1' : '#991b1b'}
                                  fillOpacity={0.94}
                                  stroke={isHeavyRain ? '#7dd3fc' : '#fca5a5'}
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
                                  {isHeavyRain ? `⚠️ ${city.name} (Predicted)` : `⚠️ ${city.name}`}
                                </text>
                              </g>
                            </g>
                          );
                        })()
                      ) : (
                        /* Standard clean district pin */
                        <g transform={`translate(${coords.x}, ${coords.y})`}>
                          <circle
                            cx="0"
                            cy="0"
                            r={city.isDivisionCapital ? 4.5 : 3.2}
                            fill={city.isDivisionCapital ? '#0369a1' : '#475569'}
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
                              fontWeight={city.isDivisionCapital ? 'bold' : 'normal'}
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
