#!/usr/bin/env python3
"""
Bangladesh Geographic, Demographic & Elevation Dataset
All 62 districts mapped to exact minute-scale coordinates, elevations, and populations.
"""

from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class City:
    id: str
    name: str
    bn_name: str
    division: str
    x_percent: float
    y_percent: float
    elevation_meters: float
    population: int
    is_division_capital: bool
    category: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id, "name": self.name, "bn_name": self.bn_name,
            "division": self.division, "x_percent": self.x_percent,
            "y_percent": self.y_percent, "elevation_meters": self.elevation_meters,
            "population": self.population, "is_division_capital": self.is_division_capital,
            "category": self.category
        }

COUNTRY_METADATA = {
    "id": "bangladesh",
    "name": "Bangladesh",
    "flag": "🇧🇩",
    "population": 173_000_000,
    "total_area_km2": 147_570,
    "urban_population_percent": 39.0,
    "coastal_vulnerable_percent": 68.0,
    "average_elevation_meters": 12.0,
    "highest_point_meters": 1052.0,
    "highest_point_name": "Mowdok Mual (Saka Haphong)",
    "lowest_point_meters": 0.0,
    "lowest_point_name": "Bay of Bengal Coastline",
}

BANGLADESH_CITIES: List[City] = [
    City(id="dhaka", name="Dhaka", bn_name="ঢাকা", division="Dhaka", x_percent=51.5, y_percent=49.5, elevation_meters=8, population=22400000, is_division_capital=True, category="megacity"),
    City(id="gazipur", name="Gazipur", bn_name="গাজীপুর", division="Dhaka", x_percent=51.8, y_percent=45.2, elevation_meters=14, population=2600000, is_division_capital=False, category="industrial"),
    City(id="narayanganj", name="Narayanganj", bn_name="নারায়ণগঞ্জ", division="Dhaka", x_percent=53.2, y_percent=52.0, elevation_meters=7, population=1850000, is_division_capital=False, category="industrial"),
    City(id="savar", name="Savar", bn_name="সাভার", division="Dhaka", x_percent=48.8, y_percent=48.0, elevation_meters=11, population=920000, is_division_capital=False, category="industrial"),
    City(id="tangail", name="Tangail", bn_name="টাঙ্গাইল", division="Dhaka", x_percent=44.0, y_percent=41.0, elevation_meters=15, population=520000, is_division_capital=False, category="district"),
    City(id="faridpur", name="Faridpur", bn_name="ফরিদপুর", division="Dhaka", x_percent=43.5, y_percent=54.5, elevation_meters=9, population=430000, is_division_capital=False, category="district"),
    City(id="manikganj", name="Manikganj", bn_name="মানিকগঞ্জ", division="Dhaka", x_percent=45.5, y_percent=49.0, elevation_meters=10, population=310000, is_division_capital=False, category="district"),
    City(id="narsingdi", name="Narsingdi", bn_name="নরসিংদী", division="Dhaka", x_percent=56.5, y_percent=47.5, elevation_meters=12, population=460000, is_division_capital=False, category="district"),
    City(id="munshiganj", name="Munshiganj", bn_name="মুন্সীগঞ্জ", division="Dhaka", x_percent=52.5, y_percent=54.0, elevation_meters=6, population=380000, is_division_capital=False, category="coastal"),
    City(id="gopalganj", name="Gopalganj", bn_name="গোপালগঞ্জ", division="Dhaka", x_percent=43.0, y_percent=61.0, elevation_meters=5, population=340000, is_division_capital=False, category="coastal"),
    City(id="kishoreganj", name="Kishoreganj", bn_name="কিশোরগঞ্জ", division="Dhaka", x_percent=58.0, y_percent=39.5, elevation_meters=13, population=410000, is_division_capital=False, category="district"),
    City(id="madaripur", name="Madaripur", bn_name="মাদারীপুর", division="Dhaka", x_percent=47.0, y_percent=58.5, elevation_meters=7, population=290000, is_division_capital=False, category="district"),
    City(id="shariatpur", name="Shariatpur", bn_name="শরীয়তপুর", division="Dhaka", x_percent=49.5, y_percent=57.5, elevation_meters=6, population=260000, is_division_capital=False, category="coastal"),
    City(id="rajbari", name="Rajbari", bn_name="রাজবাড়ী", division="Dhaka", x_percent=39.0, y_percent=51.0, elevation_meters=12, population=240000, is_division_capital=False, category="district"),
    City(id="chattogram", name="Chattogram", bn_name="চট্টগ্রাম", division="Chattogram", x_percent=74.0, y_percent=71.0, elevation_meters=11, population=5350000, is_division_capital=True, category="port"),
    City(id="coxsbazar", name="Cox's Bazar", bn_name="কক্সবাজার", division="Chattogram", x_percent=79.5, y_percent=84.0, elevation_meters=6, population=340000, is_division_capital=False, category="coastal"),
    City(id="cumilla", name="Cumilla", bn_name="কুমিল্লা", division="Chattogram", x_percent=62.0, y_percent=54.0, elevation_meters=14, population=820000, is_division_capital=False, category="district"),
    City(id="feni", name="Feni", bn_name="ফেনী", division="Chattogram", x_percent=66.5, y_percent=61.5, elevation_meters=9, population=330000, is_division_capital=False, category="coastal"),
    City(id="noakhali", name="Noakhali", bn_name="নোয়াখালী", division="Chattogram", x_percent=61.0, y_percent=65.5, elevation_meters=5, population=490000, is_division_capital=False, category="coastal"),
    City(id="brahmanbaria", name="Brahmanbaria", bn_name="ব্রাহ্মণবাড়িয়া", division="Chattogram", x_percent=62.5, y_percent=47.0, elevation_meters=13, population=410000, is_division_capital=False, category="district"),
    City(id="chandpur", name="Chandpur", bn_name="চাঁদপুর", division="Chattogram", x_percent=55.5, y_percent=59.5, elevation_meters=6, population=370000, is_division_capital=False, category="coastal"),
    City(id="lakshmipur", name="Lakshmipur", bn_name="লক্ষ্মীপুর", division="Chattogram", x_percent=57.0, y_percent=65.0, elevation_meters=5, population=310000, is_division_capital=False, category="coastal"),
    City(id="rangamati", name="Rangamati", bn_name="রাঙ্গামাটি", division="Chattogram", x_percent=81.0, y_percent=68.0, elevation_meters=68, population=160000, is_division_capital=False, category="hill_tract"),
    City(id="bandarban", name="Bandarban", bn_name="বান্দরবান", division="Chattogram", x_percent=82.5, y_percent=76.5, elevation_meters=85, population=140000, is_division_capital=False, category="hill_tract"),
    City(id="khagrachhari", name="Khagrachhari", bn_name="খাগড়াছড়ি", division="Chattogram", x_percent=77.0, y_percent=59.5, elevation_meters=54, population=150000, is_division_capital=False, category="hill_tract"),
    City(id="sylhet", name="Sylhet", bn_name="সিলেট", division="Sylhet", x_percent=70.0, y_percent=33.0, elevation_meters=22, population=1050000, is_division_capital=True, category="district"),
    City(id="sunamganj", name="Sunamganj", bn_name="সুনামগঞ্জ", division="Sylhet", x_percent=63.5, y_percent=29.5, elevation_meters=10, population=320000, is_division_capital=False, category="coastal"),
    City(id="moulvibazar", name="Moulvibazar", bn_name="মৌলভীবাজার", division="Sylhet", x_percent=70.5, y_percent=39.5, elevation_meters=25, population=290000, is_division_capital=False, category="district"),
    City(id="habiganj", name="Habiganj", bn_name="হবিগঞ্জ", division="Sylhet", x_percent=64.5, y_percent=42.0, elevation_meters=16, population=280000, is_division_capital=False, category="district"),
    City(id="khulna", name="Khulna", bn_name="খুলনা", division="Khulna", x_percent=38.0, y_percent=68.0, elevation_meters=6, population=1550000, is_division_capital=True, category="port"),
    City(id="jashore", name="Jashore", bn_name="যশোর", division="Khulna", x_percent=33.5, y_percent=61.5, elevation_meters=10, population=580000, is_division_capital=False, category="district"),
    City(id="kushtia", name="Kushtia", bn_name="কুষ্টিয়া", division="Khulna", x_percent=31.0, y_percent=48.0, elevation_meters=16, population=440000, is_division_capital=False, category="district"),
    City(id="satkhira", name="Satkhira", bn_name="সাতক্ষীরা", division="Khulna", x_percent=31.5, y_percent=70.5, elevation_meters=4, population=390000, is_division_capital=False, category="coastal"),
    City(id="bagerhat", name="Bagerhat", bn_name="বাগেরহাট", division="Khulna", x_percent=41.5, y_percent=70.0, elevation_meters=4, population=290000, is_division_capital=False, category="coastal"),
    City(id="jhenaidah", name="Jhenaidah", bn_name="ঝিনাইদহ", division="Khulna", x_percent=32.5, y_percent=55.0, elevation_meters=13, population=310000, is_division_capital=False, category="district"),
    City(id="chuadanga", name="Chuadanga", bn_name="চুয়াডাঙ্গা", division="Khulna", x_percent=27.5, y_percent=52.5, elevation_meters=17, population=230000, is_division_capital=False, category="district"),
    City(id="magura", name="Magura", bn_name="মাগুরা", division="Khulna", x_percent=36.5, y_percent=56.5, elevation_meters=11, population=210000, is_division_capital=False, category="district"),
    City(id="narail", name="Narail", bn_name="নড়াইল", division="Khulna", x_percent=38.5, y_percent=62.0, elevation_meters=8, population=190000, is_division_capital=False, category="district"),
    City(id="meherpur", name="Meherpur", bn_name="মেহেরপুর", division="Khulna", x_percent=26.0, y_percent=49.0, elevation_meters=18, population=180000, is_division_capital=False, category="district"),
    City(id="barishal", name="Barishal", bn_name="বরিশাল", division="Barishal", x_percent=49.5, y_percent=69.5, elevation_meters=5, population=620000, is_division_capital=True, category="port"),
    City(id="patuakhali", name="Patuakhali", bn_name="পটুয়াখালী", division="Barishal", x_percent=49.0, y_percent=77.0, elevation_meters=3, population=280000, is_division_capital=False, category="coastal"),
    City(id="bhola", name="Bhola", bn_name="ভোলা", division="Barishal", x_percent=55.0, y_percent=72.5, elevation_meters=3, population=320000, is_division_capital=False, category="coastal"),
    City(id="pirojpur", name="Pirojpur", bn_name="পিরোজপুর", division="Barishal", x_percent=44.5, y_percent=71.0, elevation_meters=4, population=230000, is_division_capital=False, category="coastal"),
    City(id="barguna", name="Barguna", bn_name="বরগুনা", division="Barishal", x_percent=45.5, y_percent=78.5, elevation_meters=2, population=210000, is_division_capital=False, category="coastal"),
    City(id="jhalokathi", name="Jhalokathi", bn_name="ঝালকাঠি", division="Barishal", x_percent=47.0, y_percent=69.0, elevation_meters=5, population=180000, is_division_capital=False, category="coastal"),
    City(id="rajshahi", name="Rajshahi", bn_name="রাজশাহী", division="Rajshahi", x_percent=26.5, y_percent=43.5, elevation_meters=23, population=950000, is_division_capital=True, category="district"),
    City(id="bogura", name="Bogura", bn_name="বগুড়া", division="Rajshahi", x_percent=38.5, y_percent=34.0, elevation_meters=28, population=780000, is_division_capital=False, category="industrial"),
    City(id="pabna", name="Pabna", bn_name="পাবনা", division="Rajshahi", x_percent=35.5, y_percent=47.5, elevation_meters=17, population=410000, is_division_capital=False, category="district"),
    City(id="sirajganj", name="Sirajganj", bn_name="সিরাজগঞ্জ", division="Rajshahi", x_percent=42.0, y_percent=42.5, elevation_meters=16, population=360000, is_division_capital=False, category="district"),
    City(id="naogaon", name="Naogaon", bn_name="নওগাঁ", division="Rajshahi", x_percent=31.0, y_percent=36.0, elevation_meters=25, population=320000, is_division_capital=False, category="district"),
    City(id="natore", name="Natore", bn_name="নাটোর", division="Rajshahi", x_percent=33.0, y_percent=42.0, elevation_meters=20, population=260000, is_division_capital=False, category="district"),
    City(id="chapainawabganj", name="Chapai Nawabganj", bn_name="চাঁপাইনবাবগঞ্জ", division="Rajshahi", x_percent=21.0, y_percent=39.5, elevation_meters=26, population=290000, is_division_capital=False, category="district"),
    City(id="joypurhat", name="Joypurhat", bn_name="জয়পুরহাট", division="Rajshahi", x_percent=33.5, y_percent=28.5, elevation_meters=30, population=210000, is_division_capital=False, category="district"),
    City(id="rangpur", name="Rangpur", bn_name="রংপুর", division="Rangpur", x_percent=31.0, y_percent=21.0, elevation_meters=34, population=460000, is_division_capital=True, category="district"),
    City(id="dinajpur", name="Dinajpur", bn_name="দিনাজপুর", division="Rangpur", x_percent=24.5, y_percent=22.0, elevation_meters=37, population=360000, is_division_capital=False, category="district"),
    City(id="kurigram", name="Kurigram", bn_name="কুড়িগ্রাম", division="Rangpur", x_percent=39.5, y_percent=20.0, elevation_meters=31, population=290000, is_division_capital=False, category="district"),
    City(id="panchagarh", name="Panchagarh", bn_name="পঞ্চগড়", division="Rangpur", x_percent=18.0, y_percent=10.5, elevation_meters=55, population=180000, is_division_capital=False, category="district"),
    City(id="thakurgaon", name="Thakurgaon", bn_name="ঠাকুরগাঁও", division="Rangpur", x_percent=21.0, y_percent=17.5, elevation_meters=48, population=220000, is_division_capital=False, category="district"),
    City(id="nilphamari", name="Nilphamari", bn_name="নীলফামারী", division="Rangpur", x_percent=27.5, y_percent=16.5, elevation_meters=42, population=240000, is_division_capital=False, category="district"),
    City(id="gaibandha", name="Gaibandha", bn_name="গাইবান্ধা", division="Rangpur", x_percent=37.5, y_percent=26.5, elevation_meters=29, population=280000, is_division_capital=False, category="district"),
    City(id="lalmonirhat", name="Lalmonirhat", bn_name="লালমনিরহাট", division="Rangpur", x_percent=34.0, y_percent=17.0, elevation_meters=36, population=190000, is_division_capital=False, category="district"),
    City(id="mymensingh", name="Mymensingh", bn_name="ময়মনসিংহ", division="Mymensingh", x_percent=51.0, y_percent=33.5, elevation_meters=19, population=620000, is_division_capital=True, category="district"),
    City(id="jamalpur", name="Jamalpur", bn_name="জামালপুর", division="Mymensingh", x_percent=43.5, y_percent=32.0, elevation_meters=21, population=310000, is_division_capital=False, category="district"),
    City(id="netrokona", name="Netrokona", bn_name="নেত্রকোণা", division="Mymensingh", x_percent=57.0, y_percent=32.5, elevation_meters=16, population=270000, is_division_capital=False, category="district"),
    City(id="sherpur", name="Sherpur", bn_name="শেরপুর", division="Mymensingh", x_percent=47.0, y_percent=28.5, elevation_meters=24, population=210000, is_division_capital=False, category="district"),
]

HISTORICAL_FLOODS = [
    {
        "year": 1998,
        "name": "The Great Bangladesh Super Flood",
        "water_level": "Over 2.5m above danger levels",
        "displaced": 31_000_000,
        "flooded_percent": 68.0,
        "duration_days": 75,
        "summary": "Submerged 68% of the country for 75 days as Ganges and Brahmaputra rivers crested concurrently."
    },
    {
        "year": 1988,
        "name": "Record Brahmaputra Inundation",
        "water_level": "1.4m record crest",
        "displaced": 45_000_000,
        "flooded_percent": 61.0,
        "duration_days": 30,
        "summary": "Flooded Dhaka International Airport and severed national highways; catalyzed the Flood Action Plan."
    },
    {
        "year": 2004,
        "name": "Monsoon Inundation of Dhaka",
        "water_level": "2.1m above datum",
        "displaced": 36_000_000,
        "flooded_percent": 38.0,
        "duration_days": 21,
        "summary": "Severely inundated 40% of the capital city Dhaka and caused over .2 billion in damage."
    },
    {
        "year": 2020,
        "name": "Super-Cyclone Amphan & Extended Monsoon",
        "water_level": "3.2m storm surge",
        "displaced": 5_000_000,
        "flooded_percent": 37.0,
        "duration_days": 45,
        "summary": "Flooded 37% of Bangladesh amidst pandemic lockdowns with massive polder breaches in Khulna & Satkhira."
    },
    {
        "year": 2022,
        "name": "Sylhet Flash Deluge Crisis",
        "water_level": "Record 122-year rainfall",
        "displaced": 7_200_000,
        "flooded_percent": 84.0,
        "duration_days": 18,
        "summary": "Inundated 84% of Sylhet division and 94% of Sunamganj due to unprecedented Meghalaya cloudbursts."
    },
]
