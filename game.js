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

function getOrCreatePlayerId() {
  let pid = localStorage.getItem('gv2_playerId') || localStorage.getItem('playerId');
  if (!pid || pid === 'undefined' || pid === 'null') {
    pid = Math.floor(10000000 + Math.random() * 90000000).toString();
    localStorage.setItem('gv2_playerId', pid);
  }
  return pid;
}

let myPlayerId = getOrCreatePlayerId();

const SEED_CATALOG = [
  { id: 'carrot', name: 'Carrot Seed', icon: '🥕', rarity: 'common', affinity: 'all', cost: 45, maxStock: 10, currentStock: 10, baseGrowTime: 8, baseSellPrice: 12, minKg: 20, baseMaxKg: 100, minM: 0.2, maxM: 0.8, isVine: false, fusionPower: 1 },
  { id: 'potato', name: 'Potato Seed', icon: '🥔', rarity: 'common', affinity: 'all', cost: 110, maxStock: 8, currentStock: 8, baseGrowTime: 14, baseSellPrice: 28, minKg: 20, baseMaxKg: 100, minM: 0.3, maxM: 1.0, isVine: false, fusionPower: 1 },
  { id: 'tomato', name: 'Tomato Seed', icon: '🍅', rarity: 'uncommon', affinity: 'all', cost: 280, maxStock: 6, currentStock: 6, baseGrowTime: 20, baseSellPrice: 75, minKg: 20, baseMaxKg: 100, minM: 0.5, maxM: 1.8, isVine: false, fusionPower: 2 },
  { id: 'glowshroom', name: 'Glowshroom Seed', icon: '🍄', rarity: 'uncommon', affinity: 'night', cost: 650, maxStock: 5, currentStock: 5, baseGrowTime: 25, baseSellPrice: 165, minKg: 20, baseMaxKg: 100, minM: 0.6, maxM: 2.2, isVine: false, fusionPower: 3 },
  { id: 'grape_vine', name: 'Grape Vine Seed', icon: '🍇', rarity: 'uncommon', affinity: 'all', cost: 1500, maxStock: 5, currentStock: 5, baseGrowTime: 35, baseSellPrice: 40, minKg: 15, baseMaxKg: 80, minM: 1.2, maxM: 3.0, isVine: true, produceIcon: '🍇', produceName: 'Grape Cluster', maxFruits: 3, fusionPower: 4 },
  { id: 'starfruit', name: 'Star Fruit Seed', icon: '⭐', rarity: 'rare', affinity: 'all', cost: 4500, maxStock: 4, currentStock: 4, baseGrowTime: 40, baseSellPrice: 850, minKg: 20, baseMaxKg: 100, minM: 1.0, maxM: 3.5, isVine: false, fusionPower: 6 },
  { id: 'watermelon_vine', name: 'Watermelon Vine', icon: '🍉', rarity: 'rare', affinity: 'all', cost: 12000, maxStock: 3, currentStock: 3, baseGrowTime: 55, baseSellPrice: 240, minKg: 25, baseMaxKg: 120, minM: 1.5, maxM: 4.5, isVine: true, produceIcon: '🍉', produceName: 'Giant Watermelon', maxFruits: 3, fusionPower: 7 },
  { id: 'sunflower', name: 'Sunflower Seed', icon: '🌻', rarity: 'legendary', affinity: 'day', cost: 55000, maxStock: 3, currentStock: 3, baseGrowTime: 60, baseSellPrice: 4800, minKg: 20, baseMaxKg: 100, minM: 1.0, maxM: 5.0, isVine: false, fusionPower: 9 },
  { id: 'nectarroot', name: 'Nectar Root Seed', icon: '🌸', rarity: 'legendary', affinity: 'all', cost: 85000, maxStock: 3, currentStock: 3, baseGrowTime: 70, baseSellPrice: 7200, minKg: 20, baseMaxKg: 100, minM: 2.0, maxM: 6.0, isVine: false, fusionPower: 10 },
  { id: 'strawberry', name: 'Strawberry Seed', icon: '🍓', rarity: 'astral', affinity: 'night', cost: 350000, maxStock: 2, currentStock: 2, baseGrowTime: 90, baseSellPrice: 19500, minKg: 20, baseMaxKg: 100, minM: 2.5, maxM: 8.0, isVine: false, fusionPower: 13 },
  { id: 'cosmic_rose', name: 'Cosmic Rose Seed', icon: '🌹', rarity: 'astral', affinity: 'night', cost: 850000, maxStock: 2, currentStock: 2, baseGrowTime: 100, baseSellPrice: 42000, minKg: 20, baseMaxKg: 100, minM: 1.0, maxM: 3.5, isVine: false, fusionPower: 15 },
  { id: 'singularity', name: 'Singularity Sprout Seed', icon: '🌌', rarity: 'transcendent', affinity: 'all', cost: 15000000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 850000, minKg: 25, baseMaxKg: 120, minM: 3.0, maxM: 12.0, isVine: false, fusionPower: 22 },
  { id: 'celestial_moon', name: 'Celestial Moon Seed', icon: '🌙', rarity: 'transcendent', affinity: 'all', cost: 180000000, maxStock: 1, currentStock: 0, baseGrowTime: 150, baseSellPrice: 5800000, minKg: 30, baseMaxKg: 150, minM: 4.0, maxM: 15.0, isVine: true, produceIcon: '⭐', produceName: 'Celestial Star', maxFruits: 3, fusionPower: 25 }
];

const EVENT_SEED_CATALOG = [
  { id: 'paintroot', name: 'Paintroot Seed', icon: '🌱', rarity: 'event', affinity: 'all', cost: 125000, maxStock: 3, currentStock: 3, baseGrowTime: 65, baseSellPrice: 38000, minKg: 20, baseMaxKg: 100, minM: 0.5, maxM: 2.0, isVine: false, cssClass: 'plant-paintroot', isEventSeed: true, fusionPower: 8 },
  { id: 'splatterbloom', name: 'Splatterbloom Seed', icon: '🌸', rarity: 'event', affinity: 'all', cost: 450000, maxStock: 2, currentStock: 2, baseGrowTime: 85, baseSellPrice: 150000, minKg: 20, baseMaxKg: 100, minM: 1.0, maxM: 3.5, isVine: false, cssClass: 'plant-splatterbloom', isEventSeed: true, fusionPower: 10 },
  { id: 'holofern', name: 'Holofern Seed', icon: '🌿', rarity: 'event', affinity: 'all', cost: 18000000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 11000000, minKg: 25, baseMaxKg: 120, minM: 2.0, maxM: 6.0, isVine: true, produceIcon: '🌿', produceName: 'Holofern Frond', maxFruits: 3, cssClass: 'plant-holofern', isEventSeed: true, fusionPower: 18 }
];

const OG_SEED_CATALOG = [
  { id: 'venturebloom', name: 'VentureBloom Seed', icon: '🌸', rarity: 'og', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 45, baseSellPrice: 32000, minKg: 20, baseMaxKg: 100, minM: 0.5, maxM: 2.5, isVine: false, cssClass: 'plant-venturebloom', isOG: true, fusionPower: 12 }
];

const FUSION_SEED_CATALOG = [
  { id: 'berryblossom', name: 'BerryBlossom Seed', icon: '🌸', rarity: 'common', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 30, baseSellPrice: 65, minKg: 20, baseMaxKg: 100, minM: 0.3, maxM: 1.0, isVine: false, isFusionSeed: true, fusionPower: 3 },
  { id: 'spore_mushroom', name: 'Spore Mushroom Seed', icon: '🍄', rarity: 'common', affinity: 'night', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 38, baseSellPrice: 95, minKg: 20, baseMaxKg: 100, minM: 0.4, maxM: 1.2, isVine: false, isFusionSeed: true, fusionPower: 4 },
  { id: 'cococatus', name: 'CocoCatus', icon: '🌵', rarity: 'uncommon', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 50, baseSellPrice: 65, minKg: 20, baseMaxKg: 100, minM: 0.6, maxM: 2.0, isVine: true, produceIcon: '🥥', produceName: 'Coconut', maxFruits: 3, isFusionSeed: true, fusionPower: 6 },
  { id: 'banana_pepper', name: 'Banana Pepper Seed', icon: '🍌🌶️', rarity: 'uncommon', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 60, baseSellPrice: 420, minKg: 20, baseMaxKg: 100, minM: 0.5, maxM: 1.8, isVine: false, isFusionSeed: true, fusionPower: 7 },
  { id: 'cherrylime', name: 'CherryLime Seed', icon: '🍒', rarity: 'rare', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 75, baseSellPrice: 1550, minKg: 20, baseMaxKg: 100, minM: 0.8, maxM: 2.8, isVine: false, isFusionSeed: true, fusionPower: 10 },
  { id: 'bubblebloom', name: 'BubbleBloom Seed', icon: '🫧', rarity: 'rare', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 85, baseSellPrice: 2100, minKg: 20, baseMaxKg: 100, minM: 1.0, maxM: 3.2, isVine: false, isFusionSeed: true, fusionPower: 11 },
  { id: 'moonmelon', name: 'MoonMelon Seed', icon: '🌙', rarity: 'astral', affinity: 'night', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 110, baseSellPrice: 38000, minKg: 25, baseMaxKg: 120, minM: 2.0, maxM: 6.5, isVine: true, produceIcon: '🍉', produceName: 'MoonMelon Slice', maxFruits: 3, isFusionSeed: true, cssClass: 'plant-moonmelon', fusionPower: 16 },
  { id: 'solarbloom', name: 'SolarBloom Seed', icon: '☀️', rarity: 'transcendent', affinity: 'day', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 180, baseSellPrice: 7500000, minKg: 30, baseMaxKg: 150, minM: 3.5, maxM: 14.0, isVine: false, isFusionSeed: true, cssClass: 'plant-solarbloom', fusionPower: 25 }
];

const STREAK_SEED_CATALOG = [
  { id: 'streak_seed', name: 'Streak Seed', icon: '🔥', rarity: 'exclusive', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 70, baseSellPrice: 125000, minKg: 20, baseMaxKg: 100, minM: 1.0, maxM: 4.0, isVine: false, isExclusive: true, cssClass: 'plant-streak-seed', fusionPower: 14 }
];

const FENCE_SKINS_CATALOG = [
  { id: 'twig-tangle', name: 'Twig Tangle', rarity: 'common', cost: 4500, maxStock: 1, currentStock: 1 },
  { id: 'garden-rail', name: 'Garden Rail', rarity: 'common', cost: 9500, maxStock: 1, currentStock: 1 },
  { id: 'bamboo-braid', name: 'Bamboo Braid', rarity: 'uncommon', cost: 48000, maxStock: 1, currentStock: 1 },
  { id: 'mossbound', name: 'Mossbound', rarity: 'uncommon', cost: 95000, maxStock: 1, currentStock: 1 },
  { id: 'vinebound', name: 'Vinebound', rarity: 'rare', cost: 420000, maxStock: 1, currentStock: 1 },
  { id: 'flowerwoven', name: 'Flowerwoven', rarity: 'rare', cost: 850000, maxStock: 1, currentStock: 1 },
  { id: 'paintsplashed', name: 'Paintsplashed', rarity: 'legendary', cost: 6500000, maxStock: 1, currentStock: 0 },
  { id: 'crystalwood', name: 'Crystalwood', rarity: 'legendary', cost: 18500000, maxStock: 1, currentStock: 0 },
  { id: 'stargrove', name: 'Stargrove', rarity: 'astral', cost: 85000000, maxStock: 1, currentStock: 0 },
  { id: 'moonroot', name: 'Moonroot', rarity: 'astral', cost: 225000000, maxStock: 1, currentStock: 0 },
  { id: 'holofoil-garden', name: 'Holofoil Garden', rarity: 'transcendent', cost: 850000000, maxStock: 1, currentStock: 0 },
  { id: 'prismatic-gate', name: 'Prismatic Gate', rarity: 'transcendent', cost: 2200000000, maxStock: 1, currentStock: 0 }
];

function getAllGameSeeds() {
  return [].concat(SEED_CATALOG, EVENT_SEED_CATALOG, OG_SEED_CATALOG, FUSION_SEED_CATALOG, STREAK_SEED_CATALOG).filter(Boolean);
}

function getRequiredCodexSeeds() {
  return [].concat(SEED_CATALOG, EVENT_SEED_CATALOG).filter(Boolean);
}

function getAllMasterIndexSeeds() {
  return [].concat(SEED_CATALOG, EVENT_SEED_CATALOG, FUSION_SEED_CATALOG, STREAK_SEED_CATALOG, OG_SEED_CATALOG).filter(Boolean);
}

function createDefaultGameState() {
  return {
    cash: 50,
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
    currentFenceSkin: 'classic',
    ownedFenceSkins: ['classic'],
    isGv1Veteran: false,
    hasOgBadge: false,
    articularSkinActive: false,
    isDay: false,
    isDawn: true,
    isDusk: false,
    isPrismaticRain: false,
    weatherOverride: false,
    restockLuckMultiplier: 1.0,
    fuseLuckMultiplier: 1.0,
    cycleTimeLeft: 300,
    shopRefillTimeLeft: 180,
    bgmMuted: false,
    sfxMuted: false,
    lastDailyDealTime: 0,
    dailyStreak: 0,
    lastDailyClaimTime: 0,
    fusionTokens: 0,
    activeFusion: null,
    fuseSlots: [null, null, null, null],
    seedInventory: {
      carrot: 5, potato: 0, tomato: 0, glowshroom: 0, grape_vine: 0, starfruit: 0,
      watermelon_vine: 0, sunflower: 0, nectarroot: 0, strawberry: 0, cosmic_rose: 0,
      singularity: 0, celestial_moon: 0, paintroot: 0, splatterbloom: 0, holofern: 0,
      venturebloom: 0, berryblossom: 0, spore_mushroom: 0, cococatus: 0, banana_pepper: 0,
      cherrylime: 0, bubblebloom: 0, moonmelon: 0, solarbloom: 0, streak_seed: 0
    },
    produceInventory: [],
    codex: { carrot: { discovered: true, totalHarvested: 0 } },
    fusionCodex: {},
    holoCodex: {},
    fields: [],
    lastShopCycle: null
  };
}

let gameState = createDefaultGameState();
let isPlaytesterMode = false;
let playtesterActionPending = null;
let isAdminAuthenticated = false;

const FIELD_LEVEL_REQS = [1, 50, 150, 300, 1000];
const PLOTS_PER_FIELD = 9;

let currentBargainFee = 0, currentBargainBase = 0, currentBargainMultiplier = 1.0, currentBargainPayout = 0, isDailyDealActive = false;
let currentSkipTarget = null, lastSkipTime = 0, isOnline = false;
let sellQuantityState = { selectedCropGroup: null, quantityToSell: 1 };
let lastTickTime = Date.now();
let audioCtx = null, lofiTimer = null, chordIndex = 0, plotDomNodes = [];
let pendingTradeReq = null, currentTradeId = null, amIReady = false, myOfferedItems = [];
let serverTimeOffset = 0, timeSynced = false;
let currentPickerSlotIndex = 0;
let pendingStreakPlotIndex = null;
let expandedIndexCards = {};

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
  const target = el(id);
  if (target) {
    target.addEventListener(event, fn);
  }
}

const dayChords = [
  [261.63, 329.63, 392.00, 493.88],
  [220.00, 261.63, 329.63, 392.00],
  [174.61, 220.00, 261.63, 329.63],
  [196.00, 246.94, 293.66, 349.23]
];

const nightChords = [
  [261.63, 329.63, 392.00, 493.88, 587.33],
  [220.00, 261.63, 329.63, 392.00],
  [146.83, 220.00, 261.63, 349.23, 440.00],
  [174.61, 207.65, 261.63, 311.13, 392.00]
];

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
    } else if (type === 'sell' || type === 'reward') {
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
    } else if (type === 'fusionStart') {
      [180, 260, 390, 520, 780].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.1, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } else if (type === 'fusionComplete') {
      [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.15, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.35);
      });
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
  const particlesLayer = el('particles-layer') || document.body;
  const elem = document.createElement('div');
  elem.className = 'floating-text';
  elem.textContent = text;
  elem.style.left = `${Math.max(10, x - 30)}px`;
  elem.style.top = `${Math.max(10, y - 30)}px`;
  if (color) elem.style.color = color;
  particlesLayer.appendChild(elem);
  setTimeout(() => { elem.remove(); }, 950);
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

function rollCropWeight(seed) {
  const rand = Math.random();
  let kg = 0;
  
  if (rand < 0.005) {
    const subRoll = (0.005 - rand) / 0.005;
    kg = 500 + Math.pow(subRoll, 1.8) * 1500 + Math.random() * 200;
  } else if (rand < 0.155) {
    const subRoll = (0.155 - rand) / 0.15;
    kg = 200 + subRoll * 299;
  } else {
    const minK = seed.minKg || 20;
    const maxK = seed.baseMaxKg || 100;
    kg = minK + Math.random() * (maxK - minK);
  }
  kg = Math.round(kg * 10) / 10;

  const baseM = (seed.minM || 0.3) + Math.random() * ((seed.maxM || 1.2) - (seed.minM || 0.3));
  let finalMeters = baseM;
  if (kg > 100) {
    finalMeters = baseM * Math.min(6, 1 + Math.log10(kg / 50));
  }
  finalMeters = Math.round(finalMeters * 10) / 10;

  return { rolledKg: kg, rolledMeters: finalMeters };
}

function calculateProduceEarnings(baseSellPrice, kg, isVine, isHolo, isRainBoosted = false) {
  const base = Number(baseSellPrice) || 12;
  const weight = Number(kg) || 20;
  let multiplier = 1;

  if (weight <= 100) {
    multiplier = (weight / 20) * 1.5;
  } else if (weight <= 200) {
    multiplier = 7.5 + Math.pow((weight - 100) / 100, 1.5) * 20;
  } else if (weight <= 500) {
    multiplier = 27.5 + Math.pow((weight - 200) / 300, 2) * 500;
  } else {
    const excess = (weight - 500) / 500;
    multiplier = 528 + Math.pow(excess + 1, 3.8) * 6000;
  }

  if (isVine) multiplier *= 0.4;
  let total = Math.round(base * multiplier);
  if (isHolo) total = Math.round(total * 4.0);
  if (isRainBoosted || gameState.isPrismaticRain) total = Math.round(total * 1.15);
  return Math.max(1, total);
}

function rollFruitStats(c) {
  const r = rollCropWeight(c);
  let finalTime = c.baseGrowTime * (1 + (r.rolledKg / (c.baseMaxKg || 100)) * 0.05);
  finalTime = Math.max(10, Math.round(finalTime));
  return { fruitKg: r.rolledKg, fruitGrowTime: finalTime, fruitMeters: r.rolledMeters };
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
    playSFX('harvest');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 50, `LEVEL UP! -> ${gameState.level} 🌟`, "#ffe082");
    showToast(`🌟 Level Up! You are now Level ${gameState.level}!`);
    if (isOnline && !isPlaytesterMode && db) {
      db.ref('players/' + myPlayerId).update({ level: gameState.level });
    }
  }
  updateHUD();
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
    showToast("🏆 OG BADGE UNLOCKED! Permanent 1.0× Boost Added!");
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 40, "🏆 OG BADGE EARNED!", "#ffd700");
    playSFX('mutate');
  }

  const mult = getRebirthMultiplier();
  return Math.round(subtotal * mult);
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

function getFusionPowerForProduce(p) {
  if (!p) return 0;
  const allSeeds = getAllGameSeeds();
  const seed = allSeeds.find(s => s.id === p.seedId);
  let baseFP = seed ? (seed.fusionPower || 1) : 1;
  if (p.isHolo) baseFP += 2;
  return baseFP;
}

function calculateFusionOddsAndStats() {
  const selectedProduce = gameState.fuseSlots
    .map(id => gameState.produceInventory.find(i => i.id === id))
    .filter(Boolean);
    
  if (selectedProduce.length !== 4) {
    return { ready: false, fusionPower: 0, holoOdds: 0, cost: 0, oddsMap: {}, isTranscendentEligible: false };
  }

  let totalFP = 0;
  let holoCount = 0;

  selectedProduce.forEach(item => {
    totalFP += getFusionPowerForProduce(item);
    if (item.isHolo) holoCount++;
  });

  const fuseLuck = Number(gameState.fuseLuckMultiplier) || 1.0;

  let holoOdds = 0;
  if (holoCount === 1) holoOdds = 12;
  else if (holoCount === 2) holoOdds = 28;
  else if (holoCount === 3) holoOdds = 60;
  else if (holoCount === 4) holoOdds = 95;

  holoOdds = Math.min(100, Math.round(holoOdds * Math.sqrt(fuseLuck)));

  const cost = Math.round(1500 + totalFP * 3200 + Math.pow(totalFP, 2.2) * 120);
  const isTranscendentEligible = (totalFP >= 41 || fuseLuck >= 4.0);

  let wCommon = 0, wUncommon = 0, wRare = 0, wAstral = 0, wTranscendent = 0;

  if (totalFP <= 10) {
    wCommon = 80; wUncommon = 20; wRare = 0; wAstral = 0; wTranscendent = 0;
  } else if (totalFP <= 20) {
    wCommon = 45; wUncommon = 40; wRare = 15; wAstral = 0; wTranscendent = 0;
  } else if (totalFP <= 30) {
    wCommon = 15; wUncommon = 35; wRare = 45; wAstral = 5; wTranscendent = 0;
  } else if (totalFP <= 40) {
    wCommon = 5; wUncommon = 20; wRare = 55; wAstral = 20; wTranscendent = 0;
  } else {
    const excess = Math.min(20, totalFP - 41);
    wTranscendent = 5 + excess * 1.0;
    wAstral = 35 + excess * 0.5;
    wRare = Math.max(10, 45 - excess * 1.0);
    wUncommon = Math.max(5, 15 - excess * 0.5);
    wCommon = 0;
  }

  if (fuseLuck > 1.0) {
    wTranscendent *= fuseLuck;
    wAstral *= (1 + (fuseLuck - 1) * 0.7);
    wRare *= (1 + (fuseLuck - 1) * 0.4);
  }

  const totalWeight = wCommon + wUncommon + wRare + wAstral + wTranscendent;
  const oddsMap = {};

  oddsMap['berryblossom'] = (wCommon / 2 / totalWeight) * 100;
  oddsMap['spore_mushroom'] = (wCommon / 2 / totalWeight) * 100;
  oddsMap['cococatus'] = (wUncommon / 2 / totalWeight) * 100;
  oddsMap['banana_pepper'] = (wUncommon / 2 / totalWeight) * 100;
  oddsMap['cherrylime'] = (wRare / 2 / totalWeight) * 100;
  oddsMap['bubblebloom'] = (wRare / 2 / totalWeight) * 100;
  oddsMap['moonmelon'] = (wAstral / totalWeight) * 100;
  oddsMap['solarbloom'] = isTranscendentEligible ? (wTranscendent / totalWeight) * 100 : 0;

  return { ready: true, fusionPower: totalFP, holoOdds, cost, oddsMap, isTranscendentEligible };
}

function openFuseMachineModal() {
  renderFuseMachine();
  openModal(el('fuse-machine-modal'));
}

function renderFuseMachine() {
  const stats = calculateFusionOddsAndStats();
  const fusePowerVal = el('fuse-power-val');
  const fuseHoloVal = el('fuse-holo-val');
  const fuseCostVal = el('fuse-cost-val');
  const transcendentBanner = el('transcendent-banner');
  const transcendentCount = el('transcendent-fp-count');
  const resultsGrid = el('fuse-possible-results-list');
  const btnStart = el('btn-start-fuse-machine');
  const btnSub = el('fuse-btn-sub-label');
  const initialControls = el('fuse-initial-controls');
  const runningPanel = el('fuse-running-panel');
  const readyPanel = el('fuse-ready-panel');
  const btnTokenAvail = el('btn-token-avail-count');

  if (btnTokenAvail) btnTokenAvail.textContent = gameState.fusionTokens || 0;

  if (gameState.activeFusion) {
    if (initialControls) initialControls.classList.add('hidden');
    const now = getServerTime();
    const elapsed = (now - gameState.activeFusion.startTime) / 1000;
    const remaining = Math.max(0, gameState.activeFusion.duration - elapsed);

    if (remaining <= 0) {
      if (runningPanel) runningPanel.classList.add('hidden');
      if (readyPanel) readyPanel.classList.remove('hidden');
      
      const resSeed = FUSION_SEED_CATALOG.find(s => s.id === gameState.activeFusion.targetSeedId) || FUSION_SEED_CATALOG[0];
      const resCard = el('fuse-completed-item-card');
      if (resCard) {
        const holoTag = gameState.activeFusion.isHoloResult ? ' <span class="holo-badge-tag">HOLO</span>' : '';
        resCard.innerHTML = `
          <span class="fuse-res-icon">${resSeed.icon}</span>
          <div class="fuse-res-meta">
            <span class="fuse-res-title">${resSeed.name}${holoTag}</span>
            <span class="rarity-tag rarity-${resSeed.rarity}">${resSeed.rarity}</span>
          </div>
        `;
      }
    } else {
      if (runningPanel) runningPanel.classList.remove('hidden');
      if (readyPanel) readyPanel.classList.add('hidden');
      
      const clock = el('fuse-timer-clock');
      const bar = el('fuse-timer-bar-fill');
      if (clock) clock.textContent = formatTime(remaining);
      if (bar) {
        const pct = Math.min(100, Math.floor((elapsed / gameState.activeFusion.duration) * 100));
        bar.style.width = `${pct}%`;
      }
    }
  } else {
    if (initialControls) initialControls.classList.remove('hidden');
    if (runningPanel) runningPanel.classList.add('hidden');
    if (readyPanel) readyPanel.classList.add('hidden');

    for (let s = 0; s < 4; s++) {
      const slotEl = el(`fuse-slot-${s}`);
      if (!slotEl) continue;
      const itemId = gameState.fuseSlots[s];
      const item = itemId ? gameState.produceInventory.find(i => i.id === itemId) : null;

      if (item) {
        slotEl.className = 'fuse-input-slot filled';
        const fp = getFusionPowerForProduce(item);
        const holoBadge = item.isHolo ? ' <span class="fuse-holo-sub-tag">HOLO</span>' : '';
        slotEl.innerHTML = `
          <button class="slot-remove-btn" data-slot="${s}" title="Remove plant">✕</button>
          <div class="slot-filled-card">
            <span class="slot-filled-icon">${item.icon || '🌱'}</span>
            <span class="slot-filled-name">${item.name}${holoBadge}</span>
            <span class="slot-filled-fp">⚡+${fp} FP</span>
          </div>
        `;
        const removeBtn = slotEl.querySelector('.slot-remove-btn');
        if (removeBtn) {
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            gameState.fuseSlots[s] = null;
            renderFuseMachine();
          });
        }
      } else {
        slotEl.className = 'fuse-input-slot';
        slotEl.innerHTML = `
          <div class="slot-empty-state">
            <span class="slot-plus">➕</span>
            <span class="slot-num">PLANT ${s + 1}</span>
          </div>
        `;
      }

      slotEl.onclick = () => {
        if (gameState.activeFusion) return;
        currentPickerSlotIndex = s;
        openPlantPickerModal(s);
      };
    }

    if (fusePowerVal) fusePowerVal.textContent = stats.fusionPower;
    if (fuseHoloVal) fuseHoloVal.textContent = `${stats.holoOdds}%`;
    if (fuseCostVal) fuseCostVal.textContent = formatCash(stats.cost);

    if (transcendentBanner && transcendentCount) {
      transcendentCount.textContent = stats.fusionPower;
      if (stats.isTranscendentEligible) {
        transcendentBanner.className = 'transcendent-status-banner unlocked';
        transcendentBanner.innerHTML = `✨ 41+ FP: SolarBloom Unlocked!`;
      } else {
        transcendentBanner.className = 'transcendent-status-banner locked';
        transcendentBanner.innerHTML = `⚠️ 41+ FP needed for SolarBloom (${stats.fusionPower}/41)`;
      }
    }

    if (resultsGrid) {
      resultsGrid.innerHTML = '';
      if (!stats.ready) {
        resultsGrid.innerHTML = `<div class="empty-odds-prompt">Insert 4 plants to calculate exact odds.</div>`;
      } else {
        FUSION_SEED_CATALOG.forEach(seed => {
          const odds = stats.oddsMap[seed.id] || 0;
          const card = document.createElement('div');
          card.className = 'fuse-result-odds-card';
          card.innerHTML = `
            <span class="res-icon">${seed.icon}</span>
            <span class="res-name">${(seed.name || 'Seed').replace(' Seed', '')}</span>
            <span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span>
            <span class="res-odds">${odds.toFixed(1)}%</span>
          `;
          resultsGrid.appendChild(card);
        });
      }
    }

    if (btnStart && btnSub) {
      const canAfford = gameState.cash >= stats.cost;
      const readyToFuse = stats.ready && canAfford;
      btnStart.disabled = !readyToFuse;

      if (!stats.ready) {
        btnSub.textContent = 'Select 4 Plants';
      } else if (!canAfford) {
        btnSub.textContent = `Need ${formatCash(stats.cost)}`;
      } else {
        btnSub.textContent = `Cost: ${formatCash(stats.cost)}`;
      }
    }
  }
}

function openPlantPickerModal(slotIndex) {
  const modal = el('fuse-plant-picker-modal');
  const targetLabel = el('picker-target-slot-num');
  const list = el('fuse-plant-picker-list');
  if (!modal || !list) return;

  if (targetLabel) targetLabel.textContent = slotIndex + 1;
  list.innerHTML = '';

  const availableProduce = (gameState.produceInventory || []).filter(item => {
    return !gameState.fuseSlots.includes(item.id) || gameState.fuseSlots[slotIndex] === item.id;
  });

  if (availableProduce.length === 0) {
    list.innerHTML = `<p class="empty-bag-prompt">🧺 No produce in Harvest Bag!</p>`;
  } else {
    availableProduce.forEach(item => {
      const fp = getFusionPowerForProduce(item);
      const holoTag = item.isHolo ? ' <span class="holo-badge-tag">HOLO</span>' : '';
      const c = document.createElement('div');
      c.className = 'fuse-picker-item-card';
      c.innerHTML = `
        <span class="picker-item-icon">${item.icon || '🌱'}</span>
        <span class="picker-item-name">${item.name}${holoTag}</span>
        <span class="picker-item-kg">${formatKg(item.kg)} • ${formatMeters(item.meters)}</span>
        <span class="picker-item-fp">⚡+${fp} FP</span>
      `;
      c.onclick = () => {
        gameState.fuseSlots[slotIndex] = item.id;
        closeModal(modal);
        renderFuseMachine();
      };
      list.appendChild(c);
    });
  }

  openModal(modal);
}

function startFusionProcess() {
  const stats = calculateFusionOddsAndStats();
  if (!stats.ready || gameState.cash < stats.cost) return;

  gameState.cash -= stats.cost;
  const slottedIds = [...gameState.fuseSlots];
  slottedIds.forEach(id => {
    const idx = gameState.produceInventory.findIndex(p => p.id === id);
    if (idx !== -1) gameState.produceInventory.splice(idx, 1);
  });
  gameState.fuseSlots = [null, null, null, null];

  const rand = Math.random() * 100;
  let accum = 0;
  let chosenSeedId = 'berryblossom';

  for (const [seedId, odds] of Object.entries(stats.oddsMap)) {
    accum += odds;
    if (rand <= accum) {
      chosenSeedId = seedId;
      break;
    }
  }

  const isHoloResult = (Math.random() * 100) < stats.holoOdds;
  const duration = Math.min(900, Math.max(45, 60 + stats.fusionPower * 14));

  gameState.activeFusion = {
    startTime: getServerTime(),
    duration: duration,
    targetSeedId: chosenSeedId,
    isHoloResult: isHoloResult,
    fusionPower: stats.fusionPower,
    cost: stats.cost
  };

  playSFX('fusionStart');
  showToast(`🧪 Fusion started! (${formatTime(duration)})`);
  updateHUD();
  renderFuseMachine();
  saveGame();
}

function finishFusionInstantly() {
  if (!gameState.activeFusion) return;
  if (gameState.fusionTokens <= 0) {
    showToast("❌ No Fusion Tokens left!");
    return;
  }
  gameState.fusionTokens--;
  gameState.activeFusion.duration = 0;
  gameState.activeFusion.startTime = getServerTime() - 10000;
  playSFX('reward');
  showToast("🪙 Used 1x Fusion Token!");
  updateHUD();
  renderFuseMachine();
  saveGame();
}

function claimFusionResult() {
  if (!gameState.activeFusion) return;
  const targetId = gameState.activeFusion.targetSeedId;
  const isHolo = gameState.activeFusion.isHoloResult;
  const seed = FUSION_SEED_CATALOG.find(s => s.id === targetId) || FUSION_SEED_CATALOG[0];

  gameState.seedInventory[targetId] = (gameState.seedInventory[targetId] || 0) + 1;

  if (!gameState.fusionCodex[targetId]) {
    gameState.fusionCodex[targetId] = { discovered: true, timestamp: Date.now() };
  }

  if (isHolo && !gameState.holoCodex[targetId]) {
    gameState.holoCodex[targetId] = { discovered: true, timestamp: Date.now() };
  }

  playSFX('fusionComplete');
  createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 40, `+1 ${seed.icon} ${seed.name}!`, "#ba68c8");
  showToast(`🎁 Claimed ${seed.name}!`);

  gameState.activeFusion = null;
  updateHUD();
  renderFuseMachine();
  saveGame();
}

const DAILY_SCHEDULE = [
  { day: 1, type: 'cash', amount: 500, title: '$500 Cash', icon: '💰', desc: 'Daily venture funds!' },
  { day: 2, type: 'token', amount: 1, title: '1× Fusion Token', icon: '🪙', desc: 'Instantly skips fusion timer!' },
  { day: 3, type: 'cash', amount: 1000, title: '$1,000 Cash', icon: '💰', desc: 'Economy boost!' },
  { day: 4, type: 'token', amount: 2, title: '2× Fusion Tokens', icon: '🪙', desc: 'Speed up advanced fusions!' },
  { day: 5, type: 'streak_seed', amount: 1, title: '🔥 Streak Seed', icon: '🔥', desc: '5-Day Exclusive Reward!' }
];

function openDailyRewardsModal() {
  renderDailyRewards();
  openModal(el('daily-rewards-modal'));
}

function renderDailyRewards() {
  const track = el('daily-track-container');
  const streakCount = el('daily-streak-count');
  const btnClaim = el('btn-claim-daily-reward');
  const featuredIcon = el('featured-reward-icon');
  const featuredTitle = el('featured-reward-title');
  const featuredDesc = el('featured-reward-desc');
  const daysRemText = el('streak-seed-days-remaining-text');
  if (!track) return;

  track.innerHTML = '';
  const now = getServerTime();
  const TWENTY_HOURS = 20 * 60 * 60 * 1000;
  const elapsedSinceClaim = now - (gameState.lastDailyClaimTime || 0);
  const canClaimToday = elapsedSinceClaim >= TWENTY_HOURS || gameState.lastDailyClaimTime === 0;

  const currentDayIndex = Math.min(4, Math.max(0, gameState.dailyStreak % 5));
  const currentScheduleItem = DAILY_SCHEDULE[currentDayIndex];

  if (streakCount) streakCount.textContent = gameState.dailyStreak;

  if (daysRemText) {
    const rem = 5 - (gameState.dailyStreak % 5);
    daysRemText.textContent = (rem === 5 && canClaimToday) ? "Day 5 Available Today!" : `${rem} Day(s) until Day 5 Claim`;
  }

  DAILY_SCHEDULE.forEach((item, idx) => {
    const card = document.createElement('div');
    const isDay5 = item.day === 5;
    let stateClass = 'locked';

    if (idx < currentDayIndex) {
      stateClass = 'claimed';
    } else if (idx === currentDayIndex) {
      stateClass = canClaimToday ? 'active-today' : 'claimed';
    }

    card.className = `daily-reward-card ${isDay5 ? 'day-5-streak' : ''} ${stateClass}`;
    card.innerHTML = `
      <span class="card-day-tag">Day ${item.day}</span>
      <span class="card-reward-icon">${item.icon}</span>
      <span class="card-reward-name">${item.title}</span>
    `;
    track.appendChild(card);
  });

  if (featuredIcon && featuredTitle && featuredDesc && btnClaim) {
    featuredIcon.textContent = currentScheduleItem.icon;
    featuredTitle.textContent = `Day ${currentScheduleItem.day}: ${currentScheduleItem.title}`;
    featuredDesc.textContent = currentScheduleItem.desc;

    if (canClaimToday) {
      btnClaim.disabled = false;
      btnClaim.textContent = `🎁 CLAIM DAY ${currentScheduleItem.day}`;
    } else {
      const remainingSeconds = Math.ceil((TWENTY_HOURS - elapsedSinceClaim) / 1000);
      btnClaim.disabled = true;
      btnClaim.textContent = `⏳ Next in: ${formatTime(remainingSeconds)}`;
    }
  }
}

function claimDailyReward() {
  const now = getServerTime();
  const TWENTY_HOURS = 20 * 60 * 60 * 1000;
  const elapsedSinceClaim = now - (gameState.lastDailyClaimTime || 0);

  if (elapsedSinceClaim < TWENTY_HOURS && gameState.lastDailyClaimTime !== 0) {
    showToast("⏳ Already claimed today!");
    return;
  }

  const currentDayIndex = Math.min(4, Math.max(0, gameState.dailyStreak % 5));
  const reward = DAILY_SCHEDULE[currentDayIndex];

  if (reward.type === 'cash') {
    gameState.cash += reward.amount;
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+${formatCash(reward.amount)}! 💰`, "#69f0ae");
  } else if (reward.type === 'token') {
    gameState.fusionTokens = (gameState.fusionTokens || 0) + reward.amount;
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+${reward.amount}x 🪙 Token!`, "#ffd54f");
  } else if (reward.type === 'streak_seed') {
    gameState.seedInventory['streak_seed'] = (gameState.seedInventory['streak_seed'] || 0) + reward.amount;
    if (!gameState.codex['streak_seed']) {
      gameState.codex['streak_seed'] = { discovered: true, totalHarvested: 0 };
    }
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+1x 🔥 Streak Seed!`, "#ff3d00");
  }

  gameState.dailyStreak++;
  gameState.lastDailyClaimTime = now;

  playSFX('reward');
  showToast(`🎁 Claimed Day ${reward.day}!`);
  updateHUD();
  renderDailyRewards();
  saveGame();
}

function renderIndexCodex() {
  const indexContainer = el('index-items-list');
  const codexProgressFill = el('codex-progress-fill');
  const codexProgressText = el('codex-progress-text');
  if (!indexContainer) return;

  indexContainer.className = 'master-index-list';
  indexContainer.innerHTML = '';

  const allSeeds = getAllMasterIndexSeeds();
  const requiredSeeds = getRequiredCodexSeeds();

  let discoveredCount = 0;
  requiredSeeds.forEach(s => {
    if (gameState.codex[s.id] && gameState.codex[s.id].discovered) {
      discoveredCount++;
    }
  });

  if (codexProgressFill && codexProgressText) {
    const pct = Math.round((discoveredCount / requiredSeeds.length) * 100);
    codexProgressFill.style.width = `${pct}%`;
    codexProgressText.textContent = `${discoveredCount} / ${requiredSeeds.length} Discovered (${pct}%)`;
  }

  allSeeds.forEach(seed => {
    const isNormalDiscovered = !!(gameState.codex && gameState.codex[seed.id] && gameState.codex[seed.id].discovered);
    const isHoloDiscovered = !!(gameState.holoCodex && gameState.holoCodex[seed.id] && gameState.holoCodex[seed.id].discovered);
    const isExpanded = !!expandedIndexCards[seed.id];

    const card = document.createElement('div');
    card.className = `index-entry-card ${isExpanded ? 'expanded' : ''}`;

    const cleanName = (seed.name || 'Seed').replace(' Seed', '').toUpperCase();

    card.innerHTML = `
      <div class="index-entry-header">
        <div class="index-entry-header-left">
          <span class="index-entry-icon">${isNormalDiscovered ? seed.icon : '❓'}</span>
          <span class="index-entry-title">${isNormalDiscovered ? cleanName : 'UNKNOWN SEED'}</span>
          <span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span>
        </div>
        <span class="index-entry-arrow">▼</span>
      </div>
      <div class="index-entry-mutations">
        <div class="index-mutation-item ${isNormalDiscovered ? 'discovered' : 'locked'}">
          <span class="mutation-check">${isNormalDiscovered ? '✓' : '🔒'}</span>
          <span>${cleanName} (NORMAL)</span>
        </div>
        <div class="index-mutation-item ${isHoloDiscovered ? 'discovered' : 'locked'}">
          <span class="mutation-check">${isHoloDiscovered ? '✨' : '🔒'}</span>
          <span>${cleanName} (HOLO)</span>
        </div>
      </div>
    `;

    const header = card.querySelector('.index-entry-header');
    header.onclick = () => {
      expandedIndexCards[seed.id] = !expandedIndexCards[seed.id];
      card.classList.toggle('expanded', expandedIndexCards[seed.id]);
    };

    indexContainer.appendChild(card);
  });
}

function updateWeatherModalContent() {
  const modalBody = el('weather-modal-body');
  const modalTitle = el('weather-modal-title');
  if (!modalBody) return;

  let title = "☀️ Weather & Forecast";
  let desc = "";

  if (gameState.isPrismaticRain) {
    title = "🌧️ Prismatic Paint Rain Active!";
    desc = `
      <div class="weather-info-box prismatic-box">
        <h3 class="prismatic-title">🌧️ Prismatic Aurora Storm</h3>
        <p><strong>2.5× Growth Speed</strong> applied to ALL farm plots!</p>
        <p><strong>15% Value Bonus</strong> on all crops harvested during rain!</p>
        <p><strong>5% Holographic Mutation Chance</strong> when planting seeds!</p>
        <p class="prismatic-flavor-text">Colorful Prismatic paint puddles have formed across the garden yard!</p>
      </div>
    `;
  } else if (gameState.isDawn) {
    title = "🌅 Dawn Twilight";
    desc = `
      <div class="weather-info-box">
        <h3>🌅 Morning Dawn</h3>
        <p>The sun is rising over your garden plots.</p>
        <p>Transition period between Night and Daytime cycles.</p>
      </div>
    `;
  } else if (gameState.isDusk) {
    title = "🌇 Dusk Sunset";
    desc = `
      <div class="weather-info-box">
        <h3>🌇 Evening Dusk</h3>
        <p>The sun is setting, casting a purple amber twilight over the fields.</p>
        <p>Transition period preparing for Nighttime affinity plants.</p>
      </div>
    `;
  } else if (gameState.isDay) {
    title = "☀️ Sunny Daytime";
    desc = `
      <div class="weather-info-box">
        <h3>☀️ Bright Sunlight</h3>
        <p><strong>2.0× Growth Speed</strong> boost for Day-affinity crops (Sunflower, SolarBloom)!</p>
        <p>Normal growth rate for All-affinity crops.</p>
      </div>
    `;
  } else {
    title = "🌙 Starry Nighttime";
    desc = `
      <div class="weather-info-box">
        <h3>🌙 Midnight Glow</h3>
        <p><strong>2.0× Growth Speed</strong> boost for Night-affinity crops (Glowshroom, Strawberry, Cosmic Rose, MoonMelon)!</p>
        <p>15% Chance of triggering Prismatic Paint Rain during midnight cycles.</p>
      </div>
    `;
  }

  if (modalTitle) modalTitle.textContent = title;
  modalBody.innerHTML = desc;
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
    const multText = ` (${getRebirthMultiplier().toFixed(1)}×)`;
    if (sellAllPayoutText) sellAllPayoutText.textContent = `Total: ${formatCash(payout)} (${gameState.produceInventory.length} items)${multText}`;
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
        <span class="opt-subtitle">${formatCash(groupPayout)}</span>
      </div>
      <button class="btn sell-qty-btn">${g.items.length > 1 ? 'Choose Qty' : `Sell 1`}</button>
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
  if (qtyCropHeader) qtyCropHeader.textContent = `${g.icon} ${ogPrefix}${holoPrefix}${g.name} (x${g.items.length})`;
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
  if (feeEl) feeEl.textContent = `Fee: ${formatCash(currentBargainFee)}`;
  if (dialogueEl) dialogueEl.textContent = `"I can appraise your crops for market premiums."`;
  if (offerTierEl) offerTierEl.classList.add('hidden');
  
  if (btnStart) {
    btnStart.classList.remove('hidden');
    btnStart.disabled = (gameState.cash < currentBargainFee || gameState.produceInventory.length === 0);
  }
  if (btnAccept) btnAccept.classList.add('hidden');
  if (btnDecline) btnDecline.classList.add('hidden');
  if (dailyDealWrapper) dailyDealWrapper.classList.add('hidden');
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
    if (btnDailyDeal) btnDailyDeal.disabled = true;
    if (dailyDealCountdownText) dailyDealCountdownText.textContent = `⏳ Next Deal: ${formatTime(remainingSeconds)}`;
  } else {
    if (btnDailyDeal) btnDailyDeal.disabled = false;
    if (dailyDealCountdownText) dailyDealCountdownText.textContent = `20× Boost Ready!`;
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
    if (mainTitle) mainTitle.textContent = `⏳ Skip Growth`;
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
    const sKg = f.rolledKg || p.crop.minKg || 20;
    const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, true, p.isHoloMutated);
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
          <span class="vine-fruit-name">${f.name || 'Fruit'} #${i + 1}</span>
          <div class="vine-fruit-stats">
            ${f.isReady ? `<span>${formatKg(sKg)} • ${formatMeters(f.rolledMeters || 1.0)} • <strong>${formatCash(earn)}</strong></span>` : `<span>Growing (${Math.floor(f.progress)}%) • ~${formatKg(sKg * (f.progress / 100))}</span>`}
          </div>
        </div>
      </div>
      <div class="card-right-group">
        ${f.isReady ? `<button class="btn btn-vine-harvest">Harvest</button>` : `<button class="btn btn-vine-skip">Skip (${formatTime(rS)})</button>`}
      </div>
    `;

    if (f.isReady) {
      cd.querySelector('.btn-vine-harvest').addEventListener('click', () => {
        addXP(Math.ceil((p.crop.baseGrowTime * 1.5) / (p.crop.maxFruits || 3)));
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: f.rolledMeters || 1.0, value: earn, isHolo: p.isHoloMutated });
        f.progress = 0;
        f.isReady = false;
        const rs = rollFruitStats(p.crop);
        f.rolledKg = rs.fruitKg;
        f.growTime = rs.fruitGrowTime;
        f.rolledMeters = rs.fruitMeters;
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
      btnText = 'Equipped';
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
        <div class="fence-post corner-left"></div>
        <div class="fence-rail mid-rail"></div>
        <div class="fence-post corner-right"></div>
      </div>
      <div class="item-info">
        <div class="fence-item-name">${skin.name}</div>
        <span class="rarity-tag rarity-${skin.rarity}">${skin.rarity}</span>
        <div class="fence-item-meta">${isOwned ? 'Owned' : `${formatCash(skin.cost)} • Stock: ${skin.currentStock}`}</div>
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
        if (isOnline && db) {
          const skinStockRef = db.ref('shopStock/fences/' + skin.id);
          skinStockRef.transaction(current => {
            if (current === null || current <= 0) return 0;
            return current - 1;
          }, (err, committed) => {
            if (committed) {
              gameState.cash -= skin.cost;
              gameState.ownedFenceSkins.push(skin.id);
              gameState.currentFenceSkin = skin.id;
              gameState.articularSkinActive = false;
              playSFX('sell');
              updateHUD();
              updateFenceSkin();
              renderDecorShop();
              showToast(`🪵 Purchased ${skin.name}!`);
              saveGame();
            } else {
              showToast("❌ Item sold out!");
            }
          });
        } else {
          gameState.cash -= skin.cost;
          skin.currentStock--;
          gameState.ownedFenceSkins.push(skin.id);
          gameState.currentFenceSkin = skin.id;
          gameState.articularSkinActive = false;
          playSFX('sell');
          updateHUD();
          updateFenceSkin();
          renderDecorShop();
          showToast(`🪵 Purchased ${skin.name}!`);
          saveGame();
        }
      }
    });
    
    fenceSkinsList.appendChild(card);
  });
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
    if (titleEl) titleEl.textContent = `Ascend to Rebirth ${nextRank}`;
  }
  if (rebirthBtnSub) {
    rebirthBtnSub.textContent = canRebirth ? `Click to Ascend (${nextTotalMult.toFixed(1)}× Boost)` : `${levelPct}% Level • ${cashPct}% Cash`;
  }
}

function sendTradeRequest(targetId) {
  if (!isOnline || isPlaytesterMode || !db) {
    showToast(isPlaytesterMode ? "❌ Disabled in Playtester Mode." : "❌ Offline mode.");
    return;
  }
  db.ref('players/' + targetId + '/tradeRequest').set({
    from: myPlayerId,
    timestamp: getServerTime()
  });
  showToast(`📤 Trade request sent to: ${targetId}`);
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
        <span class="trade-slot-icon">${item.icon || '🌱'}</span>
        <span class="trade-slot-name">${item.name || 'Item'}</span>
        ${item.type === 'produce' ? `<span class="trade-slot-kg">${formatKg(item.kg)}</span>` : ''}
      `;
      if (!amIReady) {
        const rmBtn = document.createElement('button');
        rmBtn.className = 'trade-slot-remove-btn';
        rmBtn.textContent = '✕';
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
        <span class="trade-slot-icon">${item.icon || '🌱'}</span>
        <span class="trade-slot-name">${item.name || 'Item'}</span>
        ${item.type === 'produce' ? `<span class="trade-slot-kg">${formatKg(item.kg)}</span>` : ''}
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
        card.className = 'trade-picker-row';
        card.innerHTML = `<span class="trade-picker-title">${s.icon} ${s.name} (x${qty})</span> <button class="btn btn-trade-add">Add</button>`;
        card.querySelector('button').onclick = () => {
          if (amIReady) return;
          if (myOfferedItems.length >= 9) {
            showToast("❌ Trade box is full!");
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
    gameState.produceInventory.forEach(item => {
      if (!item) return;
      const card = document.createElement('div');
      card.className = 'trade-picker-row';
      card.innerHTML = `<span class="trade-picker-title">${item.icon || '🌱'} ${item.name || 'Produce'} (${formatCash(item.value)})</span> <button class="btn btn-trade-add">Add</button>`;
      card.querySelector('button').onclick = () => {
        if (amIReady) return;
        if (myOfferedItems.length >= 9) {
          showToast("❌ Trade box is full!");
          return;
        }
        myOfferedItems.push({ type: 'produce', id: item.id, seedId: item.seedId, name: item.name, icon: item.icon, kg: item.kg, meters: item.meters, value: item.value, isHolo: item.isHolo });
        const isP1 = currentTradeId && currentTradeId.startsWith(myPlayerId + '_');
        if (db) db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
        closeModal(el('trade-backpack-modal'));
      };
      tradePickerList.appendChild(card);
    });
  }
}

function buySeedItem(seed) {
  if (gameState.cash < seed.cost) {
    showToast("❌ Not enough cash!");
    return;
  }
  if (seed.currentStock <= 0) {
    showToast("❌ Seed out of stock!");
    return;
  }

  if (isOnline && db) {
    const seedStockRef = db.ref('shopStock/seeds/' + seed.id);
    seedStockRef.transaction(currentStock => {
      if (currentStock === null || currentStock <= 0) {
        return 0;
      }
      return currentStock - 1;
    }, (error, committed) => {
      if (committed) {
        gameState.cash -= seed.cost;
        gameState.seedInventory[seed.id] = (gameState.seedInventory[seed.id] || 0) + 1;
        playSFX('sell');
        updateHUD();
        saveGame();
      } else {
        showToast("❌ Item was just bought out!");
      }
    });
  } else {
    gameState.cash -= seed.cost;
    seed.currentStock--;
    gameState.seedInventory[seed.id] = (gameState.seedInventory[seed.id] || 0) + 1;
    playSFX('sell');
    updateHUD();
    renderShopItems();
    saveGame();
  }
}

function calculateStockForCycle(cycleIndex, luckMult = 1.0) {
  const rng = mulberry32(cycleIndex);
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

    if (s.rarity === 'common') {
      stockMap.seeds[s.id] = s.maxStock;
    } else if (rng() < adjustedChance) {
      stockMap.seeds[s.id] = s.maxStock;
    } else {
      stockMap.seeds[s.id] = 0;
    }
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

function syncGlobalShopStock(currentCycleIndex) {
  if (!db || !isOnline) return;
  db.ref('shopStock/lastCycle').transaction(lastCycle => {
    if (lastCycle === null || lastCycle < currentCycleIndex) {
      return currentCycleIndex;
    }
    return undefined;
  }, (error, committed) => {
    if (committed) {
      const stockMap = calculateStockForCycle(currentCycleIndex, gameState.restockLuckMultiplier || 1.0);
      db.ref('shopStock').update({
        seeds: stockMap.seeds,
        eventSeeds: stockMap.eventSeeds,
        fences: stockMap.fences,
        lastCycle: currentCycleIndex
      });
    }
  });
}

function initFirebasePresence() {
  if (!db) return;

  db.ref('.info/serverTimeOffset').on('value', snap => {
    serverTimeOffset = snap.val() || 0;
    timeSynced = true;
    updateGlobalCycle();
    updateShopForCurrentCycle();
  });

  db.ref('shopStock').on('value', snap => {
    const data = snap.val();
    if (data && data.seeds) {
      SEED_CATALOG.forEach(s => {
        if (data.seeds[s.id] !== undefined) {
          s.currentStock = data.seeds[s.id];
        }
      });
      renderShopItems();
    }
    if (data && data.fences) {
      FENCE_SKINS_CATALOG.forEach(skin => {
        if (data.fences[skin.id] !== undefined) {
          skin.currentStock = data.fences[skin.id];
        }
      });
      renderDecorShop();
    }
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
      updateShopForCurrentCycle(true);
      if (timeSynced) {
        showToast(`🍀 Restock Luck: ${val.multiplier}X active!`);
      }
    }
  });

  db.ref('globalFuseLuck').on('value', snap => {
    const val = snap.val();
    if (val && val.multiplier) {
      gameState.fuseLuckMultiplier = Number(val.multiplier) || 1.0;
      if (timeSynced) {
        showToast(`🎰 Global Fuse Luck: ${val.multiplier}X active!`);
      }
      renderFuseMachine();
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
      showToast(`ADMIN: Granted ${formatCash(cmd.amount)}!`);
    } else if (cmd.type === 'seed') {
      gameState.seedInventory[cmd.seedId] = (gameState.seedInventory[cmd.seedId] || 0) + cmd.amount;
      updateHUD();
      showToast(`ADMIN: Granted ${cmd.amount}x ${cmd.seedId}!`);
    } else if (cmd.type === 'token') {
      gameState.fusionTokens = (gameState.fusionTokens || 0) + cmd.amount;
      updateHUD();
      showToast(`ADMIN: Granted ${cmd.amount}x Tokens!`);
    } else if (cmd.type === 'broadcast') {
      playSFX('harvest');
      showToast(`📢 ADMIN: ${cmd.message}`);
    } else if (cmd.type === 'restock') {
      const s = SEED_CATALOG.find(x => x.id === cmd.seedId);
      if (s) {
        s.currentStock = cmd.amount;
        renderShopItems();
        showToast(`ADMIN: Restocked ${s.name}!`);
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
      showToast(`ADMIN: Matured all crops!`);
    } else if (cmd.type === 'skipFuse') {
      if (gameState.activeFusion) {
        gameState.activeFusion.duration = 0;
        gameState.activeFusion.startTime = getServerTime() - 10000;
        renderFuseMachine();
        playSFX('reward');
        showToast(`ADMIN: Active Fusion Completed Instantly!`);
      }
    }
  });

  db.ref('.info/connected').on('value', snap => {
    const networkStatusText = el('network-status-text');
    if (snap.val() === true) {
      isOnline = true;
      if (networkStatusText) {
        networkStatusText.textContent = "Online 🟢";
        networkStatusText.classList.add('online');
        networkStatusText.classList.remove('offline');
      }
      const myRef = db.ref('players/' + myPlayerId);
      myRef.onDisconnect().remove();
      myRef.set({ playerId: myPlayerId, level: gameState.level, online: true, inTrade: false, lastActive: getServerTime() });
    } else {
      isOnline = false;
      if (networkStatusText) {
        networkStatusText.textContent = "Offline 🔴";
        networkStatusText.classList.add('offline');
        networkStatusText.classList.remove('online');
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
      pRow.className = 'player-list-row';
      const btnStatus = pData.inTrade ? 'disabled' : '';
      const btnText = pData.inTrade ? 'In Trade' : 'Trade';
      pRow.innerHTML = `<span class="player-list-info">ID: ${id} <span class="player-lvl-tag">(Lvl ${pData.level})</span></span> <button class="btn player-trade-btn" ${btnStatus}>${btnText}</button>`;
      
      if (!pData.inTrade) pRow.querySelector('button').addEventListener('click', () => sendTradeRequest(id));
      activePlayersList.appendChild(pRow);
    }
    if (count === 0) activePlayersList.innerHTML = `<p class="empty-list-notice">No other players online.</p>`;
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
          theirTradeStatus.classList.toggle('partner-ready', !!tData[tk]);
          theirTradeStatus.classList.toggle('partner-waiting', !tData[tk]);
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
          showToast("❌ Trade Cancelled");
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
    d.className = `chat-bubble ${isMe ? 'chat-me' : 'chat-them'}`;
    d.innerHTML = `<div class="chat-sender-id">${c.sender}</div>${c.text}`;
    chatMessagesContainer.appendChild(d);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  });
}

function createEmptyPlot() {
  return {
    crop: null,
    progress: 0,
    actualGrowTime: 0,
    isReady: false,
    isHoloMutated: false,
    plantedAt: 0,
    rolledKg: 0,
    rolledMeters: 0,
    vineFruits: []
  };
}

function initFields() {
  gameState.fields = [];
  for (let f = 0; f < gameState.maxFields; f++) {
    const fieldPlots = [];
    for (let p = 0; p < PLOTS_PER_FIELD; p++) {
      fieldPlots.push(createEmptyPlot());
    }
    gameState.fields.push(fieldPlots);
  }
}

function buildPlotDOMStructure() {
  const farmGrid = el('plots-grid') || el('plot-grid') || el('farm-grid') || el('grid-container') || document.querySelector('.grid-container');
  if (!farmGrid) return;

  farmGrid.innerHTML = '';
  plotDomNodes = [];

  for (let i = 0; i < PLOTS_PER_FIELD; i++) {
    const plotEl = document.createElement('div');
    plotEl.className = 'plot';
    plotEl.dataset.index = i;
    plotEl.tabIndex = 0;

    plotEl.innerHTML = `
      <div class="dirt-bed"></div>
      <div class="plant-soil-hole hidden"></div>
      <div class="crop-container">
        <div class="crop-icon"></div>
      </div>
      <div class="growth-bar hidden"><div class="growth-progress"></div></div>
      <div class="crop-timer-badge hidden"></div>
    `;

    plotEl.addEventListener('click', (e) => handlePlotClick(i, e));
    plotEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'A' || e.key === 'a') {
        e.preventDefault();
        handlePlotClick(i, null);
      }
    });

    farmGrid.appendChild(plotEl);
    plotDomNodes.push(plotEl);
  }
}

function handlePlotClick(index, event) {
  if (gameState.currentField >= gameState.unlockedFields) return;
  const currentPlots = gameState.fields[gameState.currentField];
  if (!currentPlots || !currentPlots[index]) return;
  const plot = currentPlots[index];

  if (gameState.selectedTool === 'shovel') {
    if (plot.crop) {
      plot.crop = null;
      plot.progress = 0;
      plot.isReady = false;
      plot.isHoloMutated = false;
      plot.vineFruits = [];
      playSFX('shovel');
      showToast("Cleared plot!");
      renderPlots();
      saveGame();
    }
    return;
  }

  if (plot.crop && plot.crop.isVine) {
    gameState.selectedVinePlotIndex = index;
    openVineModal();
    return;
  }

  if (plot.crop && plot.isReady) {
    if (plot.crop.id === 'streak_seed') {
      pendingStreakPlotIndex = index;
      openModal(el('streak-seed-confirm-modal'));
      return;
    }
    performHarvest(index, event ? event.clientX : window.innerWidth / 2, event ? event.clientY : window.innerHeight / 2);
    return;
  }

  if (plot.crop && !plot.isReady) {
    openSkipModal(index);
    return;
  }

  if (!plot.crop && gameState.selectedSeedId) {
    const seedId = gameState.selectedSeedId;
    const count = gameState.seedInventory[seedId] || 0;

    if (count <= 0) {
      showToast("❌ No seeds left!");
      return;
    }

    const allSeeds = getAllGameSeeds();
    const seed = allSeeds.find(s => s.id === seedId);
    if (!seed) return;

    gameState.seedInventory[seedId]--;
    const stats = rollCropWeight(seed);

    // 5% Mutation Chance during Prismatic Rain
    const willMutateHolo = gameState.isPrismaticRain ? (Math.random() < 0.05) : false;

    plot.crop = { ...seed };
    plot.progress = 0;
    plot.isReady = false;
    plot.plantedAt = getServerTime();
    plot.actualGrowTime = seed.baseGrowTime;
    plot.rolledKg = stats.rolledKg;
    plot.rolledMeters = stats.rolledMeters;
    plot.isHoloMutated = willMutateHolo;

    if (seed.isVine) {
      plot.vineFruits = [];
      const numFruits = seed.maxFruits || 3;
      for (let f = 0; f < numFruits; f++) {
        const fStats = rollFruitStats(seed);
        plot.vineFruits.push({
          name: seed.produceName || seed.name,
          icon: seed.produceIcon || seed.icon,
          progress: 0,
          isReady: false,
          rolledKg: fStats.fruitKg,
          rolledMeters: fStats.fruitMeters,
          growTime: fStats.fruitGrowTime
        });
      }
    }

    if (!gameState.codex[seedId]) {
      gameState.codex[seedId] = { discovered: true, totalHarvested: 0 };
      checkCodexCompletion();
    }

    playSFX('plant');
    updateHUD();
    renderPlots();
    renderSeedDrawer();
    saveGame();
  }
}

function performHarvest(index, x, y) {
  const plot = gameState.fields[gameState.currentField][index];
  if (!plot || !plot.crop) return;

  const crop = plot.crop;
  const isHolo = plot.isHoloMutated;
  const earn = calculateProduceEarnings(crop.baseSellPrice, plot.rolledKg, crop.isVine, isHolo);

  gameState.produceInventory.push({
    id: Date.now() + Math.random(),
    seedId: crop.id,
    name: crop.name.replace(' Seed', ''),
    icon: crop.icon,
    kg: plot.rolledKg,
    meters: plot.rolledMeters,
    value: earn,
    isHolo: isHolo,
    isOG: crop.isOG || false
  });

  if (gameState.codex[crop.id]) {
    gameState.codex[crop.id].totalHarvested = (gameState.codex[crop.id].totalHarvested || 0) + 1;
  }

  if (isHolo && !gameState.holoCodex[crop.id]) {
    gameState.holoCodex[crop.id] = { discovered: true, timestamp: Date.now() };
  }

  addXP(crop.baseGrowTime * 2);
  playSFX('harvest');
  createFloatingText(x || window.innerWidth / 2, y || window.innerHeight / 2, `+${crop.icon} ${formatKg(plot.rolledKg)} (${formatMeters(plot.rolledMeters)})!`, isHolo ? '#00e5ff' : '#aed581');

  plot.crop = null;
  plot.progress = 0;
  plot.isReady = false;
  plot.isHoloMutated = false;
  plot.vineFruits = [];

  updateHUD();
  renderPlots();
  saveGame();
}

function renderPlots() {
  const currentPlots = gameState.fields[gameState.currentField];
  if (!currentPlots) return;

  const isFieldUnlocked = gameState.currentField < gameState.unlockedFields;
  const fieldLockOverlay = el('field-locked-overlay');
  const fieldReqLabel = el('field-req-level-label') || el('locked-field-req');

  if (fieldLockOverlay) {
    if (isFieldUnlocked) {
      fieldLockOverlay.classList.add('hidden');
    } else {
      fieldLockOverlay.classList.remove('hidden');
      if (fieldReqLabel) {
        fieldReqLabel.textContent = `Requires Level ${FIELD_LEVEL_REQS[gameState.currentField]}`;
      }
    }
  }

  for (let i = 0; i < PLOTS_PER_FIELD; i++) {
    const plot = currentPlots[i];
    let plotEl = plotDomNodes[i];
    if (!plotEl) continue;

    const iconEl = plotEl.querySelector('.crop-icon');
    const barEl = plotEl.querySelector('.growth-bar');
    const fillEl = plotEl.querySelector('.growth-progress');
    const badgeEl = plotEl.querySelector('.crop-timer-badge');
    const holeEl = plotEl.querySelector('.plant-soil-hole');

    if (!plot || !plot.crop) {
      plotEl.className = 'plot empty';
      if (iconEl) {
        iconEl.textContent = '';
        iconEl.className = 'crop-icon';
        iconEl.style.transform = 'scale(0)';
      }
      if (barEl) barEl.classList.add('hidden');
      if (badgeEl) badgeEl.classList.add('hidden');
      if (holeEl) holeEl.classList.add('hidden');
      continue;
    }

    if (holeEl) holeEl.classList.remove('hidden');

    const holoClass = plot.isHoloMutated ? 'is-holo-mutated' : '';
    const vineClass = plot.crop.isVine ? 'vine-plot' : '';
    const customPlantClass = plot.crop.cssClass || '';
    const readyClass = plot.isReady ? 'ready' : 'growing';

    plotEl.className = `plot ${readyClass} ${vineClass}`;

    const progressRatio = Math.max(0.2, plot.progress / 100);
    const weightFactor = Math.min(1.5, 0.8 + (plot.rolledKg / 300) * 0.4);
    const plantScale = (progressRatio * weightFactor).toFixed(2);

    if (iconEl) {
      iconEl.textContent = plot.crop.icon || '🌱';
      iconEl.className = `crop-icon ${plot.isReady ? 'mature' : ''} ${holoClass} ${customPlantClass}`;
      iconEl.style.transform = `scale(${plantScale})`;
    }

    const currentGrowingKg = (plot.rolledKg * (plot.progress / 100)).toFixed(1);

    if (plot.crop.isVine) {
      if (barEl) barEl.classList.add('hidden');
      if (badgeEl) {
        badgeEl.classList.remove('hidden');
        badgeEl.className = 'crop-timer-badge ready-badge';
        const readyCount = (plot.vineFruits || []).filter(f => f.isReady).length;
        badgeEl.textContent = `🍇 ${readyCount}/${(plot.vineFruits || []).length}`;
      }
    } else if (plot.isReady) {
      if (barEl) barEl.classList.add('hidden');
      if (badgeEl) {
        badgeEl.classList.remove('hidden');
        badgeEl.className = 'crop-timer-badge ready-badge';
        badgeEl.textContent = `${formatKg(plot.rolledKg)}`;
      }
    } else {
      if (barEl) {
        barEl.classList.remove('hidden');
        if (fillEl) fillEl.style.width = `${Math.min(100, Math.floor(plot.progress))}%`;
      }
      if (badgeEl) {
        badgeEl.classList.remove('hidden');
        badgeEl.className = 'crop-timer-badge';
        badgeEl.textContent = `${Math.floor(plot.progress)}% • ${currentGrowingKg}kg`;
      }
    }
  }
}

function renderSeedDrawer() {
  const seedsList = el('drawer-seeds-list') || el('seed-inventory-list');
  const produceList = el('drawer-produce-list') || el('produce-inventory-list');
  const tabSeeds = el('tab-seeds-btn');
  const tabProduce = el('tab-produce-btn');

  const isSeeds = gameState.activeDrawerTab === 'seeds';
  if (tabSeeds) tabSeeds.classList.toggle('active', isSeeds);
  if (tabProduce) tabProduce.classList.toggle('active', !isSeeds);
  if (seedsList) seedsList.classList.toggle('hidden', !isSeeds);
  if (produceList) produceList.classList.toggle('hidden', isSeeds);

  if (isSeeds && seedsList) {
    seedsList.innerHTML = '';
    const allSeeds = getAllGameSeeds();
    let hasSeeds = false;

    allSeeds.forEach(seed => {
      const qty = gameState.seedInventory[seed.id] || 0;
      if (qty > 0) {
        hasSeeds = true;
        const isSelected = gameState.selectedSeedId === seed.id && gameState.selectedTool === 'plant';
        const card = document.createElement('div');
        card.className = `seed-select-card ${isSelected ? 'active' : ''}`;
        card.innerHTML = `
          <div class="drawer-seed-icon">${seed.icon}</div>
          <div class="drawer-seed-info">
            <div class="drawer-seed-name">${seed.name}</div>
            <span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span>
          </div>
          <div class="drawer-seed-qty">x${qty}</div>
        `;
        card.onclick = () => {
          gameState.selectedSeedId = seed.id;
          gameState.selectedTool = 'plant';
          updateHUD();
          renderSeedDrawer();
        };
        seedsList.appendChild(card);
      }
    });

    if (!hasSeeds) {
      seedsList.innerHTML = `<p class="empty-drawer-notice">No seeds in bag.</p>`;
    }
  } else if (!isSeeds && produceList) {
    produceList.innerHTML = '';
    if (gameState.produceInventory.length === 0) {
      produceList.innerHTML = `<p class="empty-drawer-notice">No produce yet.</p>`;
    } else {
      gameState.produceInventory.forEach(item => {
        const holoTag = item.isHolo ? ' <span class="holo-badge-tag">HOLO</span>' : '';
        const card = document.createElement('div');
        card.className = 'produce-item-card';
        card.innerHTML = `
          <div class="produce-item-left">
            <span class="produce-item-icon">${item.icon || '🌱'}</span>
            <div>
              <div class="produce-item-name">${item.name}${holoTag}</div>
              <div class="produce-item-kg">${formatKg(item.kg)} • ${formatMeters(item.meters || 0.5)}</div>
            </div>
          </div>
          <div class="produce-item-value">${formatCash(item.value)}</div>
        `;
        produceList.appendChild(card);
      });
    }
  }
}

function renderShopItems() {
  const shopList = el('shop-items-list') || el('shop-manifest-list');
  const refillCountdown = el('shop-refill-timer') || el('shop-refill-countdown');
  
  if (refillCountdown) refillCountdown.textContent = formatTime(gameState.shopRefillTimeLeft || 180);
  if (!shopList) return;
  shopList.innerHTML = '';

  let dropWrapper = el('shop-catalog-dropdown-wrapper');
  if (!dropWrapper) {
    const parentContainer = shopList.parentElement;
    dropWrapper = document.createElement('div');
    dropWrapper.id = 'shop-catalog-dropdown-wrapper';
    dropWrapper.className = 'shop-catalog-dropdown-wrapper';
    dropWrapper.innerHTML = `
      <button class="shop-catalog-select-btn" id="shop-catalog-select-btn">
        <span>🌱 Standard Catalog</span>
        <span class="shop-catalog-arrow">▼</span>
      </button>
      <div class="shop-catalog-menu" id="shop-catalog-menu">
        <div class="shop-catalog-item active" id="shop-menu-catalog">
          <span>🌱</span> Standard Catalog
        </div>
        <div class="shop-catalog-item" id="shop-menu-codex">
          <span>📖</span> Plant Index (Codex)
        </div>
      </div>
    `;

    const selectBtn = dropWrapper.querySelector('#shop-catalog-select-btn');
    const menuCatalog = dropWrapper.querySelector('#shop-menu-catalog');
    const menuCodex = dropWrapper.querySelector('#shop-menu-codex');

    selectBtn.onclick = (e) => {
      e.stopPropagation();
      dropWrapper.classList.toggle('open');
    };

    menuCatalog.onclick = (e) => {
      e.stopPropagation();
      dropWrapper.classList.remove('open');
      renderShopItems();
    };

    menuCodex.onclick = (e) => {
      e.stopPropagation();
      dropWrapper.classList.remove('open');
      closeModal(el('shop-modal'));
      renderIndexCodex();
      openModal(el('index-modal'));
    };

    document.addEventListener('click', (e) => {
      if (!dropWrapper.contains(e.target)) {
        dropWrapper.classList.remove('open');
      }
    });

    parentContainer.insertBefore(dropWrapper, shopList);
  }

  SEED_CATALOG.forEach(seed => {
    const card = document.createElement('div');
    card.className = 'shop-item-card';
    const canAfford = gameState.cash >= seed.cost;
    const isStocked = seed.currentStock > 0;

    card.innerHTML = `
      <div class="shop-item-icon">${seed.icon}</div>
      <div class="shop-item-name">${seed.name}</div>
      <span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span>
      <div class="shop-item-price">${formatCash(seed.cost)}</div>
      <div class="shop-item-stock">Stock: ${seed.currentStock}</div>
      <button class="btn btn-buy ${!canAfford || !isStocked ? 'unaffordable' : ''}" ${!canAfford || !isStocked ? 'disabled' : ''}>
        ${!isStocked ? 'Sold Out' : 'Buy'}
      </button>
    `;

    const buyBtn = card.querySelector('button');
    if (buyBtn && isStocked && canAfford) {
      buyBtn.onclick = () => buySeedItem(seed);
    }
    shopList.appendChild(card);
  });
}

function updateHUD() {
  const cashVal = el('cash-val') || el('currency-amount') || el('cash-amount');
  const levelVal = el('level-val') || el('level-display');
  const fieldName = el('field-name-display') || el('field-title-text') || el('field-title');
  const selectedToolName = el('selected-tool-name');
  const tokenVal = el('fusion-token-count') || el('token-count-display');
  const ogBadge = el('og-badge-hud');
  const rebirthBadge = el('rebirth-badge-hud');
  const rebirthLvlText = el('rebirth-level-hud');
  const rebirthMultText = el('rebirth-mult-hud');

  const idElements = [el('user-id-badge'), el('player-id-hud'), el('player-id-splash')];
  idElements.forEach(elem => {
    if (elem) elem.textContent = `ID: ${myPlayerId}`;
  });
  document.querySelectorAll('.user-id-badge').forEach(elem => {
    elem.textContent = `ID: ${myPlayerId}`;
  });

  if (cashVal) cashVal.textContent = formatCash(gameState.cash);
  if (levelVal) {
    const req = getRequiredXP(gameState.level);
    levelVal.textContent = `🌟 Level ${gameState.level} (${gameState.xp} / ${req} XP)`;
  }
  if (tokenVal) tokenVal.textContent = gameState.fusionTokens || 0;
  if (ogBadge) ogBadge.style.display = gameState.hasOgBadge ? 'inline-flex' : 'none';

  if (rebirthBadge) {
    if (gameState.rebirthLevel > 0) {
      rebirthBadge.classList.remove('hidden');
      if (rebirthLvlText) rebirthLvlText.textContent = gameState.rebirthLevel;
      if (rebirthMultText) rebirthMultText.textContent = `${getRebirthMultiplier().toFixed(1)}×`;
    } else {
      rebirthBadge.classList.add('hidden');
    }
  }

  if (fieldName) fieldName.textContent = `Field ${gameState.currentField + 1} / ${gameState.maxFields}`;
  if (selectedToolName) {
    if (gameState.selectedTool === 'shovel') {
      selectedToolName.textContent = "Tool: Shovel";
    } else {
      const allSeeds = getAllGameSeeds();
      const s = allSeeds.find(x => x.id === gameState.selectedSeedId);
      selectedToolName.textContent = `Plant: ${s ? s.icon + ' ' + s.name : 'None'}`;
    }
  }
}

function updateFenceSkin() {
  const fenceStructure = el('fence-structure') || el('farm-area') || el('farm-yard') || document.querySelector('.wooden-fence-structure');
  if (!fenceStructure) return;

  fenceStructure.classList.remove('fence-skin-articular');
  FENCE_SKINS_CATALOG.forEach(s => {
    fenceStructure.classList.remove(`fence-skin-${s.id}`);
  });

  if (gameState.articularSkinActive) {
    fenceStructure.classList.add('fence-skin-articular');
  } else if (gameState.currentFenceSkin && gameState.currentFenceSkin !== 'classic') {
    fenceStructure.classList.add(`fence-skin-${gameState.currentFenceSkin}`);
  }
}

function updateGlobalCycle() {
  const now = getServerTime();
  const CYCLE_LENGTH = 600000;
  const cycleIndex = Math.floor(now / CYCLE_LENGTH);
  const cycleTime = now % CYCLE_LENGTH;
  const cycleSecondsLeft = Math.floor((CYCLE_LENGTH - cycleTime) / 1000);

  gameState.cycleTimeLeft = cycleSecondsLeft;

  if (gameState.weatherOverride) {
    gameState.isPrismaticRain = true;
    gameState.isDay = false;
    gameState.isDawn = false;
    gameState.isDusk = false;
  } else {
    if (cycleTime < 270000) {
      // Daytime (0:00 - 4:30)
      gameState.isDay = true;
      gameState.isDawn = false;
      gameState.isDusk = false;
      gameState.isPrismaticRain = false;
    } else if (cycleTime < 300000) {
      // Dusk (4:30 - 5:00)
      gameState.isDay = true;
      gameState.isDawn = false;
      gameState.isDusk = true;
      gameState.isPrismaticRain = false;
    } else if (cycleTime < 570000) {
      // Nighttime (5:00 - 9:30) -> 15% Chance of Prismatic Rain
      gameState.isDay = false;
      gameState.isDawn = false;
      gameState.isDusk = false;
      const seedR = mulberry32(cycleIndex + 777)();
      gameState.isPrismaticRain = (seedR < 0.15);
    } else {
      // Dawn (9:30 - 10:00)
      gameState.isDay = false;
      gameState.isDawn = true;
      gameState.isDusk = false;
      gameState.isPrismaticRain = false;
    }
  }

  const themeClass = gameState.isPrismaticRain ? 'prismatic-rain-theme' : (gameState.isDawn ? 'dawn-theme' : (gameState.isDusk ? 'dusk-theme' : (gameState.isDay ? 'day-theme' : 'night-theme')));
  document.body.className = themeClass;

  const cycleLabel = el('cycle-label');
  const cycleTimer = el('cycle-timer');
  const celestialIcon = el('cycle-icon') || el('celestial-icon');

  if (cycleLabel && cycleTimer) {
    cycleTimer.textContent = `(${formatTime(cycleSecondsLeft)})`;
    if (gameState.isPrismaticRain) {
      cycleLabel.textContent = "🌧️ Prismatic Rain";
      if (celestialIcon) celestialIcon.textContent = "🌧️";
    } else if (gameState.isDawn) {
      cycleLabel.textContent = "🌅 Dawn";
      if (celestialIcon) celestialIcon.textContent = "🌅";
    } else if (gameState.isDusk) {
      cycleLabel.textContent = "🌇 Dusk";
      if (celestialIcon) celestialIcon.textContent = "🌇";
    } else if (gameState.isDay) {
      cycleLabel.textContent = "☀️ Daytime";
      if (celestialIcon) celestialIcon.textContent = "☀️";
    } else {
      cycleLabel.textContent = "🌙 Nighttime";
      if (celestialIcon) celestialIcon.textContent = "🌙";
    }
  }
}

function updateShopForCurrentCycle(force = false) {
  const now = getServerTime();
  const REFILL_CYCLE = 180000;
  const currentCycleIndex = Math.floor(now / REFILL_CYCLE);

  if (force || gameState.lastShopCycle !== currentCycleIndex) {
    gameState.lastShopCycle = currentCycleIndex;

    if (isOnline && db) {
      syncGlobalShopStock(currentCycleIndex);
    } else {
      const stockMap = calculateStockForCycle(currentCycleIndex, gameState.restockLuckMultiplier || 1.0);
      SEED_CATALOG.forEach(s => {
        if (stockMap.seeds[s.id] !== undefined) s.currentStock = stockMap.seeds[s.id];
      });
      FENCE_SKINS_CATALOG.forEach(skin => {
        if (stockMap.fences[skin.id] !== undefined) skin.currentStock = stockMap.fences[skin.id];
      });
      renderShopItems();
    }
  }

  const elapsedInRefill = now % REFILL_CYCLE;
  gameState.shopRefillTimeLeft = Math.floor((REFILL_CYCLE - elapsedInRefill) / 1000);
}

function gameLoop() {
  const now = Date.now();
  const dt = (now - lastTickTime) / 1000;
  lastTickTime = now;

  gameState.fields.forEach((field, fieldIdx) => {
    if (fieldIdx >= gameState.unlockedFields) return;
    field.forEach(plot => {
      if (plot.crop) {
        const mult = getGrowthMultiplier(plot.crop);
        if (!plot.isReady) {
          const step = (100 / (plot.actualGrowTime || 10)) * mult * dt;
          plot.progress = Math.min(100, plot.progress + step);
          if (plot.progress >= 100) {
            plot.progress = 100;
            plot.isReady = true;
          }
        }

        if (plot.crop.isVine && plot.vineFruits) {
          plot.vineFruits.forEach(fruit => {
            if (!fruit.isReady) {
              const fStep = (100 / (fruit.growTime || 10)) * mult * dt;
              fruit.progress = Math.min(100, fruit.progress + fStep);
              if (fruit.progress >= 100) {
                fruit.progress = 100;
                fruit.isReady = true;
              }
            }
          });
        }
      }
    });
  });

  renderPlots();

  if (gameState.activeFusion) {
    const fuseModal = el('fuse-machine-modal');
    if (fuseModal && !fuseModal.classList.contains('hidden')) {
      renderFuseMachine();
    }
  }
}

function secondTick() {
  updateGlobalCycle();
  updateShopForCurrentCycle();
  updateDailyDealTimer();
}

function saveGame() {
  const saveKey = isPlaytesterMode ? 'gardenVenture2PlaytesterSave' : 'gardenVenture2Save';
  try {
    localStorage.setItem(saveKey, JSON.stringify(gameState));
  } catch (e) {
    console.warn(e);
  }
}

function loadGame() {
  const saveKey = isPlaytesterMode ? 'gardenVenture2PlaytesterSave' : 'gardenVenture2Save';
  const raw = localStorage.getItem(saveKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      gameState = {
        ...createDefaultGameState(),
        ...parsed,
        seedInventory: { ...createDefaultGameState().seedInventory, ...(parsed.seedInventory || {}) },
        codex: { ...createDefaultGameState().codex, ...(parsed.codex || {}) },
        fusionCodex: { ...createDefaultGameState().fusionCodex, ...(parsed.fusionCodex || {}) },
        holoCodex: { ...createDefaultGameState().holoCodex, ...(parsed.holoCodex || {}) },
        ownedFenceSkins: Array.from(new Set([...(parsed.ownedFenceSkins || ['classic'])]))
      };
      if (!gameState.fields || gameState.fields.length === 0) {
        initFields();
      }
    } catch (e) {
      console.warn(e);
      gameState = createDefaultGameState();
      initFields();
    }
  } else {
    gameState = createDefaultGameState();
    initFields();
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

function setupDOMEventListeners() {
  on('btn-open-daily-rewards', 'click', openDailyRewardsModal);
  on('btn-daily-rewards', 'click', openDailyRewardsModal);
  on('close-daily-rewards-btn', 'click', () => closeModal(el('daily-rewards-modal')));
  on('btn-claim-daily-reward', 'click', claimDailyReward);

  on('btn-open-fuse-machine', 'click', openFuseMachineModal);
  on('btn-fuse-machine', 'click', openFuseMachineModal);
  on('fusion-quick-indicator', 'click', openFuseMachineModal);
  on('close-fuse-btn', 'click', () => closeModal(el('fuse-machine-modal')));
  on('close-plant-picker-btn', 'click', () => closeModal(el('fuse-plant-picker-modal')));
  on('btn-cancel-plant-picker', 'click', () => closeModal(el('fuse-plant-picker-modal')));

  on('btn-clear-fuse-machine', 'click', () => {
    gameState.fuseSlots = [null, null, null, null];
    renderFuseMachine();
  });
  
  on('btn-start-fuse-machine', 'click', startFusionProcess);
  on('btn-use-token-fuse', 'click', finishFusionInstantly);
  on('btn-claim-fuse-reward', 'click', claimFusionResult);

  on('btn-confirm-streak-harvest', 'click', () => {
    if (pendingStreakPlotIndex !== null) {
      const pI = pendingStreakPlotIndex;
      pendingStreakPlotIndex = null;
      closeModal(el('streak-seed-confirm-modal'));

      gameState.dailyStreak = 0;
      gameState.lastDailyClaimTime = 0;
      showToast("⚠️ Streak reset to Day 1!");
      playSFX('shovel');

      performHarvest(pI, window.innerWidth / 2, window.innerHeight / 2);
    }
  });

  on('btn-cancel-streak-harvest', 'click', () => {
    pendingStreakPlotIndex = null;
    closeModal(el('streak-seed-confirm-modal'));
  });

  on('shovel-btn', 'click', () => {
    gameState.selectedTool = gameState.selectedTool === 'shovel' ? 'plant' : 'shovel';
    const sBtn = el('shovel-btn');
    if (sBtn) sBtn.classList.toggle('tool-active', gameState.selectedTool === 'shovel');
    updateHUD();
  });

  on('seed-bag-btn', 'click', () => toggleDrawer(el('seed-bag-drawer')));
  on('close-drawer-btn', 'click', () => closeDrawer(el('seed-bag-drawer')));
  on('tab-seeds-btn', 'click', () => { gameState.activeDrawerTab = 'seeds'; renderSeedDrawer(); });
  on('tab-produce-btn', 'click', () => { gameState.activeDrawerTab = 'produce'; renderSeedDrawer(); });

  on('open-index-btn', 'click', () => {
    renderIndexCodex();
    openModal(el('index-modal'));
  });

  on('btn-shop-open-index', 'click', () => {
    renderIndexCodex();
    openModal(el('index-modal'));
  });
  
  on('close-index-btn', 'click', () => closeModal(el('index-modal')));
  on('close-index-bottom-btn', 'click', () => closeModal(el('index-modal')));

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

  on('btn-sell-select-modal', 'click', renderSellItemPicker);
  on('btn-sell-bargain-modal', 'click', renderBargainNpcView);

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
    showToast(`💰 Sold ${toSell.length}x ${g.name}!`);
    updateHUD();
    saveGame();
    if (gameState.produceInventory.length === 0) {
      closeModal(el('sell-modal'));
    } else {
      renderSellItemPicker();
    }
  });

  on('qty-back-btn', 'click', renderSellItemPicker);

  on('btn-start-bargain', 'click', () => {
    if (gameState.cash < currentBargainFee) {
      showToast("❌ Not enough cash for appraisal!");
      return;
    }
    if (gameState.produceInventory.length === 0) return;

    gameState.cash -= currentBargainFee;
    updateHUD();

    const roll = Math.random();
    let mult = 1.0;
    let desc = "Standard Offer";

    if (roll < 0.35) {
      mult = 0.65;
      desc = "📉 Lowball Offer (0.65×)";
    } else if (roll < 0.70) {
      mult = 1.4;
      desc = "📈 Premium Offer (1.4×)";
    } else if (roll < 0.92) {
      mult = 2.2;
      desc = "🔥 Fortune Offer (2.2×)";
    } else {
      mult = 5.0;
      desc = "🌟 JACKPOT OFFER (5.0×)";
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
    if (dialogueEl) dialogueEl.textContent = `"Offer ready!"`;
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
      showToast("⏳ Daily Deal on cooldown!");
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
    if (dialogueEl) dialogueEl.textContent = `"20× BOOST ACTIVATED!"`;
    if (offerTierEl) {
      offerTierEl.textContent = "🔥 20X BOOST ACTIVE!";
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
    showToast(`💰 Sold ${count} items for ${formatCash(currentBargainPayout)}!`);
    updateHUD();
    saveGame();
    closeModal(el('sell-modal'));
  });

  on('btn-decline-bargain', 'click', () => {
    showToast("Deal declined.");
    renderSellMainOptions();
  });

  on('btn-bargain-back', 'click', renderSellMainOptions);

  on('shop-btn', 'click', () => { renderShopItems(); openModal(el('shop-modal')); });
  on('close-shop-btn', 'click', () => closeModal(el('shop-modal')));
  on('decor-btn', 'click', () => { renderDecorShop(); openModal(el('decor-modal')); });
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
      showToast(gameState.articularSkinActive ? "✨ Equipped Artistic Promise!" : "Equipped standard fence.");
      saveGame();
    } else {
      showToast("🔒 Complete 100% Codex to unlock!");
    }
  });

  on('prev-field-btn', 'click', () => {
    if (gameState.currentField > 0) {
      gameState.currentField--;
      updateHUD();
      renderPlots();
    }
  });

  on('next-field-btn', 'click', () => {
    if (gameState.currentField < gameState.maxFields - 1) {
      gameState.currentField++;
      updateHUD();
      renderPlots();
    }
  });

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
      showToast(`❌ Requires Level ${req}!`);
    }
  });

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
      gameState.cash = 50;
      gameState.level = 1;
      gameState.xp = 0;
      gameState.unlockedFields = 1;
      gameState.currentField = 0;
      gameState.produceInventory = [];
      initFields();

      playSFX('rebirth');
      createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 60, `REBIRTH ${gameState.rebirthLevel}! ♻️✨`, "#00e5ff");
      showToast(`🎉 Ascended to Rebirth ${gameState.rebirthLevel}!`);

      updateHUD();
      renderPlots();
      renderRebirthModal();
      saveGame();
      closeModal(el('rebirth-modal'));
    }
  });

  on('settings-btn', 'click', () => {
    const statsSummaryEl = el('stats-summary');
    if (statsSummaryEl) {
      statsSummaryEl.innerHTML = `
        <div class="stats-summary-content">
          <strong>Player ID:</strong> ${myPlayerId}<br>
          <strong>Farm Level:</strong> ${gameState.level}<br>
          <strong>Unlocked Fields:</strong> ${gameState.unlockedFields} / ${gameState.maxFields}<br>
          <strong>Harvested Items:</strong> ${gameState.produceInventory.length}<br>
          <strong>Cash:</strong> ${formatCash(gameState.cash)}<br>
          <strong>Rebirth Rank:</strong> ${gameState.rebirthLevel} (${getRebirthMultiplier().toFixed(1)}×)<br>
          <strong>Tokens:</strong> ${gameState.fusionTokens || 0}
        </div>
      `;
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
      showToast("🏆 Veteran Verified! +1 VentureBloom Seed granted!");
      playSFX('mutate');
      saveGame();
      updateHUD();
    } else {
      showToast("❌ Invalid Code!");
    }
  });

  on('btn-open-playtester-menu', 'click', () => {
    const status = el('playtester-mode-status');
    const btnToggle = el('btn-toggle-playtester-mode');
    if (status) status.textContent = isPlaytesterMode ? "🧪 Playtester Mode" : "🏠 Main Mode";
    if (btnToggle) btnToggle.textContent = isPlaytesterMode ? "Exit Playtester Mode" : "Enter Playtester Mode";
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
    showToast(isPlaytesterMode ? "Switched to Playtester Mode!" : "Switched to Main Mode!");
  });

  on('btn-reset-playtester', 'click', () => {
    playtesterActionPending = 'reset';
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
  
  on('btn-cancel-playtester-action', 'click', () => closeModal(el('playtester-confirm-modal')));

  on('btn-open-admin-auth', 'click', () => {
    const p1 = el('admin-pass-1');
    const p2 = el('admin-pass-2');
    if (p1) p1.value = '';
    if (p2) p2.value = '';
    openModal(el('admin-login-modal'));
    closeModal(el('settings-modal'));
  });
  
  on('btn-close-admin-login', 'click', () => closeModal(el('admin-login-modal')));

  function submitAdminLogin() {
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
  }

  on('btn-submit-admin', 'click', submitAdminLogin);

  const pass1 = el('admin-pass-1');
  const pass2 = el('admin-pass-2');
  if (pass1) {
    pass1.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAdminLogin();
    });
  }
  if (pass2) {
    pass2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAdminLogin();
    });
  }

  on('admin-btn-trigger-luck', 'click', () => {
    const lVal = el('admin-luck-select') ? Number(el('admin-luck-select').value) : 2;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'global';
    if (scope === 'global' && db) {
      db.ref('globalRestockLuck').set({ multiplier: lVal, timestamp: getServerTime() });
      showToast(`Global Luck set to ${lVal}X for everyone!`);
    } else {
      gameState.restockLuckMultiplier = lVal;
      gameState.lastShopCycle = null;
      updateShopForCurrentCycle();
      showToast(`Local Luck set to ${lVal}X!`);
    }
  });

  on('admin-btn-trigger-fuse-luck', 'click', () => {
    const lVal = el('admin-fuse-luck-select') ? Number(el('admin-fuse-luck-select').value) : 2;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'global';
    if (scope === 'global' && db) {
      db.ref('globalFuseLuck').set({ multiplier: lVal, timestamp: getServerTime() });
      showToast(`Global Fuse Luck set to ${lVal}X for everyone!`);
    } else {
      gameState.fuseLuckMultiplier = lVal;
      renderFuseMachine();
      showToast(`Local Fuse Luck set to ${lVal}X!`);
    }
  });

  on('admin-btn-skip-fuse', 'click', () => {
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';
    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'skipFuse', timestamp: getServerTime() });
      showToast(`Completed active fusions for Everyone!`);
    } else {
      if (gameState.activeFusion) {
        gameState.activeFusion.duration = 0;
        gameState.activeFusion.startTime = getServerTime() - 10000;
        renderFuseMachine();
        playSFX('reward');
        showToast("Completed active fusion!");
      } else {
        showToast("No active fusion running locally.");
      }
    }
  });

  on('admin-btn-toggle-weather', 'click', () => {
    const willRain = !gameState.weatherOverride;
    if (db) {
      db.ref('globalWeatherOverride').set({ active: willRain, timestamp: getServerTime() });
    }
    gameState.weatherOverride = willRain;
    updateGlobalCycle();
    updateHUD();
    showToast(willRain ? "🌧️ Prismatic Rain Activated for everyone!" : "☀️ Natural Weather Restored for everyone!");
  });

  on('admin-btn-grant', 'click', () => {
    const sId = el('admin-seed-select') ? el('admin-seed-select').value : 'carrot';
    const qty = el('admin-seed-qty') ? Math.max(1, Number(el('admin-seed-qty').value)) : 5;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'seed', seedId: sId, amount: qty, timestamp: getServerTime() });
      showToast(`Granted ${qty}x ${sId} to Everyone!`);
    } else {
      gameState.seedInventory[sId] = (gameState.seedInventory[sId] || 0) + qty;
      updateHUD();
      showToast(`Granted ${qty}x ${sId}!`);
    }
  });

  on('admin-btn-grant-og', 'click', () => {
    const qty = el('admin-og-seed-qty') ? Math.max(1, Number(el('admin-og-seed-qty').value)) : 1;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'seed', seedId: 'venturebloom', amount: qty, timestamp: getServerTime() });
      showToast(`Granted ${qty}x VentureBloom (OG) to Everyone!`);
    } else {
      gameState.seedInventory['venturebloom'] = (gameState.seedInventory['venturebloom'] || 0) + qty;
      updateHUD();
      showToast(`Granted ${qty}x VentureBloom (OG)!`);
    }
  });

  on('admin-btn-grant-tokens', 'click', () => {
    const qty = el('admin-token-qty') ? Number(el('admin-token-qty').value) : 3;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'token', amount: qty, timestamp: getServerTime() });
      showToast(`Granted ${qty}x Tokens to Everyone!`);
    } else {
      gameState.fusionTokens = (gameState.fusionTokens || 0) + qty;
      playSFX('reward');
      updateHUD();
      showToast(`Granted ${qty}x Tokens!`);
    }
  });

  on('admin-btn-grant-cash', 'click', () => {
    const amt = el('admin-cash-qty') ? Math.max(1, Number(el('admin-cash-qty').value)) : 1000000;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'cash', amount: amt, timestamp: getServerTime() });
      showToast(`Sent ${formatCash(amt)} to Everyone!`);
    } else {
      gameState.cash += amt;
      updateHUD();
      playSFX('sell');
      showToast(`Added ${formatCash(amt)}!`);
    }
  });

  on('admin-btn-skip-grow', 'click', () => {
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';
    if (scope === 'global' && db) {
      db.ref('adminCommands').push({ type: 'skipGrow', timestamp: getServerTime() });
      showToast(`Matured all crops for Everyone!`);
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
      showToast("Matured all crops!");
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
    document.body.className = 'dawn-theme';

    initFields();
    updateFenceSkin();
    updateHUD();
    renderPlots();
    
    closeModal(el('reset-confirm-modal'));
    showToast("♻️ Save Data reset!");
    setTimeout(() => { location.reload(); }, 500);
  });
  
  on('btn-cancel-reset', 'click', () => closeModal(el('reset-confirm-modal')));

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

  on('status-banner', 'click', () => {
    updateWeatherModalContent();
    openModal(el('weather-modal'));
  });
  on('weather-click-area', 'click', () => {
    updateWeatherModalContent();
    openModal(el('weather-modal'));
  });
  on('close-weather-btn', 'click', () => closeModal(el('weather-modal')));

  on('harvest-all-vine-btn', 'click', () => {
    if (gameState.selectedVinePlotIndex === null) return;
    const p = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex];
    if (!p || !p.vineFruits) return;
    let hCount = 0;

    p.vineFruits.forEach(f => {
      if (f.isReady) {
        const sKg = f.rolledKg || p.crop.minKg || 20;
        const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, true, p.isHoloMutated);
        addXP(Math.ceil((p.crop.baseGrowTime * 1.5) / (p.crop.maxFruits || 3)));
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: f.rolledMeters || 1.0, value: earn, isHolo: p.isHoloMutated });
        f.progress = 0;
        f.isReady = false;
        const rs = rollFruitStats(p.crop);
        f.rolledKg = rs.fruitKg;
        f.growTime = rs.fruitGrowTime;
        f.rolledMeters = rs.fruitMeters;
        hCount++;
      }
    });

    if (hCount > 0) {
      playSFX('harvest');
      showToast(`🎒 Harvested ${hCount} vine crops!`);
      updateHUD();
      renderVineModalContent();
      saveGame();
    }
  });

  on('close-vine-btn', 'click', () => closeModal(el('vine-modal')));

  on('admin-btn-restock', 'click', () => {
    const sId = el('admin-restock-select') ? el('admin-restock-select').value : 'carrot';
    const qty = el('admin-restock-qty') ? Math.max(1, Number(el('admin-restock-qty').value)) : 5;
    const scope = el('admin-target-scope') ? el('admin-target-scope').value : 'local';

    if (scope === 'global' && db) {
      db.ref('shopStock/seeds/' + sId).set(qty);
      db.ref('adminCommands').push({ type: 'restock', seedId: sId, amount: qty, timestamp: getServerTime() });
      showToast(`🛒 Restocked ${sId} to ${qty} for Everyone!`);
    } else {
      const s = SEED_CATALOG.find(x => x.id === sId);
      if (s) s.currentStock = qty;
      renderShopItems();
      showToast(`Stock updated!`);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
      if (gameState.currentField > 0) {
        gameState.currentField--;
        updateHUD();
        renderPlots();
      }
    } else if (e.key === 'ArrowRight' || e.key === 'e' || e.key === 'E') {
      if (gameState.currentField < gameState.maxFields - 1) {
        gameState.currentField++;
        updateHUD();
        renderPlots();
      }
    } else if (e.key === 's' || e.key === 'S') {
      gameState.selectedTool = gameState.selectedTool === 'shovel' ? 'plant' : 'shovel';
      const sBtn = el('shovel-btn');
      if (sBtn) sBtn.classList.toggle('tool-active', gameState.selectedTool === 'shovel');
      updateHUD();
    }
  });
}

function initSplashScreen() {
  const ss = el('splash-screen');
  const pf = el('splash-progress-fill');
  const pe = el('splash-prompt');
  if (!ss) return;
  
  let p = 0;
  const int = setInterval(() => {
    p += 5.0;
    if (p > 100) p = 100;
    if (pf) pf.style.width = `${p}%`;
    if (p >= 100) {
      clearInterval(int);
      if (pe) {
        pe.textContent = 'PRESS TO START';
        pe.classList.add('ready-start');
      }
    }
  }, 20);
  
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

function initGame() {
  initFields();
  loadGame();
  buildPlotDOMStructure();
  initSplashScreen();
  
  updateGlobalCycle();
  updateShopForCurrentCycle(true);
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
