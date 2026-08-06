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
  { id: 'strawberry', name: 'Strawberry Seed', icon: '🍓', rarity: 'astral', affinity: 'night', cost: 75000, maxStock: 2, currentStock: 2, baseGrowTime: 90, baseSellPrice: 25000, minKg: 0.1, baseMaxKg: 20.0, maxKg: 10000000, minM: 2.5, maxM: 8.0, isVine: false },
  { id: 'cosmic_rose', name: 'Cosmic Rose Seed', icon: '🌹', rarity: 'astral', affinity: 'night', cost: 150000, maxStock: 2, currentStock: 2, baseGrowTime: 100, baseSellPrice: 45000, minKg: 0.1, baseMaxKg: 10.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false },
  { id: 'singularity', name: 'Singularity Sprout Seed', icon: '🌌', rarity: 'transcendent', affinity: 'all', cost: 2500000, maxStock: 1, currentStock: 0, baseGrowTime: 120, baseSellPrice: 800000, minKg: 0.1, baseMaxKg: 25.0, maxKg: 10000000, minM: 3.0, maxM: 12.0, isVine: false },
  { id: 'celestial_moon', name: 'Celestial Moon Seed', icon: '🌙', rarity: 'transcendent', affinity: 'all', cost: 50000000, maxStock: 1, currentStock: 0, baseGrowTime: 150, baseSellPrice: 5000000, minKg: 0.1, baseMaxKg: 35.0, maxKg: 10000000, minM: 4.0, maxM: 15.0, isVine: true, produceIcon: '⭐', produceName: 'Celestial Star', maxFruits: 3 }
];

let gameState = {
  cash: 25,
  level: 1,
  xp: 0,
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
  seedInventory: { carrot: 5, potato: 0, grape_vine: 0, tomato: 0, glowshroom: 0, starfruit: 0, watermelon_vine: 0, sunflower: 0, nectarroot: 0, strawberry: 0, cosmic_rose: 0, singularity: 0, celestial_moon: 0 },
  produceInventory: [],
  codex: { carrot: { discovered: true, totalHarvested: 0 } },
  fields: [],
  lastShopCycle: null
};

const FIELD_LEVEL_REQS = [1, 50, 150, 300, 1000];

let currentBargainFee = 0, currentBargainBase = 0, currentBargainMultiplier = 1.0, currentBargainPayout = 0, isDailyDealActive = false;
let currentSkipTarget = null, lastSkipTime = 0, isOnline = false;
let sellQuantityState = { selectedCropGroup: null, quantityToSell: 1 };
let lastTickTime = Date.now();
let audioCtx = null, lofiTimer = null, chordIndex = 0, plotDomNodes = [];
let pendingTradeReq = null, currentTradeId = null, amIReady = false, myOfferedItems = [];
let isTitanBargainerActive = false; 

let serverTimeOffset = 0;
let timeSynced = false;

function getServerTime() {
  return Date.now() + serverTimeOffset;
}

// 🌟 DETERMINISTIC PSEUDO-RANDOM NUMBER GENERATOR (100% Synced Worldwide) 🌟
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getGlobalShopStockForCycle(cycleId) {
  const rng = mulberry32(cycleId);
  const stockMap = {};
  
  SEED_CATALOG.forEach(s => {
    let c = 1.0;
    if (s.rarity === 'uncommon') c = 0.75;
    else if (s.rarity === 'rare') c = 0.50;
    else if (s.rarity === 'legendary') c = 0.05;
    
    if (s.id === 'strawberry') c = 0.03;
    if (s.id === 'cosmic_rose') c = 0.01;
    if (s.id === 'singularity') c = 0.003;
    if (s.id === 'celestial_moon') c = 0.001;

    stockMap[s.id] = (s.rarity === 'common' || rng() < c) ? s.maxStock : 0;
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
    
    const stockMap = getGlobalShopStockForCycle(cycleId);
    SEED_CATALOG.forEach(s => {
      if (stockMap[s.id] !== undefined) {
        s.currentStock = stockMap[s.id];
      }
    });
    
    if (shopModal && !shopModal.classList.contains('hidden')) {
      renderShopItems();
    }
    
    if (!isFirstLoad && !silent) {
      showToast("🛒 Shop Restocked!");
    }
  }
}

const dayChords = [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 349.23]];
const nightChords = [[261.63, 329.63, 392.00, 493.88, 587.33], [220.00, 261.63, 329.63, 392.00, 493.88], [146.83, 220.00, 261.63, 349.23, 440.00], [174.61, 207.65, 261.63, 311.13, 392.00]];

const el = id => document.getElementById(id);

const toastContainer = el('toast-container');
const cashEl = el('cash-amount');
const plotsGrid = el('plots-grid');
const fieldTitle = el('field-title');
const levelDisplay = el('level-display');
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
const statsSummaryEl = el('stats-summary');

const btnOpenResetConfirm = el('btn-open-reset-confirm');
const resetConfirmModal = el('reset-confirm-modal');
const btnConfirmReset = el('btn-confirm-reset');
const btnCancelReset = el('btn-cancel-reset');

const btnOpenAdminAuth = el('btn-open-admin-auth');
const adminLoginModal = el('admin-login-modal');
const adminPass1 = el('admin-pass-1');
const adminPass2 = el('admin-pass-2');
const btnSubmitAdmin = el('btn-submit-admin');
const btnCloseAdminLogin = el('btn-close-admin-login');

const adminModal = el('admin-modal');
const closeAdminBtn = el('close-admin-btn');
const adminTargetScope = el('admin-target-scope');
const adminCashQty = el('admin-cash-qty');
const adminBtnCash = el('admin-btn-cash');
const adminSeedSelect = el('admin-seed-select');
const adminSeedQty = el('admin-seed-qty');
const adminBtnGrant = el('admin-btn-grant');
const adminInjectSelect = el('admin-inject-select');
const adminInjectQty = el('admin-inject-qty');
const adminBtnInject = el('admin-btn-inject');
const adminBtnRestock = el('admin-btn-restock');

const adminBtnSkipGrow = el('admin-btn-skip-grow');
const adminBtnTitanBargainer = el('admin-btn-titan-bargainer');

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
  setTimeout(() => {
    t.remove();
  }, 4500);
}

function openModal(m) {
  m.classList.remove('hidden');
  void m.offsetWidth;
  m.classList.add('open');
}

function closeModal(m) {
  m.classList.remove('open');
  setTimeout(() => {
    if (!m.classList.contains('open')) {
      m.classList.add('hidden');
    }
  }, 220);
}

function toggleDrawer(d) {
  if (d.classList.contains('open')) {
    closeDrawer(d);
  } else {
    openDrawer(d);
  }
}

function openDrawer(d) {
  d.classList.remove('hidden');
  void d.offsetWidth;
  d.classList.add('open');
  renderSeedDrawer();
}

function closeDrawer(d) {
  d.classList.remove('open');
  setTimeout(() => {
    if (!d.classList.contains('open')) {
      d.classList.add('hidden');
    }
  }, 250);
}

function createFloatingText(x, y, text, color) {
  const elem = document.createElement('div');
  elem.className = 'floating-text';
  elem.textContent = text;
  elem.style.left = `${x - 20}px`;
  elem.style.top = `${y - 20}px`;
  if (color) {
    elem.style.color = color;
  }
  particlesLayer.appendChild(elem);
  setTimeout(() => {
    elem.remove();
  }, 1000);
}

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSFX(type) {
  if (gameState.sfxMuted) {
    return;
  }
  initAudioContext();
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
      osc.frequency.setValueAtTime(f, now + i * 0.05);
      gain.gain.setValueAtTime(0.12, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.25);
    });
  } else if (type === 'sell') {
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now);
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    osc1.start(now);
    osc2.start(now + 0.08);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } else if (type === 'shovel') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'levelup') {
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0.1, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  }
}

function playNextLofiChord() {
  if (gameState.bgmMuted || !audioCtx) {
    return;
  }
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
}

function getGrowthMultiplier(crop) {
  if (!crop) {
    return 1.0;
  }
  if (crop.affinity === 'night' && !gameState.isDay) {
    return 2.0;
  }
  if (crop.affinity === 'day' && gameState.isDay) {
    return 2.0;
  }
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
  if (!kg || isNaN(kg)) {
    return '0.0 kg';
  }
  const v = Number(kg);
  if (v >= 1e9) {
    return (v / 1e9).toFixed(1) + 'B kg';
  }
  if (v >= 1e6) {
    return (v / 1e6).toFixed(1) + 'M kg';
  }
  if (v >= 1e3) {
    return (v / 1e3).toFixed(1) + 'k kg';
  }
  return v.toFixed(1) + ' kg';
}

function formatMeters(m) {
  if (!m || isNaN(m)) {
    return '0.0m';
  }
  const v = Number(m);
  if (v >= 1000) {
    return (v / 1000).toFixed(1) + 'km';
  }
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

function calculateProduceEarnings(base, rKg, minKg, isVine = false) {
  const sKg = rKg || minKg || 0.1;
  let m = 1 + (sKg / (minKg || 0.1)) * 0.25;
  if (isVine) {
    m *= 0.3;
  }
  return Math.round((base || 10) * m);
}

function rollCropWeight(s) {
  const minK = Number(s.minKg) || 0.1;
  const bMaxK = Number(s.baseMaxKg) || 2.5;
  const maxK = Number(s.maxKg) || 10000000;
  const r = Math.random();
  let jM = 1.0;
  
  if (r >= 0.995) {
    jM = 2000 + Math.pow((r - 0.995) / 0.005, 3) * 3998000;
  } else if (r >= 0.97) {
    jM = 40 + Math.pow((r - 0.97) / 0.025, 2) * 1960;
  } else if (r >= 0.88) {
    jM = 2 + Math.pow((r - 0.88) / 0.09, 1.8) * 38;
  } else {
    jM = 1.0 + Math.pow(r / 0.88, 2) * 1.0;
  }
  
  const bKg = minK + Math.pow(Math.random(), 1.8) * (bMaxK - minK);
  const rKg = Math.min(maxK, bKg * jM);
  const bM = (Number(s.minM) || 0.2) + Math.random() * ((Number(s.maxM) || 0.8) - (Number(s.minM) || 0.2));
  
  let finalMeters = bM;
  if (jM > 1) {
    finalMeters = bM * Math.min(15, Math.pow(jM, 0.25));
  }
  
  return {
    rolledKg: rKg,
    rolledMeters: finalMeters
  };
}

function rollFruitStats(c) {
  const r = rollCropWeight(c);
  let finalTime = c.baseGrowTime;
  finalTime = finalTime * (1 + (r.rolledKg / (c.baseMaxKg || 2.5)) * 0.05);
  finalTime = Math.round(finalTime);
  finalTime = Math.max(10, finalTime);
  
  return {
    fruitKg: r.rolledKg,
    fruitGrowTime: finalTime
  };
}

function checkCodexCompletion() {
  let d = 0;
  SEED_CATALOG.forEach(s => {
    if (gameState.codex[s.id] && gameState.codex[s.id].discovered) {
      d++;
    }
  });
  
  if (d >= SEED_CATALOG.length && !gameState.articularSkinActive) {
    gameState.articularSkinActive = true;
    updateFenceSkin();
    playSFX('harvest');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "🏆 INDEX COMPLETED! ARTICULAR SKIN UNLOCKED! ✨", "#00e5ff");
    showToast("🏆 Index Complete! Articular Skin Unlocked!");
  }
}

function getGroupedProduce() {
  const g = {};
  gameState.produceInventory.forEach(i => {
    if (!g[i.name]) {
      g[i.name] = { name: i.name, icon: i.icon, items: [] };
    }
    g[i.name].items.push(i);
  });
  return Object.values(g);
}

function updateFenceSkin() {
  if (fenceStructure) {
    fenceStructure.classList.toggle('fence-skin-articular', !!gameState.articularSkinActive);
  }
}

function updateArticularSkinButton() {
  if (!articularSkinToggleBtn) return;
  let d = 0;
  SEED_CATALOG.forEach(s => {
    if (gameState.codex[s.id] && gameState.codex[s.id].discovered) {
      d++;
    }
  });
  
  if (d >= SEED_CATALOG.length) {
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
    const act = SEED_CATALOG.find(s => s.id === gameState.selectedSeedId);
    if (act) {
      currentSeedNameEl.textContent = `Plant ${act.name} (x${gameState.seedInventory[gameState.selectedSeedId] || 0}) [Bag: ${gameState.produceInventory.length}]`;
    } else {
      currentSeedNameEl.textContent = `Open Seed Bag (${gameState.produceInventory.length} Crops)`;
    }
  }
  
  cycleIcon.textContent = gameState.isDay ? '☀️' : '🌙';
  cycleLabel.textContent = gameState.isDay ? 'Day Time' : 'Night Time';
  cycleTimer.textContent = formatTime(gameState.cycleTimeLeft);
  document.body.classList.toggle('day-theme', gameState.isDay);
  document.body.classList.toggle('night-theme', !gameState.isDay);
}

function renderShopItems() {
  shopItemsList.innerHTML = '';
  SEED_CATALOG.forEach(s => {
    const aff = gameState.cash >= s.cost;
    const stk = s.currentStock > 0;
    const own = gameState.seedInventory[s.id] || 0;
    
    const c = document.createElement('div');
    c.className = 'shop-item-card';
    
    let btnClass = 'btn-buy';
    let btnText = 'Buy';
    
    if (!stk) {
      btnClass = 'btn-buy stocked';
      btnText = 'Out of Stock';
    } else if (!aff) {
      btnClass = 'btn-buy unaffordable';
    }
    
    let badgeHtml = '';
    if (s.isVine) {
      badgeHtml = '<span class="permanent-red-p-badge">P</span>';
    }
    
    c.innerHTML = `<div class="item-info"><div class="item-title">${s.icon} ${s.name} ${badgeHtml}</div><div><span class="rarity-tag rarity-${s.rarity}">${s.rarity}</span></div><div class="item-price-stock">$${s.cost.toLocaleString()} | Stock: ${s.currentStock} (Owned: ${own})</div></div><button class="${btnClass}" ${(!aff || !stk) ? 'disabled' : ''}>${btnText}</button>`;
    
    const pb = c.querySelector('.permanent-red-p-badge');
    if (pb) {
      pb.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        openModal(permanentInfoModal);
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
    shopItemsList.appendChild(c);
  });
}

function renderSeedDrawer() {
  tabSeedsBtn.classList.toggle('active', gameState.activeDrawerTab === 'seeds');
  tabProduceBtn.classList.toggle('active', gameState.activeDrawerTab === 'produce');
  
  if (gameState.activeDrawerTab === 'seeds') {
    seedInventoryList.classList.remove('hidden');
    produceInventoryList.classList.add('hidden');
    seedInventoryList.innerHTML = '';
    
    SEED_CATALOG.forEach(s => {
      let isActive = false;
      if (gameState.selectedSeedId === s.id && gameState.selectedTool === 'plant') {
        isActive = true;
      }
      
      const c = document.createElement('div');
      c.className = `seed-select-card ${isActive ? 'active' : ''}`;
      c.innerHTML = `<div style="font-size: 22px;">${s.icon}</div><div style="display:flex; flex-direction:column;"><span style="font-size:12px; font-weight:800;">${s.name}</span><span style="font-size:10px; color:#5d4037;">Qty: ${gameState.seedInventory[s.id] || 0}</span></div>`;
      
      c.addEventListener('click', () => {
        gameState.selectedSeedId = s.id;
        gameState.selectedTool = 'plant';
        closeDrawer(seedBagDrawer);
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
      const c = document.createElement('div');
      c.className = 'produce-item-card';
      c.innerHTML = `<div style="display:flex; align-items:center; gap:10px; width:100%;"><div style="font-size:26px;">${i.icon}</div><div style="display:flex; flex-direction:column; flex:1;"><span style="font-size:13px; font-weight:900; color:#2c1a14;">${i.name}</span><span style="font-size:11px; color:#2e7d32; font-weight:800;">Weight: ${formatKg(i.kg)} | Value: $${i.value.toLocaleString()}</span></div></div>`;
      produceInventoryList.appendChild(c);
    });
  }
}

function renderIndexCodex() {
  indexItemsList.innerHTML = '';
  SEED_CATALOG.forEach(s => {
    const d = !!(gameState.codex[s.id] && gameState.codex[s.id].discovered);
    const c = document.createElement('div');
    c.className = `codex-card-item ${d ? '' : 'locked'}`;
    c.innerHTML = `<div style="font-size:28px;">${d ? s.icon : '❓'}</div><div style="font-size:12px; font-weight:800;">${d ? s.name : 'Unknown Plant'}</div><span class="rarity-tag rarity-${s.rarity}">${s.rarity}</span><div style="font-size:10px; color:#5d4037; margin-top:2px;">${d ? 'Discovered' : 'Locked'}</div>`;
    indexItemsList.appendChild(c);
  });
}

function renderSellMainOptions() {
  sellMainOptions.classList.remove('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.add('hidden');
  
  let t = 0;
  gameState.produceInventory.forEach(i => {
    t += i.value;
  });
  
  sellAllPayoutText.textContent = `Total Value: $${t.toLocaleString()} (${gameState.produceInventory.length} items)`;
}

function renderSellItemPicker() {
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.remove('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.add('hidden');
  sellItemPicker.innerHTML = '';
  
  getGroupedProduce().forEach(g => {
    let tv = 0;
    g.items.forEach(i => {
      tv += i.value;
    });
    
    const c = document.createElement('div');
    c.className = 'btn-sell-option';
    c.innerHTML = `<span style="font-size: 28px;">${g.icon}</span><div class="sell-opt-text" style="flex: 1;"><span class="opt-title">${g.name} (x${g.items.length})</span><span class="opt-subtitle">Total Value: $${tv.toLocaleString()}</span></div><button class="btn-market-select">${g.items.length > 1 ? 'Choose Qty 🧺' : `Sell 1 ($${tv.toLocaleString()})`}</button>`;
    
    c.addEventListener('click', () => {
      if (g.items.length === 1) {
        const i = g.items[0];
        gameState.cash += i.value;
        const targetIndex = gameState.produceInventory.findIndex(x => x.id === i.id);
        gameState.produceInventory.splice(targetIndex, 1);
        playSFX('sell');
        createFloatingText(window.innerWidth / 2, window.innerHeight / 2, `+$${i.value.toLocaleString()}! 💰`, "#ffd54f");
        updateHUD();
        saveGame();
        
        if (gameState.produceInventory.length === 0) {
          closeModal(sellModal);
        } else {
          renderSellItemPicker();
        }
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
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.remove('hidden');
  bargainNpcBox.classList.add('hidden');
  
  const g = sellQuantityState.selectedCropGroup;
  if (!g || g.items.length === 0) {
    renderSellItemPicker();
    return;
  }
  
  qtyCropHeader.textContent = `${g.icon} ${g.name} (Owned: x${g.items.length})`;
  qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
  
  let p = 0;
  for (let i = 0; i < sellQuantityState.quantityToSell; i++) {
    if (g.items[i]) {
      p += g.items[i].value;
    }
  }
  qtyPayoutPreview.textContent = `Payout: $${p.toLocaleString()}`;
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
        vineFruits: []
      });
    }
    gameState.fields.push(p);
  }
}

function buildPlotDOMStructure() {
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
    
    const db = document.createElement('div');
    db.className = 'dirt-bed';
    
    p.appendChild(tb);
    p.appendChild(gb);
    p.appendChild(cc);
    p.appendChild(db);
    
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
  
  const cP = gameState.fields[gameState.currentField];
  cP.forEach((plot, i) => {
    const n = plotDomNodes[i];
    if (!n) return;
    
    n.plotEl.classList.toggle('ready', plot.isReady || (plot.crop && plot.crop.isVine && plot.vineEstablished));
    n.plotEl.classList.toggle('vine-plot', !!(plot.crop && plot.crop.isVine));
    n.plotEl.classList.toggle('cloud-piercer', (plot.rolledMeters || 0) > 20);
    n.plotEl.classList.toggle('nocturnal-active', !!(plot.crop && plot.crop.affinity === 'night' && !gameState.isDay));
    n.plotEl.classList.toggle('cosmic-rose-active', !!(plot.crop && plot.crop.id === 'cosmic_rose'));
    
    if (plot.crop) {
      n.cropContainer.style.display = 'flex';
      const tM = plot.rolledMeters || 1;
      const tKg = plot.rolledKg || plot.crop.minKg || 0.1;
      const cKg = (plot.progress / 100) * tKg;
      const cM = (plot.progress / 100) * tM;
      const maxS = Math.min(3.5, 0.8 + Math.log10(tKg + 1) * 0.45);
      const sF = 0.3 + (plot.progress / 100) * (maxS - 0.3);
      
      n.cropIcon.style.setProperty('--crop-scale', sF);
      n.cropIcon.textContent = plot.progress < 35 ? '🌱' : plot.crop.icon;
      n.cropIcon.classList.toggle('mature', plot.isReady || plot.vineEstablished);
      n.cropTimerBadge.style.display = 'flex';
      
      let spB = '';
      if (plot.crop.affinity === 'night' && !gameState.isDay) {
        spB = '⚡2X ';
      }
      if (plot.crop.affinity === 'day' && gameState.isDay) {
        spB = '☀️2X ';
      }
      
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
        n.cropTimerBadge.textContent = `READY! ${formatKg(tKg)} ✨`;
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
  if (gameState.currentField >= gameState.unlockedFields) {
    return;
  }
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
    const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, false);
    addXP(Math.ceil(p.crop.baseGrowTime * 1.5));
    gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: p.crop.name.replace(' Seed', ''), icon: p.crop.icon, kg: sKg, meters: p.rolledMeters || p.crop.minM || 1, value: earn });
    if (!gameState.codex[p.crop.id]) {
      gameState.codex[p.crop.id] = { discovered: true, totalHarvested: 0 };
      checkCodexCompletion();
    }
    gameState.codex[p.crop.id].totalHarvested++;
    p.crop = null;
    p.progress = 0;
    p.isReady = false;
    playSFX('harvest');
    createFloatingText(x, y, `+1 ${p.crop.icon}`, "#81c784");
    updateHUD();
    renderPlots();
    saveGame();
    return;
  }
  
  if (!p.crop) {
    const s = SEED_CATALOG.find(i => i.id === gameState.selectedSeedId);
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
    p.rolledKg = r.rolledKg;
    p.rolledMeters = r.rolledMeters;
    p.actualGrowTime = Math.max(5, Math.round((s.baseGrowTime || 5) * (1 + (r.rolledKg / (s.baseMaxKg || 2.5)) * 0.05)));
    if (!gameState.codex[s.id]) {
      gameState.codex[s.id] = { discovered: true, totalHarvested: 0 };
      checkCodexCompletion();
    }
    playSFX('plant');
    createFloatingText(x, y, `Planted ${s.icon}`, "#81c784");
    updateHUD();
    renderPlots();
    saveGame();
  }
}

function openSkipModal(pI, isF = false, fI = 0) {
  const p = gameState.fields[gameState.currentField][pI];
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
  skipTimeLeft.textContent = formatTime(rM);
  btnConfirmSkip.textContent = `Skip for $${c.toLocaleString()}`;
  btnConfirmSkip.disabled = gameState.cash < c;
  openModal(skipTimerModal);
}

btnConfirmSkip.addEventListener('click', () => {
  if (!currentSkipTarget) return;
  if (Date.now() - lastSkipTime < 3000) {
    showToast("⏳ Cooldown! Wait 3s.");
    return;
  }
  if (gameState.cash >= currentSkipTarget.cost) {
    gameState.cash -= currentSkipTarget.cost;
    lastSkipTime = Date.now();
    const p = gameState.fields[gameState.currentField][currentSkipTarget.plotIndex];
    if (currentSkipTarget.isFruit) {
      p.vineFruits[currentSkipTarget.fruitIndex].progress = 100;
      p.vineFruits[currentSkipTarget.fruitIndex].isReady = true;
    } else {
      p.progress = 100;
      if (p.crop.isVine) {
        p.vineEstablished = true;
        p.vineFruits = [];
        for (let f = 0; f < Math.min(3, p.crop.maxFruits || 3); f++) {
          const r = rollFruitStats(p.crop);
          p.vineFruits.push({ fruitId: `${p.crop.id}_${f}`, name: p.crop.produceName, icon: p.crop.produceIcon, progress: 0, isReady: false, rolledKg: r.fruitKg, growTime: r.fruitGrowTime });
        }
      } else {
        p.isReady = true;
      }
    }
    playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "Time Skipped! ⏳✨", "#29b6f6");
    updateHUD();
    renderPlots();
    if (currentSkipTarget.isFruit) {
      renderVineModalContent();
    }
    saveGame();
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
  const p = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex];
  if (!p || !p.crop || !p.crop.isVine) return;
  vineModalTitle.textContent = `${p.crop.icon} ${p.crop.name}`;
  vineProduceList.innerHTML = '';
  let tC = 0;
  let fS = 0;
  (p.vineFruits || []).forEach((f, i) => {
    const sKg = f.rolledKg || p.crop.minKg || 0.1;
    const earn = calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, true);
    const rS = Math.max(1, Math.ceil((100 - f.progress) / ((100 / (f.growTime || 10)) * getGrowthMultiplier(p.crop))));
    if (!f.isReady) {
      tC += Math.ceil(rS * ((p.crop.baseSellPrice * 0.1) + 11574));
      fS++;
    }
    const cd = document.createElement('div');
    cd.className = 'vine-produce-card';
    cd.innerHTML = `<div class="card-left-group"><div class="item-icon-badge">${f.icon}</div><div class="item-details"><span class="item-title">${f.name} #${i + 1}</span><span class="item-sub-stat">${f.isReady ? `${formatKg(sKg)} • <strong style="color:#2e7d32;">$${earn.toLocaleString()}</strong>` : `🌱 ${formatKg((f.progress / 100) * sKg)}`}</span></div></div>${f.isReady ? `<button class="btn-vine-harvest">Harvest</button>` : `<button class="btn-vine-harvest" style="background:#29b6f6; box-shadow:0 4px 0 #0288d1;">Skip (⏳ ${formatTime(rS)})</button>`}`;
    if (f.isReady) {
      cd.querySelector('.btn-vine-harvest').addEventListener('click', () => {
        addXP(Math.ceil((p.crop.baseGrowTime * 1.5) / (p.crop.maxFruits || 3)));
        gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: p.crop.minM, value: earn });
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
      cd.querySelector('.btn-vine-harvest').addEventListener('click', () => openSkipModal(gameState.selectedVinePlotIndex, true, i));
    }
    vineProduceList.appendChild(cd);
  });
  if (fS > 0) {
    skipAllVineBtn.textContent = `⏳ Skip All ($${tC.toLocaleString()})`;
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

harvestAllVineBtn.addEventListener('click', () => {
  if (gameState.selectedVinePlotIndex === null) return;
  const p = gameState.fields[gameState.currentField][gameState.selectedVinePlotIndex];
  if (!p || !p.crop || !p.crop.isVine) return;
  let c = 0;
  (p.vineFruits || []).forEach(f => {
    if (f.isReady) {
      const sKg = f.rolledKg || p.crop.minKg || 0.1;
      gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: p.crop.minM, value: calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, true) });
      addXP(Math.ceil((p.crop.baseGrowTime * 1.5) / (p.crop.maxFruits || 3)));
      f.progress = 0;
      f.isReady = false;
      const rs = rollFruitStats(p.crop);
      f.rolledKg = rs.fruitKg;
      f.growTime = rs.fruitGrowTime;
      c++;
    }
  });
  if (c > 0) {
    playSFX('harvest');
    showToast(`🎒 Harvested ${c} Vine Fruits!`);
    updateHUD();
    renderVineModalContent();
    saveGame();
  }
});

closeVineBtn.addEventListener('click', () => closeModal(vineModal));

el('status-banner').addEventListener('click', () => {
  weatherModalTitle.textContent = gameState.isDay ? '☀️ Daytime Weather Info' : '🌙 Nightfall Weather Info';
  weatherModalBody.innerHTML = gameState.isDay ? `<p style="text-align:center; font-size:18px; font-weight:900; color:#e6a100; margin-bottom:12px;">Phase: ☀️ Daytime (${formatTime(gameState.cycleTimeLeft)} left)</p><p><strong>☀️ All-Weather Plants Growing Steady:</strong><br>🥕 Carrot, 🥔 Potato, 🍅 Tomato, 🍇 Grape Vine, ⭐ Star Fruit, 🍉 Watermelon Vine, 🌸 Nectar Root, 🌌 Singularity Sprout, 🌙 Celestial Moon</p><p style="margin-top:10px;"><strong>☀️ Solar Boost (2X Growth Speed):</strong><br>🌻 Sunflower</p>` : `<p style="text-align:center; font-size:18px; font-weight:900; color:#b388ff; margin-bottom:12px;">Phase: 🌙 Nighttime (${formatTime(gameState.cycleTimeLeft)} left)</p><p><strong>⚡ Nocturnal Boost (2X Growth Speed):</strong><br>🍄 Glowshroom, 🍓 Strawberry, 🌹 Cosmic Rose</p>`;
  openModal(weatherModal);
});

closeWeatherBtn.addEventListener('click', () => closeModal(weatherModal));

btnUnlockField.addEventListener('click', () => {
  const req = FIELD_LEVEL_REQS[gameState.currentField];
  if (gameState.level >= req) {
    gameState.unlockedFields++;
    playSFX('sell');
    showToast(`🎉 Field ${gameState.currentField} Unlocked!`);
    updateHUD();
    renderPlots();
  } else {
    showToast(`❌ Need Level ${req}!`);
  }
});

shovelBtn.addEventListener('click', () => {
  gameState.selectedTool = gameState.selectedTool === 'shovel' ? 'plant' : 'shovel';
  updateHUD();
});

sellBtn.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) {
    showToast("❌ Seed bag empty!");
    return;
  }
  openModal(sellModal);
  renderSellMainOptions();
});

closeSellBtn.addEventListener('click', () => closeModal(sellModal));

shopBtn.addEventListener('click', () => {
  renderShopItems();
  openModal(shopModal);
});

closeShopBtn.addEventListener('click', () => closeModal(shopModal));

decorBtn.addEventListener('click', () => {
  updateArticularSkinButton();
  openModal(decorModal);
});

closeDecorBtn.addEventListener('click', () => closeModal(decorModal));

settingsBtn.addEventListener('click', () => {
  statsSummaryEl.innerHTML = `<p style="font-size:13px; color:#4e342e; margin-bottom:10px;"><strong>🌟 Farm Level:</strong> ${gameState.level}<br><strong>Unlocked Fields:</strong> ${gameState.unlockedFields} / ${gameState.maxFields}<br><strong>Crops Stored:</strong> ${gameState.produceInventory.length}<br><strong>Carrot Seeds:</strong> ${gameState.seedInventory.carrot || 0}</p>`;
  openModal(settingsModal);
});

closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));

prevFieldBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (gameState.currentField > 0) {
    plotsGrid.classList.add('slide-out-right');
    setTimeout(() => {
      gameState.currentField--;
      updateHUD();
      renderPlots();
      plotsGrid.classList.remove('slide-out-right');
    }, 150);
  }
});

nextFieldBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (gameState.currentField < gameState.maxFields - 1) {
    plotsGrid.classList.add('slide-out-left');
    setTimeout(() => {
      gameState.currentField++;
      updateHUD();
      renderPlots();
      plotsGrid.classList.remove('slide-out-left');
    }, 150);
  }
});

seedBagBtn.addEventListener('click', () => toggleDrawer(seedBagDrawer));
closeDrawerBtn.addEventListener('click', () => closeDrawer(seedBagDrawer));
tabSeedsBtn.addEventListener('click', () => { gameState.activeDrawerTab = 'seeds'; renderSeedDrawer(); });
tabProduceBtn.addEventListener('click', () => { gameState.activeDrawerTab = 'produce'; renderSeedDrawer(); });

openIndexBtn.addEventListener('click', () => {
  renderIndexCodex();
  openModal(indexModal);
});

closeIndexBtn.addEventListener('click', () => closeModal(indexModal));
closePermInfoBtn.addEventListener('click', () => closeModal(permanentInfoModal));

btnSellAllModal.addEventListener('click', () => {
  let t = 0;
  gameState.produceInventory.forEach(i => t += i.value);
  gameState.produceInventory = [];
  gameState.cash += t;
  playSFX('sell');
  showToast(`💰 Sold All for $${t.toLocaleString()}!`);
  updateHUD();
  saveGame();
  closeModal(sellModal);
});

btnSellSelectModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) {
    showToast("❌ Seed bag empty!");
    return;
  }
  renderSellItemPicker();
});

btnSellBargainModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) {
    showToast("❌ Seed bag empty!");
    return;
  }
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.remove('hidden');
  
  let titanMultiplier = isTitanBargainerActive ? 5 : 1;
  let bv = 0;
  let hR = 0;
  gameState.produceInventory.forEach(i => {
    bv += i.value;
    if (i.seedId === 'singularity' || i.seedId === 'celestial_moon' || i.seedId === 'strawberry' || i.seedId === 'cosmic_rose') hR++;
  });
  
  currentBargainBase = bv * titanMultiplier;
  currentBargainFee = Math.round((bv * 0.20) + (hR * 1250000));
  isDailyDealActive = false;
  
  npcDialogueText.textContent = isTitanBargainerActive 
      ? `TITAN MODE ACTIVE! My wealth is limitless! Appraisal fee: $${currentBargainFee.toLocaleString()}.` 
      : `Greetings! I can appraise your Seed Bag. My fee is $${currentBargainFee.toLocaleString()}.`;
      
  npcBargainFee.textContent = `Fee: $${currentBargainFee.toLocaleString()}`;
  npcStandardValue.textContent = `$${currentBargainBase.toLocaleString()}`;
  npcProjectedCash.textContent = `$0`;
  npcOfferTier.classList.add('hidden');
  
  btnStartBargain.classList.remove('hidden');
  btnDailyDeal.classList.add('hidden');
  btnAcceptBargain.classList.add('hidden');
  btnDeclineBargain.classList.add('hidden');
});

btnStartBargain.addEventListener('click', () => {
  if (gameState.cash < currentBargainFee) {
    showToast("❌ Not enough cash for Appraisal Fee!");
    return;
  }
  gameState.cash -= currentBargainFee;
  playSFX('sell');
  updateHUD();
  
  if (isTitanBargainerActive) {
    currentBargainMultiplier = 5.0 + Math.random() * 15.0; 
    npcOfferTier.className = "rainbow-offer-text";
    npcOfferTier.textContent = "👑 TITAN DEAL!";
    npcDialogueText.textContent = "A KING'S RANSOM! You shall be swimming in cash!";
  } else {
    const r = Math.random();
    if (r < 0.35) {
      currentBargainMultiplier = 0.3 + Math.random() * 0.5;
      npcOfferTier.className = "npc-offer-tier";
      npcOfferTier.style.color = "#ef5350";
      npcOfferTier.textContent = "BAD DEAL! (30-80%)";
      npcDialogueText.textContent = "Oof! This batch isn't looking so great... Take it or leave it!";
    } else if (r < 0.80) {
      currentBargainMultiplier = 1.0 + Math.random() * 0.3;
      npcOfferTier.className = "npc-offer-tier";
      npcOfferTier.style.color = "#2e7d32";
      npcOfferTier.textContent = "Standard Fair Deal";
      npcDialogueText.textContent = "A respectable harvest! Here is my fair market proposal.";
    } else if (r < 0.95) {
      currentBargainMultiplier = 2.0 + Math.random() * 2.0;
      npcOfferTier.className = "npc-offer-tier";
      npcOfferTier.style.color = "#ff9800";
      npcOfferTier.textContent = "Great Deal! 🔥";
      npcDialogueText.textContent = "Splendid produce! I can pay a premium for these crops!";
    } else {
      currentBargainMultiplier = 5.0 + Math.random() * 5.0;
      npcOfferTier.className = "rainbow-offer-text";
      npcOfferTier.textContent = "🌈 LEGENDARY DEAL!";
      npcDialogueText.textContent = "ASTOUNDING CROPS! This is a once-in-a-lifetime harvest proposal!";
    }
  }
  
  currentBargainPayout = Math.round(currentBargainBase * currentBargainMultiplier);
  npcBargainFee.textContent = "Appraisal Fee Paid";
  npcProjectedCash.textContent = `$${currentBargainPayout.toLocaleString()}`;
  npcOfferTier.classList.remove('hidden');
  btnStartBargain.classList.add('hidden');
  btnAcceptBargain.classList.remove('hidden');
  btnDeclineBargain.classList.remove('hidden');
  btnDailyDeal.classList.remove('hidden');
  btnDailyDeal.disabled = gameState.dailyDealUsed;
  btnDailyDeal.textContent = gameState.dailyDealUsed ? "Daily Deal Used" : "🔥 APPLY 20X DAILY DEAL! 🔥";
});

btnDailyDeal.addEventListener('click', () => {
  if (!gameState.dailyDealUsed && currentBargainBase > 0) {
    isDailyDealActive = true;
    let dp = Math.round(currentBargainBase * currentBargainMultiplier * 20);
    npcProjectedCash.textContent = `$${dp.toLocaleString()}`;
    npcDialogueText.textContent = `🔥 20X DEAL APPLIED! Payout boosted to $${dp.toLocaleString()}!`;
    btnDailyDeal.disabled = true;
    btnDailyDeal.textContent = "🔥 20X Deal Applied!";
    playSFX('harvest');
  }
});

btnAcceptBargain.addEventListener('click', () => {
  let fp = isDailyDealActive ? Math.round(currentBargainBase * currentBargainMultiplier * 20) : currentBargainPayout;
  if (fp > 0 && gameState.produceInventory.length > 0) {
    if (isDailyDealActive) gameState.dailyDealUsed = true;
    gameState.cash += fp;
    gameState.produceInventory = [];
    playSFX('sell');
    showToast(`Accepted Bargain: +$${fp.toLocaleString()}! 🧙‍♂️`);
    currentBargainPayout = 0;
    isDailyDealActive = false;
    updateHUD();
    saveGame();
    closeModal(sellModal);
  }
});

btnDeclineBargain.addEventListener('click', () => {
  isDailyDealActive = false;
  currentBargainPayout = 0;
  renderSellMainOptions();
});

btnBargainBack.addEventListener('click', () => {
  isDailyDealActive = false;
  currentBargainPayout = 0;
  renderSellMainOptions();
});

qtyMinusBtn.addEventListener('click', () => {
  if (sellQuantityState.quantityToSell > 1) {
    sellQuantityState.quantityToSell--;
    qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
    let p = 0;
    for (let i = 0; i < sellQuantityState.quantityToSell; i++) {
      p += sellQuantityState.selectedCropGroup.items[i].value;
    }
    qtyPayoutPreview.textContent = `Payout: $${p.toLocaleString()}`;
  }
});

qtyPlusBtn.addEventListener('click', () => {
  const g = sellQuantityState.selectedCropGroup;
  if (g && sellQuantityState.quantityToSell < g.items.length) {
    sellQuantityState.quantityToSell++;
    qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
    let p = 0;
    for (let i = 0; i < sellQuantityState.quantityToSell; i++) {
      p += g.items[i].value;
    }
    qtyPayoutPreview.textContent = `Payout: $${p.toLocaleString()}`;
  }
});

qtyConfirmSellBtn.addEventListener('click', () => {
  const g = sellQuantityState.selectedCropGroup;
  if (!g) return;
  let t = 0;
  const c = sellQuantityState.quantityToSell;
  for (let i = 0; i < c; i++) {
    const item = g.items[i];
    if (item) {
      t += item.value;
      gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === item.id), 1);
    }
  }
  gameState.cash += t;
  playSFX('sell');
  showToast(`💰 Sold ${c}x for $${t.toLocaleString()}!`);
  updateHUD();
  saveGame();
  if (gameState.produceInventory.length === 0) {
    closeModal(sellModal);
  } else {
    renderSellItemPicker();
  }
});

qtyBackBtn.addEventListener('click', () => renderSellItemPicker());

btnOpenAdminAuth.addEventListener('click', () => {
  openModal(adminLoginModal);
  closeModal(settingsModal);
});

btnSubmitAdmin.addEventListener('click', () => {
  if (adminPass1.value === "0313" && adminPass2.value === "789") {
    populateAdminDropdowns();
    openModal(adminModal);
    closeModal(adminLoginModal);
    showToast("🛡️ Admin Access Granted");
    adminPass1.value = "";
    adminPass2.value = "";
  } else {
    showToast("❌ Access Denied");
  }
});

btnCloseAdminLogin.addEventListener('click', () => closeModal(adminLoginModal));

btnOpenResetConfirm.addEventListener('click', () => {
  openModal(resetConfirmModal);
  closeModal(settingsModal);
});

btnConfirmReset.addEventListener('click', () => {
  localStorage.removeItem('gardenVenture2Save');
  
  gameState = {
    cash: 25,
    level: 1,
    xp: 0,
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
    seedInventory: { carrot: 5, potato: 0, grape_vine: 0, tomato: 0, glowshroom: 0, starfruit: 0, watermelon_vine: 0, sunflower: 0, nectarroot: 0, strawberry: 0, cosmic_rose: 0, singularity: 0, celestial_moon: 0 },
    produceInventory: [],
    codex: { carrot: { discovered: true, totalHarvested: 0 } },
    fields: [],
    lastShopCycle: null
  };
  
  initFields();
  updateFenceSkin();
  updateHUD();
  renderPlots();
  
  closeModal(resetConfirmModal);
  showToast("♻️ Save Data completely wiped!");
  
  setTimeout(() => { location.reload(); }, 800);
});

btnCancelReset.addEventListener('click', () => closeModal(resetConfirmModal));
closeAdminBtn.addEventListener('click', () => closeModal(adminModal));

adminBtnCash.addEventListener('click', () => {
  const q = parseInt(adminCashQty.value) || 0;
  if (q <= 0) return;
  if (adminTargetScope.value === 'global') {
    db.ref('adminCommands').push({ type: 'cash', amount: q, ts: getServerTime() });
    showToast(`Sent Global Command: +$${q.toLocaleString()}`);
  } else {
    gameState.cash += q;
    playSFX('sell');
    updateHUD();
    showToast(`🛡️ Added $${q.toLocaleString()} Cash!`);
  }
});

adminBtnGrant.addEventListener('click', () => {
  const id = adminSeedSelect.value;
  const q = parseInt(adminSeedQty.value) || 1;
  if (adminTargetScope.value === 'global') {
    db.ref('adminCommands').push({ type: 'seed', seedId: id, amount: q, ts: getServerTime() });
    showToast(`Sent Global Command: +${q} ${id}`);
  } else {
    gameState.seedInventory[id] = (gameState.seedInventory[id] || 0) + q;
    updateHUD();
    showToast(`🛡️ Granted ${q}x ${id}!`);
  }
});

adminBtnInject.addEventListener('click', () => {
  const id = adminInjectSelect.value;
  const q = parseInt(adminInjectQty.value) || 1;
  const s = SEED_CATALOG.find(x => x.id === id);
  if (s) {
    s.currentStock += q;
    populateAdminDropdowns();
    if (!shopModal.classList.contains('hidden')) {
      renderShopItems();
    }
    showToast(`🛡️ Injected ${q} ${s.name}`);
  }
});

adminBtnRestock.addEventListener('click', () => {
  const cycleId = Math.floor(getServerTime() / 180000);
  const stockMap = getGlobalShopStockForCycle(cycleId);
  SEED_CATALOG.forEach(s => {
    if (stockMap[s.id] !== undefined) {
      s.currentStock = stockMap[s.id];
    }
  });
  showToast(`🛡️ Shop Forced Restock!`);
  if (!shopModal.classList.contains('hidden')) {
    renderShopItems();
  }
  populateAdminDropdowns();
});

adminBtnSkipGrow.addEventListener('click', () => {
  let skipped = 0;
  gameState.fields[gameState.currentField].forEach((p, pI) => {
    if (p.crop) {
      if (p.crop.isVine) {
        if (!p.vineEstablished) {
          p.progress = 100;
          p.vineEstablished = true;
          p.vineFruits = [];
          for (let f = 0; f < Math.min(3, p.crop.maxFruits || 3); f++) {
            const r = rollFruitStats(p.crop);
            p.vineFruits.push({ fruitId: `${p.crop.id}_${f}`, name: p.crop.produceName, icon: p.crop.produceIcon, progress: 100, isReady: true, rolledKg: r.fruitKg, growTime: r.fruitGrowTime });
          }
          skipped++;
        } else {
          p.vineFruits.forEach(fr => {
            if(!fr.isReady) {
              fr.progress = 100;
              fr.isReady = true;
              skipped++;
            }
          });
        }
      } else if (!p.isReady) {
        p.progress = 100;
        p.isReady = true;
        skipped++;
      }
    }
  });
  if(skipped > 0) {
    playSFX('sell');
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2, "⏩ FAST FORWARDED!", "#00bcd4");
    updateHUD();
    renderPlots();
    showToast("🚀 Skipped growth for entire field!");
  } else {
     showToast("❌ No crops to skip!");
  }
});

adminBtnTitanBargainer.addEventListener('click', () => {
  isTitanBargainerActive = !isTitanBargainerActive;
  if(isTitanBargainerActive){
    showToast("📈 Titan Bargainer ACTIVATED (x5 Value)");
    adminBtnTitanBargainer.style.filter = "brightness(1.5)";
  } else {
    showToast("📉 Titan Bargainer DEACTIVATED");
    adminBtnTitanBargainer.style.filter = "brightness(1)";
  }
});

adminBtnSkin.addEventListener('click', () => {
  const skin = adminSkinSelect.value;
  gameState.articularSkinActive = (skin === 'articular');
  updateFenceSkin();
  showToast(`🛡️ Skin Updated!`);
});

adminBtnBroadcast.addEventListener('click', () => {
  const m = adminBroadcastMsg.value;
  if (m.trim() !== '') {
    db.ref('adminCommands').push({ type: 'broadcast', message: m, ts: getServerTime() });
    showToast(`Sent Global Broadcast`);
    adminBroadcastMsg.value = '';
  }
});

friendsBtn.addEventListener('click', () => openModal(friendsModal));
closeFriendsBtn.addEventListener('click', () => closeModal(friendsModal));

tabPublicTrade.addEventListener('click', () => {
  tabPublicTrade.classList.add('active');
  tabPrivateTrade.classList.remove('active');
  tabGlobalChat.classList.remove('active');
  publicTradeView.classList.remove('hidden');
  privateTradeView.classList.add('hidden');
  globalChatView.classList.add('hidden');
});

tabPrivateTrade.addEventListener('click', () => {
  tabPrivateTrade.classList.add('active');
  tabPublicTrade.classList.remove('active');
  tabGlobalChat.classList.remove('active');
  privateTradeView.classList.remove('hidden');
  publicTradeView.classList.add('hidden');
  globalChatView.classList.add('hidden');
});

tabGlobalChat.addEventListener('click', () => {
  tabGlobalChat.classList.add('active');
  tabPublicTrade.classList.remove('active');
  tabPrivateTrade.classList.remove('active');
  globalChatView.classList.remove('hidden');
  publicTradeView.classList.add('hidden');
  privateTradeView.classList.add('hidden');
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
});

btnSendPrivateTrade.addEventListener('click', () => {
  const t = privateTradeIdInput.value.trim();
  if (t && t !== myPlayerId) {
    sendTradeRequest(t);
  }
});

btnDeclineTrade.addEventListener('click', () => {
  db.ref('players/' + myPlayerId + '/tradeRequest').remove();
  closeModal(tradeRequestModal);
});

btnAcceptTrade.addEventListener('click', () => {
  const p = pendingTradeReq;
  const tId = myPlayerId + "_" + p + "_" + Date.now();
  db.ref('trades/' + tId).set({ p1: myPlayerId, p2: p, p1Ready: false, p2Ready: false, status: 'negotiating' });
  db.ref('players/' + myPlayerId + '/tradeRequest').remove();
  db.ref('players/' + myPlayerId).update({ activeTrade: tId, inTrade: true });
  db.ref('players/' + p).update({ activeTrade: tId, inTrade: true });
});

btnTradeCancel.addEventListener('click', () => {
  if (currentTradeId) {
    db.ref('trades/' + currentTradeId).update({ status: 'cancelled' });
  }
});

btnTradeReady.addEventListener('click', () => {
  if (currentTradeId) {
    amIReady = !amIReady;
    btnTradeReady.style.filter = amIReady ? "brightness(0.6)" : "brightness(1)";
    db.ref('trades/' + currentTradeId).once('value', snap => {
      const t = snap.val();
      if (t) {
        const mk = t.p1 === myPlayerId ? 'p1Ready' : 'p2Ready';
        const tk = t.p1 === myPlayerId ? 'p2Ready' : 'p1Ready';
        db.ref('trades/' + currentTradeId).update({ [mk]: amIReady });
        if (amIReady && t[tk] === true) {
          db.ref('trades/' + currentTradeId).update({ status: 'completed' });
        }
      }
    });
  }
});

btnOpenBackpack.addEventListener('click', () => {
  if (amIReady) return;
  openModal(tradeBackpackModal);
  renderTradeBackpack('seeds');
});

btnCloseTradeBackpack.addEventListener('click', () => closeModal(tradeBackpackModal));
tradeTabSeeds.addEventListener('click', () => renderTradeBackpack('seeds'));
tradeTabProduce.addEventListener('click', () => renderTradeBackpack('produce'));

btnSendChat.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (msg !== '' && isOnline) {
    db.ref('chat').push({ sender: myPlayerId, text: msg, timestamp: getServerTime() });
    chatInput.value = '';
  }
});

function initFirebasePresence() {
  db.ref('.info/serverTimeOffset').on('value', snap => {
    serverTimeOffset = snap.val() || 0;
    timeSynced = true;
    updateGlobalCycle();
    updateShopForCurrentCycle();
  });

  const processedCmds = new Set();
  const clientStartTime = getServerTime();

  db.ref('adminCommands').limitToLast(20).on('child_added', snap => {
    const cmdId = snap.key;
    const cmd = snap.val();
    if (!cmd || processedCmds.has(cmdId)) return;
    processedCmds.add(cmdId);

    if (cmd.ts && cmd.ts >= clientStartTime - 5000) {
      if (cmd.type === 'cash') {
        gameState.cash += cmd.amount;
        updateHUD();
        playSFX('sell');
        showToast(`👑 Admin granted everyone $${cmd.amount.toLocaleString()}!`);
      } else if (cmd.type === 'seed') {
        gameState.seedInventory[cmd.seedId] = (gameState.seedInventory[cmd.seedId] || 0) + cmd.amount;
        updateHUD();
        showToast(`👑 Admin granted everyone ${cmd.amount}x ${cmd.seedId}!`);
      } else if (cmd.type === 'broadcast') {
        playSFX('harvest');
        showToast(`📢 ALERT: ${cmd.message}`);
      }
    }
  });

  db.ref('.info/connected').on('value', snap => {
    if (snap.val() === true) {
      isOnline = true;
      showToast("🌐 Connected to Trade Network!");
      networkStatusText.innerHTML = "Network Status: ONLINE 🟢";
      networkStatusText.style.color = "#2e7d32";
      const myRef = db.ref('players/' + myPlayerId);
      myRef.onDisconnect().remove();
      myRef.set({ level: gameState.level, online: true, inTrade: false });
    } else {
      if (isOnline) {
        showToast("🔴 Disconnected from Network");
      }
      isOnline = false;
      networkStatusText.innerHTML = "Network Status: Offline 🔴";
      networkStatusText.style.color = "#d32f2f";
    }
  });

  db.ref('players').on('value', snap => {
    const players = snap.val() || {};
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
      
      if (!pData.inTrade) {
        pRow.querySelector('button').addEventListener('click', () => sendTradeRequest(id));
      }
      activePlayersList.appendChild(pRow);
    }
    
    if (count === 0) {
      activePlayersList.innerHTML = `<p style="text-align:center; color:#795548; font-weight:800; font-size:14px;">No other players online.</p>`;
    }
  });

  db.ref('players/' + myPlayerId + '/tradeRequest').on('value', snap => {
    const req = snap.val();
    if (req && req.from) {
      tradeRequestId.textContent = req.from;
      openModal(tradeRequestModal);
      pendingTradeReq = req.from;
    } else {
      closeModal(tradeRequestModal);
      pendingTradeReq = null;
    }
  });

  db.ref('players/' + myPlayerId + '/activeTrade').on('value', snap => {
    const tId = snap.val();
    if (tId) {
      currentTradeId = tId;
      amIReady = false;
      myOfferedItems = [];
      btnTradeReady.style.filter = "brightness(1)";
      closeModal(friendsModal);
      closeModal(tradeRequestModal);
      closeModal(tradeBackpackModal);
      renderTradeSlots(null, null);
      openModal(tradeSessionModal);
      
      db.ref('trades/' + tId).on('value', tSnap => {
        const tData = tSnap.val();
        if (!tData) return;
        
        tradePartnerTitle.textContent = `Partner: ${tData.p1 === myPlayerId ? tData.p2 : tData.p1}`;
        const tk = tData.p1 === myPlayerId ? 'p2Ready' : 'p1Ready';
        theirTradeStatus.textContent = tData[tk] ? 'Partner is READY ✅' : 'Waiting for partner...';
        theirTradeStatus.style.color = tData[tk] ? '#2e7d32' : '#c62828';
        renderTradeSlots(tData.p1 === myPlayerId ? tData.p1Items : tData.p2Items, tData.p1 === myPlayerId ? tData.p2Items : tData.p1Items);
        
        if (tData.status === 'completed') {
          db.ref('trades/' + tId).off();
          if (tData.p1 === myPlayerId) {
            (tData.p1Items || []).forEach(i => {
              if (i.type === 'seed') {
                gameState.seedInventory[i.seedId]--;
              } else {
                gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === i.id), 1);
              }
            });
            (tData.p2Items || []).forEach(i => {
              if (i.type === 'seed') {
                gameState.seedInventory[i.seedId]++;
              } else {
                gameState.produceInventory.push(i);
              }
            });
            db.ref('trades/' + tId).remove();
          } else {
            (tData.p2Items || []).forEach(i => {
              if (i.type === 'seed') {
                gameState.seedInventory[i.seedId]--;
              } else {
                gameState.produceInventory.splice(gameState.produceInventory.findIndex(x => x.id === i.id), 1);
              }
            });
            (tData.p1Items || []).forEach(i => {
              if (i.type === 'seed') {
                gameState.seedInventory[i.seedId]++;
              } else {
                gameState.produceInventory.push(i);
              }
            });
          }
          showToast("✅ Trade Successful!");
          updateHUD();
          saveGame();
          closeModal(tradeSessionModal);
          db.ref('players/' + myPlayerId).update({ activeTrade: null, inTrade: false });
          currentTradeId = null;
        } else if (tData.status === 'cancelled') {
          db.ref('trades/' + tId).off();
          showToast("❌ Trade Declined");
          closeModal(tradeSessionModal);
          db.ref('players/' + myPlayerId).update({ activeTrade: null, inTrade: false });
          currentTradeId = null;
        }
      });
    } else {
      if (currentTradeId) {
        db.ref('trades/' + currentTradeId).off();
        closeModal(tradeSessionModal);
        currentTradeId = null;
        db.ref('players/' + myPlayerId).update({ inTrade: false });
      }
    }
  });

  db.ref('chat').limitToLast(15).on('child_added', snap => {
    const c = snap.val();
    if (!c) return;
    const isMe = c.sender === myPlayerId;
    const d = document.createElement('div');
    d.style = `padding: 8px 12px; border-radius: 12px; max-width: 85%; font-weight: 800; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); clear: both; ${isMe ? 'background: #e1f5fe; color: #0277bd; border: 2px solid #81d4fa; align-self: flex-end;' : 'background: #fff; color: #4e342e; border: 2px solid #d7ccc8; align-self: flex-start;'}`;
    d.innerHTML = `<div style="font-size: 10px; opacity: 0.7; margin-bottom: 2px;">${c.sender}</div>${c.text}`;
    chatMessagesContainer.appendChild(d);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  });
}

function updateGlobalCycle() {
  const CYCLE_DURATION = 600000; 
  const HALF_CYCLE = 300000;     
  const syncedNow = getServerTime();
  const nowOffset = syncedNow % CYCLE_DURATION;
  
  const wasDay = gameState.isDay;
  gameState.isDay = nowOffset < HALF_CYCLE;
  
  gameState.cycleTimeLeft = Math.ceil((gameState.isDay ? HALF_CYCLE - nowOffset : CYCLE_DURATION - nowOffset) / 1000);
  
  if (wasDay !== gameState.isDay) {
    cycleIcon.style.transform = 'rotate(360deg) scale(1.3)';
    setTimeout(() => { cycleIcon.style.transform = 'rotate(0deg) scale(1)'; }, 800);
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
  }
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
  if (!vineModal.classList.contains('hidden')) renderVineModalContent();
}

function secondTick() {
  updateGlobalCycle();
  updateShopForCurrentCycle();
  
  const now = getServerTime();
  const CYCLE_3MIN = 180000;
  const sLeft = Math.max(0, Math.ceil((CYCLE_3MIN - (now % CYCLE_3MIN)) / 1000));
  if (shopRefillTimerEl) {
    shopRefillTimerEl.textContent = formatTime(sLeft);
  }
  
  updateHUD();
}

function initSplashScreen() {
  const ss = el('splash-screen');
  const pf = el('splash-progress-fill');
  const pe = el('splash-prompt');
  
  if (!ss || !pf || !pe) return;
  
  let p = 0;
  let l = false;
  pe.textContent = "🎷 PRESS (A) / TAP TO START 🎵";
  
  const int = setInterval(() => {
    p += 2.0;
    if (p > 100) p = 100;
    pf.style.width = `${p}%`;
    if (p >= 100) {
      clearInterval(int);
      l = true;
      pe.textContent = 'CLICK TO START YOUR VENTURE';
      pe.classList.add('ready-start');
    }
  }, 40);
  
  ss.addEventListener('click', () => {
    initAudioContext();
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
    playSFX('harvest');
    if (!l) {
      p = 100;
      pf.style.width = '100%';
      pe.textContent = 'CLICK TO START YOUR VENTURE';
      pe.classList.add('ready-start');
      l = true;
      return;
    }
    ss.classList.add('fade-out');
    setTimeout(() => {
      ss.style.display = 'none';
    }, 500);
  });
}

function saveGame() {
  localStorage.setItem('gardenVenture2Save', JSON.stringify({
    cash: gameState.cash,
    level: gameState.level,
    xp: gameState.xp,
    currentField: gameState.currentField,
    unlockedFields: gameState.unlockedFields,
    selectedSeedId: gameState.selectedSeedId,
    seedInventory: gameState.seedInventory,
    produceInventory: gameState.produceInventory,
    codex: gameState.codex,
    fields: gameState.fields,
    bgmMuted: gameState.bgmMuted,
    sfxMuted: gameState.sfxMuted,
    dailyDealUsed: gameState.dailyDealUsed,
    articularSkinActive: gameState.articularSkinActive,
    cycleTimeLeft: gameState.cycleTimeLeft, 
    isDay: gameState.isDay,
    lastSaveTime: Date.now()
  }));
}

function loadGame() {
  const sd = localStorage.getItem('gardenVenture2Save');
  if (sd) {
    try {
      const d = JSON.parse(sd);
      gameState.cash = d.cash !== undefined ? d.cash : 25;
      gameState.level = d.level || 1;
      gameState.xp = d.xp || 0;
      gameState.currentField = d.currentField || 0;
      gameState.unlockedFields = d.unlockedFields || 1;
      gameState.selectedSeedId = d.selectedSeedId || 'carrot';
      gameState.bgmMuted = d.bgmMuted || false;
      gameState.sfxMuted = d.sfxMuted || false;
      gameState.dailyDealUsed = d.dailyDealUsed || false;
      gameState.articularSkinActive = d.articularSkinActive || false;
      
      gameState.isDay = d.isDay !== undefined ? d.isDay : true;
      gameState.cycleTimeLeft = d.cycleTimeLeft || 300;
      
      if (d.seedInventory) {
        for (let k in d.seedInventory) {
          gameState.seedInventory[k] = d.seedInventory[k];
        }
      }
      SEED_CATALOG.forEach(s => {
        if (gameState.seedInventory[s.id] === undefined) {
          gameState.seedInventory[s.id] = 0;
        }
      });
      
      if (d.codex) {
        for (let k in d.codex) {
          gameState.codex[k] = d.codex[k];
        }
      }
      
      gameState.produceInventory = d.produceInventory || [];
      
      if (d.fields && Array.isArray(d.fields)) {
        gameState.fields = d.fields;
        while (gameState.fields.length < gameState.maxFields) {
          const p = [];
          for (let i = 0; i < 9; i++) {
            p.push({ crop: null, progress: 0, isReady: false, vineEstablished: false, rolledKg: 0, rolledMeters: 0, actualGrowTime: 5, vineFruits: [] });
          }
          gameState.fields.push(p);
        }
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
                      for (let i = 0; i < Math.min(fCount, fCount); i++) {
                        const rs = rollFruitStats(p.crop);
                        let fIcon = p.crop.produceIcon || '🍇';
                        let fName = p.crop.produceName || 'Fruit';
                        if(p.crop.produceIcons && p.crop.produceNames) {
                           const rIdx = Math.floor(Math.random() * p.crop.produceIcons.length);
                           fIcon = p.crop.produceIcons[rIdx];
                           fName = p.crop.produceNames[rIdx];
                        }
                        p.vineFruits.push({ fruitId: `${p.crop.id}_${i}`, name: fName, icon: fIcon, progress: 0, isReady: false, rolledKg: rs.fruitKg, growTime: rs.fruitGrowTime });
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
      console.error("Save load error", e);
    }
  }
}

function initGlobalShop() {
  updateShopForCurrentCycle(true);
}

function sendTradeRequest(targetId) {
  if (!isOnline) {
    showToast("❌ Offline mode. Cannot trade.");
    return;
  }
  db.ref('players/' + targetId + '/tradeRequest').set({
    from: myPlayerId,
    timestamp: getServerTime()
  });
  showToast(`📤 Trade request sent to ID: ${targetId}`);
}

function renderTradeSlots(myItems, partnerItems) {
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
        <span class="slot-name">${item.name}</span>
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
          db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
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
        <span class="slot-name">${item.name}</span>
        ${item.type === 'produce' ? `<span class="slot-kg">${formatKg(item.kg)}</span>` : ''}
      `;
    } else {
      theirSlot.className = 'trade-slot';
    }
    theirTradeSlots.appendChild(theirSlot);
  }
}

function renderTradeBackpack(tab = 'seeds') {
  if (!tradeTabSeeds || !tradeTabProduce || !tradePickerList) return;
  tradeTabSeeds.classList.toggle('active', tab === 'seeds');
  tradeTabProduce.classList.toggle('active', tab === 'produce');
  tradePickerList.innerHTML = '';

  if (tab === 'seeds') {
    SEED_CATALOG.forEach(s => {
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
          db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
          closeModal(tradeBackpackModal);
        };
        tradePickerList.appendChild(card);
      }
    });
  } else {
    gameState.produceInventory.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'trade-item-card';
      card.style = "display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border-radius:8px; margin-bottom:6px; border:2px solid #d7ccc8;";
      card.innerHTML = `<span>${item.icon} ${item.name} ($${item.value})</span> <button style="background:#4caf50; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-weight:bold; cursor:pointer;">Add</button>`;
      card.querySelector('button').onclick = () => {
        if (amIReady) return;
        if (myOfferedItems.length >= 9) {
          showToast("❌ Trade box is full (Max 9)!");
          return;
        }
        myOfferedItems.push({ type: 'produce', id: item.id, seedId: item.seedId, name: item.name, icon: item.icon, kg: item.kg, value: item.value });
        const isP1 = currentTradeId && currentTradeId.startsWith(myPlayerId + '_');
        db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
        closeModal(tradeBackpackModal);
      };
      tradePickerList.appendChild(card);
    });
  }
}

function populateAdminDropdowns() {
  if (!adminSeedSelect || !adminInjectSelect) return;
  adminSeedSelect.innerHTML = '';
  adminInjectSelect.innerHTML = '';

  SEED_CATALOG.forEach(s => {
    const opt1 = document.createElement('option');
    opt1.value = s.id;
    opt1.textContent = `${s.icon} ${s.name}`;
    adminSeedSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = s.id;
    opt2.textContent = `${s.icon} ${s.name} (Stock: ${s.currentStock})`;
    adminInjectSelect.appendChild(opt2);
  });
}

function initGame() {
  initFields();
  buildPlotDOMStructure();
  spawnNightFireflies();
  initSplashScreen();
  loadGame();
  
  updateGlobalCycle();
  
  initGlobalShop();
  updateFenceSkin();
  updateHUD();
  renderPlots();
  initFirebasePresence();
  setInterval(gameLoop, 100);
  setInterval(secondTick, 1000);
  setInterval(saveGame, 5000);
}

window.addEventListener('DOMContentLoaded', initGame);