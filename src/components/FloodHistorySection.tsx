import React, { useState } from 'react';
import { CountryFloodData } from '../types/flood';
import { History, Shield, AlertTriangle, Calendar, DollarSign, Users, Award, BookOpen } from 'lucide-react';

interface FloodHistorySectionProps {
  country: CountryFloodData;
}

export const FloodHistorySection: React.FC<FloodHistorySectionProps> = ({ country }) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-sky-200 space-y-8">
      {/* Section Header */}
      <div className="border-b-2 border-sky-100 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-100 text-sky-700 border-2 border-sky-300">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-fun text-2xl md:text-3xl font-bold text-slate-900">
                History of Floods in {country.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Centuries of hydrological records, catastrophic inundations, and engineering resilience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-2xl border border-sky-200">
            <span className="text-xl">{country.flag}</span>
            <span className="font-fun font-bold text-xs text-sky-900">
              {country.historicalFloods.length} Landmark Flood Archives
            </span>
          </div>
        </div>
      </div>

      {/* Multiple Rich Paragraphs about the History of Floods in Selected Country (Strict Requirement) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-fun font-bold text-slate-800 text-base">
          <BookOpen className="w-5 h-5 text-sky-600" />
          Chronicles of Inundation & Hydrological Heritage
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {country.floodHistoryParagraphs.map((paragraph, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-sky-50/60 to-blue-50/40 rounded-2xl p-5 border-2 border-sky-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="font-fun text-xs font-bold text-sky-600 bg-white px-2.5 py-1 rounded-xl border border-sky-200 shadow-xs inline-block mb-3">
                  Historical Chapter 0{idx + 1}
                </span>
                <p className="text-slate-700 text-sm leading-relaxed text-justify">
                  {paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Landmark Flood Events Archive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-fun font-bold text-lg text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Catastrophic Historic Flood Disasters
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Select an event to view full impact dossier
          </span>
        </div>

        {/* Event selection pills */}
        <div className="flex flex-wrap gap-2">
          {country.historicalFloods.map((event, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEventIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                selectedEventIndex === idx
                  ? 'btn-cartoon-primary text-white scale-102'
                  : 'btn-cartoon-white text-slate-700 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.year} · {event.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Event Detail Card */}
        {country.historicalFloods[selectedEventIndex] && (
          <div className="bg-gradient-to-br from-white to-sky-50/50 rounded-3xl p-6 border-3 border-sky-200 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-fun">
                  Disaster Case File · {country.historicalFloods[selectedEventIndex].year}
                </span>
                <h4 className="font-fun text-xl font-bold text-slate-900 mt-0.5">
                  {country.historicalFloods[selectedEventIndex].name}
                </h4>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-xl border border-rose-300">
                {country.historicalFloods[selectedEventIndex].waterLevelOrSurge}
              </span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              {country.historicalFloods[selectedEventIndex].summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-3 border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Casualties</div>
                  <div className="font-fun text-sm font-bold text-slate-800">
                    {country.historicalFloods[selectedEventIndex].casualties}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Affected People</div>
                  <div className="font-fun text-sm font-bold text-slate-800">
                    {country.historicalFloods[selectedEventIndex].affectedPeople}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Economic Losses</div>
                  <div className="font-fun text-sm font-bold text-slate-800">
                    {country.historicalFloods[selectedEventIndex].damageCost}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 rounded-2xl p-3 text-xs text-sky-900 border border-sky-200">
              <strong className="font-semibold">Primary Meteorological & Hydrological Trigger:</strong>{' '}
              {country.historicalFloods[selectedEventIndex].primaryCause}
            </div>
          </div>
        )}
      </div>

      {/* Flood Defense Systems & Engineering Resilience */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 border-2 border-emerald-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="font-fun font-bold text-base text-emerald-950">
            National Flood Defense Infrastructure in {country.name}
          </h3>
        </div>

        <p className="text-xs text-emerald-800">
          State-of-the-art civil engineering, storm surge barriers, and nature-based defenses deployed across {country.name}:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {country.floodDefenseSystems.map((sys, idx) => (
            <div
              key={idx}
              className="bg-white/90 rounded-2xl p-3 border border-emerald-200 shadow-xs flex items-center gap-2.5"
            >
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-800">{sys}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
