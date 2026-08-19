const firebaseConfig = {
  apiKey: "AIzaSyDutDmS8bUNP6D3IZL-_j5OwWFPmCbbNw8",
  authDomain: "garden-venture-2.firebaseapp.com",
  databaseURL: "https://garden-venture-2-default-rtdb.firebaseio.com",
  projectId: "garden-venture-2",
  storageBucket: "garden-venture-2.firebasestorage.app",
  messagingSenderId: "756618963660",
  appId: "1:756618963660:web:a8d5f86fb1d5b879fdf069",
  measurementId: "G-RKJJB8X8B8"
};

let db = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
  }
} catch (e) {
  console.warn("Firebase Init Notice:", e);
}

let myPlayerId = localStorage.getItem('gv2_playerId');
if (!myPlayerId) {
  myPlayerId = Math.floor(10000000 + Math.random() * 90000000).toString();
  localStorage.setItem('gv2_playerId', myPlayerId);
}

const SEED_CATALOG = [
  { id: 'carrot', name: 'Carrot Seed', icon: '🥕', rarity: 'common', affinity: 'all', cost: 20, maxStock: 10, currentStock: 10, baseGrowTime: 8, baseSellPrice: 35, minKg: 0.1, baseMaxKg: 2.5, maxKg: 10000000, minM: 0.2, maxM: 0.8, isVine: false },
  { id: 'potato', name: 'Potato Seed', icon: '🥔', rarity: 'common', affinity: 'all', cost: 50, maxStock: 8, currentStock: 8, baseGrowTime: 14, baseSellPrice: 90, minKg: 0.1, baseMaxKg: 4.0, maxKg: 10000000, minM: 0.3, maxM: 1.0, isVine: false },
  { id: 'tomato', name: 'Tomato Seed', icon: '🍅', rarity: 'uncommon', affinity: 'all', cost: 120, maxStock: 6, currentStock: 6, baseGrowTime: 20, baseSellPrice: 220, minKg: 0.1, baseMaxKg: 5.0, maxKg: 10000000, minM: 0.5, maxM: 1.8, isVine: false },
  { id: 'glowshroom', name: 'Glowshroom Seed', icon: '🍄', rarity: 'uncommon', affinity: 'night', cost: 250, maxStock: 5, currentStock: 5, baseGrowTime: 25, baseSellPrice: 480, minKg: 0.1, baseMaxKg: 6.0, maxKg: 10000000, minM: 0.6, maxM: 2.2, isVine: false },
  { id: 'grape_vine', name: 'Grape Vine Seed', icon: '🍇', rarity: 'uncommon', affinity: 'all', cost: 500, maxStock: 5, currentStock: 5, baseGrowTime: 35, baseSellPrice: 80, minKg: 0.1, baseMaxKg: 3.5, maxKg: 10000000, minM: 1.2, maxM: 3.0, isVine: true, produceIcon: '🍇', produceName: 'Grape Cluster', maxFruits: 3 },
  { id: 'starfruit', name: 'Star Fruit Seed', icon: '⭐', rarity: 'rare', affinity: 'all', cost: 900, maxStock: 4, currentStock: 4, baseGrowTime: 40, baseSellPrice: 1800, minKg: 0.1, baseMaxKg: 8.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false },
  { id: 'watermelon_vine', name: 'Watermelon Vine', icon: '🍉', rarity: 'rare', affinity: 'all', cost: 2200, maxStock: 3, currentStock: 3, baseGrowTime: 55, baseSellPrice: 450, minKg: 0.1, baseMaxKg: 12.0, maxKg: 10000000, minM: 1.5, maxM: 4.5, isVine: true, produceIcon: '🍉', produceName: 'Giant Watermelon', maxFruits: 3 },
  { id: 'sunflower', name: 'Sunflower Seed', icon: '🌻', rarity: 'legendary', affinity: 'day', cost: 12000, maxStock: 3, currentStock: 3, baseGrowTime: 60, baseSellPrice: 9000, minKg: 0.1, baseMaxKg: 12.0, maxKg: 10000000, minM: 1.0, maxM: 5.0, isVine: false },
  { id: 'nectarroot', name: 'Nectar Root Seed', icon: '🌸', rarity: 'legendary', affinity: 'all', cost: 15000, maxStock: 3, currentStock: 3, baseGrowTime: 70, baseSellPrice: 11000, minKg: 0.1, baseMaxKg: 15.0, maxKg: 10000000, minM: 2.0, maxM: 6.0, isVine: false },
  { id: 'strawberry', name: 'Strawberry Seed', icon: '🍓', rarity: 'astral', affinity: 'night', cost: 75000, maxStock: 2, currentStock: 2, baseGrowTime: 90, baseSellPrice: 25000, minKg: 0.1, baseMaxKg: 20.0, maxKg: 10000000, minM: 2.5, maxM: 8.0, isVine: false },
  { id: 'cosmic_rose', name: 'Cosmic Rose Seed', icon: '🌹', rarity: 'astral', affinity: 'night', cost: 150000, maxStock: 2, currentStock: 2, baseGrowTime: 100, baseSellPrice: 45000, minKg: 0.1, baseMaxKg: 10.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false },
  { id: 'singularity', name: 'Singularity Sprout Seed', icon: '🌌', rarity: 'transcendent', affinity: 'all', cost: 2500000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 800000, minKg: 0.1, baseMaxKg: 25.0, maxKg: 10000000, minM: 3.0, maxM: 12.0, isVine: false },
  { id: 'celestial_moon', name: 'Celestial Moon Seed', icon: '🌙', rarity: 'transcendent', affinity: 'all', cost: 50000000, maxStock: 1, currentStock: 0, baseGrowTime: 150, baseSellPrice: 5000000, minKg: 0.1, baseMaxKg: 35.0, maxKg: 10000000, minM: 4.0, maxM: 15.0, isVine: true, produceIcon: '⭐', produceName: 'Celestial Star', maxFruits: 3 }
];

const EVENT_SEED_CATALOG = [
  { id: 'paintroot', name: 'Paintroot Seed', icon: '🌱', rarity: 'event', affinity: 'all', cost: 125000, maxStock: 3, currentStock: 3, baseGrowTime: 65, baseSellPrice: 65000, minKg: 0.5, baseMaxKg: 10.0, maxKg: 10000000, minM: 0.5, maxM: 2.0, isVine: false, cssClass: 'plant-paintroot', isEventSeed: true },
  { id: 'splatterbloom', name: 'Splatterbloom Seed', icon: '🌸', rarity: 'event', affinity: 'all', cost: 450000, maxStock: 2, currentStock: 2, baseGrowTime: 85, baseSellPrice: 220000, minKg: 0.8, baseMaxKg: 15.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false, cssClass: 'plant-splatterbloom', isEventSeed: true },
  { id: 'holofern', name: 'Holofern Seed', icon: '🌿', rarity: 'event', affinity: 'all', cost: 18000000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 28000000, minKg: 1.0, baseMaxKg: 20.0, maxKg: 10000000, minM: 2.0, maxM: 6.0, isVine: true, produceIcon: '🌿', produceName: 'Holofern Frond', maxFruits: 3, cssClass: 'plant-holofern', isEventSeed: true }
];

const OG_SEED_CATALOG = [
  { id: 'venturebloom', name: 'VentureBloom Seed', icon: '🌸', rarity: 'og', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 45, baseSellPrice: 42000, minKg: 0.5, baseMaxKg: 10.0, maxKg: 10000000, minM: 0.5, maxM: 2.5, isVine: false, cssClass: 'plant-venturebloom', isOG: true }
];

const FENCE_SKINS_CATALOG = [
  { id: 'twig-tangle', name: 'Twig Tangle', rarity: 'common', cost: 1500, maxStock: 1, currentStock: 1 },
  { id: 'garden-rail', name: 'Garden Rail', rarity: 'common', cost: 3500, maxStock: 1, currentStock: 1 },
  { id: 'bamboo-braid', name: 'Bamboo Braid', rarity: 'uncommon', cost: 18000, maxStock: 1, currentStock: 1 },
  { id: 'mossbound', name: 'Mossbound', rarity: 'uncommon', cost: 45000, maxStock: 1, currentStock: 1 },
  { id: 'vinebound', name: 'Vinebound', rarity: 'rare', cost: 150000, maxStock: 1, currentStock: 1 },
  { id: 'flowerwoven', name: 'Flowerwoven', rarity: 'rare', cost: 300000, maxStock: 1, currentStock: 1 },
  { id: 'paintsplashed', name: 'Paintsplashed', rarity: 'legendary', cost: 1800000, maxStock: 1, currentStock: 0 },
  { id: 'crystalwood', name: 'Crystalwood', rarity: 'legendary', cost: 4200000, maxStock: 1, currentStock: 0 },
  { id: 'stargrove', name: 'Stargrove', rarity: 'astral', cost: 28000000, maxStock: 1, currentStock: 0 },
  { id: 'moonroot', name: 'Moonroot', rarity: 'astral', cost: 65000000, maxStock: 1, currentStock: 0 },
  { id: 'holofoil-garden', name: 'Holofoil Garden', rarity: 'transcendent', cost: 250000000, maxStock: 1, currentStock: 0 },
  { id: 'prismatic-gate', name: 'Prismatic Gate', rarity: 'transcendent', cost: 750000000, maxStock: 1, currentStock: 0 }
];

function getAllGameSeeds() {
  return [...SEED_CATALOG, ...EVENT_SEED_CATALOG, ...OG_SEED_CATALOG].filter(Boolean);
}

function getRequiredCodexSeeds() {
  return [...SEED_CATALOG, ...EVENT_SEED_CATALOG].filter(Boolean);
}

function createDefaultGameState() {
  return {
    cash: 25,
    level: 1,
    xp: 0,
    rebirthLevel: 0,
    currentField: 0,
    maxFields: 5,
    unlockedFields: 1,
    selectedTool: 'plant',
    selectedSeedId: 'carrot',
    selectedVinePlotIndex: null,
    activeDrawerTab: 'seeds',
    activeShopTab: 'normal',
    activeDecorTab: 'fences',
    currentFenceSkin: 'classic',
    ownedFenceSkins: ['classic'],
    isGv1Veteran: false,
    hasOgBadge: false,
    articularSkinActive: false,
    isDay: true,
    isPrismaticRain: false,
    weatherOverride: false,
    restockLuckMultiplier: 1.0,
    cycleTimeLeft: 300,
    shopRefillTimeLeft: 180,
    bgmMuted: false,
    sfxMuted: false,
    lastDailyDealTime: 0,
    seedInventory: {
      carrot: 5, potato: 0, tomato: 0, glowshroom: 0, grape_vine: 0,
      starfruit: 0, watermelon_vine: 0, sunflower: 0, nectarroot: 0,
      strawberry: 0, cosmic_rose: 0, singularity: 0, celestial_moon: 0,
      paintroot: 0, splatterbloom: 0, holofern: 0, venturebloom: 0
    },
    produceInventory: [],
    codex: { carrot: { discovered: true, totalHarvested: 0 } },
    fields: [],
    lastShopCycle: null
  };
}

let gameState = createDefaultGameState();
let isPlaytesterMode = false;
let playtesterActionPending = null;
let isAdminAuthenticated = false;

const FIELD_LEVEL_REQS = [1, 50, 150, 300, 1000];

let currentBargainFee = 0, currentBargainBase = 0, currentBargainMultiplier = 1.0, currentBargainPayout = 0, isDailyDealActive = false;
let currentSkipTarget = null, lastSkipTime = 0, isOnline = false;
let sellQuantityState = { selectedCropGroup: null, quantityToSell: 1 };
let lastTickTime = Date.now();
let audioCtx = null, lofiTimer = null, chordIndex = 0, plotDomNodes = [];
let pendingTradeReq = null, currentTradeId = null, amIReady = false, myOfferedItems = [];

let serverTimeOffset = 0;
let timeSynced = false;

function getServerTime() {
  return Date.now() + serverTimeOffset;
}

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function el(id) {
  return document.getElementById(id);
}

function on(id, event, fn) {
  const target = document.getElementById(id);
  if (target) {
    target.addEventListener(event, fn);
  }
}

function getRebirthMultiplier() {
  let base = 1.0;
  if (gameState.rebirthLevel > 0) {
    base = 1.5 + (gameState.rebirthLevel - 1) * 1.0;
  }
  if (gameState.hasOgBadge) {
    base += 1.0;
  }
  return base;
}

function getRebirthRequirements(rank) {
  const r = rank !== undefined ? rank : gameState.rebirthLevel;
  const levelReq = 50 + r * 25;
  const cashReq = 500000000 * Math.pow(4, r);
  return { levelReq, cashReq };
}

function getGlobalShopStockForCycle(cycleId, luckMult = 1.0) {
  const rng = mulberry32(cycleId);
  const stockMap = { seeds: {}, eventSeeds: {}, fences: {} };

  SEED_CATALOG.forEach(s => {
    let baseChance = 1.0;
    if (s.rarity === 'uncommon') baseChance = 0.75;
    else if (s.rarity === 'rare') baseChance = 0.50;
    else if (s.rarity === 'legendary') baseChance = 0.05;
    else if (s.id === 'strawberry') baseChance = 0.03;
    else if (s.id === 'cosmic_rose') baseChance = 0.01;
    else if (s.id === 'singularity') baseChance = 0.003;
    else if (s.id === 'celestial_moon') baseChance = 0.001;

    let adjustedChance = Math.min(1.0, baseChance * luckMult);
    if (luckMult >= 100 && (s.id === 'singularity' || s.id === 'celestial_moon')) {
      adjustedChance = 1.0;
    }
    stockMap.seeds[s.id] = (s.rarity === 'common' || rng() < adjustedChance) ? s.maxStock : 0;
  });

  EVENT_SEED_CATALOG.forEach(s => {
    let baseChance = 0.60;
    if (s.id === 'splatterbloom') baseChance = 0.10;
    else if (s.id === 'holofern') baseChance = 0.0001;

    let adjustedChance = Math.min(1.0, baseChance * luckMult);
    if (luckMult >= 100 && s.id === 'holofern') adjustedChance = 1.0;

    stockMap.eventSeeds[s.id] = (rng() < adjustedChance) ? s.maxStock : 0;
  });

  FENCE_SKINS_CATALOG.forEach(skin => {
    let baseChance = 1.0;
    if (skin.rarity === 'uncommon') baseChance = 0.60;
    else if (skin.rarity === 'rare') baseChance = 0.25;
    else if (skin.rarity === 'legendary') baseChance = 0.05;
    else if (skin.rarity === 'astral') baseChance = 0.01;
    else if (skin.rarity === 'transcendent') baseChance = 0.001;

    let adjustedChance = Math.min(1.0, baseChance * luckMult);
    if (luckMult >= 100 && skin.rarity === 'transcendent') adjustedChance = 1.0;

    stockMap.fences[skin.id] = (skin.rarity === 'common' || rng() < adjustedChance) ? 1 : 0;
  });

  return stockMap;
}

function updateShopForCurrentCycle(silent = false) {
  const now = getServerTime();
  const CYCLE_3MIN = 180000;
  const cycleId = Math.floor(now / CYCLE_3MIN);
  
  if (gameState.lastShopCycle !== cycleId) {
    const isFirstLoad = (gameState.lastShopCycle === null);
    gameState.lastShopCycle = cycleId;
    
    const stockMap = getGlobalShopStockForCycle(cycleId, gameState.restockLuckMultiplier || 1.0);
    
    SEED_CATALOG.forEach(s => {
      if (stockMap.seeds[s.id] !== undefined) s.currentStock = stockMap.seeds[s.id];
    });

    EVENT_SEED_CATALOG.forEach(s => {
      if (stockMap.eventSeeds[s.id] !== undefined) s.currentStock = stockMap.eventSeeds[s.id];
    });

    FENCE_SKINS_CATALOG.forEach(skin => {
      if (stockMap.fences[skin.id] !== undefined) skin.currentStock = stockMap.fences[skin.id];
    });
    
    const sModal = el('shop-modal');
    const dModal = el('decor-modal');
    if (sModal && !sModal.classList.contains('hidden')) renderShopItems();
    if (dModal && !dModal.classList.contains('hidden')) renderDecorShop();
    
    if (!isFirstLoad && !silent) {
      showToast("🛒 Market Restocked!");
    }
  }
}

const dayChords = [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 349.23]];
const nightChords = [[261.63, 329.63, 392.00, 493.88, 587.33], [220.00, 261.63, 329.63, 392.00], [146.83, 220.00, 261.63, 349.23, 440.00], [174.61, 207.65, 261.63, 311.13, 392.00]];

function showToast(msg) {
  const toastContainer = el('toast-container');
  if (!toastContainer) return;
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => { t.remove(); }, 3500);
}

function openModal(m) {
  if (!m) return;
  m.classList.remove('hidden');
  void m.offsetWidth;
  m.classList.add('open');
}

function closeModal(m) {
  if (!m) return;
  m.classList.remove('open');
  setTimeout(() => {
    if (!m.classList.contains('open')) m.classList.add('hidden');
  }, 160);
}

function toggleDrawer(d) {
  if (!d) return;
  if (d.classList.contains('open')) closeDrawer(d);
  else openDrawer(d);
}

function openDrawer(d) {
  if (!d) return;
  d.classList.remove('hidden');
  void d.offsetWidth;
  d.classList.add('open');
  renderSeedDrawer();
}

function closeDrawer(d) {
  if (!d) return;
  d.classList.remove('open');
  setTimeout(() => {
    if (!d.classList.contains('open')) d.classList.add('hidden');
  }, 180);
}

function createFloatingText(x, y, text, color) {
  const particlesLayer = el('particles-layer');
  if (!particlesLayer) return;
  const elem = document.createElement('div');
  elem.className = 'floating-text';
  elem.textContent = text;
  elem.style.left = `${x - 20}px`;
  elem.style.top = `${y - 20}px`;
  if (color) elem.style.color = color;
  particlesLayer.appendChild(elem);
  setTimeout(() => { elem.remove(); }, 900);
}

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSFX(type) {
  if (gameState.sfxMuted) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    if (type === 'plant') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'harvest') {
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.04);
        gain.gain.setValueAtTime(0.12, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.22);
      });
    } else if (type === 'sell') {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now);
      osc2.frequency.setValueAtTime(1318.51, now + 0.06);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      osc1.start(now);
      osc2.start(now + 0.06);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } else if (type === 'shovel') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'levelup' || type === 'rebirth') {
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } else if (type === 'mutate') {
      [587.33, 880.00, 1174.66, 1760.00].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.14, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.3);
      });
    }
  } catch (e) {}
}

function playNextLofiChord() {
  if (gameState.bgmMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const chordSet = gameState.isDay ? dayChords : nightChords;
    const chord = chordSet[chordIndex % chordSet.length];
    chordIndex = (chordIndex + 1) % chordSet.length;
    
    chord.forEach(f => {
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(gameState.isDay ? 550 : 380, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gameState.isDay ? 0.035 : 0.025, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (gameState.isDay ? 3.2 : 4.5));
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + (gameState.isDay ? 3.2 : 4.5));
    });
  } catch (e) {}
}

function getGrowthMultiplier(crop) {
  if (!crop) return 1.0;
  if (gameState.isPrismaticRain) return 2.5;
  if (crop.affinity === 'night' && !gameState.isDay) return 2.0;
  if (crop.affinity === 'day' && gameState.isDay) return 2.0;
  return 1.0;
}

function getRequiredXP(level) {
  return Math.floor(100 * Math.pow(level, 1.15));
}

function addXP(amount) {
  gameState.xp += amount;
  let req = getRequiredXP(gameState.level);
  let leveledUp = false;
  
  while (gameState.xp >= req) {
    gameState.xp -= req;
    gameState.level++;
    req = getRequiredXP(gameState.level);
    leveledUp = true;
  }
  
  if (leveledUp) {
    playSFX('levelup');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 50, `LEVEL UP! -> ${gameState.level} 🌟`, "#ffe082");
    showToast(`🌟 Level Up! You are now Level ${gameState.level}!`);
    if (isOnline && !isPlaytesterMode && db) db.ref('players/' + myPlayerId).update({ level: gameState.level });
  }
  updateHUD();
}

function formatCash(num) {
  if (!num || isNaN(num)) return '$0';
  const v = Number(num);
  if (v >= 1e12) return '$' + (v / 1e12).toFixed(2) + 'T';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'k';
  return '$' + Math.floor(v).toLocaleString();
}

function formatKg(kg) {
  if (!kg || isNaN(kg)) return '0.0 kg';
  const v = Number(kg);
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B kg';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M kg';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'k kg';
  return v.toFixed(1) + ' kg';
}

function formatMeters(m) {
  if (!m || isNaN(m)) return '0.0m';
  const v = Number(m);
  if (v >= 1000) return (v / 1000).toFixed(1) + 'km';
  return v.toFixed(1) + 'm';
}

function formatTime(s) {
  if (isNaN(s) || s <= 0) return '0s';
  s = Math.floor(s);
  const mins = Math.floor(s / 60);
  const hours = Math.floor(s / 3600);
  const days = Math.floor(s / 86400);

  if (days > 0) {
    const remHours = Math.floor((s % 86400) / 3600);
    return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
  }
  if (hours > 0) {
    const remMins = Math.floor((s % 3600) / 60);
    return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
  }
  if (mins > 0) {
    const remSecs = s % 60;
    return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins}m`;
  }
  return `${s}s`;
}

function calculateProduceEarnings(base, rKg, minKg, isVine = false, isHolo = false) {
  const sKg = rKg || minKg || 0.1;
  let m = 1 + (sKg / (minKg || 0.1)) * 0.25;
  if (isVine) m *= 0.3;
  let total = Math.round((base || 10) * m);
  if (isHolo) total = Math.round(total * 4.0);
  return total;
}

function rollCropWeight(s) {
  const minK = Number(s.minKg) || 0.1;
  const bMaxK = Number(s.baseMaxKg) || 2.5;
  const maxK = Number(s.maxKg) || 10000000;
  const r = Math.random();
  let jM = 1.0;
  
  if (r >= 0.995) jM = 2000 + Math.pow((r - 0.995) / 0.005, 3) * 3998000;
  else if (r >= 0.97) jM = 40 + Math.pow((r - 0.97) / 0.025, 2) * 1960;
  else if (r >= 0.88) jM = 2 + Math.pow((r - 0.88) / 0.09, 1.8) * 38;
  else jM = 1.0 + Math.pow(r / 0.88, 2) * 1.0;
  
  const bKg = minK + Math.pow(Math.random(), 1.8) * (bMaxK - minK);
  const rKg = Math.min(maxK, bKg * jM);
  const bM = (Number(s.minM) || 0.2) + Math.random() * ((Number(s.maxM) || 0.8) - (Number(s.minM) || 0.2));
  
  let finalMeters = bM;
  if (jM > 1) finalMeters = bM * Math.min(15, Math.pow(jM, 0.25));
  
  return { rolledKg: rKg, rolledMeters: finalMeters };
}

function rollFruitStats(c) {
  const r = rollCropWeight(c);
  let finalTime = c.baseGrowTime * (1 + (r.rolledKg / (c.baseMaxKg || 2.5)) * 0.05);
  finalTime = Math.max(10, Math.round(finalTime));
  return { fruitKg: r.rolledKg, fruitGrowTime: finalTime };
}

function checkCodexCompletion() {
  const requiredSeeds = getRequiredCodexSeeds();
  let discoveredCount = 0;
  
  requiredSeeds.forEach(s => {
    if (gameState.codex[s.id] && gameState.codex[s.id].discovered) discoveredCount++;
  });
  
  if (discoveredCount >= requiredSeeds.length && !gameState.articularSkinActive) {
    gameState.articularSkinActive = true;
    updateFenceSkin();
    playSFX('harvest');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "🏆 CODEX COMPLETE! ARTISTIC PROMISE UNLOCKED! ✨", "#00e5ff");
    showToast("🏆 100% Codex Master! Artistic Promise Fence Skin Unlocked!");
  }
}

function getGroupedProduce() {
  const g = {};
  (gameState.produceInventory || []).forEach(i => {
    if (!i || !i.name) return;
    const key = (i.isHolo ? `${i.name} (Holo)` : i.name) + (i.isOG ? ' (OG)' : '');
    if (!g[key]) {
      g[key] = { name: i.name, icon: i.icon || '🌱', isHolo: !!i.isHolo, isOG: !!i.isOG, seedId: i.seedId, items: [] };
    }
    g[key].items.push(i);
  });
  return Object.values(g);
}

function calculateCashYield(itemsArray) {
  let subtotal = 0;
  let hasOGSold = false;
  
  (itemsArray || []).forEach(item => {
    if (!item) return;
    subtotal += (item.value || 0);
    if (item.seedId === 'venturebloom' || item.isOG) {
      hasOGSold = true;
    }
  });

  if (hasOGSold && !gameState.hasOgBadge) {
    gameState.hasOgBadge = true;
    showToast("🏆 OG BADGE UNLOCKED! Permanent 1.0× Cash Boost Added!");
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 40, "🏆 OG BADGE EARNED!", "#ffd700");
    playSFX('mutate');
  }

  const mult = getRebirthMultiplier();
  return Math.round(subtotal * mult);
}

function spawnPrismaticGlobs() {
  const prismaticGlobsLayer = el('prismatic-globs-layer');
  if (!prismaticGlobsLayer) return;
  prismaticGlobsLayer.innerHTML = '';
  prismaticGlobsLayer.classList.remove('hidden');

  const globPositions = [
    { top: '18%', left: '8%', size: 38 },
    { top: '24%', left: '22%', size: 28 },
    { top: '15%', left: '38%', size: 44 },
    { top: '28%', left: '48%', size: 32 },
    { top: '16%', left: '68%', size: 40 },
    { top: '26%', left: '82%', size: 34 },
    { top: '38%', left: '6%', size: 30 },
    { top: '44%', left: '90%', size: 36 },
    { top: '65%', left: '4%', size: 42 },
    { top: '72%', left: '92%', size: 38 },
    { top: '80%', left: '14%', size: 32 },
    { top: '82%', left: '84%', size: 46 }
  ];

  globPositions.forEach((g, idx) => {
    const glob = document.createElement('div');
    glob.className = 'prismatic-glob';
    glob.style.top = g.top;
    glob.style.left = g.left;
    glob.style.width = `${g.size}px`;
    glob.style.height = `${g.size * 0.8}px`;
    glob.style.animationDelay = `${idx * 0.25}s`;

    const sheen = document.createElement('div');
    sheen.className = 'glob-sheen';
    glob.appendChild(sheen);

    prismaticGlobsLayer.appendChild(glob);
  });
}

function clearPrismaticGlobs() {
  const prismaticGlobsLayer = el('prismatic-globs-layer');
  if (!prismaticGlobsLayer) return;
  prismaticGlobsLayer.innerHTML = '';
  prismaticGlobsLayer.classList.add('hidden');
}

function renderRebirthModal() {
  const reqs = getRebirthRequirements();
  const currentMult = getRebirthMultiplier();
  const nextRank = gameState.rebirthLevel + 1;
  const nextBaseMult = 1.5 + (nextRank - 1) * 1.0;
  const nextTotalMult = gameState.hasOgBadge ? (nextBaseMult + 1.0) : nextBaseMult;

  const rebirthRankDisplay = el('rebirth-rank-display');
  const rebirthMultDisplay = el('rebirth-mult-display');
  const rebirthReqLevel = el('rebirth-req-level');
  const rebirthReqCash = el('rebirth-req-cash');
  const rebirthLevelBar = el('rebirth-level-bar');
  const rebirthCashBar = el('rebirth-cash-bar');
  const btnDoRebirth = el('btn-do-rebirth');
  const rebirthBtnSub = el('rebirth-btn-sub');

  if (rebirthRankDisplay) rebirthRankDisplay.textContent = `Rank ${gameState.rebirthLevel}`;
  if (rebirthMultDisplay) rebirthMultDisplay.textContent = `${currentMult.toFixed(1)}×`;
  if (rebirthReqLevel) rebirthReqLevel.textContent = `Level ${reqs.levelReq}`;
  if (rebirthReqCash) rebirthReqCash.textContent = formatCash(reqs.cashReq);

  const levelPct = Math.min(100, Math.floor((gameState.level / reqs.levelReq) * 100));
  const cashPct = Math.min(100, Math.floor((gameState.cash / reqs.cashReq) * 100));

  if (rebirthLevelBar) rebirthLevelBar.style.width = `${levelPct}%`;
  if (rebirthCashBar) rebirthCashBar.style.width = `${cashPct}%`;

  const canRebirth = gameState.level >= reqs.levelReq && gameState.cash >= reqs.cashReq;
  if (btnDoRebirth) {
    btnDoRebirth.disabled = !canRebirth;
    const titleEl = btnDoRebirth.querySelector('.rebirth-btn-title');
    if (titleEl) titleEl.textContent = `♻️ ASCEND TO REBIRTH ${nextRank}`;
  }
  if (rebirthBtnSub) {
    rebirthBtnSub.textContent = canRebirth ? `Click to Ascend! (${nextTotalMult.toFixed(1)}× Cash Multiplier)` : `Requirements: ${levelPct}% Level • ${cashPct}% Cash`;
  }
}

function updateFenceSkin() {
  const fenceStructure = el('fence-structure');
  if (!fenceStructure) return;
  fenceStructure.className = 'wooden-fence-structure';
  
  if (gameState.articularSkinActive) {
    fenceStructure.classList.add('fence-skin-articular');
  } else if (gameState.currentFenceSkin && gameState.currentFenceSkin !== 'classic') {
    fenceStructure.classList.add(`fence-skin-${gameState.currentFenceSkin}`);
  }
}

function renderDecorShop() {
  const fenceSkinsList = el('fence-skins-list');
  if (!fenceSkinsList) return;
  fenceSkinsList.innerHTML = '';
  
  FENCE_SKINS_CATALOG.forEach(skin => {
    const isOwned = gameState.ownedFenceSkins.includes(skin.id);
    const isEquipped = (gameState.currentFenceSkin === skin.id && !gameState.articularSkinActive);
    const isStocked = skin.currentStock > 0;
    const canAfford = (gameState.cash >= skin.cost);
    
    const card = document.createElement('div');
    card.className = 'fence-skin-card';
    
    let btnText = 'Buy';
    let btnClass = 'btn-buy';
    
    if (isEquipped) {
      btnText = 'Equipped ✨';
      btnClass = 'btn-buy stocked';
    } else if (isOwned) {
      btnText = 'Equip';
      btnClass = 'btn-buy';
    } else if (!isStocked) {
      btnText = 'Out of Stock';
      btnClass = 'btn-buy stocked';
    } else if (!canAfford) {
      btnClass = 'btn-buy unaffordable';
    }
    
    card.innerHTML = `
      <div class="fence-preview-box fence-skin-${skin.id}">
        <div class="fence-post" style="width:20px; height:20px; left:4px; top:4px;"></div>
        <div class="fence-rail" style="left:26px; right:26px; top:10px; height:8px;"></div>
        <div class="fence-post" style="width:20px; height:20px; right:4px; top:4px;"></div>
      </div>
      <div class="item-info">
        <div class="item-title">${skin.name}</div>
        <span class="rarity-tag rarity-${skin.rarity}">${skin.rarity}</span>
        <div class="item-price-stock">${isOwned ? 'Owned' : `${formatCash(skin.cost)} | Stock: ${skin.currentStock}`}</div>
      </div>
      <button class="${btnClass}" ${((!isOwned && (!canAfford || !isStocked)) || isEquipped) ? 'disabled' : ''}>${btnText}</button>
    `;
    
    card.querySelector('button').addEventListener('click', () => {
      if (isEquipped) return;
      if (isOwned) {
        gameState.currentFenceSkin = skin.id;
        gameState.articularSkinActive = false;
        updateFenceSkin();
        renderDecorShop();
        showToast(`🪵 Equipped ${skin.name}!`);
        saveGame();
      } else if (canAfford && isStocked) {
        gameState.cash -= skin.cost;
        skin.currentStock--;
        gameState.ownedFenceSkins.push(skin.id);
        gameState.currentFenceSkin = skin.id;
        gameState.articularSkinActive = false;
        playSFX('sell');
        updateHUD();
        updateFenceSkin();
        renderDecorShop();
        showToast(`🪵 Purchased & Equipped ${skin.name}!`);
        saveGame();
      }
    });
    
    fenceSkinsList.appendChild(card);
  });
}

function renderIndexCodex() {
  const indexItemsList = el('index-items-list');
  if (!indexItemsList) return;
  indexItemsList.innerHTML = '';
  const requiredSeeds = getRequiredCodexSeeds();
  let discoveredCount = 0;
  
  requiredSeeds.forEach(s => {
    if (!s) return;
    const isDiscovered = !!(gameState.codex && gameState.codex[s.id] && gameState.codex[s.id].discovered);
    if (isDiscovered) discoveredCount++;

    const c = document.createElement('div');
    c.className = `codex-card-item ${isDiscovered ? 'discovered' : 'locked'}`;
    c.innerHTML = `
      <div style="font-size: 30px;">${isDiscovered ? (s.icon || '🌱') : '❓'}</div>
      <div style="font-size: 12px; font-weight: 800; color: #2c1a14;">${isDiscovered ? s.name : 'Unknown Plant'}</div>
      <span class="rarity-tag rarity-${s.rarity || 'common'}">${s.rarity || 'common'}</span>
      <div style="font-size: 10px; color: #5d4037; font-weight: 800; margin-top: 2px;">${isDiscovered ? 'Discovered ✨' : 'Locked'}</div>
    `;
    indexItemsList.appendChild(c);
  });

  const codexProgressFill = el('codex-progress-fill');
  const codexProgressText = el('codex-progress-text');
  if (codexProgressFill && codexProgressText) {
    const pct = Math.round((discoveredCount / requiredSeeds.length) * 100);
    codexProgressFill.style.width = `${pct}%`;
    codexProgressText.textContent = `${discoveredCount} / ${requiredSeeds.length} Discovered (${pct}%)`;
  }
}

function updateHUD() {
  const cashEl = el('cash-amount');
  const fieldTitle = el('field-title');
  const levelDisplay = el('level-display');
  const ogBadgeHud = el('og-badge-hud');
  const rebirthBadgeHud = el('rebirth-badge-hud');
  const rebirthLevelHud = el('rebirth-level-hud');
  const rebirthMultHud = el('rebirth-mult-hud');
  const playtesterBadgeHud = el('playtester-badge-hud');
  const shovelBtn = el('shovel-btn');
  const currentSeedNameEl = el('current-seed-name');
  const cycleTimer = el('cycle-timer');
  const adminWeatherTag = el('admin-weather-tag');
  const cycleLabel = el('cycle-label');
  const cycleIcon = el('cycle-icon');
  const holoRaindropIcon = el('holo-raindrop-icon');
  const prismaticRainLayer = el('prismatic-rain-layer');
  const splashBadge = el('player-id-splash');
  const hudBadge = el('player-id-hud');

  if (splashBadge) splashBadge.textContent = `ID: ${myPlayerId}`;
  if (hudBadge) hudBadge.textContent = `ID: ${myPlayerId}`;

  if (cashEl) cashEl.textContent = formatCash(gameState.cash);
  if (fieldTitle) fieldTitle.textContent = `Field ${gameState.currentField + 1} / ${gameState.maxFields}`;
  if (levelDisplay) levelDisplay.textContent = `🌟 Level ${gameState.level} (${Math.floor(gameState.xp)} / ${getRequiredXP(gameState.level)} XP)`;
  
  if (ogBadgeHud) {
    ogBadgeHud.classList.toggle('hidden', !gameState.hasOgBadge);
  }

  if (rebirthBadgeHud) {
    const mult = getRebirthMultiplier();
    rebirthBadgeHud.classList.toggle('hidden', gameState.rebirthLevel === 0 && !gameState.hasOgBadge);
    if (rebirthLevelHud) rebirthLevelHud.textContent = gameState.rebirthLevel;
    if (rebirthMultHud) rebirthMultHud.textContent = `${mult.toFixed(1)}×`;
  }

  if (playtesterBadgeHud) {
    playtesterBadgeHud.classList.toggle('hidden', !isPlaytesterMode);
  }

  if (shovelBtn && currentSeedNameEl) {
    if (gameState.selectedTool === 'shovel') {
      shovelBtn.classList.add('tool-active');
      currentSeedNameEl.textContent = "Tool Active: ⛏️ Shovel";
    } else {
      shovelBtn.classList.remove('tool-active');
      const allSeeds = getAllGameSeeds();
      const act = allSeeds.find(s => s && s.id === gameState.selectedSeedId) || allSeeds[0];
      if (act) {
        currentSeedNameEl.textContent = `Plant ${act.name} (x${gameState.seedInventory[act.id] || 0}) [Bag: ${gameState.produceInventory.length}]`;
      }
    }
  }
  
  if (cycleTimer) cycleTimer.textContent = formatTime(gameState.cycleTimeLeft);

  if (adminWeatherTag) {
    adminWeatherTag.classList.toggle('hidden', !gameState.weatherOverride);
  }

  if (cycleLabel && cycleIcon) {
    if (gameState.isPrismaticRain) {
      cycleLabel.textContent = 'PRISMATIC PAINT RAIN';
      cycleIcon.style.display = 'none';
      if (holoRaindropIcon) holoRaindropIcon.classList.remove('hidden');
      document.body.className = 'prismatic-rain-theme';
      if (prismaticRainLayer) prismaticRainLayer.classList.remove('hidden');
    } else {
      cycleIcon.style.display = 'inline-block';
      if (holoRaindropIcon) holoRaindropIcon.classList.add('hidden');
      if (prismaticRainLayer) prismaticRainLayer.classList.add('hidden');
      cycleIcon.textContent = gameState.isDay ? '☀️' : '🌙';
      cycleLabel.textContent = gameState.isDay ? 'Day Time' : 'Night Time';
      document.body.className = gameState.isDay ? 'day-theme' : 'night-theme';
    }
  }
}

function renderShopItems() {
  const shopItemsList = el('shop-items-list');
  const eventShopItemsList = el('event-shop-items-list');
  const shopTabEvent = el('shop-tab-event');
  const eventShopBanner = el('event-shop-banner');
  const shopTabNormal = el('shop-tab-normal');
  if (!shopItemsList || !eventShopItemsList) return;

  shopItemsList.innerHTML = '';
  eventShopItemsList.innerHTML = '';

  if (shopTabEvent) shopTabEvent.classList.toggle('hidden', !gameState.isPrismaticRain);
  if (eventShopBanner) eventShopBanner.classList.toggle('hidden', !gameState.isPrismaticRain);

  if (!gameState.isPrismaticRain && gameState.activeShopTab === 'event') {
    gameState.activeShopTab = 'normal';
    if (shopTabNormal) shopTabNormal.classList.add('active');
    if (shopTabEvent) shopTabEvent.classList.remove('active');
  }

  const isEventTab = (gameState.activeShopTab === 'event' && gameState.isPrismaticRain);

  if (isEventTab) {
    shopItemsList.classList.add('hidden');
    eventShopItemsList.classList.remove('hidden');
  } else {
    shopItemsList.classList.remove('hidden');
    eventShopItemsList.classList.add('hidden');
  }

  const targetCatalog = isEventTab ? EVENT_SEED_CATALOG : SEED_CATALOG;
  const targetContainer = isEventTab ? eventShopItemsList : shopItemsList;

  targetCatalog.forEach(s => {
    const aff = gameState.cash >= s.cost;
    const stk = s.currentStock > 0;
    const own = gameState.seedInventory[s.id] || 0;
    
    const c = document.createElement('div');
    c.className = `shop-item-card ${s.isEventSeed ? 'event-shop-card' : ''}`;
    
    let btnClass = 'btn-buy';
    let btnText = 'Buy';
    
    if (!stk) {
      btnClass = 'btn-buy stocked';
      btnText = 'Out of Stock';
    } else if (!aff) {
      btnClass = 'btn-buy unaffordable';
    }
    
    let badgeHtml = s.isVine ? '<span class="permanent-red-p-badge">P</span>' : '';
    
    c.innerHTML = `
      <div class="item-info">
        <div class="item-title">${s.icon} ${s.name} ${badgeHtml}</div>
        <div><span class="rarity-tag rarity-${s.rarity}">${s.rarity}</span></div>
        <div class="item-price-stock">${formatCash(s.cost)} | Stock: ${s.currentStock} (Owned: ${own})</div>
      </div>
      <button class="${btnClass}" ${(!aff || !stk) ? 'disabled' : ''}>${btnText}</button>
    `;
    
    const pb = c.querySelector('.permanent-red-p-badge');
    if (pb) {
      pb.addEventListener('click', e => {
        e.stopPropagation();
        openModal(el('permanent-info-modal'));
      });
    }
    
    if (aff && stk) {
      c.querySelector('.btn-buy').addEventListener('click', () => {
        gameState.cash -= s.cost;
        gameState.seedInventory[s.id]++;
        s.currentStock--;
        playSFX('sell');
        updateHUD();
        renderShopItems();
        saveGame();
      });
    }
    targetContainer.appendChild(c);
  });
}

function renderSeedDrawer() {
  const tabSeedsBtn = el('tab-seeds-btn');
  const tabProduceBtn = el('tab-produce-btn');
  const seedInventoryList = el('seed-inventory-list');
  const produceInventoryList = el('produce-inventory-list');
  if (!tabSeedsBtn || !tabProduceBtn || !seedInventoryList || !produceInventoryList) return;

  tabSeedsBtn.classList.toggle('active', gameState.activeDrawerTab === 'seeds');
  tabProduceBtn.classList.toggle('active', gameState.activeDrawerTab === 'produce');
  
  if (gameState.activeDrawerTab === 'seeds') {
    seedInventoryList.classList.remove('hidden');
    produceInventoryList.classList.add('hidden');
    seedInventoryList.innerHTML = '';
    
    const allSeeds = getAllGameSeeds();
    allSeeds.forEach(s => {
      if (!s) return;
      let isActive = (gameState.selectedSeedId === s.id && gameState.selectedTool === 'plant');
      
      const c = document.createElement('div');
      c.className = `seed-select-card ${isActive ? 'active' : ''}`;
      c.innerHTML = `
        <div style="font-size: 22px;">${s.icon}</div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-size:12px; font-weight:800;">${s.name}</span>
          <span style="font-size:10px; color:#5d4037;">Qty: ${gameState.seedInventory[s.id] || 0}</span>
        </div>
      `;
      
      c.addEventListener('click', () => {
        gameState.selectedSeedId = s.id;
        gameState.selectedTool = 'plant';
        closeDrawer(el('seed-bag-drawer'));
        updateHUD();
      });
      
      seedInventoryList.appendChild(c);
    });
  } else {
    seedInventoryList.classList.add('hidden');
    produceInventoryList.classList.remove('hidden');
    produceInventoryList.innerHTML = '';
    
    if (gameState.produceInventory.length === 0) {
      produceInventoryList.innerHTML = `<p style="text-align:center; color:#6d4c41; font-weight:800; padding:20px;">🧺 Bag is empty!</p>`;
      return;
    }
    
    gameState.produceInventory.forEach(i => {
      if (!i) return;
      const c = document.createElement('div');
      c.className = 'produce-item-card';
      const holoTag = i.isHolo ? ' <span class="holo-badge-tag">✨ HOLOGRAPHIC (4X)</span>' : '';
      const ogTag = i.isOG ? ' <span class="rarity-tag rarity-og">🏆 OG CROP</span>' : '';
      c.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; width:100%;">
          <div style="font-size:26px;">${i.icon || '🌱'}</div>
          <div style="display:flex; flex-direction:column; flex:1;">
            <span style="font-size:13px; font-weight:900; color:#2c1a14;">${i.name || 'Crop'}${holoTag}${ogTag}</span>
            <span style="font-size:11px; color:#2e7d32; font-weight:800;">Weight: ${formatKg(i.kg)} | Value: ${formatCash(i.value)}</span>
          </div>
        </div>
      `;
      produceInventoryList.appendChild(c);
    });
  }
}

function spawnHoloRaindrops() {
  const prismaticRainLayer = el('prismatic-rain-layer');
  if (!prismaticRainLayer) return;
  prismaticRainLayer.innerHTML = '';
  
  for (let i = 0; i < 35; i++) {
    const drop = document.createElement('div');
    drop.className = 'holo-rain-drop';
    drop.style.left = `${Math.random() * 110 - 5}%`;
    drop.style.animationDuration = `${(0.35 + Math.random() * 0.45).toFixed(2)}s`;
    drop.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
    prismaticRainLayer.appendChild(drop);
  }
}

function checkHolographicRainMutations() {
  if (!gameState.isPrismaticRain) return;

  const currentFieldPlots = gameState.fields[gameState.currentField] || [];
  currentFieldPlots.forEach((plot, i) => {
    if (plot.crop && !plot.crop.isEventSeed && !plot.isHoloMutated) {
      if (Math.random() < 0.05) {
        plot.isHoloMutated = true;
        playSFX('mutate');
        
        const n = plotDomNodes[i];
        if (n) {
          const rect = n.plotEl.getBoundingClientRect();
          createFloatingText(rect.left + rect.width / 2, rect.top, "✨ HOLOGRAPHIC MUTATION! ✨", "#00e5ff");
        }
        showToast(`✨ A plant caught the rain and mutated into Holographic! (4X Value)`);
      }
    }
  });
}

function initFields() {
  gameState.fields = [];
  for (let f = 0; f < gameState.maxFields; f++) {
    const p = [];
    for (let i = 0; i < 9; i++) {
      p.push({
        crop: null,
        progress: 0,
        isReady: false,
        vineEstablished: false,
        rolledKg: 0,
        rolledMeters: 0,
        actualGrowTime: 5,
        vineFruits: [],
        isHoloMutated: false
      });
    }
    gameState.fields.push(p);
  }
}

function buildPlotDOMStructure() {
  const plotsGrid = el('plots-grid');
  if (!plotsGrid) return;
  plotsGrid.innerHTML = '';
  plotDomNodes = [];
  
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('div');
    p.className = 'plot';
    
    const tb = document.createElement('div');
    tb.className = 'crop-timer-badge';
    tb.style.display = 'none';
    
    const gb = document.createElement('div');
    gb.className = 'growth-bar';
    gb.style.display = 'none';
    
    const gp = document.createElement('div');
    gp.className = 'growth-progress';
    gb.appendChild(gp);
    
    const cc = document.createElement('div');
    cc.className = 'crop-container';
    cc.style.display = 'none';
    
    const ci = document.createElement('div');
    ci.className = 'crop-icon';
    cc.appendChild(ci);
    
    const dbEl = document.createElement('div');
    dbEl.className = 'dirt-bed';
    
    p.appendChild(tb);
    p.appendChild(gb);
    p.appendChild(cc);
    p.appendChild(dbEl);
    
    p.addEventListener('click', (event) => handlePlotClick(i, event));
    plotsGrid.appendChild(p);
    
    plotDomNodes.push({
      plotEl: p,
      cropTimerBadge: tb,
      growthBar: gb,
      progress: gp,
      cropContainer: cc,
      cropIcon: ci
    });
  }
}

function renderPlots() {
  const fieldLockedOverlay = el('field-locked-overlay');
  const lockedFieldTitle = el('locked-field-title');
  const lockedFieldReq = el('locked-field-req');
  const btnUnlockField = el('btn-unlock-field');

  if (fieldLockedOverlay && lockedFieldTitle && lockedFieldReq && btnUnlockField) {
    if (gameState.currentField >= gameState.unlockedFields) {
      fieldLockedOverlay.classList.remove('hidden');
      lockedFieldTitle.textContent = `Field ${gameState.currentField + 1} Locked`;
      const req = FIELD_LEVEL_REQS[gameState.currentField];
      lockedFieldReq.textContent = `Reach Level ${req} to unlock!`;
      btnUnlockField.textContent = gameState.level >= req ? `Unlock Field!` : `Level ${req} Required`;
      btnUnlockField.disabled = gameState.level < req;
    } else {
      fieldLockedOverlay.classList.add('hidden');
    }
  }
  
  const cP = gameState.fields[gameState.currentField] || [];
  cP.forEach((plot, i) => {
    const n = plotDomNodes[i];
    if (!n) return;
    
    n.plotEl.classList.toggle('ready', plot.isReady || (plot.crop && plot.crop.isVine && plot.vineEstablished));
    n.plotEl.classList.toggle('vine-plot', !!(plot.crop && plot.crop.isVine));
    n.plotEl.classList.toggle('cloud-piercer', (plot.rolledMeters || 0) > 20);
    n.plotEl.classList.toggle('nocturnal-active', !!(plot.crop && plot.crop.affinity === 'night' && !gameState.isDay && !gameState.isPrismaticRain));
    n.plotEl.classList.toggle('cosmic-rose-active', !!(plot.crop && plot.crop.id === 'cosmic_rose'));
    
    if (plot.crop) {
      n.cropContainer.style.display = 'flex';
      const tM = plot.rolledMeters || 1;
      const tKg = plot.rolledKg || plot.crop.minKg || 0.1;
      const cKg = (plot.progress / 100) * tKg;
      const cM = (plot.progress / 100) * tM;
      const maxS = Math.min(2.5, 0.8 + Math.log10(tKg + 1) * 0.35);
      const sF = 0.4 + (plot.progress / 100) * (maxS - 0.4);
      
      n.cropIcon.style.setProperty('--crop-scale', sF);
      n.cropIcon.textContent = plot.progress < 35 ? '🌱' : (plot.crop.icon || '🌱');
      n.cropIcon.className = `crop-icon ${plot.crop.cssClass || ''} ${plot.isHoloMutated ? 'is-holo-mutated' : ''} ${plot.isReady || plot.vineEstablished ? 'mature' : ''}`;
      n.cropTimerBadge.style.display = 'flex';
      
      let spB = '';
      if (gameState.isPrismaticRain) spB = '🌧️2.5X ';
      else if (plot.crop.affinity === 'night' && !gameState.isDay) spB = '⚡2X ';
      else if (plot.crop.affinity === 'day' && gameState.isDay) spB = '☀️2X ';
      if (plot.isHoloMutated) spB += '✨HOLO ';
      
      if (plot.crop.isVine) {
        if (!plot.vineEstablished) {
          const sM = getGrowthMultiplier(plot.crop);
          const rS = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 10)) * sM)));
          n.cropTimerBadge.textContent = `🌱 ${formatMeters(cM)} | ${spB}${formatTime(rS)}`;
          n.cropTimerBadge.classList.remove('ready-badge');
          n.growthBar.style.display = 'block';
          n.progress.style.width = `${Math.min(100, plot.progress)}%`;
        } else {
          const rF = (plot.vineFruits || []).filter(f => f.isReady).length;
          n.cropTimerBadge.textContent = `${plot.crop.produceIcon || '🍇'} ${rF}/${(plot.vineFruits || []).length} Ready | ${formatMeters(tM)}`;
          n.cropTimerBadge.classList.toggle('ready-badge', rF > 0);
          n.growthBar.style.display = 'none';
        }
      } else if (!plot.isReady) {
        const sM = getGrowthMultiplier(plot.crop);
        const rS = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 5)) * sM)));
        n.cropTimerBadge.textContent = `🌱 ${formatKg(cKg)} | ${spB}${formatTime(rS)}`;
        n.cropTimerBadge.classList.remove('ready-badge');
        n.growthBar.style.display = 'block';
        n.progress.style.width = `${Math.min(100, plot.progress)}%`;
      } else {
        n.cropTimerBadge.textContent = `READY! ${formatKg(tKg)} ${plot.isHoloMutated ? '✨' : ''}`;
        n.cropTimerBadge.classList.add('ready-badge');
        n.growthBar.style.display = 'none';
      }
    } else {
      n.cropContainer.style.display = 'none';
      n.growthBar.style.display = 'none';
      n.cropTimerBadge.style.display = 'none';
    }
  });
}

function handlePlotClick(pI, e) {
  if (gameState.currentField >= gameState.unlockedFields) return;
  const p = gameState.fields[gameState.currentField][pI];
  const x = e ? e.clientX : window.innerWidth / 2;
  const y = e ? e.clientY : window.innerHeight / 2;
  
  if (gameState.selectedTool === 'shovel') {
    if (p.crop) {
      p.crop = null;
      p.progress = 0;
      p.isReady = false;
      p.vineEstablished = false;
      p.vineFruits = [];
      p.isHoloMutated = false;
      playSFX('shovel');
      createFloatingText(x, y, "Removed ⛏️", "#ff8a80");
      renderPlots();
      saveGame();
    }
    return;
  }
  
  if (p.crop && p.crop.isVine && !p.vineEstablished) {
    openSkipModal(pI);
    return;
  }
  if (p.crop && p.crop.isVine && p.vineEstablished) {
    gameState.selectedVinePlotIndex = pI;
    openVineModal();
    return;
  }
  if (p.crop && !p.isReady) {
    openSkipModal(pI);
    return;
  }
  
  if (p.crop && p.isReady) {
    const sKg = p.rolledKg || p.crop.minKg || 0.1;
    const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, false, p.isHoloMutated);
    addXP(Math.ceil(p.crop.baseGrowTime * 1.5));
    
    const produceItem = { 
      id: Date.now() + Math.random(), 
      seedId: p.crop.id, 
      name: (p.crop.name || 'Crop').replace(' Seed', ''), 
      icon: p.crop.icon || '🌱', 
      kg: sKg, 
      meters: p.rolledMeters || p.crop.minM || 1, 
      value: earn,
      isHolo: !!p.isHoloMutated,
      isOG: !!p.crop.isOG
    };
    gameState.produceInventory.push(produceItem);

    if (p.crop.isOG && Math.random() < 0.15) {
      gameState.produceInventory.push({ ...produceItem, id: Date.now() + Math.random() });
      createFloatingText(x, y - 30, "🏆 LEGACY GROWTH! +1 EXTRA HARVEST", "#ffd700");
    }
    
    if (!gameState.codex[p.crop.id]) {
      gameState.codex[p.crop.id] = { discovered: true, totalHarvested: 0 };
    }
    gameState.codex[p.crop.id].totalHarvested++;
    checkCodexCompletion();

    p.crop = null;
    p.progress = 0;
    p.isReady = false;
    p.isHoloMutated = false;
    playSFX('harvest');
    createFloatingText(x, y, `+1 ${produceItem.icon}`, "#81c784");
    updateHUD();
    renderPlots();
    saveGame();
    return;
  }
  
  if (!p.crop) {
    const allSeeds = getAllGameSeeds();
    const s = allSeeds.find(i => i && i.id === gameState.selectedSeedId);
    if (!s) return;
    if (s.isVine && gameState.fields[gameState.currentField].filter(f => f.crop && f.crop.isVine).length >= 3) {
      showToast("🌿 Max 3 Vines per Field!");
      return;
    }
    if ((gameState.seedInventory[s.id] || 0) <= 0) {
      showToast("🛒 Out of seeds! Check Shop.");
      return;
    }
    gameState.seedInventory[s.id]--;
    const r = rollCropWeight(s);
    p.crop = { ...s };
    p.progress = 0;
    p.isReady = false;
    p.vineEstablished = false;
    p.isHoloMutated = false;
    p.rolledKg = r.rolledKg;
    p.rolledMeters = r.rolledMeters;
    p.actualGrowTime = Math.max(5, Math.round((s.baseGrowTime || 5) * (1 + (r.rolledKg / (s.baseMaxKg || 2.5)) * 0.05)));
    
    if (!gameState.codex[s.id]) {
      gameState.codex[s.id] = { discovered: true, totalHarvested: 0 };
      checkCodexCompletion();
    }
    playSFX('plant');
    createFloatingText(x, y, `Planted ${s.icon || '🌱'}`, "#81c784");
    updateHUD();
    renderPlots();
    saveGame();
  }
}

function openSkipModal(pI, isF = false, fI = 0) {
  const p = gameState.fields[gameState.currentField][pI];
  if (!p || !p.crop) return;
  currentSkipTarget = { plotIndex: pI, isFruit: isF, fruitIndex: fI };
  let rM = 0;
  const sM = getGrowthMultiplier(p.crop);
  if (isF) {
    rM = Math.max(1, Math.ceil((100 - p.vineFruits[fI].progress) / ((100 / (p.vineFruits[fI].growTime || 10)) * sM)));
  } else {
    rM = Math.max(1, Math.ceil((100 - p.progress) / ((100 / (p.actualGrowTime || 5)) * sM)));
  }
  const c = Math.ceil(rM * (((p.crop.baseSellPrice || 10) * 0.1) + 11574));
  currentSkipTarget.cost = c;
  const skipTimeLeft = el('skip-time-left');
  const btnConfirmSkip = el('btn-confirm-skip');
  if (skipTimeLeft) skipTimeLeft.textContent = formatTime(rM);
  if (btnConfirmSkip) {
    const mainTitle = btnConfirmSkip.querySelector('.skip-btn-main');
    const costText = btnConfirmSkip.querySelector('.skip-btn-cost');
    if (mainTitle) mainTitle.textContent = `⏳ SKIP GROWTH`;
    if (costText) costText.textContent = `Cost: ${formatCash(c)}`;
    btnConfirmSkip.disabled = gameState.cash < c;
  }
  openModal(el('skip-timer-modal'));
}

function openVineModal() {
  renderVineModalContent();
  openModal(el('vine-modal'));
}

function renderVineModalContent() {
  const vineModalTitle = el('vine-modal-title');
  const vineProduceList = el('vine-produce-list');
  const skipAllVineBtn = el('skip-all-vine-btn');
  if (gameState.selectedVinePlotIndex === null || !vineModalTitle || !vineProduceList) return;
  const p = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex];
  if (!p || !p.crop || !p.crop.isVine) return;
  
  vineModalTitle.textContent = `${p.crop.icon || '🍇'} ${(p.crop.name || 'Vine').replace(' Seed', '')}`;
  vineProduceList.innerHTML = '';
  let tC = 0;
  let fS = 0;

  (p.vineFruits || []).forEach((f, i) => {
    const sKg = f.rolledKg || p.crop.minKg || 0.1;
    const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, true, p.isHoloMutated);
    const rS = Math.max(1, Math.ceil((100 - f.progress) / ((100 / (f.growTime || 10)) * getGrowthMultiplier(p.crop))));
    
    if (!f.isReady) {
      tC += Math.ceil(rS * ((p.crop.baseSellPrice * 0.1) + 11574));
      fS++;
    }

    const cd = document.createElement('div');
    cd.className = 'vine-produce-card';
    cd.innerHTML = `
      <div class="card-left-group">
        <div class="item-icon-badge">${f.icon || '🌿'}</div>
        <div class="item-details">
          <span class="item-title">${f.name || 'Frond'} #${i + 1}</span>
          <span class="item-sub-stat">
            ${f.isReady ? `<span class="stat-kg">🌱 ${formatKg(sKg)}</span> • <strong class="stat-cash">${formatCash(earn)}</strong>` : `<span class="stat-growing">🌱 Growing: ${formatKg((f.progress / 100) * sKg)}</span>`}
          </span>
        </div>
      </div>
      <div class="card-right-group">
        ${f.isReady ? `<button class="btn btn-vine-harvest">🤠 Harvest</button>` : `<button class="btn btn-vine-skip">⏳ Skip (${formatTime(rS)})</button>`}
      </div>
    `;

    if (f.isReady) {
      cd.querySelector('.btn-vine-harvest').addEventListener('click', () => {
        addXP(Math.ceil((p.crop.baseGrowTime * 1.5) / (p.crop.maxFruits || 3)));
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: p.crop.minM, value: earn, isHolo: p.isHoloMutated });
        f.progress = 0;
        f.isReady = false;
        const rs = rollFruitStats(p.crop);
        f.rolledKg = rs.fruitKg;
        f.growTime = rs.fruitGrowTime;
        playSFX('harvest');
        showToast(`🎒 Harvested ${f.icon}!`);
        updateHUD();
        renderVineModalContent();
        saveGame();
      });
    } else {
      cd.querySelector('.btn-vine-skip').addEventListener('click', () => openSkipModal(gameState.selectedVinePlotIndex, true, i));
    }
    vineProduceList.appendChild(cd);
  });

  if (skipAllVineBtn) {
    if (fS > 0) {
      skipAllVineBtn.textContent = `⏳ Skip All (${formatCash(tC)})`;
      skipAllVineBtn.disabled = gameState.cash < tC;
      skipAllVineBtn.onclick = () => {
        if (Date.now() - lastSkipTime < 3000) {
          showToast("⏳ Cooldown! Wait 3s.");
          return;
        }
        if (gameState.cash >= tC) {
          gameState.cash -= tC;
          lastSkipTime = Date.now();
          p.vineFruits.forEach(x => { x.progress = 100; x.isReady = true; });
          playSFX('sell');
          showToast(`⏳ Skipped all!`);
          updateHUD();
          renderVineModalContent();
          saveGame();
        } else {
          showToast("❌ Not enough money!");
        }
      };
    } else {
      skipAllVineBtn.textContent = `⏳ Skip All`;
      skipAllVineBtn.disabled = true;
      skipAllVineBtn.onclick = null;
    }
  }
}

function updateGlobalCycle() {
  const CYCLE_DURATION = 600000;
  const HALF_CYCLE = 300000;
  const syncedNow = getServerTime();
  
  const cycleIndex = Math.floor(syncedNow / CYCLE_DURATION);
  const nowOffset = syncedNow % CYCLE_DURATION;
  
  const wasRain = gameState.isPrismaticRain;
  const wasDay = gameState.isDay;

  if (gameState.weatherOverride) {
    gameState.isDay = false;
    gameState.isPrismaticRain = true;
    gameState.cycleTimeLeft = 999;
  } else {
    if (nowOffset < HALF_CYCLE) {
      gameState.isDay = true;
      gameState.isPrismaticRain = false;
      gameState.cycleTimeLeft = Math.ceil((HALF_CYCLE - nowOffset) / 1000);
    } else {
      const nightRng = mulberry32(cycleIndex * 98765 + 13579);
      const isRainRoll = (nightRng() < 0.30);
      
      gameState.isDay = false;
      gameState.isPrismaticRain = isRainRoll;
      gameState.cycleTimeLeft = Math.ceil((CYCLE_DURATION - nowOffset) / 1000);
    }
  }

  if (!wasRain && gameState.isPrismaticRain) {
    spawnHoloRaindrops();
    spawnPrismaticGlobs();
    if (timeSynced) {
      showToast("🌧️ PRISMATIC PAINT RAIN IS FALLING! Plants may mutate! Event Shop Open!");
      playSFX('mutate');
    }
    const shopModal = el('shop-modal');
    if (shopModal && !shopModal.classList.contains('hidden')) renderShopItems();
  } else if (wasRain && !gameState.isPrismaticRain) {
    clearPrismaticGlobs();
    const rainLayer = el('prismatic-rain-layer');
    if (rainLayer) {
      rainLayer.classList.add('hidden');
      rainLayer.innerHTML = '';
    }
    if (timeSynced) {
      showToast("☀️ The Prismatic Rain has passed.");
    }
    const shopModal = el('shop-modal');
    if (shopModal && !shopModal.classList.contains('hidden')) renderShopItems();
  }

  const cycleIcon = el('cycle-icon');
  if (wasDay !== gameState.isDay && !gameState.isPrismaticRain && cycleIcon) {
    cycleIcon.style.transform = 'rotate(360deg) scale(1.3)';
    setTimeout(() => { cycleIcon.style.transform = 'rotate(0deg) scale(1)'; }, 800);
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
  }
}

function updatePlaytesterStatusUI() {
  const playtesterModeStatus = el('playtester-mode-status');
  const btnTogglePlaytesterMode = el('btn-toggle-playtester-mode');
  if (playtesterModeStatus) {
    playtesterModeStatus.textContent = isPlaytesterMode ? "🧪 Playtester Account Active" : "🏠 Main Account Active";
    playtesterModeStatus.style.color = isPlaytesterMode ? "#00b0ff" : "#2e7d32";
  }
  if (btnTogglePlaytesterMode) {
    btnTogglePlaytesterMode.textContent = isPlaytesterMode ? "🚪 Exit Playtester Mode" : "🧪 Enter Playtester Mode";
    btnTogglePlaytesterMode.style.background = isPlaytesterMode ? "#757575" : "linear-gradient(135deg, #00b0ff, #0091ea)";
  }
}

function populateAdminDropdowns() {
  const adminSeedSelect = el('admin-seed-select');
  const adminRestockSelect = el('admin-restock-select');
  if (!adminSeedSelect || !adminRestockSelect) return;
  adminSeedSelect.innerHTML = '';
  adminRestockSelect.innerHTML = '';

  const allSeeds = getAllGameSeeds();
  allSeeds.forEach(s => {
    if (!s) return;
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.icon} ${s.name} (${s.rarity.toUpperCase()})`;
    adminSeedSelect.appendChild(opt);
  });

  SEED_CATALOG.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.icon} ${s.name} (Stock: ${s.currentStock})`;
    adminRestockSelect.appendChild(opt);
  });
}

function updateDailyDealTimer() {
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  const now = Date.now();
  const lastUsed = gameState.lastDailyDealTime || 0;
  const elapsed = now - lastUsed;
  const btnDailyDeal = el('btn-daily-deal');
  const dailyDealCountdownText = el('daily-deal-countdown-text');

  if (lastUsed > 0 && elapsed < TWELVE_HOURS) {
    const remainingSeconds = Math.ceil((TWELVE_HOURS - elapsed) / 1000);
    if (btnDailyDeal) {
      btnDailyDeal.disabled = true;
    }
    if (dailyDealCountdownText) {
      dailyDealCountdownText.textContent = `⏳ Next Deal in: ${formatTime(remainingSeconds)}`;
    }
  } else {
    if (btnDailyDeal) {
      btnDailyDeal.disabled = false;
    }
    if (dailyDealCountdownText) {
      dailyDealCountdownText.textContent = `Apply Massive 20× Boost!`;
    }
  }
}

function renderSellMainOptions() {
  const sellMainOptions = el('sell-main-options');
  const sellItemPicker = el('sell-item-picker');
  const sellQuantityPicker = el('sell-quantity-picker');
  const bargainNpcBox = el('bargain-npc-box');
  const sellAllPayoutText = el('sell-all-payout-text');

  if (sellMainOptions && sellItemPicker && sellQuantityPicker && bargainNpcBox) {
    sellMainOptions.classList.remove('hidden');
    sellItemPicker.classList.add('hidden');
    sellQuantityPicker.classList.add('hidden');
    bargainNpcBox.classList.add('hidden');
    
    const payout = calculateCashYield(gameState.produceInventory);
    const multText = ` [${getRebirthMultiplier().toFixed(1)}× Active]`;
    if (sellAllPayoutText) sellAllPayoutText.textContent = `Total Value: ${formatCash(payout)} (${gameState.produceInventory.length} items)${multText}`;
  }
}

function renderSellItemPicker() {
  const sellMainOptions = el('sell-main-options');
  const sellItemPicker = el('sell-item-picker');
  const sellQuantityPicker = el('sell-quantity-picker');
  const bargainNpcBox = el('bargain-npc-box');

  if (!sellItemPicker) return;
  if (sellMainOptions) sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.remove('hidden');
  if (sellQuantityPicker) sellQuantityPicker.classList.add('hidden');
  if (bargainNpcBox) bargainNpcBox.classList.add('hidden');
  sellItemPicker.innerHTML = '';
  
  getGroupedProduce().forEach(g => {
    const groupPayout = calculateCashYield(g.items);
    const holoPrefix = g.isHolo ? '✨ ' : '';
    const ogPrefix = g.isOG ? '🏆 ' : '';
    const c = document.createElement('div');
    c.className = 'btn-sell-option';
    c.innerHTML = `
      <span class="sell-opt-icon">${g.icon}</span>
      <div class="sell-opt-text">
        <span class="opt-title">${ogPrefix}${holoPrefix}${g.name} (x${g.items.length})</span>
        <span class="opt-subtitle">Total Value: ${formatCash(groupPayout)}</span>
      </div>
      <button class="btn-market-select">${g.items.length > 1 ? 'Choose Qty 🧺' : `Sell 1 (${formatCash(groupPayout)})`}</button>
    `;
    
    c.addEventListener('click', () => {
      if (g.items.length === 1) {
        const i = g.items[0];
        const singlePayout = calculateCashYield([i]);
        gameState.cash += singlePayout;
        const targetIndex = gameState.produceInventory.findIndex(x => x.id === i.id);
        gameState.produceInventory.splice(targetIndex, 1);
        playSFX('sell');
        createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+${formatCash(singlePayout)}! 💰`, "#ffd54f");
        updateHUD();
        saveGame();
        
        if (gameState.produceInventory.length === 0) closeModal(el('sell-modal'));
        else renderSellItemPicker();
      } else {
        sellQuantityState.selectedCropGroup = g;
        sellQuantityState.quantityToSell = 1;
        renderSellQuantityPicker();
      }
    });
    sellItemPicker.appendChild(c);
  });
}

function renderSellQuantityPicker() {
  const sellMainOptions = el('sell-main-options');
  const sellItemPicker = el('sell-item-picker');
  const sellQuantityPicker = el('sell-quantity-picker');
  const bargainNpcBox = el('bargain-npc-box');
  const qtyCropHeader = el('qty-crop-header');
  const qtyDisplayNum = el('qty-display-num');
  const qtyPayoutPreview = el('qty-payout-preview');

  if (sellMainOptions) sellMainOptions.classList.add('hidden');
  if (sellItemPicker) sellItemPicker.classList.add('hidden');
  if (sellQuantityPicker) sellQuantityPicker.classList.remove('hidden');
  if (bargainNpcBox) bargainNpcBox.classList.add('hidden');
  
  const g = sellQuantityState.selectedCropGroup;
  if (!g || g.items.length === 0) {
    renderSellItemPicker();
    return;
  }
  
  const holoPrefix = g.isHolo ? '✨ ' : '';
  const ogPrefix = g.isOG ? '🏆 ' : '';
  if (qtyCropHeader) qtyCropHeader.textContent = `${g.icon} ${ogPrefix}${holoPrefix}${g.name} (Owned: x${g.items.length})`;
  if (qtyDisplayNum) qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
  
  const itemsToSell = g.items.slice(0, sellQuantityState.quantityToSell);
  const p = calculateCashYield(itemsToSell);
  if (qtyPayoutPreview) qtyPayoutPreview.textContent = `Payout: ${formatCash(p)}`;
}

function renderBargainNpcView() {
  const sellMainOptions = el('sell-main-options');
  const sellItemPicker = el('sell-item-picker');
  const sellQuantityPicker = el('sell-quantity-picker');
  const bargainNpcBox = el('bargain-npc-box');
  const standardValEl = el('npc-standard-value');
  const projectedCashEl = el('npc-projected-cash');
  const feeEl = el('npc-bargain-fee');
  const dialogueEl = el('npc-dialogue-text');
  const offerTierEl = el('npc-offer-tier');
  const btnStart = el('btn-start-bargain');
  const btnAccept = el('btn-accept-bargain');
  const btnDecline = el('btn-decline-bargain');
  const dailyDealWrapper = el('daily-deal-wrapper');

  if (!bargainNpcBox) return;
  if (sellMainOptions) sellMainOptions.classList.add('hidden');
  if (sellItemPicker) sellItemPicker.classList.add('hidden');
  if (sellQuantityPicker) sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.remove('hidden');

  currentBargainBase = calculateCashYield(gameState.produceInventory);
  currentBargainFee = Math.max(20, Math.round(currentBargainBase * 0.05));
  currentBargainMultiplier = 1.0;
  currentBargainPayout = currentBargainBase;
  isDailyDealActive = false;

  if (standardValEl) standardValEl.textContent = formatCash(currentBargainBase);
  if (projectedCashEl) projectedCashEl.textContent = formatCash(currentBargainBase);
  if (feeEl) feeEl.textContent = `Appraisal Fee: ${formatCash(currentBargainFee)}`;
  if (dialogueEl) dialogueEl.textContent = `"Greetings traveler! I can appraise your Seed Bag for market premiums."`;
  if (offerTierEl) offerTierEl.classList.add('hidden');
  
  if (btnStart) {
    btnStart.classList.remove('hidden');
    btnStart.disabled = (gameState.cash < currentBargainFee || gameState.produceInventory.length === 0);
  }
  if (btnAccept) btnAccept.classList.add('hidden');
  if (btnDecline) btnDecline.classList.add('hidden');
  if (dailyDealWrapper) dailyDealWrapper.classList.add('hidden');
}

function sendTradeRequest(targetId) {
  if (!isOnline || isPlaytesterMode || !db) {
    showToast(isPlaytesterMode ? "❌ Trading disabled in Playtester Mode." : "❌ Offline mode. Cannot trade.");
    return;
  }
  db.ref('players/' + targetId + '/tradeRequest').set({
    from: myPlayerId,
    timestamp: getServerTime()
  });
  showToast(`📤 Trade request sent to ID: ${targetId}`);
}

function renderTradeSlots(myItems, partnerItems) {
  const myTradeSlots = el('my-trade-slots');
  const theirTradeSlots = el('their-trade-slots');
  if (!myTradeSlots || !theirTradeSlots) return;
  myTradeSlots.innerHTML = '';
  theirTradeSlots.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const mySlot = document.createElement('div');
    if (myItems && myItems[i]) {
      const item = myItems[i];
      mySlot.className = 'trade-slot filled';
      mySlot.innerHTML = `
        <span class="slot-icon">${item.icon || '🌱'}</span>
        <span class="slot-name">${item.name || 'Item'}</span>
        ${item.type === 'produce' ? `<span class="slot-kg">${formatKg(item.kg)}</span>` : ''}
      `;
      if (!amIReady) {
        const rmBtn = document.createElement('button');
        rmBtn.className = 'trade-remove-btn';
        rmBtn.textContent = 'X';
        rmBtn.onclick = (e) => {
          e.stopPropagation();
          myOfferedItems.splice(i, 1);
          const isP1 = currentTradeId && currentTradeId.startsWith(myPlayerId + '_');
          if (db) db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
        };
        mySlot.appendChild(rmBtn);
      }
    } else {
      mySlot.className = 'trade-slot';
    }
    myTradeSlots.appendChild(mySlot);

    const theirSlot = document.createElement('div');
    if (partnerItems && partnerItems[i]) {
      const item = partnerItems[i];
      theirSlot.className = 'trade-slot filled';
      theirSlot.innerHTML = `
        <span class="slot-icon">${item.icon || '🌱'}</span>
        <span class="slot-name">${item.name || 'Item'}</span>
        ${item.type === 'produce' ? `<span class="slot-kg">${formatKg(item.kg)}</span>` : ''}
      `;
    } else {
      theirSlot.className = 'trade-slot';
    }
    theirTradeSlots.appendChild(theirSlot);
  }
}

function renderTradeBackpack(tab = 'seeds') {
  const tradeTabSeeds = el('trade-tab-seeds');
  const tradeTabProduce = el('trade-tab-produce');
  const tradePickerList = el('trade-picker-list');
  if (!tradeTabSeeds || !tradeTabProduce || !tradePickerList) return;
  tradeTabSeeds.classList.toggle('active', tab === 'seeds');
  tradeTabProduce.classList.toggle('active', tab === 'produce');
  tradePickerList.innerHTML = '';

  if (tab === 'seeds') {
    const allSeeds = getAllGameSeeds();
    allSeeds.forEach(s => {
      if (!s || s.isOG) return;
      const qty = gameState.seedInventory[s.id] || 0;
      if (qty > 0) {
        const card = document.createElement('div');
        card.className = 'trade-item-card';
        card.style = "display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border-radius:8px; margin-bottom:6px; border:2px solid #d7ccc8;";
        card.innerHTML = `<span>${s.icon} ${s.name} (x${qty})</span> <button style="background:#4caf50; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-weight:bold; cursor:pointer;">Add</button>`;
        card.querySelector('button').onclick = () => {
          if (amIReady) return;
          if (myOfferedItems.length >= 9) {
            showToast("❌ Trade box is full (Max 9)!");
            return;
          }
          myOfferedItems.push({ type: 'seed', seedId: s.id, name: s.name, icon: s.icon });
          const isP1 = currentTradeId && currentTradeId.startsWith(myPlayerId + '_');
          if (db) db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
          closeModal(el('trade-backpack-modal'));
        };
        tradePickerList.appendChild(card);
      }
    });
  } else {
    gameState.produceInventory.forEach((item) => {
      if (!item) return;
      const card = document.createElement('div');
      card.className = 'trade-item-card';
      card.style = "display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border-radius:8px; margin-bottom:6px; border:2px solid #d7ccc8;";
      card.innerHTML = `<span>${item.icon || '🌱'} ${item.name || 'Produce'} (${formatCash(item.value)})</span> <button style="background:#4caf50; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-weight:bold; cursor:pointer;">Add</button>`;
      card.querySelector('button').onclick = () => {
        if (amIReady) return;
        if (myOfferedItems.length >= 9) {
          showToast("❌ Trade box is full (Max 9)!");
          return;
        }
        myOfferedItems.push({ type: 'produce', id: item.id, seedId: item.seedId, name: item.name, icon: item.icon, kg: item.kg, value: item.value, isHolo: item.isHolo });
        const isP1 = currentTradeId && currentTradeId.startsWith(myPlayerId + '_');
        if (db) db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
        closeModal(el('trade-backpack-modal'));
      };
      tradePickerList.appendChild(card);
    });
  }
}

function initFirebasePresence() {
  if (!db) return;

  db.ref('.info/serverTimeOffset').on('value', snap => {
    serverTimeOffset = snap.val() || 0;
    timeSynced = true;
    updateGlobalCycle();
    updateShopForCurrentCycle();
  });

  db.ref('globalWeatherOverride').on('value', snap => {
    const val = snap.val();
    if (val && typeof val.active === 'boolean') {
      gameState.weatherOverride = val.active;
    } else {
      gameState.weatherOverride = false;
    }
    updateGlobalCycle();
    updateHUD();
  });

  db.ref('globalRestockLuck').on('value', snap => {
    const val = snap.val();
    if (val && val.multiplier) {
      gameState.restockLuckMultiplier = Number(val.multiplier) || 1.0;
      gameState.lastShopCycle = null;
      updateShopForCurrentCycle();
      if (timeSynced) {
        showToast(`🍀 Global Restock Luck: ${val.multiplier}X active!`);
      }
    }
  });

  let initialBacklogLoaded = false;
  db.ref('adminCommands').once('value', () => {
    initialBacklogLoaded = true;
  });

  db.ref('adminCommands').limitToLast(20).on('child_added', snap => {
    if (!initialBacklogLoaded) return;
    const cmd = snap.val();
    if (!cmd) return;

    if (cmd.type === 'cash') {
      gameState.cash += cmd.amount;
      updateHUD();
      playSFX('sell');
      showToast(`ADMIN: Granted everyone ${formatCash(cmd.amount)}!`);
    } else if (cmd.type === 'seed') {
      gameState.seedInventory[cmd.seedId] = (gameState.seedInventory[cmd.seedId] || 0) + cmd.amount;
      updateHUD();
      showToast(`ADMIN: Granted everyone ${cmd.amount}x ${cmd.seedId}!`);
    } else if (cmd.type === 'broadcast') {
      playSFX('harvest');
      showToast(`ADMIN: ${cmd.message}`);
    } else if (cmd.type === 'restock') {
      const s = SEED_CATALOG.find(x => x.id === cmd.seedId);
      if (s) {
        s.currentStock = cmd.amount;
        const shopModal = el('shop-modal');
        if (shopModal && !shopModal.classList.contains('hidden')) renderShopItems();
        showToast(`ADMIN: Restocked ${s.name} to ${cmd.amount}!`);
      }
    } else if (cmd.type === 'skipGrow') {
      gameState.fields.forEach(field => {
        field.forEach(p => {
          if (p.crop && !p.isReady) {
            p.progress = 100;
            p.isReady = true;
          }
        });
      });
      playSFX('sell');
      updateHUD();
      renderPlots();
      showToast(`ADMIN: Fast-forwarded all farm crops!`);
    }
  });

  db.ref('.info/connected').on('value', snap => {
    const networkStatusText = el('network-status-text');
    if (snap.val() === true) {
      isOnline = true;
      if (networkStatusText) {
        networkStatusText.innerHTML = "Network Status: ONLINE 🟢";
        networkStatusText.style.color = "#2e7d32";
      }
      const myRef = db.ref('players/' + myPlayerId);
      myRef.onDisconnect().remove();
      myRef.set({ level: gameState.level, online: true, inTrade: false });
    } else {
      isOnline = false;
      if (networkStatusText) {
        networkStatusText.innerHTML = "Network Status: Offline 🔴";
        networkStatusText.style.color = "#d32f2f";
      }
    }
  });

  db.ref('players').on('value', snap => {
    const players = snap.val() || {};
    const activePlayersList = el('active-players-list');
    if (!activePlayersList) return;
    activePlayersList.innerHTML = '';
    let count = 0;
    
    for (let id in players) {
      if (id === myPlayerId) continue;
      count++;
      const pData = players[id];
      const pRow = document.createElement('div');
      pRow.style = "display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px 12px; border-radius:8px; margin-bottom:6px; border:2px solid #e0c9a6;";
      const btnStatus = pData.inTrade ? 'disabled style="background:#b0bec5; box-shadow:none; cursor:not-allowed;"' : 'style="background:#8e24aa; box-shadow:0 3px 0 #6a1b9a;"';
      const btnText = pData.inTrade ? 'In Trade' : 'Trade';
      pRow.innerHTML = `<span style="font-weight:900; color:#4e342e;">ID: ${id} <span style="font-size:12px; color:#f57c00;">(Lvl ${pData.level})</span></span> <button class="btn" style="padding:6px 12px; font-size:12px;" ${btnStatus}>${btnText}</button>`;
      
      if (!pData.inTrade) pRow.querySelector('button').addEventListener('click', () => sendTradeRequest(id));
      activePlayersList.appendChild(pRow);
    }
    if (count === 0) activePlayersList.innerHTML = `<p style="text-align:center; color:#795548; font-weight:800; font-size:14px;">No other players online.</p>`;
  });

  db.ref('players/' + myPlayerId + '/tradeRequest').on('value', snap => {
    const req = snap.val();
    const tradeRequestId = el('trade-request-id');
    if (req && req.from) {
      if (tradeRequestId) tradeRequestId.textContent = req.from;
      openModal(el('trade-request-modal'));
      pendingTradeReq = req.from;
    } else {
      closeModal(el('trade-request-modal'));
      pendingTradeReq = null;
    }
  });

  db.ref('players/' + myPlayerId + '/activeTrade').on('value', snap => {
    const tId = snap.val();
    if (tId) {
      currentTradeId = tId;
      amIReady = false;
      myOfferedItems = [];
      const btnTradeReady = el('btn-trade-ready');
      if (btnTradeReady) btnTradeReady.style.filter = "brightness(1)";
      closeModal(el('friends-modal'));
      closeModal(el('trade-request-modal'));
      closeModal(el('trade-backpack-modal'));
      renderTradeSlots(null, null);
      openModal(el('trade-session-modal'));
      
      db.ref('trades/' + tId).on('value', tSnap => {
        const tData = tSnap.val();
        if (!tData) return;
        
        const tradePartnerTitle = el('trade-partner-title');
        const theirTradeStatus = el('their-trade-status');
        if (tradePartnerTitle) tradePartnerTitle.textContent = `Partner: ${tData.p1 === myPlayerId ? tData.p2 : tData.p1}`;
        const tk = tData.p1 === myPlayerId ? 'p2Ready' : 'p1Ready';
        if (theirTradeStatus) {
          theirTradeStatus.textContent = tData[tk] ? 'Partner is READY ✅' : 'Waiting for partner...';
          theirTradeStatus.style.color = tData[tk] ? '#2e7d32' : '#c62828';
        }
        renderTradeSlots(tData.p1 === myPlayerId ? tData.p1Items : tData.p2Items, tData.p1 === myPlayerId ? tData.p2Items : tData.p1Items);
        
        if (tData.status === 'completed') {
          db.ref('trades/' + tId).off();
          if (tData.p1 === myPlayerId) {
            (tData.p1Items || []).forEach(i => {
              if (i.type === 'seed') gameState.seedInventory[i.seedId]--;
              else gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === i.id), 1);
            });
            (tData.p2Items || []).forEach(i => {
              if (i.type === 'seed') gameState.seedInventory[i.seedId] = (gameState.seedInventory[i.seedId] || 0) + 1;
              else gameState.produceInventory.push(i);
            });
            db.ref('trades/' + tId).remove();
          } else {
            (tData.p2Items || []).forEach(i => {
              if (i.type === 'seed') gameState.seedInventory[i.seedId]--;
              else gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === i.id), 1);
            });
            (tData.p1Items || []).forEach(i => {
              if (i.type === 'seed') gameState.seedInventory[i.seedId] = (gameState.seedInventory[i.seedId] || 0) + 1;
              else gameState.produceInventory.push(i);
            });
          }
          showToast("✅ Trade Successful!");
          updateHUD();
          saveGame();
          closeModal(el('trade-session-modal'));
          db.ref('players/' + myPlayerId).update({ activeTrade: null, inTrade: false });
          currentTradeId = null;
        } else if (tData.status === 'cancelled') {
          db.ref('trades/' + tId).off();
          showToast("❌ Trade Declined");
          closeModal(el('trade-session-modal'));
          db.ref('players/' + myPlayerId).update({ activeTrade: null, inTrade: false });
          currentTradeId = null;
        }
      });
    } else if (currentTradeId) {
      db.ref('trades/' + currentTradeId).off();
      closeModal(el('trade-session-modal'));
      currentTradeId = null;
      db.ref('players/' + myPlayerId).update({ inTrade: false });
    }
  });

  db.ref('chat').limitToLast(15).on('child_added', snap => {
    const c = snap.val();
    if (!c) return;
    const chatMessagesContainer = el('chat-messages-container');
    if (!chatMessagesContainer) return;
    const isMe = c.sender === myPlayerId;
    const d = document.createElement('div');
    d.style = `padding: 8px 12px; border-radius: 12px; max-width: 85%; font-weight: 800; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); clear: both; ${isMe ? 'background: #e1f5fe; color: #0277bd; border: 2px solid #81d4fa; align-self: flex-end;' : 'background: #fff; color: #4e342e; border: 2px solid #d7ccc8; align-self: flex-start;'}`;
    d.innerHTML = `<div style="font-size: 10px; opacity: 0.7; margin-bottom: 2px;">${c.sender}</div>${c.text}`;
    chatMessagesContainer.appendChild(d);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  });
}

function gameLoop() {
  const now = Date.now();
  const delta = Math.min((now - lastTickTime) / 1000, 0.1);
  lastTickTime = now;
  
  gameState.fields.forEach(f => {
    f.forEach(p => {
      if (p.crop) {
        const sm = getGrowthMultiplier(p.crop);
        if (p.crop.isVine) {
          if (!p.vineEstablished) {
            p.progress += ((100 / (p.actualGrowTime || 10)) * sm) * delta;
            if (p.progress >= 100) {
              p.progress = 100;
              p.vineEstablished = true;
              p.vineFruits = [];
              for (let i = 0; i < Math.min(3, p.crop.maxFruits || 3); i++) {
                const rs = rollFruitStats(p.crop);
                p.vineFruits.push({ fruitId: `${p.crop.id}_${i}`, name: p.crop.produceName, icon: p.crop.produceIcon, progress: 0, isReady: false, rolledKg: rs.fruitKg, growTime: rs.fruitGrowTime });
              }
            }
          } else if (p.vineFruits) {
            p.vineFruits.forEach(fr => {
              if (!fr.isReady) {
                fr.progress += ((100 / (fr.growTime || 10)) * sm) * delta;
                if (fr.progress >= 100) {
                  fr.progress = 100;
                  fr.isReady = true;
                }
              }
            });
          }
        } else if (!p.isReady) {
          p.progress += ((100 / (p.actualGrowTime || 5)) * sm) * delta;
          if (p.progress >= 100) {
            p.progress = 100;
            p.isReady = true;
          }
        }
      }
    });
  });
  renderPlots();
  const vineModal = el('vine-modal');
  if (vineModal && !vineModal.classList.contains('hidden')) renderVineModalContent();
}

function secondTick() {
  updateGlobalCycle();
  updateShopForCurrentCycle();
  checkHolographicRainMutations();
  updateDailyDealTimer();
  
  const now = getServerTime();
  const CYCLE_3MIN = 180000;
  const sLeft = Math.max(0, Math.ceil((CYCLE_3MIN - (now % CYCLE_3MIN)) / 1000));
  const shopRefillTimerEl = el('shop-refill-timer');
  const decorRefillTimer = el('decor-refill-timer');
  if (shopRefillTimerEl) shopRefillTimerEl.textContent = formatTime(sLeft);
  if (decorRefillTimer) decorRefillTimer.textContent = formatTime(sLeft);
  
  updateHUD();
}

function initSplashScreen() {
  const ss = el('splash-screen');
  const pf = el('splash-progress-fill');
  const pe = el('splash-prompt');
  if (!ss) return;
  
  let p = 0;
  if (pe) pe.textContent = "🎷 PRESS (A) / TAP TO START 🎵";
  
  const int = setInterval(() => {
    p += 5.0;
    if (p > 100) p = 100;
    if (pf) pf.style.width = `${p}%`;
    if (p >= 100) {
      clearInterval(int);
      if (pe) {
        pe.textContent = 'CLICK TO START YOUR VENTURE';
        pe.classList.add('ready-start');
      }
    }
  }, 25);
  
  function dismissSplash() {
    initAudioContext();
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
    playSFX('harvest');
    ss.classList.add('fade-out');
    setTimeout(() => { ss.style.display = 'none'; }, 300);
  }

  ss.addEventListener('pointerdown', dismissSplash);
  ss.addEventListener('click', dismissSplash);
}

function getStorageKey() {
  return isPlaytesterMode ? 'gardenVenture2PlaytesterSave' : 'gardenVenture2Save';
}

function saveGame() {
  try {
    const saveData = {
      cash: gameState.cash,
      level: gameState.level,
      xp: gameState.xp,
      rebirthLevel: gameState.rebirthLevel,
      currentField: gameState.currentField,
      unlockedFields: gameState.unlockedFields,
      selectedSeedId: gameState.selectedSeedId,
      seedInventory: gameState.seedInventory,
      produceInventory: gameState.produceInventory,
      codex: gameState.codex,
      fields: gameState.fields,
      bgmMuted: gameState.bgmMuted,
      sfxMuted: gameState.sfxMuted,
      lastDailyDealTime: gameState.lastDailyDealTime,
      articularSkinActive: gameState.articularSkinActive,
      currentFenceSkin: gameState.currentFenceSkin,
      ownedFenceSkins: gameState.ownedFenceSkins,
      isGv1Veteran: gameState.isGv1Veteran,
      hasOgBadge: gameState.hasOgBadge,
      restockLuckMultiplier: gameState.restockLuckMultiplier,
      weatherOverride: gameState.weatherOverride,
      cycleTimeLeft: gameState.cycleTimeLeft, 
      isDay: gameState.isDay,
      isPrismaticRain: gameState.isPrismaticRain,
      lastSaveTime: Date.now()
    };
    localStorage.setItem(getStorageKey(), JSON.stringify(saveData));
  } catch (e) {
    console.error("Save Game Error:", e);
  }
}

function loadGame() {
  const key = getStorageKey();
  const sd = localStorage.getItem(key);
  
  if (sd) {
    try {
      const d = JSON.parse(sd);
      gameState.cash = d.cash !== undefined ? d.cash : 25;
      gameState.level = d.level || 1;
      gameState.xp = d.xp || 0;
      gameState.rebirthLevel = d.rebirthLevel || 0;
      gameState.currentField = d.currentField || 0;
      gameState.unlockedFields = d.unlockedFields || 1;
      gameState.bgmMuted = d.bgmMuted || false;
      gameState.sfxMuted = d.sfxMuted || false;
      gameState.lastDailyDealTime = d.lastDailyDealTime || 0;
      gameState.articularSkinActive = d.articularSkinActive || false;
      gameState.currentFenceSkin = d.currentFenceSkin || 'classic';
      gameState.ownedFenceSkins = Array.isArray(d.ownedFenceSkins) ? d.ownedFenceSkins : ['classic'];
      gameState.isGv1Veteran = d.isGv1Veteran || (localStorage.getItem('gv1_veteran_key') === 'true');
      gameState.hasOgBadge = d.hasOgBadge || false;
      gameState.restockLuckMultiplier = d.restockLuckMultiplier || 1.0;
      gameState.weatherOverride = d.weatherOverride === true;
      
      gameState.isDay = d.isDay !== undefined ? d.isDay : true;
      gameState.isPrismaticRain = d.isPrismaticRain || false;
      gameState.cycleTimeLeft = d.cycleTimeLeft || 300;
      
      if (d.seedInventory) {
        for (let k in d.seedInventory) {
          gameState.seedInventory[k] = d.seedInventory[k];
        }
      }
      const allSeeds = getAllGameSeeds();
      allSeeds.forEach(s => {
        if (s && gameState.seedInventory[s.id] === undefined) {
          gameState.seedInventory[s.id] = 0;
        }
      });

      if (allSeeds.some(s => s && s.id === d.selectedSeedId)) {
        gameState.selectedSeedId = d.selectedSeedId;
      } else {
        gameState.selectedSeedId = 'carrot';
      }
      
      if (d.codex) {
        for (let k in d.codex) {
          gameState.codex[k] = d.codex[k];
        }
      }
      
      gameState.produceInventory = (d.produceInventory || []).filter(item => item && item.name);
      
      if (d.fields && Array.isArray(d.fields)) {
        gameState.fields = d.fields;
        while (gameState.fields.length < gameState.maxFields) {
          const p = [];
          for (let i = 0; i < 9; i++) {
            p.push({ crop: null, progress: 0, isReady: false, vineEstablished: false, rolledKg: 0, rolledMeters: 0, actualGrowTime: 5, vineFruits: [], isHoloMutated: false });
          }
          gameState.fields.push(p);
        }
      } else {
        initFields();
      }
      
      if (d.lastSaveTime) {
        const offlineSeconds = Math.max(0, (Date.now() - d.lastSaveTime) / 1000);
        const cappedOffline = Math.min(offlineSeconds, 604800);
        if (cappedOffline > 2) {
          gameState.fields.forEach(f => {
            f.forEach(p => {
              if (p.crop) {
                const sm = getGrowthMultiplier(p.crop); 
                if (p.crop.isVine) {
                  if (!p.vineEstablished) {
                    p.progress += ((100 / (p.actualGrowTime || 10)) * sm) * cappedOffline;
                    if (p.progress >= 100) {
                      const extraTime = ((p.progress - 100) / ((100 / (p.actualGrowTime || 10)) * sm));
                      p.progress = 100;
                      p.vineEstablished = true;
                      p.vineFruits = [];
                      const fCount = p.crop.maxFruits || 3;
                      for (let i = 0; i < fCount; i++) {
                        const rs = rollFruitStats(p.crop);
                        p.vineFruits.push({ fruitId: `${p.crop.id}_${i}`, name: p.crop.produceName, icon: p.crop.produceIcon, progress: 0, isReady: false, rolledKg: rs.fruitKg, growTime: rs.fruitGrowTime });
                      }
                      if (extraTime > 0) {
                        p.vineFruits.forEach(fr => {
                          fr.progress += ((100 / (fr.growTime || 10)) * sm) * extraTime;
                          if (fr.progress >= 100) {
                            fr.progress = 100;
                            fr.isReady = true;
                          }
                        });
                      }
                    }
                  } else if (p.vineFruits) {
                    p.vineFruits.forEach(fr => {
                      if (!fr.isReady) {
                        fr.progress += ((100 / (fr.growTime || 10)) * sm) * cappedOffline;
                        if (fr.progress >= 100) {
                          fr.progress = 100;
                          fr.isReady = true;
                        }
                      }
                    });
                  }
                } else if (!p.isReady) {
                  p.progress += ((100 / (p.actualGrowTime || 5)) * sm) * cappedOffline;
                  if (p.progress >= 100) {
                    p.progress = 100;
                    p.isReady = true;
                  }
                }
              }
            });
          });
        }
      }
    } catch (e) {
      console.error("Save load error:", e);
      initFields();
    }
  } else {
    gameState = createDefaultGameState();
    initFields();
  }
}

function initGlobalShop() {
  updateShopForCurrentCycle(true);
}

function setupDOMEventListeners() {
  on('shovel-btn', 'click', () => {
    gameState.selectedTool = gameState.selectedTool === 'shovel' ? 'plant' : 'shovel';
    updateHUD();
  });

  on('status-banner', 'click', () => {
    const weatherTitle = el('weather-modal-title');
    const weatherBody = el('weather-modal-body');
    if (weatherTitle && weatherBody) {
      if (gameState.isPrismaticRain) {
        weatherTitle.textContent = "🌧️ Prismatic Paint Rain Active";
        weatherBody.innerHTML = `
          <p><strong>Effect:</strong> Crops grow <strong>2.5× Faster</strong>!</p>
          <p><strong>Mutations:</strong> 5% chance for plants to mutate into <strong>Holographic (4× Value)</strong>!</p>
          <p><strong>Market:</strong> Exclusive <strong>Prismatic Event Shop</strong> is open!</p>
        `;
      } else if (gameState.isDay) {
        weatherTitle.textContent = "☀️ Daytime Active";
        weatherBody.innerHTML = `
          <p><strong>Effect:</strong> Sun-affinity crops (like Sunflowers) grow <strong>2.0× Faster</strong>!</p>
          <p>Cycle changes every 5 minutes.</p>
        `;
      } else {
        weatherTitle.textContent = "🌙 Nighttime Active";
        weatherBody.innerHTML = `
          <p><strong>Effect:</strong> Night-affinity crops (Glowshrooms, Strawberries, Cosmic Roses) grow <strong>2.0× Faster</strong>!</p>
          <p>30% chance for Prismatic Rain during night cycles!</p>
        `;
      }
    }
    openModal(el('weather-modal'));
  });
  on('close-weather-btn', 'click', () => closeModal(el('weather-modal')));

  on('sell-btn', 'click', () => {
    if (gameState.produceInventory.length === 0) {
      showToast("❌ Harvest Bag is empty!");
      return;
    }
    openModal(el('sell-modal'));
    renderSellMainOptions();
  });
  on('close-sell-btn', 'click', () => closeModal(el('sell-modal')));

  on('btn-sell-all-modal', 'click', () => {
    if (gameState.produceInventory.length === 0) return;
    const payout = calculateCashYield(gameState.produceInventory);
    gameState.cash += payout;
    const count = gameState.produceInventory.length;
    gameState.produceInventory = [];
    playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+${formatCash(payout)}! 💰`, "#ffd54f");
    showToast(`💰 Sold all ${count} items for ${formatCash(payout)}!`);
    updateHUD();
    saveGame();
    closeModal(el('sell-modal'));
  });

  on('btn-sell-select-modal', 'click', () => {
    renderSellItemPicker();
  });

  on('btn-sell-bargain-modal', 'click', () => {
    renderBargainNpcView();
  });

  on('qty-minus-btn', 'click', () => {
    if (sellQuantityState.quantityToSell > 1) {
      sellQuantityState.quantityToSell--;
      renderSellQuantityPicker();
    }
  });

  on('qty-plus-btn', 'click', () => {
    const g = sellQuantityState.selectedCropGroup;
    if (g && sellQuantityState.quantityToSell < g.items.length) {
      sellQuantityState.quantityToSell++;
      renderSellQuantityPicker();
    }
  });

  on('qty-confirm-sell-btn', 'click', () => {
    const g = sellQuantityState.selectedCropGroup;
    if (!g) return;
    const toSell = g.items.slice(0, sellQuantityState.quantityToSell);
    const p = calculateCashYield(toSell);
    gameState.cash += p;
    toSell.forEach(item => {
      const idx = gameState.produceInventory.findIndex(x => x.id === item.id);
      if (idx !== -1) gameState.produceInventory.splice(idx, 1);
    });
    playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+${formatCash(p)}! 💰`, "#ffd54f");
    showToast(`💰 Sold ${toSell.length}x ${g.name} for ${formatCash(p)}!`);
    updateHUD();
    saveGame();
    if (gameState.produceInventory.length === 0) {
      closeModal(el('sell-modal'));
    } else {
      renderSellItemPicker();
    }
  });

  on('qty-back-btn', 'click', () => {
    renderSellItemPicker();
  });

  on('btn-start-bargain', 'click', () => {
    if (gameState.cash < currentBargainFee) {
      showToast("❌ Not enough cash for appraisal fee!");
      return;
    }
    if (gameState.produceInventory.length === 0) return;

    gameState.cash -= currentBargainFee;
    updateHUD();

    const roll = Math.random();
    let mult = 1.0;
    let desc = "Standard Market Rate";

    if (roll < 0.35) {
      mult = 0.65;
      desc = "📉 Lowball Offer (0.65× Value)";
    } else if (roll < 0.70) {
      mult = 1.4;
      desc = "📈 Premium Offer (1.4× Value)";
    } else if (roll < 0.92) {
      mult = 2.2;
      desc = "🔥 Merchant's Fortune (2.2× Value!)";
    } else {
      mult = 5.0;
      desc = "🌟 JACKPOT APPRAISAL (5.0× Value!!)";
    }

    currentBargainMultiplier = mult;
    currentBargainPayout = Math.round(currentBargainBase * mult);

    const projectedCashEl = el('npc-projected-cash');
    const dialogueEl = el('npc-dialogue-text');
    const offerTierEl = el('npc-offer-tier');
    const btnStart = el('btn-start-bargain');
    const btnAccept = el('btn-accept-bargain');
    const btnDecline = el('btn-decline-bargain');
    const dailyDealWrapper = el('daily-deal-wrapper');

    if (projectedCashEl) projectedCashEl.textContent = formatCash(currentBargainPayout);
    if (dialogueEl) dialogueEl.textContent = `"I've appraised your stock! My offer is ready."`;
    if (offerTierEl) {
      offerTierEl.textContent = desc;
      offerTierEl.classList.remove('hidden');
    }
    if (btnStart) btnStart.classList.add('hidden');
    if (btnAccept) btnAccept.classList.remove('hidden');
    if (btnDecline) btnDecline.classList.remove('hidden');
    if (dailyDealWrapper) dailyDealWrapper.classList.remove('hidden');
  });

  on('btn-daily-deal', 'click', () => {
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    if (Date.now() - (gameState.lastDailyDealTime || 0) < TWELVE_HOURS) {
      showToast("⏳ Daily Deal is still on cooldown!");
      return;
    }
    gameState.lastDailyDealTime = Date.now();
    isDailyDealActive = true;
    currentBargainMultiplier = 20.0;
    currentBargainPayout = Math.round(currentBargainBase * 20.0);

    const projectedCashEl = el('npc-projected-cash');
    const dialogueEl = el('npc-dialogue-text');
    const offerTierEl = el('npc-offer-tier');
    if (projectedCashEl) projectedCashEl.textContent = formatCash(currentBargainPayout);
    if (dialogueEl) dialogueEl.textContent = `"UNBELIEVABLE! THE 20× DAILY DEAL IS ACTIVE!"`;
    if (offerTierEl) {
      offerTierEl.textContent = "🔥 20X DAILY DEAL BOOST APPLIED!";
      offerTierEl.classList.remove('hidden');
    }
    playSFX('mutate');
    updateDailyDealTimer();
    saveGame();
  });

  on('btn-accept-bargain', 'click', () => {
    if (gameState.produceInventory.length === 0) return;
    gameState.cash += currentBargainPayout;
    const count = gameState.produceInventory.length;
    gameState.produceInventory = [];
    playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+${formatCash(currentBargainPayout)}! 💰`, "#69f0ae");
    showToast(`🧙‍♂️ Bargarnier bought ${count} items for ${formatCash(currentBargainPayout)}!`);
    updateHUD();
    saveGame();
    closeModal(el('sell-modal'));
  });

  on('btn-decline-bargain', 'click', () => {
    showToast("🙅‍♂️ Deal declined.");
    renderSellMainOptions();
  });

  on('btn-bargain-back', 'click', () => {
    renderSellMainOptions();
  });

  on('shop-btn', 'click', () => {
    renderShopItems();
    openModal(el('shop-modal'));
  });
  on('close-shop-btn', 'click', () => closeModal(el('shop-modal')));

  on('shop-tab-normal', 'click', () => {
    gameState.activeShopTab = 'normal';
    const shopTabNormal = el('shop-tab-normal');
    const shopTabEvent = el('shop-tab-event');
    if (shopTabNormal) shopTabNormal.classList.add('active');
    if (shopTabEvent) shopTabEvent.classList.remove('active');
    renderShopItems();
  });

  on('shop-tab-event', 'click', () => {
    if (!gameState.isPrismaticRain) {
      showToast("🔒 Event Shop only opens during Prismatic Paint Rain!");
      return;
    }
    gameState.activeShopTab = 'event';
    const shopTabNormal = el('shop-tab-normal');
    const shopTabEvent = el('shop-tab-event');
    if (shopTabEvent) shopTabEvent.classList.add('active');
    if (shopTabNormal) shopTabNormal.classList.remove('active');
    renderShopItems();
  });

  on('decor-btn', 'click', () => {
    renderDecorShop();
    openModal(el('decor-modal'));
  });
  on('close-decor-btn', 'click', () => closeModal(el('decor-modal')));

  on('tab-fence-skins-btn', 'click', () => {
    const tabFence = el('tab-fence-skins-btn');
    const tabSpecial = el('tab-special-skins-btn');
    const listFence = el('fence-skins-list');
    const listSpecial = el('special-skins-list');
    if (tabFence) tabFence.classList.add('active');
    if (tabSpecial) tabSpecial.classList.remove('active');
    if (listFence) listFence.classList.remove('hidden');
    if (listSpecial) listSpecial.classList.add('hidden');
  });

  on('tab-special-skins-btn', 'click', () => {
    const tabFence = el('tab-fence-skins-btn');
    const tabSpecial = el('tab-special-skins-btn');
    const listFence = el('fence-skins-list');
    const listSpecial = el('special-skins-list');
    if (tabSpecial) tabSpecial.classList.add('active');
    if (tabFence) tabFence.classList.remove('active');
    if (listSpecial) listSpecial.classList.remove('hidden');
    if (listFence) listFence.classList.add('hidden');
  });

  on('articular-skin-toggle-btn', 'click', () => {
    const requiredSeeds = getRequiredCodexSeeds();
    let discoveredCount = 0;
    requiredSeeds.forEach(s => {
      if (gameState.codex[s.id] && gameState.codex[s.id].discovered) discoveredCount++;
    });

    if (discoveredCount >= requiredSeeds.length) {
      gameState.articularSkinActive = !gameState.articularSkinActive;
      updateFenceSkin();
      showToast(gameState.articularSkinActive ? "✨ Equipped Artistic Promise Skin!" : "Equipped Standard Fence.");
      saveGame();
    } else {
      showToast("🔒 Complete 100% of Plant Codex to unlock! (Standard + Event)");
    }
  });

  on('settings-btn', 'click', () => {
    const statsSummaryEl = el('stats-summary');
    if (statsSummaryEl) {
      statsSummaryEl.innerHTML = `<p style="font-size:13px; color:#4e342e; margin-bottom:10px;"><strong>🌟 Farm Level:</strong> ${gameState.level}<br><strong>Unlocked Fields:</strong> ${gameState.unlockedFields} / ${gameState.maxFields}<br><strong>Crops Stored:</strong> ${gameState.produceInventory.length}<br><strong>Current Cash:</strong> ${formatCash(gameState.cash)}<br><strong>Rebirth Rank:</strong> ${gameState.rebirthLevel} (${getRebirthMultiplier().toFixed(1)}× Active)<br><strong>Profile Mode:</strong> ${isPlaytesterMode ? '🧪 Playtester Account' : '🏠 Main Account'}</p>`;
    }
    openModal(el('settings-modal'));
  });
  on('close-settings-btn', 'click', () => closeModal(el('settings-modal')));

  on('btn-verify-gv1', 'click', () => {
    const inp = el('gv1-verify-code');
    const code = inp ? inp.value.trim().toUpperCase() : '';
    if (code === 'GV1VET') {
      gameState.isGv1Veteran = true;
      gameState.seedInventory['venturebloom'] = (gameState.seedInventory['venturebloom'] || 0) + 1;
      localStorage.setItem('gv1_veteran_key', 'true');
      showToast("🏆 GV1 Veteran Verified! +1 VentureBloom Seed granted!");
      playSFX('mutate');
      saveGame();
      updateHUD();
    } else {
      showToast("❌ Invalid Veteran Code!");
    }
  });

  on('btn-open-playtester-menu', 'click', () => {
    updatePlaytesterStatusUI();
    openModal(el('playtester-modal'));
    closeModal(el('settings-modal'));
  });
  on('close-playtester-btn', 'click', () => {
    closeModal(el('playtester-modal'));
    openModal(el('settings-modal'));
  });

  on('btn-toggle-playtester-mode', 'click', () => {
    saveGame();
    isPlaytesterMode = !isPlaytesterMode;
    loadGame();
    updateHUD();
    renderPlots();
    updatePlaytesterStatusUI();
    showToast(isPlaytesterMode ? "🧪 Switched to Playtester Account!" : "🏠 Switched to Main Account!");
  });

  on('btn-reset-playtester', 'click', () => {
    playtesterActionPending = 'reset';
    const title = el('playtester-confirm-title');
    const desc = el('playtester-confirm-desc');
    if (title) title.textContent = "♻️ RESET PLAYTESTER ACCOUNT";
    if (desc) desc.textContent = "This will wipe all data on the Playtester Profile without touching your Main save. Continue?";
    openModal(el('playtester-confirm-modal'));
  });

  on('btn-delete-playtester', 'click', () => {
    playtesterActionPending = 'delete';
    const title = el('playtester-confirm-title');
    const desc = el('playtester-confirm-desc');
    if (title) title.textContent = "🗑️ DELETE PLAYTESTER ACCOUNT";
    if (desc) desc.textContent = "This will permanently remove the Playtester Profile. Continue?";
    openModal(el('playtester-confirm-modal'));
  });

  on('btn-confirm-playtester-action', 'click', () => {
    localStorage.removeItem('gardenVenture2PlaytesterSave');
    if (isPlaytesterMode) {
      gameState = createDefaultGameState();
      initFields();
      updateHUD();
      renderPlots();
    }
    closeModal(el('playtester-confirm-modal'));
    showToast("🧪 Playtester Data Cleared!");
  });

  on('btn-cancel-playtester-action', 'click', () => {
    closeModal(el('playtester-confirm-modal'));
  });

  on('btn-open-admin-auth', 'click', () => {
    const p1 = el('admin-pass-1');
    const p2 = el('admin-pass-2');
    if (p1) p1.value = '';
    if (p2) p2.value = '';
    openModal(el('admin-login-modal'));
    closeModal(el('settings-modal'));
  });

  on('btn-close-admin-login', 'click', () => closeModal(el('admin-login-modal')));

  on('btn-submit-admin', 'click', () => {
    const p1 = el('admin-pass-1') ? el('admin-pass-1').value.trim() : '';
    const p2 = el('admin-pass-2') ? el('admin-pass-2').value.trim() : '';
    
    if (p1 === '0313' && p2 === '789') {
      isAdminAuthenticated = true;
      closeModal(el('admin-login-modal'));
      populateAdminDropdowns();
      openModal(el('admin-modal'));
      showToast("🛡️ Admin Suite Unlocked!");
    } else {
      showToast("❌ Invalid Passwords! Requires Code 1 & Code 2.");
    }
  });

  on('admin-btn-trigger-luck', 'click', () => {
    const lVal = el('admin-luck-select') ? Number(el('admin-luck-select').value) : 2;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'global';
    if (scope === 'global' && db) {
      db.ref('globalRestockLuck').set({ multiplier: lVal, timestamp: getServerTime() });
      showToast(`🌐 Global Luck set to ${lVal}X for everyone!`);
    } else {
      gameState.restockLuckMultiplier = lVal;
      gameState.lastShopCycle = null;
      updateShopForCurrentCycle();
      showToast(`🍀 Local Luck set to ${lVal}X!`);
    }
  });

  on('admin-btn-toggle-weather', 'click', () => {
    const willRain = !gameState.weatherOverride;
    
    if (db) {
      db.ref('globalWeatherOverride').set({
        active: willRain,
        timestamp: getServerTime()
      });
    }
    
    gameState.weatherOverride = willRain;
    updateGlobalCycle();
    updateHUD();
    showToast(willRain ? "🌧️ Prismatic Rain FORCED for everyone!" : "☀️ Natural Weather Cycle RESTORED for everyone!");
  });

  on('admin-btn-grant', 'click', () => {
    const sId = el('admin-seed-select') ? el('admin-seed-select').value : 'carrot';
    const qty = el('admin-seed-qty') ? Math.max(1, Number(el('admin-seed-qty').value)) : 5;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'seed', seedId: sId, amount: qty, timestamp: getServerTime() });
      showToast(`🌱 Granted ${qty}x ${sId} to EVERYONE!`);
    } else {
      gameState.seedInventory[sId] = (gameState.seedInventory[sId] || 0) + qty;
      updateHUD();
      showToast(`🌱 Granted ${qty}x ${sId}!`);
    }
  });

  on('admin-btn-grant-og', 'click', () => {
    const qty = el('admin-og-seed-qty') ? Math.max(1, Number(el('admin-og-seed-qty').value)) : 1;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'seed', seedId: 'venturebloom', amount: qty, timestamp: getServerTime() });
      showToast(`🏆 Granted ${qty}x VentureBloom (OG) to EVERYONE!`);
    } else {
      gameState.seedInventory['venturebloom'] = (gameState.seedInventory['venturebloom'] || 0) + qty;
      updateHUD();
      showToast(`🏆 Granted ${qty}x VentureBloom (OG)!`);
    }
  });

  on('admin-btn-restock', 'click', () => {
    const sId = el('admin-restock-select') ? el('admin-restock-select').value : 'carrot';
    const qty = el('admin-restock-qty') ? Math.max(1, Number(el('admin-restock-qty').value)) : 5;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'restock', seedId: sId, amount: qty, timestamp: getServerTime() });
      showToast(`🛒 Restocked for EVERYONE!`);
    } else {
      const s = SEED_CATALOG.find(x => x.id === sId);
      if (s) s.currentStock = qty;
      renderShopItems();
      showToast(`🛒 Local stock updated!`);
    }
  });

  on('admin-btn-grant-cash', 'click', () => {
    const amt = el('admin-cash-qty') ? Math.max(1, Number(el('admin-cash-qty').value)) : 1000000;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'cash', amount: amt, timestamp: getServerTime() });
      showToast(`💰 Sent ${formatCash(amt)} to EVERYONE!`);
    } else {
      gameState.cash += amt;
      updateHUD();
      playSFX('sell');
      showToast(`💰 Added ${formatCash(amt)}!`);
    }
  });

  on('admin-btn-skip-grow', 'click', () => {
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';
    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'skipGrow', timestamp: getServerTime() });
      showToast(`⏳ Matured all crops for EVERYONE!`);
    } else {
      gameState.fields.forEach(field => {
        field.forEach(p => {
          if (p.crop && !p.isReady) {
            p.progress = 100;
            p.isReady = true;
          }
        });
      });
      playSFX('sell');
      updateHUD();
      renderPlots();
      showToast("⏳ Matured all crops!");
    }
  });

  on('admin-btn-broadcast', 'click', () => {
    const msg = el('admin-broadcast-msg') ? el('admin-broadcast-msg').value.trim() : '';
    if (msg && db) {
      db.ref('adminCommands').push({ type: 'broadcast', message: msg, timestamp: getServerTime() });
      el('admin-broadcast-msg').value = '';
    }
  });

  on('btn-close-admin-suite', 'click', () => closeModal(el('admin-modal')));

  on('btn-unlock-field', 'click', () => {
    const req = FIELD_LEVEL_REQS[gameState.currentField];
    if (gameState.level >= req) {
      gameState.unlockedFields++;
      playSFX('sell');
      showToast(`🎉 Field ${gameState.currentField + 1} Unlocked!`);
      updateHUD();
      renderPlots();
      saveGame();
    } else {
      showToast(`❌ Need Level ${req}!`);
    }
  });

  on('prev-field-btn', 'click', (e) => {
    e.stopPropagation();
    const plotsGrid = el('plots-grid');
    if (gameState.currentField > 0 && plotsGrid) {
      plotsGrid.classList.add('slide-out-right');
      setTimeout(() => {
        gameState.currentField--;
        updateHUD();
        renderPlots();
        plotsGrid.classList.remove('slide-out-right');
      }, 150);
    }
  });

  on('next-field-btn', 'click', (e) => {
    e.stopPropagation();
    const plotsGrid = el('plots-grid');
    if (gameState.currentField < gameState.maxFields - 1 && plotsGrid) {
      plotsGrid.classList.add('slide-out-left');
      setTimeout(() => {
        gameState.currentField++;
        updateHUD();
        renderPlots();
        plotsGrid.classList.remove('slide-out-left');
      }, 150);
    }
  });

  on('seed-bag-btn', 'click', () => toggleDrawer(el('seed-bag-drawer')));
  on('close-drawer-btn', 'click', () => closeDrawer(el('seed-bag-drawer')));
  on('tab-seeds-btn', 'click', () => { gameState.activeDrawerTab = 'seeds'; renderSeedDrawer(); });
  on('tab-produce-btn', 'click', () => { gameState.activeDrawerTab = 'produce'; renderSeedDrawer(); });

  on('open-index-btn', 'click', () => {
    renderIndexCodex();
    openModal(el('index-modal'));
  });
  on('close-index-btn', 'click', () => closeModal(el('index-modal')));
  on('close-index-bottom-btn', 'click', () => closeModal(el('index-modal')));
  on('close-perm-info-btn', 'click', () => closeModal(el('permanent-info-modal')));

  on('btn-confirm-skip', 'click', () => {
    if (!currentSkipTarget) return;
    if (gameState.cash >= currentSkipTarget.cost) {
      gameState.cash -= currentSkipTarget.cost;
      const p = gameState.fields[gameState.currentField][currentSkipTarget.plotIndex];
      if (p) {
        if (currentSkipTarget.isFruit) {
          p.vineFruits[currentSkipTarget.fruitIndex].progress = 100;
          p.vineFruits[currentSkipTarget.fruitIndex].isReady = true;
          renderVineModalContent();
        } else {
          p.progress = 100;
          p.isReady = true;
        }
      }
      playSFX('sell');
      closeModal(el('skip-timer-modal'));
      updateHUD();
      renderPlots();
      saveGame();
    } else {
      showToast("❌ Not enough cash to skip!");
    }
  });
  on('btn-close-skip', 'click', () => closeModal(el('skip-timer-modal')));

  on('harvest-all-vine-btn', 'click', () => {
    if (gameState.selectedVinePlotIndex === null) return;
    const p = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex];
    if (!p || !p.vineFruits) return;
    let hCount = 0;

    p.vineFruits.forEach(f => {
      if (f.isReady) {
        const sKg = f.rolledKg || p.crop.minKg || 0.1;
        const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, true, p.isHoloMutated);
        addXP(Math.ceil((p.crop.baseGrowTime * 1.5) / (p.crop.maxFruits || 3)));
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: p.crop.minM, value: earn, isHolo: p.isHoloMutated });
        f.progress = 0;
        f.isReady = false;
        const rs = rollFruitStats(p.crop);
        f.rolledKg = rs.fruitKg;
        f.growTime = rs.fruitGrowTime;
        hCount++;
      }
    });

    if (hCount > 0) {
      playSFX('harvest');
      showToast(`🎒 Harvested ${hCount} Vine fruits!`);
      updateHUD();
      renderVineModalContent();
      saveGame();
    }
  });

  on('close-vine-btn', 'click', () => closeModal(el('vine-modal')));

  on('btn-open-reset-confirm', 'click', () => {
    openModal(el('reset-confirm-modal'));
    closeModal(el('settings-modal'));
  });

  on('btn-confirm-reset', 'click', () => {
    if (isPlaytesterMode) {
      localStorage.removeItem('gardenVenture2PlaytesterSave');
    } else {
      localStorage.removeItem('gardenVenture2Save');
      localStorage.removeItem('gv1_veteran_key');
      localStorage.removeItem('gv2_admin_auth');
    }
    
    gameState = createDefaultGameState();
    
    clearPrismaticGlobs();
    const rainLayer = el('prismatic-rain-layer');
    if (rainLayer) {
      rainLayer.classList.add('hidden');
      rainLayer.innerHTML = '';
    }
    document.body.className = 'day-theme';

    initFields();
    updateFenceSkin();
    updateHUD();
    renderPlots();
    
    closeModal(el('reset-confirm-modal'));
    showToast("♻️ Save Data wiped!");
    setTimeout(() => { location.reload(); }, 500);
  });
  on('btn-cancel-reset', 'click', () => closeModal(el('reset-confirm-modal')));

  on('rebirth-btn', 'click', () => {
    renderRebirthModal();
    openModal(el('rebirth-modal'));
  });
  on('close-rebirth-btn', 'click', () => closeModal(el('rebirth-modal')));

  on('tab-rebirth-shrine', 'click', () => {
    const tabShrine = el('tab-rebirth-shrine');
    const tabPerks = el('tab-rebirth-perks');
    const viewShrine = el('rebirth-shrine-view');
    const viewPerks = el('rebirth-perks-view');
    if (tabShrine) tabShrine.classList.add('active');
    if (tabPerks) tabPerks.classList.remove('active');
    if (viewShrine) viewShrine.classList.remove('hidden');
    if (viewPerks) viewPerks.classList.add('hidden');
    renderRebirthModal();
  });

  on('tab-rebirth-perks', 'click', () => {
    const tabShrine = el('tab-rebirth-shrine');
    const tabPerks = el('tab-rebirth-perks');
    const viewShrine = el('rebirth-shrine-view');
    const viewPerks = el('rebirth-perks-view');
    if (tabPerks) tabPerks.classList.add('active');
    if (tabShrine) tabShrine.classList.remove('active');
    if (viewPerks) viewPerks.classList.remove('hidden');
    if (viewShrine) viewShrine.classList.add('hidden');
  });

  on('btn-do-rebirth', 'click', () => {
    const reqs = getRebirthRequirements();
    if (gameState.level >= reqs.levelReq && gameState.cash >= reqs.cashReq) {
      gameState.rebirthLevel++;
      gameState.cash = 25;
      gameState.level = 1;
      gameState.xp = 0;
      gameState.unlockedFields = 1;
      gameState.currentField = 0;
      gameState.produceInventory = [];
      initFields();

      playSFX('rebirth');
      createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 60, `ASCENDED TO REBIRTH ${gameState.rebirthLevel}! ♻️✨`, "#00e5ff");
      showToast(`🎉 Ascended to Rebirth ${gameState.rebirthLevel}! Permanent Multiplier Activated!`);

      updateHUD();
      renderPlots();
      renderRebirthModal();
      saveGame();
      closeModal(el('rebirth-modal'));
    }
  });

  on('friends-btn', 'click', () => openModal(el('friends-modal')));
  on('close-friends-btn', 'click', () => closeModal(el('friends-modal')));

  on('tab-public-trade', 'click', () => {
    const tabPublic = el('tab-public-trade');
    const tabPrivate = el('tab-private-trade');
    const tabChat = el('tab-global-chat');
    const viewPublic = el('public-trade-view');
    const viewPrivate = el('private-trade-view');
    const viewChat = el('global-chat-view');
    if (tabPublic) tabPublic.classList.add('active');
    if (tabPrivate) tabPrivate.classList.remove('active');
    if (tabChat) tabChat.classList.remove('active');
    if (viewPublic) viewPublic.classList.remove('hidden');
    if (viewPrivate) viewPrivate.classList.add('hidden');
    if (viewChat) viewChat.classList.add('hidden');
  });

  on('tab-private-trade', 'click', () => {
    const tabPublic = el('tab-public-trade');
    const tabPrivate = el('tab-private-trade');
    const tabChat = el('tab-global-chat');
    const viewPublic = el('public-trade-view');
    const viewPrivate = el('private-trade-view');
    const viewChat = el('global-chat-view');
    if (tabPrivate) tabPrivate.classList.add('active');
    if (tabPublic) tabPublic.classList.remove('active');
    if (tabChat) tabChat.classList.remove('active');
    if (viewPrivate) viewPrivate.classList.remove('hidden');
    if (viewPublic) viewPublic.classList.add('hidden');
    if (viewChat) viewChat.classList.add('hidden');
  });

  on('tab-global-chat', 'click', () => {
    const tabPublic = el('tab-public-trade');
    const tabPrivate = el('tab-private-trade');
    const tabChat = el('tab-global-chat');
    const viewPublic = el('public-trade-view');
    const viewPrivate = el('private-trade-view');
    const viewChat = el('global-chat-view');
    if (tabChat) tabChat.classList.add('active');
    if (tabPublic) tabPublic.classList.remove('active');
    if (tabPrivate) tabPrivate.classList.remove('active');
    if (viewChat) viewChat.classList.remove('hidden');
    if (viewPublic) viewPublic.classList.add('hidden');
    if (viewPrivate) viewPrivate.classList.add('hidden');
    const chatContainer = el('chat-messages-container');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  });

  on('btn-send-private-trade', 'click', () => {
    const privateTradeIdInput = el('private-trade-id-input');
    const t = privateTradeIdInput ? privateTradeIdInput.value.trim() : '';
    if (t && t !== myPlayerId) sendTradeRequest(t);
  });

  on('btn-decline-trade', 'click', () => {
    if (db) db.ref('players/' + myPlayerId + '/tradeRequest').remove();
    closeModal(el('trade-request-modal'));
  });

  on('btn-accept-trade', 'click', () => {
    const p = pendingTradeReq;
    const tId = myPlayerId + "_" + p + "_" + Date.now();
    if (db) {
      db.ref('trades/' + tId).set({ p1: myPlayerId, p2: p, p1Ready: false, p2Ready: false, status: 'negotiating' });
      db.ref('players/' + myPlayerId + '/tradeRequest').remove();
      db.ref('players/' + myPlayerId).update({ activeTrade: tId, inTrade: true });
      db.ref('players/' + p).update({ activeTrade: tId, inTrade: true });
    }
  });

  on('btn-trade-cancel', 'click', () => {
    if (currentTradeId && db) db.ref('trades/' + currentTradeId).update({ status: 'cancelled' });
  });

  on('btn-trade-ready', 'click', () => {
    if (currentTradeId && db) {
      amIReady = !amIReady;
      const btnReady = el('btn-trade-ready');
      if (btnReady) btnReady.style.filter = amIReady ? "brightness(0.6)" : "brightness(1)";
      db.ref('trades/' + currentTradeId).once('value', snap => {
        const t = snap.val();
        if (t) {
          const mk = t.p1 === myPlayerId ? 'p1Ready' : 'p2Ready';
          const tk = t.p1 === myPlayerId ? 'p2Ready' : 'p1Ready';
          db.ref('trades/' + currentTradeId).update({ [mk]: amIReady });
          if (amIReady && t[tk] === true) db.ref('trades/' + currentTradeId).update({ status: 'completed' });
        }
      });
    }
  });

  on('btn-open-backpack', 'click', () => {
    if (amIReady) return;
    openModal(el('trade-backpack-modal'));
    renderTradeBackpack('seeds');
  });
  on('btn-close-trade-backpack', 'click', () => closeModal(el('trade-backpack-modal')));

  on('trade-tab-seeds', 'click', () => renderTradeBackpack('seeds'));
  on('trade-tab-produce', 'click', () => renderTradeBackpack('produce'));

  on('btn-send-chat', 'click', () => {
    const chatInput = el('chat-input');
    const msg = chatInput ? chatInput.value.trim() : '';
    if (msg !== '' && isOnline && !isPlaytesterMode && db) {
      db.ref('chat').push({ sender: myPlayerId, text: msg, timestamp: getServerTime() });
      chatInput.value = '';
    }
  });
}

function initGame() {
  initFields();
  buildPlotDOMStructure();
  initSplashScreen();
  loadGame();
  
  updateGlobalCycle();
  initGlobalShop();
  updateFenceSkin();
  updateHUD();
  renderPlots();
  setupDOMEventListeners();
  initFirebasePresence();
  
  setInterval(gameLoop, 100);
  setInterval(secondTick, 1000);
  setInterval(saveGame, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
