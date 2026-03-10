# SC Salvage Calculator

A browser-based calculator for Star Citizen salvage operations. Estimates profit from hull scraping (RMC) and structural salvage (Construction Materials) based on your setup.

## Features

- **Target ship selection** — grouped by size (XS through Capital) with RMC and CMR yield data
- **Salvage ship selection** — Salvation, Cutter Rambler, Vulture, Fortune, MOTH, Reclaimer with cargo capacity and fracture limits
- **Salvage head modifiers** — Default, Trawler, Abrade, Cinch, Baler with efficiency/speed tradeoffs
- **Disintegration modes** — Powder, Standard, Chunks affecting density and yield
- **Refining methods** — All 9 in-game methods (Cormack through Dinyx Solventation) with cost/yield/time modifiers
- **Editable sell prices** — Update RMC, refined CM, and unrefined CMR prices to match current in-game values
- **Cargo capacity warnings** — Alerts when material exceeds cargo and calculates trips needed
- **Fracture compatibility** — Warns when your salvage ship can't fracture the target

## Usage

Open `index.html` in any browser. No server or build step required.

1. Select the ship you're salvaging
2. Select your salvage ship, head, and disintegration mode
3. Choose whether to refine and which method
4. Adjust sell prices to current in-game values
5. Read your profit breakdown

## Data

Values in `js/data.js` are community-sourced estimates referencing SC 4.6 (2026). They change between patches — update the data file as needed.
