import { GuideItem, DontItem } from '../types/flood';

export const FLOOD_GUIDE_DOS: GuideItem[] = [
  // Preparation & Pre-Flood (Items 1 - 10)
  {
    id: 1,
    title: 'Assemble a 72-Hour Waterproof Emergency Go-Bag',
    description: 'Pack non-perishable canned food, 3 gallons of bottled water per person, multi-tool, flashlights, portable power bank, whistle, and a certified battery-powered NOAA weather radio inside heavy-duty waterproof dry bags.',
    category: 'prepare',
    actionIcon: 'backpack',
    priority: 'critical'
  },
  {
    id: 2,
    title: 'Digitize and Waterproof Vital Documents',
    description: 'Place birth certificates, passports, property deeds, flood insurance policies, and medical records in an airtight waterproof pouch. Upload encrypted backup scans to secure cloud storage.',
    category: 'prepare',
    actionIcon: 'file-text',
    priority: 'critical'
  },
  {
    id: 3,
    title: 'Learn Two High-Ground Evacuation Routes',
    description: 'Identify at least two elevated escape paths from your residence to designated community flood shelters, noting low-lying bridges and culverts that flood earliest.',
    category: 'prepare',
    actionIcon: 'map-pin',
    priority: 'high'
  },
  {
    id: 4,
    title: 'Install Check Valves on Plumbing Drains',
    description: 'Fit backwater check valves or sewer plugs on lower-level plumbing fixtures and basement drains to stop municipal sewage backup during river cresting.',
    category: 'prepare',
    actionIcon: 'tool',
    priority: 'high'
  },
  {
    id: 5,
    title: 'Elevate Furnace, Water Heater, and Electrical Panels',
    description: 'Contract licensed technicians to raise your main electrical breaker panel, HVAC furnace, water heater, and inverter systems at least 12 inches above base flood elevation.',
    category: 'prepare',
    actionIcon: 'zap',
    priority: 'high'
  },
  {
    id: 6,
    title: 'Maintain Clear Gutters and Downspouts',
    description: 'Clear leaves, debris, and sediment from roof gutters and route downspout extensions at least 10 feet away from exterior foundation walls.',
    category: 'prepare',
    actionIcon: 'home',
    priority: 'recommended'
  },
  {
    id: 7,
    title: 'Test Sump Pumps and Battery Backups',
    description: 'Inspect basement sump pump impellers, flush discharge pipes, and test rechargeable 12V auxiliary battery backup systems to ensure operation during power cuts.',
    category: 'prepare',
    actionIcon: 'battery-charging',
    priority: 'high'
  },
  {
    id: 8,
    title: 'Anchor Fuel and Propane Storage Tanks',
    description: 'Firmly bolt ground fuel tanks and strapping unanchored propane cylinders to concrete slabs so they do not float away, rupture lines, or cause explosions.',
    category: 'prepare',
    actionIcon: 'shield-alert',
    priority: 'critical'
  },
  {
    id: 9,
    title: 'Create an Out-of-State Family Communication Plan',
    description: 'Designate a single long-distance relative as the central check-in contact, as local cellular voice lines often jam while SMS text messages get through.',
    category: 'prepare',
    actionIcon: 'phone-call',
    priority: 'recommended'
  },
  {
    id: 10,
    title: 'Keep Sandbags and Burlap Ready in Low-Lying Zones',
    description: 'Stock unfilled burlap sandbags and coarse builder sand. Stack bags in staggered pyramid courses against vulnerable doorways and garage thresholds.',
    category: 'prepare',
    actionIcon: 'layers',
    priority: 'recommended'
  },

  // Warning & Immediate Onset (Items 11 - 18)
  {
    id: 11,
    title: 'Monitor Official Meteorological Alert Broadcasts',
    description: 'Tune into official national meteorological emergency alerts via battery radio or phone notifications; immediately distinguish between Flood Watches and imminent Flood Warnings.',
    category: 'warning',
    actionIcon: 'radio',
    priority: 'critical'
  },
  {
    id: 12,
    title: 'Move Valuable Electronics and Furniture to Upper Floors',
    description: 'Relocate computers, heirloom items, photos, carpets, and essential paperwork to second floors, attics, or high tables before water crosses the yard.',
    category: 'warning',
    actionIcon: 'arrow-up-circle',
    priority: 'high'
  },
  {
    id: 13,
    title: 'Shut Off Main Electrical Breaker Before Water Ingress',
    description: 'If water has not yet reached the electrical panel and your feet are completely dry, switch off the central electrical breaker to prevent arc faults and electrocution.',
    category: 'warning',
    actionIcon: 'power',
    priority: 'critical'
  },
  {
    id: 14,
    title: 'Turn Off Gas Supply at the External Meter Valve',
    description: 'Use an adjustable wrench to rotate the main natural gas shutoff valve a quarter turn perpendicular to the pipe line to prevent gas leaks from floating appliances.',
    category: 'warning',
    actionIcon: 'flame',
    priority: 'critical'
  },
  {
    id: 15,
    title: 'Close the Main Household Water Inflow Valve',
    description: 'Turn off the main municipal water shutoff valve to prevent contaminated flood sediment from back-siphoning into your clean internal copper or PEX water lines.',
    category: 'warning',
    actionIcon: 'droplets',
    priority: 'high'
  },
  {
    id: 16,
    title: 'Store Potable Clean Tap Water in Sealed Containers',
    description: 'Fill clean food-grade buckets, sterilized plastic containers, and clean bathtubs before municipal water mains are shut down or compromised by storm runoff.',
    category: 'warning',
    actionIcon: 'cup-soda',
    priority: 'high'
  },
  {
    id: 17,
    title: 'Charge Mobile Phones and Power Banks Fully',
    description: 'Top up all communication devices to 100% and switch mobile phones to low-power battery saver mode to maximize operational longevity.',
    category: 'warning',
    actionIcon: 'battery',
    priority: 'high'
  },
  {
    id: 18,
    title: 'Secure Outdoor Patio Furniture, Bins, and Toys',
    description: 'Bring trash cans, patio chairs, gardening tools, and barbecues inside the garage so they do not become floating battering rams damaging doors and walls.',
    category: 'warning',
    actionIcon: 'lock',
    priority: 'recommended'
  },

  // During Flood & Evacuation (Items 19 - 24)
  {
    id: 19,
    title: 'Evacuate Immediately When Prompted by Civil Authorities',
    description: 'Do not hesitate or delay departure when emergency evacuation orders are issued. Leave early before low-lying access bridges and culverts submerge.',
    category: 'evacuate',
    actionIcon: 'log-out',
    priority: 'critical'
  },
  {
    id: 20,
    title: 'Move to Highest Accessible Structural Elevation',
    description: 'If trapped indoors by sudden flash floods, climb to upper floors or onto the roof. Always carry an axe or crowbar so you do not become trapped inside an unvented attic.',
    category: 'evacuate',
    actionIcon: 'shield-alert',
    priority: 'critical'
  },
  {
    id: 21,
    title: 'Signal for Emergency Search and Rescue',
    description: 'Hang bright sheets, wave vibrant clothing, blast a marine whistle, or flash a high-candela strobe light toward aircraft and rescue boats to signal your location.',
    category: 'evacuate',
    actionIcon: 'flag',
    priority: 'critical'
  },
  {
    id: 22,
    title: 'Wear Approved Personal Flotation Devices (PFDs)',
    description: 'Equip every family member, including children and vulnerable adults, with Coast Guard-approved life vests before wading through any water or boarding skiffs.',
    category: 'evacuate',
    actionIcon: 'life-buoy',
    priority: 'critical'
  },
  {
    id: 23,
    title: 'Keep Pets Secure in Crates with Harnesses and Leashes',
    description: 'Place pets in waterproof-lined carriers with comfort blankets, identification collars, vaccination records, and a 5-day supply of canned animal food.',
    category: 'evacuate',
    actionIcon: 'heart',
    priority: 'high'
  },
  {
    id: 24,
    title: 'Check on Elderly and Disabled Neighbors Safely',
    description: 'Verify the safety and evacuation status of mobility-impaired or elderly neighbors on your block while access roads remain dry and traversable.',
    category: 'evacuate',
    actionIcon: 'users',
    priority: 'high'
  },

  // Post-Flood Recovery & Health (Items 25 - 30)
  {
    id: 25,
    title: 'Wait for Official Clearance Before Returning Home',
    description: 'Only re-enter evacuated flood zones after local building inspectors and civil defense authorities verify structural integrity, bridge safety, and utility lines.',
    category: 'recovery',
    actionIcon: 'check-circle',
    priority: 'critical'
  },
  {
    id: 26,
    title: 'Inspect Foundation for Cracks, Shifts, and Sinkholes',
    description: 'Examine exterior foundation walls, porches, and support piers for bulging, displacement, or soil washout before stepping inside any flooded structure.',
    category: 'recovery',
    actionIcon: 'eye',
    priority: 'critical'
  },
  {
    id: 27,
    title: 'Boil All Drinking and Cooking Water for At Least 1 Minute',
    description: 'Assume all municipal and private well tap water is contaminated with bacteria, coliforms, or heavy metals until municipal boil-water advisories are lifted.',
    category: 'health',
    actionIcon: 'thermometer',
    priority: 'critical'
  },
  {
    id: 28,
    title: 'Wear Heavy Rubber Boots, N95 Respirators, and Nitrile Gloves',
    description: 'Protect skin and respiratory systems from toxic bio-sludge, airborne mold spores, sharp debris, and biological contaminants during clean-out operations.',
    category: 'health',
    actionIcon: 'shield',
    priority: 'high'
  },
  {
    id: 29,
    title: 'Discard All Food, Medicine, and Cosmetics Exposed to Water',
    description: 'Throw away any packaged food, screw-cap bottles, spices, cosmetics, or medicine touched by floodwaters, even if unopened, due to pathogen penetration.',
    category: 'health',
    actionIcon: 'trash-2',
    priority: 'critical'
  },
  {
    id: 30,
    title: 'Document Damage Extensively with Photos and Video',
    description: 'Photograph watermarks on drywall, serial numbers of damaged HVAC units, ruined furniture, and floorings from multiple angles before discarding for insurance claims.',
    category: 'recovery',
    actionIcon: 'camera',
    priority: 'high'
  }
];

export const FLOOD_GUIDE_DONTS: DontItem[] = [
  {
    id: 1,
    rule: 'NEVER Drive Through Moving or Standing Floodwater',
    dangerExplanation: 'Just 6 inches (15 cm) of moving water can stall a passenger car and knock over an adult. Just 12 inches (30 cm) can float most sedans, and 24 inches (60 cm) will sweep away SUVs and trucks. Hidden washed-out bridges and sinkholes are undetectable beneath murky floodwaters.',
    safeAlternative: "Follow the universal rule: 'Turn Around, Don't Drown!' Back up immediately and locate an elevated detour route.",
    iconName: 'car'
  },
  {
    id: 2,
    rule: 'NEVER Touch Fallen Power Lines or Flooded Electrical Outlets',
    dangerExplanation: 'Downed electrical lines energize surrounding standing water for tens of yards. Touching submerged appliances, outlets, or water near frayed wiring causes instantaneous fatal electric shocks.',
    safeAlternative: 'Stay at least 35 feet (10 meters) away from any downed wire and call emergency services and the utility company immediately.',
    iconName: 'zap-off'
  },
  {
    id: 3,
    rule: 'NEVER Drink Tap Water, Well Water, or Ice Before Testing',
    dangerExplanation: 'Floods routinely rupture municipal sewer mains, submerge industrial runoffs, and flood agricultural septic tanks, saturating public aquifers with deadly E. coli, Giardia, and chemical toxins.',
    safeAlternative: 'Drink exclusively factory-sealed bottled water or boil all water vigorously for a full 60 seconds (3 minutes at high altitude) before consumption.',
    iconName: 'glass-water'
  },
  {
    id: 4,
    rule: 'NEVER Walk or Wade Into Rapidly Flowing Currents',
    dangerExplanation: 'Moving water creates hydraulic drag that easily sweeps away strong adults. Submerged tree branches, broken glass, jagged rebar, and missing storm drain grates create underwater puncture and entrapment death-traps.',
    safeAlternative: 'Stay on elevated dry ground. If walking through shallow water is unavoidable, probe ahead with a sturdy stick to test bottom firmness.',
    iconName: 'footprints'
  },
  {
    id: 5,
    rule: 'NEVER Climb Into an Attic Without an Escape Hatch or Roof Tool',
    dangerExplanation: 'Rising water can flood the attic space rapidly. Countless victims have become trapped against roof rafters by surging floodwaters with no way to punch through shingles to the exterior.',
    safeAlternative: 'Only access an attic if you bring an axe, crowbar, or reciprocating saw, or climb directly onto the exterior roof ridge.',
    iconName: 'alert-triangle'
  },
  {
    id: 6,
    rule: 'NEVER Run Gas Generators, Camp Stoves, or Charcoal Grills Indoors',
    dangerExplanation: 'Combustion engines and charcoal emit lethal, odorless carbon monoxide (CO) gas. In enclosed or semi-enclosed garages, CO accumulates to fatal concentrations in under 15 minutes.',
    safeAlternative: 'Position all portable generators at least 20 feet away from exterior windows, doors, and air intake vents with exhaust directed outward.',
    iconName: 'wind'
  },
  {
    id: 7,
    rule: 'NEVER Allow Children or Pets to Swim or Play in Floodwater',
    dangerExplanation: 'Flood runoff is classified as Category 3 "Black Water", containing raw sewage, petrochemicals, rat urine (Leptospirosis), flesh-eating bacteria (Vibrio), and venomous snakes seeking dry debris.',
    safeAlternative: 'Keep youngsters and animals confined strictly to clean indoor dry zones and wash immediately with disinfectant soap if accidental contact occurs.',
    iconName: 'shield-x'
  },
  {
    id: 8,
    rule: 'NEVER Ignore Official Mandatory Evacuation Directives',
    dangerExplanation: 'Waiting until water enters the living room overwhelms first responder boat squads, traps emergency crews, and dramatically increases mortality during dark night hours.',
    safeAlternative: 'Pack your ready go-bag and evacuate at the very first notification from civil defense, before arterial roads become gridlocked.',
    iconName: 'bell-off'
  },
  {
    id: 9,
    rule: 'NEVER Turn Electrical Mains Back On While Standing in Moisture',
    dangerExplanation: 'Flipping heavy circuit breakers while wet or standing on damp concrete can initiate high-voltage arc flashes that trigger severe third-degree burns and ventricular fibrillation.',
    safeAlternative: 'Have a certified master electrician inspect the entire distribution panel and certify circuits dry before restoring power.',
    iconName: 'power-off'
  },
  {
    id: 10,
    rule: 'NEVER Spread Unverified Disaster Rumors or Jam Emergency 911 Lines',
    dangerExplanation: 'Spreading unsubstantiated dam collapse or bridge rumor posts on social media incites mass panic, jams critical evacuation arteries, and diverts scarce rescue boats from real crisis zones.',
    safeAlternative: 'Rely solely on verified civil protection updates. Reserve emergency telephone dispatch lines strictly for immediate life-threatening events.',
    iconName: 'message-square-off'
  }
];
