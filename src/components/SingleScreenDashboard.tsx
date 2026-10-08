import React, { useState, useEffect } from 'react';
import { CountryFloodData } from '../types/flood';
import { BangladeshSingleScreenMap } from './BangladeshSingleScreenMap';
import {
  EXP_SLIDER_STEPS,
  valueToExponentialSlider,
  exponentialSliderToValue,
  parsePopulationInput
} from '../utils/sliderMath';
import {
  Waves,
  Snowflake,
  Users,
  CloudRain,
  History,
  ShieldCheck,
  RotateCcw,
  Play,
  Pause,
  X,
  BookOpen,
  Globe,
  Sliders,
  Map,
  Edit3
} from 'lucide-react';

interface SingleScreenDashboardProps {
  country: CountryFloodData;
  seaLevelMeters: number;
  onSeaLevelChange: (meters: number) => void;
  iceMeltPercent: number;
  onIceMeltChange: (percent: number) => void;
  displacedPopulation: number;
  onDisplacedPopulationChange: (displaced: number) => void;
  showPopulationOverlay: boolean;
  onTogglePopulationOverlay: () => void;
  floodedPercent: number;
  submergedAreaKm2: number;
  submergedCities: string[];
  onOpenGuideModal: () => void;
  onGoHome?: () => void;
  onGoToRainfall?: () => void;
}

export const SingleScreenDashboard: React.FC<SingleScreenDashboardProps> = ({
  country,
  seaLevelMeters,
  onSeaLevelChange,
  iceMeltPercent,
  onIceMeltChange,
  displacedPopulation,
  onDisplacedPopulationChange,
  showPopulationOverlay,
  onTogglePopulationOverlay,
  floodedPercent,
  submergedAreaKm2,
  submergedCities,
  onOpenGuideModal,
  onGoHome,
  onGoToRainfall
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'history'>('none');
  const [mobileTab, setMobileTab] = useState<'both' | 'map' | 'sliders'>('both');

  // Country highest point elevation as the true 100% maximum flood ceiling
  const maxElev = country.highestPoint.elevationMeters || 1052;

  // Typable input string states
  const [seaLevelText, setSeaLevelText] = useState<string>(seaLevelMeters.toString());
  const [isSeaLevelFocused, setIsSeaLevelFocused] = useState<boolean>(false);

  const [iceMeltText, setIceMeltText] = useState<string>(iceMeltPercent.toString());
  const [isIceMeltFocused, setIsIceMeltFocused] = useState<boolean>(false);

  const [displacedText, setDisplacedText] = useState<string>(
    displacedPopulation === 0 ? '0' : (displacedPopulation / 1000000).toFixed(1)
  );
  const [isDisplacedFocused, setIsDisplacedFocused] = useState<boolean>(false);

  // Synchronize input fields when props change from sliders or external triggers
  useEffect(() => {
    if (!isSeaLevelFocused) {
      setSeaLevelText(seaLevelMeters.toString());
    }
  }, [seaLevelMeters, isSeaLevelFocused]);

  useEffect(() => {
    if (!isIceMeltFocused) {
      setIceMeltText(iceMeltPercent.toString());
    }
  }, [iceMeltPercent, isIceMeltFocused]);

  useEffect(() => {
    if (!isDisplacedFocused) {
      if (displacedPopulation === 0) {
        setDisplacedText('0');
      } else if (displacedPopulation >= 1000000) {
        setDisplacedText((displacedPopulation / 1000000).toFixed(1));
      } else {
        setDisplacedText((displacedPopulation / 1000).toFixed(0) + 'k');
      }
    }
  }, [displacedPopulation, isDisplacedFocused]);

  // Auto-play flood animation gracefully flowing from low sea level to high elevations
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (seaLevelMeters >= maxElev) {
        setIsPlaying(false);
        return;
      }

      let nextVal: number;
      if (seaLevelMeters < 1.0) {
        // Below 1m: advance reliably by 0.1m each tick (prevents getting stuck or failing at < 1m)
        nextVal = Number((Math.max(0, seaLevelMeters) + 0.1).toFixed(1));
      } else if (seaLevelMeters < 5.0) {
        // 1m to 5m: smooth 0.2m progression
        nextVal = Number((seaLevelMeters + 0.2).toFixed(1));
      } else if (seaLevelMeters < 25.0) {
        // 5m to 25m: 0.5m progression
        nextVal = Number((seaLevelMeters + 0.5).toFixed(1));
      } else {
        // Above 25m: exponential scaling to cover all mountain elevations
        const currentSlider = valueToExponentialSlider(seaLevelMeters, maxElev, 7.8);
        const nextSlider = Math.min(EXP_SLIDER_STEPS, currentSlider + 8);
        nextVal = exponentialSliderToValue(nextSlider, maxElev, 7.8, 'seaLevel');
        if (nextVal <= seaLevelMeters) {
          nextVal = Math.round(seaLevelMeters + 1);
        }
      }

      if (nextVal >= maxElev) {
        onSeaLevelChange(maxElev);
        onIceMeltChange(100);
        setIsPlaying(false);
        return;
      }

      onSeaLevelChange(nextVal);
      onIceMeltChange(Math.min(100, Math.round((nextVal / 66) * 100)));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, seaLevelMeters, onSeaLevelChange, onIceMeltChange, maxElev]);

  // Convert displaced population slider value to sea level using calibrated real numbers
  const handleDisplacedSlider = (displaced: number) => {
    onDisplacedPopulationChange(displaced);
    if (displaced <= 0) {
      onSeaLevelChange(0);
      onIceMeltChange(0);
      return;
    }

    let targetSeaLevel = 0;
    if (displaced <= 16500000) {
      // 0 to 1m SLR (up to 16.5M displaced from intertidal chars, polders & coastal delta fringe)
      const fraction = displaced / 16500000;
      targetSeaLevel = Number(Math.pow(fraction, 1 / 1.6).toFixed(2));
    } else if (displaced <= 31000000) {
      // 1 to 2m SLR (16.5M to 31.0M displaced)
      const t = (displaced - 16500000) / (31000000 - 16500000);
      targetSeaLevel = Number((1.0 + t * 1.0).toFixed(2));
    } else if (displaced <= 52000000) {
      // 2 to 4m SLR (31.0M to 52.0M displaced, reaches Barishal & Patuakhali at 4m)
      const t = (displaced - 31000000) / (52000000 - 31000000);
      targetSeaLevel = Number((2.0 + t * 2.0).toFixed(2));
    } else if (displaced <= 92000000) {
      // 4 to 8m SLR (52.0M to 92.0M displaced, reaches Dhaka at 8m)
      const t = (displaced - 52000000) / (92000000 - 52000000);
      targetSeaLevel = Number((4.0 + t * 4.0).toFixed(2));
    } else if (displaced <= 136000000) {
      // 8 to 16m SLR (92M to 136M displaced, reaches Kushtia at 16m)
      const t = (displaced - 92000000) / (136000000 - 92000000);
      targetSeaLevel = Number((8.0 + t * 8.0).toFixed(1));
    } else if (displaced <= 158000000) {
      // 16 to 30m SLR (136M to 158M displaced, reaches Sylhet city at 22m)
      const t = (displaced - 136000000) / (158000000 - 136000000);
      targetSeaLevel = Number((16.0 + t * 14.0).toFixed(1));
    } else if (displaced <= 169500000) {
      // 30 to 75m SLR (158M to 169.5M displaced)
      const t = (displaced - 158000000) / (169500000 - 158000000);
      targetSeaLevel = Math.round(30.0 + t * 45.0);
    } else {
      // 75m to 1052m SLR (169.5M to 173M displaced)
      const t = (displaced - 169500000) / (country.population - 169500000);
      targetSeaLevel = Math.round(75.0 + t * (maxElev - 75.0));
    }

    targetSeaLevel = Math.max(0, Math.min(maxElev, targetSeaLevel));
    onSeaLevelChange(targetSeaLevel);
    onIceMeltChange(Math.min(100, Math.round((targetSeaLevel / 66) * 100)));
  };

  // Typable handlers for Sea Level
  const handleSeaLevelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    setSeaLevelText(rawStr);
    const parsed = parseFloat(rawStr);
    if (!isNaN(parsed) && parsed >= 0) {
      const clamped = Math.min(maxElev, parsed);
      onSeaLevelChange(clamped);
      onIceMeltChange(Math.min(100, Math.round((clamped / 66) * 100)));
    }
  };

  const handleSeaLevelInputBlur = () => {
    setIsSeaLevelFocused(false);
    const parsed = parseFloat(seaLevelText);
    if (isNaN(parsed) || parsed < 0) {
      setSeaLevelText(seaLevelMeters.toString());
    } else {
      const clamped = Math.min(maxElev, parsed);
      onSeaLevelChange(clamped);
      setSeaLevelText(clamped.toString());
    }
  };

  // Typable handlers for Ice Melt
  const handleIceMeltInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    setIceMeltText(rawStr);
    const parsed = parseFloat(rawStr);
    if (!isNaN(parsed) && parsed >= 0) {
      const clamped = Math.min(100, parsed);
      onIceMeltChange(clamped);
      onSeaLevelChange(Number(((clamped / 100) * 66).toFixed(1)));
    }
  };

  const handleIceMeltInputBlur = () => {
    setIsIceMeltFocused(false);
    const parsed = parseFloat(iceMeltText);
    if (isNaN(parsed) || parsed < 0) {
      setIceMeltText(iceMeltPercent.toString());
    } else {
      const clamped = Math.min(100, parsed);
      onIceMeltChange(clamped);
      setIceMeltText(clamped.toString());
    }
  };

  // Typable handlers for Displaced Population
  const handleDisplacedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    setDisplacedText(rawStr);
    const parsed = parsePopulationInput(rawStr, country.population);
    handleDisplacedSlider(parsed);
  };

  const handleDisplacedInputBlur = () => {
    setIsDisplacedFocused(false);
    if (displacedPopulation === 0) {
      setDisplacedText('0');
    } else if (displacedPopulation >= 1000000) {
      setDisplacedText((displacedPopulation / 1000000).toFixed(1));
    } else {
      setDisplacedText((displacedPopulation / 1000).toFixed(0) + 'k');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#eef2f6] text-slate-800">
      {/* 1. Slim Top Bar (48px) */}
      <header className="h-12 bg-white/95 backdrop-blur-md border-b-2 border-sky-200 px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-400 flex items-center justify-center text-white shadow-xs">
            <Waves className="w-4 h-4" />
          </div>
          <span className="font-fun text-xl font-bold text-sky-600">TerraFlow</span>
          <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
            🇧🇩 Bangladesh Flood Simulator
          </span>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="btn-cartoon-white px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
              title="Return to Main Menu"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          )}

          {onGoToRainfall && (
            <button
              onClick={onGoToRainfall}
              className="btn-cartoon-white px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
              title="Open Rainfall & Cyclone Simulator"
            >
              <CloudRain className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Rain & Cyclones</span>
            </button>
          )}

          {/* Mobile View Toggle (Visible only on small screens) */}
          <div className="flex md:hidden bg-slate-100 p-0.5 rounded-xl border border-slate-300">
            <button
              onClick={() => setMobileTab('map')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                mobileTab === 'map' ? 'bg-sky-600 text-white' : 'text-slate-700'
              }`}
            >
              <Map className="w-3 h-3" /> Map
            </button>
            <button
              onClick={() => setMobileTab('sliders')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                mobileTab === 'sliders' ? 'bg-sky-600 text-white' : 'text-slate-700'
              }`}
            >
              <Sliders className="w-3 h-3" /> Sliders
            </button>
          </div>

          <button
            onClick={() => setActiveModal('history')}
            className="btn-cartoon-white px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
          >
            <History className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Flood History</span>
          </button>

          <button
            onClick={onOpenGuideModal}
            className="btn-cartoon-emerald px-2.5 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flood Guide (30 Dos & 10 Don'ts)</span>
            <span className="sm:hidden">Guide</span>
          </button>
        </div>
      </header>

      {/* 2. Main Screen: SIDE-BY-SIDE ON DESKTOP (Map on Left, Sliders NEXT TO IT on Right) */}
      <main className="flex-1 min-h-0 flex flex-col md:flex-row p-2 sm:p-2.5 gap-2 sm:gap-2.5 overflow-hidden">
        {/* LEFT / CENTER STAGE: THE BANGLADESH MAP (Large, prominent, fills all available space) */}
        <div
          className={`flex-1 h-full min-h-0 min-w-0 relative ${
            mobileTab === 'sliders' ? 'hidden md:block' : 'block'
          }`}
        >
          <BangladeshSingleScreenMap
            seaLevelMeters={seaLevelMeters}
            iceMeltPercent={iceMeltPercent}
            showPopulationOverlay={showPopulationOverlay}
            onTogglePopulationOverlay={onTogglePopulationOverlay}
            floodedPercent={floodedPercent}
            submergedCities={submergedCities}
          />
        </div>

        {/* RIGHT STAGE: THE SLIDERS NEXT TO THE MAP (Always visible side-by-side, no scrolling needed) */}
        <div
          className={`w-full md:w-[370px] lg:w-[410px] h-full shrink-0 flex flex-col bg-white rounded-3xl p-3.5 shadow-xl border-4 border-sky-200 overflow-y-auto space-y-3 ${
            mobileTab === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header of Sliders Deck */}
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <h2 className="font-fun text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-sky-600" />
              Flood & Sea Level Sliders
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (!isPlaying && seaLevelMeters >= maxElev) {
                    onSeaLevelChange(0);
                    onIceMeltChange(0);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                  isPlaying
                    ? 'btn-cartoon-amber text-slate-900'
                    : 'btn-cartoon-emerald text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Auto Flood'}</span>
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  onSeaLevelChange(0);
                  onIceMeltChange(0);
                  onDisplacedPopulationChange(0);
                }}
                title="Reset to 0m Baseline"
                className="btn-cartoon-white p-1 rounded-xl text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SLIDER 1: SEA LEVEL RISE (Exponential scale: 0, 0.1m, 0.2m, 0.4m, 0.8m... 1052m) */}
          <div className="bg-sky-50 rounded-2xl p-3 border-2 border-sky-200 shadow-xs">
            <div className="flex justify-between items-center mb-1.5 gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 shrink-0">
                <Waves className="w-3.5 h-3.5 text-sky-600" />
                Sea Level Rise
              </span>
              {/* Typable Input Box */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-sky-300 shadow-xs focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-sky-400 transition-all">
                <span className="text-xs font-bold text-sky-600 select-none">+</span>
                <input
                  type="number"
                  min="0"
                  max={maxElev}
                  step="any"
                  value={seaLevelText}
                  onFocus={() => setIsSeaLevelFocused(true)}
                  onChange={handleSeaLevelInputChange}
                  onBlur={handleSeaLevelInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  className="w-14 font-mono text-xs font-bold text-sky-950 bg-transparent text-right outline-hidden"
                  title="Type exact sea level in meters"
                  placeholder="0"
                />
                <span className="text-xs font-bold text-sky-600 select-none">m</span>
              </div>
            </div>

            {/* Exponential Slider */}
            <input
              type="range"
              min="0"
              max={EXP_SLIDER_STEPS}
              step="1"
              value={valueToExponentialSlider(seaLevelMeters, maxElev, 7.8)}
              onChange={(e) => {
                const val = exponentialSliderToValue(Number(e.target.value), maxElev, 7.8, 'seaLevel');
                onSeaLevelChange(val);
                if (val === 0) {
                  onIceMeltChange(0);
                } else {
                  onIceMeltChange(Math.min(100, Math.round((val / 66) * 100)));
                }
              }}
              className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 select-none">
              <span>0m</span>
              <span>0.8m</span>
              <span>2m</span>
              <span>12m</span>
              <span>66m</span>
              <span>{maxElev.toLocaleString()}m</span>
            </div>
            <div className="text-[9px] text-sky-600 font-medium flex items-center justify-between mt-0.5">
              <span>Exponential curve (0.1m - {maxElev}m)</span>
              <span className="italic text-slate-400">Click box to type</span>
            </div>
          </div>

          {/* SLIDER 2: POLAR ICE MELT (%) (Real Numbers & Typable) */}
          <div className="bg-cyan-50 rounded-2xl p-3 border-2 border-cyan-200 shadow-xs">
            <div className="flex justify-between items-center mb-1.5 gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 shrink-0">
                <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                Polar Ice Melt
              </span>
              {/* Typable Input Box */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-cyan-300 shadow-xs focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 transition-all">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={iceMeltText}
                  onFocus={() => setIsIceMeltFocused(true)}
                  onChange={handleIceMeltInputChange}
                  onBlur={handleIceMeltInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  className="w-12 font-mono text-xs font-bold text-cyan-950 bg-transparent text-right outline-hidden"
                  title="Type exact polar ice melt percentage"
                  placeholder="0"
                />
                <span className="text-xs font-bold text-cyan-700 select-none">%</span>
              </div>
            </div>

            {/* Direct Real-Number Linear Slider (0% - 100%) */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={iceMeltPercent}
              onChange={(e) => {
                const pct = parseFloat(e.target.value);
                onIceMeltChange(pct);
                if (pct === 0) {
                  onSeaLevelChange(0);
                } else {
                  onSeaLevelChange(Number(((pct / 100) * 66).toFixed(1)));
                }
              }}
              className="w-full h-2.5 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 select-none">
              <span>0%</span>
              <span>20%</span>
              <span>40%</span>
              <span>60%</span>
              <span>80%</span>
              <span>100% (+66m)</span>
            </div>
            <div className="text-[9px] text-cyan-700 font-medium flex items-center justify-between mt-0.5">
              <span>Linear scale (0% - 100%) · 100% melt = +66m seas</span>
              <span className="italic text-slate-400">Click box to type</span>
            </div>
          </div>

          {/* SLIDER 3: DISPLACED POPULATION SLIDER (Real Numbers & Typable) */}
          <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 shadow-xs">
            <div className="flex justify-between items-center mb-1.5 gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 shrink-0">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                Displaced People
              </span>
              {/* Typable Input Box */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-amber-300 shadow-xs focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                <input
                  type="text"
                  value={displacedText}
                  onFocus={() => setIsDisplacedFocused(true)}
                  onChange={handleDisplacedInputChange}
                  onBlur={handleDisplacedInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  className="w-16 font-mono text-xs font-bold text-amber-950 bg-transparent text-right outline-hidden"
                  title="Type displaced people (e.g. 500k, 1.5M, 25M)"
                  placeholder="0"
                />
                <span className="text-xs font-bold text-amber-700 select-none">
                  {displacedPopulation === 0 || displacedText === '0' || displacedText.toLowerCase().endsWith('m') || displacedText.toLowerCase().endsWith('k') ? '' : 'M'}
                </span>
              </div>
            </div>

            {/* Direct Real-Number Slider (0 to 173 Million people) */}
            <input
              type="range"
              min="0"
              max={country.population}
              step="25000"
              value={displacedPopulation}
              onChange={(e) => {
                const pop = parseFloat(e.target.value);
                handleDisplacedSlider(pop);
              }}
              className="w-full h-2.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 select-none">
              <span>0</span>
              <span>25M</span>
              <span>50M</span>
              <span>75M</span>
              <span>100M</span>
              <span>135M</span>
              <span>173M</span>
            </div>
            <div className="text-[9px] text-amber-700 font-medium flex items-center justify-between mt-0.5">
              <span>
                {displacedPopulation === 0
                  ? '0 displaced'
                  : displacedPopulation >= 1000000
                  ? `${(displacedPopulation / 1000000).toFixed(1)}M (${((displacedPopulation / country.population) * 100).toFixed(1)}% of Bangladesh)`
                  : `${(displacedPopulation / 1000).toFixed(0)}k (${((displacedPopulation / country.population) * 100).toFixed(2)}% of Bangladesh)`}
              </span>
              <span className="italic text-slate-400">Click box to type</span>
            </div>
          </div>

          {/* QUICK BENCHMARKS */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                onSeaLevelChange(0);
                onIceMeltChange(0);
                onDisplacedPopulationChange(0);
              }}
              className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold"
            >
              0m (Safe)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(1);
                onIceMeltChange(2);
              }}
              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-bold"
            >
              +1m (Tidal)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(7);
                onIceMeltChange(11);
              }}
              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-bold"
            >
              +7m (Greenland)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(66);
                onIceMeltChange(100);
              }}
              className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold"
            >
              +66m (All Ice)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(150);
                onIceMeltChange(100);
              }}
              title="Yellow Mountains Sinking (100m–300m): Foothills & midland ridges sink"
              className="px-2 py-1 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-950 text-[10px] font-bold border border-yellow-300"
            >
              🟡 150m (Yellow Sinking)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(300);
                onIceMeltChange(100);
              }}
              title="Yellow Mountains Submerged: All 100m–300m yellow mountains submerged; red mountains stay above water"
              className="px-2 py-1 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-yellow-950 text-[10px] font-bold border border-yellow-400"
            >
              🟡 300m (Yellow Sunk)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(600);
                onIceMeltChange(100);
              }}
              title="Red Mountains Sinking (400m–1000m): High strike ridges drowning; highest peaks still above water"
              className="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 text-[10px] font-bold border border-rose-300"
            >
              🔴 600m (Red Sinking)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(1000);
                onIceMeltChange(100);
              }}
              title="Red Mountains Submerged (1000m): Almost entire country sunk; only Saka Haphong peak summit stands"
              className="px-2 py-1 rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-950 text-[10px] font-bold border border-rose-400"
            >
              🔴 1000m (Red Sunk)
            </button>
            <button
              onClick={() => {
                onSeaLevelChange(maxElev);
                onIceMeltChange(100);
                onDisplacedPopulationChange(country.population);
              }}
              title="Completely submerge all 64 districts, all borders, and the entirety of Bangladesh under the Bay of Bengal ocean"
              className="px-2.5 py-1 rounded-lg bg-[#0c445f] hover:bg-[#082f42] text-white text-[10px] font-bold shadow-sm flex items-center gap-1 ring-1 ring-sky-400"
            >
              🌊 100% Ocean (+{maxElev}m Peak)
            </button>
          </div>

          {/* LIVE IMPACT COUNTER CARD */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-sky-50 rounded-2xl p-2.5 border border-sky-200">
              <div className="text-[10px] font-bold text-sky-700 uppercase">Submerged Area</div>
              <div className="font-fun text-base font-bold text-sky-950 mt-0.5">
                {submergedAreaKm2.toLocaleString()} km²
              </div>
              <div className="text-[10px] text-sky-600 font-medium">
                {floodedPercent.toFixed(1)}% of Bangladesh
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-2.5 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Safe High Ground</div>
              <div className="font-fun text-base font-bold text-emerald-950 mt-0.5">
                {(Math.max(0, country.totalAreaKm2 - submergedAreaKm2)).toLocaleString()} km²
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                {(100 - floodedPercent).toFixed(1)}% safe
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP: FLOOD HISTORY MODAL */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl border-4 border-sky-300 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-sky-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-sky-600" />
                <h3 className="font-fun text-xl font-bold text-slate-900">
                  Chronicles of Bangladesh Flood History
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {country.floodHistoryParagraphs.map((para, i) => (
                <div key={i} className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-slate-700 leading-relaxed text-sm">
                  <strong className="text-sky-800 block mb-1">Historical Chapter 0{i + 1}</strong>
                  {para}
                </div>
              ))}

              <div className="space-y-2 pt-2">
                <span className="font-fun font-bold text-slate-900 text-sm block">Catastrophic Landmarks</span>
                {country.historicalFloods.map((ev, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800 text-sm">
                      <span>{ev.year} · {ev.name}</span>
                      <span className="text-rose-600">{ev.casualties}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{ev.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
