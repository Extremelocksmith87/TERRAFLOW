import React, { useState, useMemo, useEffect } from 'react';
import {
  WeatherMode,
  HISTORICAL_WEATHER_EVENTS,
  FUTURE_CLIMATE_PREDICTIONS,
  calculateWeatherFloodImpact,
  HistoricalWeatherEvent,
  FutureClimatePrediction,
  SCIENTIFIC_RESEARCH_SOURCES
} from '../data/rainfallCycloneData';
import { BANGLADESH_CITIES, BangladeshCity } from '../data/bangladeshCitiesData';
import { BangladeshRainfallMap } from './BangladeshRainfallMap';
import {
  CloudRain,
  Wind,
  Waves,
  Globe,
  Sliders,
  History,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  Info,
  Calendar,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  BookOpen,
  X
} from 'lucide-react';

interface RainfallDashboardProps {
  onGoHome: () => void;
  onGoToFloodSimulator: () => void;
  onOpenGuideModal: () => void;
}

export const RainfallDashboard: React.FC<RainfallDashboardProps> = ({
  onGoHome,
  onGoToFloodSimulator,
  onOpenGuideModal
}) => {
  // Primary simulation mode
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('monsoon');

  // Magnitudes
  const [rainMagnitudeMm, setRainMagnitudeMm] = useState<number>(250);
  const [cycloneCategory, setCycloneCategory] = useState<number>(3);

  // Typable input strings
  const [rainInputText, setRainInputText] = useState<string>('250');
  const [cycloneInputText, setCycloneInputText] = useState<string>('3');
  const [isRainInputFocused, setIsRainInputFocused] = useState<boolean>(false);
  const [isCycloneInputFocused, setIsCycloneInputFocused] = useState<boolean>(false);

  // Active historical event or future scenario selected
  const [selectedHistoricalEvent, setSelectedHistoricalEvent] = useState<HistoricalWeatherEvent | null>(null);
  const [selectedFuturePrediction, setSelectedFuturePrediction] = useState<FutureClimatePrediction | null>(null);

  // Sidebar active tab: 'controls' | 'history' | 'predictions'
  const [activeTab, setActiveTab] = useState<'controls' | 'history' | 'predictions'>('controls');

  // Research sources modal
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState<boolean>(false);

  // Selected district for details popup
  const [selectedDistrict, setSelectedDistrict] = useState<BangladeshCity | null>(null);

  // Auto-play animation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sync typable inputs when magnitudes change
  useEffect(() => {
    if (!isRainInputFocused) {
      setRainInputText(rainMagnitudeMm.toString());
    }
  }, [rainMagnitudeMm, isRainInputFocused]);

  useEffect(() => {
    if (!isCycloneInputFocused) {
      setCycloneInputText(cycloneCategory.toString());
    }
  }, [cycloneCategory, isCycloneInputFocused]);

  // Auto-play loop to demonstrate flood progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (weatherMode === 'cyclone') {
        setCycloneCategory((prev) => {
          const next = prev >= 5 ? 1 : prev + 1;
          setSelectedHistoricalEvent(null);
          setSelectedFuturePrediction(null);
          return next;
        });
      } else {
        setRainMagnitudeMm((prev) => {
          const max = weatherMode === 'light_rain' ? 50 : weatherMode === 'heavy_rain' ? 200 : 600;
          const min = weatherMode === 'light_rain' ? 10 : weatherMode === 'heavy_rain' ? 50 : 150;
          const step = weatherMode === 'light_rain' ? 5 : weatherMode === 'heavy_rain' ? 15 : 35;
          let next = prev + step;
          if (next > max) next = min;
          setSelectedHistoricalEvent(null);
          setSelectedFuturePrediction(null);
          return next;
        });
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying, weatherMode]);

  // Calculate hydrological flood impact
  const floodImpact = useMemo(() => {
    // If a historical event is active, prioritize its verified data
    if (selectedHistoricalEvent) {
      const surge = selectedHistoricalEvent.surgeMeters;
      const floodedZones: string[] = [];
      if (surge >= 2.0) floodedZones.push('0-3');
      if (surge >= 5.0) floodedZones.push('3-10');

      const count = selectedHistoricalEvent.affectedDistrictIds.length;
      // Realistic recorded historical inundation percentages from BWDB / BMD
      let floodedPercent = 0;
      if (selectedHistoricalEvent.id === 'bhola-1970') floodedPercent = 14.5;
      else if (selectedHistoricalEvent.id === 'monsoon-1988') floodedPercent = 60.0;
      else if (selectedHistoricalEvent.id === 'gorky-1991') floodedPercent = 12.0;
      else if (selectedHistoricalEvent.id === 'monsoon-1998') floodedPercent = 68.0;
      else if (selectedHistoricalEvent.id === 'sidr-2007') floodedPercent = 11.5;
      else if (selectedHistoricalEvent.id === 'aila-2009') floodedPercent = 5.2;
      else if (selectedHistoricalEvent.id === 'amphan-2020') floodedPercent = 8.5;
      else if (selectedHistoricalEvent.id === 'remal-2024') floodedPercent = 7.0;
      else floodedPercent = Number(((count / 64) * 45).toFixed(1));

      const estimatedFloodedAreaKm2 = Math.round((floodedPercent / 100) * 147570);

      return {
        atRiskDistrictIds: selectedHistoricalEvent.affectedDistrictIds,
        floodedZoneIds: floodedZones,
        equivalentSurgeMeters: surge,
        dangerLevel: (surge > 5 ? 'Catastrophic' : surge > 2 ? 'Severe' : 'Moderate') as 'Low' | 'Moderate' | 'Severe' | 'Catastrophic',
        floodedPercent,
        estimatedFloodedAreaKm2,
        estimatedAffectedPop: count * 850000
      };
    }

    return calculateWeatherFloodImpact(weatherMode, rainMagnitudeMm, cycloneCategory);
  }, [weatherMode, rainMagnitudeMm, cycloneCategory, selectedHistoricalEvent]);

  // Mode change handler
  const handleModeChange = (newMode: WeatherMode) => {
    setWeatherMode(newMode);
    setSelectedHistoricalEvent(null);
    setSelectedFuturePrediction(null);
    if (newMode === 'light_rain') {
      setRainMagnitudeMm(30);
    } else if (newMode === 'heavy_rain') {
      setRainMagnitudeMm(110);
    } else if (newMode === 'monsoon') {
      setRainMagnitudeMm(320);
    } else if (newMode === 'cyclone') {
      setCycloneCategory(3);
    }
  };

  // Typable handlers for Rainfall mm
  const handleRainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setRainInputText(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      const max = weatherMode === 'light_rain' ? 50 : weatherMode === 'heavy_rain' ? 200 : 600;
      const clamped = Math.max(0, Math.min(max, parsed));
      setRainMagnitudeMm(clamped);
      setSelectedHistoricalEvent(null);
      setSelectedFuturePrediction(null);
    }
  };

  const handleRainInputBlur = () => {
    setIsRainInputFocused(false);
    const parsed = parseFloat(rainInputText);
    const max = weatherMode === 'light_rain' ? 50 : weatherMode === 'heavy_rain' ? 200 : 600;
    const min = weatherMode === 'light_rain' ? 10 : weatherMode === 'heavy_rain' ? 50 : 150;
    if (isNaN(parsed) || parsed < min) {
      setRainMagnitudeMm(min);
      setRainInputText(min.toString());
    } else if (parsed > max) {
      setRainMagnitudeMm(max);
      setRainInputText(max.toString());
    } else {
      setRainMagnitudeMm(parsed);
      setRainInputText(parsed.toString());
    }
  };

  // Typable handlers for Cyclone Category
  const handleCycloneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCycloneInputText(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
      setCycloneCategory(parsed);
      setSelectedHistoricalEvent(null);
      setSelectedFuturePrediction(null);
    }
  };

  const handleCycloneInputBlur = () => {
    setIsCycloneInputFocused(false);
    const parsed = parseInt(cycloneInputText, 10);
    if (isNaN(parsed) || parsed < 1) {
      setCycloneCategory(1);
      setCycloneInputText('1');
    } else if (parsed > 5) {
      setCycloneCategory(5);
      setCycloneInputText('5');
    } else {
      setCycloneCategory(parsed);
      setCycloneInputText(parsed.toString());
    }
  };

  // Handle Historical Event Selection
  const handleSelectHistoricalEvent = (event: HistoricalWeatherEvent) => {
    setSelectedHistoricalEvent(event);
    setSelectedFuturePrediction(null);
    if (event.type === 'cyclone') {
      setWeatherMode('cyclone');
      // Estimate category from name/magnitude
      const cat = event.category?.includes('5') ? 5 : event.category?.includes('4') ? 4 : event.category?.includes('1') ? 1 : 3;
      setCycloneCategory(cat);
    } else if (event.type === 'monsoon') {
      setWeatherMode('monsoon');
      setRainMagnitudeMm(event.rainfallMm);
    } else {
      setWeatherMode('heavy_rain');
      setRainMagnitudeMm(event.rainfallMm);
    }
  };

  // Handle Future Climate Prediction Selection
  const handleSelectFuturePrediction = (pred: FutureClimatePrediction) => {
    setSelectedFuturePrediction(pred);
    setSelectedHistoricalEvent(null);
    setWeatherMode(pred.settings.mode);
    setRainMagnitudeMm(pred.settings.rainMagnitudeMm);
    setCycloneCategory(pred.settings.cycloneCategory);
  };

  // Reset simulation to baseline
  const handleResetSimulation = () => {
    setSelectedHistoricalEvent(null);
    setSelectedFuturePrediction(null);
    setWeatherMode('light_rain');
    setRainMagnitudeMm(15);
    setCycloneCategory(1);
    setSelectedDistrict(null);
    setIsPlaying(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#eef2f6] text-slate-800">
      {/* 1. SLIM TOP BAR (48px) */}
      <header className="h-12 bg-white/95 backdrop-blur-md border-b-2 border-sky-200 px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-xs">
            <CloudRain className="w-4 h-4" />
          </div>
          <span className="font-fun text-xl font-bold text-sky-700">TerraFlow</span>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1.5">
            <span>🌧️</span>
            <span>Bangladesh Rainfall & Cyclone Simulator</span>
          </span>
        </div>

        {/* Global Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSourcesModalOpen(true)}
            className="btn-cartoon-white px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-50"
            title="View Official Hydrological Research Sources (BMD, FFWC, BWDB, IPCC)"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Research Sources</span>
          </button>

          <button
            onClick={onGoHome}
            className="btn-cartoon-white px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-50"
            title="Return to Earth View"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Earth View</span>
          </button>

          <button
            onClick={onGoToFloodSimulator}
            className="btn-cartoon-white px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-50"
            title="Switch to Sea Level Rise & Floods Simulator"
          >
            <Waves className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">🌊 Sea Level Flooder</span>
          </button>

          <button
            onClick={onOpenGuideModal}
            className="btn-cartoon-emerald px-2.5 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Open Emergency Flood Guidelines"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flood Guide</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN STAGE: SIDE-BY-SIDE ON DESKTOP (Map on Left, Controls & Scenarios on Right) */}
      <main className="flex-1 min-h-0 flex flex-col md:flex-row p-2 sm:p-2.5 gap-2 sm:gap-2.5 overflow-hidden">
        {/* LEFT STAGE: THE BANGLADESH RAINFALL MAP (Responsive, fills available area) */}
        <div className="flex-1 h-full min-h-0 min-w-0 relative">
          <BangladeshRainfallMap
            weatherMode={weatherMode}
            rainMagnitudeMm={rainMagnitudeMm}
            cycloneCategory={cycloneCategory}
            atRiskDistrictIds={floodImpact.atRiskDistrictIds}
            floodedZoneIds={floodImpact.floodedZoneIds}
            equivalentSurgeMeters={floodImpact.equivalentSurgeMeters}
            dangerLevel={floodImpact.dangerLevel}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>

        {/* RIGHT STAGE: INTERACTIVE WEATHER CONTROLS & TIMELINES */}
        <div className="w-full md:w-96 lg:w-[420px] h-full min-h-0 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col overflow-hidden">
          {/* Header Tab Switcher: Controls, Past Disasters, Future Predictions */}
          <div className="p-2 border-b border-slate-200 bg-slate-50/80 shrink-0">
            <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('controls')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'controls'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Weather</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Past Events</span>
                {selectedHistoricalEvent && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('predictions')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'predictions'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Future 2100</span>
                {selectedFuturePrediction && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: WEATHER CONTROLS & MAGNITUDE */}
          {activeTab === 'controls' && (
            <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3.5 text-xs">
              {/* Active Event Banner (If Historical/Future Active) */}
              {selectedHistoricalEvent && (
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="font-bold text-rose-900 block text-[11px]">
                        Replaying: {selectedHistoricalEvent.name}
                      </span>
                      <span className="text-[10px] text-rose-700">
                        {selectedHistoricalEvent.magnitudeLabel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedHistoricalEvent(null)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-100"
                    title="Clear Historical Overlay"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {selectedFuturePrediction && (
                <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="font-bold text-sky-900 block text-[11px]">
                        Scenario: {selectedFuturePrediction.title}
                      </span>
                      <span className="text-[10px] text-sky-700">
                        {selectedFuturePrediction.cycloneIntensity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFuturePrediction(null)}
                    className="p-1 rounded-lg text-sky-500 hover:bg-sky-100"
                    title="Clear Future Scenario"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 4 WEATHER MODES (Light Rain, Heavy Rain, Monsoon, Cyclone) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Select Weather Hazard Mode:</span>
                  <span className="text-[10px] text-indigo-600 uppercase font-mono">
                    {weatherMode.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleModeChange('light_rain')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      weatherMode === 'light_rain'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>🌦️</span>
                      <span className="text-xs">Light Rain</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${weatherMode === 'light_rain' ? 'text-sky-100' : 'text-slate-400'}`}>
                      10 - 40 mm/day (Safe)
                    </div>
                  </button>

                  <button
                    onClick={() => handleModeChange('heavy_rain')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      weatherMode === 'heavy_rain'
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>🌧️</span>
                      <span className="text-xs">Heavy Rain</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${weatherMode === 'heavy_rain' ? 'text-indigo-100' : 'text-slate-400'}`}>
                      44 - 200 mm/day
                    </div>
                  </button>

                  <button
                    onClick={() => handleModeChange('monsoon')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      weatherMode === 'monsoon'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>🌊</span>
                      <span className="text-xs">Monsoon</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${weatherMode === 'monsoon' ? 'text-blue-100' : 'text-slate-400'}`}>
                      150 - 600 mm/day
                    </div>
                  </button>

                  <button
                    onClick={() => handleModeChange('cyclone')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      weatherMode === 'cyclone'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>🌀</span>
                      <span className="text-xs">Cyclone</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${weatherMode === 'cyclone' ? 'text-rose-100' : 'text-slate-400'}`}>
                      Category 1 - 5 Surge
                    </div>
                  </button>
                </div>

                {/* SCIENTIFIC METEOROLOGY CALLOUT BANNER */}
                <div className="bg-sky-50/90 border border-sky-200 p-2.5 rounded-2xl flex items-start gap-2 text-[11px] leading-tight mt-2">
                  <BookOpen className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sky-900 block mb-0.5">
                      {weatherMode === 'light_rain' && 'BMD Official Standard: Light Rain (<10–40 mm/day)'}
                      {weatherMode === 'heavy_rain' && 'BMD Standard: Heavy Downpour & Mountain Torrent Risk (44–200 mm/day)'}
                      {weatherMode === 'monsoon' && 'FFWC & BWDB Standard: Seasonal Monsoon Confluence (150–600 mm)'}
                      {weatherMode === 'cyclone' && 'IWM & BMD Standard: Bay of Bengal Storm Surge (Cat 1–5)'}
                    </span>
                    <span className="text-slate-600">
                      {weatherMode === 'light_rain' &&
                        'Regular daily precipitation is 100% absorbed by soils, agricultural fields, and natural drainage. Causes 0% riverine flood and 0% coastal surge.'}
                      {weatherMode === 'heavy_rain' &&
                        'Mountainous regions (Chittagong Hill Tracts — Bandarban, Rangamati, Khagrachhari, Cox’s Bazar — and Meghalaya/Assam foothill valleys) suffer the highest risk from heavy downpours. Steep slope gradients trigger rapid mountain stream torrents ("Pahari Dhol"), valley flash floods, and critical landslides. Heavy rain affects 5 to 18 districts across mountain tracts and foothill basins.'}
                      {weatherMode === 'monsoon' &&
                        'Driven by simultaneous cresting of the Brahmaputra, Ganges, and Meghna rivers (catchments 12x Bangladesh’s size). Floodplains naturally flood 20–22%; historic deluges (1998) reached 68%.'}
                      {weatherMode === 'cyclone' &&
                        'Tidal storm walls push inland strictly across the southern coastal belt and estuarine islands (2.5% to 20% land area); inland hills and northern plains remain dry.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* MAGNITUDE SELECTION */}
              {weatherMode === 'cyclone' ? (
                /* CYCLONE MAGNITUDE CONTROLS */
                <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-rose-600" />
                      Cyclone Magnitude (Category 1 to 5):
                    </span>
                    {/* Typable Input */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">Cat:</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="1"
                        value={cycloneInputText}
                        onChange={handleCycloneInputChange}
                        onFocus={() => setIsCycloneInputFocused(true)}
                        onBlur={handleCycloneInputBlur}
                        className="w-12 px-1.5 py-0.5 text-center font-bold font-mono text-sm bg-white rounded-lg border border-rose-300 text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>

                  {/* Category Buttons 1 - 5 */}
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCycloneCategory(cat);
                          setSelectedHistoricalEvent(null);
                          setSelectedFuturePrediction(null);
                        }}
                        className={`py-2 rounded-xl text-center font-bold transition-all cursor-pointer ${
                          cycloneCategory === cat
                            ? 'bg-rose-600 text-white shadow-md scale-105 ring-2 ring-rose-400'
                            : 'bg-white text-slate-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <div className="text-xs">Cat {cat}</div>
                        <div className="text-[9px] font-mono opacity-80">
                          {cat === 1 ? '1.6m' : cat === 2 ? '2.8m' : cat === 3 ? '4.5m' : cat === 4 ? '6.8m' : '9.2m'}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Cyclone Specs Display */}
                  <div className="bg-white p-2 rounded-xl border border-rose-100 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Wind Velocity</span>
                      <span className="font-bold font-mono text-slate-800">
                        {cycloneCategory === 1
                          ? '120 km/h'
                          : cycloneCategory === 2
                          ? '160 km/h'
                          : cycloneCategory === 3
                          ? '195 km/h'
                          : cycloneCategory === 4
                          ? '235 km/h'
                          : '260+ km/h'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Storm Surge</span>
                      <span className="font-bold font-mono text-rose-700">
                        +{floodImpact.equivalentSurgeMeters} meters
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Impact Severity</span>
                      <span className="font-bold text-rose-600">
                        {cycloneCategory >= 4 ? 'Devastating' : cycloneCategory >= 3 ? 'Destructive' : 'Substantial'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* RAIN MAGNITUDE CONTROLS (LIGHT RAIN / HEAVY RAIN / MONSOON) */
                <div className="bg-indigo-50/70 border border-indigo-200 p-3 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-indigo-600" />
                      Rainfall Magnitude (mm / day):
                    </span>
                    {/* Typable Input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max={weatherMode === 'light_rain' ? 50 : weatherMode === 'heavy_rain' ? 200 : 600}
                        step="5"
                        value={rainInputText}
                        onChange={handleRainInputChange}
                        onFocus={() => setIsRainInputFocused(true)}
                        onBlur={handleRainInputBlur}
                        className="w-16 px-1.5 py-0.5 text-center font-bold font-mono text-sm bg-white rounded-lg border border-indigo-300 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <span className="text-[11px] font-bold text-slate-500">mm</span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={weatherMode === 'light_rain' ? 5 : weatherMode === 'heavy_rain' ? 44 : 150}
                    max={weatherMode === 'light_rain' ? 40 : weatherMode === 'heavy_rain' ? 200 : 600}
                    step={weatherMode === 'light_rain' ? 1 : 5}
                    value={rainMagnitudeMm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setRainMagnitudeMm(val);
                      setSelectedHistoricalEvent(null);
                      setSelectedFuturePrediction(null);
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {weatherMode === 'light_rain' ? (
                      <>
                        {[10, 20, 30, 40].map((mm) => (
                          <button
                            key={mm}
                            onClick={() => setRainMagnitudeMm(mm)}
                            className={`py-1 rounded-lg text-center font-mono font-bold transition-all cursor-pointer ${
                              rainMagnitudeMm === mm
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 border border-indigo-200 hover:bg-indigo-100'
                            }`}
                          >
                            {mm}mm
                          </button>
                        ))}
                      </>
                    ) : weatherMode === 'heavy_rain' ? (
                      <>
                        {[60, 95, 140, 190].map((mm) => (
                          <button
                            key={mm}
                            onClick={() => setRainMagnitudeMm(mm)}
                            className={`py-1 rounded-lg text-center font-mono font-bold transition-all cursor-pointer ${
                              rainMagnitudeMm === mm
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 border border-indigo-200 hover:bg-indigo-100'
                            }`}
                          >
                            {mm}mm
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {[200, 320, 450, 560].map((mm) => (
                          <button
                            key={mm}
                            onClick={() => setRainMagnitudeMm(mm)}
                            className={`py-1 rounded-lg text-center font-mono font-bold transition-all cursor-pointer ${
                              rainMagnitudeMm === mm
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 border border-indigo-200 hover:bg-indigo-100'
                            }`}
                          >
                            {mm}mm
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* IMPACT SUMMARY CARD */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Simulated Inundation Impact:
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                      floodImpact.dangerLevel === 'Catastrophic'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : floodImpact.dangerLevel === 'Severe'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : floodImpact.dangerLevel === 'Moderate'
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {floodImpact.dangerLevel} Danger
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Alert Districts</span>
                    <span className="font-mono font-bold text-rose-600 text-sm">
                      {floodImpact.atRiskDistrictIds.length}
                    </span>
                    <span className="text-slate-500 text-[10px]"> / 64 Districts</span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Tidal / Runoff Depth</span>
                    <span className="font-mono font-bold text-sky-800 text-sm">
                      +{floodImpact.equivalentSurgeMeters}m
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Flooded Surface</span>
                    <span className="font-mono font-bold text-slate-800">
                      {floodImpact.estimatedFloodedAreaKm2.toLocaleString()} km²
                    </span>
                    <span className="text-slate-500 text-[10px]"> ({floodImpact.floodedPercent}%)</span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Vulnerable Citizens</span>
                    <span className="font-mono font-bold text-slate-800">
                      {(floodImpact.estimatedAffectedPop / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-slate-500 text-[10px]"> people</span>
                  </div>
                </div>

                {/* Mountain Downpour Focus Alert */}
                {weatherMode === 'heavy_rain' && (
                  <div className="bg-amber-50 border border-amber-300 p-2 rounded-xl text-[10px] text-amber-950 flex items-start gap-1.5 leading-snug">
                    <span className="text-base shrink-0">🏔️</span>
                    <span>
                      <strong>High Mountain Downpour Risk:</strong> Steep topography accelerates torrential runoff (&quot;Pahari Dhol&quot;), swelling mountain river gorges and triggering flash floods and mudslides across Chittagong Hill Tracts &amp; Sylhet foothills.
                    </span>
                  </div>
                )}

                {/* Simulation Control Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause Loop' : 'Auto Play Simulation'}</span>
                  </button>

                  <button
                    onClick={handleResetSimulation}
                    className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                    title="Reset to safe baseline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREVIOUS YEAR RAINS & CYCLONES (1970 - 2024) */}
          {activeTab === 'history' && (
            <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-rose-600" />
                  Past Weather Calamities in Bangladesh:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1970 – 2024</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                Click any historical calamity to simulate its recorded deluge, ocean surge, and affected districts on the map:
              </p>

              <div className="space-y-2">
                {HISTORICAL_WEATHER_EVENTS.map((event) => {
                  const isSelected = selectedHistoricalEvent?.id === event.id;
                  return (
                    <div
                      key={event.id}
                      onClick={() => handleSelectHistoricalEvent(event)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-400 shadow-md ring-1 ring-rose-300'
                          : 'bg-slate-50 hover:bg-rose-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              event.type === 'cyclone'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {event.type === 'cyclone' ? '🌀' : '🌧️'}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {event.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Year {event.year} · {event.magnitudeLabel}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 line-clamp-2 leading-snug">
                        {event.summary}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-rose-700 font-medium">💀 {event.casualties}</span>
                        <span className="text-slate-500 font-medium">
                          ⚠️ {event.affectedDistrictIds.length} Districts Flooded
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FUTURE RAINFALL PREDICTIONS (2030 - 2100) */}
          {activeTab === 'predictions' && (
            <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  IPCC Climate Model Predictions:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">2030 – 2100</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                Click any future prediction scenario to visualize projected deluge expansions and surge wall intensifications:
              </p>

              <div className="space-y-2">
                {FUTURE_CLIMATE_PREDICTIONS.map((pred) => {
                  const isSelected = selectedFuturePrediction?.year === pred.year;
                  return (
                    <div
                      key={pred.year}
                      onClick={() => handleSelectFuturePrediction(pred)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 border-sky-400 shadow-md ring-1 ring-sky-300'
                          : 'bg-slate-50 hover:bg-sky-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs font-mono">
                            {pred.year}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {pred.title}
                            </span>
                            <span className="text-[10px] text-sky-700 font-medium">
                              +{pred.projectedRainIncreasePercent}% Rain · +{pred.projectedSurgeIncreaseMeters}m Surge
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                        {pred.riskSummary}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">
                          Mode: {pred.settings.mode.replace('_', ' ')}
                        </span>
                        <span className="text-rose-600 font-bold">
                          ⚠️ {pred.vulnerableDistrictCount} / 64 Districts Vulnerable
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FOOTER QUICK STATS */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50/80 shrink-0 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Hydrology Engine Active</span>
            </span>
            <span className="font-mono text-[10px]">
              64 Districts · USGS SRTM Mesh
            </span>
          </div>
        </div>
      </main>

      {/* RESEARCH SOURCES MODAL */}
      {isSourcesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border-4 border-indigo-200 max-h-[85vh] flex flex-col animate-in fade-in">
            <div className="flex justify-between items-center border-b border-indigo-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-fun text-lg font-bold text-slate-900">
                    Official Hydrological Research Sources & Methodology
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scientific precipitation thresholds, flood return periods, and empirical disaster archives
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSourcesModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {SCIENTIFIC_RESEARCH_SOURCES.map((source, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{source.title}</span>
                    <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      {source.year}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-800">{source.organization}</div>
                  <p className="text-[11px] text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60">
                    {source.keyFinding}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-600">
                Data calibrated with Bangladesh Meteorological Department (BMD) & FFWC
              </span>
              <button
                onClick={() => setIsSourcesModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
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
