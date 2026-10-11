import React, { useState, useRef, useMemo, useEffect } from 'react';
import bangladeshMapImg from '../assets/images/bangladesh_srtm_topography_1791130914468.jpg';
import { BANGLADESH_CITIES, BangladeshCity } from '../data/bangladeshCitiesData';
import { USGS_ELEVATION_ZONES } from '../data/usgsElevationZones';
import {
  WeatherMode,
  MOUNTAINOUS_DOWNPOUR_DISTRICTS,
  RESEARCHED_CYCLONE_CATEGORY_DATA
} from '../data/rainfallCycloneData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  CloudRain,
  Wind,
  Layers,
  MapPin,
  Waves,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Compass,
  X
} from 'lucide-react';

export interface CycloneSpiralArm {
  ribbonPath: string;
  radarEchoPath: string;
  rainbandPath: string;
}

// Generates realistic counter-clockwise meteorological spiral arms
export function generateCycloneSpiralArms(radius: number, numArms = 4): CycloneSpiralArm[] {
  const arms: CycloneSpiralArm[] = [];
  const eyeRadius = Math.max(16, radius * 0.08);
  const maxTurns = 2.4 * Math.PI; // ~1.2 revolutions

  for (let a = 0; a < numArms; a++) {
    const angleOffset = (a * 2 * Math.PI) / numArms;
    const outerPoints: [number, number][] = [];
    const innerPoints: [number, number][] = [];
    const centerPoints: [number, number][] = [];

    const steps = 32;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const theta = t * maxTurns;
      // Exponential power curve for realistic cyclonic curvature
      const r = eyeRadius + (radius - eyeRadius) * Math.pow(t, 1.25);
      // Counter-clockwise angle in Northern Hemisphere
      const phi = angleOffset - theta;

      const cx = r * Math.cos(phi);
      const cy = r * Math.sin(phi);
      centerPoints.push([cx, cy]);

      // Tapering ribbon width: thick near eyewall, slender at tip
      const armWidth = Math.max(3, (1 - t * 0.78) * (radius * 0.085));

      const nx = -Math.sin(phi);
      const ny = Math.cos(phi);

      outerPoints.push([cx + nx * armWidth * 0.5, cy + ny * armWidth * 0.5]);
      innerPoints.push([cx - nx * armWidth * 0.5, cy - ny * armWidth * 0.5]);
    }

    const ribbonPath = [
      ...outerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)}`),
      ...innerPoints.reverse().map((p) => `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`),
      'Z'
    ].join(' ');

    const rainbandPath = centerPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      .join(' ');

    const radarEchoPoints = centerPoints.slice(0, Math.floor(steps * 0.62));
    const radarEchoPath = radarEchoPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      .join(' ');

    arms.push({ ribbonPath, radarEchoPath, rainbandPath });
  }

  return arms;
}

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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSurveyContours, setShowSurveyContours] = useState(false);
  const [isResearchedTabOpen, setIsResearchedTabOpen] = useState(false);

  // Real researched cyclone empirical data based on category magnitude
  const researchedCyclone = useMemo(() => {
    const cat = Math.max(1, Math.min(5, Math.round(cycloneCategory)));
    return RESEARCHED_CYCLONE_CATEGORY_DATA[cat] || RESEARCHED_CYCLONE_CATEGORY_DATA[3];
  }, [cycloneCategory]);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Cyclone direct cursor tracking & movable state
  const [cycloneCenter, setCycloneCenter] = useState<{ x: number; y: number }>({ x: 455, y: 845 });
  const [isDraggingCyclone, setIsDraggingCyclone] = useState(false);
  const isDraggingCycloneRef = useRef(false);
  const [cycloneCursorMode, setCycloneCursorMode] = useState<'move_cyclone' | 'pan_map'>('move_cyclone');

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(3.5, prev + 0.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.7, prev - 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const hasDraggedRef = useRef(false);

  // Convert screen client coordinates to SVG 896x1200 viewBox coordinates accurately
  const updateCycloneFromClientCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current || containerRef.current?.querySelector('svg');
    if (!svg) return;
    try {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const svgP = pt.matrixTransform(ctm.inverse());
        if (svgP && !isNaN(svgP.x) && !isNaN(svgP.y)) {
          const clampedX = Math.round(Math.max(60, Math.min(840, svgP.x)));
          const clampedY = Math.round(Math.max(80, Math.min(1150, svgP.y)));
          setCycloneCenter({ x: clampedX, y: clampedY });
        }
      }
    } catch {
      // Ignore
    }
  };

  // Global window listeners for ultra-smooth 60fps cyclone dragging across any window boundary
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingCycloneRef.current) {
        updateCycloneFromClientCoords(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingCycloneRef.current) {
        isDraggingCycloneRef.current = false;
        setIsDraggingCyclone(false);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDraggingCycloneRef.current && e.touches.length === 1) {
        updateCycloneFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDraggingCycloneRef.current) {
        isDraggingCycloneRef.current = false;
        setIsDraggingCyclone(false);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  // Drag pan & cyclone move handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (weatherMode === 'cyclone' && cycloneCursorMode === 'move_cyclone') {
      setIsDraggingCyclone(true);
      isDraggingCycloneRef.current = true;
      hasDraggedRef.current = false;
      updateCycloneFromClientCoords(e.clientX, e.clientY);
      return;
    }
    setIsDragging(true);
    hasDraggedRef.current = false;
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCycloneRef.current) {
      hasDraggedRef.current = true;
      updateCycloneFromClientCoords(e.clientX, e.clientY);
      return;
    }
    if (!isDragging) return;
    hasDraggedRef.current = true;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    if (isDraggingCycloneRef.current) {
      isDraggingCycloneRef.current = false;
      setIsDraggingCyclone(false);
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (weatherMode === 'cyclone' && cycloneCursorMode === 'move_cyclone') {
        setIsDraggingCyclone(true);
        isDraggingCycloneRef.current = true;
        hasDraggedRef.current = false;
        updateCycloneFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
        return;
      }
      setIsDragging(true);
      hasDraggedRef.current = false;
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingCycloneRef.current && e.touches.length === 1) {
      hasDraggedRef.current = true;
      updateCycloneFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
      return;
    }
    if (!isDragging || e.touches.length !== 1) return;
    hasDraggedRef.current = true;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const handleTouchEnd = () => {
    if (isDraggingCycloneRef.current) {
      isDraggingCycloneRef.current = false;
      setIsDraggingCyclone(false);
    }
    setIsDragging(false);
  };

  // Dedicated mousedown/touchstart on cyclone eye handle
  const handleCycloneEyeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingCyclone(true);
    isDraggingCycloneRef.current = true;
    hasDraggedRef.current = false;
  };

  const handleCycloneEyeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDraggingCyclone(true);
    isDraggingCycloneRef.current = true;
    hasDraggedRef.current = false;
  };

  // Click on SVG map to reposition cyclone center in cyclone mode
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement | SVGRectElement>) => {
    if (weatherMode !== 'cyclone') return;
    updateCycloneFromClientCoords(e.clientX, e.clientY);
  };

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


  // Cyclone radius dynamically scaling with Category (Cat 1: 208px to Cat 5: 440px)
  const cycloneRadius = useMemo(() => {
    const cat = Math.max(1, Math.min(5, Math.round(cycloneCategory)));
    return 150 + cat * 58;
  }, [cycloneCategory]);

  // Floods exactly 1/10th of cyclone radius on the map
  const cycloneFloodRadius = useMemo(() => {
    return cycloneRadius / 10;
  }, [cycloneRadius]);

  // Meteorological rotating spiral arms
  const cycloneArms = useMemo(() => {
    return generateCycloneSpiralArms(cycloneRadius, 4);
  }, [cycloneRadius]);

  // Devastation levels for all districts: 'big' | 'medium' | 'small' | 'safe'
  const districtCycloneImpact = useMemo(() => {
    const map = new Map<
      string,
      {
        devastation: 'big' | 'medium' | 'small' | 'safe';
        dist: number;
        description: string;
      }
    >();

    if (weatherMode !== 'cyclone') return map;

    BANGLADESH_CITIES.forEach((city) => {
      const coords = getCityCoordinates(city.xPercent, city.yPercent);
      const dist = Math.hypot(coords.x - cycloneCenter.x, coords.y - cycloneCenter.y);

      const isBarishal = city.id === 'barishal';
      const isCoastalDistrict = [
        'bhola',
        'patuakhali',
        'barguna',
        'pirojpur',
        'jhalokathi',
        'bagerhat',
        'satkhira',
        'khulna',
        'chittagong',
        'coxsbazar',
        'noakhali',
        'lakshmipur'
      ].includes(city.id);

      if (
        dist <= cycloneFloodRadius * 2.8 ||
        dist <= cycloneRadius * 0.32 ||
        (isCoastalDistrict && dist <= cycloneRadius * 0.52) ||
        (isBarishal && cycloneCategory >= 4 && dist <= cycloneRadius * 0.65)
      ) {
        map.set(city.id, {
          devastation: 'big',
          dist,
          description: 'Catastrophic Devastation (Core Eyewall & Inundation Surge)'
        });
      } else if (dist <= cycloneRadius * 0.70) {
        map.set(city.id, {
          devastation: 'medium',
          dist,
          description: 'Severe Devastation (Hurricane Force Winds & Tidal Flooding)'
        });
      } else if (dist <= cycloneRadius * 1.05) {
        map.set(city.id, {
          devastation: 'small',
          dist,
          description: 'Moderate Devastation (Tropical Rainband Squalls)'
        });
      } else {
        map.set(city.id, {
          devastation: 'safe',
          dist,
          description: 'Safe (Outside Cyclone Reach)'
        });
      }
    });

    return map;
  }, [weatherMode, cycloneCenter, cycloneRadius, cycloneFloodRadius, cycloneCategory]);

  const devastationCounts = useMemo(() => {
    let big = 0;
    let medium = 0;
    let small = 0;
    districtCycloneImpact.forEach((v) => {
      if (v.devastation === 'big') big++;
      else if (v.devastation === 'medium') medium++;
      else if (v.devastation === 'small') small++;
    });
    return { big, medium, small };
  }, [districtCycloneImpact]);



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
                  ? `Monsoon Confluence (${rainMagnitudeMm} mm/day)`
                  : weatherMode === 'heavy_rain'
                  ? `Rain Mode (${rainMagnitudeMm} mm/day)`
                  : `Light Rain (${rainMagnitudeMm} mm/day)`}
              </span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                  weatherMode === 'heavy_rain' || weatherMode === 'light_rain'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : dangerLevel === 'Catastrophic'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : dangerLevel === 'Severe'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : dangerLevel === 'Moderate'
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {weatherMode === 'heavy_rain' || weatherMode === 'light_rain' ? '0% Flood (Safe)' : `${dangerLevel} Surge`}
              </span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {weatherMode === 'cyclone' ? (
                <>
                  🌀 Eye: ({cycloneCenter.x}, {cycloneCenter.y}) · Devastation: <strong className="text-red-700">{devastationCounts.big} Big (!)</strong>, <strong className="text-amber-700">{devastationCounts.medium} Med (!)</strong>, <strong className="text-yellow-700">{devastationCounts.small} Small (!)</strong>
                </>
              ) : weatherMode === 'heavy_rain' || weatherMode === 'light_rain' ? (
                <span className="text-emerald-700 font-semibold">
                  🌱 Zero Flood in Rain Mode · 100% natural drainage · 0 / 64 districts flooded
                </span>
              ) : (
                <>⚠️ {atRiskDistrictIds.length} of 64 Districts Alert · River Crest: +{equivalentSurgeMeters}m</>
              )}
            </span>
          </div>
        </div>

        {/* Live Flooded Stat Badge */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2">
          {weatherMode === 'cyclone' ? (
            <Wind className="w-4 h-4 text-rose-600" />
          ) : (
            <Waves className="w-4 h-4 text-[#0c445f]" />
          )}
          <div className="text-xs">
            {weatherMode === 'cyclone' ? (
              <>
                <span className="text-slate-500 font-medium">Core Inundation: </span>
                <span className="font-mono font-bold text-sky-700">
                  {Math.round(researchedCyclone.floodedPercentLand)}% Land ({researchedCyclone.floodedAreaKm2.toLocaleString()} km²)
                </span>
              </>
            ) : weatherMode === 'heavy_rain' || weatherMode === 'light_rain' ? (
              <>
                <span className="text-emerald-600 font-bold">0.0% Flooding</span>
                <span className="text-slate-400 text-[10px] ml-1">(Zero Flood)</span>
              </>
            ) : (
              <>
                <span className="text-slate-500 font-medium">Alert Area: </span>
                <span className="font-mono font-bold text-[#0c445f]">
                  {atRiskDistrictIds.length} Districts Alert
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. ZOOM & RESET CONTROLS (Positioned cleanly on top right) */}
      <div className="absolute right-3 top-16 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-md border border-slate-200 flex flex-col gap-1 z-30">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Map View"
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 2B. OPENABLE RESEARCHED CYCLONE DATA TAB ON LEFT SIDE (Does not interfere with the map) */}
      {weatherMode === 'cyclone' && (
        <div className="absolute top-16 left-3 z-40">
          {!isResearchedTabOpen ? (
            /* Closed Tab Button (Compact, docked on left side) */
            <button
              onClick={() => setIsResearchedTabOpen(true)}
              className="bg-white/95 hover:bg-rose-50 text-slate-800 hover:text-rose-700 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border-2 border-rose-300 flex items-center gap-2 text-xs font-bold transition-all hover:scale-102 cursor-pointer group"
              title="Click to open full researched cyclone empirical data tab"
            >
              <span className="w-5 h-5 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                !
              </span>
              <div className="text-left">
                <div className="font-fun text-xs flex items-center gap-1.5 text-rose-950">
                  <span>Researched Data</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-md font-mono font-bold">
                    Cat {cycloneCategory}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal">
                  +{researchedCyclone.averageSurgeMeters}m surge · {atRiskDistrictIds.length} alerts (!)
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform ml-0.5" />
            </button>
          ) : (
            /* Open Tab Drawer Panel (Scrollable, full researched details, close button) */
            <div className="w-80 sm:w-96 max-h-[calc(100vh-140px)] bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-2xl border-2 border-rose-300 flex flex-col z-40 animate-in slide-in-from-left duration-200">
              {/* Header with Title and Close Button */}
              <div className="flex items-center justify-between pb-2.5 border-b border-rose-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    !
                  </span>
                  <div>
                    <h4 className="font-fun text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                      Researched Cyclone Data
                    </h4>
                    <p className="text-[10px] text-rose-700 font-bold">
                      {researchedCyclone.categoryName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsResearchedTabOpen(false)}
                  className="text-slate-500 hover:text-slate-800 hover:bg-rose-50 px-2 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                  title="Close tab"
                >
                  <span className="text-[10px] text-slate-600 font-semibold">Close</span>
                  <X className="w-3.5 h-3.5 text-rose-600" />
                </button>
              </div>

              {/* Scrollable Researched Data Content */}
              <div className="mt-2.5 space-y-2 text-xs overflow-y-auto pr-1">
                {/* 4-Stat Researched Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="bg-rose-50/90 rounded-2xl p-2 border border-rose-200">
                    <span className="text-[9.5px] font-bold text-rose-800 uppercase block tracking-wider">Storm Surge Height</span>
                    <div className="font-mono font-black text-sm text-rose-950">
                      +{researchedCyclone.averageSurgeMeters}m MSL
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">
                      Range: {researchedCyclone.surgeRangeMeters}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200">
                    <span className="text-[9.5px] font-bold text-slate-600 uppercase block tracking-wider">Wind & Pressure</span>
                    <div className="font-mono font-bold text-slate-900 text-[11px]">
                      {researchedCyclone.windSpeedKmh}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {researchedCyclone.centralPressureHpa}
                    </span>
                  </div>

                  <div className="bg-sky-50 rounded-2xl p-2 border border-sky-200">
                    <span className="text-[9.5px] font-bold text-sky-800 uppercase block tracking-wider">Flooded Land Area</span>
                    <div className="font-mono font-bold text-sky-950 text-xs">
                      {researchedCyclone.floodedAreaKm2.toLocaleString()} km²
                    </div>
                    <span className="text-[10px] text-sky-700 font-semibold">
                      {researchedCyclone.floodedPercentLand}% of Bangladesh
                    </span>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-2 border border-amber-200">
                    <span className="text-[9.5px] font-bold text-amber-800 uppercase block tracking-wider">Exclamation Alerts (!)</span>
                    <div className="font-mono font-bold text-amber-950 text-xs">
                      {atRiskDistrictIds.length} Districts Alert
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      Visualized on Map (!)
                    </span>
                  </div>
                </div>

                {/* Devastation Breakdown by Intensity (Big, Medium, Small (!) marks) */}
                <div className="bg-rose-50/70 rounded-2xl p-2.5 border border-rose-200 space-y-2">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-rose-950">
                    <span className="flex items-center gap-1">
                      <span>🌀 Spiral Radius: {cycloneRadius}px (~{Math.round(cycloneRadius * 1.3)} km)</span>
                    </span>
                    <span className="text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded-md font-mono text-[10px]">
                      1/10th Flood Core: {cycloneFloodRadius.toFixed(0)}px
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
                    <div className="bg-red-100/90 text-red-950 border border-red-300 rounded-xl py-1.5 px-1 shadow-2xs">
                      <span className="block text-sm font-black text-red-700">! {devastationCounts.big}</span>
                      <span className="text-[9px] font-bold text-red-800">Big (!) Alert</span>
                      <div className="text-[8px] text-red-600 font-normal">Catastrophic</div>
                    </div>
                    <div className="bg-orange-100/90 text-orange-950 border border-orange-300 rounded-xl py-1.5 px-1 shadow-2xs">
                      <span className="block text-sm font-black text-orange-700">! {devastationCounts.medium}</span>
                      <span className="text-[9px] font-bold text-orange-800">Med (!) Alert</span>
                      <div className="text-[8px] text-orange-600 font-normal">Severe Gale</div>
                    </div>
                    <div className="bg-amber-100/90 text-amber-950 border border-amber-300 rounded-xl py-1.5 px-1 shadow-2xs">
                      <span className="block text-sm font-black text-amber-700">! {devastationCounts.small}</span>
                      <span className="text-[9px] font-bold text-amber-800">Small (!) Alert</span>
                      <div className="text-[8px] text-amber-600 font-normal">Moderate</div>
                    </div>
                  </div>
                </div>

                {/* Barishal Hydrological Elevation Status */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-2 text-[11px] text-amber-950 leading-snug">
                  <strong>🏛️ Barishal Elevation Insight: </strong>
                  {researchedCyclone.barishalStatus}
                </div>

                {/* Inundation Description */}
                <div className="text-[11px] text-slate-700 leading-snug bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <strong>🌊 Topographical Flood Impact: </strong>
                  {researchedCyclone.inundationDescription}
                </div>

                {/* Historical Analogue */}
                <div className="text-[10.5px] text-slate-600 bg-white p-2 rounded-2xl border border-slate-200 leading-tight">
                  <span className="font-bold text-slate-800">Historical Analogue: </span>
                  {researchedCyclone.historicalAnalogue} ({researchedCyclone.historicalCasualties})
                </div>

                {/* Affected Districts with Exclamation marks */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    Districts with Exclamation Mark Alert (!) ({researchedCyclone.atRiskDistrictNames.length}):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {researchedCyclone.atRiskDistrictNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-300 shadow-xs"
                      >
                        <span className="text-rose-600 font-black">!</span>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scientific Sources Citation */}
                <div className="text-[9.5px] text-slate-500 italic pt-1 border-t border-slate-100 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>Source: {researchedCyclone.researchSource}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MAP LEGEND */}
      <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-slate-200 text-xs hidden sm:flex flex-col gap-1.5 z-30 max-w-[260px]">
        <div className="font-fun font-bold text-[11px] text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Flood & Cyclone Map Legend</span>
        </div>

        {weatherMode === 'cyclone' ? (
          <>
            {/* Devastation Exclamation Legend */}
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span className="w-4 h-4 rounded-full bg-red-700 text-white font-black text-[11px] flex items-center justify-center shadow-xs shrink-0 ring-2 ring-red-400">
                !
              </span>
              <span className="text-red-900 font-bold">Big (!): Catastrophic Core Impact</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-600 text-white font-black text-[9.5px] flex items-center justify-center shadow-xs shrink-0 ring-1 ring-orange-300">
                !
              </span>
              <span className="text-orange-900 font-bold">Medium (!): Severe Gale &amp; Breach</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span className="w-3 h-3 rounded-full bg-amber-500 text-white font-black text-[8px] flex items-center justify-center shadow-xs shrink-0">
                !
              </span>
              <span className="text-amber-900 font-medium">Small (!): Moderate Rainband</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0c445f] border-2 border-sky-400 shrink-0 shadow-xs" />
              <span className="text-sky-950 font-bold">1/10th Radius Flood Core</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span className="text-xs">🌀</span>
              <span className="text-slate-600">Rotating Spiral Vortex</span>
            </div>
          </>
        ) : weatherMode === 'heavy_rain' || weatherMode === 'light_rain' ? (
          <>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
              <span className="text-emerald-900 font-bold">Zero Flood in Rain Mode</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-sm">🌧️</span>
              <span className="text-slate-700">Precipitation: {rainMagnitudeMm} mm/day</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#15803d] shrink-0 shadow-xs" />
              <span className="text-slate-600">All 64 Districts Safe &amp; Dry</span>
            </div>
            <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200 leading-snug">
              🌱 Zero flood occurs. All rainwater is absorbed by farmland, wetlands &amp; rivers.
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                !
              </span>
              <span className="text-slate-800 font-bold">Monsoon Confluence Alert</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0c445f] border border-sky-400 shrink-0 shadow-xs" />
              <span className="text-slate-700 font-bold">Riverine Overflow Water</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#15803d] shrink-0 shadow-xs" />
              <span className="text-slate-600">Safe Dry Elevations</span>
            </div>
          </>
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
              ref={svgRef}
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

                {/* Radar eyewall gradient */}
                <radialGradient id="eyewallConvectionGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#ea580c" stopOpacity="0.8" />
                  <stop offset="85%" stopColor="#eab308" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>

                {/* Cyclone spiral cloud arm gradient */}
                <linearGradient id="cycloneSpiralCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
                </linearGradient>

                {/* Direct 1/10th radius flood core deep water gradient */}
                <radialGradient id="cycloneFloodCoreGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#082b3d" stopOpacity="0.98" />
                  <stop offset="60%" stopColor="#0c445f" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.88" />
                </radialGradient>
              </defs>

              {/* Click & drag backdrop to reposition or drag cyclone freely across Bangladesh in cyclone mode */}
              <rect
                x="0"
                y="0"
                width="896"
                height="1200"
                fill="transparent"
                className={
                  weatherMode === 'cyclone'
                    ? isDraggingCyclone
                      ? 'pointer-events-auto cursor-grabbing'
                      : cycloneCursorMode === 'move_cyclone'
                      ? 'pointer-events-auto cursor-grab'
                      : 'pointer-events-auto cursor-crosshair'
                    : 'pointer-events-none'
                }
                onMouseDown={(e) => {
                  if (weatherMode === 'cyclone' && cycloneCursorMode === 'move_cyclone') {
                    e.stopPropagation();
                    setIsDraggingCyclone(true);
                    isDraggingCycloneRef.current = true;
                    updateCycloneFromClientCoords(e.clientX, e.clientY);
                  }
                }}
                onTouchStart={(e) => {
                  if (weatherMode === 'cyclone' && cycloneCursorMode === 'move_cyclone' && e.touches.length === 1) {
                    setIsDraggingCyclone(true);
                    isDraggingCycloneRef.current = true;
                    updateCycloneFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onClick={handleSvgClick}
              />

              {/* ---------------- 1. FLOOD WATER LAYER (Turns flooded areas into deep ocean blue #0c445f) ---------------- */}
              <g className="rainfall-flood-water-layer">
                {/* A. Real Researched Coastal Storm Surge Flooding based on IWM & BMD hydrodynamic models (NO artificial lines) */}
                {weatherMode === 'cyclone' && (
                  <g className="cyclone-researched-flooding-layer">
                    {/* 1. Direct 1/10th Radius Cyclone Flood Core (Submerges 1/10th of radius directly under deep ocean water) */}
                    <g className="cyclone-tenth-radius-flood-core">
                      <circle
                        cx={cycloneCenter.x}
                        cy={cycloneCenter.y}
                        r={cycloneFloodRadius}
                        fill="url(#rainOceanWater)"
                        stroke="#0c445f"
                        strokeWidth={6}
                        opacity={0.96}
                      />
                      <circle
                        cx={cycloneCenter.x}
                        cy={cycloneCenter.y}
                        r={cycloneFloodRadius}
                        fill="url(#cycloneFloodCoreGrad)"
                        opacity={0.92}
                      />
                      {/* Heavy storm surge churning concentric ripples within the 1/10th flood zone */}
                      <circle
                        cx={cycloneCenter.x}
                        cy={cycloneCenter.y}
                        r={cycloneFloodRadius * 0.72}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        strokeOpacity={0.85}
                      />
                      <circle
                        cx={cycloneCenter.x}
                        cy={cycloneCenter.y}
                        r={cycloneFloodRadius * 0.42}
                        fill="none"
                        stroke="#bae6fd"
                        strokeWidth={1.5}
                        strokeOpacity={0.9}
                      />
                    </g>

                    {/* 2. Real Researched 0-3m Coastal Elevation Zone Inundation */}
                    {USGS_ELEVATION_ZONES.find((z) => z.id === '0-3')?.paths.map((p, i) => (
                      <path
                        key={`cyclone-researched-flood-0-3-${i}`}
                        d={p}
                        fill="url(#rainOceanWater)"
                        fillOpacity={
                          cycloneCategory <= 1
                            ? 0.82
                            : cycloneCategory <= 2
                            ? 0.88
                            : cycloneCategory <= 3
                            ? 0.94
                            : cycloneCategory <= 4
                            ? 0.97
                            : 0.99
                        }
                      />
                    ))}

                    {/* 3. Category 4 & 5 Researched Surge: Exceeds 4.0m MSL, breaches levees and floods 3-10m Delta Zone */}
                    {cycloneCategory >= 4 &&
                      USGS_ELEVATION_ZONES.find((z) => z.id === '3-10')?.paths.map((p, i) => (
                        <path
                          key={`cyclone-researched-flood-3-10-${i}`}
                          d={p}
                          fill="url(#rainOceanWater)"
                          fillOpacity={cycloneCategory === 4 ? 0.78 : 0.90}
                        />
                      ))}
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

              {/* Gentle Falling Rain Streaks (rendered strictly during rain/monsoon modes, NO lines for cyclone) */}
              {weatherMode !== 'cyclone' && (
                <g className="subtle-rain-streaks" pointerEvents="none">
                  {Array.from({
                    length:
                      weatherMode === 'monsoon'
                        ? 110
                        : weatherMode === 'heavy_rain'
                        ? 75
                        : 40
                  }).map((_, i) => {
                    const x = ((i * 73 + 37) % 760) + 70;
                    const y = ((i * 97 + 19) % 980) + 70;
                    const dx = -3;
                    const dy = weatherMode === 'monsoon' ? 18 : weatherMode === 'heavy_rain' ? 14 : 9;
                    const op =
                      weatherMode === 'monsoon'
                        ? 0.28
                        : weatherMode === 'heavy_rain'
                        ? 0.24
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
              )}

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

              {/* ---------------- 4. ROTATING CYCLONE SPIRAL SYSTEM (Meteorological Counter-Clockwise Vortex) ---------------- */}
              {weatherMode === 'cyclone' && (
                <g className="cyclone-meteorological-spiral-system" pointerEvents="none">
                  {/* Outer Storm Gale-Force Wind Boundary (Radius R) */}
                  <circle
                    cx={cycloneCenter.x}
                    cy={cycloneCenter.y}
                    r={cycloneRadius}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={1.2}
                    strokeDasharray="6 6"
                    opacity={0.35}
                  />

                  {/* The Rotating Cyclone Spiral Arms */}
                  <g transform={`translate(${cycloneCenter.x}, ${cycloneCenter.y})`}>
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="-360"
                        dur={
                          cycloneCategory === 5
                            ? '7s'
                            : cycloneCategory === 4
                            ? '10s'
                            : cycloneCategory === 3
                            ? '14s'
                            : cycloneCategory === 2
                            ? '18s'
                            : '23s'
                        }
                        repeatCount="indefinite"
                      />

                      {/* 4 Multi-Layered Curving Spiral Arms */}
                      {cycloneArms.map((arm, aIdx) => (
                        <g key={`cyclone-spiral-arm-${aIdx}`}>
                          {/* Outer wispy cloud ribbon */}
                          <path
                            d={arm.ribbonPath}
                            fill="url(#cycloneSpiralCloudGrad)"
                            opacity={0.52}
                          />
                          {/* Soft white secondary cloud band */}
                          <path
                            d={arm.rainbandPath}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth={Math.max(6, cycloneRadius * 0.045)}
                            strokeOpacity={0.45}
                            strokeLinecap="round"
                          />
                          {/* Radar echo band (crimson/orange near eyewall) */}
                          <path
                            d={arm.radarEchoPath}
                            fill="none"
                            stroke={aIdx % 2 === 0 ? '#ef4444' : '#f97316'}
                            strokeWidth={Math.max(4, cycloneRadius * 0.028)}
                            strokeOpacity={0.8}
                            strokeLinecap="round"
                          />
                          {/* Outer cirrus wisps with dashes */}
                          <path
                            d={arm.rainbandPath}
                            fill="none"
                            stroke="#7dd3fc"
                            strokeWidth={1.8}
                            strokeDasharray="8 6"
                            strokeOpacity={0.65}
                          />
                        </g>
                      ))}

                      {/* Eyewall Intense Convective Ring */}
                      <circle
                        cx="0"
                        cy="0"
                        r={Math.max(20, cycloneRadius * 0.09)}
                        fill="url(#eyewallConvectionGlow)"
                        opacity={0.88}
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={Math.max(16, cycloneRadius * 0.075)}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth={4.5}
                        strokeDasharray="16 8"
                        opacity={0.95}
                      />
                    </g>

                    {/* 1/10th Radius Flood Indicator Ring on Cyclone Center */}
                    <circle
                      cx="0"
                      cy="0"
                      r={cycloneFloodRadius}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={2.2}
                      strokeDasharray="4 3"
                      opacity={0.95}
                    />

                    {/* Central Calm Eye & Interactive Draggable Handle (pointer-events-auto) */}
                    <g
                      className="cyclone-eye-drag-handle pointer-events-auto cursor-grab active:cursor-grabbing"
                      style={{ cursor: isDraggingCyclone ? 'grabbing' : 'grab' }}
                      onMouseDown={handleCycloneEyeMouseDown}
                      onTouchStart={handleCycloneEyeTouchStart}
                    >
                      {/* Outer Beacon Pulsing Target Ring */}
                      <circle
                        cx="0"
                        cy="0"
                        r={Math.max(26, cycloneRadius * 0.12)}
                        fill="#38bdf8"
                        fillOpacity={isDraggingCyclone ? 0.35 : 0.22}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeDasharray="5 3"
                      />

                      {/* Calm Eye Core */}
                      <circle
                        cx="0"
                        cy="0"
                        r={Math.max(14, cycloneRadius * 0.065)}
                        fill="#082f49"
                        fillOpacity={0.96}
                        stroke="#38bdf8"
                        strokeWidth={2.5}
                      />

                      {/* Eye Crosshairs */}
                      <line x1="-9" y1="0" x2="9" y2="0" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.9" />
                      <line x1="0" y1="-9" x2="0" y2="9" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.9" />

                      {/* Eye Badge Text */}
                      <text
                        x="0"
                        y="-3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="900"
                        fontFamily="sans-serif"
                        pointerEvents="none"
                      >
                        CAT {cycloneCategory}
                      </text>
                      <text
                        x="0"
                        y="6"
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="6.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        pointerEvents="none"
                      >
                        DRAG
                      </text>

                      {/* Drag Handle Label Badge Underneath Eye */}
                      <g transform="translate(0, 24)" pointerEvents="none">
                        <rect
                          x="-42"
                          y="-8"
                          width="84"
                          height="15"
                          rx="7.5"
                          fill="#0f172a"
                          fillOpacity={0.92}
                          stroke="#38bdf8"
                          strokeWidth={1}
                        />
                        <text
                          x="0"
                          y="2.5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {isDraggingCyclone ? `🌀 X:${cycloneCenter.x} Y:${cycloneCenter.y}` : '🖱️ Drag with Cursor'}
                        </text>
                      </g>
                    </g>
                  </g>
                </g>
              )}

              {/* ---------------- 5. 64 DISTRICTS PINS & BIG/MEDIUM/SMALL EXCLAMATION ALERTS ---------------- */}
              <g className="districts-and-exclamation-alerts">
                {BANGLADESH_CITIES.map((city) => {
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
                      {/* CYCLONE MODE: RENDER BIG, MEDIUM, OR SMALL EXCLAMATION MARKS ACCORDING TO DEVASTATION */}
                      {weatherMode === 'cyclone' ? (
                        (() => {
                          const impact = districtCycloneImpact.get(city.id) || { devastation: 'safe', dist: 999 };
                          const devastation = impact.devastation;
                          const isBarishal = city.id === 'barishal';

                          if (devastation === 'big') {
                            /* BIG (!) EXCLAMATION MARK - CATASTROPHIC DEVASTATION (Hit hardest / 1/10th flood core / Eyewall) */
                            return (
                              <g transform={`translate(${coords.x}, ${coords.y})`}>
                                {/* Double Pulsing Red Shockwave Beacons */}
                                <circle cx="0" cy="0" r={25} fill="#ef4444" opacity={0.38} />
                                <circle cx="0" cy="0" r={19} fill="#dc2626" opacity={0.28} />

                                {/* BIG Alert Circle Badge */}
                                <circle
                                  cx="0"
                                  cy="0"
                                  r={15}
                                  fill="#991b1b"
                                  stroke="#ffffff"
                                  strokeWidth={2.4}
                                />
                                {/* BIG Exclamation Mark Text */}
                                <text
                                  x="0"
                                  y="5.5"
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="16"
                                  fontWeight="900"
                                  fontFamily="sans-serif"
                                >
                                  !
                                </text>

                                {/* District Name Label with BIG ALERT Badge */}
                                <g transform="translate(18, 4)">
                                  <rect
                                    x="-2"
                                    y="-11"
                                    width={
                                      isBarishal && cycloneCategory >= 4
                                        ? 136
                                        : city.name.length * 6.2 + 82
                                    }
                                    height="14"
                                    rx="3.5"
                                    fill="#7f1d1d"
                                    fillOpacity={0.96}
                                    stroke="#fca5a5"
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
                                    {isBarishal && cycloneCategory >= 4
                                      ? `🚨 Barishal (Inundated: 4m Levee Breached)`
                                      : `🚨 ${city.name} (Catastrophic Devastation)`}
                                  </text>
                                </g>
                              </g>
                            );
                          } else if (devastation === 'medium') {
                            /* MEDIUM (!) EXCLAMATION MARK - SEVERE DEVASTATION (Hurricane Winds & Tidal Flooding) */
                            return (
                              <g transform={`translate(${coords.x}, ${coords.y})`}>
                                {/* Pulsing Beacon Halo */}
                                <circle cx="0" cy="0" r={17} fill="#ea580c" opacity={0.32} />

                                {/* MEDIUM Alert Circle Badge */}
                                <circle
                                  cx="0"
                                  cy="0"
                                  r={11}
                                  fill="#ea580c"
                                  stroke="#ffffff"
                                  strokeWidth={2}
                                />
                                {/* MEDIUM Exclamation Mark Text */}
                                <text
                                  x="0"
                                  y="4"
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="12"
                                  fontWeight="900"
                                  fontFamily="sans-serif"
                                >
                                  !
                                </text>

                                {/* District Name Label with MEDIUM ALERT Badge */}
                                <g transform="translate(14, 3)">
                                  <rect
                                    x="-2"
                                    y="-10"
                                    width={
                                      isBarishal && cycloneCategory < 4
                                        ? 132
                                        : city.name.length * 6.0 + 72
                                    }
                                    height="13"
                                    rx="3"
                                    fill="#9a3412"
                                    fillOpacity={0.96}
                                    stroke="#fdba74"
                                    strokeWidth="0.8"
                                  />
                                  <text
                                    x="2"
                                    y="-1"
                                    fill="#ffffff"
                                    fontSize="7.2"
                                    fontWeight="bold"
                                    fontFamily="sans-serif"
                                  >
                                    {isBarishal && cycloneCategory < 4
                                      ? `⚠️ Barishal (High Ground 4m · Gale Winds)`
                                      : `⚠️ ${city.name} (Severe Devastation)`}
                                  </text>
                                </g>
                              </g>
                            );
                          } else if (devastation === 'small') {
                            /* SMALL (!) EXCLAMATION MARK - MODERATE DEVASTATION (Outer Rainband Squalls) */
                            return (
                              <g transform={`translate(${coords.x}, ${coords.y})`}>
                                {/* Alert Halo */}
                                <circle cx="0" cy="0" r={11} fill="#f59e0b" opacity={0.26} />

                                {/* SMALL Alert Circle Badge */}
                                <circle
                                  cx="0"
                                  cy="0"
                                  r={8}
                                  fill="#d97706"
                                  stroke="#ffffff"
                                  strokeWidth={1.6}
                                />
                                {/* SMALL Exclamation Mark Text */}
                                <text
                                  x="0"
                                  y="3"
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="8.5"
                                  fontWeight="900"
                                  fontFamily="sans-serif"
                                >
                                  !
                                </text>

                                {/* District Name Label with SMALL ALERT Badge */}
                                <g transform="translate(11, 3)">
                                  <rect
                                    x="-2"
                                    y="-9"
                                    width={city.name.length * 5.6 + 62}
                                    height="11"
                                    rx="2.5"
                                    fill="#b45309"
                                    fillOpacity={0.94}
                                    stroke="#fde68a"
                                    strokeWidth="0.7"
                                  />
                                  <text
                                    x="2"
                                    y="-1"
                                    fill="#ffffff"
                                    fontSize="6.8"
                                    fontWeight="bold"
                                    fontFamily="sans-serif"
                                  >
                                    ⚠️ {city.name} (Moderate Squalls)
                                  </text>
                                </g>
                              </g>
                            );
                          } else {
                            /* SAFE DISTRICT PIN (Outside cyclone strike radius) */
                            return (
                              <g transform={`translate(${coords.x}, ${coords.y})`}>
                                <circle
                                  cx="0"
                                  cy="0"
                                  r={isBarishal ? 5.5 : city.isDivisionCapital ? 4.5 : 3.2}
                                  fill={isBarishal ? '#16a34a' : city.isDivisionCapital ? '#0369a1' : '#475569'}
                                  stroke="#ffffff"
                                  strokeWidth={1.5}
                                />
                                <g transform="translate(6, 3)">
                                  <rect
                                    x="-1"
                                    y="-8"
                                    width={
                                      isBarishal
                                        ? 112
                                        : city.name.length * 5.2 + 10
                                    }
                                    height="10"
                                    rx="2"
                                    fill={isBarishal ? '#f0fdf4' : '#ffffff'}
                                    fillOpacity={0.88}
                                    stroke={isBarishal ? '#86efac' : '#cbd5e1'}
                                    strokeWidth={isBarishal ? 0.8 : 0.5}
                                  />
                                  <text
                                    x="2"
                                    y="-1"
                                    fill={isBarishal ? '#15803d' : '#334155'}
                                    fontSize="6.2"
                                    fontWeight={isBarishal || city.isDivisionCapital ? 'bold' : 'normal'}
                                    fontFamily="sans-serif"
                                  >
                                    {isBarishal
                                      ? `✅ Barishal (Safe: 4.0m MSL)`
                                      : city.name}
                                  </text>
                                </g>
                              </g>
                            );
                          }
                        })()
                      ) : weatherMode === 'monsoon' && atRiskSet.has(city.id) ? (
                        /* MONSOON RIVERINE CONFLUENCE AT-RISK EXCLAMATION MARK ONLY (NO flood marks in Rain Mode!) */
                        (() => {
                          return (
                            <g transform={`translate(${coords.x}, ${coords.y})`}>
                              <circle
                                cx="0"
                                cy="0"
                                r={11}
                                fill="#dc2626"
                                stroke="#ffffff"
                                strokeWidth={1.8}
                              />
                              <text
                                x="0"
                                y="4"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="900"
                                fontFamily="sans-serif"
                              >
                                !
                              </text>

                              <g transform="translate(14, 3)">
                                <rect
                                  x="-2"
                                  y="-10"
                                  width={city.name.length * 6.2 + 20}
                                  height="13"
                                  rx="3"
                                  fill="#991b1b"
                                  fillOpacity={0.96}
                                  stroke="#fca5a5"
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
                                  ⚠️ {city.name}
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
                          <g transform="translate(6, 3)">
                            <rect
                              x="-1"
                              y="-9"
                              width={city.name.length * 5.4 + 14}
                              height="11"
                              rx="2.5"
                              fill="#ffffff"
                              fillOpacity={0.92}
                              stroke="#cbd5e1"
                              strokeWidth={0.5}
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
            <div className="flex justify-between items-center">
              <span>Weather Threat Status:</span>
              {weatherMode === 'cyclone' ? (
                (() => {
                  const impact = districtCycloneImpact.get(selectedDistrict.id);
                  if (impact?.devastation === 'big') {
                    return <span className="text-red-700 font-black">🚨 Catastrophic Core Impact</span>;
                  } else if (impact?.devastation === 'medium') {
                    return <span className="text-orange-600 font-bold">⚠️ Severe Gale &amp; Inundation</span>;
                  } else if (impact?.devastation === 'small') {
                    return <span className="text-amber-600 font-bold">⚠️ Moderate Squalls</span>;
                  } else {
                    return <span className="text-emerald-600 font-bold">✅ Safe (Outside Reach)</span>;
                  }
                })()
              ) : weatherMode === 'heavy_rain' || weatherMode === 'light_rain' ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  🌱 Safe (Zero Flood in Rain Mode)
                </span>
              ) : atRiskSet.has(selectedDistrict.id) ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  ⚠️ At High Risk of Flooding
                </span>
              ) : (
                <span className="text-emerald-600 font-bold">Safe &amp; Above Surge</span>
              )}
            </div>
          </div>

          {weatherMode === 'cyclone' ? (
            (() => {
              const impact = districtCycloneImpact.get(selectedDistrict.id);
              if (impact?.devastation === 'big') {
                return (
                  <div className="mt-3 p-2.5 rounded-2xl bg-red-50 border border-red-300 text-[11px] text-red-950 leading-snug">
                    🚨 <strong>Catastrophic Eyewall &amp; Direct Flood Impact:</strong> Located inside the direct strike zone (distance: {Math.round(impact.dist)}px from eye). Massive gale winds and immediate flood waters.
                  </div>
                );
              } else if (impact?.devastation === 'medium') {
                return (
                  <div className="mt-3 p-2.5 rounded-2xl bg-orange-50 border border-orange-300 text-[11px] text-orange-950 leading-snug">
                    ⚠️ <strong>Severe Devastation Warning:</strong> Severe hurricane-force winds and tidal push ({Math.round(impact.dist)}px from eye). High structural and coastal hazard.
                  </div>
                );
              } else if (impact?.devastation === 'small') {
                return (
                  <div className="mt-3 p-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 leading-snug">
                    ⚠️ <strong>Moderate Squall Alert:</strong> Outer tropical rainbands bringing heavy gusts ({Math.round(impact.dist)}px from eye).
                  </div>
                );
              } else {
                return (
                  <div className="mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-950 leading-snug">
                    ✅ <strong>Safe from Cyclone:</strong> Located safely beyond the storm boundary ({Math.round(impact?.dist || 0)}px from eye).
                  </div>
                );
              }
            })()
          ) : weatherMode === 'heavy_rain' || weatherMode === 'light_rain' ? (
            <div className="mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-950 leading-snug">
              🌱 <strong>Zero Flood in Rain Mode:</strong> Precipitation ({rainMagnitudeMm} mm/day) is naturally absorbed into soils, vegetation, and rivers. Zero flood occurs anywhere in {selectedDistrict.name}.
            </div>
          ) : atRiskSet.has(selectedDistrict.id) ? (
            <div className="mt-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 leading-snug">
              🚨 <strong>Monsoon Confluence Alert:</strong> Elevated river crests and flash flood runoff across local basins.
            </div>
          ) : (
            <div className="mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
              ✅ <strong>Safe Condition:</strong> District ground elevation ({selectedDistrict.elevationMeters}m) is safe and above inundation levels.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
