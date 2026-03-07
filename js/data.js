// Star Citizen Salvage Calculator - Data
// Values are community-sourced estimates and may change between patches.
// Last updated reference: SC 4.6 (2026)

const SALVAGE_DATA = {

  // ─── Ships that can be salvaged (targets) ───
  // RMC = SCU of RMC from hull scraping
  // CMR = SCU of raw Construction Materials from structural salvage (before refining)
  targetShips: {
    // Snub / Extra Small
    "MPUV Cargo":        { size: "XS", rmc: 1,   cmr: 2   },
    "MPUV Personnel":    { size: "XS", rmc: 1,   cmr: 2   },
    "Merlin":            { size: "XS", rmc: 1,   cmr: 1.5 },
    "Archimedes":        { size: "XS", rmc: 1,   cmr: 1.5 },
    "Fury":              { size: "XS", rmc: 1.5, cmr: 2   },
    "Fury MX":           { size: "XS", rmc: 1.5, cmr: 2   },

    // Small
    "Aurora MR":         { size: "S",  rmc: 2,   cmr: 4   },
    "Aurora LN":         { size: "S",  rmc: 2.5, cmr: 4.5 },
    "Aurora CL":         { size: "S",  rmc: 2,   cmr: 4   },
    "Aurora LX":         { size: "S",  rmc: 2,   cmr: 4   },
    "Mustang Alpha":     { size: "S",  rmc: 2,   cmr: 3.5 },
    "Mustang Delta":     { size: "S",  rmc: 2.5, cmr: 4   },
    "100i":              { size: "S",  rmc: 2,   cmr: 4   },
    "125a":              { size: "S",  rmc: 2.5, cmr: 4.5 },
    "135c":              { size: "S",  rmc: 2,   cmr: 4   },
    "300i":              { size: "S",  rmc: 3,   cmr: 5   },
    "315p":              { size: "S",  rmc: 3,   cmr: 5   },
    "325a":              { size: "S",  rmc: 3,   cmr: 5.5 },
    "350r":              { size: "S",  rmc: 3,   cmr: 5   },
    "Avenger Stalker":   { size: "S",  rmc: 3,   cmr: 5   },
    "Avenger Titan":     { size: "S",  rmc: 3,   cmr: 5   },
    "Avenger Warlock":   { size: "S",  rmc: 3,   cmr: 5.5 },
    "Arrow":             { size: "S",  rmc: 2,   cmr: 3.5 },
    "Gladius":           { size: "S",  rmc: 2.5, cmr: 4   },
    "Buccaneer":         { size: "S",  rmc: 2.5, cmr: 4.5 },
    "Reliant Kore":      { size: "S",  rmc: 3,   cmr: 5   },
    "Reliant Tana":      { size: "S",  rmc: 3,   cmr: 5.5 },
    "Reliant Sen":       { size: "S",  rmc: 3,   cmr: 5   },
    "Reliant Mako":      { size: "S",  rmc: 3,   cmr: 5   },
    "Nomad":             { size: "S",  rmc: 3,   cmr: 5   },
    "Pisces":            { size: "S",  rmc: 2,   cmr: 3   },
    "Herald":            { size: "S",  rmc: 2.5, cmr: 4   },
    "Razor":             { size: "S",  rmc: 2,   cmr: 3.5 },
    "Gladiator":         { size: "S",  rmc: 3,   cmr: 5.5 },
    "Sabre":             { size: "S",  rmc: 3,   cmr: 5   },
    "Hornet F7C":        { size: "S",  rmc: 3,   cmr: 5   },
    "Super Hornet":      { size: "S",  rmc: 3.5, cmr: 5.5 },
    "Cutter":            { size: "S",  rmc: 2,   cmr: 3.5 },
    "Cutter Rambler":    { size: "S",  rmc: 2,   cmr: 3.5 },
    "Titan":             { size: "S",  rmc: 3,   cmr: 5   },

    // Medium
    "Cutlass Black":     { size: "M",  rmc: 6,   cmr: 12  },
    "Cutlass Red":       { size: "M",  rmc: 6,   cmr: 12  },
    "Cutlass Blue":      { size: "M",  rmc: 7,   cmr: 14  },
    "Cutlass Steel":     { size: "M",  rmc: 6.5, cmr: 13  },
    "Freelancer":        { size: "M",  rmc: 7,   cmr: 14  },
    "Freelancer MAX":    { size: "M",  rmc: 7.5, cmr: 15  },
    "Freelancer MIS":    { size: "M",  rmc: 7,   cmr: 14  },
    "Freelancer DUR":    { size: "M",  rmc: 7,   cmr: 14  },
    "Vanguard Warden":   { size: "M",  rmc: 7,   cmr: 13  },
    "Vanguard Sentinel": { size: "M",  rmc: 7,   cmr: 13  },
    "Vanguard Harbinger":{ size: "M",  rmc: 7.5, cmr: 14  },
    "Vanguard Hoplite":  { size: "M",  rmc: 7,   cmr: 13  },
    "Retaliator":        { size: "M",  rmc: 9,   cmr: 18  },
    "Eclipse":           { size: "M",  rmc: 5,   cmr: 10  },
    "Mercury Star Runner":{ size: "M", rmc: 9,   cmr: 18  },
    "Corsair":           { size: "M",  rmc: 9,   cmr: 17  },
    "Spirit A1":         { size: "M",  rmc: 6,   cmr: 12  },
    "Spirit C1":         { size: "M",  rmc: 6,   cmr: 12  },
    "Spirit E1":         { size: "M",  rmc: 6,   cmr: 12  },
    "Hull A":            { size: "M",  rmc: 5,   cmr: 10  },
    "Scorpius":          { size: "M",  rmc: 5,   cmr: 10  },
    "Hurricane":         { size: "M",  rmc: 4,   cmr: 8   },
    "Vulture":           { size: "M",  rmc: 5,   cmr: 10  },
    "Prospector":        { size: "M",  rmc: 5,   cmr: 10  },
    "Ares Inferno":      { size: "M",  rmc: 5,   cmr: 10  },
    "Ares Ion":          { size: "M",  rmc: 5,   cmr: 10  },
    "Terrapin":          { size: "M",  rmc: 5,   cmr: 11  },
    "Khartu-al":         { size: "M",  rmc: 4,   cmr: 8   },
    "San'tok.yai":       { size: "M",  rmc: 4,   cmr: 9   },

    // Large
    "Constellation Andromeda": { size: "L", rmc: 14, cmr: 28 },
    "Constellation Taurus":    { size: "L", rmc: 13, cmr: 26 },
    "Constellation Aquila":    { size: "L", rmc: 14, cmr: 28 },
    "Constellation Phoenix":   { size: "L", rmc: 15, cmr: 30 },
    "Caterpillar":             { size: "L", rmc: 20, cmr: 40 },
    "Starfarer":               { size: "L", rmc: 22, cmr: 44 },
    "Starfarer Gemini":        { size: "L", rmc: 24, cmr: 48 },
    "Valkyrie":                { size: "L", rmc: 16, cmr: 32 },
    "Apollo Medivac":          { size: "L", rmc: 21, cmr: 60 },
    "Apollo Triage":           { size: "L", rmc: 21, cmr: 60 },
    "600i Explorer":           { size: "L", rmc: 18, cmr: 36 },
    "600i Touring":            { size: "L", rmc: 18, cmr: 36 },
    "Hull C":                  { size: "L", rmc: 18, cmr: 36 },
    "Carrack":                 { size: "L", rmc: 25, cmr: 50 },
    "C2 Hercules":             { size: "L", rmc: 22, cmr: 44 },
    "M2 Hercules":             { size: "L", rmc: 24, cmr: 48 },
    "A2 Hercules":             { size: "L", rmc: 26, cmr: 52 },
    "Reclaimer":               { size: "L", rmc: 28, cmr: 56 },
    "Mole":                    { size: "L", rmc: 14, cmr: 28 },
    "Redeemer":                { size: "L", rmc: 14, cmr: 28 },
    "Prowler":                 { size: "L", rmc: 12, cmr: 24 },

    // Capital / Very Large
    "Hammerhead":        { size: "XL", rmc: 35,  cmr: 70  },
    "890 Jump":          { size: "XL", rmc: 45,  cmr: 90  },
  },

  // ─── Salvage ships (what you use to salvage) ───
  salvageShips: {
    "RSI Salvation": {
      cargoSCU: 6,
      bufferSCU: 6,
      maxFractureSize: "S",   // up to Freelancer-class
      canFracture: true,
      canScrape: true,
      refiningYield: 0.30,
      description: "Beginner salvage ship with internal processor"
    },
    "Cutter Rambler": {
      cargoSCU: 8,
      bufferSCU: 8,
      maxFractureSize: "S",
      canFracture: false,
      canScrape: true,
      refiningYield: 0.30,
      description: "Small salvage variant of the Drake Cutter"
    },
    "Drake Vulture": {
      cargoSCU: 12,
      bufferSCU: 13,
      maxFractureSize: "M",   // up to Mercury Star Runner
      canFracture: true,
      canScrape: true,
      refiningYield: 0.30,
      description: "Solo salvage workhorse with dual scraper arms"
    },
    "MISC Fortune": {
      cargoSCU: 12,
      bufferSCU: 12,
      maxFractureSize: "M",
      canFracture: true,
      canScrape: true,
      refiningYield: 0.30,
      description: "MISC medium salvage ship"
    },
    "Argo MOTH": {
      cargoSCU: 64,
      bufferSCU: 64,
      maxFractureSize: "L",
      canFracture: true,
      canScrape: true,
      refiningYield: 0.25,
      description: "Multi-crew medium salvage ship"
    },
    "Aegis Reclaimer": {
      cargoSCU: 420,
      bufferSCU: 420,
      maxFractureSize: "XL",  // can fracture any size
      canFracture: true,
      canScrape: true,
      refiningYield: 0.15,
      description: "Capital-class salvage ship — The Claw"
    }
  },

  // ─── Salvage heads (scraper modules) ───
  salvageHeads: {
    "Default": {
      efficiencyMod: 1.0,
      speedMod: 1.0,
      radiusMod: 1.0,
      description: "Stock salvage head"
    },
    "Trawler": {
      efficiencyMod: 0.80,
      speedMod: 1.30,
      radiusMod: 1.40,
      description: "Largest radius, fastest — but lowest efficiency (high burn-off)"
    },
    "Abrade": {
      efficiencyMod: 0.85,
      speedMod: 1.20,
      radiusMod: 1.10,
      description: "Balanced speed/radius, low efficiency — good for large ships"
    },
    "Cinch": {
      efficiencyMod: 1.15,
      speedMod: 0.80,
      radiusMod: 0.85,
      description: "Highest efficiency — slowest, smallest radius"
    },
    "Baler": {
      efficiencyMod: 1.10,
      speedMod: 0.90,
      radiusMod: 0.95,
      description: "Good efficiency, moderate speed"
    }
  },

  // ─── Disintegration modes (for structural salvage / CMR) ───
  disintegrationModes: {
    "Powder": {
      densityMod: 1.5,     // highest density — more SCU per chunk
      yieldMod: 0.70,      // lowest yield after refining
      speedMod: 1.4,       // fastest
      description: "Highest density, lowest yield, fastest processing"
    },
    "Standard": {
      densityMod: 1.0,
      yieldMod: 1.0,
      speedMod: 1.0,
      description: "Balanced density, yield, and speed"
    },
    "Chunks": {
      densityMod: 0.6,     // lowest density — takes more cargo space
      yieldMod: 1.35,      // highest yield after refining
      speedMod: 0.6,       // slowest
      description: "Lowest density, highest yield, slowest processing"
    }
  },

  // ─── Refining methods ───
  // costMod: multiplier on base refining cost (1.0 = baseline)
  // yieldMod: multiplier on refining yield (1.0 = baseline)
  // timeMod: multiplier on refining time (1.0 = baseline ~24h)
  refiningMethods: {
    "Cormack Method": {
      costMod: 1.0,
      yieldMod: 0.880,
      timeMod: 1.0,
      description: "Baseline method — fastest processing time"
    },
    "Electrostarolysis": {
      costMod: 1.05,
      yieldMod: 0.900,
      timeMod: 0.5,
      description: "~17% less profit but only half a day processing"
    },
    "Pyrometric Chromalysis": {
      costMod: 1.10,
      yieldMod: 0.920,
      timeMod: 0.8,
      description: "~15% less profit, under 1 day processing"
    },
    "Gaskin Process": {
      costMod: 1.15,
      yieldMod: 0.940,
      timeMod: 0.6,
      description: "Fast — good for time-sensitive materials (Quantanium)"
    },
    "XCR Reaction": {
      costMod: 1.08,
      yieldMod: 0.910,
      timeMod: 0.9,
      description: "Moderate cost/yield/time balance"
    },
    "Kazen Winnowing": {
      costMod: 0.95,
      yieldMod: 0.950,
      timeMod: 1.5,
      description: "Low cost, good yield, longer time"
    },
    "Thermonatic Deposition": {
      costMod: 0.90,
      yieldMod: 0.960,
      timeMod: 2.0,
      description: "Very low cost, high yield, long wait"
    },
    "Ferron Exchange": {
      costMod: 0.85,
      yieldMod: 0.975,
      timeMod: 2.5,
      description: "Only ~2.5% less yield than Dinyx, 3x faster"
    },
    "Dinyx Solventation": {
      costMod: 0.80,
      yieldMod: 1.000,
      timeMod: 7.0,
      description: "Maximum yield, lowest cost — nearly a week wait"
    }
  },

  // ─── Default sell prices (aUEC per SCU) ───
  // Users should update these to match current in-game prices
  defaultPrices: {
    rmc: 7100,            // GrimHex ~6900-7800, averaging ~7100
    refinedCM: 9000,      // HUR-L3 tops at 9000
    unrefinedCMR: 251     // Raw CMR if sold unrefined
  },

  // ─── Size hierarchy for fracture compatibility ───
  sizeOrder: ["XS", "S", "M", "L", "XL"],
};
