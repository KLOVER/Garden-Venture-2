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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let myPlayerId = localStorage.getItem('gv2_playerId');
if (!myPlayerId) {
  myPlayerId = Math.floor(10000000 + Math.random() * 90000000).toString();
  localStorage.setItem('gv2_playerId', myPlayerId);
}
document.getElementById('player-id-splash').textContent = 'ID: ' + myPlayerId;
document.getElementById('player-id-hud').textContent = 'ID: ' + myPlayerId;

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
  { id: 'strawberry', name: 'Strawberry Seed', icon: '🍓', rarity: 'astral', affinity: 'night', cost: 75000, maxStock: 2, currentStock: 2, baseGrowTime: 90, baseSellPrice: 35000, minKg: 0.1, baseMaxKg: 20.0, maxKg: 10000000, minM: 2.5, maxM: 8.0, isVine: false },
  { id: 'cosmic_rose', name: 'Cosmic Rose Seed', icon: '🌹', rarity: 'astral', affinity: 'night', cost: 150000, maxStock: 2, currentStock: 2, baseGrowTime: 100, baseSellPrice: 65000, minKg: 0.1, baseMaxKg: 10.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false },
  { id: 'singularity', name: 'Singularity Sprout Seed', icon: '🌌', rarity: 'transcendent', affinity: 'all', cost: 2500000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 1200000, minKg: 0.1, baseMaxKg: 25.0, maxKg: 10000000, minM: 3.0, maxM: 12.0, isVine: false },
  { id: 'celestial_moon', name: 'Celestial Moon Seed', icon: '🌙', rarity: 'transcendent', affinity: 'all', cost: 50000000, maxStock: 1, currentStock: 0, baseGrowTime: 150, baseSellPrice: 15000000, minKg: 0.1, baseMaxKg: 35.0, maxKg: 10000000, minM: 4.0, maxM: 15.0, isVine: true, produceIcon: '⭐', produceName: 'Celestial Star', maxFruits: 3 }
];

let gameState = { 
  cash: 25, level: 1, xp: 0, currentField: 0, maxFields: 5, unlockedFields: 1, 
  selectedTool: 'plant', selectedSeedId: 'carrot', selectedVinePlotIndex: null, activeDrawerTab: 'seeds', 
  articularSkinActive: false, isDay: true, cycleTimeLeft: 300, shopRefillTimeLeft: 180, 
  bgmMuted: false, sfxMuted: false, dailyDealUsed: false, 
  seedInventory: { carrot: 5, potato: 0, grape_vine: 0, tomato: 0, glowshroom: 0, starfruit: 0, watermelon_vine: 0, sunflower: 0, nectarroot: 0, strawberry: 0, cosmic_rose: 0, singularity: 0, celestial_moon: 0 }, 
  produceInventory: [], codex: { carrot: { discovered: true, totalHarvested: 0 } }, fields: [], lastShopCycle: null
};

const FIELD_LEVEL_REQS = [1, 50, 150, 300, 1000];
let currentBargainFee = 0, currentBargainBase = 0, currentBargainMultiplier = 1.0, currentBargainPayout = 0, isDailyDealActive = false;
let currentSkipTarget = null, lastSkipTime = 0, isOnline = false, globalShopExpiresAt = 0;
let sellQuantityState = { selectedCropGroup: null, quantityToSell: 1 };
let lastTickTime = Date.now();
let audioCtx = null, lofiTimer = null, chordIndex = 0, plotDomNodes = [];
let pendingTradeReq = null, currentTradeId = null, amIReady = false, myOfferedItems = [];

const dayChords = [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 349.23]];
const nightChords = [[261.63, 329.63, 392.00, 493.88, 587.33], [220.00, 261.63, 329.63, 392.00, 493.88], [146.83, 220.00, 261.63, 349.23, 440.00], [174.61, 207.65, 261.63, 311.13, 392.00]];

const el = id => document.getElementById(id);
const toastContainer = el('toast-container');
const cashEl = el('cash-amount');
const plotsGrid = el('plots-grid');
const fieldTitle = el('field-title');
const levelDisplay = el('level-display');
const statusBanner = el('status-banner');
const cycleIcon = el('cycle-icon');
const cycleLabel = el('cycle-label');
const cycleTimer = el('cycle-timer');
const currentSeedNameEl = el('current-seed-name');
const particlesLayer = el('particles-layer');
const firefliesLayer = el('fireflies-layer');
const fenceStructure = el('fence-structure');
const fieldLockedOverlay = el('field-locked-overlay');
const lockedFieldTitle = el('locked-field-title');
const lockedFieldReq = el('locked-field-req');
const btnUnlockField = el('btn-unlock-field');
const weatherModal = el('weather-modal');
const weatherModalTitle = el('weather-modal-title');
const weatherModalBody = el('weather-modal-body');
const closeWeatherBtn = el('close-weather-btn');
const shovelBtn = el('shovel-btn');
const sellBtn = el('sell-btn');
const shopBtn = el('shop-btn');
const decorBtn = el('decor-btn');
const settingsBtn = el('settings-btn');
const prevFieldBtn = el('prev-field-btn');
const nextFieldBtn = el('next-field-btn');
const seedBagBtn = el('seed-bag-btn');
const seedBagDrawer = el('seed-bag-drawer');
const closeDrawerBtn = el('close-drawer-btn');
const tabSeedsBtn = el('tab-seeds-btn');
const tabProduceBtn = el('tab-produce-btn');
const seedInventoryList = el('seed-inventory-list');
const produceInventoryList = el('produce-inventory-list');
const shopModal = el('shop-modal');
const closeShopBtn = el('close-shop-btn');
const shopItemsList = el('shop-items-list');
const shopRefillTimerEl = el('shop-refill-timer');
const openIndexBtn = el('open-index-btn');
const skipTimerModal = el('skip-timer-modal');
const skipTimeLeft = el('skip-time-left');
const btnConfirmSkip = el('btn-confirm-skip');
const btnCloseSkip = el('btn-close-skip');
const decorModal = el('decor-modal');
const tabFenceSkinsBtn = el('tab-fence-skins-btn');
const tabDecorationsBtn = el('tab-decorations-btn');
const fenceSkinsList = el('fence-skins-list');
const decorationsList = el('decorations-list');
const closeDecorBtn = el('close-decor-btn');
const articularSkinToggleBtn = el('articular-skin-toggle-btn');
const sellModal = el('sell-modal');
const closeSellBtn = el('close-sell-btn');
const sellMainOptions = el('sell-main-options');
const sellItemPicker = el('sell-item-picker');
const sellQuantityPicker = el('sell-quantity-picker');
const btnSellAllModal = el('btn-sell-all-modal');
const btnSellSelectModal = el('btn-sell-select-modal');
const btnSellBargainModal = el('btn-sell-bargain-modal');
const sellAllPayoutText = el('sell-all-payout-text');
const qtyCropHeader = el('qty-crop-header');
const qtyDisplayNum = el('qty-display-num');
const qtyMinusBtn = el('qty-minus-btn');
const qtyPlusBtn = el('qty-plus-btn');
const qtyPayoutPreview = el('qty-payout-preview');
const qtyConfirmSellBtn = el('qty-confirm-sell-btn');
const qtyBackBtn = el('qty-back-btn');
const bargainNpcBox = el('bargain-npc-box');
const npcDialogueText = el('npc-dialogue-text');
const npcBargainFee = el('npc-bargain-fee');
const npcStandardValue = el('npc-standard-value');
const npcProjectedCash = el('npc-projected-cash');
const npcOfferTier = el('npc-offer-tier');
const btnStartBargain = el('btn-start-bargain');
const btnDailyDeal = el('btn-daily-deal');
const btnAcceptBargain = el('btn-accept-bargain');
const btnDeclineBargain = el('btn-decline-bargain');
const btnBargainBack = el('btn-bargain-back');
const vineModal = el('vine-modal');
const vineModalTitle = el('vine-modal-title');
const vineProduceList = el('vine-produce-list');
const harvestAllVineBtn = el('harvest-all-vine-btn');
const skipAllVineBtn = el('skip-all-vine-btn');
const closeVineBtn = el('close-vine-btn');
const permanentInfoModal = el('permanent-info-modal');
const closePermInfoBtn = el('close-perm-info-btn');
const indexModal = el('index-modal');
const closeIndexBtn = el('close-index-btn');
const indexItemsList = el('index-items-list');
const settingsModal = el('settings-modal');
const closeSettingsBtn = el('close-settings-btn');
const resetSaveBtn = el('reset-save-btn');
const statsSummaryEl = el('stats-summary');
const btnOpenAdminLogin = el('btn-open-admin-login');
const adminModal = el('admin-modal');
const closeAdminBtn = el('close-admin-btn');
const adminCashQty = el('admin-cash-qty');
const adminBtnCash = el('admin-btn-cash');
const adminSeedSelect = el('admin-seed-select');
const adminSeedQty = el('admin-seed-qty');
const adminBtnGrant = el('admin-btn-grant');
const adminInjectSelect = el('admin-inject-select');
const adminInjectQty = el('admin-inject-qty');
const adminBtnInject = el('admin-btn-inject');
const adminBtnRestock = el('admin-btn-restock');
const adminSkinSelect = el('admin-skin-select');
const adminBtnSkin = el('admin-btn-skin');
const adminBroadcastMsg = el('admin-broadcast-msg');
const adminBtnBroadcast = el('admin-btn-broadcast');
const friendsBtn = el('friends-btn');
const friendsModal = el('friends-modal');
const closeFriendsBtn = el('close-friends-btn');
const networkStatusText = el('network-status-text');
const activePlayersList = el('active-players-list');
const tabPublicTrade = el('tab-public-trade');
const tabPrivateTrade = el('tab-private-trade');
const tabGlobalChat = el('tab-global-chat');
const publicTradeView = el('public-trade-view');
const privateTradeView = el('private-trade-view');
const globalChatView = el('global-chat-view');
const privateTradeIdInput = el('private-trade-id-input');
const btnSendPrivateTrade = el('btn-send-private-trade');
const chatMessagesContainer = el('chat-messages-container');
const chatInput = el('chat-input');
const btnSendChat = el('btn-send-chat');
const tradeRequestModal = el('trade-request-modal');
const tradeRequestId = el('trade-request-id');
const btnAcceptTrade = el('btn-accept-trade');
const btnDeclineTrade = el('btn-decline-trade');
const tradeSessionModal = el('trade-session-modal');
const tradeStatusIndicator = el('trade-status-indicator');
const tradePartnerTitle = el('trade-partner-title');
const myTradeSlots = el('my-trade-slots');
const theirTradeSlots = el('their-trade-slots');
const theirTradeStatus = el('their-trade-status');
const btnOpenBackpack = el('btn-open-backpack');
const btnTradeReady = el('btn-trade-ready');
const btnTradeCancel = el('btn-trade-cancel');
const tradeBackpackModal = el('trade-backpack-modal');
const tradeTabSeeds = el('trade-tab-seeds');
const tradeTabProduce = el('trade-tab-produce');
const tradePickerList = el('trade-picker-list');
const btnCloseTradeBackpack = el('btn-close-trade-backpack');

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

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
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(f, now + i * 0.05);
      gain.gain.setValueAtTime(0.12, now + i * 0.05); gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.25);
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
  } else if (type === 'levelup') {
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'square'; osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0.1, now + i * 0.1); gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.4);
    });
  }
}

function playNextLofiChord() {
  if (gameState.bgmMuted || !audioCtx) return;
  const now = audioCtx.currentTime;
  const chordSet = gameState.isDay ? dayChords : nightChords;
  const chord = chordSet[chordIndex % chordSet.length];
  chordIndex = (chordIndex + 1) % chordSet.length;
  chord.forEach(f => {
    const osc = audioCtx.createOscillator(), filter = audioCtx.createBiquadFilter(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(f, now);
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(gameState.isDay ? 550 : 380, now);
    gain.gain.setValueAtTime(0.001, now); gain.gain.linearRampToValueAtTime(gameState.isDay ? 0.035 : 0.025, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (gameState.isDay ? 3.2 : 4.5));
    osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + (gameState.isDay ? 3.2 : 4.5));
  });
}

function refreshShopStocks(silent = false) {
  SEED_CATALOG.forEach(s => {
    let chance = 0;
    if (s.rarity === 'common') chance = 1.0;
    else if (s.rarity === 'uncommon') chance = 0.75;
    else if (s.rarity === 'rare') chance = 0.50;
    else if (s.rarity === 'legendary') chance = 0.05;
    if (s.id === 'strawberry') chance = 0.03;
    if (s.id === 'cosmic_rose') chance = 0.01;
    if (s.id === 'singularity') chance = 0.003;
    if (s.id === 'celestial_moon') chance = 0.001;
    s.currentStock = Math.random() < chance ? s.maxStock : 0;
  });
  if (!silent) showToast("🛒 Shop Restocked!");
}

function getGrowthMultiplier(crop) {
  if (!crop) return 1.0;
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
    if (isOnline) {
      db.ref('players/' + myPlayerId).update({ level: gameState.level });
    }
  }
  updateHUD();
}

function formatKg(kg) {
  if (!kg || isNaN(kg)) return '0.0 kg';
  const val = Number(kg);
  if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B kg';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M kg';
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'k kg';
  return val.toFixed(1) + ' kg';
}

function formatMeters(m) {
  if (!m || isNaN(m)) return '0.0m';
  const val = Number(m);
  if (val >= 1000) return (val / 1000).toFixed(1) + 'km';
  return val.toFixed(1) + 'm';
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60) < 10 ? '0' : ''}${seconds % 60}`;
}

function calculateProduceEarnings(basePrice, rolledKg, minKg, isVine = false) {
  const safeKg = rolledKg || minKg || 0.1;
  let multiplier = 1 + (safeKg / (minKg || 0.1)) * 0.25;
  if (isVine) multiplier *= 0.3;
  return Math.round((basePrice || 10) * multiplier);
}

function rollCropWeight(seedToPlant) {
  const minK = Number(seedToPlant.minKg) || 0.1;
  const bMaxK = Number(seedToPlant.baseMaxKg) || 2.5;
  const maxK = Number(seedToPlant.maxKg) || 10000000;
  const r = Math.random();
  let jM = 1.0;
  if (r >= 0.995) jM = 2000 + Math.pow((r - 0.995) / 0.005, 3) * 3998000;
  else if (r >= 0.97) jM = 40 + Math.pow((r - 0.97) / 0.025, 2) * 1960;
  else if (r >= 0.88) jM = 2 + Math.pow((r - 0.88) / 0.09, 1.8) * 38;
  else jM = 1.0 + Math.pow(r / 0.88, 2) * 1.0;
  const bKg = minK + Math.pow(Math.random(), 1.8) * (bMaxK - minK);
  const rKg = Math.min(maxK, bKg * jM);
  const bM = (Number(seedToPlant.minM) || 0.2) + Math.random() * ((Number(seedToPlant.maxM) || 0.8) - (Number(seedToPlant.minM) || 0.2));
  return { rolledKg: rKg, rolledMeters: bM * (jM > 1 ? Math.min(15, Math.pow(jM, 0.25)) : 1.0) };
}

function rollFruitStats(crop) {
  const r = rollCropWeight(crop);
  return { fruitKg: r.rolledKg, fruitGrowTime: Math.max(10, Math.round((crop.baseGrowTime) * (1 + (r.rolledKg / (crop.baseMaxKg || 2.5)) * 0.05))) };
}

function checkCodexCompletion() {
  let discoveredCount = 0;
  SEED_CATALOG.forEach(seed => {
    if (gameState.codex[seed.id] && gameState.codex[seed.id].discovered) discoveredCount++;
  });
  if (discoveredCount >= SEED_CATALOG.length && !gameState.articularSkinActive) {
    gameState.articularSkinActive = true;
    updateFenceSkin();
    playSFX('harvest');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "🏆 INDEX COMPLETED! ARTICULAR SKIN UNLOCKED! ✨", "#00e5ff");
    showToast("🏆 Index Complete! Articular Skin Unlocked!");
  }
}

function getGroupedProduce() {
  const groups = {};
  gameState.produceInventory.forEach(item => {
    if (!groups[item.name]) {
      groups[item.name] = { name: item.name, icon: item.icon, items: [] };
    }
    groups[item.name].items.push(item);
  });
  return Object.values(groups);
}

function openModal(modalEl) {
  modalEl.classList.remove('hidden');
  void modalEl.offsetWidth;
  modalEl.classList.add('open');
}

function closeModal(modalEl) {
  modalEl.classList.remove('open');
  setTimeout(() => {
    if (!modalEl.classList.contains('open')) {
      modalEl.classList.add('hidden');
    }
  }, 220);
}

function toggleDrawer(drawerEl) {
  if (drawerEl.classList.contains('open')) {
    closeDrawer(drawerEl);
  } else {
    openDrawer(drawerEl);
  }
}

function openDrawer(drawerEl) {
  drawerEl.classList.remove('hidden');
  void drawerEl.offsetWidth;
  drawerEl.classList.add('open');
  renderSeedDrawer();
}

function closeDrawer(drawerEl) {
  drawerEl.classList.remove('open');
  setTimeout(() => {
    if (!drawerEl.classList.contains('open')) {
      drawerEl.classList.add('hidden');
    }
  }, 250);
}

function createFloatingText(x, y, text, color) {
  const elem = document.createElement('div');
  elem.className = 'floating-text';
  elem.textContent = text;
  elem.style.left = `${x - 20}px`;
  elem.style.top = `${y - 20}px`;
  if (color) elem.style.color = color;
  particlesLayer.appendChild(elem);
  setTimeout(() => elem.remove(), 1000);
}

function updateFenceSkin() {
  if (fenceStructure) {
    fenceStructure.classList.toggle('fence-skin-articular', !!gameState.articularSkinActive);
  }
}

function updateArticularSkinButton() {
  if (!articularSkinToggleBtn) return;
  let discoveredCount = 0;
  SEED_CATALOG.forEach(seed => {
    if (gameState.codex[seed.id] && gameState.codex[seed.id].discovered) discoveredCount++;
  });
  const isComplete = discoveredCount >= SEED_CATALOG.length;
  if (isComplete) {
    articularSkinToggleBtn.textContent = gameState.articularSkinActive ? "Unequip Skin" : "Equip Skin";
    articularSkinToggleBtn.style.background = gameState.articularSkinActive ? "#ef5350" : "#7c4dff";
  } else {
    articularSkinToggleBtn.textContent = "Check Codex (Locked)";
    articularSkinToggleBtn.style.background = "#b0bec5";
  }
}

function updateHUD() {
  cashEl.textContent = `$${gameState.cash.toLocaleString()}`;
  fieldTitle.textContent = `Field ${gameState.currentField + 1} / ${gameState.maxFields}`;
  levelDisplay.textContent = `🌟 Level ${gameState.level} (${Math.floor(gameState.xp)} / ${getRequiredXP(gameState.level)} XP)`;
  if (gameState.selectedTool === 'shovel') {
    shovelBtn.classList.add('tool-active');
    currentSeedNameEl.textContent = "Tool Active: ⛏️ Shovel";
  } else {
    shovelBtn.classList.remove('tool-active');
    const activeSeed = SEED_CATALOG.find(s => s.id === gameState.selectedSeedId);
    currentSeedNameEl.textContent = activeSeed ? `Plant ${activeSeed.name} (x${gameState.seedInventory[gameState.selectedSeedId] || 0}) [Bag: ${gameState.produceInventory.length}]` : `Open Seed Bag (${gameState.produceInventory.length} Crops)`;
  }
  cycleIcon.textContent = gameState.isDay ? '☀️' : '🌙';
  cycleLabel.textContent = gameState.isDay ? 'Day Time' : 'Night Time';
  cycleTimer.textContent = formatTime(gameState.cycleTimeLeft);
  document.body.classList.toggle('day-theme', gameState.isDay);
  document.body.classList.toggle('night-theme', !gameState.isDay);
}

function renderShopItems() {
  shopItemsList.innerHTML = '';
  SEED_CATALOG.forEach(seed => {
    const canAfford = gameState.cash >= seed.cost;
    const hasStock = seed.currentStock > 0;
    const ownedQty = gameState.seedInventory[seed.id] || 0;
    let buttonText = 'Buy';
    let buttonClass = 'btn-buy';
    if (!hasStock) {
      buttonText = 'Out of Stock';
      buttonClass = 'btn-buy stocked';
    } else if (!canAfford) {
      buttonClass = 'btn-buy unaffordable';
    }
    const card = document.createElement('div');
    card.className = 'shop-item-card';
    card.innerHTML = `<div class="item-info"><div class="item-title">${seed.icon} ${seed.name} ${seed.isVine ? '<span class="permanent-red-p-badge">P</span>' : ''}</div><div><span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span></div><div class="item-price-stock">$${seed.cost.toLocaleString()} | Stock: ${seed.currentStock} (Owned: ${ownedQty})</div></div><button class="${buttonClass}" ${(!canAfford || !hasStock) ? 'disabled' : ''}>${buttonText}</button>`;
    const pBadge = card.querySelector('.permanent-red-p-badge');
    if (pBadge) {
      pBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        openModal(permanentInfoModal);
      });
    }
    if (canAfford && hasStock) {
      card.querySelector('.btn-buy').addEventListener('click', () => {
        gameState.cash -= seed.cost;
        gameState.seedInventory[seed.id]++;
        seed.currentStock--;
        playSFX('sell');
        updateHUD();
        renderShopItems();
      });
    }
    shopItemsList.appendChild(card);
  });
}

function renderSeedDrawer() {
  tabSeedsBtn.classList.toggle('active', gameState.activeDrawerTab === 'seeds');
  tabProduceBtn.classList.toggle('active', gameState.activeDrawerTab === 'produce');
  if (gameState.activeDrawerTab === 'seeds') {
    seedInventoryList.classList.remove('hidden');
    produceInventoryList.classList.add('hidden');
    seedInventoryList.innerHTML = '';
    SEED_CATALOG.forEach(seed => {
      const card = document.createElement('div');
      card.className = `seed-select-card ${gameState.selectedSeedId === seed.id && gameState.selectedTool === 'plant' ? 'active' : ''}`;
      card.innerHTML = `<div style="font-size: 22px;">${seed.icon}</div><div style="display:flex; flex-direction:column;"><span style="font-size:12px; font-weight:800;">${seed.name}</span><span style="font-size:10px; color:#5d4037;">Qty: ${gameState.seedInventory[seed.id] || 0}</span></div>`;
      card.addEventListener('click', () => {
        gameState.selectedSeedId = seed.id;
        gameState.selectedTool = 'plant';
        closeDrawer(seedBagDrawer);
        updateHUD();
      });
      seedInventoryList.appendChild(card);
    });
  } else {
    seedInventoryList.classList.add('hidden');
    produceInventoryList.classList.remove('hidden');
    produceInventoryList.innerHTML = '';
    if (gameState.produceInventory.length === 0) {
      produceInventoryList.innerHTML = `<p style="text-align:center; color:#6d4c41; font-weight:800; padding:20px;">🧺 Bag is empty!</p>`;
      return;
    }
    gameState.produceInventory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'produce-item-card';
      card.innerHTML = `<div style="display:flex; align-items:center; gap:10px; width:100%;"><div style="font-size:26px;">${item.icon}</div><div style="display:flex; flex-direction:column; flex:1;"><span style="font-size:13px; font-weight:900; color:#2c1a14;">${item.name}</span><span style="font-size:11px; color:#2e7d32; font-weight:800;">Weight: ${formatKg(item.kg)} | Value: $${item.value.toLocaleString()}</span></div></div>`;
      produceInventoryList.appendChild(card);
    });
  }
}

function renderIndexCodex() {
  indexItemsList.innerHTML = '';
  SEED_CATALOG.forEach(seed => {
    const isDiscovered = !!(gameState.codex[seed.id] && gameState.codex[seed.id].discovered);
    const card = document.createElement('div');
    card.className = `codex-card-item ${isDiscovered ? '' : 'locked'}`;
    card.innerHTML = `<div style="font-size: 28px;">${isDiscovered ? seed.icon : '❓'}</div><div style="font-size: 12px; font-weight: 800;">${isDiscovered ? seed.name : 'Unknown Plant'}</div><span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span><div style="font-size: 10px; color: #5d4037; margin-top: 2px;">${isDiscovered ? `Discovered` : 'Not Discovered'}</div>`;
    indexItemsList.appendChild(card);
  });
}

function renderSellMainOptions() {
  sellMainOptions.classList.remove('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.add('hidden');
  let totalValue = 0;
  gameState.produceInventory.forEach(item => totalValue += item.value);
  sellAllPayoutText.textContent = `Total Value: $${totalValue.toLocaleString()} (${gameState.produceInventory.length} items)`;
}

function renderSellItemPicker() {
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.remove('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.add('hidden');
  sellItemPicker.innerHTML = '';
  getGroupedProduce().forEach(group => {
    let groupTotalVal = 0;
    group.items.forEach(i => groupTotalVal += i.value);
    const card = document.createElement('div');
    card.className = 'btn-sell-option';
    card.innerHTML = `<span style="font-size: 28px;">${group.icon}</span><div class="sell-opt-text" style="flex: 1;"><span class="opt-title">${group.name} (x${group.items.length})</span><span class="opt-subtitle">Total Value: $${groupTotalVal.toLocaleString()}</span></div><button class="btn-market-select">${group.items.length > 1 ? 'Choose Qty 🧺' : `Sell 1 ($${groupTotalVal.toLocaleString()})`}</button>`;
    card.addEventListener('click', () => {
      if (group.items.length === 1) {
        const itemToSell = group.items[0];
        gameState.cash += itemToSell.value;
        const idx = gameState.produceInventory.findIndex(p => p.id === itemToSell.id);
        if (idx !== -1) gameState.produceInventory.splice(idx, 1);
        playSFX('sell');
        createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+$${itemToSell.value.toLocaleString()}! 💰`, "#ffd54f");
        updateHUD();
        if (gameState.produceInventory.length === 0) closeModal(sellModal);
        else renderSellItemPicker();
      } else {
        sellQuantityState.selectedCropGroup = group;
        sellQuantityState.quantityToSell = 1;
        renderSellQuantityPicker();
      }
    });
    sellItemPicker.appendChild(card);
  });
}

function renderSellQuantityPicker() {
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.remove('hidden');
  bargainNpcBox.classList.add('hidden');
  const group = sellQuantityState.selectedCropGroup;
  if (!group || group.items.length === 0) { renderSellItemPicker(); return; }
  qtyCropHeader.textContent = `${group.icon} ${group.name} (Owned: x${group.items.length})`;
  qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
  let payout = 0;
  for (let i = 0; i < sellQuantityState.quantityToSell; i++) {
    if (group.items[i]) payout += group.items[i].value;
  }
  qtyPayoutPreview.textContent = `Payout: $${payout.toLocaleString()}`;
}

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

function buildPlotDOMStructure() {
  plotsGrid.innerHTML = '';
  plotDomNodes = [];
  for (let i = 0; i < 9; i++) {
    const plotEl = document.createElement('div');
    plotEl.className = 'plot';
    const cropTimerBadge = document.createElement('div');
    cropTimerBadge.className = 'crop-timer-badge';
    cropTimerBadge.style.display = 'none';
    const growthBar = document.createElement('div');
    growthBar.className = 'growth-bar';
    growthBar.style.display = 'none';
    const progress = document.createElement('div');
    progress.className = 'growth-progress';
    growthBar.appendChild(progress);
    const cropContainer = document.createElement('div');
    cropContainer.className = 'crop-container';
    cropContainer.style.display = 'none';
    const cropIcon = document.createElement('div');
    cropIcon.className = 'crop-icon';
    cropContainer.appendChild(cropIcon);
    const dirtBed = document.createElement('div');
    dirtBed.className = 'dirt-bed';
    plotEl.appendChild(cropTimerBadge);
    plotEl.appendChild(growthBar);
    plotEl.appendChild(cropContainer);
    plotEl.appendChild(dirtBed);
    plotEl.addEventListener('click', (event) => handlePlotClick(i, event));
    plotsGrid.appendChild(plotEl);
    plotDomNodes.push({ plotEl: plotEl, cropTimerBadge: cropTimerBadge, growthBar: growthBar, progress: progress, cropContainer: cropContainer, cropIcon: cropIcon });
  }
}

function spawnNightFireflies() {
  if (!firefliesLayer) return;
  firefliesLayer.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
    ff.style.left = `${Math.random() * 92 + 4}%`;
    ff.style.top = `${Math.random() * 90 + 5}%`;
    ff.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
    ff.style.animationDuration = `${(3 + Math.random() * 3).toFixed(2)}s`;
    firefliesLayer.appendChild(ff);
  }
}

function renderPlots() {
  if (gameState.currentField >= gameState.unlockedFields) {
    fieldLockedOverlay.classList.remove('hidden');
    lockedFieldTitle.textContent = `Field ${gameState.currentField + 1} Locked`;
    const req = FIELD_LEVEL_REQS[gameState.currentField];
    lockedFieldReq.textContent = `Reach Level ${req} to unlock!`;
    if (gameState.level >= req) {
      btnUnlockField.textContent = `Unlock Field!`;
      btnUnlockField.disabled = false;
    } else {
      btnUnlockField.textContent = `Level ${req} Required`;
      btnUnlockField.disabled = true;
    }
  } else {
    fieldLockedOverlay.classList.add('hidden');
  }

  const currentPlots = gameState.fields[gameState.currentField];

  currentPlots.forEach((plot, i) => {
    const nodes = plotDomNodes[i];
    if (!nodes) return;
    nodes.plotEl.classList.toggle('ready', plot.isReady || (plot.crop && plot.crop.isVine && plot.vineEstablished));
    nodes.plotEl.classList.toggle('vine-plot', !!(plot.crop && plot.crop.isVine));
    nodes.plotEl.classList.toggle('cloud-piercer', (plot.rolledMeters || 0) > 20);
    nodes.plotEl.classList.toggle('nocturnal-active', !!(plot.crop && plot.crop.affinity === 'night' && !gameState.isDay));
    nodes.plotEl.classList.toggle('cosmic-rose-active', !!(plot.crop && plot.crop.id === 'cosmic_rose'));

    if (plot.crop) {
      nodes.cropContainer.style.display = 'flex';
      const targetMeters = plot.rolledMeters || 1;
      const targetKg = plot.rolledKg || plot.crop.minKg || 0.1;
      const currentKg = (plot.progress / 100) * targetKg;
      const currentMeters = (plot.progress / 100) * targetMeters;
      const maxVisualScale = Math.min(3.5, 0.8 + Math.log10(targetKg + 1) * 0.45);
      const scaleFactor = 0.3 + (plot.progress / 100) * (maxVisualScale - 0.3);
      nodes.cropIcon.style.setProperty('--crop-scale', scaleFactor);
      nodes.cropIcon.textContent = plot.progress < 35 ? '🌱' : plot.crop.icon;
      nodes.cropIcon.classList.toggle('mature', plot.isReady || plot.vineEstablished);
      nodes.cropTimerBadge.style.display = 'flex';
      let speedBadge = '';
      if (plot.crop.affinity === 'night' && !gameState.isDay) speedBadge = '⚡2X ';
      if (plot.crop.affinity === 'day' && gameState.isDay) speedBadge = '☀️2X ';

      if (plot.crop.isVine) {
        if (!plot.vineEstablished) {
          const speedMultiplier = getGrowthMultiplier(plot.crop);
          const remainingSecs = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 10)) * speedMultiplier)));
          nodes.cropTimerBadge.textContent = `🌱 ${formatMeters(currentMeters)} | ${speedBadge}${remainingSecs}s`;
          nodes.cropTimerBadge.classList.remove('ready-badge');
          nodes.growthBar.style.display = 'block';
          nodes.progress.style.width = `${Math.min(100, plot.progress)}%`;
        } else {
          const readyFruits = (plot.vineFruits || []).filter(f => f.isReady).length;
          nodes.cropTimerBadge.textContent = `${plot.crop.produceIcon || '🍇'} ${readyFruits}/${(plot.vineFruits || []).length} Ready | ${formatMeters(targetMeters)}`;
          nodes.cropTimerBadge.classList.toggle('ready-badge', readyFruits > 0);
          nodes.growthBar.style.display = 'none';
        }
      } else if (!plot.isReady) {
        const speedMultiplier = getGrowthMultiplier(plot.crop);
        const remainingSecs = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 5)) * speedMultiplier)));
        nodes.cropTimerBadge.textContent = `🌱 ${formatKg(currentKg)} | ${speedBadge}${remainingSecs}s`;
        nodes.cropTimerBadge.classList.remove('ready-badge');
        nodes.growthBar.style.display = 'block';
        nodes.progress.style.width = `${Math.min(100, plot.progress)}%`;
      } else {
        nodes.cropTimerBadge.textContent = `READY! ${formatKg(targetKg)} ✨`;
        nodes.cropTimerBadge.classList.add('ready-badge');
        nodes.growthBar.style.display = 'none';
      }
    } else {
      nodes.cropContainer.style.display = 'none';
      nodes.growthBar.style.display = 'none';
      nodes.cropTimerBadge.style.display = 'none';
    }
  });
}

function handlePlotClick(plotIndex, event) {
  if (gameState.currentField >= gameState.unlockedFields) return;
  const currentPlots = gameState.fields[gameState.currentField];
  const plot = currentPlots[plotIndex];
  const posX = event ? event.clientX : window.innerWidth / 2;
  const posY = event ? event.clientY : window.innerHeight / 2;

  if (gameState.selectedTool === 'shovel') {
    if (plot.crop) {
      plot.crop = null;
      plot.progress = 0;
      plot.isReady = false;
      plot.vineEstablished = false;
      plot.vineFruits = [];
      playSFX('shovel');
      createFloatingText(posX, posY, "Removed ⛏️", "#ff8a80");
      renderPlots();
    }
    return;
  }
  
  if (plot.crop && plot.crop.isVine && !plot.vineEstablished) { openSkipModal(plotIndex); return; }
  if (plot.crop && plot.crop.isVine && plot.vineEstablished) { gameState.selectedVinePlotIndex = plotIndex; openVineModal(); return; }
  if (plot.crop && !plot.isReady) { openSkipModal(plotIndex); return; }

  if (plot.crop && plot.isReady) {
    const harvestedCrop = plot.crop;
    const safeKg = plot.rolledKg || harvestedCrop.minKg || 0.1;
    const safeMeters = plot.rolledMeters || harvestedCrop.minM || 1;
    const earnings = calculateProduceEarnings(harvestedCrop.baseSellPrice, safeKg, harvestedCrop.minKg, false);
    const xpReward = Math.ceil(harvestedCrop.baseGrowTime * 1.5);
    addXP(xpReward);

    gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: harvestedCrop.id, name: harvestedCrop.name.replace(' Seed', ''), icon: harvestedCrop.icon, kg: safeKg, meters: safeMeters, value: earnings });
    if (!gameState.codex[harvestedCrop.id]) { gameState.codex[harvestedCrop.id] = { discovered: true, totalHarvested: 0 }; checkCodexCompletion(); }
    gameState.codex[harvestedCrop.id].totalHarvested += 1;
    
    plot.crop = null;
    plot.progress = 0;
    plot.isReady = false;
    plot.vineEstablished = false;
    
    playSFX('harvest');
    createFloatingText(posX, posY, `+1 ${harvestedCrop.icon} (${formatKg(safeKg)}) 🎒`, "#81c784");
    updateHUD();
    renderPlots();
    return;
  }

  if (!plot.crop) {
    const seedToPlant = SEED_CATALOG.find(s => s.id === gameState.selectedSeedId);
    if (!seedToPlant) return;
    if (seedToPlant.isVine && currentPlots.filter(p => p.crop && p.crop.isVine).length >= 3) { createFloatingText(posX, posY, "Max 3 Vines per Field Bed! 🌿", "#ef5350"); showToast("🌿 Max 3 Vines per Field!"); return; }
    if ((gameState.seedInventory[seedToPlant.id] || 0) <= 0) { createFloatingText(posX, posY, "Out of Seeds! Buy in Shop 🛒", "#ef5350"); showToast("🛒 Out of seeds! Check the shop."); return; }
    
    gameState.seedInventory[seedToPlant.id]--;
    const weightRoll = rollCropWeight(seedToPlant);
    plot.crop = { ...seedToPlant };
    plot.progress = 0;
    plot.isReady = false;
    plot.vineEstablished = false;
    plot.rolledKg = weightRoll.rolledKg;
    plot.rolledMeters = weightRoll.rolledMeters;
    plot.actualGrowTime = Math.max(5, Math.round((Number(seedToPlant.baseGrowTime) || 5) * (1 + (weightRoll.rolledKg / (seedToPlant.baseMaxKg || 2.5)) * 0.05)));
    
    if (!gameState.codex[seedToPlant.id]) { gameState.codex[seedToPlant.id] = { discovered: true, totalHarvested: 0 }; checkCodexCompletion(); }
    
    playSFX('plant');
    createFloatingText(posX, posY, `Planted ${seedToPlant.icon}`, "#81c784");
    updateHUD();
    renderPlots();
  }
}

function openSkipModal(plotIndex, isFruit = false, fruitIndex = 0) {
  const plot = gameState.fields[gameState.currentField][plotIndex];
  currentSkipTarget = { plotIndex: plotIndex, isFruit: isFruit, fruitIndex: fruitIndex };
  let remainingSecs = 0;
  let crop = plot.crop;
  const speedMultiplier = getGrowthMultiplier(crop);
  
  if (isFruit) {
    const fruit = plot.vineFruits[fruitIndex];
    remainingSecs = Math.max(1, Math.ceil((100 - fruit.progress) / ((100 / (fruit.growTime || 10)) * speedMultiplier)));
  } else {
    remainingSecs = Math.max(1, Math.ceil((100 - plot.progress) / ((100 / (plot.actualGrowTime || 5)) * speedMultiplier)));
  }
  
  const perSecCost = ((crop.baseSellPrice || 10) * 0.1) + 11574;
  const cost = Math.ceil(remainingSecs * perSecCost);
  currentSkipTarget.cost = cost;
  skipTimeLeft.textContent = `${remainingSecs}s`;
  btnConfirmSkip.textContent = `Skip for $${cost.toLocaleString()}`;
  btnConfirmSkip.disabled = gameState.cash < cost;
  openModal(skipTimerModal);
}

btnConfirmSkip.addEventListener('click', () => {
  if (!currentSkipTarget) return;
  if (Date.now() - lastSkipTime < 3000) { showToast("⏳ Skip is on cooldown! Please wait 3 seconds."); return; }
  
  if (gameState.cash >= currentSkipTarget.cost) {
    gameState.cash -= currentSkipTarget.cost;
    lastSkipTime = Date.now();
    const plot = gameState.fields[gameState.currentField][currentSkipTarget.plotIndex];
    
    if (currentSkipTarget.isFruit) {
      plot.vineFruits[currentSkipTarget.fruitIndex].progress = 100;
      plot.vineFruits[currentSkipTarget.fruitIndex].isReady = true;
    } else {
      plot.progress = 100;
      if (plot.crop.isVine) {
        plot.vineEstablished = true;
        plot.vineFruits = [];
        for (let f = 0; f < Math.min(3, plot.crop.maxFruits || 3); f++) {
          const rolledStats = rollFruitStats(plot.crop);
          plot.vineFruits.push({ fruitId: `${plot.crop.id}_${f}`, name: plot.crop.produceName, icon: plot.crop.produceIcon, progress: 0, isReady: false, rolledKg: rolledStats.fruitKg, growTime: rolledStats.fruitGrowTime });
        }
      } else {
        plot.isReady = true;
      }
    }
    
    playSFX('sell');
    createFloatingText(window.innerWidth/2, window.innerHeight/2, "Time Skipped! ⏳✨", "#29b6f6");
    updateHUD();
    renderPlots();
    if (currentSkipTarget.isFruit) { renderVineModalContent(); }
    closeModal(skipTimerModal);
  } else {
    showToast("❌ Not enough money to skip!");
  }
});

btnCloseSkip.addEventListener('click', () => closeModal(skipTimerModal));

function openVineModal() { 
  renderVineModalContent(); 
  openModal(vineModal); 
}

function renderVineModalContent() {
  if (gameState.selectedVinePlotIndex === null) return; 
  const plot = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex]; 
  if (!plot || !plot.crop || !plot.crop.isVine) return;
  
  vineModalTitle.textContent = `${plot.crop.icon} ${plot.crop.name}`; 
  vineProduceList.innerHTML = ''; 
  let totalSkipCost = 0;
  let fruitsToSkip = 0;
  
  (plot.vineFruits || []).forEach((fruit, idx) => {
    const safeKg = fruit.rolledKg || plot.crop.minKg || 0.1;
    const earnings = calculateProduceEarnings(plot.crop.baseSellPrice, safeKg, plot.crop.minKg, true);
    const speedMultiplier = getGrowthMultiplier(plot.crop);
    const remainingSecs = Math.max(1, Math.ceil((100 - fruit.progress) / ((100 / (fruit.growTime || 10)) * speedMultiplier)));
    
    if (!fruit.isReady) { 
      const perSecCost = ((plot.crop.baseSellPrice || 10) * 0.1) + 11574;
      totalSkipCost += Math.ceil(remainingSecs * perSecCost); 
      fruitsToSkip++; 
    }
    
    const card = document.createElement('div'); 
    card.className = 'vine-produce-card';
    let buttonHtml = '';
    if (fruit.isReady) { buttonHtml = `<button class="btn-vine-harvest">Harvest</button>`; } 
    else { buttonHtml = `<button class="btn-vine-harvest" style="background:#29b6f6; box-shadow: 0 4px 0 #0288d1;">Skip (⏳ ${remainingSecs}s)</button>`; }

    card.innerHTML = `<div class="card-left-group"><div class="item-icon-badge">${fruit.icon}</div><div class="item-details"><span class="item-title">${fruit.name} #${idx+1}</span><span class="item-sub-stat">${fruit.isReady ? `${formatKg(safeKg)} • <strong style="color:#2e7d32;">$${earnings.toLocaleString()}</strong>` : `🌱 ${formatKg((fruit.progress/100)*safeKg)}`}</span></div></div>${buttonHtml}`;
    
    const actionBtn = card.querySelector('.btn-vine-harvest');
    if (fruit.isReady) { 
      actionBtn.addEventListener('click', () => { 
        const xpReward = Math.ceil((plot.crop.baseGrowTime * 1.5) / (plot.crop.maxFruits || 3)); 
        addXP(xpReward); 
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: plot.crop.id, name: fruit.name, icon: fruit.icon, kg: safeKg, meters: plot.crop.minM, value: earnings }); 
        fruit.progress = 0; fruit.isReady = false; const rolledStats = rollFruitStats(plot.crop); fruit.rolledKg = rolledStats.fruitKg; fruit.growTime = rolledStats.fruitGrowTime; 
        playSFX('harvest'); showToast(`🎒 Harvested ${fruit.icon}!`); updateHUD(); renderVineModalContent(); 
      }); 
    } else { 
      actionBtn.addEventListener('click', () => { openSkipModal(gameState.selectedVinePlotIndex, true, idx); }); 
    }
    vineProduceList.appendChild(card);
  });
  
  if (fruitsToSkip > 0) { 
    skipAllVineBtn.textContent = `⏳ Skip All ($${totalSkipCost.toLocaleString()})`; 
    skipAllVineBtn.disabled = gameState.cash < totalSkipCost; 
    skipAllVineBtn.onclick = () => { 
      if (Date.now() - lastSkipTime < 3000) { showToast("⏳ Cooldown! Wait 3s."); return; } 
      if (gameState.cash >= totalSkipCost) { 
        gameState.cash -= totalSkipCost; lastSkipTime = Date.now(); 
        plot.vineFruits.forEach(f => { f.progress = 100; f.isReady = true; }); 
        playSFX('sell'); showToast(`⏳ Skipped all fruits!`); updateHUD(); renderVineModalContent(); 
      } else { showToast("❌ Not enough money!"); } 
    }; 
  } else { 
    skipAllVineBtn.textContent = `⏳ Skip All`; 
    skipAllVineBtn.disabled = true; 
    skipAllVineBtn.onclick = null; 
  }
}

harvestAllVineBtn.addEventListener('click', () => {
  if (gameState.selectedVinePlotIndex === null) return; 
  const plot = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex]; 
  if (!plot || !plot.crop || !plot.crop.isVine) return; 
  let count = 0;
  (plot.vineFruits || []).forEach(fruit => {
    if (fruit.isReady) {
      const safeKg = fruit.rolledKg || plot.crop.minKg || 0.1;
      const earnings = calculateProduceEarnings(plot.crop.baseSellPrice, safeKg, plot.crop.minKg, true);
      const xpReward = Math.ceil((plot.crop.baseGrowTime * 1.5) / (plot.crop.maxFruits || 3)); 
      addXP(xpReward);
      gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: plot.crop.id, name: fruit.name, icon: fruit.icon, kg: safeKg, meters: plot.crop.minM, value: earnings });
      fruit.progress = 0; fruit.isReady = false; const rolledStats = rollFruitStats(plot.crop); fruit.rolledKg = rolledStats.fruitKg; fruit.growTime = rolledStats.fruitGrowTime; count++;
    }
  });
  if (count > 0) { playSFX('harvest'); showToast(`🎒 Harvested ${count} Vine Fruits!`); updateHUD(); renderVineModalContent(); }
});

closeVineBtn.addEventListener('click', () => closeModal(vineModal));

// ==========================================
// LISTENERS & SETTINGS
// ==========================================
prevFieldBtn.addEventListener('click', (e) => { 
  e.stopPropagation(); 
  if (gameState.currentField > 0) { plotsGrid.classList.add('slide-out-right'); setTimeout(() => { gameState.currentField--; updateHUD(); renderPlots(); plotsGrid.classList.remove('slide-out-right'); }, 150); }
});

nextFieldBtn.addEventListener('click', (e) => { 
  e.stopPropagation(); 
  if (gameState.currentField < gameState.maxFields - 1) { plotsGrid.classList.add('slide-out-left'); setTimeout(() => { gameState.currentField++; updateHUD(); renderPlots(); plotsGrid.classList.remove('slide-out-left'); }, 150); }
});

seedBagBtn.addEventListener('click', () => toggleDrawer(seedBagDrawer));
closeDrawerBtn.addEventListener('click', () => closeDrawer(seedBagDrawer));
shopBtn.addEventListener('click', () => { renderShopItems(); openModal(shopModal); });
closeShopBtn.addEventListener('click', () => closeModal(shopModal));

openIndexBtn.addEventListener('click', () => { 
  indexItemsList.innerHTML = ''; 
  SEED_CATALOG.forEach(seed => { 
    const discovered = !!(gameState.codex[seed.id] && gameState.codex[seed.id].discovered); 
    const card = document.createElement('div'); card.className = `codex-card-item ${discovered ? '' : 'locked'}`; 
    card.innerHTML = `<div style="font-size:28px;">${discovered ? seed.icon : '❓'}</div><div style="font-size:12px; font-weight:800;">${discovered ? seed.name : 'Unknown Plant'}</div><span class="rarity-tag rarity-${seed.rarity}">${seed.rarity}</span><div style="font-size:10px; color:#5d4037; margin-top:2px;">${discovered ? 'Discovered' : 'Locked'}</div>`; 
    indexItemsList.appendChild(card); 
  }); 
  openModal(indexModal); 
});

closeIndexBtn.addEventListener('click', () => closeModal(indexModal));

settingsBtn.addEventListener('click', () => {
  statsSummaryEl.innerHTML = `<p style="font-size: 13px; color: #4e342e; margin-bottom: 10px;"><strong>🌟 Farm Level:</strong> ${gameState.level}<br><strong>Unlocked Fields:</strong> ${gameState.unlockedFields} / ${gameState.maxFields}<br><strong>Harvested Crops Stored:</strong> ${gameState.produceInventory.length} items<br><strong>Carrot Seeds Owned:</strong> ${gameState.seedInventory.carrot || 0}</p>`;
  openModal(settingsModal);
});

closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));

resetSaveBtn.addEventListener('click', () => { 
  if (confirm("Are you sure you want to reset all garden progress?")) { localStorage.removeItem('gardenVenture2Save'); location.reload(); } 
});

// ==========================================
// SELL & BARGAIN SYSTEM
// ==========================================
sellBtn.addEventListener('click', () => { 
  if (gameState.produceInventory.length === 0) { showToast("❌ Seed bag empty!"); return; } 
  openModal(sellModal); sellMainOptions.classList.remove('hidden'); sellItemPicker.classList.add('hidden'); sellQuantityPicker.classList.add('hidden'); bargainNpcBox.classList.add('hidden'); 
  let totalValue = 0; gameState.produceInventory.forEach(item => totalValue += item.value); sellAllPayoutText.textContent = `Total Value: $${totalValue.toLocaleString()} (${gameState.produceInventory.length} items)`; 
});

closeSellBtn.addEventListener('click', () => closeModal(sellModal));

btnSellAllModal.addEventListener('click', () => { 
  let totalEarned = 0; gameState.produceInventory.forEach(item => totalEarned += item.value); gameState.produceInventory = []; gameState.cash += totalEarned; 
  playSFX('sell'); showToast(`💰 Sold All for $${totalEarned.toLocaleString()}!`); updateHUD(); closeModal(sellModal); 
});

btnSellSelectModal.addEventListener('click', () => { 
  sellMainOptions.classList.add('hidden'); sellItemPicker.classList.remove('hidden'); sellItemPicker.innerHTML = '';
  getGroupedProduce().forEach(group => { 
    let groupTotalVal = 0; group.items.forEach(item => groupTotalVal += item.value); 
    const card = document.createElement('div'); card.className = 'btn-sell-option'; 
    card.innerHTML = `<span style="font-size:28px;">${group.icon}</span><div class="sell-opt-text" style="flex:1;"><span class="opt-title">${group.name} (x${group.items.length})</span><span class="opt-subtitle">Total Value: $${groupTotalVal.toLocaleString()}</span></div><button class="btn-market-select">Sell</button>`; 
    card.addEventListener('click', () => {
      if (group.items.length === 1) { 
        const item = group.items[0]; gameState.cash += item.value; gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === item.id), 1); 
        playSFX('sell'); showToast(`💰 Sold for $${item.value.toLocaleString()}!`); updateHUD(); 
        if (gameState.produceInventory.length === 0) { closeModal(sellModal); } else { btnSellSelectModal.click(); }
      } else { 
        sellQuantityState.selectedCropGroup = group; sellQuantityState.quantityToSell = 1; sellItemPicker.classList.add('hidden'); sellQuantityPicker.classList.remove('hidden'); 
        qtyCropHeader.textContent = `${group.icon} ${group.name} (x${group.items.length})`; qtyDisplayNum.textContent = '1'; qtyPayoutPreview.textContent = `Payout: $${group.items[0].value.toLocaleString()}`; 
      }
    }); 
    sellItemPicker.appendChild(card); 
  });
});

qtyMinusBtn.addEventListener('click', () => { 
  if (sellQuantityState.quantityToSell > 1) { sellQuantityState.quantityToSell--; qtyDisplayNum.textContent = sellQuantityState.quantityToSell; let payout = 0; for (let i = 0; i < sellQuantityState.quantityToSell; i++) { payout += sellQuantityState.selectedCropGroup.items[i].value; } qtyPayoutPreview.textContent = `Payout: $${payout.toLocaleString()}`; } 
});

qtyPlusBtn.addEventListener('click', () => { 
  const group = sellQuantityState.selectedCropGroup; 
  if (group && sellQuantityState.quantityToSell < group.items.length) { sellQuantityState.quantityToSell++; qtyDisplayNum.textContent = sellQuantityState.quantityToSell; let payout = 0; for (let i = 0; i < sellQuantityState.quantityToSell; i++) { payout += group.items[i].value; } qtyPayoutPreview.textContent = `Payout: $${payout.toLocaleString()}`; } 
});

qtyConfirmSellBtn.addEventListener('click', () => { 
  const group = sellQuantityState.selectedCropGroup; let totalEarned = 0; const count = sellQuantityState.quantityToSell; 
  for (let i = 0; i < count; i++) { const item = group.items[i]; totalEarned += item.value; gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === item.id), 1); } 
  gameState.cash += totalEarned; playSFX('sell'); showToast(`💰 Sold ${count}x for $${totalEarned.toLocaleString()}!`); updateHUD(); 
  if (gameState.produceInventory.length === 0) { closeModal(sellModal); } else { btnSellSelectModal.click(); }
});

qtyBackBtn.addEventListener('click', () => btnSellSelectModal.click());

btnSellBargainModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) { showToast("❌ Seed bag is empty!"); return; }
  sellMainOptions.classList.add('hidden'); sellItemPicker.classList.add('hidden'); sellQuantityPicker.classList.add('hidden'); bargainNpcBox.classList.remove('hidden');
  let baseVal = 0; let highRarityCount = 0;
  gameState.produceInventory.forEach(item => { baseVal += item.value; if (item.seedId === 'singularity' || item.seedId === 'celestial_moon' || item.seedId === 'strawberry' || item.seedId === 'cosmic_rose') { highRarityCount++; } });
  currentBargainBase = baseVal; currentBargainFee = Math.round(baseVal * 0.20 + highRarityCount * 1250000); isDailyDealActive = false;
  npcDialogueText.textContent = `Greetings traveler! I am Merchant Barnaby. I can appraise your Seed Bag and make you a custom deal. My appraisal fee is $${currentBargainFee.toLocaleString()}.`;
  npcBargainFee.textContent = `Appraisal Fee: $${currentBargainFee.toLocaleString()}`; npcStandardValue.textContent = `$${baseVal.toLocaleString()}`; npcProjectedCash.textContent = `$0`;
  npcOfferTier.classList.add('hidden'); btnStartBargain.classList.remove('hidden'); btnDailyDeal.classList.add('hidden'); btnAcceptBargain.classList.add('hidden'); btnDeclineBargain.classList.add('hidden');
});

btnStartBargain.addEventListener('click', () => {
  if (gameState.cash < currentBargainFee) { showToast("❌ Not enough cash for Appraisal Fee!"); return; }
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
    showToast(`Accepted Bargain: +$${finalPayout.toLocaleString()}! 🧙‍♂️`);
    currentBargainPayout = 0; isDailyDealActive = false; updateHUD(); closeModal(sellModal);
  }
});

btnDeclineBargain.addEventListener('click', () => { isDailyDealActive = false; currentBargainPayout = 0; sellMainOptions.classList.remove('hidden'); bargainNpcBox.classList.add('hidden'); });
btnBargainBack.addEventListener('click', () => { isDailyDealActive = false; currentBargainPayout = 0; sellMainOptions.classList.remove('hidden'); bargainNpcBox.classList.add('hidden'); });

// ==========================================
// TRADE NETWORK (FIREBASE LOGIC)
// ==========================================
function initGlobalShop() {
  db.ref('globalShop').on('value', snap => {
    const data = snap.val();
    if (data && data.expiresAt > Date.now()) {
      globalShopExpiresAt = data.expiresAt;
      if (gameState.lastShopCycle !== data.cycleId) {
        gameState.lastShopCycle = data.cycleId;
        SEED_CATALOG.forEach(s => { s.currentStock = data.items[s.id] !== undefined ? data.items[s.id] : 0; });
        showToast("🛒 Shop Restocked!");
        if (!shopModal.classList.contains('hidden')) { renderShopItems(); }
      }
    } else if (isOnline) {
      const cycleId = Date.now();
      const expiresAt = cycleId + (180 * 1000);
      const items = {};
      SEED_CATALOG.forEach(seed => {
        let chance = 0;
        if (seed.rarity === 'common') chance = 1.0; 
        else if (seed.rarity === 'uncommon') chance = 0.75; 
        else if (seed.rarity === 'rare') chance = 0.50; 
        else if (seed.rarity === 'legendary') chance = 0.05;
        if (seed.id === 'strawberry') chance = 0.03; 
        if (seed.id === 'cosmic_rose') chance = 0.01; 
        if (seed.id === 'singularity') chance = 0.003; 
        if (seed.id === 'celestial_moon') chance = 0.001;
        if (Math.random() < chance) { items[seed.id] = seed.maxStock; }
      });
      db.ref('globalShop').set({ cycleId, expiresAt, items });
    }
  });
}

function initFirebasePresence() {
  db.ref('.info/connected').on('value', snap => {
    if (snap.val() === true) {
      isOnline = true; showToast("🌐 Connected to Trade Network!"); 
      networkStatusText.innerHTML = "Network Status: ONLINE 🟢"; networkStatusText.style.color = "#2e7d32";
      const myRef = db.ref('players/' + myPlayerId); 
      myRef.onDisconnect().remove(); 
      myRef.set({ level: gameState.level, online: true, inTrade: false });
    } else {
      if (isOnline) showToast("🔴 Disconnected from Network"); 
      isOnline = false; networkStatusText.innerHTML = "Network Status: Offline 🔴"; networkStatusText.style.color = "#d32f2f";
    }
  });

  db.ref('players').on('value', snap => {
    const players = snap.val() || {}; 
    activePlayersList.innerHTML = ''; let count = 0;
    for (let id in players) {
      if (id === myPlayerId) continue; 
      count++;
      const pData = players[id];
      const pRow = document.createElement('div'); 
      pRow.style = "display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px 12px; border-radius:8px; margin-bottom:6px; border:2px solid #e0c9a6;";
      const btnStatus = pData.inTrade ? 'disabled style="background:#b0bec5; box-shadow:none; cursor:not-allowed;"' : 'style="background:#8e24aa; box-shadow:0 3px 0 #6a1b9a;"';
      const btnText = pData.inTrade ? 'In Trade' : 'Trade';
      pRow.innerHTML = `<span style="font-weight:900; color:#4e342e;">ID: ${id} <span style="font-size:12px; color:#f57c00;">(Lvl ${pData.level})</span></span> <button class="btn" style="padding:6px 12px; font-size:12px;" ${btnStatus}>${btnText}</button>`;
      
      if (!pData.inTrade) {
        pRow.querySelector('button').addEventListener('click', () => { sendTradeRequest(id); });
      }
      activePlayersList.appendChild(pRow);
    }
    if (count === 0) { activePlayersList.innerHTML = `<p style="text-align:center; color:#795548; font-weight:800; font-size:14px;">No other players online.</p>`; }
  });

  db.ref('players/' + myPlayerId + '/tradeRequest').on('value', snap => {
    const req = snap.val();
    if (req && req.from) { 
      tradeRequestId.textContent = req.from; openModal(tradeRequestModal); pendingTradeReq = req.from; 
    } else { closeModal(tradeRequestModal); pendingTradeReq = null; }
  });

  db.ref('players/' + myPlayerId + '/activeTrade').on('value', snap => {
     const tId = snap.val();
     if (tId) {
        currentTradeId = tId; amIReady = false; myOfferedItems = []; btnTradeReady.style.filter = "brightness(1)";
        closeModal(friendsModal); closeModal(tradeRequestModal); closeModal(tradeBackpackModal); renderTradeSlots(null, null); openModal(tradeSessionModal);
        
        db.ref('trades/' + tId).on('value', tSnap => {
           const tData = tSnap.val(); if (!tData) return;
           tradePartnerTitle.textContent = `Partner: ${tData.p1 === myPlayerId ? tData.p2 : tData.p1}`;
           const tk = tData.p1 === myPlayerId ? 'p2Ready' : 'p1Ready';
           theirTradeStatus.textContent = tData[tk] ? 'Partner is READY ✅' : 'Waiting for partner...';
           theirTradeStatus.style.color = tData[tk] ? '#2e7d32' : '#c62828';
           renderTradeSlots(tData.p1 === myPlayerId ? tData.p1Items : tData.p2Items, tData.p1 === myPlayerId ? tData.p2Items : tData.p1Items);
           
           if (tData.status === 'completed') {
              db.ref('trades/' + tId).off();
              if (tData.p1 === myPlayerId) {
                 (tData.p1Items||[]).forEach(i => { if(i.type==='seed') gameState.seedInventory[i.seedId]--; else gameState.produceInventory.splice(gameState.produceInventory.findIndex(x=>x.id===i.id), 1); });
                 (tData.p2Items||[]).forEach(i => { if(i.type==='seed') gameState.seedInventory[i.seedId]++; else gameState.produceInventory.push(i); });
                 db.ref('trades/' + tId).remove(); 
              } else {
                 (tData.p2Items||[]).forEach(i => { if(i.type==='seed') gameState.seedInventory[i.seedId]--; else gameState.produceInventory.splice(gameState.produceInventory.findIndex(x=>x.id===i.id), 1); });
                 (tData.p1Items||[]).forEach(i => { if(i.type==='seed') gameState.seedInventory[i.seedId]++; else gameState.produceInventory.push(i); });
              }
              showToast("✅ Trade Successful!"); updateHUD(); closeModal(tradeSessionModal); db.ref('players/' + myPlayerId).update({ activeTrade: null, inTrade: false }); currentTradeId = null;
           } else if (tData.status === 'cancelled') {
              db.ref('trades/' + tId).off(); showToast("❌ Trade Declined"); closeModal(tradeSessionModal); db.ref('players/' + myPlayerId).update({ activeTrade: null, inTrade: false }); currentTradeId = null;
           }
        });
     } else {
        if (currentTradeId) { db.ref('trades/' + currentTradeId).off(); closeModal(tradeSessionModal); currentTradeId = null; db.ref('players/' + myPlayerId).update({ inTrade: false }); }
     }
  });

  db.ref('chat').limitToLast(15).on('child_added', snap => {
    const c = snap.val(); if(!c) return;
    const isMe = c.sender === myPlayerId;
    const d = document.createElement('div');
    d.style = `padding: 8px 12px; border-radius: 12px; max-width: 85%; font-weight: 800; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); clear: both; ${isMe ? 'background: #e1f5fe; color: #0277bd; border: 2px solid #81d4fa; align-self: flex-end;' : 'background: #fff; color: #4e342e; border: 2px solid #d7ccc8; align-self: flex-start;'}`;
    d.innerHTML = `<div style="font-size: 10px; opacity: 0.7; margin-bottom: 2px;">${c.sender}</div>${c.text}`;
    chatMessagesContainer.appendChild(d); chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  });
}

friendsBtn.addEventListener('click', () => openModal(friendsModal));
closeFriendsBtn.addEventListener('click', () => closeModal(friendsModal));

tabPublicTrade.addEventListener('click', () => { 
  tabPublicTrade.classList.add('active'); tabPrivateTrade.classList.remove('active'); tabGlobalChat.classList.remove('active'); 
  publicTradeView.classList.remove('hidden'); privateTradeView.classList.add('hidden'); globalChatView.classList.add('hidden'); 
});
tabPrivateTrade.addEventListener('click', () => { 
  tabPrivateTrade.classList.add('active'); tabPublicTrade.classList.remove('active'); tabGlobalChat.classList.remove('active'); 
  privateTradeView.classList.remove('hidden'); publicTradeView.classList.add('hidden'); globalChatView.classList.add('hidden'); 
});
tabGlobalChat.addEventListener('click', () => { 
  tabGlobalChat.classList.add('active'); tabPublicTrade.classList.remove('active'); tabPrivateTrade.classList.remove('active'); 
  globalChatView.classList.remove('hidden'); publicTradeView.classList.add('hidden'); privateTradeView.classList.add('hidden'); 
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; 
});

function sendTradeRequest(targetId) {
  if (!isOnline) { showToast("❌ You are offline."); return; }
  db.ref('players/' + targetId).once('value', snap => {
    if (snap.exists() && snap.val().online) {
       if (snap.val().inTrade) { showToast("❌ This person is already in a trade!"); return; }
       db.ref('players/' + targetId + '/tradeRequest').set({ from: myPlayerId }); showToast("📩 Request sent to " + targetId);
    } else { showToast("❌ Player not found."); }
  });
}

btnSendPrivateTrade.addEventListener('click', () => { const t = privateTradeIdInput.value.trim(); if(t && t !== myPlayerId) { sendTradeRequest(t); } });
btnDeclineTrade.addEventListener('click', () => { db.ref('players/' + myPlayerId + '/tradeRequest').remove(); closeModal(tradeRequestModal); });

btnAcceptTrade.addEventListener('click', () => {
  const p = pendingTradeReq; const tId = myPlayerId + "_" + p + "_" + Date.now();
  db.ref('trades/' + tId).set({ p1: myPlayerId, p2: p, p1Ready: false, p2Ready: false, status: 'negotiating' });
  db.ref('players/' + myPlayerId + '/tradeRequest').remove();
  db.ref('players/' + myPlayerId).update({ activeTrade: tId, inTrade: true }); 
  db.ref('players/' + p).update({ activeTrade: tId, inTrade: true });
});

btnTradeCancel.addEventListener('click', () => { if (currentTradeId) { db.ref('trades/' + currentTradeId).update({ status: 'cancelled' }); } });

btnTradeReady.addEventListener('click', () => {
   if (currentTradeId) {
      amIReady = !amIReady; btnTradeReady.style.filter = amIReady ? "brightness(0.6)" : "brightness(1)";
      db.ref('trades/' + currentTradeId).once('value', snap => {
         const t = snap.val();
         if (t) {
           const myKey = t.p1 === myPlayerId ? 'p1Ready' : 'p2Ready';
           const theirKey = t.p1 === myPlayerId ? 'p2Ready' : 'p1Ready';
           db.ref('trades/' + currentTradeId).update({ [myKey]: amIReady });
           if (amIReady && t[theirKey] === true) { db.ref('trades/' + currentTradeId).update({ status: 'completed' }); }
         }
      });
   }
});

btnOpenBackpack.addEventListener('click', () => { if (amIReady) return; openModal(tradeBackpackModal); renderTradeBackpack('seeds'); });
btnCloseTradeBackpack.addEventListener('click', () => closeModal(tradeBackpackModal));
tradeTabSeeds.addEventListener('click', () => renderTradeBackpack('seeds'));
tradeTabProduce.addEventListener('click', () => renderTradeBackpack('produce'));

function renderTradeBackpack(tab) {
  tradeTabSeeds.classList.toggle('active', tab === 'seeds'); tradeTabProduce.classList.toggle('active', tab === 'produce'); tradePickerList.innerHTML = '';
  if (tab === 'seeds') {
    SEED_CATALOG.forEach(s => {
      let offeredCount = myOfferedItems.filter(i => i.seedId === s.id && i.type === 'seed').length;
      let available = (gameState.seedInventory[s.id] || 0) - offeredCount;
      if (available > 0) { 
        const card = document.createElement('div'); card.className = 'shop-item-card'; 
        card.innerHTML = `<div class="item-info"><div class="item-title">${s.icon} ${s.name}</div><div class="item-price-stock" style="color:#5d4037;">Available: ${available}</div></div><button class="btn-buy" style="background:#29b6f6; box-shadow:0 4px 0 #0288d1;">Add</button>`; 
        card.querySelector('button').addEventListener('click', () => { 
          if(myOfferedItems.length >= 9) { showToast("❌ Trade full!"); return; } 
          myOfferedItems.push({ tradeRef: Math.random().toString(), type: 'seed', seedId: s.id, icon: s.icon, name: s.name }); 
          syncMyTradeOffer(); renderTradeBackpack('seeds'); 
        }); tradePickerList.appendChild(card); 
      }
    });
  } else {
    gameState.produceInventory.forEach(item => {
      if (!myOfferedItems.some(x => x.id === item.id)) { 
        const card = document.createElement('div'); card.className = 'shop-item-card'; 
        card.innerHTML = `<div class="item-info"><div class="item-title">${item.icon} ${item.name}</div><div class="item-price-stock" style="color:#2e7d32;">${formatKg(item.kg)}</div></div><button class="btn-buy" style="background:#29b6f6; box-shadow:0 4px 0 #0288d1;">Add</button>`; 
        card.querySelector('button').addEventListener('click', () => { 
          if(myOfferedItems.length >= 9){ showToast("❌ Trade full!"); return; } 
          myOfferedItems.push({ tradeRef: Math.random().toString(), type: 'produce', id: item.id, seedId: item.seedId, icon: item.icon, name: item.name, kg: item.kg, meters: item.meters, value: item.value }); 
          syncMyTradeOffer(); renderTradeBackpack('produce'); 
        }); tradePickerList.appendChild(card); 
      }
    });
  }
}

function syncMyTradeOffer() { 
  if(!currentTradeId) return; 
  db.ref('trades/' + currentTradeId).once('value', s => { const t = s.val(); if (t) { db.ref('trades/' + currentTradeId + '/' + (t.p1 === myPlayerId ? 'p1Items' : 'p2Items')).set(myOfferedItems); } }); 
}

function renderTradeSlots(myData, theirData) {
  myTradeSlots.innerHTML = ''; theirTradeSlots.innerHTML = '';
  for (let i = 0; i < 9; i++) {
     const myItem = myData ? myData[i] : null; const mySlot = document.createElement('div');
     if (myItem) { 
       mySlot.className = 'trade-slot filled'; mySlot.innerHTML = `<div class="slot-icon">${myItem.icon}</div><div class="slot-name">${myItem.name}</div>${myItem.type==='produce' ? `<div class="slot-kg">${formatKg(myItem.kg)}</div>` : ''}`; 
       mySlot.onclick = () => { if (amIReady) return; myOfferedItems.splice(i, 1); syncMyTradeOffer(); }; 
     } else { mySlot.className = 'trade-slot'; }
     myTradeSlots.appendChild(mySlot);
     
     const theirItem = theirData ? theirData[i] : null; const theirSlot = document.createElement('div');
     if (theirItem) { 
       theirSlot.className = 'trade-slot filled'; theirSlot.innerHTML = `<div class="slot-icon">${theirItem.icon}</div><div class="slot-name">${theirItem.name}</div>${theirItem.type==='produce' ? `<div class="slot-kg">${formatKg(theirItem.kg)}</div>` : ''}`; 
     } else { theirSlot.className = 'trade-slot'; }
     theirTradeSlots.appendChild(theirSlot);
  }
}

btnSendChat.addEventListener('click', () => { 
  const msg = chatInput.value.trim(); 
  if(msg !== '' && isOnline) { db.ref('chat').push({ sender: myPlayerId, text: msg, timestamp: Date.now() }); chatInput.value = ''; } 
});

// ==========================================
// SYSTEM LOOPS & INIT
// ==========================================
function gameLoop() {
  const now = Date.now(), delta = Math.min((now - lastTickTime) / 1000, 0.1); 
  lastTickTime = now; 
  gameState.fields.forEach(fieldPlots => {
    fieldPlots.forEach(plot => {
      if (plot.crop) {
        const speedMultiplier = getGrowthMultiplier(plot.crop);
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
            plot.vineFruits.forEach(fruit => { 
              if (!fruit.isReady) { 
                fruit.progress += ((100 / (fruit.growTime || 10)) * speedMultiplier) * delta; 
                if (fruit.progress >= 100) { fruit.progress = 100; fruit.isReady = true; } 
              } 
            });
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
  let sLeft = Math.floor((globalShopExpiresAt - Date.now()) / 1000);
  if (sLeft <= 0) { 
    sLeft = 0; if (isOnline) { db.ref('globalShop').once('value', snap => { if(snap.val() && snap.val().expiresAt < Date.now()) { db.ref('globalShop').remove(); } }); }
  }
  shopRefillTimerEl.textContent = formatTime(sLeft); updateHUD();
}

function initSplashScreen() {
  const splashScreen = el('splash-screen');
  const progressFill = el('splash-progress-fill');
  const promptEl = el('splash-prompt');
  
  if (!splashScreen || !progressFill || !promptEl) return;
  
  let progress = 0;
  let loaded = false;
  promptEl.textContent = "🎷 PRESS (A) / TAP TO START 🎵";
  
  const loadingInterval = setInterval(() => {
    progress += 2.0; 
    if (progress > 100) progress = 100;
    progressFill.style.width = `${progress}%`;
    if (progress >= 100) { 
      clearInterval(loadingInterval); 
      loaded = true; 
      promptEl.textContent = 'CLICK TO START YOUR VENTURE'; 
      promptEl.classList.add('ready-start'); 
    }
  }, 40);

  splashScreen.addEventListener('click', () => {
    initAudioContext();
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
    playSFX('harvest');
    if (!loaded) { 
      progress = 100; 
      progressFill.style.width = '100%'; 
      promptEl.textContent = 'CLICK TO START YOUR VENTURE'; 
      promptEl.classList.add('ready-start'); 
      loaded = true; 
      return; 
    }
    splashScreen.classList.add('fade-out');
    setTimeout(() => { splashScreen.style.display = 'none'; }, 500);
  });
}

function saveGame() {
  localStorage.setItem('gardenVenture2Save', JSON.stringify({
    cash: gameState.cash, level: gameState.level, xp: gameState.xp, currentField: gameState.currentField, unlockedFields: gameState.unlockedFields,
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
      gameState.cash = data.cash !== undefined ? data.cash : 25;
      gameState.level = data.level !== undefined ? data.level : 1;
      gameState.xp = data.xp !== undefined ? data.xp : 0;
      gameState.currentField = data.currentField !== undefined ? data.currentField : 0;
      gameState.unlockedFields = data.unlockedFields !== undefined ? data.unlockedFields : 1;
      gameState.selectedSeedId = data.selectedSeedId || 'carrot';
      gameState.bgmMuted = data.bgmMuted || false;
      gameState.sfxMuted = data.sfxMuted || false;
      gameState.dailyDealUsed = data.dailyDealUsed || false;
      gameState.articularSkinActive = data.articularSkinActive || false;
      if (data.seedInventory) { for (let key in data.seedInventory) { gameState.seedInventory[key] = data.seedInventory[key]; } }
      SEED_CATALOG.forEach(s => { if (gameState.seedInventory[s.id] === undefined) gameState.seedInventory[s.id] = 0; });
      if (data.codex) { for (let key in data.codex) { gameState.codex[key] = data.codex[key]; } }
      gameState.produceInventory = data.produceInventory || [];
      if (data.fields && Array.isArray(data.fields)) {
         gameState.fields = data.fields;
         while(gameState.fields.length < gameState.maxFields) {
             const plots = [];
             for (let p = 0; p < 9; p++) { plots.push({ crop: null, progress: 0, isReady: false, vineEstablished: false, rolledKg: 0, rolledMeters: 0, actualGrowTime: 5, vineFruits: [] }); }
             gameState.fields.push(plots);
         }
      }
    } catch (e) { console.error("Save load error", e); }
  }
}

function initGame() {
  initFields(); buildPlotDOMStructure(); spawnNightFireflies(); initSplashScreen(); loadGame(); initGlobalShop(); updateFenceSkin(); updateHUD(); renderPlots(); initFirebasePresence();
  setInterval(gameLoop, 100); setInterval(secondTick, 1000); setInterval(saveGame, 5000);
}

window.addEventListener('DOMContentLoaded', initGame);