import React from 'react';
import { CountryFloodData } from '../types/flood';
import { Users, X, MapPin, AlertTriangle, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';

interface PopulationPanelProps {
  country: CountryFloodData;
  isOpen: boolean;
  onClose: () => void;
  seaLevelMeters: number;
  submergedCities: string[];
}

export const PopulationPanel: React.FC<PopulationPanelProps> = ({
  country,
  isOpen,
  onClose,
  seaLevelMeters,
  submergedCities
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-r-4 border-sky-300 flex flex-col transition-all duration-300">
      {/* Drawer Header */}
      <div className="p-4 bg-sky-50 border-b-2 border-sky-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-fun text-lg font-bold text-slate-900 leading-tight">
              Demographic Census
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {country.name} Population Risk & Density
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-cartoon-white p-2 rounded-xl text-slate-500 hover:text-slate-800"
          title="Close population panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Total Population Card */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 border-2 border-sky-200 shadow-sm">
          <div className="text-xs font-bold text-sky-800 uppercase tracking-wide">
            Total National Population
          </div>
          <div className="font-fun text-3xl font-extrabold text-sky-950 mt-1">
            {country.population.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            <span>Density: <strong>{country.densityPerKm2}</strong> people / km²</span>
          </div>
        </div>

        {/* Breakdown Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl p-3 border-2 border-slate-200 shadow-sm">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Urban Living</div>
            <div className="font-fun text-xl font-bold text-slate-800 mt-0.5">
              {country.urbanPopulationPercent}%
            </div>
            <div className="text-[10px] text-slate-500">
              {((country.population * country.urbanPopulationPercent) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })} people
            </div>
          </div>

          <div className="bg-rose-50 rounded-2xl p-3 border-2 border-rose-200 shadow-sm">
            <div className="text-[11px] font-bold text-rose-700 uppercase">Coastal / Delta Risk</div>
            <div className="font-fun text-xl font-bold text-rose-800 mt-0.5">
              {country.coastalVulnerablePercent}%
            </div>
            <div className="text-[10px] text-rose-600">
              Low-lying delta basin residents
            </div>
          </div>
        </div>

        {/* City Population & Inundation Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-fun font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600" />
              Major Metropolitan Hubs
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Sea Level: +{seaLevelMeters}m
            </span>
          </div>

          <div className="space-y-2">
            {country.cities.map((city) => {
              const isSubmerged = submergedCities.includes(city.name);
              const heightMargin = city.elevationMeters - seaLevelMeters;

              return (
                <div
                  key={city.name}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    isSubmerged
                      ? 'bg-rose-50 border-rose-300 shadow-sm'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {city.name}
                      </span>
                      {city.isCapital && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                          Capital
                        </span>
                      )}
                    </div>

                    {isSubmerged ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg">
                        <AlertTriangle className="w-3 h-3" />
                        Submerged
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                        <ShieldCheck className="w-3 h-3" />
                        Dry (+{heightMargin % 1 === 0 ? heightMargin : heightMargin.toFixed(1)}m)
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Pop: <strong>{city.population.toLocaleString()}</strong>
                    </span>
                    <span>
                      Elevation: <strong className="font-mono">{city.elevationMeters}m</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Advice */}
      <div className="p-3 bg-slate-50 border-t-2 border-slate-200 text-center">
        <p className="text-xs text-slate-500">
          Click on any city in the 3D map to inspect topographical height margins.
        </p>
      </div>
    </div>
  );
};
