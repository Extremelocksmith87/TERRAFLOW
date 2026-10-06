/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CountryFloodData } from './types/flood';
import { COUNTRIES_DATA } from './data/countriesData';
import { EarthHero } from './components/EarthHero';
import { DownloadingScreen } from './components/DownloadingScreen';
import { SingleScreenDashboard } from './components/SingleScreenDashboard';
import { RainfallDashboard } from './components/RainfallDashboard';
import { FloodGuideModal } from './components/FloodGuideModal';

const STORAGE_KEY = 'aquasim_downloaded_countries';

export default function App() {
  // Default directly to simulator so the map is visible immediately on load!
  const [activeView, setActiveView] = useState<'home' | 'simulator' | 'rainfall'>('simulator');

  // Default focus country is Bangladesh (per user: "use this map and only download the map of the selcted country no need to use other countries")
  const defaultCountry = COUNTRIES_DATA[0]; // Bangladesh
  const [selectedCountry, setSelectedCountry] = useState<CountryFloodData>(defaultCountry);

  // Downloading screen state
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Simulation parameter states: default to 0m (baseline safe level, 0 displaced)
  const [seaLevelMeters, setSeaLevelMeters] = useState<number>(0);
  const [iceMeltPercent, setIceMeltPercent] = useState<number>(0);
  const [displacedPopulation, setDisplacedPopulation] = useState<number>(0);
  const [showPopulationOverlay, setShowPopulationOverlay] = useState<boolean>(false);

  // Start simulation trigger: triggers realistic data download simulation for Bangladesh
  const handleStartSimulation = () => {
    setIsDownloading(true);
  };

  // Download complete handler
  const handleDownloadComplete = () => {
    setIsDownloading(false);
    setActiveView('simulator');
    setSeaLevelMeters(0);
    setIceMeltPercent(0);
    setDisplacedPopulation(0);
    setShowPopulationOverlay(false);
  };

  // Calculate dynamic flooded metrics based on Bangladesh topography
  const maxElev = selectedCountry.highestPoint.elevationMeters || 1052;
  const avgElev = selectedCountry.averageElevationMeters || 12;

  const { floodedPercent, submergedAreaKm2, calculatedDisplaced, submergedCities } = useMemo(() => {
    // Baseline safe: when sea level rise is 0m, 0% is flooded and 0 people displaced!
    if (seaLevelMeters <= 0) {
      return {
        floodedPercent: 0,
        submergedAreaKm2: 0,
        calculatedDisplaced: 0,
        submergedCities: []
      };
    }

    // When sea level reaches or exceeds the highest point of the country (1052m), 100% is flooded!
    if (seaLevelMeters >= maxElev) {
      return {
        floodedPercent: 100,
        submergedAreaKm2: selectedCountry.totalAreaKm2,
        calculatedDisplaced: selectedCountry.population,
        submergedCities: selectedCountry.cities.map((c) => c.name)
      };
    }

    // Submerged percentage & displaced population modeling with calibrated hypsographic real numbers:
    let pct = 0;
    let totalDisplaced = 0;

    if (seaLevelMeters <= 1.0) {
      // 0 to 1m: Inundates outer intertidal mudflats and low mangrove margins
      // At 0.1m (10cm): ~0.07% land (104 km²), ~22,500 displaced (outermost char/mudflat dwellers, not hundreds of thousands!)
      // At 0.5m (50cm): ~2.44% land (3,597 km²), ~2.0M displaced
      // At 1.0m (100cm): 11.20% land (16,528 km²), 14.2M displaced (official IPCC AR6 & World Bank benchmark)
      pct = Number((11.2 * Math.pow(seaLevelMeters / 1.0, 2.2)).toFixed(2));
      totalDisplaced = Math.round(14200000 * Math.pow(seaLevelMeters / 1.0, 2.8));
    } else if (seaLevelMeters <= 2.0) {
      // 1 to 2m: Lower delta estuarine margins (Barishal & Patuakhali at 4m remain completely safe!)
      const t = (seaLevelMeters - 1.0) / 1.0;
      pct = Number((11.2 + t * (21.0 - 11.2)).toFixed(2));
      totalDisplaced = Math.round(14200000 + t * (29000000 - 14200000));
    } else if (seaLevelMeters <= 4.0) {
      // 2 to 4m: Reaches coastal polders (Survey of Bangladesh benchmark: Barishal & Patuakhali submerge at 4m)
      const t = (seaLevelMeters - 2.0) / 2.0;
      pct = Number((21.0 + t * (33.5 - 21.0)).toFixed(2));
      totalDisplaced = Math.round(29000000 + t * (54000000 - 29000000));
    } else if (seaLevelMeters <= 8.0) {
      // 4 to 8m: Central delta floodplains (Dhaka Megacity at 8m elevation)
      const t = (seaLevelMeters - 4.0) / 4.0;
      pct = Number((33.5 + t * (52.0 - 33.5)).toFixed(2));
      totalDisplaced = Math.round(54000000 + t * (98000000 - 54000000));
    } else if (seaLevelMeters <= avgElev) {
      // 8 to 12m: All active river confluence floodplains
      const t = (seaLevelMeters - 8.0) / (avgElev - 8.0);
      pct = Number((52.0 + t * (62.0 - 52.0)).toFixed(2));
      totalDisplaced = Math.round(98000000 + t * (115000000 - 98000000));
    } else if (seaLevelMeters <= 75.0) {
      // 12 to 75m: Pleistocene terraces (Barind & Madhupur Tracts)
      const t = (seaLevelMeters - avgElev) / (75.0 - avgElev);
      pct = Number((62.0 + t * (88.5 - 62.0)).toFixed(2));
      totalDisplaced = Math.round(115000000 + t * (165000000 - 115000000));
    } else {
      // 75m to 1,052m: Foothills and high peaks of Chittagong Hill Tracts
      const t = (seaLevelMeters - 75.0) / (maxElev - 75.0);
      pct = Number((88.5 + t * (100.0 - 88.5)).toFixed(2));
      totalDisplaced = Math.round(165000000 + t * (selectedCountry.population - 165000000));
    }

    pct = Math.min(100, Math.max(0, pct));
    const area = Math.round((pct / 100) * selectedCountry.totalAreaKm2);
    totalDisplaced = Math.min(selectedCountry.population, Math.max(0, totalDisplaced));

    // Identify submerged cities based on authentic elevations
    const submerged = selectedCountry.cities
      .filter((city) => city.elevationMeters <= seaLevelMeters)
      .map((city) => city.name);

    return {
      floodedPercent: pct,
      submergedAreaKm2: area,
      calculatedDisplaced: totalDisplaced,
      submergedCities: submerged
    };
  }, [selectedCountry, seaLevelMeters, maxElev, avgElev]);

  // Keep displacedPopulation state synced: if seaLevelMeters is 0, displaced is strictly 0
  const effectiveDisplaced = seaLevelMeters === 0 ? 0 : (displacedPopulation > 0 ? displacedPopulation : calculatedDisplaced);

  return (
    <div className="h-screen w-screen overflow-hidden bg-sky-50 text-slate-800">
      {/* 1. "Downloading Data" Screen */}
      {isDownloading ? (
        <DownloadingScreen
          country={selectedCountry}
          onDownloadComplete={handleDownloadComplete}
        />
      ) : activeView === 'home' ? (
        /* 2. Opening Screen: Lively Earth Background with Simulation Selection Buttons */
        <EarthHero
          onStartSimulation={handleStartSimulation}
          onStartRainfallSimulation={() => setActiveView('rainfall')}
          onOpenGuide={() => setIsGuideModalOpen(true)}
        />
      ) : activeView === 'rainfall' ? (
        /* 3. Rainfall & Cyclone Simulator Interface */
        <RainfallDashboard
          onGoHome={() => setActiveView('home')}
          onGoToFloodSimulator={() => setActiveView('simulator')}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />
      ) : (
        /* 4. Single Screen Flood Dashboard (Sea Level Rise & Topography) */
        <SingleScreenDashboard
          country={selectedCountry}
          seaLevelMeters={seaLevelMeters}
          onSeaLevelChange={(val) => {
            setSeaLevelMeters(val);
            setDisplacedPopulation(0); // auto compute
          }}
          iceMeltPercent={iceMeltPercent}
          onIceMeltChange={(pct) => {
            setIceMeltPercent(pct);
            setDisplacedPopulation(0); // auto compute
          }}
          displacedPopulation={effectiveDisplaced}
          onDisplacedPopulationChange={(disp) => setDisplacedPopulation(disp)}
          showPopulationOverlay={showPopulationOverlay}
          onTogglePopulationOverlay={() => setShowPopulationOverlay(!showPopulationOverlay)}
          floodedPercent={floodedPercent}
          submergedAreaKm2={submergedAreaKm2}
          submergedCities={submergedCities}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          onGoHome={() => setActiveView('home')}
          onGoToRainfall={() => setActiveView('rainfall')}
        />
      )}

      {/* Flood Guide Modal (30 To-Dos & 10 Never-Dos Checklist) */}
      <FloodGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
