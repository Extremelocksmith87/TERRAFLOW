import React, { useState, useMemo } from 'react';
import { BANGLADESH_CITIES, BangladeshCity } from '../data/bangladeshCitiesData';
import { USGS_ELEVATION_ZONES, UsgsElevationZone } from '../data/usgsElevationZones';
import bangladeshMapImg from '../assets/images/bangladesh_srtm_topography_1791130914468.jpg';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Users,
  Waves,
  AlertTriangle,
  ShieldCheck,
  Layers,
  MapPin,
  Info,
  Compass,
  FileText,
  Database,
  ExternalLink,
  X
} from 'lucide-react';

interface BangladeshSingleScreenMapProps {
  seaLevelMeters: number;
  iceMeltPercent: number;
  showPopulationOverlay: boolean;
  onTogglePopulationOverlay: () => void;
  floodedPercent: number;
  submergedCities: string[];
}

export const BangladeshSingleScreenMap: React.FC<BangladeshSingleScreenMapProps> = ({
  seaLevelMeters,
  iceMeltPercent,
  showPopulationOverlay,
  onTogglePopulationOverlay,
  floodedPercent,
  submergedCities
}) => {
  // Pan and Zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedCity, setSelectedCity] = useState<BangladeshCity | null>(null);
  const [cityFilter, setCityFilter] = useState<'all' | 'capitals' | 'submerged' | 'coastal'>('all');
  const [showUsgsElevation, setShowUsgsElevation] = useState(false);
  const [showUsgsReportModal, setShowUsgsReportModal] = useState(false);
  const [showSunkenCities, setShowSunkenCities] = useState(false);

  // Full submersion flag: when water reaches the highest peak (1,052m) or 100% of the land area
  const isFullySubmerged = seaLevelMeters >= 1052 || floodedPercent >= 99.9;

  // Filter cities to display
  const displayedCities = BANGLADESH_CITIES.filter((city) => {
    if (cityFilter === 'capitals') return city.isDivisionCapital;
    if (cityFilter === 'submerged') return city.elevationMeters <= seaLevelMeters;
    if (cityFilter === 'coastal') return city.category === 'coastal' || city.category === 'port';
    return true;
  });

  const currentlySubmergedCities = BANGLADESH_CITIES.filter(
    (c) => c.elevationMeters <= seaLevelMeters
  );

  // Calibrated gradual waterline Y (0m at y=1200 in the south, creeping northwards as seaLevel rises)
  // Grounded in Survey of Bangladesh (SoB) / IWM / CEGIS benchmark elevations:
  // Patuakhali (y=891) and Barishal (y=810) average 4.0m elevation:
  // At 2m, waterlineY = 910 (strictly south of Patuakhali and Barishal, leaving them dry!).
  // At 4m, waterlineY reaches 810 (submerging Patuakhali and reaching Barishal at 4.0m).
  // At 8m, waterlineY reaches 590 (submerging Dhaka Megacity at 8.0m).
  const waterlineY = useMemo(() => {
    if (isFullySubmerged || seaLevelMeters >= 1052) return 0;
    if (seaLevelMeters <= 0) return 1200;
    if (seaLevelMeters <= 1.0) {
      return 970 - seaLevelMeters * 40;
    } else if (seaLevelMeters <= 2.0) {
      const t = (seaLevelMeters - 1.0) / 1.0;
      return 930 - t * 20; // At 2m, y=910 (Patuakhali at y=891 & Barishal at y=810 remain completely safe!)
    } else if (seaLevelMeters <= 4.0) {
      const t = (seaLevelMeters - 2.0) / 2.0;
      return 910 - t * 100; // At 4m, reaches Barishal and Patuakhali (y=810)
    } else if (seaLevelMeters <= 8.0) {
      const t = (seaLevelMeters - 4.0) / 4.0;
      return 810 - t * 220; // At 8m, reaches Dhaka (y=590)
    } else if (seaLevelMeters <= 12.0) {
      const t = (seaLevelMeters - 8.0) / 4.0;
      return 590 - t * 100;
    } else if (seaLevelMeters <= 35.0) {
      const t = (seaLevelMeters - 12.0) / 23.0;
      return 490 - t * 210;
    } else if (seaLevelMeters <= 75.0) {
      const t = (seaLevelMeters - 35.0) / 40.0;
      return 280 - t * 180;
    } else {
      const t = (seaLevelMeters - 75.0) / (1052.0 - 75.0);
      return Math.max(0, 100 - t * 100);
    }
  }, [seaLevelMeters, isFullySubmerged]);

  // Mouse pan drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, .city-pin')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile / tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, .city-pin')) return;
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

  // Map viewbox: 896 x 1200
  // Convert city xPercent (0-100%) and yPercent (0-100%) to SVG map pixel coordinates
  const getCityCoordinates = (xPercent: number, yPercent: number) => {
    // Map bounds in the 896 x 1200 image
    const minX = 70;
    const maxX = 825;
    const minY = 60;
    const maxY = 1140;

    const x = minX + (xPercent / 100) * (maxX - minX);
    const y = minY + (yPercent / 100) * (maxY - minY);
    return { x, y };
  };

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl select-none flex flex-col min-h-0">
      {/* 1. TOP FLOATING MAP HEADER BAR */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30 gap-2">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2.5">
          <span className="text-xl">🇧🇩</span>
          <div>
            <h3 className="font-semibold text-xs text-slate-900 leading-tight">
              {showPopulationOverlay ? 'Bangladesh Demographic Density' : 'Bangladesh Topographical Elevation Map'}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {showPopulationOverlay
                ? 'Demographic Density: Dark Red · Red · White'
                : `Peak: 1,052m · ${currentlySubmergedCities.length}/${BANGLADESH_CITIES.length} Districts Flooded`}
            </span>
          </div>
        </div>

        {/* Live Flooded Stat Indicator & Ocean Status */}
        <div className="pointer-events-auto flex items-center gap-2">
          {isFullySubmerged && (
            <div className="bg-[#0c445f] text-white px-3 py-1.5 rounded-2xl shadow-lg border border-sky-400 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold">100% Land & Borders Submerged by Ocean</span>
              <button
                onClick={() => setShowSunkenCities(!showSunkenCities)}
                className="ml-1 text-[10px] px-2 py-0.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-400/50 transition-colors"
              >
                {showSunkenCities ? 'Hide Sunken Cities' : 'Show Sunken Cities'}
              </button>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2">
            <Waves className="w-4 h-4 text-sky-600" />
            <div className="text-xs">
              <span className="text-slate-500 font-medium">Flooded: </span>
              <span className={`font-mono font-bold ${floodedPercent > 40 ? 'text-rose-600' : 'text-sky-700'}`}>
                {floodedPercent.toFixed(1)}% (+{seaLevelMeters % 1 === 0 ? seaLevelMeters : seaLevelMeters.toFixed(1)}m)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LEFT CONTROL BAR */}
      <div className="absolute left-3 top-16 flex flex-col gap-2 z-30">
        {/* POPULATION MAP BUTTON */}
        <button
          onClick={onTogglePopulationOverlay}
          title={showPopulationOverlay ? 'Return to Flood Map' : 'Switch to Population Density Map (Dark Red, Red, White)'}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all shadow-md ${
            showPopulationOverlay
              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-300'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
          }`}
        >
          {showPopulationOverlay ? (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span>Show Flood Map</span>
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5 text-rose-600" />
              <span>See Population</span>
            </>
          )}
        </button>

        {/* USGS OFR 97-470H SCIENTIFIC ELEVATION LAYERS BUTTON */}
        <button
          onClick={() => setShowUsgsElevation(!showUsgsElevation)}
          title="Toggle USGS Open-File Report 97-470H scientific elevation zones"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all shadow-md ${
            showUsgsElevation
              ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>{showUsgsElevation ? 'Hide USGS Survey' : 'USGS OFR 97-470H'}</span>
        </button>

        {/* USGS SURVEY REPORT MODAL TRIGGER */}
        <button
          onClick={() => setShowUsgsReportModal(true)}
          title="View USGS OFR 97-470H Aeromagnetic & Elevation Survey Data"
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl text-[10px] font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs"
        >
          <FileText className="w-3 h-3 text-sky-600" />
          <span>USGS Survey Report</span>
        </button>

        {/* City Filter Pills */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-md border border-slate-200 flex flex-col gap-1 text-[10px] font-semibold text-slate-700">
          <span className="text-[9px] text-slate-400 uppercase text-center px-1 font-mono">Districts</span>
          <button
            onClick={() => setCityFilter('all')}
            className={`px-2 py-0.5 rounded-xl transition-colors ${
              cityFilter === 'all' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            All ({BANGLADESH_CITIES.length})
          </button>
          <button
            onClick={() => setCityFilter('capitals')}
            className={`px-2 py-0.5 rounded-xl transition-colors ${
              cityFilter === 'capitals' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            Divisions (8)
          </button>
          <button
            onClick={() => setCityFilter('submerged')}
            className={`px-2 py-0.5 rounded-xl transition-colors ${
              cityFilter === 'submerged' ? 'bg-rose-600 text-white' : 'hover:bg-rose-50 text-rose-700'
            }`}
          >
            Flooded ({currentlySubmergedCities.length})
          </button>
          <button
            onClick={() => setCityFilter('coastal')}
            className={`px-2 py-0.5 rounded-xl transition-colors ${
              cityFilter === 'coastal' ? 'bg-sky-600 text-white' : 'hover:bg-sky-50 text-sky-800'
            }`}
          >
            Coastal & Port
          </button>
        </div>

        {/* Zoom & Reset Buttons */}
        <div className="bg-white/95 rounded-2xl p-1 shadow-md border border-slate-200 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(3.5, z + 0.25))}
            title="Zoom In"
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.25))}
            title="Zoom Out"
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Reset Pan & Zoom"
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center border-t border-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
          </button>
        </div>
      </div>

      {/* 3. RIGHT LEGEND OVERLAY */}
      <div className="absolute right-3 top-16 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-slate-200 text-xs hidden md:flex flex-col gap-1.5 z-30 max-w-[210px]">
        {showPopulationOverlay ? (
          <>
            <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Users className="w-3 h-3 text-rose-600" />
              Demographic Density
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#881337] border border-[#4c0519] shrink-0 shadow-xs" />
              <span className="text-slate-800 font-bold">Dark Red: &gt;10k/km²</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-[#b91c1c] shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Red: Urban District Hubs</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#ffffff] border-2 border-slate-300 shrink-0 shadow-xs" />
              <span className="text-slate-600 font-medium">White: Rural & Reserves</span>
            </div>
          </>
        ) : showUsgsElevation ? (
          <>
            <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider mb-0.5 flex items-center justify-between">
              <span>USGS OFR 97-470H Zones</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4e342e] shrink-0" />
              <span className="text-slate-800 font-bold">&gt; 300m (High Ridges)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d84315] shrink-0" />
              <span className="text-slate-700 font-medium">75 - 300m (Hill Ranges)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef6c00] shrink-0" />
              <span className="text-slate-700 font-medium">30 - 75m (Terraces)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9e9d24] shrink-0" />
              <span className="text-slate-700 font-medium">10 - 30m (Plains/Fans)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#558b2f] shrink-0" />
              <span className="text-slate-700 font-medium">3 - 10m (Active Delta)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32] shrink-0" />
              <span className="text-slate-700 font-medium">0 - 3m (Sundarbans Coast)</span>
            </div>
          </>
        ) : (
          <>
            <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider mb-0.5">
              SRTM Topography & Flood
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#854d0e] shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">High Peaks (&gt;85m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#ca8a04] shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Terraces (15 - 85m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#15803d] shrink-0 shadow-xs" />
              <span className="text-slate-700 font-medium">Plains & Delta (&lt;15m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-[#0c445f] shrink-0 shadow-xs border border-sky-400" />
              <span className="text-slate-700 font-bold">Ocean (Bay of Bengal)</span>
            </div>
            <div className="pt-1 mt-0.5 border-t border-slate-200 text-[9px] text-slate-500 leading-tight">
              SoB &amp; IWM Benchmarks (Barishal &amp; Patuakhali: 4m MSL)
            </div>
          </>
        )}
      </div>

      {/* 4. MAIN INTERACTIVE MAP STAGE */}
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
          {/* THE SOLE REAL MAP OF BANGLADESH */}
          <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
            {/* Base Map Image */}
            <img
              src={bangladeshMapImg}
              alt="Authentic Topographical Relief Map of Bangladesh"
              className={`max-w-full max-h-full object-contain filter drop-shadow-lg select-none pointer-events-none transition-opacity duration-300 ${
                showPopulationOverlay ? 'opacity-25 grayscale brightness-110' : 'opacity-100'
              }`}
            />

            {/* SVG OVERLAY ON TOP OF THE MAP (Exact 896 x 1200 viewBox matching the map image) */}
            <svg
              viewBox="0 0 896 1200"
              className="absolute inset-0 w-full h-full max-w-full max-h-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Authentic Bay of Bengal Ocean Gradients */}
                {/* Base color #0c445f sampled directly from the Bay of Bengal ocean in the relief map */}
                <linearGradient id="oceanWater" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0a3950" stopOpacity="1" />
                  <stop offset="35%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="70%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0e4f6e" stopOpacity="0.98" />
                </linearGradient>

                {/* Deep oceanic trench for fully submerged land */}
                <linearGradient id="oceanDeepSubmersion" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#082b3d" stopOpacity="1" />
                  <stop offset="40%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0a3c54" stopOpacity="1" />
                </linearGradient>

                {/* Bay of Bengal coastal surge gradient */}
                <radialGradient id="bayOfBengalCoastalSurge" cx="45%" cy="85%" r="70%">
                  <stop offset="0%" stopColor="#0c445f" stopOpacity="1" />
                  <stop offset="45%" stopColor="#0c445f" stopOpacity="0.98" />
                  <stop offset="85%" stopColor="#0e4e6d" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#115576" stopOpacity="0.85" />
                </radialGradient>

                {/* Megacity Dhaka density gradient */}
                <radialGradient id="dhakaDensityGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4c0519" stopOpacity="1" />
                  <stop offset="45%" stopColor="#881337" stopOpacity="0.95" />
                  <stop offset="85%" stopColor="#be123c" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.15" />
                </radialGradient>

                {/* Port Chattogram density gradient */}
                <radialGradient id="chattogramDensityGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4c0519" stopOpacity="1" />
                  <stop offset="45%" stopColor="#881337" stopOpacity="0.95" />
                  <stop offset="85%" stopColor="#be123c" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.15" />
                </radialGradient>
                {/* Shoreline feather gradient for gradual waterline advancement */}
                <linearGradient id="waterlineFeather" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </linearGradient>

                {/* Gradual sea level waterline mask: enforces gradual northward inundation from Bay of Bengal */}
                <mask id="gradualSeaLevelMask">
                  <rect x="0" y="0" width="896" height="1200" fill="black" />
                  {isFullySubmerged ? (
                    <rect x="0" y="0" width="896" height="1200" fill="white" />
                  ) : seaLevelMeters > 0 ? (
                    <>
                      <rect
                        x="0"
                        y={waterlineY}
                        width="896"
                        height={Math.max(0, 1200 - waterlineY)}
                        fill="white"
                      />
                      <rect
                        x="0"
                        y={Math.max(0, waterlineY - 28)}
                        width="896"
                        height="28"
                        fill="url(#waterlineFeather)"
                      />
                    </>
                  ) : null}
                </mask>
              </defs>

              {/* ---------------- SCIENTIFIC USGS ELEVATION & WATER SIMULATION LAYER ---------------- */}
              {/* Uses exact USGS Open-File Report 97-470H digitized polygon boundaries */}
              {!showPopulationOverlay && (
                <g className="usgs-elevation-and-water-layer">
                  {/* 1. USGS Scientific Elevation Contours (When toggled on) */}
                  {showUsgsElevation && (
                    <g className="usgs-survey-contours">
                      {USGS_ELEVATION_ZONES.map((zone) => (
                        <g key={`survey-zone-${zone.id}`}>
                          {zone.paths.map((p, i) => (
                            <path
                              key={`zone-poly-${zone.id}-${i}`}
                              d={p}
                              fill={zone.color}
                              fillOpacity={0.65}
                              stroke="#ffffff"
                              strokeWidth={0.75}
                              strokeOpacity={0.7}
                            />
                          ))}
                        </g>
                      ))}
                    </g>
                  )}

                  {/* 2. Authentic Bay of Bengal Ocean Water Layer */}
                  {seaLevelMeters > 0 && (
                    <g className="scientific-flood-water" mask="url(#gradualSeaLevelMask)">
                      {/* Pass 1: Border Drowning Layer - Scaled realistically with authentic flood depth */}
                      {USGS_ELEVATION_ZONES.map((zone) => {
                        if (seaLevelMeters < zone.minMeters) return null;
                        const span = Math.max(0.1, zone.maxMeters - zone.minMeters);
                        const progress = Math.min(1.0, Math.max(0, (seaLevelMeters - zone.minMeters) / span));

                        let borderOpacity = 0.05;
                        let borderStrokeWidth = 1;

                        if (isFullySubmerged) {
                          borderOpacity = 1.0;
                          borderStrokeWidth = 34;
                        } else if (zone.id === '0-3') {
                          if (seaLevelMeters <= 0.3) {
                            borderOpacity = Math.max(0.04, progress * 0.4);
                            borderStrokeWidth = Math.max(0.5, progress * 4);
                          } else if (seaLevelMeters <= 1.0) {
                            const t = (seaLevelMeters - 0.3) / 0.7;
                            borderOpacity = 0.15 + t * 0.40;
                            borderStrokeWidth = 1.5 + t * 6.5;
                          } else if (seaLevelMeters <= 3.0) {
                            const t = (seaLevelMeters - 1.0) / 2.0;
                            borderOpacity = 0.55 + t * 0.40;
                            borderStrokeWidth = 8 + t * 12;
                          } else {
                            borderOpacity = 0.98;
                            borderStrokeWidth = 22;
                          }
                        } else {
                          borderOpacity = Math.min(0.98, 0.30 + progress * 0.68);
                          borderStrokeWidth = Math.min(24, 3 + progress * 19);
                        }

                        return (
                          <g key={`flood-border-drown-${zone.id}`}>
                            {zone.paths.map((p, i) => (
                              <path
                                key={`flood-border-${zone.id}-${i}`}
                                d={p}
                                fill="#0c445f"
                                opacity={borderOpacity}
                                stroke="#0c445f"
                                strokeWidth={borderStrokeWidth}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />
                            ))}
                          </g>
                        );
                      })}

                      {/* Pass 2: Ocean Surface Inundation Layer - Realistic deep ocean water matching the Bay of Bengal */}
                      {USGS_ELEVATION_ZONES.map((zone) => {
                        if (seaLevelMeters < zone.minMeters) return null;
                        const span = Math.max(0.1, zone.maxMeters - zone.minMeters);
                        const progress = Math.min(1.0, Math.max(0, (seaLevelMeters - zone.minMeters) / span));

                        let surfaceOpacity = 0.05;
                        let strokeW = 1;

                        if (isFullySubmerged) {
                          surfaceOpacity = 1.0;
                          strokeW = 16;
                        } else if (zone.id === '0-3') {
                          // Calibrated for low sea levels: at 0.1m, only outer coastal mudflats are subtly wetted, not whole country!
                          if (seaLevelMeters <= 0.3) {
                            surfaceOpacity = Math.max(0.03, Math.pow(progress, 1.4) * 0.85);
                            strokeW = Math.max(0.5, progress * 3);
                          } else if (seaLevelMeters <= 1.0) {
                            const t = (seaLevelMeters - 0.3) / 0.7;
                            surfaceOpacity = 0.14 + t * 0.32; // 0.5m -> ~0.23, 1m -> ~0.46
                            strokeW = 1.5 + t * 4.5;
                          } else if (seaLevelMeters <= 3.0) {
                            const t = (seaLevelMeters - 1.0) / 2.0;
                            surfaceOpacity = 0.46 + t * 0.50; // 2m -> ~0.71, 3m -> ~0.96
                            strokeW = 6 + t * 8;
                          } else {
                            surfaceOpacity = 0.98;
                            strokeW = 14;
                          }
                        } else {
                          surfaceOpacity = Math.min(0.98, 0.25 + progress * 0.73);
                          strokeW = Math.min(14, 2 + progress * 10);
                        }

                        const fillGrad = progress > 0.5 ? "url(#oceanDeepSubmersion)" : "url(#oceanWater)";

                        return (
                          <g key={`flood-zone-${zone.id}`}>
                            {zone.paths.map((p, i) => (
                              <path
                                key={`flood-poly-${zone.id}-${i}`}
                                d={p}
                                fill={fillGrad}
                                opacity={surfaceOpacity}
                                stroke="#0c445f"
                                strokeWidth={strokeW}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />
                            ))}
                          </g>
                        );
                      })}

                      {/* TOTAL OCEAN BLANKET: Fully drowns every meter of land, borders, rivers, and topography */}
                      {isFullySubmerged && (
                        <g className="total-ocean-blanket">
                          {/* Pass 1: Broad border drowning stroke (submerges outer international boundary lines completely) */}
                          {USGS_ELEVATION_ZONES.map((zone) =>
                            zone.paths.map((p, i) => (
                              <path
                                key={`ocean-border-drown-${zone.id}-${i}`}
                                d={p}
                                fill="#0c445f"
                                opacity={1.0}
                                stroke="#0c445f"
                                strokeWidth={36}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />
                            ))
                          )}
                          {/* Pass 2: Solid seamless ocean blue surface matching the Bay of Bengal */}
                          {USGS_ELEVATION_ZONES.map((zone) =>
                            zone.paths.map((p, i) => (
                              <path
                                key={`ocean-surface-${zone.id}-${i}`}
                                d={p}
                                fill="url(#oceanDeepSubmersion)"
                                opacity={1.0}
                                stroke="#0c445f"
                                strokeWidth={12}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />
                            ))
                          )}
                        </g>
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* ---------------- POPULATION DISLOCATED MODE ---------------- */}
              {/* When active, completely dislocates from flood terrain: Dark Red, Red, and White */}
              {showPopulationOverlay && (
                <g className="population-density-layer">
                  {/* Clean White Backdrop for Rural & Protected Low Density Regions (<1500 / km²) */}
                  <rect
                    x="80"
                    y="70"
                    width="740"
                    height="1060"
                    fill="#ffffff"
                    fillOpacity="0.94"
                    rx="40"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />

                  {/* DARK RED CORE 1: Greater Dhaka Megacity (22.4M people, >25,000/km²) */}
                  <circle cx="458" cy="580" r="70" fill="url(#dhakaDensityGlow)" />
                  <circle cx="458" cy="580" r="38" fill="#4c0519" stroke="#fda4af" strokeWidth="2" />
                  <text x="458" y="585" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    DHAKA (22.4M)
                  </text>

                  {/* DARK RED CORE 2: Chattogram Industrial & Port Conurbation (5.3M people) */}
                  <circle cx="628" cy="815" r="50" fill="url(#chattogramDensityGlow)" />
                  <circle cx="628" cy="815" r="28" fill="#4c0519" stroke="#fda4af" strokeWidth="1.5" />
                  <text x="628" y="819" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    CHATTOGRAM (5.3M)
                  </text>

                  {/* RED REGIONAL URBAN HUBS (1,500 - 10,000 / km²) */}
                  {/* Sylhet Metropolitan */}
                  <circle cx="598" cy="405" r="30" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="598" y="409" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Sylhet</text>

                  {/* Rajshahi Metropolitan */}
                  <circle cx="270" cy="515" r="28" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="270" y="519" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Rajshahi</text>

                  {/* Khulna Industrial Belt */}
                  <circle cx="356" cy="780" r="30" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="356" y="784" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Khulna</text>

                  {/* Barishal Delta Hub */}
                  <circle cx="443" cy="795" r="26" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="443" y="799" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Barishal</text>

                  {/* Rangpur Hub */}
                  <circle cx="304" cy="275" r="26" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="304" y="279" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Rangpur</text>

                  {/* Mymensingh Hub */}
                  <circle cx="455" cy="410" r="26" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="455" y="414" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Mymensingh</text>

                  {/* Cumilla Hub */}
                  <circle cx="538" cy="628" r="24" fill="#ef4444" fillOpacity="0.88" stroke="#991b1b" strokeWidth="1.5" />
                  <text x="538" y="632" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Cumilla</text>
                </g>
              )}

              {/* ---------------- REALISTIC CITIES AND DISTRICTS PINS ---------------- */}
              {/* When fully submerged, hide pins by default unless user toggles showSunkenCities */}
              {(!isFullySubmerged || showSunkenCities) && (
                <g className="cities-layer">
                  {displayedCities.map((city) => {
                    const isSubmerged = city.elevationMeters <= seaLevelMeters;
                    const isSelected = selectedCity?.id === city.id;
                    const coords = getCityCoordinates(city.xPercent, city.yPercent);

                    // If city is submerged underwater
                    if (isSubmerged) {
                      return (
                        <g
                          key={city.id}
                          className="city-pin cursor-pointer pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCity(city);
                          }}
                        >
                          {/* Sunken Anchor / Underwater Marker */}
                          <circle
                            cx={coords.x}
                            cy={coords.y}
                            r={isSelected ? 4 : 2.5}
                            fill="#062231"
                            stroke="#38bdf8"
                            strokeWidth={1}
                            opacity={0.8}
                          />
                          {/* Underwater depth tag */}
                          <g transform={`translate(${coords.x + 4}, ${coords.y + 2})`}>
                            <rect
                              x="0"
                              y="-7"
                              width={city.name.length * 4.6 + 14}
                              height="9"
                              rx="2"
                              fill="#041a26"
                              fillOpacity={0.85}
                              stroke="#0c445f"
                              strokeWidth="0.5"
                            />
                            <text
                              x="2"
                              y="0"
                              fill="#7dd3fc"
                              fontSize="5.5"
                              fontWeight="medium"
                              fontFamily="sans-serif"
                            >
                              ⚓ {city.name} -{((Math.max(0, seaLevelMeters - city.elevationMeters)) % 1 === 0 ? Math.max(0, seaLevelMeters - city.elevationMeters) : (Math.max(0, seaLevelMeters - city.elevationMeters)).toFixed(1))}m
                            </text>
                          </g>
                        </g>
                      );
                    }

                    // Above-water safe city marker
                    return (
                      <g
                        key={city.id}
                        className="city-pin cursor-pointer pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCity(city);
                        }}
                      >
                        {/* Pin Marker */}
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={isSelected ? 5.5 : city.isDivisionCapital ? 4.5 : 3.5}
                          fill={
                            showPopulationOverlay
                              ? city.category === 'megacity'
                                ? '#4c0519'
                                : '#ef4444'
                              : city.isDivisionCapital
                              ? '#0f172a'
                              : '#334155'
                          }
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2 : 1.2}
                        />

                        {/* City Name Label */}
                        <g transform={`translate(${coords.x + 6}, ${coords.y + 3})`}>
                          <rect
                            x="-1"
                            y="-9"
                            width={city.name.length * 5.8 + 18}
                            height="12"
                            rx="3"
                            fill={city.isDivisionCapital ? '#0f172a' : '#ffffff'}
                            fillOpacity={city.isDivisionCapital ? 0.92 : 0.88}
                            stroke={city.isDivisionCapital ? '#94a3b8' : '#cbd5e1'}
                            strokeWidth="0.6"
                          />
                          <text
                            x="3"
                            y="0"
                            fill={city.isDivisionCapital ? '#ffffff' : '#0f172a'}
                            fontSize="7"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            {city.name} {city.elevationMeters}m
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* 5. SELECTED CITY DETAIL POPUP CARD */}
      {selectedCity && (
        <div className="absolute bottom-10 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200 z-30 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{selectedCity.name}</span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                {selectedCity.bnName}
              </span>
            </div>
            <button
              onClick={() => setSelectedCity(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>Division: <strong>{selectedCity.division}</strong></div>
            <div>Elevation: <strong className="font-mono text-sky-800">{selectedCity.elevationMeters}m</strong></div>
            <div>Population: <strong>{selectedCity.population.toLocaleString()}</strong></div>
            <div>
              Status:{' '}
              {selectedCity.elevationMeters <= seaLevelMeters ? (
                <strong className="text-rose-600">🌊 Submerged</strong>
              ) : (
                <strong className="text-emerald-700">✓ Dry & Safe</strong>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM STATUS BAR */}
      <div className="px-3 py-1 bg-white/95 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <strong className="text-slate-800">Map Data:</strong>
          <span>USGS OFR 97-470H Elevation (GSB) & SRTM High-Res Topography</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUsgsReportModal(true)}
            className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1"
          >
            <Database className="w-3 h-3 text-amber-600" />
            <span>USGS 97-470H Aeromagnetic & Elevation Data</span>
          </button>

          {currentlySubmergedCities.length > 0 ? (
            <span className="flex items-center gap-1 text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-xl border border-rose-300 text-[10px]">
              <AlertTriangle className="w-3 h-3" />
              {currentlySubmergedCities.length} Districts Flooded
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-xl border border-emerald-300 text-[10px]">
              <ShieldCheck className="w-3 h-3" />
              All Districts Dry
            </span>
          )}
        </div>
      </div>

      {/* 7. USGS OPEN-FILE REPORT 97-470H TECHNICAL MODAL */}
      {showUsgsReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border-2 border-slate-200 flex flex-col max-h-[90vh] overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    USGS Open-File Report 97-470H
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Digital Geologic and Geophysical Data of Bangladesh · U.S. Geological Survey & GSB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUsgsReportModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
              {/* Publication Banner */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">USGS Publication Reference:</div>
                  <div className="text-[11px] text-slate-500 font-mono">USGS OFR 97-470H (World Energy Project)</div>
                </div>
                <a
                  href="https://pubs.usgs.gov/publication/ofr97470H"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  <span>USGS Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* 1. Aeromagnetic Map Section */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Compass className="w-4 h-4 text-sky-600" />
                  1. Aeromagnetic Survey Map (<code className="font-mono text-amber-700">B_MAGNG.SHP</code>)
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  USGS Open-File Report 97-470H includes the nationwide <strong>Aeromagnetic Anomaly Map of Bangladesh</strong>, compiled in partnership with the Geological Survey of Bangladesh (GSB). It measures total magnetic intensity in <strong>nanoTeslas (nT)</strong>, with anomaly contour values ranging from <strong>450 nT to 1,400 nT</strong>.
                </p>
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-[11px] text-amber-900 space-y-1">
                  <div><strong>Why Aeromagnetic Data Matters:</strong> The surface of Bangladesh is covered by massive fluvial river silt and delta sediments up to 15–20 kilometers deep. Aeromagnetic sensors flown by aircraft pierce through the surface sedimentary cover to detect the deep crystalline basement rock, revealing buried fault zones, basement ridges, and tectonic shelf slopes.</div>
                </div>
              </div>

              {/* 2. Elevation Hypsometric Map Section */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  2. Elevation Polygon Model (<code className="font-mono text-emerald-700">ELEVG.SHP</code>)
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  The elevation theme in OFR 97-470H was surveyed by the Geological Survey of Bangladesh and classified into <strong>6 official hypsometric zones</strong> spanning 47 distinct polygons:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2e7d32] shrink-0" />
                    <div><strong>0 - 3 meters:</strong> Sundarbans & Coastal Delta</div>
                  </div>
                  <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#558b2f] shrink-0" />
                    <div><strong>3 - 10 meters:</strong> Active Delta & River Basins</div>
                  </div>
                  <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#9e9d24] shrink-0" />
                    <div><strong>10 - 30 meters:</strong> Central Terraces & Tista Plain</div>
                  </div>
                  <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ef6c00] shrink-0" />
                    <div><strong>30 - 75 meters:</strong> Barind & Madhupur Tracts</div>
                  </div>
                  <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#d84315] shrink-0" />
                    <div><strong>75 - 300 meters:</strong> Sylhet & Chittagong Hills</div>
                  </div>
                  <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#4e342e] shrink-0" />
                    <div><strong>&gt; 300 meters:</strong> High Strike Ridges (Peak 1,052m)</div>
                  </div>
                </div>
              </div>

              {/* 3. Implementation in this Application */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  3. Exact Topographical Comparison & Inundation Calibration
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  We downloaded and decompressed the binary shapefiles (<code className="font-mono">ELEVG.SHP</code> and <code className="font-mono">ELEVG.DBF</code>) directly from the USGS archive, projected all 47 polygons to the geographic bounding box of Bangladesh (88.04°E–92.67°E, 20.74°N–26.62°N), and mapped them onto the high-resolution SRTM relief map.
                </p>
                <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100 text-[11px] text-sky-900">
                  <strong>Water Simulation Integration:</strong> As you raise the Sea Level slider, the simulator floods each USGS polygon bracket progressively. The coastal delta (0-3m) floods first, followed by the active delta (3-10m), central floodplains (10-30m), and Pleistocene terraces (30-75m), matching GSB/USGS scientific boundaries.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowUsgsElevation(true);
                  setShowUsgsReportModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Show USGS Survey Contours on Map</span>
              </button>
              <button
                onClick={() => setShowUsgsReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
