import React from 'react';
import { Waves, CloudRain, ShieldCheck, Globe, Compass, ArrowRight, Sparkles } from 'lucide-react';
import earthDaylightImg from '../assets/images/lively_earth_daylight_1791129540327.jpg';

interface EarthHeroProps {
  onStartSimulation: () => void;
  onStartRainfallSimulation: () => void;
  onOpenGuide: () => void;
}

export const EarthHero: React.FC<EarthHeroProps> = ({
  onStartSimulation,
  onStartRainfallSimulation,
  onOpenGuide
}) => {
  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-sky-200">
      {/* Background: Vibrant Lively Daylight Earth with sunny atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src={earthDaylightImg}
          alt="Lively daylight view of Planet Earth"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Measured bright day overlay scrim - ensuring lively non-dark look */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/35 via-white/20 to-sky-100/70 backdrop-blur-[1px]" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 hidden lg:block animate-float">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-3xl border-3 border-sky-300 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="font-fun font-bold text-xs text-sky-900">3D Terrain Topography</div>
            <div className="text-[11px] text-slate-500 font-medium">Red Peaks · Yellow Hills · Green Valleys</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 right-10 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-3xl border-3 border-amber-300 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <div className="font-fun font-bold text-xs text-amber-900">Sea Level & Ice Melt</div>
            <div className="text-[11px] text-slate-500 font-medium">Interactive 1 - 3,000m Inundation</div>
          </div>
        </div>
      </div>

      {/* Center Hero Card */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 text-center flex flex-col items-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-1.5 rounded-full shadow-md border-2 border-sky-300 text-sky-800 text-xs font-bold mb-5 animate-bounce">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Planetary Flood & Topography Visualizer</span>
        </div>

        {/* Title */}
        <h1 className="font-fun text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight drop-shadow-sm">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">TerraFlow</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium max-w-xl leading-relaxed bg-white/60 backdrop-blur-xs px-4 py-2 rounded-2xl">
          Explore real country topographies in 3D, simulate extreme sea level rise from 1 to 3,000 meters, investigate global ice melt, and learn vital flood safety guidelines.
        </p>

        {/* Simulation Options Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={onStartSimulation}
            className="btn-cartoon-primary w-full sm:w-auto px-6 py-3.5 rounded-3xl text-white font-fun font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl group cursor-pointer"
          >
            <Waves className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>🌊 Sea Level Flooder</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onStartRainfallSimulation}
            className="w-full sm:w-auto px-6 py-3.5 rounded-3xl text-white font-fun font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 border-2 border-indigo-300 group cursor-pointer transition-all hover:scale-102"
          >
            <CloudRain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>🌧️ Rainfall & Cyclones</span>
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-125 transition-transform" />
          </button>

          <button
            onClick={onOpenGuide}
            className="btn-cartoon-white w-full sm:w-auto px-5 py-3.5 rounded-3xl text-slate-800 font-fun font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:text-sky-600 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Flood Guide</span>
          </button>
        </div>

        {/* Subtle quick feature notes */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-md text-center">
          <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-2xl border-2 border-sky-200 shadow-xs">
            <div className="font-fun font-bold text-slate-900 text-sm">3D Topography</div>
            <div className="text-[11px] text-slate-500">Elevation Color Mesh</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-2xl border-2 border-sky-200 shadow-xs">
            <div className="font-fun font-bold text-slate-900 text-sm">1 - 3,000m</div>
            <div className="text-[11px] text-slate-500">Sea Level Slider</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-2xl border-2 border-sky-200 shadow-xs">
            <div className="font-fun font-bold text-slate-900 text-sm">Rain & Floods</div>
            <div className="text-[11px] text-slate-500">Historical Archives</div>
          </div>
        </div>
      </div>
    </div>
  );
};
