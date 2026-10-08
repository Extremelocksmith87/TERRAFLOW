import React, { useState, useEffect } from 'react';
import { CountryFloodData } from '../types/flood';
import { Waves, Snowflake, CloudRain, Sun, CloudDrizzle, CloudLightning, Play, Pause, RotateCcw, Users, Info } from 'lucide-react';
import {
  EXP_SLIDER_STEPS,
  valueToExponentialSlider,
  exponentialSliderToValue,
  parsePopulationInput
} from '../utils/sliderMath';

interface SimulationControlsProps {
  country: CountryFloodData;
  seaLevelMeters: number;
  onSeaLevelChange: (meters: number) => void;
  iceMeltPercent: number;
  onIceMeltChange: (percent: number) => void;
  displacedPopulation: number;
  onDisplacedPopulationChange: (displaced: number) => void;
  rainIntensity: number;
  onRainIntensityChange: (intensity: number) => void;
  floodedPercent: number;
  submergedAreaKm2: number;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  country,
  seaLevelMeters,
  onSeaLevelChange,
  iceMeltPercent,
  onIceMeltChange,
  displacedPopulation,
  onDisplacedPopulationChange,
  rainIntensity,
  onRainIntensityChange,
  floodedPercent,
  submergedAreaKm2
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const maxElev = country.highestPoint.elevationMeters || 1052;

  // Typable inputs states
  const [seaLevelText, setSeaLevelText] = useState(seaLevelMeters.toString());
  const [isSeaLevelFocused, setIsSeaLevelFocused] = useState(false);

  const [iceMeltText, setIceMeltText] = useState(iceMeltPercent.toString());
  const [isIceMeltFocused, setIsIceMeltFocused] = useState(false);

  const [displacedText, setDisplacedText] = useState(
    displacedPopulation === 0 ? '0' : (displacedPopulation / 1000000).toFixed(1)
  );
  const [isDisplacedFocused, setIsDisplacedFocused] = useState(false);

  useEffect(() => {
    if (!isSeaLevelFocused) setSeaLevelText(seaLevelMeters.toString());
  }, [seaLevelMeters, isSeaLevelFocused]);

  useEffect(() => {
    if (!isIceMeltFocused) setIceMeltText(iceMeltPercent.toString());
  }, [iceMeltPercent, isIceMeltFocused]);

  useEffect(() => {
    if (!isDisplacedFocused) {
      if (displacedPopulation === 0) setDisplacedText('0');
      else if (displacedPopulation >= 1000000) setDisplacedText((displacedPopulation / 1000000).toFixed(1));
      else setDisplacedText((displacedPopulation / 1000).toFixed(0) + 'k');
    }
  }, [displacedPopulation, isDisplacedFocused]);

  // Auto-play animation for sea level rise
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const currentSlider = valueToExponentialSlider(seaLevelMeters, maxElev, 7.8);
      if (currentSlider >= EXP_SLIDER_STEPS) {
        setIsPlaying(false);
        return;
      }
      const nextSlider = Math.min(EXP_SLIDER_STEPS, currentSlider + 8);
      const nextVal = exponentialSliderToValue(nextSlider, maxElev, 7.8, 'seaLevel');
      onSeaLevelChange(nextVal);
      onIceMeltChange(Math.min(100, Math.round((nextVal / 66) * 100)));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, seaLevelMeters, onSeaLevelChange, onIceMeltChange, maxElev]);

  // Quick preset scenarios
  const applyPreset = (seaMeters: number, icePct: number) => {
    onSeaLevelChange(seaMeters);
    onIceMeltChange(icePct);
  };

  // Convert displaced population to sea level using calibrated realistic demographic numbers
  const handleDisplacedSlider = (displaced: number) => {
    onDisplacedPopulationChange(displaced);
    if (displaced <= 0) {
      onSeaLevelChange(0);
      onIceMeltChange(0);
      return;
    }

    const maxElev = country.highestPoint?.elevationMeters || 1052;
    let targetSeaLevel = 0;
    if (displaced <= 1800000) {
      const fraction = displaced / 1800000;
      targetSeaLevel = Number(Math.sqrt(fraction).toFixed(2));
    } else if (displaced <= 6500000) {
      const t = (displaced - 1800000) / (6500000 - 1800000);
      targetSeaLevel = Number((1.0 + t * 1.0).toFixed(2));
    } else if (displaced <= 21000000) {
      const t = (displaced - 6500000) / (21000000 - 6500000);
      targetSeaLevel = Number((2.0 + t * 2.0).toFixed(2));
    } else if (displaced <= 68000000) {
      const t = (displaced - 21000000) / (68000000 - 21000000);
      targetSeaLevel = Number((4.0 + t * 4.0).toFixed(2));
    } else if (displaced <= 122000000) {
      const t = (displaced - 68000000) / (122000000 - 68000000);
      targetSeaLevel = Number((8.0 + t * 8.0).toFixed(1));
    } else if (displaced <= 152000000) {
      const t = (displaced - 122000000) / (152000000 - 122000000);
      targetSeaLevel = Number((16.0 + t * 14.0).toFixed(1));
    } else if (displaced <= 168500000) {
      const t = (displaced - 152000000) / (168500000 - 152000000);
      targetSeaLevel = Math.round(30.0 + t * 45.0);
    } else {
      const t = (displaced - 168500000) / (country.population - 168500000);
      targetSeaLevel = Math.round(75.0 + t * (maxElev - 75.0));
    }

    targetSeaLevel = Math.max(0, Math.min(maxElev, targetSeaLevel));
    onSeaLevelChange(targetSeaLevel);
    onIceMeltChange(Math.min(100, Math.round((targetSeaLevel / 66) * 100)));
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xl border-4 border-sky-200 flex flex-col gap-6">
      {/* Header with Metrics Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-sky-100 pb-4">
        <div>
          <h2 className="font-fun text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Waves className="w-6 h-6 text-sky-500" />
            Interactive Flood & Population Displacement Sliders
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Slide sea level, polar ice melt, or displaced citizens to see live geographical impact on {country.name}
          </p>
        </div>

        {/* Play/Pause & Reset buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'btn-cartoon-amber text-slate-900'
                : 'btn-cartoon-emerald text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                Pause Inundation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Auto-Rise Flood
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onSeaLevelChange(1);
              onIceMeltChange(0);
              onDisplacedPopulationChange(0);
            }}
            title="Reset to normal sea level"
            className="btn-cartoon-white p-2 rounded-2xl text-slate-600 hover:text-slate-900 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Sliders Grid: 3 Interactive Sliders (Sea Level, Ice Melt, Displaced Population) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider 1: Sea Level (0 - 1052m, Exponential scale) */}
        <div className="bg-sky-50/80 rounded-2xl p-4 border-2 border-sky-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="font-fun font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="p-1 rounded-xl bg-sky-200 text-sky-700">
                <Waves className="w-3.5 h-3.5" />
              </span>
              Sea Level (0 - {maxElev}m)
            </label>
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-sky-300 shadow-xs focus-within:ring-2 focus-within:ring-sky-400">
              <span className="text-xs font-bold text-sky-600">+</span>
              <input
                type="number"
                min="0"
                max={maxElev}
                step="any"
                value={seaLevelText}
                onFocus={() => setIsSeaLevelFocused(true)}
                onChange={(e) => {
                  setSeaLevelText(e.target.value);
                  const parsed = parseFloat(e.target.value);
                  if (!isNaN(parsed) && parsed >= 0) {
                    const clamped = Math.min(maxElev, parsed);
                    onSeaLevelChange(clamped);
                    onIceMeltChange(Math.min(100, Math.round((clamped / 66) * 100)));
                  }
                }}
                onBlur={() => {
                  setIsSeaLevelFocused(false);
                  const parsed = parseFloat(seaLevelText);
                  if (isNaN(parsed) || parsed < 0) {
                    setSeaLevelText(seaLevelMeters.toString());
                  } else {
                    const clamped = Math.min(maxElev, parsed);
                    onSeaLevelChange(clamped);
                    setSeaLevelText(clamped.toString());
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="w-14 font-mono text-xs font-bold text-sky-950 bg-transparent text-right outline-hidden"
              />
              <span className="text-xs font-bold text-sky-600">m</span>
            </div>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="0"
              max={EXP_SLIDER_STEPS}
              step="1"
              value={valueToExponentialSlider(seaLevelMeters, maxElev, 7.8)}
              onChange={(e) => {
                const val = exponentialSliderToValue(Number(e.target.value), maxElev, 7.8, 'seaLevel');
                onSeaLevelChange(val);
                const estimatedIce = Math.min(100, Math.round((val / 66) * 100));
                onIceMeltChange(estimatedIce);
              }}
              className="w-full h-3 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>0m</span>
            <span>0.8m</span>
            <span>2m</span>
            <span>12m</span>
            <span>66m</span>
            <span>{maxElev}m</span>
          </div>
        </div>

        {/* Slider 2: Ice Melt Percentage (0% - 100%, Exponential scale) */}
        <div className="bg-cyan-50/80 rounded-2xl p-4 border-2 border-cyan-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="font-fun font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="p-1 rounded-xl bg-cyan-200 text-cyan-800">
                <Snowflake className="w-3.5 h-3.5" />
              </span>
              Polar Ice Melt (%)
            </label>
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-cyan-300 shadow-xs focus-within:ring-2 focus-within:ring-cyan-400">
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={iceMeltText}
                onFocus={() => setIsIceMeltFocused(true)}
                onChange={(e) => {
                  setIceMeltText(e.target.value);
                  const parsed = parseFloat(e.target.value);
                  if (!isNaN(parsed) && parsed >= 0) {
                    const clamped = Math.min(100, parsed);
                    onIceMeltChange(clamped);
                    onSeaLevelChange(Number(((clamped / 100) * 66).toFixed(1)));
                  }
                }}
                onBlur={() => {
                  setIsIceMeltFocused(false);
                  const parsed = parseFloat(iceMeltText);
                  if (isNaN(parsed) || parsed < 0) {
                    setIceMeltText(iceMeltPercent.toString());
                  } else {
                    const clamped = Math.min(100, parsed);
                    onIceMeltChange(clamped);
                    setIceMeltText(clamped.toString());
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="w-12 font-mono text-xs font-bold text-cyan-950 bg-transparent text-right outline-hidden"
              />
              <span className="text-xs font-bold text-cyan-700">%</span>
            </div>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="0"
              max={EXP_SLIDER_STEPS}
              step="1"
              value={valueToExponentialSlider(iceMeltPercent, 100, 4.5)}
              onChange={(e) => {
                const pct = exponentialSliderToValue(Number(e.target.value), 100, 4.5, 'iceMelt');
                onIceMeltChange(pct);
                const mappedMeters = Number(((pct / 100) * 66).toFixed(1));
                onSeaLevelChange(mappedMeters);
              }}
              className="w-full h-3 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>0%</span>
            <span>1%</span>
            <span>5%</span>
            <span>25%</span>
            <span>50%</span>
            <span>100% (+66m)</span>
          </div>
        </div>

        {/* Slider 3: Displaced Population Slider (Exponential scale) */}
        <div className="bg-amber-50/80 rounded-2xl p-4 border-2 border-amber-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="font-fun font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="p-1 rounded-xl bg-amber-200 text-amber-800">
                <Users className="w-3.5 h-3.5" />
              </span>
              Displaced Population
            </label>
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-amber-300 shadow-xs focus-within:ring-2 focus-within:ring-amber-400">
              <input
                type="text"
                value={displacedText}
                onFocus={() => setIsDisplacedFocused(true)}
                onChange={(e) => {
                  setDisplacedText(e.target.value);
                  const parsed = parsePopulationInput(e.target.value, country.population);
                  handleDisplacedSlider(parsed);
                }}
                onBlur={() => {
                  setIsDisplacedFocused(false);
                  if (displacedPopulation === 0) setDisplacedText('0');
                  else if (displacedPopulation >= 1000000) setDisplacedText((displacedPopulation / 1000000).toFixed(1));
                  else setDisplacedText((displacedPopulation / 1000).toFixed(0) + 'k');
                }}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="w-16 font-mono text-xs font-bold text-amber-950 bg-transparent text-right outline-hidden"
              />
              <span className="text-xs font-bold text-amber-700">
                {displacedText.toLowerCase().endsWith('m') || displacedText.toLowerCase().endsWith('k') ? '' : 'M'}
              </span>
            </div>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="0"
              max={EXP_SLIDER_STEPS}
              step="1"
              value={valueToExponentialSlider(displacedPopulation, country.population, 6.0)}
              onChange={(e) => {
                const pop = exponentialSliderToValue(Number(e.target.value), country.population, 6.0, 'population');
                handleDisplacedSlider(pop);
              }}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>0</span>
            <span>500k</span>
            <span>2.5M</span>
            <span>15M</span>
            <span>50M</span>
            <span>{(country.population / 1000000).toFixed(0)}M (100%)</span>
          </div>
        </div>
      </div>

      {/* Rainfall Simulator Section */}
      <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-sky-600" />
            <h4 className="font-fun font-bold text-sm text-slate-800">
              Simulate Rainfall & Cloudbursts Over Map
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            Activate rain particle animation across the country
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onRainIntensityChange(0)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              rainIntensity === 0
                ? 'btn-cartoon-amber text-slate-900'
                : 'btn-cartoon-white text-slate-600'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            Clear
          </button>

          <button
            onClick={() => onRainIntensityChange(1)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              rainIntensity === 1
                ? 'btn-cartoon-primary text-white'
                : 'btn-cartoon-white text-slate-600'
            }`}
          >
            <CloudDrizzle className="w-4 h-4 text-sky-500" />
            Light Rain
          </button>

          <button
            onClick={() => onRainIntensityChange(2)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              rainIntensity === 2
                ? 'btn-cartoon-primary text-white'
                : 'btn-cartoon-white text-slate-600'
            }`}
          >
            <CloudRain className="w-4 h-4 text-blue-500" />
            Monsoon
          </button>

          <button
            onClick={() => onRainIntensityChange(3)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              rainIntensity === 3
                ? 'btn-cartoon-rose text-white'
                : 'btn-cartoon-white text-slate-600'
            }`}
          >
            <CloudLightning className="w-4 h-4 text-rose-500" />
            Torrential Storm
          </button>
        </div>
      </div>

      {/* Quick Scientific Benchmarks */}
      <div>
        <div className="font-fun font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          One-Click Sea Level Scenarios
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset(1, 2)}
            className="btn-cartoon-white px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            +1m High Tide Surge
          </button>
          <button
            onClick={() => applyPreset(7, 11)}
            className="btn-cartoon-white px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            +7m (Greenland Melt)
          </button>
          <button
            onClick={() => applyPreset(66, 100)}
            className="btn-cartoon-white px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            +66m (100% All Polar Ice Melt)
          </button>
          <button
            onClick={() => applyPreset(300, 100)}
            className="btn-cartoon-white px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            +300m Major Submersion
          </button>
          <button
            onClick={() => applyPreset(3000, 100)}
            className="btn-cartoon-rose px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
          >
            +3,000m (Max Extinction Flood)
          </button>
        </div>
      </div>

      {/* Real-Time Impact Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-sky-50 rounded-2xl p-3 border border-sky-200">
          <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wide">
            Submerged Land
          </div>
          <div className="font-fun text-xl font-bold text-sky-900 mt-1">
            {submergedAreaKm2.toLocaleString()} km²
          </div>
          <div className="text-xs text-sky-700 font-medium">
            {floodedPercent.toFixed(1)}% of total territory
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
            Displaced Citizens
          </div>
          <div className="font-fun text-xl font-bold text-amber-900 mt-1">
            {displacedPopulation > 1000000
              ? `${(displacedPopulation / 1000000).toFixed(1)} Million`
              : displacedPopulation.toLocaleString()}
          </div>
          <div className="text-xs text-amber-700 font-medium">
            {((displacedPopulation / country.population) * 100).toFixed(1)}% of national population
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
            Dry Highland Land
          </div>
          <div className="font-fun text-xl font-bold text-emerald-900 mt-1">
            {(Math.max(0, country.totalAreaKm2 - submergedAreaKm2)).toLocaleString()} km²
          </div>
          <div className="text-xs text-emerald-700 font-medium">
            {(100 - floodedPercent).toFixed(1)}% remaining safe
          </div>
        </div>
      </div>
    </div>
  );
};
