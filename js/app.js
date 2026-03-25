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
    // log
    btnLog:            $("btn-log"),
    btnExport:         $("btn-export"),
    btnClearLog:       $("btn-clear-log"),
    logSummary:        $("log-summary"),
    logBody:           $("log-body"),
    logEmpty:          $("log-empty"),
    logTableWrap:      $("log-table-wrap"),
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

  // ─── Salvage Log Storage ───

  const LOG_KEY = "salvageLog";

  function loadLog() {
    try {
      return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
    } catch { return []; }
  }

  function saveLog(log) {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  }

  let salvageLog = loadLog();

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

  // ─── Calculation (pure) ───

  function getCalcResult() {
    const target = SALVAGE_DATA.targetShips[els.targetShip.value];
    const salvager = SALVAGE_DATA.salvageShips[els.salvageShip.value];
    const head = SALVAGE_DATA.salvageHeads[els.salvageHead.value];
    const disint = SALVAGE_DATA.disintegrationModes[els.disintMode.value];
    const doRefine = els.refineToggle.checked;
    const refMethod = SALVAGE_DATA.refiningMethods[els.refiningMethod.value];

    const priceRmc = parseFloat(els.priceRmc.value) || 0;
    const priceCm = parseFloat(els.priceCm.value) || 0;
    const priceCmr = parseFloat(els.priceCmr.value) || 0;

    if (!target || !salvager || !head || !disint) return null;

    // Warnings
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

    // RMC
    const baseRmc = target.rmc;
    const effRmc = baseRmc * head.efficiencyMod;
    const cargoForRmc = Math.min(effRmc, salvager.cargoSCU);
    const rmcValue = cargoForRmc * priceRmc;

    // CM
    const baseCmr = target.cmr;
    const cmrAfterDisint = baseCmr * disint.yieldMod;
    const remainingCargo = Math.max(0, salvager.cargoSCU - cargoForRmc);
    let cmrLoaded = Math.min(cmrAfterDisint, remainingCargo);

    let refinedCm = 0;
    let cmValue = 0;
    let refiningCost = 0;
    const canGetCM = canFracture && salvager.canFracture;

    if (canGetCM) {
      if (doRefine) {
        refinedCm = cmrLoaded * salvager.refiningYield * refMethod.yieldMod;
        const baseCostPerSCU = 150;
        refiningCost = cmrLoaded * baseCostPerSCU * refMethod.costMod;
        cmValue = refinedCm * priceCm;
      } else {
        cmValue = cmrLoaded * priceCmr;
      }
    } else {
      cmrLoaded = 0;
    }

    // Trips
    const totalMaterialSCU = effRmc + (canGetCM ? cmrAfterDisint : 0);
    const trips = Math.ceil(totalMaterialSCU / salvager.cargoSCU);

    // Total profit (all trips)
    let totalRmcValue, totalCmValue, totalRefiningCost;
    if (trips <= 1) {
      totalRmcValue = rmcValue;
      totalCmValue = cmValue;
      totalRefiningCost = refiningCost;
    } else {
      totalRmcValue = effRmc * priceRmc;
      totalCmValue = 0;
      totalRefiningCost = 0;
      if (canGetCM) {
        if (doRefine) {
          const fullRefined = cmrAfterDisint * salvager.refiningYield * refMethod.yieldMod;
          const baseCostPerSCU = 150;
          totalRefiningCost = cmrAfterDisint * baseCostPerSCU * refMethod.costMod;
          totalCmValue = fullRefined * priceCm;
        } else {
          totalCmValue = cmrAfterDisint * priceCmr;
        }
      }
    }

    const netProfit = totalRmcValue + totalCmValue - totalRefiningCost;

    if (trips > 1) {
      warnings.push({
        type: "warning",
        text: `Total material (${totalMaterialSCU.toFixed(1)} SCU) exceeds cargo capacity ` +
              `(${salvager.cargoSCU} SCU). You'll need ${trips} trips. Values shown are the total for all trips.`
      });
    }

    return {
      target, salvager, head, disint, doRefine, refMethod,
      priceRmc, priceCm, priceCmr,
      baseRmc, effRmc, cargoForRmc, baseCmr, cmrAfterDisint,
      remainingCargo, cmrLoaded, refinedCm, canGetCM,
      totalRmcValue, totalCmValue, totalRefiningCost,
      netProfit, trips, totalMaterialSCU, warnings,
    };
  }

  // ─── Render calculation to DOM ───

  function calculate() {
    const r = getCalcResult();
    if (!r) return;

    els.warnings.innerHTML = r.warnings
      .map((w) => `<div class="warning ${w.type}">${w.text}</div>`)
      .join("");

    els.resBaseRmc.textContent = scu(r.baseRmc);
    els.resEffRmc.textContent = scu(r.effRmc);
    els.resCargoRmc.textContent = scu(Math.min(r.effRmc, r.salvager.cargoSCU));
    els.resValRmc.textContent = aUEC(r.totalRmcValue);

    if (r.canGetCM) {
      els.resBaseCmr.textContent = scu(r.baseCmr);
      els.resDisintCmr.textContent = scu(r.cmrAfterDisint);
      els.resCargoCm.textContent = r.trips > 1
        ? scu(r.cmrAfterDisint) + " (multi-trip)"
        : scu(r.remainingCargo);

      if (r.doRefine) {
        els.refiningRow.style.display = "";
        els.resRefineMethod.textContent = els.refiningMethod.value;
        const totalRefined = r.trips > 1
          ? r.cmrAfterDisint * r.salvager.refiningYield * r.refMethod.yieldMod
          : r.refinedCm;
        els.resRefinedCm.textContent = scu(totalRefined);
      } else {
        els.refiningRow.style.display = "none";
      }
      els.resValCm.textContent = aUEC(r.totalCmValue);
    } else {
      els.resBaseCmr.textContent = "N/A";
      els.resDisintCmr.textContent = "N/A";
      els.resCargoCm.textContent = "N/A";
      els.refiningRow.style.display = "none";
      els.resValCm.textContent = "0 aUEC";
    }

    els.resIncomeRmc.textContent = aUEC(r.totalRmcValue);
    els.resIncomeCm.textContent = aUEC(r.totalCmValue);
    els.resRefineCost.textContent = "−" + aUEC(r.totalRefiningCost);
    els.resTotal.textContent = aUEC(r.netProfit);
    els.resTrips.textContent = r.trips === 1 ? "1 (single load)" : `${r.trips} trips`;
  }

  // ─── Salvage Log ───

  function addLogEntry() {
    const r = getCalcResult();
    if (!r) return;
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      targetShip: els.targetShip.value,
      targetSize: r.target.size,
      salvageShip: els.salvageShip.value,
      salvageHead: els.salvageHead.value,
      disintMode: els.disintMode.value,
      doRefine: r.doRefine,
      refiningMethod: els.refiningMethod.value,
      priceRmc: r.priceRmc,
      priceCm: r.priceCm,
      priceCmr: r.priceCmr,
      rmcSCU: r.effRmc,
      cmSCU: r.canGetCM ? r.cmrAfterDisint : 0,
      rmcIncome: r.totalRmcValue,
      cmIncome: r.totalCmValue,
      refiningCost: r.totalRefiningCost,
      netProfit: r.netProfit,
      trips: r.trips,
    };
    salvageLog.unshift(entry);
    saveLog(salvageLog);
    renderLog();
  }

  function deleteLogEntry(id) {
    salvageLog = salvageLog.filter(e => e.id !== id);
    saveLog(salvageLog);
    renderLog();
  }

  function clearLog() {
    if (!confirm("Delete all logged salvage operations?")) return;
    salvageLog = [];
    saveLog(salvageLog);
    renderLog();
  }

  function renderLog() {
    const hasEntries = salvageLog.length > 0;
    els.logEmpty.style.display = hasEntries ? "none" : "";
    els.logTableWrap.style.display = hasEntries ? "" : "none";
    els.btnExport.disabled = !hasEntries;
    els.btnClearLog.disabled = !hasEntries;

    if (hasEntries) {
      const totalProfit = salvageLog.reduce((s, e) => s + e.netProfit, 0);
      const totalRmcIncome = salvageLog.reduce((s, e) => s + e.rmcIncome, 0);
      const totalCmIncome = salvageLog.reduce((s, e) => s + e.cmIncome, 0);
      const count = salvageLog.length;
      els.logSummary.innerHTML =
        `<span><strong>${count}</strong> op${count !== 1 ? "s" : ""}</span>` +
        `<span>RMC: <strong class="sum-rmc">${aUEC(totalRmcIncome)}</strong></span>` +
        `<span>CM: <strong class="sum-cm">${aUEC(totalCmIncome)}</strong></span>` +
        `<span>Net: <strong class="sum-net">${aUEC(totalProfit)}</strong></span>` +
        `<span>Avg: <strong class="sum-avg">${aUEC(totalProfit / count)}</strong></span>`;
    } else {
      els.logSummary.innerHTML = "";
    }

    els.logBody.innerHTML = salvageLog.map(e => {
      const d = new Date(e.timestamp);
      const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
        " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const refineInfo = e.doRefine ? e.refiningMethod : "Unrefined";
      const setupTitle = `Ship: ${e.salvageShip}\nHead: ${e.salvageHead}\nDisint: ${e.disintMode}\nRefine: ${refineInfo}\nRMC price: ${e.priceRmc}/SCU\nCM price: ${e.priceCm}/SCU`;
      return `<tr>
        <td class="log-date">${dateStr}</td>
        <td>${e.targetShip} <span class="log-size">${e.targetSize}</span></td>
        <td title="${setupTitle}">${e.salvageShip}</td>
        <td>${e.rmcSCU.toFixed(1)}</td>
        <td>${e.cmSCU.toFixed(1)}</td>
        <td class="log-profit">${aUEC(e.netProfit)}</td>
        <td>${e.trips}</td>
        <td><button class="btn-delete" data-id="${e.id}" title="Delete">&times;</button></td>
      </tr>`;
    }).join("");
  }

  function exportCSV() {
    if (!salvageLog.length) return;
    const headers = [
      "Date", "Target Ship", "Target Size", "Salvage Ship", "Salvage Head",
      "Disint Mode", "Refine", "Refining Method", "RMC Price/SCU", "CM Price/SCU",
      "CMR Price/SCU", "RMC SCU", "CM SCU", "RMC Income", "CM Income",
      "Refining Cost", "Net Profit", "Trips"
    ];
    const rows = salvageLog.map(e => [
      new Date(e.timestamp).toLocaleString(),
      e.targetShip, e.targetSize, e.salvageShip, e.salvageHead, e.disintMode,
      e.doRefine ? "Yes" : "No", e.refiningMethod,
      e.priceRmc, e.priceCm, e.priceCmr,
      e.rmcSCU.toFixed(1), e.cmSCU.toFixed(1),
      Math.round(e.rmcIncome), Math.round(e.cmIncome),
      Math.round(e.refiningCost), Math.round(e.netProfit), e.trips
    ]);
    const csv = [headers, ...rows].map(r =>
      r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `salvage-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

    // Log controls
    els.btnLog.addEventListener("click", addLogEntry);
    els.btnClearLog.addEventListener("click", clearLog);
    els.btnExport.addEventListener("click", exportCSV);
    els.logBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-delete");
      if (btn) deleteLogEntry(Number(btn.dataset.id));
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
    renderLog();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
