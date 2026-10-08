/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CountryFloodData } from './types/flood';
import { COUNTRIES_DATA } from './data/countriesData';
import { BANGLADESH_CITIES } from './data/bangladeshCitiesData';
import {
  calculateDisplacedAndFloodedSectors,
  BANGLADESH_DISTRICTS_DATA
} from './data/bangladeshDistrictsSubdivisions';
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

    // Grounded in authentic 64 districts & 512 sub-district (1/8th of a district) sectors:
    // Every 1/8th sector that sits at <= seaLevelMeters floods and contributes its exact population.
    const metrics = calculateDisplacedAndFloodedSectors(seaLevelMeters);

    const pct = metrics.floodedPercent;
    const totalDisplaced = metrics.totalDisplaced;
    const area = metrics.submergedAreaKm2;

    // Submerged districts & cities with 1/8th sector precision
    const submerged = Array.from(metrics.districtStatuses.entries())
      .filter(([, stat]) => stat.submergedSectorsCount > 0)
      .map(([id, stat]) => {
        const district = BANGLADESH_DISTRICTS_DATA.find((d) => d.id === id);
        if (!district) return id;
        if (stat.isFullySubmerged) return `${district.name} (8/8 Submerged)`;
        return `${district.name} (${stat.submergedSectorsCount}/8 Submerged)`;
      });

    return {
      floodedPercent: pct,
      submergedAreaKm2: area,
      calculatedDisplaced: totalDisplaced,
      submergedCities: submerged
    };
  }, [selectedCountry, seaLevelMeters, maxElev]);

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
          onSeaLevelChange={(val) => setSeaLevelMeters(val)}
          iceMeltPercent={iceMeltPercent}
          onIceMeltChange={(pct) => setIceMeltPercent(pct)}
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
