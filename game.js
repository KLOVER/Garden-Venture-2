const SEED_CATALOG = [
  { id: 'carrot', name: 'Carrot Seed', icon: '🥕', rarity: 'common', affinity: 'all', cost: 20, maxStock: 10, currentStock: 10, baseGrowTime: 8, baseSellPrice: 35, minKg: 0.1, baseMaxKg: 2.5, maxKg: 10000000, minM: 0.2, maxM: 0.8, isVine: false },
  { id: 'potato', name: 'Potato Seed', icon: '🥔', rarity: 'common', affinity: 'all', cost: 50, maxStock: 8, currentStock: 8, baseGrowTime: 14, baseSellPrice: 90, minKg: 0.1, baseMaxKg: 4.0, maxKg: 10000000, minM: 0.3, maxM: 1.0, isVine: false },
  { id: 'tomato', name: 'Tomato Seed', icon: '🍅', rarity: 'uncommon', affinity: 'all', cost: 120, maxStock: 6, currentStock: 6, baseGrowTime: 20, baseSellPrice: 220, minKg: 0.1, baseMaxKg: 5.0, maxKg: 10000000, minM: 0.5, maxM: 1.8, isVine: false },
  { id: 'glowshroom', name: 'Glowshroom Seed', icon: '🍄', rarity: 'uncommon', affinity: 'night', cost: 250, maxStock: 5, currentStock: 5, baseGrowTime: 25, baseSellPrice: 480, minKg: 0.1, baseMaxKg: 6.0, maxKg: 10000000, minM: 0.6, maxM: 2.2, isVine: false },
  { id: 'grape_vine', name: 'Grape Vine Seed', icon: '🍇', rarity: 'uncommon', affinity: 'all', cost: 500, maxStock: 5, currentStock: 5, baseGrowTime: 35, baseSellPrice: 80, minKg: 0.1, baseMaxKg: 3.5, maxKg: 10000000, minM: 1.2, maxM: 3.0, isVine: true, produceIcon: '🍇', produceName: 'Grape Cluster', maxFruits: 3 },
  { id: 'starfruit', name: 'Star Fruit Seed', icon: '⭐', rarity: 'rare', affinity: 'all', cost: 900, maxStock: 4, currentStock: 4, baseGrowTime: 40, baseSellPrice: 1800, minKg: 0.1, baseMaxKg: 8.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false },
  { id: 'watermelon_vine', name: 'Watermelon Vine', icon: '🍉', rarity: 'rare', affinity: 'all', cost: 2200, maxStock: 3, currentStock: 3, baseGrowTime: 55, baseSellPrice: 450, minKg: 0.1, baseMaxKg: 12.0, maxKg: 10000000, minM: 1.5, maxM: 4.5, isVine: true, produceIcon: '🍉', produceName: 'Giant Watermelon', maxFruits: 3 },
  { id: 'nectarroot', name: 'Nectar Root Seed', icon: '🌸', rarity: 'legendary', affinity: 'all', cost: 15000, maxStock: 3, currentStock: 3, baseGrowTime: 70, baseSellPrice: 11000, minKg: 0.1, baseMaxKg: 15.0, maxKg: 10000000, minM: 2.0, maxM: 6.0, isVine: false },
  { id: 'strawberry', name: 'Strawberry Seed', icon: '🍓', rarity: 'astral', affinity: 'night', cost: 75000, maxStock: 2, currentStock: 2, baseGrowTime: 90, baseSellPrice: 35000, minKg: 0.1, baseMaxKg: 20.0, maxKg: 10000000, minM: 2.5, maxM: 8.0, isVine: false },
  { id: 'singularity', name: 'Singularity Sprout Seed', icon: '🌌', rarity: 'transcendent', affinity: 'all', cost: 2500000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 1200000, minKg: 0.1, baseMaxKg: 25.0, maxKg: 10000000, minM: 3.0, maxM: 12.0, isVine: false },
  { id: 'celestial_moon', name: 'Celestial Moon Seed', icon: '🌙', rarity: 'transcendent', affinity: 'all', cost: 50000000, maxStock: 1, currentStock: 0, baseGrowTime: 150, baseSellPrice: 15000000, minKg: 0.1, baseMaxKg: 35.0, maxKg: 10000000, minM: 4.0, maxM: 15.0, isVine: true, produceIcon: '⭐', produceName: 'Celestial Star', maxFruits: 3 }
];

let gameState = {
  cash: 25,
  currentField: 0,
  maxFields: 5,
  unlockedFields: 1,
  selectedTool: 'plant',
  selectedSeedId: 'carrot',
  selectedVinePlotIndex: null,
  activeDrawerTab: 'seeds',
  articularSkinActive: false,
  isDay: true,
  cycleTimeLeft: 300,
  shopRefillTimeLeft: 180,
  bgmMuted: false,
  sfxMuted: false,
  dailyDealUsed: false,
  seedInventory: { carrot: 5, potato: 0, grape_vine: 0, tomato: 0, glowshroom: 0, starfruit: 0, watermelon_vine: 0, nectarroot: 0, strawberry: 0, singularity: 0, celestial_moon: 0 },
  produceInventory: [],
  codex: { carrot: { discovered: true, totalHarvested: 0 } },
  fields: []
};

let currentBargainFee = 0, currentBargainBase = 0, currentBargainMultiplier = 1.0, currentBargainPayout = 0, isDailyDealActive = false;
let audioCtx = null, lofiTimer = null, chordIndex = 0;

const dayChords = [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 349.23]];
const nightChords = [[261.63, 329.63, 392.00, 493.88, 587.33], [220.00, 261.63, 329.63, 392.00, 493.88], [146.83, 220.00, 261.63, 349.23, 440.00], [174.61, 207.65, 261.63, 311.13, 392.00]];

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSFX(type) {
  if (gameState.sfxMuted) return;
  initAudioContext();
  const now = audioCtx.currentTime;
  if (type === 'plant') {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(240, now); osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);
    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.12);
  } else if (type === 'harvest') {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.12, now + idx * 0.05); gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now + idx * 0.05); osc.stop(now + idx * 0.05 + 0.25);
    });
  } else if (type === 'sell') {
    const osc1 = audioCtx.createOscillator(), osc2 = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc1.type = 'sine'; osc2.type = 'triangle'; osc1.frequency.setValueAtTime(987.77, now); osc2.frequency.setValueAtTime(1318.51, now + 0.08);
    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination); osc1.start(now); osc2.start(now + 0.08); osc1.stop(now + 0.35); osc2.stop(now + 0.35);
  } else if (type === 'shovel') {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.15);
  }
}

function playNextLofiChord() {
  if (gameState.bgmMuted || !audioCtx) return;
  const now = audioCtx.currentTime;
  const chordSet = gameState.isDay ? dayChords : nightChords;
  const chord = chordSet[chordIndex % chordSet.length];
  chordIndex = (chordIndex + 1) % chordSet.length;
  chord.forEach(freq => {
    const osc = audioCtx.createOscillator(), filter = audioCtx.createBiquadFilter(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now);
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(gameState.isDay ? 550 : 380, now);
    gain.gain.setValueAtTime(0.001, now); gain.gain.linearRampToValueAtTime(gameState.isDay ? 0.035 : 0.025, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (gameState.isDay ? 3.2 : 4.5));
    osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + (gameState.isDay ? 3.2 : 4.5));
  });
}

function refreshShopStocks() {
  SEED_CATALOG.forEach(seed => {
    if (seed.id === 'singularity') seed.currentStock = Math.random() < 0.003 ? 1 : 0;
    else if (seed.id === 'celestial_moon') seed.currentStock = Math.random() < 0.001 ? 1 : 0;
    else seed.currentStock = seed.maxStock;
  });
}

let gamepadState = { connected: false, focusZone: 'plots', selectedPlotIndex: 4, hudButtonIndex: 0, navButtonIndex: 0, bottomButtonIndex: 0, menuFocusIndex: 0, lastButtonTime: 0, buttonCooldown: 170 };
let sellQuantityState = { selectedCropGroup: null, quantityToSell: 1 };
const FIELD_EXPANSION_COSTS = [0, 350, 2500, 50000, 1000000];
let plotDomNodes = [];

function initFields() {
  gameState.fields = [];
  for (let f = 0; f < gameState.maxFields; f++) {
    const plots = [];
    for (let p = 0; p < 9; p++) {
      plots.push({ crop: null, progress: 0, isReady: false, vineEstablished: false, rolledKg: 0, rolledMeters: 0, actualGrowTime: 5, vineFruits: [] });
    }
    gameState.fields.push(plots);
  }
}

function formatKg(kg) {
  if (kg === undefined || kg === null || isNaN(kg)) return '0.0 kg';
  const val = Number(kg);
  if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B kg';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M kg';
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'k kg';
  return val.toFixed(1) + ' kg';
}

function formatMeters(m) {
  if (m === undefined || m === null || isNaN(m)) return '0.0m';
  const val = Number(m);
  if (val >= 1000) return (val / 1000).toFixed(1) + 'km';
  return val.toFixed(1) + 'm';
}

function calculateProduceEarnings(basePrice, rolledKg, minKg) {
  const safeKg = rolledKg || minKg || 0.1;
  return Math.round((basePrice || 10) * (1 + (safeKg / (minKg || 0.1)) * 0.25));
}

function checkCodexCompletion() {
  let discoveredCount = 0;
  SEED_CATALOG.forEach(seed => { if (gameState.codex[seed.id] && gameState.codex[seed.id].discovered) discoveredCount++; });
  if (discoveredCount >= SEED_CATALOG.length && !gameState.articularSkinActive) {
    gameState.articularSkinActive = true;
    updateFenceSkin();
    playSFX('harvest');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "🏆 INDEX COMPLETED! ARTICULAR PROMISE SKIN UNLOCKED! ✨", "#00e5ff");
  }
}

function getGroupedProduce() {
  const groups = {};
  gameState.produceInventory.forEach(item => {
    if (!groups[item.name]) groups[item.name] = { name: item.name, icon: item.icon, items: [] };
    groups[item.name].items.push(item);
  });
  return Object.values(groups);
}

const cashEl = document.getElementById('cash-amount');
const plotsGrid = document.getElementById('plots-grid');
const fieldTitle = document.getElementById('field-title');
const statusBanner = document.getElementById('status-banner');
const cycleIcon = document.getElementById('cycle-icon');
const cycleLabel = document.getElementById('cycle-label');
const cycleTimer = document.getElementById('cycle-timer');
const currentSeedNameEl = document.getElementById('current-seed-name');
const particlesLayer = document.getElementById('particles-layer');
const firefliesLayer = document.getElementById('fireflies-layer');
const fenceStructure = document.getElementById('fence-structure');
const fieldLockedOverlay = document.getElementById('field-locked-overlay');
const lockedFieldTitle = document.getElementById('locked-field-title');
const btnUnlockField = document.getElementById('btn-unlock-field');

const weatherModal = document.getElementById('weather-modal');
const weatherModalTitle = document.getElementById('weather-modal-title');
const weatherModalBody = document.getElementById('weather-modal-body');
const closeWeatherBtn = document.getElementById('close-weather-btn');

const shovelBtn = document.getElementById('shovel-btn');
const sellBtn = document.getElementById('sell-btn');
const shopBtn = document.getElementById('shop-btn');
const settingsBtn = document.getElementById('settings-btn');
const prevFieldBtn = document.getElementById('prev-field-btn');
const nextFieldBtn = document.getElementById('next-field-btn');
const seedBagBtn = document.getElementById('seed-bag-btn');
const seedBagDrawer = document.getElementById('seed-bag-drawer');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const tabSeedsBtn = document.getElementById('tab-seeds-btn');
const tabProduceBtn = document.getElementById('tab-produce-btn');
const seedInventoryList = document.getElementById('seed-inventory-list');
const produceInventoryList = document.getElementById('produce-inventory-list');

const shopModal = document.getElementById('shop-modal');
const closeShopBtn = document.getElementById('close-shop-btn');
const shopItemsList = document.getElementById('shop-items-list');
const shopRefillTimerEl = document.getElementById('shop-refill-timer');
const openIndexBtn = document.getElementById('open-index-btn');

const sellModal = document.getElementById('sell-modal');
const closeSellBtn = document.getElementById('close-sell-btn');
const sellMainOptions = document.getElementById('sell-main-options');
const sellItemPicker = document.getElementById('sell-item-picker');
const sellQuantityPicker = document.getElementById('sell-quantity-picker');
const btnSellAllModal = document.getElementById('btn-sell-all-modal');
const btnSellSelectModal = document.getElementById('btn-sell-select-modal');
const btnSellBargainModal = document.getElementById('btn-sell-bargain-modal');
const sellAllPayoutText = document.getElementById('sell-all-payout-text');
const qtyCropHeader = document.getElementById('qty-crop-header');
const qtyDisplayNum = document.getElementById('qty-display-num');
const qtyMinusBtn = document.getElementById('qty-minus-btn');
const qtyPlusBtn = document.getElementById('qty-plus-btn');
const qtyPayoutPreview = document.getElementById('qty-payout-preview');
const qtyConfirmSellBtn = document.getElementById('qty-confirm-sell-btn');
const qtyBackBtn = document.getElementById('qty-back-btn');

const bargainNpcBox = document.getElementById('bargain-npc-box');
const npcDialogueText = document.getElementById('npc-dialogue-text');
const npcBargainFee = document.getElementById('npc-bargain-fee');
const npcStandardValue = document.getElementById('npc-standard-value');
const npcProjectedCash = document.getElementById('npc-projected-cash');
const npcOfferTier = document.getElementById('npc-offer-tier');
const btnStartBargain = document.getElementById('btn-start-bargain');
const btnDailyDeal = document.getElementById('btn-daily-deal');
const btnAcceptBargain = document.getElementById('btn-accept-bargain');
const btnDeclineBargain = document.getElementById('btn-decline-bargain');
const btnBargainBack = document.getElementById('btn-bargain-back');

const permanentInfoModal = document.getElementById('permanent-info-modal');
const closePermInfoBtn = document.getElementById('close-perm-info-btn');
const vineModal = document.getElementById('vine-modal');
const vineModalTitle = document.getElementById('vine-modal-title');
const vineProduceList = document.getElementById('vine-produce-list');
const harvestAllVineBtn = document.getElementById('harvest-all-vine-btn');
const closeVineBtn = document.getElementById('close-vine-btn');
const indexModal = document.getElementById('index-modal');
const closeIndexBtn = document.getElementById('close-index-btn');
const indexItemsList = document.getElementById('index-items-list');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const shopQuickBtn = document.getElementById('shop-quick-btn');
const resetSaveBtn = document.getElementById('reset-save-btn');
const statsSummaryEl = document.getElementById('stats-summary');

function updateFenceSkin() {
  if (fenceStructure) fenceStructure.classList.toggle('fence-skin-articular', !!gameState.articularSkinActive);
}

function initSplashScreen() {
  const splashScreen = document.getElementById('splash-screen'), progressFill = document.getElementById('splash-progress-fill'), promptEl = document.getElementById('splash-prompt');
  if (!splashScreen || !progressFill || !promptEl) return;
  let progress = 0, loaded = false;
  promptEl.textContent = "🎷 TAP TO START & PLAY LOFI JAZZ 🎵";
  const loadingInterval = setInterval(() => {
    progress += 1.6; if (progress > 100) progress = 100;
    progressFill.style.width = `${progress}%`;
    if (progress >= 100) { clearInterval(loadingInterval); loaded = true; promptEl.textContent = 'TAP TO START YOUR VENTURE'; promptEl.classList.add('ready-start'); }
  }, 45);

  splashScreen.addEventListener('click', () => {
    initAudioContext();
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
    playSFX('harvest');
    if (!loaded) { progress = 100; progressFill.style.width = '100%'; promptEl.textContent = 'TAP TO START YOUR VENTURE'; promptEl.classList.add('ready-start'); loaded = true; return; }
    splashScreen.classList.add('fade-out');
    setTimeout(() => { splashScreen.style.display = 'none'; }, 500);
  });
}

function openModal(modalEl) { modalEl.classList.remove('hidden'); void modalEl.offsetWidth; modalEl.classList.add('open'); gamepadState.menuFocusIndex = 0; }
function closeModal(modalEl) { modalEl.querySelectorAll('.gamepad-focused').forEach(el => el.classList.remove('gamepad-focused')); modalEl.classList.remove('open'); setTimeout(() => { if (!modalEl.classList.contains('open')) modalEl.classList.add('hidden'); }, 220); }

function openWeatherModal() {
  weatherModalTitle.textContent = gameState.isDay ? '☀️ Daylight Cycle Info' : '🌙 Nightfall Cycle Info';
  weatherModalBody.innerHTML = `
    <p style="text-align:center; font-size:15px; font-weight:900; color:#e6a100; margin-bottom:12px;">Current Phase: ${gameState.isDay ? '☀️ Daytime' : '🌙 Nighttime'} (${formatTime(gameState.cycleTimeLeft)} remaining)</p>
    <p><strong>🌙 Night Plants (⚡ 2X Growth Speed at Night):</strong><br>🍄 Glowshroom, 🍓 Strawberry</p><br>
    <p><strong>🌈 All-Weather Plants (Steady Growth Always):</strong><br>🥕 Carrot, 🥔 Potato, 🍅 Tomato, 🍇 Grape Vine, ⭐ Star Fruit, 🍉 Watermelon Vine, 🌸 Nectar Root, 🌌 Singularity Sprout Seed, 🌙 Celestial Moon Seed</p>
  `;
  openModal(weatherModal);
}

statusBanner.addEventListener('click', openWeatherModal);
closeWeatherBtn.addEventListener('click', () => closeModal(weatherModal));

btnUnlockField.addEventListener('click', () => {
  const cost = FIELD_EXPANSION_COSTS[gameState.currentField];
  if (gameState.cash >= cost) {
    gameState.cash -= cost; gameState.unlockedFields++; playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Field ${gameState.currentField + 1} Unlocked! 🎉`, "#81c784");
    updateHUD(); renderPlots();
  } else { createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Not enough cash! Need $${cost.toLocaleString()}`, "#ef5350"); }
});

function toggleDrawer(drawerEl) { if (drawerEl.classList.contains('open')) closeDrawer(drawerEl); else openDrawer(drawerEl); }
function openDrawer(drawerEl) { drawerEl.classList.remove('hidden'); void drawerEl.offsetWidth; drawerEl.classList.add('open'); gamepadState.menuFocusIndex = 0; renderSeedDrawer(); }
function closeDrawer(drawerEl) { drawerEl.querySelectorAll('.gamepad-focused').forEach(el => el.classList.remove('gamepad-focused')); drawerEl.classList.remove('open'); setTimeout(() => { if (!drawerEl.classList.contains('open')) drawerEl.classList.add('hidden'); }, 250); }

function spawnNightFireflies() {
  if (!firefliesLayer) return;
  firefliesLayer.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly'; ff.style.left = `${Math.random() * 92 + 4}%`; ff.style.top = `${Math.random() * 90 + 5}%`;
    ff.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`; ff.style.animationDuration = `${(3 + Math.random() * 3).toFixed(2)}s`;
    firefliesLayer.appendChild(ff);
  }
}

function buildPlotDOMStructure() {
  plotsGrid.innerHTML = ''; plotDomNodes = [];
  for (let i = 0; i < 9; i++) {
    const plotEl = document.createElement('div'); plotEl.className = 'plot';
    const cropTimerBadge = document.createElement('div'); cropTimerBadge.className = 'crop-timer-badge'; cropTimerBadge.style.display = 'none';
    const growthBar = document.createElement('div'); growthBar.className = 'growth-bar'; growthBar.style.display = 'none';
    const progress = document.createElement('div'); progress.className = 'growth-progress'; growthBar.appendChild(progress);
    const cropContainer = document.createElement('div'); cropContainer.className = 'crop-container'; cropContainer.style.display = 'none';
    const cropIcon = document.createElement('div'); cropIcon.className = 'crop-icon'; cropContainer.appendChild(cropIcon);
    const dirtBed = document.createElement('div'); dirtBed.className = 'dirt-bed';
    plotEl.appendChild(cropTimerBadge); plotEl.appendChild(growthBar); plotEl.appendChild(cropContainer); plotEl.appendChild(dirtBed);
    plotEl.addEventListener('click', (e) => handlePlotClick(i, e));
    plotsGrid.appendChild(plotEl);
    plotDomNodes.push({ plotEl, cropTimerBadge, growthBar, progress, cropContainer, cropIcon });
  }
}

function renderPlots() {
  if (gameState.currentField >= gameState.unlockedFields) {
    fieldLockedOverlay.classList.remove('hidden'); lockedFieldTitle.textContent = `Field ${gameState.currentField + 1} Locked`;
    btnUnlockField.textContent = `Unlock Field ($${FIELD_EXPANSION_COSTS[gameState.currentField].toLocaleString()})`;
  } else { fieldLockedOverlay.classList.add('hidden'); }

  const currentPlots = gameState.fields[gameState.currentField];
  const activeModal = document.querySelector('.modal.open'), isDrawerOpen = seedBagDrawer.classList.contains('open');

  document.querySelectorAll('.gamepad-focused').forEach(el => {
    if (!el.classList.contains('plot') || gamepadState.focusZone !== 'plots') el.classList.remove('gamepad-focused');
  });

  currentPlots.forEach((plot, i) => {
    const nodes = plotDomNodes[i]; if (!nodes) return;
    nodes.plotEl.classList.toggle('ready', plot.isReady || (plot.crop && plot.crop.isVine && plot.vineEstablished));
    nodes.plotEl.classList.toggle('vine-plot', !!(plot.crop && plot.crop.isVine));
    nodes.plotEl.classList.toggle('cloud-piercer', (plot.rolledMeters || 0) > 20);
    nodes.plotEl.classList.toggle('nocturnal-active', !!(plot.crop && plot.crop.affinity === 'night' && !gameState.isDay));
    nodes.plotEl.classList.toggle('gamepad-focused', gamepadState.connected && !activeModal && !isDrawerOpen && gamepadState.focusZone === 'plots' && gamepadState.selectedPlotIndex === i);

    if (plot.crop) {
      nodes.cropContainer.style.display = 'flex';
      const targetMeters = plot.rolledMeters || 1, targetKg = plot.rolledKg || plot.crop.minKg || 0.1;
      const currentKg = (plot.progress / 100) * targetKg, currentMeters = (plot.progress / 100) * targetMeters;
      nodes.cropIcon.style.setProperty('--crop-scale', 1 + (plot.progress / 100) * Math.min(2.5, targetMeters / 10));
      nodes.cropIcon.textContent = plot.progress < 35 ? '🌱' : plot.crop.icon;
      nodes.cropIcon.classList.toggle('mature', plot.isReady || plot.vineEstablished);
      nodes.cropTimerBadge.style.display = 'flex';
      let speedBadge = (plot.crop.affinity === 'night' && !gameState.isDay) ? '⚡2X ' : '';

      if (plot.crop.isVine) {
        if (!plot.vineEstablished) {
          const speedMultiplier = (plot.crop.affinity === 'night' && !gameState.isDay) ? 2.0 : 1;
          const remainingSecs = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 10)) * speedMultiplier)));
          nodes.cropTimerBadge.textContent = `🌱 ${formatMeters(currentMeters)} | ${speedBadge}${remainingSecs}s`;
          nodes.cropTimerBadge.classList.remove('ready-badge'); nodes.growthBar.style.display = 'block'; nodes.progress.style.width = `${Math.min(100, plot.progress)}%`;
        } else {
          const readyFruits = (plot.vineFruits || []).filter(f => f.isReady).length;
          nodes.cropTimerBadge.textContent = `${plot.crop.produceIcon || '🍇'} ${readyFruits}/${(plot.vineFruits || []).length} Ready | ${formatMeters(targetMeters)}`;
          nodes.cropTimerBadge.classList.toggle('ready-badge', readyFruits > 0); nodes.growthBar.style.display = 'none';
        }
      } else if (!plot.isReady) {
        const speedMultiplier = (plot.crop.affinity === 'night' && !gameState.isDay) ? 2.0 : 1;
        const remainingSecs = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 5)) * speedMultiplier)));
        nodes.cropTimerBadge.textContent = `🌱 ${formatKg(currentKg)} | ${speedBadge}${remainingSecs}s`;
        nodes.cropTimerBadge.classList.remove('ready-badge'); nodes.growthBar.style.display = 'block'; nodes.progress.style.width = `${Math.min(100, plot.progress)}%`;
      } else {
        nodes.cropTimerBadge.textContent = `READY! ${formatKg(targetKg)} ✨`; nodes.cropTimerBadge.classList.add('ready-badge'); nodes.growthBar.style.display = 'none';
      }
    } else {
      nodes.cropContainer.style.display = 'none'; nodes.growthBar.style.display = 'none'; nodes.cropTimerBadge.style.display = 'none';
    }
  });
}

function updateHUD() {
  cashEl.textContent = `$${gameState.cash.toLocaleString()}`;
  fieldTitle.textContent = `Field ${gameState.currentField + 1} / ${gameState.maxFields}`;
  if (gameState.selectedTool === 'shovel') { shovelBtn.classList.add('tool-active'); currentSeedNameEl.textContent = "Tool Active: ⛏️ Shovel"; }
  else {
    shovelBtn.classList.remove('tool-active');
    const activeSeed = SEED_CATALOG.find(s => s.id === gameState.selectedSeedId);
    currentSeedNameEl.textContent = activeSeed ? `Plant ${activeSeed.name} (x${gameState.seedInventory[gameState.selectedSeedId] || 0}) [Bag: ${gameState.produceInventory.length}]` : `Open Seed Bag (${gameState.produceInventory.length} Crops)`;
  }
  cycleIcon.textContent = gameState.isDay ? '☀️' : '🌙'; cycleLabel.textContent = gameState.isDay ? 'Day Time (Click Info)' : 'Night Time (Click Info)';
  cycleTimer.textContent = formatTime(gameState.cycleTimeLeft);
  document.body.classList.toggle('day-theme', gameState.isDay); document.body.classList.toggle('night-theme', !gameState.isDay);
  shopRefillTimerEl.textContent = formatTime(gameState.shopRefillTimeLeft);
}

function formatTime(seconds) { return `${Math.floor(seconds / 60)}:${(seconds % 60) < 10 ? '0' : ''}${seconds % 60}`; }

function rollCropWeight(seedToPlant) {
  const minKg = Number(seedToPlant.minKg) || 0.1, baseMaxKg = Number(seedToPlant.baseMaxKg) || 2.5, maxKg = Number(seedToPlant.maxKg) || 10000000;
  const r = Math.random(); let jackpotMult = 1.0;
  if (r >= 0.995) jackpotMult = 2000 + Math.pow((r - 0.995) / 0.005, 3) * 3998000;
  else if (r >= 0.97) jackpotMult = 40 + Math.pow((r - 0.97) / 0.025, 2) * 1960;
  else if (r >= 0.88) jackpotMult = 2 + Math.pow((r - 0.88) / 0.09, 1.8) * 38;
  else jackpotMult = 1.0 + Math.pow(r / 0.88, 2) * 1.0;

  const baseKg = minKg + Math.pow(Math.random(), 1.8) * (baseMaxKg - minKg);
  const rolledKg = Math.min(maxKg, baseKg * jackpotMult);
  const baseMeters = (Number(seedToPlant.minM) || 0.2) + Math.random() * ((Number(seedToPlant.maxM) || 0.8) - (Number(seedToPlant.minM) || 0.2));
  return { rolledKg, rolledMeters: baseMeters * (jackpotMult > 1 ? Math.min(15, Math.pow(jackpotMult, 0.25)) : 1.0) };
}

function rollFruitStats(crop) {
  const rolled = rollCropWeight(crop);
  return { fruitKg: rolled.rolledKg, fruitGrowTime: Math.max(10, Math.round((crop.baseGrowTime) * (1 + (rolled.rolledKg / (crop.baseMaxKg || 2.5)) * 0.05))) };
}

function handlePlotClick(plotIndex, event) {
  if (gameState.currentField >= gameState.unlockedFields) return;
  const currentPlots = gameState.fields[gameState.currentField], plot = currentPlots[plotIndex];
  const posX = event ? event.clientX : window.innerWidth / 2, posY = event ? event.clientY : window.innerHeight / 2;

  if (gameState.selectedTool === 'shovel') {
    if (plot.crop) { plot.crop = null; plot.progress = 0; plot.isReady = false; plot.vineEstablished = false; plot.vineFruits = []; playSFX('shovel'); createFloatingText(posX, posY, "Removed ⛏️", "#ff8a80"); renderPlots(); }
    return;
  }
  if (plot.crop && plot.crop.isVine) { if (!plot.vineEstablished) { createFloatingText(posX, posY, `Main Vine Trellis is still growing! (${Math.round(plot.progress)}%)`, "#e0c9a6"); return; } gameState.selectedVinePlotIndex = plotIndex; openVineModal(); return; }

  if (plot.crop && plot.isReady) {
    const harvestedCrop = plot.crop, safeKg = plot.rolledKg || harvestedCrop.minKg || 0.1, safeMeters = plot.rolledMeters || harvestedCrop.minM || 1;
    const earnings = calculateProduceEarnings(harvestedCrop.baseSellPrice, safeKg, harvestedCrop.minKg);
    gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: harvestedCrop.id, name: harvestedCrop.name.replace(' Seed', ''), icon: harvestedCrop.icon, kg: safeKg, meters: safeMeters, value: earnings });
    if (!gameState.codex[harvestedCrop.id]) { gameState.codex[harvestedCrop.id] = { discovered: true, totalHarvested: 0 }; checkCodexCompletion(); }
    gameState.codex[harvestedCrop.id].totalHarvested += 1;
    plot.crop = null; plot.progress = 0; plot.isReady = false; plot.vineEstablished = false;
    playSFX('harvest'); createFloatingText(posX, posY, `+1 ${harvestedCrop.icon} (${formatKg(safeKg)}) 🎒`, "#81c784");
    updateHUD(); renderPlots(); return;
  }

  if (!plot.crop) {
    const seedToPlant = SEED_CATALOG.find(s => s.id === gameState.selectedSeedId); if (!seedToPlant) return;
    if (seedToPlant.isVine && currentPlots.filter(p => p.crop && p.crop.isVine).length >= 3) { createFloatingText(posX, posY, "Max 3 Vines per Field Bed! 🌿", "#ef5350"); return; }
    if ((gameState.seedInventory[seedToPlant.id] || 0) <= 0) { createFloatingText(posX, posY, "Out of Seeds! Buy in Shop 🛒", "#ef5350"); return; }
    gameState.seedInventory[seedToPlant.id]--;
    const weightRoll = rollCropWeight(seedToPlant);
    plot.crop = { ...seedToPlant }; plot.progress = 0; plot.isReady = false; plot.vineEstablished = false;
    plot.rolledKg = weightRoll.rolledKg; plot.rolledMeters = weightRoll.rolledMeters;
    plot.actualGrowTime = Math.max(5, Math.round((Number(seedToPlant.baseGrowTime) || 5) * (1 + (weightRoll.rolledKg / (seedToPlant.baseMaxKg || 2.5)) * 0.05)));
    if (!gameState.codex[seedToPlant.id]) { gameState.codex[seedToPlant.id] = { discovered: true, totalHarvested: 0 }; checkCodexCompletion(); }
    playSFX('plant'); createFloatingText(posX, posY, `Planted ${seedToPlant.icon}`, "#81c784"); updateHUD(); renderPlots();
  }
}

function createFloatingText(x, y, text, color) {
  const el = document.createElement('div'); el.className = 'floating-text'; el.textContent = text; el.style.left = `${x - 20}px`; el.style.top = `${y - 20}px`; if (color) el.style.color = color;
  particlesLayer.appendChild(el); setTimeout(() => el.remove(), 1000);
}

function pollGamepad() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : []; const gp = gamepads[0] || gamepads[1]; if (!gp) return;
  const now = Date.now(); if (now - gamepadState.lastButtonTime < gamepadState.buttonCooldown) return;
  const splashScreen = document.getElementById('splash-screen'); if (splashScreen && splashScreen.style.display !== 'none' && !splashScreen.classList.contains('fade-out')) { if (gp.buttons[0].pressed || gp.buttons[9].pressed) { splashScreen.click(); gamepadState.lastButtonTime = now; } return; }
  const activeModal = document.querySelector('.modal.open'), isDrawerOpen = seedBagDrawer.classList.contains('open');
  if (activeModal || isDrawerOpen) {
    const container = activeModal || seedBagDrawer; const items = Array.from(container.querySelectorAll('button:not([disabled]), .seed-select-card, .btn-sell-option'));
    if (items.length > 0) {
      items.forEach(el => el.classList.remove('gamepad-focused'));
      const axisY = gp.axes[1];
      if (axisY > 0.5) gamepadState.menuFocusIndex = (gamepadState.menuFocusIndex + 1) % items.length;
      else if (axisY < -0.5) gamepadState.menuFocusIndex = (gamepadState.menuFocusIndex - 1 + items.length) % items.length;
      const focusedItem = items[gamepadState.menuFocusIndex];
      if (focusedItem) { focusedItem.classList.add('gamepad-focused'); if (gp.buttons[0].pressed) { focusedItem.click(); gamepadState.lastButtonTime = now; } }
    } return;
  }
  const axisX = gp.axes[0], axisY = gp.axes[1];
  let row = Math.floor(gamepadState.selectedPlotIndex / 3), col = gamepadState.selectedPlotIndex % 3;
  if (axisY < -0.5 && row > 0) row--; else if (axisY > 0.5 && row < 2) row++;
  if (axisX < -0.5 && col > 0) col--; else if (axisX > 0.5 && col < 2) col++;
  gamepadState.selectedPlotIndex = row * 3 + col;
  if (gp.buttons[0].pressed) { handlePlotClick(gamepadState.selectedPlotIndex, null); gamepadState.lastButtonTime = now; }
  renderPlots();
}

let lastTickTime = Date.now();
function gameLoop() {
  const now = Date.now(), delta = Math.min((now - lastTickTime) / 1000, 0.1); lastTickTime = now; pollGamepad();
  gameState.fields.forEach(fieldPlots => {
    fieldPlots.forEach(plot => {
      if (plot.crop) {
        const speedMultiplier = (plot.crop.affinity === 'night' && !gameState.isDay) ? 2.0 : 1.0;
        if (plot.crop.isVine) {
          if (!plot.vineEstablished) {
            plot.progress += ((100 / (plot.actualGrowTime || 10)) * speedMultiplier) * delta;
            if (plot.progress >= 100) {
              plot.progress = 100; plot.vineEstablished = true; plot.vineFruits = [];
              for (let f = 0; f < Math.min(3, plot.crop.maxFruits || 3); f++) {
                const rolledStats = rollFruitStats(plot.crop);
                plot.vineFruits.push({ fruitId: `${plot.crop.id}_${f}`, name: plot.crop.produceName, icon: plot.crop.produceIcon, progress: 0, isReady: false, rolledKg: rolledStats.fruitKg, growTime: rolledStats.fruitGrowTime });
              }
            }
          } else if (plot.vineFruits) {
            plot.vineFruits.forEach(fruit => { if (!fruit.isReady) { fruit.progress += ((100 / (fruit.growTime || 10)) * speedMultiplier) * delta; if (fruit.progress >= 100) { fruit.progress = 100; fruit.isReady = true; } } });
          }
        } else if (!plot.isReady) {
          plot.progress += ((100 / (plot.actualGrowTime || 5)) * speedMultiplier) * delta;
          if (plot.progress >= 100) { plot.progress = 100; plot.isReady = true; }
        }
      }
    });
  });
  renderPlots(); if (!vineModal.classList.contains('hidden')) renderVineModalContent();
}

function secondTick() {
  gameState.cycleTimeLeft--;
  if (gameState.cycleTimeLeft <= 0) {
    gameState.isDay = !gameState.isDay; gameState.cycleTimeLeft = 300;
    cycleIcon.style.transform = 'rotate(360deg) scale(1.3)'; setTimeout(() => { cycleIcon.style.transform = 'rotate(0deg) scale(1)'; }, 800);
    if (!gameState.bgmMuted) { if (lofiTimer) clearInterval(lofiTimer); playNextLofiChord(); lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500); }
  }
  gameState.shopRefillTimeLeft--;
  if (gameState.shopRefillTimeLeft <= 0) { refreshShopStocks(); gameState.shopRefillTimeLeft = 180; if (!shopModal.classList.contains('hidden')) renderShopItems(); }
  updateHUD();
}

function openSellModal() { renderSellMainOptions(); openModal(sellModal); }
function renderSellMainOptions() {
  sellMainOptions.classList.remove('hidden'); sellItemPicker.classList.add('hidden'); sellQuantityPicker.classList.add('hidden'); bargainNpcBox.classList.add('hidden');
  let totalValue = 0; gameState.produceInventory.forEach(item => totalValue += item.value);
  sellAllPayoutText.textContent = `Total Value: $${totalValue.toLocaleString()} (${gameState.produceInventory.length} items)`;
}

btnSellAllModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) { createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "Seed Bag is empty!", "#ef5350"); return; }
  let totalEarned = 0; gameState.produceInventory.forEach(item => totalEarned += item.value); gameState.produceInventory = [];
  gameState.cash += totalEarned; playSFX('sell'); createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Sold All Crops: +$${totalEarned.toLocaleString()}! 🤠`, "#ffd54f");
  updateHUD(); closeModal(sellModal);
});

btnSellSelectModal.addEventListener('click', () => { if (gameState.produceInventory.length === 0) { createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "Seed Bag is empty!", "#ef5350"); return; } renderSellItemPicker(); });

btnSellBargainModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) { createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "Seed Bag is empty! Harvest crops first 🧺", "#ef5350"); return; }
  sellMainOptions.classList.add('hidden'); sellItemPicker.classList.add('hidden'); sellQuantityPicker.classList.add('hidden'); bargainNpcBox.classList.remove('hidden');
  let baseVal = 0, highRarityCount = 0;
  gameState.produceInventory.forEach(item => { baseVal += item.value; if (item.seedId === 'singularity' || item.seedId === 'celestial_moon' || item.seedId === 'strawberry') highRarityCount++; });
  currentBargainBase = baseVal; currentBargainFee = Math.round(baseVal * 0.20 + highRarityCount * 1250000); isDailyDealActive = false;
  npcDialogueText.textContent = `Greetings traveler! I am Merchant Barnaby. I can appraise your Seed Bag and make you a custom deal. My appraisal fee is $${currentBargainFee.toLocaleString()}.`;
  npcBargainFee.textContent = `Appraisal Fee: $${currentBargainFee.toLocaleString()}`; npcStandardValue.textContent = `$${baseVal.toLocaleString()}`; npcProjectedCash.textContent = `$0`;
  npcOfferTier.classList.add('hidden'); btnStartBargain.classList.remove('hidden'); btnDailyDeal.classList.add('hidden'); btnAcceptBargain.classList.add('hidden'); btnDeclineBargain.classList.add('hidden');
});

btnStartBargain.addEventListener('click', () => {
  if (gameState.cash < currentBargainFee) { createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Can't afford $${currentBargainFee.toLocaleString()} Appraisal Fee!`, "#ef5350"); return; }
  gameState.cash -= currentBargainFee; playSFX('sell'); updateHUD();
  const r = Math.random();
  if (r < 0.35) { currentBargainMultiplier = 0.3 + Math.random() * 0.5; npcOfferTier.className = "npc-offer-tier"; npcOfferTier.style.color = "#ef5350"; npcOfferTier.textContent = "Merchant Offer: BAD DEAL! (30-80% Market Value)"; npcDialogueText.textContent = "Oof! This batch isn't looking so great... Here's my offer. Take it or leave it!"; }
  else if (r < 0.80) { currentBargainMultiplier = 1.0 + Math.random() * 0.3; npcOfferTier.className = "npc-offer-tier"; npcOfferTier.style.color = "#2e7d32"; npcOfferTier.textContent = "Merchant Offer: Standard Fair Deal"; npcDialogueText.textContent = "A respectable harvest! Here is my fair market proposal."; }
  else if (r < 0.95) { currentBargainMultiplier = 2.0 + Math.random() * 2.0; npcOfferTier.className = "npc-offer-tier"; npcOfferTier.style.color = "#ff9800"; npcOfferTier.textContent = "Merchant Offer: Great Deal! 🔥"; npcDialogueText.textContent = "Splendid produce! I can pay a premium for these crops!"; }
  else { currentBargainMultiplier = 5.0 + Math.random() * 5.0; npcOfferTier.className = "rainbow-offer-text"; npcOfferTier.textContent = "Merchant Offer: 🌈 LEGENDARY DEAL!"; npcDialogueText.textContent = "ASTOUNDING CROPS! This is a once-in-a-lifetime harvest proposal!"; }
  currentBargainPayout = Math.round(currentBargainBase * currentBargainMultiplier);
  npcBargainFee.textContent = "Appraisal Fee Paid"; npcProjectedCash.textContent = `$${currentBargainPayout.toLocaleString()}`;
  npcOfferTier.classList.remove('hidden'); btnStartBargain.classList.add('hidden'); btnAcceptBargain.classList.remove('hidden'); btnDeclineBargain.classList.remove('hidden'); btnDailyDeal.classList.remove('hidden');
  btnDailyDeal.disabled = gameState.dailyDealUsed; btnDailyDeal.textContent = gameState.dailyDealUsed ? "Daily Deal Used Today" : "🔥 APPLY 20X DAILY DEAL! 🔥";
});

btnDailyDeal.addEventListener('click', () => {
  if (!gameState.dailyDealUsed && currentBargainBase > 0) {
    isDailyDealActive = true; let dealPayout = Math.round(currentBargainBase * currentBargainMultiplier * 20);
    npcProjectedCash.textContent = `$${dealPayout.toLocaleString()}`; npcDialogueText.textContent = `🔥 20X DAILY DEAL APPLIED! Bargain payout boosted to $${dealPayout.toLocaleString()}!`;
    btnDailyDeal.disabled = true; btnDailyDeal.textContent = "🔥 20X Daily Deal Applied!"; playSFX('harvest');
  }
});

btnAcceptBargain.addEventListener('click', () => {
  let finalPayout = isDailyDealActive ? Math.round(currentBargainBase * currentBargainMultiplier * 20) : currentBargainPayout;
  if (finalPayout > 0 && gameState.produceInventory.length > 0) {
    if (isDailyDealActive) gameState.dailyDealUsed = true;
    gameState.cash += finalPayout; gameState.produceInventory = []; playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Accepted Bargain: +$${finalPayout.toLocaleString()}! 🧙‍♂️`, "#ffd54f");
    currentBargainPayout = 0; isDailyDealActive = false; updateHUD(); closeModal(sellModal);
  }
});

btnDeclineBargain.addEventListener('click', () => { isDailyDealActive = false; currentBargainPayout = 0; renderSellMainOptions(); });
btnBargainBack.addEventListener('click', () => { isDailyDealActive = false; currentBargainPayout = 0; renderSellMainOptions(); });

function renderSellItemPicker() {
  sellMainOptions.classList.add('hidden'); sellItemPicker.classList.remove('hidden'); sellQuantityPicker.classList.add('hidden'); bargainNpcBox.classList.add('hidden');
  sellItemPicker.innerHTML = '';
  getGroupedProduce().forEach(group => {
    let groupTotalVal = 0; group.items.forEach(i => groupTotalVal += i.value);
    const card = document.createElement('div'); card.className = 'btn-sell-option';
    card.innerHTML = `<span style="font-size: 28px;">${group.icon}</span><div class="sell-opt-text" style="flex: 1;"><span class="opt-title">${group.name} (x${group.items.length})</span><span class="opt-subtitle">Total Value: $${groupTotalVal.toLocaleString()}</span></div><button class="btn-market-select">${group.items.length > 1 ? 'Choose Qty 🧺' : `Sell 1 ($${groupTotalVal.toLocaleString()})`}</button>`;
    card.addEventListener('click', () => {
      if (group.items.length === 1) {
        const itemToSell = group.items[0]; gameState.cash += itemToSell.value;
        const idx = gameState.produceInventory.findIndex(p => p.id === itemToSell.id); if (idx !== -1) gameState.produceInventory.splice(idx, 1);
        playSFX('sell'); createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+$${itemToSell.value.toLocaleString()}! 💰`, "#ffd54f");
        updateHUD(); if (gameState.produceInventory.length === 0) closeModal(sellModal); else renderSellItemPicker();
      } else { sellQuantityState.selectedCropGroup = group; sellQuantityState.quantityToSell = 1; renderSellQuantityPicker(); }
    });
    sellItemPicker.appendChild(card);
  });
}

function renderSellQuantityPicker() {
  sellMainOptions.classList.add('hidden'); sellItemPicker.classList.add('hidden'); sellQuantityPicker.classList.remove('hidden'); bargainNpcBox.classList.add('hidden');
  const group = sellQuantityState.selectedCropGroup; if (!group || group.items.length === 0) { renderSellItemPicker(); return; }
  qtyCropHeader.textContent = `${group.icon} ${group.name} (Owned: x${group.items.length})`; qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
  let payout = 0; for (let i = 0; i < sellQuantityState.quantityToSell; i++) { if (group.items[i]) payout += group.items[i].value; }
  qtyPayoutPreview.textContent = `Payout: $${payout.toLocaleString()}`;
}

qtyMinusBtn.addEventListener('click', () => { if (sellQuantityState.quantityToSell > 1) { sellQuantityState.quantityToSell--; renderSellQuantityPicker(); } });
qtyPlusBtn.addEventListener('click', () => { const group = sellQuantityState.selectedCropGroup; if (group && sellQuantityState.quantityToSell < group.items.length) { sellQuantityState.quantityToSell++; renderSellQuantityPicker(); } });

qtyConfirmSellBtn.addEventListener('click', () => {
  const group = sellQuantityState.selectedCropGroup; if (!group) return;
  let totalEarned = 0; const countToSell = sellQuantityState.quantityToSell;
  for (let i = 0; i < countToSell; i++) {
    const itemToSell = group.items[i];
    if (itemToSell) { totalEarned += itemToSell.value; const idx = gameState.produceInventory.findIndex(p => p.id === itemToSell.id); if (idx !== -1) gameState.produceInventory.splice(idx, 1); }
  }
  gameState.cash += totalEarned; playSFX('sell'); createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Sold ${countToSell}x ${group.name}: +$${totalEarned.toLocaleString()}! 💰`, "#ffd54f");
  updateHUD(); if (gameState.produceInventory.length === 0) closeModal(sellModal); else renderSellItemPicker();
});

qtyBackBtn.addEventListener('click', () => renderSellItemPicker());
closeSellBtn.addEventListener('click', () => closeModal(sellModal));
closePermInfoBtn.addEventListener('click', () => closeModal(permanentInfoModal));
function openVineModal() { renderVineModalContent(); openModal(vineModal); }

function renderVineModalContent() {
  if (gameState.selectedVinePlotIndex === null) return;
  const plot = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex]; if (!plot || !plot.crop || !plot.crop.isVine) return;
  vineModalTitle.textContent = `${plot.crop.icon} ${plot.crop.name}`; vineProduceList.innerHTML = '';
  (plot.vineFruits || []).forEach((fruit, idx) => {
    const safeKg = fruit.rolledKg || plot.crop.minKg || 0.1, currentFruitKg = (fruit.progress / 100) * safeKg, earnings = calculateProduceEarnings(plot.crop.baseSellPrice, safeKg, plot.crop.minKg);
    const speedMultiplier = (plot.crop.affinity === 'night' && !gameState.isDay) ? 2.0 : 1;
    const remainingSecs = Math.max(1, Math.ceil((100 - fruit.progress) / ((100 / (fruit.growTime || 10)) * speedMultiplier)));
    const card = document.createElement('div'); card.className = 'vine-produce-card';
    card.innerHTML = `<div class="card-left-group"><div class="item-icon-badge">${fruit.icon}</div><div class="item-details"><span class="item-title">${fruit.name} #${idx + 1}</span><span class="item-sub-stat">${fruit.isReady ? `${formatKg(safeKg)} • <strong style="color:#2e7d32;">$${earnings.toLocaleString()}</strong>` : `🌱 ${formatKg(currentFruitKg)} • ${remainingSecs}s`}</span></div></div><button class="btn-vine-harvest" ${fruit.isReady ? '' : 'disabled'}>${fruit.isReady ? `Harvest` : 'Growing'}</button>`;
    const harvestBtn = card.querySelector('.btn-vine-harvest');
    if (fruit.isReady) {
      harvestBtn.addEventListener('click', () => {
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: plot.crop.id, name: fruit.name, icon: fruit.icon, kg: safeKg, meters: plot.crop.minM, value: earnings });
        fruit.progress = 0; fruit.isReady = false; const rolledStats = rollFruitStats(plot.crop); fruit.rolledKg = rolledStats.fruitKg; fruit.growTime = rolledStats.fruitGrowTime;
        playSFX('harvest'); createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+1 ${fruit.icon} (${formatKg(safeKg)}) 🎒`, "#81c784"); updateHUD(); renderVineModalContent();
      });
    }
    vineProduceList.appendChild(card);
  });
}

harvestAllVineBtn.addEventListener('click', () => {
  if (gameState.selectedVinePlotIndex === null) return;
  const plot = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex]; if (!plot || !plot.crop || !plot.crop.isVine) return;
  let count = 0;
  (plot.vineFruits || []).forEach(fruit => {
    if (fruit.isReady) {
      const safeKg = fruit.rolledKg || plot.crop.minKg || 0.1, earnings = calculateProduceEarnings(plot.crop.baseSellPrice, safeKg, plot.crop.minKg);
      gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: plot.crop.id, name: fruit.name, icon: fruit.icon, kg: safeKg, meters: plot.crop.minM, value: earnings });
      fruit.progress = 0; fruit.isReady = false; const rolledStats = rollFruitStats(plot.crop); fruit.rolledKg = rolledStats.fruitKg; fruit.growTime = rolledStats.fruitGrowTime; count++;
    }
  });
  if (count > 0) { playSFX('harvest'); createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `Harvested ${count} Vine Fruits to Bag! 🎒`, "#81c784"); updateHUD(); renderVineModalContent(); }
});

closeVineBtn.addEventListener('click', () => closeModal(vineModal));

function renderShopItems() {
  shopItemsList.innerHTML = '';
  SEED_CATALOG.forEach(seed => {
    const canAfford = gameState.cash >= seed.cost, hasStock = seed.currentStock > 0, ownedQty = gameState.seedInventory[seed.id] || 0;
    let buttonText = 'Buy', buttonClass = 'btn-buy';
    if (!hasStock) { buttonText = 'Out of Stock'; buttonClass = 'btn-buy stocked'; }
    else if (!canAfford) buttonClass = 'btn-buy unaffordable';
    const card = document.createElement('div'); card.className = 'shop-item-card';
    card.innerHTML = `<div class="item-info"><div class="item-title">${seed.icon} ${seed.name} ${seed.isVine ? '<span class="permanent-red-p-badge" data-seed-id="' + seed.id + '" title="Permanent Plant Info">P</span>' : ''}</div><div><span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span></div><div class="item-price-stock">$${seed.cost.toLocaleString()} | Stock: ${seed.currentStock} (Owned: ${ownedQty})</div></div><button class="${buttonClass}" ${!canAfford || !hasStock ? 'disabled' : ''}>${buttonText}</button>`;
    const pBadge = card.querySelector('.permanent-red-p-badge');
    if (pBadge) pBadge.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); openModal(permanentInfoModal); });
    const buyBtn = card.querySelector('button.btn-buy');
    if (canAfford && hasStock) {
      buyBtn.addEventListener('click', () => {
        gameState.cash -= seed.cost; gameState.seedInventory[seed.id] = (gameState.seedInventory[seed.id] || 0) + 1; seed.currentStock--;
        gameState.selectedSeedId = seed.id; gameState.selectedTool = 'plant'; playSFX('sell'); updateHUD(); renderShopItems();
      });
    }
    shopItemsList.appendChild(card);
  });
}

function renderIndexCodex() {
  indexItemsList.innerHTML = '';
  SEED_CATALOG.forEach(seed => {
    const isDiscovered = !!(gameState.codex[seed.id] && gameState.codex[seed.id].discovered);
    const card = document.createElement('div'); card.className = `codex-card-item ${isDiscovered ? '' : 'locked'}`;
    card.innerHTML = `<div style="font-size: 28px;">${isDiscovered ? seed.icon : '❓'}</div><div style="font-size: 12px; font-weight: 800;">${isDiscovered ? seed.name : 'Unknown Plant'}</div><span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span><div style="font-size: 10px; color: #5d4037; margin-top: 2px;">${isDiscovered ? `Discovered` : 'Not Discovered'}</div>`;
    indexItemsList.appendChild(card);
  });
}

function renderSeedDrawer() {
  tabSeedsBtn.classList.toggle('active', gameState.activeDrawerTab === 'seeds');
  tabProduceBtn.classList.toggle('active', gameState.activeDrawerTab === 'produce');
  if (gameState.activeDrawerTab === 'seeds') {
    seedInventoryList.classList.remove('hidden'); produceInventoryList.classList.add('hidden'); seedInventoryList.innerHTML = '';
    SEED_CATALOG.forEach(seed => {
      const card = document.createElement('div'); card.className = `seed-select-card ${gameState.selectedSeedId === seed.id && gameState.selectedTool === 'plant' ? 'active' : ''}`;
      card.innerHTML = `<div style="font-size: 22px;">${seed.icon}</div><div style="display: flex; flex-direction: column;"><span style="font-size: 12px; font-weight: 800;">${seed.name}</span><span style="font-size: 10px; color: #5d4037;">Qty: ${gameState.seedInventory[seed.id] || 0}</span></div>`;
      card.addEventListener('click', () => { gameState.selectedSeedId = seed.id; gameState.selectedTool = 'plant'; closeDrawer(seedBagDrawer); updateHUD(); });
      seedInventoryList.appendChild(card);
    });
  } else {
    seedInventoryList.classList.add('hidden'); produceInventoryList.classList.remove('hidden'); produceInventoryList.innerHTML = '';
    if (gameState.produceInventory.length === 0) { produceInventoryList.innerHTML = `<p style="text-align: center; color: #6d4c41; font-size: 13px; font-weight: 800; padding: 20px;">🧺 Your Seed Bag is empty!<br>Harvest ready crops from your farm plots to store them here!</p>`; return; }
    gameState.produceInventory.forEach(item => {
      const card = document.createElement('div'); card.className = 'produce-item-card';
      card.innerHTML = `<div style="display: flex; align-items: center; gap: 10px; width: 100%;"><div style="font-size: 26px;">${item.icon}</div><div style="display: flex; flex-direction: column; flex: 1;"><span style="font-size: 13px; font-weight: 900; color: #2c1a14;">${item.name}</span><span style="font-size: 11px; color: #2e7d32; font-weight: 800;">Weight: ${formatKg(item.kg)} | Height: ${formatMeters(item.meters)} | Value: $${item.value.toLocaleString()}</span></div></div>`;
      produceInventoryList.appendChild(card);
    });
  }
}

tabSeedsBtn.addEventListener('click', () => { gameState.activeDrawerTab = 'seeds'; renderSeedDrawer(); });
tabProduceBtn.addEventListener('click', () => { gameState.activeDrawerTab = 'produce'; renderSeedDrawer(); });
shovelBtn.addEventListener('click', () => { gameState.selectedTool = gameState.selectedTool === 'shovel' ? 'plant' : 'shovel'; updateHUD(); });
sellBtn.addEventListener('click', (e) => { if (gameState.produceInventory.length === 0) { createFloatingText(e ? e.clientX : window.innerWidth / 2, e ? e.clientY : window.innerHeight / 2, "No harvested crops in Seed Bag! Harvest crops first 🧺", "#ef5350"); return; } openSellModal(); });

prevFieldBtn.addEventListener('click', () => {
  if (gameState.currentField > 0) { plotsGrid.classList.add('slide-out-right'); setTimeout(() => { gameState.currentField--; updateHUD(); renderPlots(); plotsGrid.classList.remove('slide-out-right'); }, 150); }
});

nextFieldBtn.addEventListener('click', () => {
  if (gameState.currentField < gameState.maxFields - 1) { plotsGrid.classList.add('slide-out-left'); setTimeout(() => { gameState.currentField++; updateHUD(); renderPlots(); plotsGrid.classList.remove('slide-out-left'); }, 150); }
});

seedBagBtn.addEventListener('click', () => toggleDrawer(seedBagDrawer));
closeDrawerBtn.addEventListener('click', () => closeDrawer(seedBagDrawer));
shopBtn.addEventListener('click', () => { renderShopItems(); openModal(shopModal); });
shopQuickBtn.addEventListener('click', () => { renderShopItems(); openModal(shopModal); });
closeShopBtn.addEventListener('click', () => closeModal(shopModal));
openIndexBtn.addEventListener('click', () => { renderIndexCodex(); openModal(indexModal); });
closeIndexBtn.addEventListener('click', () => closeModal(indexModal));

settingsBtn.addEventListener('click', () => {
  statsSummaryEl.innerHTML = `<p style="font-size: 13px; color: #4e342e; margin-bottom: 10px;"><strong>Unlocked Fields:</strong> ${gameState.unlockedFields} / ${gameState.maxFields}<br><strong>Harvested Crops Stored:</strong> ${gameState.produceInventory.length} items<br><strong>Carrot Seeds Owned:</strong> ${gameState.seedInventory.carrot || 0}</p>`;
  openModal(settingsModal);
});

closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));
resetSaveBtn.addEventListener('click', () => { if (confirm("Are you sure you want to reset all garden progress?")) { localStorage.removeItem('gardenVenture2Save'); location.reload(); } });

function saveGame() {
  localStorage.setItem('gardenVenture2Save', JSON.stringify({
    cash: gameState.cash, currentField: gameState.currentField, unlockedFields: gameState.unlockedFields,
    selectedSeedId: gameState.selectedSeedId, seedInventory: gameState.seedInventory, produceInventory: gameState.produceInventory,
    codex: gameState.codex, fields: gameState.fields, bgmMuted: gameState.bgmMuted, sfxMuted: gameState.sfxMuted,
    dailyDealUsed: gameState.dailyDealUsed, articularSkinActive: gameState.articularSkinActive
  }));
}

function loadGame() {
  const savedData = localStorage.getItem('gardenVenture2Save');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      gameState.cash = data.cash || 25; gameState.currentField = data.currentField || 0; gameState.unlockedFields = data.unlockedFields || 1;
      gameState.selectedSeedId = data.selectedSeedId || 'carrot'; gameState.seedInventory = data.seedInventory || { carrot: 5 };
      gameState.produceInventory = data.produceInventory || []; gameState.codex = data.codex || { carrot: { discovered: true, totalHarvested: 0 } };
      gameState.bgmMuted = data.bgmMuted || false; gameState.sfxMuted = data.sfxMuted || false; gameState.dailyDealUsed = data.dailyDealUsed || false;
      gameState.articularSkinActive = data.articularSkinActive || false; if (data.fields) gameState.fields = data.fields;
    } catch (e) { console.error("Save load error", e); }
  }
}

function initGame() {
  initFields(); buildPlotDOMStructure(); spawnNightFireflies(); initSplashScreen(); loadGame(); refreshShopStocks(); updateFenceSkin(); updateHUD(); renderPlots();
  setInterval(gameLoop, 100); setInterval(secondTick, 1000); setInterval(saveGame, 5000);
}

window.addEventListener('DOMContentLoaded', initGame);