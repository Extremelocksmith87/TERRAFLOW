#!/usr/bin/env python3
"""
Hydrological & Hypsographic Simulation Engine for Bangladesh Sea Level Rise & Floods
Accurately replicates all formulas, thresholds, hypsographic curves, and population modeling.
"""

from typing import Dict, Any, List
from bangladesh_data import BANGLADESH_CITIES, COUNTRY_METADATA, City

# Constants matching exact application parameters
MAX_ELEVATION_METERS: float = COUNTRY_METADATA["highest_point_meters"]  # 1,052.0m (Mowdok Mual)
AVERAGE_ELEVATION_METERS: float = COUNTRY_METADATA["average_elevation_meters"]  # 12.0m
TOTAL_POPULATION: int = COUNTRY_METADATA["population"]  # 173,000,000
TOTAL_AREA_KM2: int = COUNTRY_METADATA["total_area_km2"]  # 147,570 km²
COASTAL_VULNERABLE_PCT: float = COUNTRY_METADATA["coastal_vulnerable_percent"]  # 68%
URBAN_POP_PCT: float = COUNTRY_METADATA["urban_population_percent"]  # 39%
POLAR_ICE_FULL_MELT_METERS: float = 66.0  # +66m global sea level when 100% polar ice caps melt


def calculate_flood_metrics(sea_level_meters: float) -> Dict[str, Any]:
    """
    Computes inundated area, flooded percentage, displaced population,
    and flooded district list based on exact hypsographic curve.
    
    Rules:
    - At 0m: strictly 0% flooded, 0 km² submerged, 0 displaced.
    - At >= MAX_ELEVATION_METERS (1052m): 100% flooded, full area submerged, all 173M displaced.
    """
    meters = float(sea_level_meters)

    # 1. Baseline Safe Level
    if meters <= 0.0:
        return {
            "sea_level_meters": 0.0,
            "flooded_percent": 0.0,
            "submerged_area_km2": 0,
            "displaced_population": 0,
            "displaced_population_millions": 0.0,
            "submerged_cities_count": 0,
            "submerged_cities": [],
            "ice_melt_percent": 0.0,
        }

    # 2. Maximum Elevation (Peak 1,052m ceiling = 100% flooded)
    if meters >= MAX_ELEVATION_METERS:
        return {
            "sea_level_meters": meters,
            "flooded_percent": 100.0,
            "submerged_area_km2": TOTAL_AREA_KM2,
            "displaced_population": TOTAL_POPULATION,
            "displaced_population_millions": TOTAL_POPULATION / 1_000_000,
            "submerged_cities_count": len(BANGLADESH_CITIES),
            "submerged_cities": [c.name for c in BANGLADESH_CITIES],
            "ice_melt_percent": 100.0,
        }

    # 3. Piecewise Hypsographic Inundation Curve
    # Stage A: 0m to 5m (Sundarbans mangrove delta and southern lowlands)
    if meters <= 5.0:
        pct = (meters / 5.0) * (COASTAL_VULNERABLE_PCT * 0.35)
    # Stage B: 5m to 12m (Lower delta plains and central river basins)
    elif meters <= AVERAGE_ELEVATION_METERS:
        t = (meters - 5.0) / (AVERAGE_ELEVATION_METERS - 5.0)
        base_pct = COASTAL_VULNERABLE_PCT * 0.35
        pct = base_pct + t * (58.0 - base_pct)
    # Stage C: 12m to 1052m (Terraces, Barind Tract, Haor basins, and Chittagong hills)
    else:
        t = (meters - AVERAGE_ELEVATION_METERS) / (MAX_ELEVATION_METERS - AVERAGE_ELEVATION_METERS)
        pct = 58.0 + t * 42.0

    pct = max(0.0, min(100.0, pct))
    submerged_area = round((pct / 100.0) * TOTAL_AREA_KM2)

    # 4. Submerged Districts Evaluation
    submerged_cities: List[City] = [c for c in BANGLADESH_CITIES if c.elevation_meters <= meters]
    submerged_city_names = [c.name for c in submerged_cities]
    city_displaced = sum(c.population for c in submerged_cities)

    # 5. Rural Population Displacement Modeling
    rural_population = TOTAL_POPULATION * (1.0 - URBAN_POP_PCT / 100.0)
    rural_displaced = round(rural_population * (pct / 100.0))

    total_displaced = min(TOTAL_POPULATION, city_displaced + rural_displaced)

    # 6. Equivalent Polar Ice Melt percentage (+66m = 100% ice melt)
    ice_melt_pct = min(100.0, (meters / POLAR_ICE_FULL_MELT_METERS) * 100.0)

    return {
        "sea_level_meters": meters,
        "flooded_percent": round(pct, 2),
        "submerged_area_km2": submerged_area,
        "displaced_population": total_displaced,
        "displaced_population_millions": round(total_displaced / 1_000_000, 2),
        "submerged_cities_count": len(submerged_cities),
        "submerged_cities": submerged_city_names,
        "ice_melt_percent": round(ice_melt_pct, 1),
    }


def ice_melt_to_sea_level(ice_melt_percent: float) -> float:
    """Converts polar ice cap melt percentage (0-100%) to sea level rise (0-66m)."""
    pct = max(0.0, min(100.0, float(ice_melt_percent)))
    if pct <= 0.0:
        return 0.0
    return round((pct / 100.0) * POLAR_ICE_FULL_MELT_METERS, 2)


def displaced_population_to_sea_level(displaced_count: int) -> float:
    """
    Inverses the displaced population back to equivalent sea level meters.
    Used for the interactive displaced population slider.
    """
    if displaced_count <= 0:
        return 0.0

    fraction = displaced_count / TOTAL_POPULATION

    if fraction <= 0.005:
        target_sea_level = 0.0
    elif fraction <= 0.35:
        target_sea_level = max(1.0, round((fraction / 0.35) * 5.0, 1))
    elif fraction <= 0.65:
        target_sea_level = round(5.0 + ((fraction - 0.35) / 0.30) * (AVERAGE_ELEVATION_METERS - 5.0), 1)
    elif fraction < 0.99:
        target_sea_level = round(AVERAGE_ELEVATION_METERS + ((fraction - 0.65) / 0.34) * (MAX_ELEVATION_METERS - AVERAGE_ELEVATION_METERS), 1)
    else:
        target_sea_level = MAX_ELEVATION_METERS

    return max(0.0, min(MAX_ELEVATION_METERS, target_sea_level))
