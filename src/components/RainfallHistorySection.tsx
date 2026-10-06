import React from 'react';
import { CountryFloodData } from '../types/flood';
import { CloudRain, BarChart3, TrendingUp, Droplets, Compass, AlertCircle } from 'lucide-react';

interface RainfallHistorySectionProps {
  country: CountryFloodData;
}

export const RainfallHistorySection: React.FC<RainfallHistorySectionProps> = ({ country }) => {
  const maxMonthlyRain = Math.max(...country.monthlyRainfall.map((m) => m.rainfallMm), 1);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-sky-200 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-sky-100 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700 border-2 border-cyan-300">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-fun text-2xl md:text-3xl font-bold text-slate-900">
                Past Rainfall History & Hydrology of {country.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Annual precipitation archives, seasonal monsoon rhythms, and climate shift trends
              </p>
            </div>
          </div>

          <div className="bg-sky-50 px-3.5 py-1.5 rounded-2xl border border-sky-200 text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Annual Normal</div>
            <div className="font-fun text-lg font-bold text-sky-800">
              {country.annualAverageRainfallMm.toLocaleString()} mm / yr
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Precipitation Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-fun font-bold text-base text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            Monthly Mean Precipitation (Jan – Dec Historical Normal)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Unit: Millimeters (mm)</span>
        </div>

        <div className="bg-sky-50/60 rounded-3xl p-5 border-2 border-sky-100">
          <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-48 pt-6">
            {country.monthlyRainfall.map((record) => {
              const heightPct = Math.max(8, (record.rainfallMm / maxMonthlyRain) * 100);
              const isPeak = record.rainfallMm === maxMonthlyRain;

              return (
                <div key={record.month} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {record.rainfallMm}m
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 relative ${
                      isPeak
                        ? 'bg-gradient-to-t from-sky-600 to-cyan-400 shadow-md ring-2 ring-sky-300'
                        : 'bg-gradient-to-t from-sky-400 to-sky-300 hover:from-sky-500 hover:to-sky-400'
                    }`}
                  >
                    {isPeak && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <span className="mt-2 text-[11px] font-bold text-slate-600 uppercase">
                    {record.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decadal Trends & Extreme Cloudburst Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decadal Trend Table */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h4 className="font-fun font-bold text-sm text-slate-800">
              50-Year Decadal Rainfall Anomalies
            </h4>
          </div>

          <div className="divide-y divide-slate-100">
            {country.decadalRainfall.map((d) => (
              <div key={d.decade} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{d.decade}</span>
                <span className="font-mono text-slate-600">{d.annualAverageMm} mm/yr</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                    d.anomalyPercent > 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  {d.anomalyPercent > 0 ? `+${d.anomalyPercent}%` : `${d.anomalyPercent}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Record Cloudburst Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800">
              <Droplets className="w-5 h-5 text-amber-600" />
              <h4 className="font-fun font-bold text-sm">
                24-Hour National Precipitation Record
              </h4>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-extrabold font-fun text-amber-950">
                {country.record24HrRainfallMm} mm
              </div>
              <div className="text-xs text-amber-800 font-semibold mt-1">
                in 24 consecutive hours
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed">
              Recorded at <strong>{country.recordRainfallLocation}</strong>. Single-day downpours of this magnitude exceed local catchment capacity by up to 800%, precipitating immediate flash floods and river overtopping.
            </p>
          </div>

          <div className="mt-4 bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Extreme downpour frequency in {country.name} has increased by ~18% since 1990.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
