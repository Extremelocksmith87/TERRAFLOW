import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../data/countriesData';
import { CountryFloodData } from '../types/flood';
import { Search, Globe2, CheckCircle2, ArrowRight, DownloadCloud, Sparkles, X, MapPin } from 'lucide-react';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (country: CountryFloodData) => void;
  downloadedCountryIds: string[];
}

export const CountrySelectorModal: React.FC<CountrySelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectCountry,
  downloadedCountryIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');

  if (!isOpen) return null;

  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

  const filteredCountries = COUNTRIES_DATA.filter((country) => {
    const matchesSearch =
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.continent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent =
      selectedContinent === 'All' || country.continent === selectedContinent;
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 p-5 sm:p-6 text-white flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-fun text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md inline-block uppercase tracking-wider text-sky-50">
              Step 1 of 2: Country Selection
            </span>
            <h2 className="font-fun text-2xl sm:text-3xl font-extrabold tracking-tight">
              Select Your Country to Simulate
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Choose a country to download 3D topography elevation models, historical rainfall records, and demographic flood risk data.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Continent Filters */}
        <div className="p-4 bg-sky-50/80 border-b-2 border-sky-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search country or continent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border-2 border-sky-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-400 transition-colors shadow-xs"
            />
          </div>

          {/* Continent Chips */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto overflow-x-auto">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedContinent === continent
                    ? 'btn-cartoon-primary text-white'
                    : 'btn-cartoon-white text-slate-600 hover:text-slate-900'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredCountries.map((country) => {
            const isDownloaded = downloadedCountryIds.includes(country.id);

            return (
              <div
                key={country.id}
                onClick={() => onSelectCountry(country)}
                className={`p-4 rounded-3xl border-3 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 ${
                  isDownloaded
                    ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/60 border-emerald-300 shadow-md hover:border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl filter drop-shadow-xs">{country.flag}</span>
                    {isDownloaded ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Downloaded
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                        <DownloadCloud className="w-3 h-3 text-sky-600" />
                        Download
                      </span>
                    )}
                  </div>

                  <h3 className="font-fun font-bold text-lg text-slate-900 mt-2 group-hover:text-sky-600 transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{country.continent}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Population:</span>
                      <strong className="text-slate-700">
                        {(country.population / 1000000).toFixed(1)}M
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Highest Point:</span>
                      <strong className="text-rose-600 font-mono">
                        {country.highestPoint.elevationMeters.toLocaleString()}m
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Flood Threat:</span>
                      <strong className="text-cyan-700">
                        {country.coastalVulnerablePercent}% coastal/delta
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <div
                    className={`w-full py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isDownloaded
                        ? 'btn-cartoon-emerald text-white'
                        : 'btn-cartoon-primary text-white'
                    }`}
                  >
                    <span>{isDownloaded ? 'Open Simulation' : 'Download & Simulate'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-sky-600" />
            <span>{downloadedCountryIds.length} countries saved locally in device memory</span>
          </div>
          <span className="font-medium text-slate-400">Data downloads only when requested by you</span>
        </div>
      </div>
    </div>
  );
};
