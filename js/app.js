// SC Salvage Calculator - Application Logic

(function () {
  "use strict";

  // ─── DOM refs ───
  const $ = (id) => document.getElementById(id);

  const els = {
    targetShip:        $("target-ship"),
    targetInfo:        $("target-info"),
    salvageShip:       $("salvage-ship"),
    salvageInfo:       $("salvage-info"),
    salvageHead:       $("salvage-head"),
    disintMode:        $("disintegration-mode"),
    refineToggle:      $("refine-toggle"),
    refiningOptions:   $("refining-options"),
    refiningMethod:    $("refining-method"),
    priceRmc:          $("price-rmc"),
    priceCm:           $("price-cm"),
    priceCmr:          $("price-cmr"),
    warnings:          $("warnings"),
    // results
    resBaseRmc:        $("res-base-rmc"),
    resEffRmc:         $("res-eff-rmc"),
    resCargoRmc:       $("res-cargo-rmc"),
    resValRmc:         $("res-val-rmc"),
    resBaseCmr:        $("res-base-cmr"),
    resDisintCmr:      $("res-disint-cmr"),
    resCargoCm:        $("res-cargo-cm"),
    resRefineMethod:   $("res-refine-method"),
    resRefinedCm:      $("res-refined-cm"),
    refiningRow:       $("refining-row"),
    resValCm:          $("res-val-cm"),
    resIncomeRmc:      $("res-income-rmc"),
    resIncomeCm:       $("res-income-cm"),
    resRefineCost:     $("res-refine-cost"),
    resTotal:          $("res-total"),
    resTrips:          $("res-trips"),
  };

  // ─── Helpers ───

  function aUEC(n) {
    return Math.round(n).toLocaleString() + " aUEC";
  }

  function scu(n) {
    return n.toFixed(1) + " SCU";
  }

  function sizeIndex(size) {
    return SALVAGE_DATA.sizeOrder.indexOf(size);
  }

  function canFractureTarget(salvageShip, targetShip) {
    const maxIdx = sizeIndex(salvageShip.maxFractureSize);
    const targetIdx = sizeIndex(targetShip.size);
    return targetIdx <= maxIdx;
  }

  // ─── Populate dropdowns ───

  function populateSelect(selectEl, items, descFn) {
    selectEl.innerHTML = "";
    for (const name of Object.keys(items)) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (descFn) opt.title = descFn(items[name]);
      selectEl.appendChild(opt);
    }
  }

  function initDropdowns() {
    // Target ships grouped by size
    els.targetShip.innerHTML = "";
    const groups = {};
    for (const [name, data] of Object.entries(SALVAGE_DATA.targetShips)) {
      if (!groups[data.size]) groups[data.size] = [];
      groups[data.size].push(name);
    }
    const sizeLabels = { XS: "Extra Small", S: "Small", M: "Medium", L: "Large", XL: "Capital" };
    for (const size of SALVAGE_DATA.sizeOrder) {
      if (!groups[size]) continue;
      const optgroup = document.createElement("optgroup");
      optgroup.label = sizeLabels[size] || size;
      for (const name of groups[size]) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        optgroup.appendChild(opt);
      }
      els.targetShip.appendChild(optgroup);
    }

    populateSelect(els.salvageShip, SALVAGE_DATA.salvageShips, (s) => s.description);
    populateSelect(els.salvageHead, SALVAGE_DATA.salvageHeads, (h) => h.description);
    populateSelect(els.disintMode, SALVAGE_DATA.disintegrationModes, (m) => m.description);
    populateSelect(els.refiningMethod, SALVAGE_DATA.refiningMethods, (r) => r.description);

    // Default select Vulture and Dinyx
    els.salvageShip.value = "Drake Vulture";
    els.refiningMethod.value = "Dinyx Solventation";
  }

  // ─── Info panels ───

  function updateTargetInfo() {
    const name = els.targetShip.value;
    const ship = SALVAGE_DATA.targetShips[name];
    if (!ship) { els.targetInfo.textContent = ""; return; }
    els.targetInfo.textContent =
      `Size: ${ship.size} | RMC: ${ship.rmc} SCU | CMR: ${ship.cmr} SCU`;
  }

  function updateSalvageInfo() {
    const name = els.salvageShip.value;
    const ship = SALVAGE_DATA.salvageShips[name];
    if (!ship) { els.salvageInfo.textContent = ""; return; }
    els.salvageInfo.textContent =
      `Cargo: ${ship.cargoSCU} SCU | Max fracture: ${ship.maxFractureSize} | ` +
      `Refine yield: ${(ship.refiningYield * 100).toFixed(0)}%`;
  }

  // ─── Calculation ───

  function calculate() {
    const target = SALVAGE_DATA.targetShips[els.targetShip.value];
    const salvager = SALVAGE_DATA.salvageShips[els.salvageShip.value];
    const head = SALVAGE_DATA.salvageHeads[els.salvageHead.value];
    const disint = SALVAGE_DATA.disintegrationModes[els.disintMode.value];
    const doRefine = els.refineToggle.checked;
    const refMethod = SALVAGE_DATA.refiningMethods[els.refiningMethod.value];

    const priceRmc = parseFloat(els.priceRmc.value) || 0;
    const priceCm = parseFloat(els.priceCm.value) || 0;
    const priceCmr = parseFloat(els.priceCmr.value) || 0;

    if (!target || !salvager || !head || !disint) return;

    // ─── Warnings ───
    const warnings = [];
    const canFracture = canFractureTarget(salvager, target);
    if (!canFracture && salvager.canFracture) {
      warnings.push({
        type: "warning",
        text: `${els.salvageShip.value} can only fracture up to size ${salvager.maxFractureSize} — ` +
              `${els.targetShip.value} is size ${target.size}. You can still hull-scrape for RMC but cannot get construction materials.`
      });
    }
    if (!salvager.canFracture) {
      warnings.push({
        type: "warning",
        text: `${els.salvageShip.value} cannot fracture ships — hull scraping (RMC) only.`
      });
    }

    // ─── RMC Calculation ───
    const baseRmc = target.rmc;
    const effRmc = baseRmc * head.efficiencyMod;
    const cargoForRmc = Math.min(effRmc, salvager.cargoSCU);

    const rmcValue = cargoForRmc * priceRmc;

    // ─── CM Calculation ───
    let baseCmr = target.cmr;
    let cmrAfterDisint = baseCmr * disint.yieldMod;

    // Cargo space remaining after RMC
    const remainingCargo = Math.max(0, salvager.cargoSCU - cargoForRmc);
    let cmrLoaded = Math.min(cmrAfterDisint, remainingCargo);

    let refinedCm = 0;
    let cmValue = 0;
    let refiningCost = 0;

    const canGetCM = canFracture && salvager.canFracture;

    if (canGetCM) {
      if (doRefine) {
        refinedCm = cmrLoaded * salvager.refiningYield * refMethod.yieldMod;
        // Refining cost: base cost proportional to SCU refined
        const baseCostPerSCU = 150; // approximate base refining cost per SCU
        refiningCost = cmrLoaded * baseCostPerSCU * refMethod.costMod;
        cmValue = refinedCm * priceCm;
      } else {
        refinedCm = 0;
        cmValue = cmrLoaded * priceCmr;
        refiningCost = 0;
      }
    } else {
      cmrLoaded = 0;
      cmValue = 0;
    }

    // ─── Total material from ship ───
    const totalMaterialSCU = effRmc + (canGetCM ? cmrAfterDisint : 0);
    const trips = Math.ceil(totalMaterialSCU / salvager.cargoSCU);

    // ─── Total profit (for ALL trips) ───
    let totalRmcValue, totalCmValue, totalRefiningCost;
    if (trips <= 1) {
      totalRmcValue = rmcValue;
      totalCmValue = cmValue;
      totalRefiningCost = refiningCost;
    } else {
      // Full ship values across all trips
      const fullRmcValue = effRmc * priceRmc;
      let fullCmValue = 0;
      let fullRefiningCost = 0;
      if (canGetCM) {
        if (doRefine) {
          const fullRefined = cmrAfterDisint * salvager.refiningYield * refMethod.yieldMod;
          const baseCostPerSCU = 150;
          fullRefiningCost = cmrAfterDisint * baseCostPerSCU * refMethod.costMod;
          fullCmValue = fullRefined * priceCm;
        } else {
          fullCmValue = cmrAfterDisint * priceCmr;
        }
      }
      totalRmcValue = fullRmcValue;
      totalCmValue = fullCmValue;
      totalRefiningCost = fullRefiningCost;
    }

    const netProfit = totalRmcValue + totalCmValue - totalRefiningCost;

    if (trips > 1) {
      warnings.push({
        type: "warning",
        text: `Total material (${totalMaterialSCU.toFixed(1)} SCU) exceeds cargo capacity ` +
              `(${salvager.cargoSCU} SCU). You'll need ${trips} trips. Values shown are the total for all trips.`
      });
    }

    // ─── Update DOM ───
    els.warnings.innerHTML = warnings
      .map((w) => `<div class="warning ${w.type}">${w.text}</div>`)
      .join("");

    els.resBaseRmc.textContent = scu(baseRmc);
    els.resEffRmc.textContent = scu(effRmc);
    els.resCargoRmc.textContent = scu(Math.min(effRmc, salvager.cargoSCU));
    els.resValRmc.textContent = aUEC(totalRmcValue);

    if (canGetCM) {
      els.resBaseCmr.textContent = scu(baseCmr);
      els.resDisintCmr.textContent = scu(cmrAfterDisint);
      els.resCargoCm.textContent = trips > 1
        ? scu(cmrAfterDisint) + " (multi-trip)"
        : scu(remainingCargo);

      if (doRefine) {
        els.refiningRow.style.display = "";
        els.resRefineMethod.textContent = els.refiningMethod.value;
        const totalRefined = trips > 1
          ? cmrAfterDisint * salvager.refiningYield * refMethod.yieldMod
          : refinedCm;
        els.resRefinedCm.textContent = scu(totalRefined);
      } else {
        els.refiningRow.style.display = "none";
      }
      els.resValCm.textContent = aUEC(totalCmValue);
    } else {
      els.resBaseCmr.textContent = "N/A";
      els.resDisintCmr.textContent = "N/A";
      els.resCargoCm.textContent = "N/A";
      els.refiningRow.style.display = "none";
      els.resValCm.textContent = "0 aUEC";
    }

    els.resIncomeRmc.textContent = aUEC(totalRmcValue);
    els.resIncomeCm.textContent = aUEC(totalCmValue);
    els.resRefineCost.textContent = "−" + aUEC(totalRefiningCost);
    els.resTotal.textContent = aUEC(netProfit);
    els.resTrips.textContent = trips === 1 ? "1 (single load)" : `${trips} trips`;
  }

  // ─── Event listeners ───

  function bindEvents() {
    const recalcInputs = [
      els.targetShip, els.salvageShip, els.salvageHead,
      els.disintMode, els.refineToggle, els.refiningMethod,
      els.priceRmc, els.priceCm, els.priceCmr
    ];

    for (const el of recalcInputs) {
      el.addEventListener("change", calculate);
      el.addEventListener("input", calculate);
    }

    els.targetShip.addEventListener("change", updateTargetInfo);
    els.salvageShip.addEventListener("change", updateSalvageInfo);

    els.refineToggle.addEventListener("change", () => {
      els.refiningOptions.style.display = els.refineToggle.checked ? "" : "none";
      calculate();
    });
  }

  // ─── Init ───

  function init() {
    initDropdowns();

    // Set default prices
    els.priceRmc.value = SALVAGE_DATA.defaultPrices.rmc;
    els.priceCm.value = SALVAGE_DATA.defaultPrices.refinedCM;
    els.priceCmr.value = SALVAGE_DATA.defaultPrices.unrefinedCMR;

    bindEvents();
    updateTargetInfo();
    updateSalvageInfo();
    calculate();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
