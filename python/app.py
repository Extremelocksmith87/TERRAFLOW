#!/usr/bin/env python3
"""
Bangladesh Sea Level Rise & Flood Simulator (Pure Python Server & CLI)
Converted entirely to Python while keeping all minute-scale calculations,
datasets, UI layout, sliders, overlays, and disaster guidance identical.
"""

import sys
import os
import json
import argparse
from typing import Any
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Import python simulation modules
from bangladesh_data import BANGLADESH_CITIES, COUNTRY_METADATA, HISTORICAL_FLOODS
from simulation import (
    calculate_flood_metrics,
    ice_melt_to_sea_level,
    displaced_population_to_sea_level,
    MAX_ELEVATION_METERS,
    AVERAGE_ELEVATION_METERS,
    TOTAL_POPULATION
)

DOS_LIST = [
    "Keep battery-powered NOAA/emergency radios tuned to Bangladesh Meteorological Department (BMD) bulletins.",
    "Store at least 5 days of safe potable drinking water in sealed jerrycans or water purification tablets (Halazone/Aquatabs).",
    "Identify the closest designated multi-purpose cyclone/flood shelter and highest ground escape paths.",
    "Keep dry food provisions (flattened rice/chira, puffed rice/muri, molasses/gur, biscuits) in waterproof containers.",
    "Place all critical citizenship papers (NID, land deeds, birth certificates) in triple-ziploc watertight pouches.",
    "Keep emergency first aid kits stocked with antiseptic lotion, bandages, ORS sachets, and snake antivenom instructions.",
    "Elevate livestock, poultry, and farming seed supplies to bamboo platforms (machan) above maximum flood datum.",
    "Switch off main household circuit breakers and gas cylinder regulators before water enters the premises.",
    "Anchor wooden boats and banana-raft emergency flotation crafts securely to deep foundation posts.",
    "Help evacuate vulnerable neighbors: pregnant women, children, elderly citizens, and people with disabilities first.",
    "Purify all tube-well water using alum (phitkari) or boil rigorously for at least 10 minutes before drinking.",
    "Wear thick gumboots or use walking sticks to probe hidden drop-offs, open manholes, or submerged drainage canals.",
    "Hang solar lamps and keep extra dry-cell torches charged for nighttime navigation.",
    "Construct temporary sandbag dikes or earth polders around grain silos and clean water reservoirs.",
    "Monitor river crest gauges at the nearest Flood Forecasting and Warning Centre (FFWC) monitoring station.",
    "Report embankment erosions, cracks, or seepage instantly to local Union Parishad chairpersons.",
    "Bury livestock carcasses promptly away from water bodies with bleaching powder to prevent cholera/diarrhea outbreaks.",
    "Stock zinc tablets and pediatric ORS for infants suffering from sudden waterborne ailments.",
    "Wear high-visibility life vests or keep sealed empty plastic 20L containers as makeshift flotation aids.",
    "Reinforce tin roof sheets with coconut coir rope cross-ties to withstand cyclonic monsoon gusts.",
    "Form community volunteer night watches to monitor river embankment dikes during nocturnal crests.",
    "Keep emergency phone numbers for Bangladesh Red Crescent (BDRCS) and Fire Service (999) written down.",
    "Harvest standing mature rice crops or vegetables early if a 72-hour major flood warning is broadcast.",
    "Move domestic electronic equipment and motor pumps to attic or roof-level storage.",
    "Protect fish culture ponds by erecting fine-mesh nylon barrier nets around perimeter dikes.",
    "Participate in Union Disaster Management Committee (UDMC) drill briefings and early warning flag protocols.",
    "Coordinate community cooking centers (khichuri distribution) to minimize open-fire health and smoke hazards.",
    "Maintain sanitation hygiene: strictly use elevated temporary pit latrines to prevent water table contamination.",
    "Stay calm, follow official directives, and assist vulnerable families across your neighborhood.",
    "Inspect house foundations, pillars, and electrical wiring meticulously after floodwaters recede before re-entry."
]

DONTS_LIST = [
    "NEVER drink raw floodwater or submerged tube-well water without boiling or chlorine chlorination.",
    "NEVER wade through swiftly flowing flood currents exceeding knee depth (15cm can knock an adult down).",
    "NEVER touch downed electrical utility poles, hanging power cables, or submerged switchboards.",
    "NEVER let children swim, play, or bathe in open floodwaters due to strong undercurrents and waterborne disease.",
    "NEVER eat wet, moldy grain or flood-soaked perishable foods that have touched contaminated water.",
    "NEVER spread unverified rumors, fabricated dam break warnings, or false casualty figures on social media.",
    "NEVER discard human waste or animal carcasses into open floodways or water sources.",
    "NEVER drive three-wheelers, motorcycles, or light vehicles through inundated causeways or submerged roads.",
    "NEVER ignore official evacuation orders from Bangladesh Red Crescent (CPP) or local government administration.",
    "NEVER venture out during active tropical cyclone storm surges or nocturnal torrential cloudbursts."
]

def get_html_app() -> str:
    """Generates the single-screen web UI with real-time sliders and map display."""
    cities_json = json.dumps([c.to_dict() for c in BANGLADESH_CITIES])
    floods_json = json.dumps(HISTORICAL_FLOODS)
    dos_json = json.dumps(DOS_LIST)
    donts_json = json.dumps(DONTS_LIST)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bangladesh Sea Level & Flood Simulator (Python Edition)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
    /* Custom clean sliders */
    input[type=range] {{
      accent-color: #0284c7;
    }}
  </style>
</head>
<body class="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col text-slate-800 select-none">

  <!-- TOP HEADER BAR -->
  <header class="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs z-20">
    <div class="flex items-center gap-2.5">
      <span class="text-xl">🇧🇩</span>
      <div>
        <h1 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
          Bangladesh Sea Level Rise & Flood Simulator
        </h1>
        <span class="text-[10px] text-slate-500 font-semibold">
          Python Hydrological Simulation · Exact Hypsographic Elevation Curve (0 - 1,052m)
        </span>
      </div>
    </div>

    <!-- Right Header Action Buttons -->
    <div class="flex items-center gap-2">
      <button onclick="toggleModal('history')" class="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs">
        Flood History
      </button>
      <button onclick="toggleModal('guide')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs">
        Flood Guide (30 Dos & 10 Don'ts)
      </button>
    </div>
  </header>

  <!-- MAIN STAGE: SIDE-BY-SIDE ON DESKTOP -->
  <main class="flex-1 min-h-0 flex flex-col md:flex-row p-2 gap-2 overflow-hidden">
    
    <!-- LEFT: BANGLADESH MAP VIEWER -->
    <div class="flex-1 h-full min-h-0 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md flex items-center justify-center">
      
      <!-- Top Floating Map Badges -->
      <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
        <div class="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs">
          <span class="font-bold text-slate-900" id="mapModeTitle">Topographical Elevation Map</span>
          <span class="text-slate-400">|</span>
          <span class="text-slate-600 font-medium" id="submergedCountBadge">0 / 65 Districts Flooded</span>
        </div>

        <div class="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs">
          <span class="text-slate-500 font-medium">Flooded:</span>
          <span class="font-mono font-bold text-sky-700" id="topFloodedBadge">0.0% (+0m)</span>
        </div>
      </div>

      <!-- Left Map Action Buttons -->
      <div class="absolute left-3 top-14 flex flex-col gap-2 z-30">
        <button id="popToggleBtn" onclick="togglePopulationMode()" class="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md">
          👥 Population Density View
        </button>
        <div class="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200 flex flex-col gap-1">
          <button onclick="zoomMap(1.2)" class="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded-lg">+</button>
          <button onclick="zoomMap(0.8)" class="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded-lg">-</button>
          <button onclick="resetZoom()" class="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg">↺</button>
        </div>
      </div>

      <!-- MAP CONTAINER WITH PAN & ZOOM -->
      <div id="mapViewport" class="relative w-full h-full flex items-center justify-center cursor-grab">
        <div id="mapTransform" style="transform: translate(0px, 0px) scale(1); transform-origin: center center;" class="relative w-[600px] h-[800px] max-w-full max-h-full">
          
          <!-- Relief Background SVG -->
          <svg viewBox="0 0 896 1200" class="w-full h-full" id="svgMap">
            <defs>
              <!-- Bay of Bengal Ocean Reconquest Gradients -->
              <linearGradient id="oceanReconquerWater" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#0a3950" stop-opacity="1" />
                <stop offset="35%" stop-color="#0c445f" stop-opacity="1" />
                <stop offset="70%" stop-color="#0c445f" stop-opacity="1" />
                <stop offset="100%" stop-color="#0e4f6e" stop-opacity="0.98" />
              </linearGradient>
              <linearGradient id="oceanDeepSubmersion" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#082b3d" stop-opacity="1" />
                <stop offset="40%" stop-color="#0c445f" stop-opacity="1" />
                <stop offset="100%" stop-color="#0a3c54" stop-opacity="1" />
              </linearGradient>
              <radialGradient id="coastalSurge" cx="45%" cy="85%" r="65%">
                <stop offset="0%" stop-color="#0c445f" stop-opacity="1" />
                <stop offset="50%" stop-color="#0c445f" stop-opacity="0.98" />
                <stop offset="85%" stop-color="#0e4e6d" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#115576" stop-opacity="0.85" />
              </radialGradient>
            </defs>

            <!-- Base Country Landmass Outline -->
            <rect width="896" height="1200" fill="#0f172a" />
            <path id="landmassBase" d="M 280,180 L 420,160 L 520,240 L 720,260 L 760,420 L 680,560 L 820,720 L 760,1020 L 620,1060 L 460,920 L 320,960 L 160,860 L 180,680 L 160,460 L 260,320 Z" fill="#1e293b" stroke="#334155" stroke-width="4" />

            <!-- Dynamic Water Simulation Layer -->
            <g id="waterLayer">
              <!-- Stage 1: Coastal Delta & Sundarbans (1m - 8m) -->
              <path id="waterStage1" d="M 140,820 C 260,780 420,800 620,840 C 720,890 740,1050 680,1140 L 160,1140 Z" fill="url(#coastalSurge)" opacity="0" stroke="#0c445f" stroke-width="4" />
              <!-- Stage 2: River Basin Flooding (8m - 20m) -->
              <path id="waterStage2" d="M 240,540 C 360,560 500,620 580,700 C 540,840 400,870 280,820 Z" fill="url(#oceanReconquerWater)" opacity="0" stroke="#0c445f" stroke-width="6" />
              <!-- Stage 3: Lowland Plains (20m - 50m) -->
              <path id="waterStage3" d="M 180,330 C 380,290 600,340 680,500 C 640,660 460,710 280,640 Z" fill="url(#oceanDeepSubmersion)" opacity="0" stroke="#0c445f" stroke-width="8" />
              <!-- Stage 4: Total Land & Border Submersion Blanket (Drowns all borders) -->
              <rect id="waterStage4" x="40" y="40" width="816" height="1120" rx="30" fill="#0c445f" stroke="#0c445f" stroke-width="24" opacity="0" />
            </g>

            <!-- Population Density Layer (Hidden by default) -->
            <g id="populationLayer" opacity="0">
              <rect x="80" y="80" width="736" height="1040" rx="30" fill="#ffffff" fill-opacity="0.95" />
              <!-- Dhaka Megacity (Dark Red) -->
              <circle cx="458" cy="580" r="50" fill="#4c0519" stroke="#fda4af" stroke-width="2" />
              <text x="458" y="584" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">DHAKA (22.4M)</text>
              <!-- Chattogram Port (Dark Red) -->
              <circle cx="628" cy="815" r="35" fill="#4c0519" stroke="#fda4af" stroke-width="1.5" />
              <text x="628" y="819" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">CHATTOGRAM (5.3M)</text>
            </g>

            <!-- Districts Pins -->
            <g id="districtPinsLayer"></g>
          </svg>
        </div>
      </div>
    </div>

    <!-- RIGHT: SLIDERS & CONTROLS DECK -->
    <div class="w-full md:w-[380px] lg:w-[410px] h-full shrink-0 flex flex-col bg-white rounded-2xl p-3.5 shadow-md border border-slate-200 overflow-y-auto space-y-3">
      
      <!-- Sliders Deck Header -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <span>🌊</span> Flood & Sea Level Sliders
        </h2>
        <div class="flex items-center gap-1.5">
          <button id="playBtn" onclick="togglePlay()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold">
            ▶ Auto Flood
          </button>
          <button onclick="resetSliders()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-xl text-[11px] font-bold">
            ↺ Reset
          </button>
        </div>
      </div>

      <!-- SLIDER 1: SEA LEVEL RISE (0 - 1052m) -->
      <div class="bg-sky-50 rounded-xl p-3 border border-sky-100">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-slate-800">Sea Level Rise (0 - 1,052m)</span>
          <span class="font-mono text-xs font-bold text-sky-800 bg-white px-2 py-0.5 rounded-lg border border-sky-200 shadow-inner" id="seaLevelValue">
            +0m (Safe)
          </span>
        </div>
        <input type="range" id="seaLevelSlider" min="0" max="1052" step="1" value="0" oninput="onSeaLevelSlider(this.value)" class="w-full h-2.5 bg-sky-200 rounded-lg cursor-pointer" />
        <div class="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
          <span>0m (Safe)</span>
          <span>12m (Plain)</span>
          <span>66m (Ice)</span>
          <span>1,052m (Peak)</span>
        </div>
      </div>

      <!-- SLIDER 2: POLAR ICE MELT (0 - 100%) -->
      <div class="bg-cyan-50 rounded-xl p-3 border border-cyan-100">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-slate-800">Polar Ice Melt (%)</span>
          <span class="font-mono text-xs font-bold text-cyan-800 bg-white px-2 py-0.5 rounded-lg border border-cyan-200 shadow-inner" id="iceMeltValue">
            0% Melt
          </span>
        </div>
        <input type="range" id="iceMeltSlider" min="0" max="100" step="1" value="0" oninput="onIceMeltSlider(this.value)" class="w-full h-2.5 bg-cyan-200 rounded-lg cursor-pointer" />
        <div class="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
          <span>0%</span>
          <span>50% (+33m)</span>
          <span>100% (+66m)</span>
        </div>
      </div>

      <!-- SLIDER 3: DISPLACED POPULATION -->
      <div class="bg-amber-50 rounded-xl p-3 border border-amber-100">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-slate-800">Displaced Population</span>
          <span class="font-mono text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-inner" id="displacedValue">
            0 (0%)
          </span>
        </div>
        <input type="range" id="displacedSlider" min="0" max="173000000" step="250000" value="0" oninput="onDisplacedSlider(this.value)" class="w-full h-2.5 bg-amber-200 rounded-lg cursor-pointer" />
        <div class="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
          <span>0</span>
          <span>86M (50%)</span>
          <span>173M (100%)</span>
        </div>
      </div>

      <!-- SUMMARY METRICS CARDS -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <span class="text-[10px] text-slate-500 font-medium block">Total Land Inundated</span>
          <span class="font-mono font-bold text-slate-900 text-sm" id="submergedAreaStat">0 km²</span>
          <span class="text-[10px] text-slate-400 block font-mono" id="submergedPctStat">(0.0% of country)</span>
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <span class="text-[10px] text-slate-500 font-medium block">Flooded Districts</span>
          <span class="font-mono font-bold text-slate-900 text-sm" id="submergedCountStat">0 / 65</span>
          <span class="text-[10px] text-rose-500 block font-semibold" id="capitalStatusStat">Dhaka: Dry</span>
        </div>
      </div>

      <!-- FLOODED DISTRICTS LIST -->
      <div class="flex-1 min-h-[140px] bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex flex-col">
        <span class="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>Inundated Districts & Towns</span>
          <span class="text-[10px] font-mono text-slate-500" id="districtsCountHeader">0 Submerged</span>
        </span>
        <div id="submergedCitiesList" class="flex-1 overflow-y-auto space-y-1 text-[11px] pr-1">
          <div class="text-slate-400 italic text-center py-6">All 65 districts currently safe at 0m baseline.</div>
        </div>
      </div>

    </div>
  </main>

  <!-- MODAL: FLOOD HISTORY -->
  <div id="historyModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col max-h-[85vh]">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 class="text-sm font-bold text-slate-900">Bangladesh Flood Catastrophe History</h3>
        <button onclick="toggleModal('history')" class="text-slate-400 hover:text-slate-700 font-bold">✕</button>
      </div>
      <div id="historyList" class="flex-1 overflow-y-auto py-3 space-y-3 text-xs"></div>
    </div>
  </div>

  <!-- MODAL: FLOOD GUIDE -->
  <div id="guideModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl flex flex-col max-h-[85vh]">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 class="text-sm font-bold text-slate-900">Flood Emergency Action Guide (30 Dos & 10 Don'ts)</h3>
        <button onclick="toggleModal('guide')" class="text-slate-400 hover:text-slate-700 font-bold">✕</button>
      </div>
      <div class="flex-1 overflow-y-auto py-3 space-y-4 text-xs">
        <div>
          <h4 class="font-bold text-emerald-700 mb-1.5">30 Crucial Flood Preparation & Action Dos:</h4>
          <ol class="list-decimal list-inside space-y-1 text-slate-600" id="guideDosList"></ol>
        </div>
        <div>
          <h4 class="font-bold text-rose-700 mb-1.5">10 Strict Life-Safety Don'ts:</h4>
          <ol class="list-decimal list-inside space-y-1 text-slate-600" id="guideDontsList"></ol>
        </div>
      </div>
    </div>
  </div>

  <script>
    const CITIES = {cities_json};
    const FLOODS = {floods_json};
    const DOS = {dos_json};
    const DONTS = {donts_json};

    let seaLevel = 0;
    let isPlaying = false;
    let playInterval = null;
    let showPopulation = false;
    let zoom = 1;
    let pan = {{ x: 0, y: 0 }};

    // Render city pins
    function renderPins() {{
      const layer = document.getElementById('districtPinsLayer');
      layer.innerHTML = '';
      CITIES.forEach(c => {{
        const x = 70 + (c.x_percent / 100) * (825 - 70);
        const y = 60 + (c.y_percent / 100) * (1140 - 60);
        const isFlooded = c.elevation_meters <= seaLevel;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${{x}}, ${{y}})`);
        g.innerHTML = `
          <circle r="${{c.is_division_capital ? 7 : 4}}" fill="${{isFlooded ? '#0284c7' : '#22c55e'}}" stroke="#ffffff" stroke-width="1.5" />
          <text y="${{c.is_division_capital ? -10 : -6}}" text-anchor="middle" fill="#ffffff" font-size="${{c.is_division_capital ? 9 : 7}}" font-weight="bold">${{c.name}} (${{c.elevation_meters}}m)</text>
        `;
        layer.appendChild(g);
      }});
    }}

    // Update Simulation from Python API
    async function updateSimulation(meters) {{
      seaLevel = Math.max(0, Math.min(1052, Number(meters)));
      const res = await fetch(`/api/simulate?sea_level=${{seaLevel}}`);
      const data = await res.json();

      // Sliders & texts
      document.getElementById('seaLevelSlider').value = seaLevel;
      document.getElementById('seaLevelValue').innerText = `+${{seaLevel}}m ${{seaLevel === 0 ? '(Safe)' : ''}}`;
      document.getElementById('iceMeltSlider').value = data.ice_melt_percent;
      document.getElementById('iceMeltValue').innerText = `${{data.ice_melt_percent}}% Melt`;
      document.getElementById('displacedSlider').value = data.displaced_population;
      document.getElementById('displacedValue').innerText = seaLevel === 0 ? '0 (0%)' : `${{data.displaced_population_millions}}M (${{Math.round((data.displaced_population / 173000000) * 100)}}%)`;

      // Badges
      document.getElementById('topFloodedBadge').innerText = `${{data.flooded_percent.toFixed(1)}}% (+${{seaLevel}}m)`;
      document.getElementById('submergedCountBadge').innerText = `${{data.submerged_cities_count}} / 65 Districts Flooded`;
      document.getElementById('submergedAreaStat').innerText = `${{data.submerged_area_km2.toLocaleString()}} km²`;
      document.getElementById('submergedPctStat').innerText = `(${{data.flooded_percent.toFixed(1)}}% of country)`;
      document.getElementById('submergedCountStat').innerText = `${{data.submerged_cities_count}} / 65`;
      document.getElementById('districtsCountHeader').innerText = `${{data.submerged_cities_count}} Submerged`;

      const dhakaFlooded = data.submerged_cities.includes('Dhaka');
      document.getElementById('capitalStatusStat').innerText = `Dhaka: ${{dhakaFlooded ? 'SUBMERGED (8m)' : 'Dry (Elev: 8m)'}}`;
      document.getElementById('capitalStatusStat').className = `text-[10px] font-semibold ${{dhakaFlooded ? 'text-rose-600' : 'text-emerald-600'}}`;

      // Submerged cities list
      const list = document.getElementById('submergedCitiesList');
      if (data.submerged_cities.length === 0) {{
        list.innerHTML = '<div class="text-slate-400 italic text-center py-6">All 65 districts currently safe at 0m baseline.</div>';
      }} else {{
        list.innerHTML = data.submerged_cities.map(name => `
          <div class="flex items-center justify-between p-1.5 rounded-lg bg-sky-50 border border-sky-100">
            <span class="font-bold text-slate-800">${{name}}</span>
            <span class="text-sky-700 font-mono text-[10px] font-bold">Submerged</span>
          </div>
        `).join('');
      }}

      // Water layers opacity
      document.getElementById('waterStage1').setAttribute('opacity', seaLevel > 0 ? Math.min(0.92, 0.45 + (seaLevel / 15) * 0.45) : 0);
      document.getElementById('waterStage2').setAttribute('opacity', seaLevel >= 8 ? Math.min(0.88, 0.40 + ((seaLevel - 8) / 25) * 0.45) : 0);
      document.getElementById('waterStage3').setAttribute('opacity', seaLevel >= 20 ? Math.min(0.90, 0.45 + ((seaLevel - 20) / 45) * 0.45) : 0);
      document.getElementById('waterStage4').setAttribute('opacity', data.flooded_percent > 40 ? Math.min(0.92, (data.flooded_percent - 40) / 60) : 0);

      renderPins();
    }}

    function onSeaLevelSlider(val) {{ updateSimulation(val); }}
    function onIceMeltSlider(pct) {{
      const meters = pct == 0 ? 0 : Math.round((pct / 100) * 66);
      updateSimulation(meters);
    }}
    function onDisplacedSlider(disp) {{
      fetch(`/api/displaced_to_meters?displaced=${{disp}}`)
        .then(r => r.json())
        .then(d => updateSimulation(d.sea_level_meters));
    }}

    function togglePlay() {{
      isPlaying = !isPlaying;
      const btn = document.getElementById('playBtn');
      if (isPlaying) {{
        btn.innerText = '⏸ Pause';
        btn.className = 'bg-amber-500 hover:bg-amber-600 text-slate-900 px-2.5 py-1 rounded-xl text-[11px] font-bold';
        playInterval = setInterval(() => {{
          if (seaLevel >= 1052) {{ togglePlay(); return; }}
          updateSimulation(seaLevel + (seaLevel < 50 ? 2 : 15));
        }}, 200);
      }} else {{
        btn.innerText = '▶ Auto Flood';
        btn.className = 'bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold';
        clearInterval(playInterval);
      }}
    }}

    function resetSliders() {{
      if (isPlaying) togglePlay();
      updateSimulation(0);
    }}

    function togglePopulationMode() {{
      showPopulation = !showPopulation;
      document.getElementById('populationLayer').setAttribute('opacity', showPopulation ? 1 : 0);
      document.getElementById('waterLayer').setAttribute('opacity', showPopulation ? 0.2 : 1);
      document.getElementById('mapModeTitle').innerText = showPopulation ? 'Demographic Density Map' : 'Topographical Elevation Map';
      document.getElementById('popToggleBtn').innerText = showPopulation ? '🌊 Flood Inundation View' : '👥 Population Density View';
    }}

    function zoomMap(factor) {{
      zoom = Math.max(0.6, Math.min(3, zoom * factor));
      document.getElementById('mapTransform').style.transform = `translate(${{pan.x}}px, ${{pan.y}}px) scale(${{zoom}})`;
    }}

    function resetZoom() {{
      zoom = 1; pan = {{ x: 0, y: 0 }};
      document.getElementById('mapTransform').style.transform = `translate(0px, 0px) scale(1)`;
    }}

    function toggleModal(id) {{
      const el = document.getElementById(`${{id}}Modal`);
      el.classList.toggle('hidden');
      el.classList.toggle('flex');
    }}

    // Init guide & history modals
    document.getElementById('historyList').innerHTML = FLOODS.map(f => `
      <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
        <div class="flex justify-between font-bold text-slate-800">
          <span>${{f.year}} - ${{f.name}}</span>
          <span class="text-sky-700">${{f.flooded_percent}}% flooded</span>
        </div>
        <p class="text-slate-600 text-[11px]">${{f.summary}}</p>
        <div class="text-[10px] text-slate-400 font-mono">Displaced: ${{f.displaced.toLocaleString()}} | Level: ${{f.water_level}}</div>
      </div>
    `).join('');

    document.getElementById('guideDosList').innerHTML = DOS.map(d => `<li>${{d}}</li>`).join('');
    document.getElementById('guideDontsList').innerHTML = DONTS.map(d => `<li>${{d}}</li>`).join('');

    // Initial render
    updateSimulation(0);
  </script>
</body>
</html>
"""

class FloodSimulatorHTTPHandler(BaseHTTPRequestHandler):
    """Handles HTTP requests and REST API for the Python flood simulator."""

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # 1. Main Application Web Page
        if path == "/" or path == "/index.html":
            html = get_html_app()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(html.encode("utf-8"))
            return

        # 2. REST API: /api/simulate?sea_level=X
        if path == "/api/simulate":
            sea_level = float(params.get("sea_level", [0])[0])
            result = calculate_flood_metrics(sea_level)
            self._send_json(result)
            return

        # 3. REST API: /api/cities
        if path == "/api/cities":
            cities = [c.to_dict() for c in BANGLADESH_CITIES]
            self._send_json(cities)
            return

        # 4. REST API: /api/displaced_to_meters?displaced=X
        if path == "/api/displaced_to_meters":
            displaced = int(params.get("displaced", [0])[0])
            meters = displaced_population_to_sea_level(displaced)
            self._send_json({"displaced": displaced, "sea_level_meters": meters})
            return

        # 5. REST API: /api/ice_to_meters?ice_melt=X
        if path == "/api/ice_to_meters":
            ice = float(params.get("ice_melt", [0])[0])
            meters = ice_melt_to_sea_level(ice)
            self._send_json({"ice_melt_percent": ice, "sea_level_meters": meters})
            return

        self.send_error(404, "Endpoint Not Found")

    def _send_json(self, data: Any):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        # Suppress noisy logs
        pass


def run_cli_simulation(sea_level: float):
    """Runs single-shot CLI calculation and prints formatted output."""
    res = calculate_flood_metrics(sea_level)
    print("\n=======================================================")
    print(f" 🇧🇩 BANGLADESH FLOOD & SEA LEVEL SIMULATION: +{res['sea_level_meters']:.1f}m")
    print("=======================================================")
    print(f" • Flooded Area:          {res['flooded_percent']}% ({res['submerged_area_km2']:,} km² of 147,570 km²)")
    print(f" • Displaced Population:   {res['displaced_population_millions']} Million ({res['displaced_population']:,} citizens)")
    print(f" • Polar Ice Melt Equiv:   {res['ice_melt_percent']}% (+66m benchmark)")
    print(f" • Inundated Districts:    {res['submerged_cities_count']} / {len(BANGLADESH_CITIES)}")
    print("\n[Submerged Districts]:")
    print(", ".join(res["submerged_cities"]) if res["submerged_cities"] else "None (Safe Baseline)")
    print("=======================================================\n")


def main():
    parser = argparse.ArgumentParser(description="Bangladesh Sea Level Rise & Flood Simulator (Python)")
    parser.add_argument("--cli", action="store_true", help="Run simulation in CLI terminal mode")
    parser.add_argument("--sea-level", type=float, default=0.0, help="Sea level rise in meters (0 - 1052)")
    parser.add_argument("--port", type=int, default=8000, help="HTTP server port for web interface (default: 8000)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="HTTP server host (default: 0.0.0.0)")

    args = parser.parse_args()

    if args.cli:
        run_cli_simulation(args.sea_level)
    else:
        server_address = (args.host, args.port)
        httpd = HTTPServer(server_address, FloodSimulatorHTTPHandler)
        print(f"\n🐍 Bangladesh Flood Simulator running in pure Python!")
        print(f"🌐 Web UI available at: http://localhost:{args.port}")
        print(f"   (Press Ctrl+C to stop)\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()


if __name__ == "__main__":
    main()
