import React, { useState, useMemo } from 'react';
import { BANGLADESH_CITIES, BangladeshCity } from '../data/bangladeshCitiesData';
import {
  calculateDisplacedAndFloodedSectors,
  BANGLADESH_DISTRICTS_DATA,
  DistrictSubdivision,
  PRECISE_MOUNTAIN_SUBDIVISIONS
} from '../data/bangladeshDistrictsSubdivisions';
import { USGS_ELEVATION_ZONES, UsgsElevationZone } from '../data/usgsElevationZones';
import {
  MOUNTAIN_ZONES,
  GREEN_MOUNTAIN_ZONE,
  YELLOW_MOUNTAIN_ZONE,
  RED_MOUNTAIN_ZONE,
  MountainZone,
  MountainPeak,
  getMountainZoneStatus
} from '../data/mountainZonesData';
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
  Mountain,
  ChevronRight,
  Eye,
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
  const [cityFilter, setCityFilter] = useState<'all' | 'capitals' | 'submerged' | 'coastal' | 'municipalities'>('all');
  const [showUsgsElevation, setShowUsgsElevation] = useState(true);
  const [showUsgsReportModal, setShowUsgsReportModal] = useState(false);
  const [showSunkenCities, setShowSunkenCities] = useState(false);
  // Mountain Red, Yellow, and Green outlines active to show mountain regions clearly
  const [showMountainOutlines, setShowMountainOutlines] = useState(true);
  const [selectedMountainPeak, setSelectedMountainPeak] = useState<MountainPeak | null>(null);
  const [selectedMountainSubdivision, setSelectedMountainSubdivision] = useState<DistrictSubdivision | null>(null);
  const [hoveredMountainZone, setHoveredMountainZone] = useState<'green' | 'yellow' | 'red' | null>(null);

  // Dynamic mountain zone status based on sea level:
  // Green mountains sink at 40m - 95m
  // Yellow mountains sink at 100m - 300m
  // Red mountains sink between 400m - 1052m
  const greenMountainStatus = useMemo(
    () => getMountainZoneStatus(GREEN_MOUNTAIN_ZONE, seaLevelMeters),
    [seaLevelMeters]
  );
  const yellowMountainStatus = useMemo(
    () => getMountainZoneStatus(YELLOW_MOUNTAIN_ZONE, seaLevelMeters),
    [seaLevelMeters]
  );
  const redMountainStatus = useMemo(
    () => getMountainZoneStatus(RED_MOUNTAIN_ZONE, seaLevelMeters),
    [seaLevelMeters]
  );

  // Full submersion flag: when water reaches the highest peak (1,052m) or 100% of the land area
  const isFullySubmerged = seaLevelMeters >= 1052 || floodedPercent >= 99.9;

  // Filter cities to display
  const displayedCities = BANGLADESH_CITIES.filter((city) => {
    if (cityFilter === 'capitals') return city.isDivisionCapital;
    if (cityFilter === 'submerged') return city.elevationMeters <= seaLevelMeters;
    if (cityFilter === 'coastal') return city.category === 'coastal' || city.category === 'port';
    if (cityFilter === 'municipalities') return city.isMunicipality;
    return true;
  });

  const currentlySubmergedCities = BANGLADESH_CITIES.filter(
    (c) => c.elevationMeters <= seaLevelMeters
  );
  // Strictly only show flooding when cities are actually flooded
  const hasFloodedCities = currentlySubmergedCities.length > 0;

  // 1/8th district subdivision flood metrics: authentic topographical flooding across all 64 districts
  const subSectorMetrics = useMemo(() => {
    return calculateDisplacedAndFloodedSectors(seaLevelMeters);
  }, [seaLevelMeters]);

  const selectedDistrictInfo = useMemo(() => {
    if (!selectedCity) return null;
    return BANGLADESH_DISTRICTS_DATA.find(
      (d) => d.id === selectedCity.id || d.name.toLowerCase() === selectedCity.name.toLowerCase()
    );
  }, [selectedCity]);

  const selectedDistrictStatus = useMemo(() => {
    if (!selectedDistrictInfo) return null;
    return subSectorMetrics.districtStatuses.get(selectedDistrictInfo.id) || null;
  }, [selectedDistrictInfo, subSectorMetrics]);

  // Natural organic estuary wavefront rising continuously from below (Bay of Bengal / South)
  // Grounded in Survey of Bangladesh (SoB) / IWM / CEGIS benchmark elevations:
  // - 0 to 4m: coastal waterline rises from Bay of Bengal (y=1040-1200) reaching Barishal and Patuakhali at 4m
  // - 8m: reaches Dhaka Megacity (y=580)
  // - 16m: reaches Kushtia levee (y=578)
  // - 20m to 25m: reaches Sylhet city (22m) and Rajshahi plains (23m)
  // - 30m to 75m: covers terraces (Barind & Madhupur) up to northern border (Panchagarh)
  // - Above 75m: all flat plains are flooded from below; only the eastern mountain ridges remain above water
  const coastalWavefront = useMemo(() => {
    if (isFullySubmerged || seaLevelMeters >= 1052) {
      return {
        mainPath: 'M 0 0 L 896 0 L 896 1200 L 0 1200 Z',
        featherPath: ''
      };
    }
    if (seaLevelMeters <= 0) {
      return { mainPath: '', featherPath: '' };
    }

    let yw = 1040, ym = 1000, ye = 1060;
    if (seaLevelMeters <= 1.0) {
      const t = seaLevelMeters / 1.0;
      yw = 1040 - t * 70;
      ym = 1000 - t * 75;
      ye = 1060 - t * 80;
    } else if (seaLevelMeters <= 4.0) {
      // 1m to 4m: reaches Barishal (y=810), Patuakhali (y=891), Sitakunda (y=770), Sandwip (y=780)
      const t = (seaLevelMeters - 1.0) / 3.0;
      yw = 970 - t * 115;
      ym = 925 - t * 145;
      ye = 980 - t * 155;
    } else if (seaLevelMeters <= 8.0) {
      // 4m to 8m: reaches Dhaka Megacity (y=580) at 8.0m
      const t = (seaLevelMeters - 4.0) / 4.0;
      yw = 855 - t * 140;
      ym = 780 - t * 200;
      ye = 825 - t * 165;
    } else if (seaLevelMeters <= 16.0) {
      // 8m to 16m: reaches Kushtia (y=578) at 16.0m
      const t = (seaLevelMeters - 8.0) / 8.0;
      yw = 715 - t * 140;
      ym = 580 - t * 120;
      ye = 660 - t * 140;
    } else if (seaLevelMeters <= 25.0) {
      // 16m to 25m: reaches Sylhet city (y=416, 22m) and Rajshahi plains (y=530, 23m)
      const t = (seaLevelMeters - 16.0) / 9.0;
      yw = 575 - t * 155;
      ym = 460 - t * 130;
      ye = 520 - t * 160;
    } else if (seaLevelMeters <= 75.0) {
      // 25m to 75m: reaches northern plains and terraces up to northern border
      const t = (seaLevelMeters - 25.0) / 50.0;
      yw = 420 - t * 420;
      ym = 330 - t * 330;
      ye = 360 - t * 360;
    } else {
      // > 75m: base wavefront covers entire country; only high mountain strike ridges stand above water
      yw = 0;
      ym = 0;
      ye = 0;
    }

    const mainPath = yw <= 0 && ym <= 0 && ye <= 0
      ? 'M 0 0 L 896 0 L 896 1200 L 0 1200 Z'
      : `M 0 1200 L 0 ${yw.toFixed(1)} C 220 ${(yw - 25).toFixed(1)}, 370 ${ym.toFixed(1)}, 470 ${ym.toFixed(1)} C 560 ${ym.toFixed(1)}, 700 ${(ye - 25).toFixed(1)}, 896 ${ye.toFixed(1)} L 896 1200 Z`;

    const featherPath = yw <= 0 && ym <= 0 && ye <= 0
      ? ''
      : `M 0 ${(yw - 4).toFixed(1)} C 220 ${(yw - 29).toFixed(1)}, 370 ${(ym - 4).toFixed(1)}, 470 ${(ym - 4).toFixed(1)} C 560 ${(ym - 4).toFixed(1)}, 700 ${(ye - 29).toFixed(1)}, 896 ${(ye - 4).toFixed(1)}`;

    return { mainPath, featherPath };
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

        {/* MOUNTAINS TOGGLE BUTTON (RED, YELLOW, GREEN & 32 PRECISION SUBDIVISIONS) */}
        <button
          onClick={() => setShowMountainOutlines(!showMountainOutlines)}
          title="Toggle Mountain Red, Yellow, and Green Regions and 32 Precision Subdivisions"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all shadow-md ${
            showMountainOutlines
              ? 'bg-rose-700 hover:bg-rose-800 text-white ring-2 ring-rose-300'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
          }`}
        >
          <Mountain className="w-3.5 h-3.5 text-amber-300" />
          <span>{showMountainOutlines ? 'Mountains (32 Subdivs)' : 'Show Mountains'}</span>
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
          <button
            onClick={() => setCityFilter('municipalities')}
            className={`px-2 py-0.5 rounded-xl transition-colors ${
              cityFilter === 'municipalities' ? 'bg-teal-700 text-white' : 'hover:bg-teal-50 text-teal-800'
            }`}
          >
            Municipalities
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

        {/* Mountain Elevation Zones (Red, Yellow, Green & 32 Subdivisions) */}
        {showMountainOutlines && !showPopulationOverlay && (
          <div className="pt-1.5 mt-1 border-t border-slate-200 flex flex-col gap-1">
            <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-600" />
                Mountain Zones (32)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-[#dc2626] shrink-0" />
              <span className="text-slate-800 font-bold">Red (400–1000m+)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] border border-[#ca8a04] shrink-0" />
              <span className="text-slate-700 font-medium">Yellow (100–300m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-[#16a34a] shrink-0" />
              <span className="text-slate-700 font-medium">Green (40–95m)</span>
            </div>
          </div>
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

                {/* Specific Mountain Outline Glow Filters */}
                <filter id="greenMountainGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3.0" floodColor="#22c55e" floodOpacity="0.88" />
                </filter>
                <filter id="yellowMountainGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3.0" floodColor="#facc15" floodOpacity="0.88" />
                </filter>
                <filter id="redMountainGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ef4444" floodOpacity="0.95" />
                </filter>

                {/* Shoreline feather gradient for gradual waterline advancement */}
                <linearGradient id="waterlineFeather" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </linearGradient>

                {/* Organic sea level delta mask: natural concave estuary advancement from Bay of Bengal */}
                <mask id="gradualSeaLevelMask">
                  <rect x="0" y="0" width="896" height="1200" fill="black" />
                  {isFullySubmerged ? (
                    <rect x="0" y="0" width="896" height="1200" fill="white" />
                  ) : seaLevelMeters > 0 ? (
                    <>
                      {/* 1. CONTINUOUS OCEAN FLOOD BODY COMING FROM BELOW (Bay of Bengal / South) */}
                      {/* As sea level rises, water surges upward from y=1200 / y=1040 northward across Bangladesh */}
                      {coastalWavefront.mainPath && (
                        <path
                          d={coastalWavefront.mainPath}
                          fill="white"
                          opacity={Math.min(1, 0.8 + Math.min(1, seaLevelMeters / 2.0) * 0.2)}
                        />
                      )}

                      {/* 2. BORDERING LANDS FLOODING (Flooding authentic border terrain at exact elevations) */}
                      {/* 2A. Southwest Border: Satkhira & West Sundarbans border with India (0.8m - 7.5m, floods >= 1.0m) */}
                      {seaLevelMeters >= 1.0 && (
                        <path
                          d="M 155 970 L 155 760 C 195 750, 245 760, 275 780 C 305 800, 315 840, 310 890 C 300 940, 260 980, 200 980 Z"
                          fill="white"
                          opacity={Math.min(1, 0.7 + (seaLevelMeters / 4.0) * 0.3)}
                        />
                      )}

                      {/* 2B. Southeast Border: Cox's Bazar beaches, Teknaf peninsula & Naf River border with Myanmar (1m - 6m, floods >= 1.0m) */}
                      {seaLevelMeters >= 1.0 && (
                        <path
                          d="M 650 820 C 680 810, 720 830, 745 880 C 765 930, 775 1010, 775 1100 C 770 1160, 765 1190, 755 1200 L 690 1200 C 680 1130, 670 1060, 650 990 C 630 920, 620 850, 650 820 Z"
                          fill="white"
                          opacity={Math.min(1, 0.7 + (seaLevelMeters / 3.0) * 0.3)}
                        />
                      )}

                      {/* 2C. Northeast Border: Sunamganj & Netrokona haor border plains with Meghalaya (3m - 10m, floods >= 3.0m) */}
                      {seaLevelMeters >= 3.0 && (
                        <path
                          d="M 450 370 C 510 335, 590 335, 650 350 C 670 370, 660 410, 630 430 C 570 440, 500 440, 450 410 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 3.0) / 7.0) * 0.5)}
                        />
                      )}

                      {/* 2D. East Border Plains: Brahmanbaria, Cumilla & Feni plains bordering Tripura (3.5m - 10m, floods >= 3.5m) */}
                      {seaLevelMeters >= 3.5 && (
                        <path
                          d="M 540 640 C 580 620, 630 630, 660 670 C 670 710, 660 755, 630 770 C 590 775, 560 750, 540 710 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 3.5) / 6.5) * 0.5)}
                        />
                      )}

                      {/* 2E. West Border: Chuadanga, Meherpur, Kushtia & Jhenaidah plains bordering West Bengal (8m - 18m, floods >= 8.0m) */}
                      {seaLevelMeters >= 8.0 && (
                        <path
                          d="M 155 680 C 165 590, 185 530, 235 520 C 285 520, 315 550, 315 615 C 315 665, 285 685, 235 690 C 195 690, 165 685, 155 680 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 8.0) / 10.0) * 0.5)}
                        />
                      )}

                      {/* 2F. Westernmost Border Bulge: Chapainawabganj & Rajshahi border with Malda/Murshidabad (12m - 25m, floods >= 12.0m) */}
                      {seaLevelMeters >= 12.0 && (
                        <path
                          d="M 105 480 C 105 420, 140 380, 195 380 C 240 390, 270 430, 265 485 C 255 530, 220 550, 170 550 C 125 540, 105 515, 105 480 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 12.0) / 13.0) * 0.5)}
                        />
                      )}

                      {/* 2G. North Border: Kurigram & Lalmonirhat lower plains bordering Assam/Cooch Behar (14m - 30m, floods >= 14.0m) */}
                      {seaLevelMeters >= 14.0 && (
                        <path
                          d="M 325 255 C 325 195, 360 155, 415 155 C 460 165, 470 210, 455 255 C 435 290, 380 300, 345 290 C 330 280, 325 265, 325 255 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 14.0) / 16.0) * 0.5)}
                        />
                      )}

                      {/* 2H. East Border: Sylhet & Moulvibazar eastern border plains with Assam/Tripura (14m - 28m, floods >= 14.0m) */}
                      {seaLevelMeters >= 14.0 && (
                        <path
                          d="M 610 440 C 650 405, 700 405, 735 430 C 755 465, 745 515, 710 545 C 675 560, 630 550, 605 505 C 595 470, 600 450, 610 440 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 14.0) / 14.0) * 0.5)}
                        />
                      )}

                      {/* 2I. Northwest Border: Dinajpur, Nilphamari & Thakurgaon bordering West Bengal (25m - 55m, floods >= 25.0m) */}
                      {seaLevelMeters >= 25.0 && (
                        <path
                          d="M 165 270 C 165 195, 200 160, 255 160 C 310 170, 340 215, 330 275 C 310 320, 255 330, 195 320 C 175 305, 165 290, 165 270 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 25.0) / 30.0) * 0.5)}
                        />
                      )}

                      {/* 2J. Northern Meghalaya Border Escarpment: Sherpur & Jamalpur bordering Garo Hills (25m - 60m, floods >= 25.0m) */}
                      {seaLevelMeters >= 25.0 && (
                        <path
                          d="M 350 345 C 385 315, 445 315, 490 325 C 515 345, 505 385, 470 405 C 425 415, 375 405, 350 375 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 25.0) / 35.0) * 0.5)}
                        />
                      )}

                      {/* 2K. Northernmost Border Tip: Panchagarh border with West Bengal/Sikkim (45m - 75m, floods >= 45.0m) */}
                      {seaLevelMeters >= 45.0 && (
                        <path
                          d="M 135 165 C 135 90, 170 60, 225 60 C 265 70, 275 115, 260 165 C 235 195, 190 200, 155 190 C 140 180, 135 165, 135 165 Z"
                          fill="white"
                          opacity={Math.min(1, 0.5 + ((seaLevelMeters - 45.0) / 30.0) * 0.5)}
                        />
                      )}

                      {/* 3. LIGHT GREEN TERRAIN (0m - 10m MSL): Extends across coastal delta, Sundarbans & lower active river plains */}
                      {/* 3A. Zone 0-3m (Sundarbans, Coastal Delta & Estuarine Inlets) */}
                      {seaLevelMeters >= 1.0 &&
                        USGS_ELEVATION_ZONES.find((z) => z.id === '0-3')?.paths.map((p, idx) => (
                          <path
                            key={`mask-zone-0-3-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.7 + (seaLevelMeters / 3.0) * 0.3)}
                          />
                        ))}

                      {/* 3B. Zone 3-10m (Lower Active Delta Plains & River Estuaries - covers all LIGHT GREEN areas everywhere) */}
                      {seaLevelMeters >= 1.5 &&
                        USGS_ELEVATION_ZONES.find((z) => z.id === '3-10')?.paths.map((p, idx) => (
                          <path
                            key={`mask-zone-3-10-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.45 + ((seaLevelMeters - 1.5) / 8.5) * 0.55)}
                          />
                        ))}

                      {/* 4. DARK GREEN TERRAIN (10m - 75m MSL): Extends across central floodplains, Tista fan & inland terraces */}
                      {/* 4A. Zone 10-30m (Central Delta Floodplains & Tista Alluvial Fan - covers all DARK GREEN plains everywhere) */}
                      {seaLevelMeters >= 10.0 &&
                        USGS_ELEVATION_ZONES.find((z) => z.id === '10-30')?.paths.map((p, idx) => (
                          <path
                            key={`mask-zone-10-30-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.5 + ((seaLevelMeters - 10.0) / 20.0) * 0.5)}
                          />
                        ))}

                      {/* 4B. Zone 30-75m (Pleistocene Terraces - Barind & Madhupur Tracts) */}
                      {seaLevelMeters >= 30.0 &&
                        USGS_ELEVATION_ZONES.find((z) => z.id === '30-75')?.paths.map((p, idx) => (
                          <path
                            key={`mask-zone-30-75-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.5 + ((seaLevelMeters - 30.0) / 45.0) * 0.5)}
                          />
                        ))}

                      {/* 4C. Green Mountain Uplands & Piedmont Terraces (40m - 95m) */}
                      {seaLevelMeters >= 40.0 &&
                        GREEN_MOUNTAIN_ZONE.paths.map((p, idx) => (
                          <path
                            key={`mask-green-mtn-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.5 + ((seaLevelMeters - 40.0) / 55.0) * 0.5)}
                          />
                        ))}

                      {/* 5. YELLOW TERRAIN (75m - 300m MSL): Extends across foothills, tea gardens, uplands & midland ranges */}
                      {/* 5A. Zone 75-300m (Sylhet Hills & Chittagong Low Foothills) */}
                      {seaLevelMeters >= 75.0 &&
                        USGS_ELEVATION_ZONES.find((z) => z.id === '75-300')?.paths.map((p, idx) => (
                          <path
                            key={`mask-zone-75-300-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.55 + ((seaLevelMeters - 75.0) / 225.0) * 0.45)}
                          />
                        ))}

                      {/* 5B. Specific Yellow Mountain Zones across Sylhet, Top Dhaka, Rajshahi, Rangpur & Chattogram (100m - 300m) */}
                      {seaLevelMeters >= 100.0 &&
                        YELLOW_MOUNTAIN_ZONE.paths.map((p, idx) => (
                          <path
                            key={`mask-yellow-mtn-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.6 + ((seaLevelMeters - 100.0) / 200.0) * 0.4)}
                          />
                        ))}

                      {/* 6. RED TERRAIN (300m - 1,052m MSL): Extends across high strike ridges, scarps & highest summits */}
                      {/* 6A. Zone > 300m (Chittagong High Strike Ridges) */}
                      {seaLevelMeters >= 300.0 &&
                        USGS_ELEVATION_ZONES.find((z) => z.id === '> 300')?.paths.map((p, idx) => (
                          <path
                            key={`mask-zone-gt300-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.55 + ((seaLevelMeters - 300.0) / 752.0) * 0.45)}
                          />
                        ))}

                      {/* 6B. Specific Red High Mountains (400m - 1,052m) */}
                      {seaLevelMeters >= 400.0 &&
                        RED_MOUNTAIN_ZONE.paths.map((p, idx) => (
                          <path
                            key={`mask-red-mtn-${idx}`}
                            d={p}
                            fill="white"
                            opacity={Math.min(1, 0.6 + ((seaLevelMeters - 400.0) / 652.0) * 0.4)}
                          />
                        ))}

                      {/* 7. ALL FLOODED DISTRICT SUBDIVISIONS (Ensures every district sector and border tract floods seamlessly) */}
                      {subSectorMetrics.floodedSubdivisions.map((sub) => (
                        <circle
                          key={`mask-sub-${sub.id}`}
                          cx={sub.x}
                          cy={sub.y}
                          r={Math.max(26, sub.r * 1.8)}
                          fill="white"
                          opacity={Math.min(1, 0.65 + Math.min(1, (seaLevelMeters - sub.elevationMeters) / 3.0) * 0.35)}
                        />
                      ))}
                    </>
                  ) : null}
                </mask>
              </defs>

              {/* ---------------- SCIENTIFIC USGS ELEVATION & WATER SIMULATION LAYER ---------------- */}
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
                      {/* Continuous authentic ocean water surface over all flooded areas */}
                      <rect
                        x="0"
                        y="0"
                        width="896"
                        height="1200"
                        fill={seaLevelMeters > 50 ? 'url(#oceanDeepSubmersion)' : 'url(#oceanWater)'}
                        opacity={
                          isFullySubmerged
                            ? 1.0
                            : seaLevelMeters <= 0.5
                            ? 0.45 + (seaLevelMeters / 0.5) * 0.25
                            : seaLevelMeters <= 4.0
                            ? 0.70 + ((seaLevelMeters - 0.5) / 3.5) * 0.18
                            : 0.92
                        }
                      />

                      {/* Dynamic tidal wavefront crest foam along the advancing flood from below */}
                      {coastalWavefront.featherPath && (
                        <path
                          d={coastalWavefront.featherPath}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth={3}
                          strokeOpacity={0.8}
                          strokeDasharray="16 8"
                        />
                      )}

                      {/* USGS Scientific Elevation Contours Filled with Water as Sea Level Rises */}
                      {USGS_ELEVATION_ZONES.map((zone) => {
                        if (seaLevelMeters < zone.minMeters) return null;
                        const zoneDepth = seaLevelMeters - zone.minMeters;
                        const zoneOpacity = Math.min(
                          0.92,
                          0.5 + Math.min(1, zoneDepth / (zone.maxMeters - zone.minMeters || 10)) * 0.42
                        );
                        return (
                          <g key={`flood-zone-${zone.id}`}>
                            {zone.paths.map((p, i) => (
                              <path
                                key={`flood-poly-${zone.id}-${i}`}
                                d={p}
                                fill="url(#oceanWater)"
                                fillOpacity={zoneOpacity}
                                stroke="#0c445f"
                                strokeWidth={Math.min(8, 2 + Math.min(1, zoneDepth / 10) * 6)}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />
                            ))}
                          </g>
                        );
                      })}

                      {/* Submerged Green Mountain Deep Water Contours */}
                      {seaLevelMeters >= 40 &&
                        GREEN_MOUNTAIN_ZONE.paths.map((p, idx) => (
                          <path
                            key={`flood-water-green-mtn-${idx}`}
                            d={p}
                            fill="url(#oceanWater)"
                            fillOpacity={Math.min(0.92, 0.45 + ((seaLevelMeters - 40) / 55) * 0.47)}
                            stroke="#0c445f"
                            strokeWidth={2.5}
                            strokeLinejoin="round"
                          />
                        ))}

                      {/* Submerged Yellow Mountain Deep Water Contours */}
                      {seaLevelMeters >= 100 &&
                        YELLOW_MOUNTAIN_ZONE.paths.map((p, idx) => (
                          <path
                            key={`flood-water-yellow-mtn-${idx}`}
                            d={p}
                            fill="url(#oceanWater)"
                            fillOpacity={Math.min(0.95, 0.45 + ((seaLevelMeters - 100) / 200) * 0.5)}
                            stroke="#0c445f"
                            strokeWidth={3}
                            strokeLinejoin="round"
                          />
                        ))}

                      {/* Submerged Red Mountain Oceanic Deep Trench */}
                      {seaLevelMeters >= 400 &&
                        RED_MOUNTAIN_ZONE.paths.map((p, idx) => (
                          <path
                            key={`flood-water-red-mtn-${idx}`}
                            d={p}
                            fill="url(#oceanDeepSubmersion)"
                            fillOpacity={Math.min(0.98, 0.5 + ((seaLevelMeters - 400) / 600) * 0.48)}
                            stroke="#082b3d"
                            strokeWidth={4}
                            strokeLinejoin="round"
                          />
                        ))}
                    </g>
                  )}
                </g>
              )}

              {/* ---------------- 3. VERY SPECIFIC MOUNTAIN REGIONS (GREEN: 40-95m, YELLOW: 100-300m, RED: 400-1000m+) & 32 PRECISION SUBDIVISIONS ---------------- */}
              {showMountainOutlines && !showPopulationOverlay && (
                <g className="specific-mountain-outlines-layer pointer-events-auto">
                  {/* A. GREEN LOW UPLANDS & PIEDMONT REGION (40m - 95m): Sinks at 40m–95m */}
                  <g
                    className="green-mountains-group cursor-pointer"
                    onMouseEnter={() => setHoveredMountainZone('green')}
                    onMouseLeave={() => setHoveredMountainZone(null)}
                  >
                    {GREEN_MOUNTAIN_ZONE.paths.map((p, i) => (
                      <g key={`green-mtn-path-${i}`}>
                        {/* 1. Underlying Green Mountain Region (Rich Tinted Fill + Crisp Boundary) */}
                        <path
                          d={p}
                          fill={GREEN_MOUNTAIN_ZONE.fillColor}
                          stroke="#16a34a"
                          strokeWidth={hoveredMountainZone === 'green' ? 3.0 : 1.8}
                          filter={hoveredMountainZone === 'green' ? 'url(#greenMountainGlow)' : undefined}
                          strokeDasharray={greenMountainStatus.isSinking ? '5 2.5' : undefined}
                          className="transition-all duration-300"
                        />

                        {/* 2. Submerged Flood Water Overlay: Floods progressively between 40m and 95m */}
                        {seaLevelMeters >= 40 && (
                          <path
                            d={p}
                            fill="url(#oceanWater)"
                            fillOpacity={
                              greenMountainStatus.isFullySubmerged
                                ? 0.92
                                : Math.min(0.90, 0.45 + (greenMountainStatus.submergedPercent / 100) * 0.45)
                            }
                            stroke="#0c445f"
                            strokeWidth={greenMountainStatus.isFullySubmerged ? 3.5 : 1.8}
                            strokeLinejoin="round"
                          />
                        )}
                      </g>
                    ))}
                  </g>

                  {/* B. YELLOW MOUNTAIN ZONE (100m - 300m): Sinks at 100m–300m */}
                  <g
                    className="yellow-mountains-group cursor-pointer"
                    onMouseEnter={() => setHoveredMountainZone('yellow')}
                    onMouseLeave={() => setHoveredMountainZone(null)}
                  >
                    {YELLOW_MOUNTAIN_ZONE.paths.map((p, i) => (
                      <g key={`yellow-mtn-path-${i}`}>
                        {/* 1. Underlying Yellow Mountain Region (Rich Tinted Fill + Crisp Contour Line) */}
                        <path
                          d={p}
                          fill={YELLOW_MOUNTAIN_ZONE.fillColor}
                          stroke="#eab308"
                          strokeWidth={hoveredMountainZone === 'yellow' ? 3.2 : 2.0}
                          filter={hoveredMountainZone === 'yellow' ? 'url(#yellowMountainGlow)' : undefined}
                          strokeDasharray={yellowMountainStatus.isSinking ? '6 3' : undefined}
                          className="transition-all duration-300"
                        />

                        {/* 2. Submerged Flood Water Overlay: Floods progressively between 100m and 300m */}
                        {seaLevelMeters >= 100 && (
                          <path
                            d={p}
                            fill="url(#oceanWater)"
                            fillOpacity={
                              yellowMountainStatus.isFullySubmerged
                                ? 0.94
                                : Math.min(0.92, 0.45 + (yellowMountainStatus.submergedPercent / 100) * 0.48)
                            }
                            stroke="#0c445f"
                            strokeWidth={yellowMountainStatus.isFullySubmerged ? 4 : 2}
                            strokeLinejoin="round"
                          />
                        )}
                      </g>
                    ))}
                  </g>

                  {/* C. RED HIGH MOUNTAIN ZONE (400m - 1000m+): Sinks between 400m–1000m */}
                  <g
                    className="red-mountains-group cursor-pointer"
                    onMouseEnter={() => setHoveredMountainZone('red')}
                    onMouseLeave={() => setHoveredMountainZone(null)}
                  >
                    {RED_MOUNTAIN_ZONE.paths.map((p, i) => (
                      <g key={`red-mtn-path-${i}`}>
                        {/* 1. Underlying Red High Mountain Region (Rich Tinted Fill + Crisp Contour Line) */}
                        <path
                          d={p}
                          fill={RED_MOUNTAIN_ZONE.fillColor}
                          stroke="#dc2626"
                          strokeWidth={hoveredMountainZone === 'red' ? 3.5 : 2.2}
                          filter={hoveredMountainZone === 'red' ? 'url(#redMountainGlow)' : undefined}
                          strokeDasharray={redMountainStatus.isSinking ? '8 4' : undefined}
                          className="transition-all duration-300"
                        />

                        {/* 2. Submerged Ocean Trench Water Overlay: Floods progressively between 400m and 1000m */}
                        {seaLevelMeters >= 400 && (
                          <path
                            d={p}
                            fill="url(#oceanDeepSubmersion)"
                            fillOpacity={
                              redMountainStatus.isFullySubmerged
                                ? 0.98
                                : Math.min(0.95, 0.5 + (redMountainStatus.submergedPercent / 100) * 0.45)
                            }
                            stroke="#082b3d"
                            strokeWidth={redMountainStatus.isFullySubmerged ? 5 : 2.5}
                            strokeLinejoin="round"
                          />
                        )}
                      </g>
                    ))}
                  </g>

                  {/* D. 32 PRECISION MOUNTAIN SUBDIVISIONS INTERACTIVE NODES */}
                  <g className="precision-mountain-subdivisions-nodes">
                    {PRECISE_MOUNTAIN_SUBDIVISIONS.map((sub) => {
                      const isSubmerged = seaLevelMeters >= sub.elevationMeters;
                      const isRed = sub.mountainZone === 'red';
                      const isYellow = sub.mountainZone === 'yellow';
                      const color = isRed ? '#ef4444' : isYellow ? '#eab308' : '#22c55e';
                      const strokeColor = isRed ? '#991b1b' : isYellow ? '#854d0e' : '#14532d';

                      return (
                        <g
                          key={`mtn-sub-${sub.id}`}
                          transform={`translate(${sub.x}, ${sub.y})`}
                          className="cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMountainSubdivision(sub);
                          }}
                        >
                          {/* Pulsing ring if safe above water */}
                          {!isSubmerged && (
                            <circle
                              cx="0"
                              cy="0"
                              r={sub.r * 0.85}
                              fill="none"
                              stroke={color}
                              strokeWidth="1.2"
                              strokeDasharray="3 3"
                              opacity={0.7}
                            />
                          )}

                          {/* Base circle */}
                          <circle
                            cx="0"
                            cy="0"
                            r={sub.r * 0.65}
                            fill={isSubmerged ? '#082b3d' : color}
                            fillOpacity={isSubmerged ? 0.85 : 0.9}
                            stroke={isSubmerged ? '#38bdf8' : '#ffffff'}
                            strokeWidth="1.5"
                            className="group-hover:scale-125 transition-transform"
                          />

                          {/* Icon symbol */}
                          <text
                            x="0"
                            y="2.5"
                            textAnchor="middle"
                            fontSize="7"
                            fill="#ffffff"
                            fontWeight="bold"
                          >
                            {isSubmerged ? '🌊' : '▲'}
                          </text>

                          {/* Label pill */}
                          <g transform="translate(0, -12)" className="opacity-80 group-hover:opacity-100 transition-opacity">
                            <rect
                              x={-24}
                              y={-9}
                              width={48}
                              height={11}
                              rx={3}
                              fill={isSubmerged ? '#0f172a' : '#ffffff'}
                              fillOpacity={0.92}
                              stroke={strokeColor}
                              strokeWidth={0.8}
                            />
                            <text
                              x="0"
                              y="-1"
                              textAnchor="middle"
                              fontSize="6.5"
                              fontWeight="bold"
                              fill={isSubmerged ? '#38bdf8' : strokeColor}
                            >
                              {sub.elevationMeters}m
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>

                  {/* E. MOUNTAIN PEAK TRIANGLE PINS & ELEVATION LABELS (⛰️) */}
                  {/* Green Mountain Peaks (40-95m) */}
                  {GREEN_MOUNTAIN_ZONE.peaks.map((peak) => {
                    const isSubmerged = seaLevelMeters >= peak.elevationMeters;
                    return (
                      <g
                        key={`peak-green-${peak.id}`}
                        transform={`translate(${peak.x}, ${peak.y})`}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMountainPeak(peak);
                        }}
                      >
                        <circle cx="0" cy="0" r={isSubmerged ? 6 : 8} fill="#22c55e" opacity={0.3} />
                        <polygon
                          points="0,-7 6,4 -6,4"
                          fill={isSubmerged ? '#0c445f' : '#22c55e'}
                          stroke="#14532d"
                          strokeWidth="1.2"
                        />
                        <text
                          x="8"
                          y="2"
                          fill={isSubmerged ? '#94a3b8' : '#14532d'}
                          fontSize="7.5"
                          fontWeight="bold"
                          stroke="#ffffff"
                          strokeWidth="2.0"
                          paintOrder="stroke"
                        >
                          {peak.name.split(' (')[0]} ({peak.elevationMeters}m)
                        </text>
                      </g>
                    );
                  })}

                  {/* Yellow Mountain Peaks (100–300m) */}
                  {YELLOW_MOUNTAIN_ZONE.peaks.map((peak) => {
                    const isSubmerged = seaLevelMeters >= peak.elevationMeters;
                    return (
                      <g
                        key={`peak-yellow-${peak.id}`}
                        transform={`translate(${peak.x}, ${peak.y})`}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMountainPeak(peak);
                        }}
                      >
                        <circle cx="0" cy="0" r={isSubmerged ? 7 : 9} fill="#ca8a04" opacity={0.3} />
                        <polygon
                          points="0,-8 7,5 -7,5"
                          fill={isSubmerged ? '#0c445f' : '#facc15'}
                          stroke="#854d0e"
                          strokeWidth="1.2"
                        />
                        <text
                          x="9"
                          y="2"
                          fill={isSubmerged ? '#94a3b8' : '#713f12'}
                          fontSize="8"
                          fontWeight="bold"
                          stroke="#ffffff"
                          strokeWidth="2.2"
                          paintOrder="stroke"
                        >
                          {peak.name.split(' (')[0]} ({peak.elevationMeters}m)
                        </text>
                      </g>
                    );
                  })}

                  {/* Red Mountain Peaks (400–1000m+) */}
                  {RED_MOUNTAIN_ZONE.peaks.map((peak) => {
                    const isSubmerged = seaLevelMeters >= peak.elevationMeters;
                    return (
                      <g
                        key={`peak-red-${peak.id}`}
                        transform={`translate(${peak.x}, ${peak.y})`}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMountainPeak(peak);
                        }}
                      >
                        <circle cx="0" cy="0" r={isSubmerged ? 8 : 11} fill="#ef4444" opacity={0.35} />
                        <polygon
                          points="0,-10 9,6 -9,6"
                          fill={isSubmerged ? '#082b3d' : '#ef4444'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text
                          x="11"
                          y="2"
                          fill={isSubmerged ? '#94a3b8' : '#991b1b'}
                          fontSize="8.5"
                          fontWeight="bold"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          paintOrder="stroke"
                        >
                          ⛰️ {peak.name} ({peak.elevationMeters}m)
                        </text>
                      </g>
                    );
                  })}
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

          {/* 1/8th Sub-District Granular Topography Breakdown */}
          {selectedDistrictInfo && (
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1.5">
                <span>1/8th Sub-District Elevation Bands:</span>
                <span
                  className={
                    selectedDistrictStatus && selectedDistrictStatus.submergedSectorsCount > 0
                      ? 'text-rose-600'
                      : 'text-emerald-700'
                  }
                >
                  {selectedDistrictStatus
                    ? `${selectedDistrictStatus.submergedSectorsCount}/8 Submerged (${selectedDistrictStatus.floodedPercent}%)`
                    : '0/8 Submerged'}
                </span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1 text-[10px]">
                {selectedDistrictInfo.subdivisions.map((sub) => {
                  const isSubmerged = seaLevelMeters >= sub.elevationMeters;
                  return (
                    <div
                      key={sub.id}
                      className={`flex items-center justify-between px-1.5 py-0.5 rounded-md ${
                        isSubmerged ? 'bg-rose-50 text-rose-800 font-medium' : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="truncate max-w-[170px]" title={sub.sectorName}>
                        {sub.sectorName}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 font-mono">
                        <span>{sub.elevationMeters}m</span>
                        <span className={isSubmerged ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                          {isSubmerged ? '🌊 Submerged' : '🛡️ Safe'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

      {/* SELECTED MOUNTAIN PEAK MODAL (When peak pin is clicked on map) */}
      {selectedMountainPeak && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-slate-200 text-slate-800">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-2xl ${
                    selectedMountainPeak.elevationMeters >= 400
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-amber-100 text-amber-700 border border-amber-300'
                  }`}
                >
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {selectedMountainPeak.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedMountainPeak.bnName} · {selectedMountainPeak.district}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMountainPeak(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Elevation:</span>
                <span className="font-bold font-mono text-sky-800 text-sm">
                  {selectedMountainPeak.elevationMeters}m MSL
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mountain Range:</span>
                <span className="font-semibold text-slate-800">{selectedMountainPeak.rangeName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Zone Category:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    selectedMountainPeak.elevationMeters >= 400
                      ? 'bg-rose-100 text-rose-800'
                      : selectedMountainPeak.elevationMeters >= 100
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedMountainPeak.elevationMeters >= 400
                    ? 'Red Mountain (400–1000m)'
                    : selectedMountainPeak.elevationMeters >= 100
                    ? 'Yellow Mountain (100–300m)'
                    : 'Green Mountain (40–95m)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sinks At:</span>
                <span className="font-bold text-slate-800">
                  {selectedMountainPeak.elevationMeters >= 400
                    ? '400m – 1000m Sea Level'
                    : selectedMountainPeak.elevationMeters >= 100
                    ? '100m – 300m Sea Level'
                    : '40m – 95m Sea Level'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Current Status:</span>
                <span
                  className={`font-bold ${
                    seaLevelMeters >= selectedMountainPeak.elevationMeters
                      ? 'text-rose-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {seaLevelMeters >= selectedMountainPeak.elevationMeters
                    ? `🌊 Submerged (${(seaLevelMeters - selectedMountainPeak.elevationMeters).toFixed(1)}m underwater)`
                    : `✓ Above Water (+${(selectedMountainPeak.elevationMeters - seaLevelMeters).toFixed(1)}m remaining)`}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedMountainPeak(null)}
              className="mt-2 w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-fun font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SELECTED PRECISION MOUNTAIN SUBDIVISION MODAL */}
      {selectedMountainSubdivision && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-slate-200 text-slate-800">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-2xl ${
                    selectedMountainSubdivision.mountainZone === 'red'
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : selectedMountainSubdivision.mountainZone === 'yellow'
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {selectedMountainSubdivision.sectorName}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedMountainSubdivision.districtName} District · {selectedMountainSubdivision.division}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMountainSubdivision(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Elevation:</span>
                <span className="font-bold font-mono text-sky-800 text-sm">
                  {selectedMountainSubdivision.elevationMeters}m MSL
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Zone Category:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    selectedMountainSubdivision.mountainZone === 'red'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : selectedMountainSubdivision.mountainZone === 'yellow'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {selectedMountainSubdivision.mountainZone === 'red'
                    ? '🔴 Red High Mountain (400–1000m+)'
                    : selectedMountainSubdivision.mountainZone === 'yellow'
                    ? '🟡 Yellow Midland Range (100–300m)'
                    : '🟢 Green Upland Terrace (40–95m)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Subdivision Index:</span>
                <span className="font-mono text-slate-700 font-semibold">
                  Precision Sector #{selectedMountainSubdivision.sectorIndex + 1}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sector Population:</span>
                <span className="font-semibold text-slate-800">
                  {selectedMountainSubdivision.population.toLocaleString()} residents
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Submersion Level:</span>
                <span className="font-bold text-slate-800">
                  Sinks when sea level reaches {selectedMountainSubdivision.elevationMeters}m
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Current Status:</span>
                <span
                  className={`font-bold ${
                    seaLevelMeters >= selectedMountainSubdivision.elevationMeters
                      ? 'text-rose-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {seaLevelMeters >= selectedMountainSubdivision.elevationMeters
                    ? `🌊 Submerged (${(seaLevelMeters - selectedMountainSubdivision.elevationMeters).toFixed(1)}m underwater)`
                    : `🛡️ Safe Above Water (+${(selectedMountainSubdivision.elevationMeters - seaLevelMeters).toFixed(1)}m buffer)`}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedMountainSubdivision(null)}
              className="mt-2 w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-fun font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
