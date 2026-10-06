import React from 'react';
import { Waves, Globe, BookOpen, ShieldCheck, Compass } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onOpenCountrySelect: () => void;
  onOpenGuide: () => void;
  selectedCountryName?: string;
  selectedCountryFlag?: string;
  activeView: 'home' | 'simulator';
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenCountrySelect,
  onOpenGuide,
  selectedCountryName,
  selectedCountryFlag,
  activeView
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-sky-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 font-fun text-2xl font-bold tracking-tight text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-400 flex items-center justify-center text-white shadow-sm">
            <Waves className="w-5 h-5" />
          </div>
          <span>TerraFlow</span>
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <button
            onClick={onGoHome}
            className={`hover:text-sky-600 transition-colors cursor-pointer ${
              activeView === 'home' ? 'text-sky-600' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={onOpenCountrySelect}
            className={`hover:text-sky-600 transition-colors cursor-pointer ${
              activeView === 'simulator' ? 'text-sky-600' : ''
            }`}
          >
            Topography
          </button>
          <button
            onClick={onOpenGuide}
            className="hover:text-sky-600 transition-colors cursor-pointer"
          >
            Safety Guide
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCountrySelect}
            className="btn-cartoon-primary px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-white flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {selectedCountryFlag ? (
              <>
                <span className="text-base">{selectedCountryFlag}</span>
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{selectedCountryName}</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Select Country</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenGuide}
            className="btn-cartoon-emerald px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Flood Guide: 30 Dos & 10 Don'ts"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Flood Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
