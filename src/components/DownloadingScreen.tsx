import React, { useEffect, useState } from 'react';
import { CountryFloodData } from '../types/flood';
import { DownloadCloud, CheckCircle2, Waves, CloudRain, Users, Mountain, ShieldCheck, Sparkles } from 'lucide-react';

interface DownloadingScreenProps {
  country: CountryFloodData;
  onDownloadComplete: () => void;
}

export const DownloadingScreen: React.FC<DownloadingScreenProps> = ({
  country,
  onDownloadComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const downloadSteps = [
    { title: `Connecting to Global Hydrological & GIS servers for ${country.name}...`, icon: DownloadCloud },
    { title: `Downloading Demographic Census (${country.population.toLocaleString()} citizens)...`, icon: Users },
    { title: `Streaming Digital Elevation Model (Peak: ${country.highestPoint.elevationMeters}m)...`, icon: Mountain },
    { title: 'Calibrating Topographical Color Gradients (Red, Yellow, Green, Blue)...', icon: Waves },
    { title: `Fetching Past Rainfall History ALL (${country.annualAverageRainfallMm} mm annual normal)...`, icon: CloudRain },
    { title: `Parsing Flooding History Archives & Defense Embankments...`, icon: ShieldCheck },
    { title: `Synthesizing 3D Interactive Topography & Water Simulation Mesh...`, icon: Sparkles }
  ];

  useEffect(() => {
    const totalDuration = 2400; // 2.4 seconds of engaging visual feedback
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onDownloadComplete();
          }, 400);
          return 100;
        }

        const stepIdx = Math.min(
          downloadSteps.length - 1,
          Math.floor((next / 100) * downloadSteps.length)
        );
        setCurrentStepIndex(stepIdx);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [country, onDownloadComplete, downloadSteps.length]);

  const CurrentIcon = downloadSteps[currentStepIndex].icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-sky-50">
      <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-sky-300 text-center space-y-6">
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-400 flex items-center justify-center text-white shadow-lg animate-pulse">
            <CurrentIcon className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-1 -right-1 text-3xl filter drop-shadow">
            {country.flag}
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="font-fun text-2xl sm:text-3xl font-bold text-slate-900">
            Downloading Data for {country.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Acquiring 3D digital elevation contours, demographics, rainfall, and flood history
          </p>
        </div>

        {/* Current Step Description */}
        <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-200 min-h-[72px] flex items-center justify-center text-xs sm:text-sm text-sky-900 font-semibold">
          {downloadSteps[currentStepIndex].title}
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Overall Download Progress</span>
            <span className="font-mono text-sky-700">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-4 bg-sky-100 rounded-full overflow-hidden p-0.5 border-2 border-sky-200">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-75 shadow-sm"
            />
          </div>
        </div>

        {/* Step checklist indicators */}
        <div className="grid grid-cols-2 gap-2 text-left pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress > 20 ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>Population & Cities</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress > 45 ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>3D Height Elevation</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress > 70 ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>Past Rainfall ALL</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress >= 95 ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>Flooding History</span>
          </div>
        </div>

        {/* Save confirmation note */}
        <p className="text-[11px] text-slate-400">
          This data will be saved to your local device memory for instant offline reuse.
        </p>
      </div>
    </div>
  );
};
