#!/usr/bin/env python3
"""
Bangladesh Sea Level Rise & Flood Simulator - Complete Standalone Python Application
Exact minute-scale mathematical modeling, 65 districts, hypsographic curve,
water simulation stages, and interactive web dashboard.

Usage:
  python3 bangladesh_flood_simulator.py              # Starts the interactive local web dashboard
  python3 bangladesh_flood_simulator.py --cli --sea-level 12   # Runs instant CLI simulation
"""

import sys
import os

# Add python directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python'))

from app import main

if __name__ == '__main__':
    main()
