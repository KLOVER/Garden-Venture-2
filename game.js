// ==========================================================================
// 🎨 GARDEN VENTURE 2: PRISMATIC PAINT (MASTER ENGINE V2.0 / V4 UPDATE)
// ==========================================================================

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

const splashIdEl = document.getElementById('player-id-splash');
const hudIdEl = document.getElementById('player-id-hud');
if (splashIdEl) splashIdEl.textContent = 'ID: ' + myPlayerId;
if (hudIdEl) hudIdEl.textContent = 'ID: ' + myPlayerId;

// ==========================================================================
// 🌟 PLANT & SEED CATALOGS (BALANCED V2.0 ECONOMY)
// ==========================================================================

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

// 🎨 3 PRISMATIC PAINT EVENT SEEDS
const EVENT_SEED_CATALOG = [
  { id: 'paintroot', name: 'Paintroot Seed', icon: '🌱', rarity: 'event', affinity: 'all', cost: 125000, maxStock: 3, currentStock: 3, baseGrowTime: 65, baseSellPrice: 65000, minKg: 0.5, baseMaxKg: 10.0, maxKg: 10000000, minM: 0.5, maxM: 2.0, isVine: false, cssClass: 'plant-paintroot', isEventSeed: true },
  { id: 'splatterbloom', name: 'Splatterbloom Seed', icon: '🌸', rarity: 'event', affinity: 'all', cost: 450000, maxStock: 2, currentStock: 2, baseGrowTime: 85, baseSellPrice: 220000, minKg: 0.8, baseMaxKg: 15.0, maxKg: 10000000, minM: 1.0, maxM: 3.5, isVine: false, cssClass: 'plant-splatterbloom', isEventSeed: true },
  { id: 'holofern', name: 'Holofern Seed', icon: '🌿', rarity: 'event', affinity: 'all', cost: 1200000, maxStock: 2, currentStock: 2, baseGrowTime: 110, baseSellPrice: 380000, minKg: 1.0, baseMaxKg: 18.0, maxKg: 10000000, minM: 2.0, maxM: 6.0, isVine: true, produceIcon: '🌿', produceName: 'Holofern Frond', maxFruits: 3, cssClass: 'plant-holofern', isEventSeed: true }
];

// 🏆 EXCLUSIVE OG RARITY PLANT
const OG_SEED_CATALOG = [
  { id: 'venturebloom', name: 'VentureBloom Seed', icon: '🌸', rarity: 'og', affinity: 'all', cost: 0, maxStock: 0, currentStock: 0, baseGrowTime: 45, baseSellPrice: 42000, minKg: 0.5, baseMaxKg: 10.0, maxKg: 10000000, minM: 0.5, maxM: 2.5, isVine: false, cssClass: 'plant-venturebloom', isOG: true }
];

// 🪵 12 FENCE SKINS
const FENCE_SKINS_CATALOG = [
  { id: 'twig-tangle', name: 'Twig Tangle', rarity: 'common', cost: 1500 },
  { id: 'garden-rail', name: 'Garden Rail', rarity: 'common', cost: 3500 },
  { id: 'bamboo-braid', name: 'Bamboo Braid', rarity: 'uncommon', cost: 18000 },
  { id: 'mossbound', name: 'Mossbound', rarity: 'uncommon', cost: 45000 },
  { id: 'vinebound', name: 'Vinebound', rarity: 'rare', cost: 150000 },
  { id: 'flowerwoven', name: 'Flowerwoven', rarity: 'rare', cost: 300000 },
  { id: 'paintsplashed', name: 'Paintsplashed', rarity: 'legendary', cost: 1800000 },
  { id: 'crystalwood', name: 'Crystalwood', rarity: 'legendary', cost: 4200000 },
  { id: 'stargrove', name: 'Stargrove', rarity: 'astral', cost: 28000000 },
  { id: 'moonroot', name: 'Moonroot', rarity: 'astral', cost: 65000000 },
  { id: 'holofoil-garden', name: 'Holofoil Garden', rarity: 'transcendent', cost: 250000000 },
  { id: 'prismatic-gate', name: 'Prismatic Gate', rarity: 'transcendent', cost: 750000000 }
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
    cycleTimeLeft: 300,
    shopRefillTimeLeft: 180,
    bgmMuted: false,
    sfxMuted: false,
    dailyDealUsed: false,
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

function getGlobalShopStockForCycle(cycleId) {
  const rng = mulberry32(cycleId);
  const stockMap = {};

  SEED_CATALOG.forEach(s => {
    let c = 1.0;
    if (s.rarity === 'uncommon') c = 0.75;
    else if (s.rarity === 'rare') c = 0.50;
    else if (s.rarity === 'legendary') c = 0.05;
    else if (s.id === 'strawberry') c = 0.03;
    else if (s.id === 'cosmic_rose') c = 0.01;
    else if (s.id === 'singularity') c = 0.003;
    else if (s.id === 'celestial_moon') c = 0.001;

    stockMap[s.id] = (s.rarity === 'common' || rng() < c) ? s.maxStock : 0;
  });

  EVENT_SEED_CATALOG.forEach(s => {
    stockMap[s.id] = gameState.isPrismaticRain ? s.maxStock : 0;
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
      if (stockMap[s.id] !== undefined) s.currentStock = stockMap[s.id];
    });

    EVENT_SEED_CATALOG.forEach(s => {
      if (stockMap[s.id] !== undefined) s.currentStock = stockMap[s.id];
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
const nightChords = [[261.63, 329.63, 392.00, 493.88, 587.33], [220.00, 261.63, 329.63, 392.00], [146.83, 220.00, 261.63, 349.23, 440.00], [174.61, 207.65, 261.63, 311.13, 392.00]];

const el = id => document.getElementById(id);

const toastContainer = el('toast-container');
const cashEl = el('cash-amount');
const ogBadgeHud = el('og-badge-hud');
const playtesterBadgeHud = el('playtester-badge-hud');
const plotsGrid = el('plots-grid');
const fieldTitle = el('field-title');
const levelDisplay = el('level-display');
const cycleIcon = el('cycle-icon');
const cycleLabel = el('cycle-label');
const cycleTimer = el('cycle-timer');
const currentSeedNameEl = el('current-seed-name');
const particlesLayer = el('particles-layer');
const firefliesLayer = el('fireflies-layer');
const prismaticRainLayer = el('prismatic-rain-layer');
const holoRaindropIcon = el('holo-raindrop-icon');
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
const eventShopItemsList = el('event-shop-items-list');
const shopRefillTimerEl = el('shop-refill-timer');
const openIndexBtn = el('open-index-btn');
const shopTabNormal = el('shop-tab-normal');
const shopTabEvent = el('shop-tab-event');
const eventShopBanner = el('event-shop-banner');

const skipTimerModal = el('skip-timer-modal');
const skipTimeLeft = el('skip-time-left');
const btnConfirmSkip = el('btn-confirm-skip');
const btnCloseSkip = el('btn-close-skip');

// Decor Modal
const decorModal = el('decor-modal');
const tabFenceSkinsBtn = el('tab-fence-skins-btn');
const tabSpecialSkinsBtn = el('tab-special-skins-btn');
const fenceSkinsList = el('fence-skins-list');
const specialSkinsList = el('special-skins-list');
const closeDecorBtn = el('close-decor-btn');
const articularSkinToggleBtn = el('articular-skin-toggle-btn');

// Sell Modal
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

// Codex Modal
const indexModal = el('index-modal');
const closeIndexBtn = el('close-index-btn');
const closeIndexBottomBtn = el('close-index-bottom-btn');
const indexItemsList = el('index-items-list');
const codexProgressFill = el('codex-progress-fill');
const codexProgressText = el('codex-progress-text');

// Settings & Veteran
const settingsModal = el('settings-modal');
const closeSettingsBtn = el('close-settings-btn');
const statsSummaryEl = el('stats-summary');
const gv1VerifyCode = el('gv1-verify-code');
const btnVerifyGv1 = el('btn-verify-gv1');

const btnOpenResetConfirm = el('btn-open-reset-confirm');
const resetConfirmModal = el('reset-confirm-modal');
const btnConfirmReset = el('btn-confirm-reset');
const btnCancelReset = el('btn-cancel-reset');

// Playtester System Elements
const btnOpenPlaytesterMenu = el('btn-open-playtester-menu');
const playtesterModal = el('playtester-modal');
const closePlaytesterBtn = el('close-playtester-btn');
const playtesterModeStatus = el('playtester-mode-status');
const btnTogglePlaytesterMode = el('btn-toggle-playtester-mode');
const btnResetPlaytester = el('btn-reset-playtester');
const btnDeletePlaytester = el('btn-delete-playtester');
const playtesterConfirmModal = el('playtester-confirm-modal');
const playtesterConfirmTitle = el('playtester-confirm-title');
const playtesterConfirmDesc = el('playtester-confirm-desc');
const btnConfirmPlaytesterAction = el('btn-confirm-playtester-action');
const btnCancelPlaytesterAction = el('btn-cancel-playtester-action');

// Admin Elements
const btnOpenAdminAuth = el('btn-open-admin-auth');
const adminLoginModal = el('admin-login-modal');
const adminPass1 = el('admin-pass-1');
const adminPass2 = el('admin-pass-2');
const btnSubmitAdmin = el('btn-submit-admin');
const btnCloseAdminLogin = el('btn-close-admin-login');

const adminModal = el('admin-modal');
const closeAdminBtn = el('close-admin-btn');
const adminTargetScope = el('admin-target-scope');
const adminSeedSelect = el('admin-seed-select');
const adminSeedQty = el('admin-seed-qty');
const adminBtnGrant = el('admin-btn-grant');
const adminOgSeedQty = el('admin-og-seed-qty');
const adminBtnGrantOg = el('admin-btn-grant-og');
const adminRestockSelect = el('admin-restock-select');
const adminRestockQty = el('admin-restock-qty');
const adminBtnRestock = el('admin-btn-restock');
const adminCashQty = el('admin-cash-qty');
const adminBtnCash = el('admin-btn-cash');
const adminBtnSkipGrow = el('admin-btn-skip-grow');
const adminBroadcastMsg = el('admin-broadcast-msg');
const adminBtnBroadcast = el('admin-btn-broadcast');

// Trade Network Elements
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

// ==========================================================================
// 🛠️ UTILITY & AUDIO SYSTEM
// ==========================================================================

function showToast(msg) {
  if (!toastContainer) return;
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => { t.remove(); }, 4500);
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
  }, 220);
}

function toggleDrawer(d) {
  if (d.classList.contains('open')) closeDrawer(d);
  else openDrawer(d);
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
    if (!d.classList.contains('open')) d.classList.add('hidden');
  }, 250);
}

function createFloatingText(x, y, text, color) {
  if (!particlesLayer) return;
  const elem = document.createElement('div');
  elem.className = 'floating-text';
  elem.textContent = text;
  elem.style.left = `${x - 20}px`;
  elem.style.top = `${y - 20}px`;
  if (color) elem.style.color = color;
  particlesLayer.appendChild(elem);
  setTimeout(() => { elem.remove(); }, 1200);
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
  if (gameState.sfxMuted) return;
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
  } else if (type === 'mutate') {
    [587.33, 880.00, 1174.66, 1760.00].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.14, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.35);
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
    if (isOnline && !isPlaytesterMode) db.ref('players/' + myPlayerId).update({ level: gameState.level });
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
    const key = i.isHolo ? `${i.name} (Holo)` : i.name;
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
    showToast("🏆 OG BADGE UNLOCKED! Permanent 1.5× Cash Multiplier Activated!");
    createFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 40, "🏆 OG BADGE EARNED! 1.5× CASH!", "#ffd700");
    playSFX('mutate');
  }

  const mult = gameState.hasOgBadge ? 1.5 : 1.0;
  return Math.round(subtotal * mult);
}

// ==========================================================================
// 🪵 DECOR SHOP & FENCE SKIN ENGINE
// ==========================================================================

function updateFenceSkin() {
  if (!fenceStructure) return;
  fenceStructure.className = 'wooden-fence-structure';
  
  if (gameState.articularSkinActive) {
    fenceStructure.classList.add('fence-skin-articular');
  } else if (gameState.currentFenceSkin && gameState.currentFenceSkin !== 'classic') {
    fenceStructure.classList.add(`fence-skin-${gameState.currentFenceSkin}`);
  }
}

function renderDecorShop() {
  if (!fenceSkinsList) return;
  fenceSkinsList.innerHTML = '';
  
  FENCE_SKINS_CATALOG.forEach(skin => {
    const isOwned = gameState.ownedFenceSkins.includes(skin.id);
    const isEquipped = (gameState.currentFenceSkin === skin.id && !gameState.articularSkinActive);
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
        <div class="item-price-stock">${isOwned ? 'Owned' : formatCash(skin.cost)}</div>
      </div>
      <button class="${btnClass}" ${(!isOwned && !canAfford) ? 'disabled' : ''}>${btnText}</button>
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
      } else if (canAfford) {
        gameState.cash -= skin.cost;
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

// ==========================================================================
// 📖 CODEX INDEX & HUD RENDERING
// ==========================================================================

function renderIndexCodex() {
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

  if (codexProgressFill && codexProgressText) {
    const pct = Math.round((discoveredCount / requiredSeeds.length) * 100);
    codexProgressFill.style.width = `${pct}%`;
    codexProgressText.textContent = `${discoveredCount} / ${requiredSeeds.length} Discovered (${pct}%)`;
  }
}

function updateHUD() {
  cashEl.textContent = formatCash(gameState.cash);
  fieldTitle.textContent = `Field ${gameState.currentField + 1} / ${gameState.maxFields}`;
  levelDisplay.textContent = `🌟 Level ${gameState.level} (${Math.floor(gameState.xp)} / ${getRequiredXP(gameState.level)} XP)`;
  
  if (ogBadgeHud) {
    ogBadgeHud.classList.toggle('hidden', !gameState.hasOgBadge);
  }

  if (playtesterBadgeHud) {
    playtesterBadgeHud.classList.toggle('hidden', !isPlaytesterMode);
  }

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
  
  cycleTimer.textContent = formatTime(gameState.cycleTimeLeft);

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

// ==========================================================================
// 🛍️ SHOP & EVENT SHOP RENDERING
// ==========================================================================

function renderShopItems() {
  if (!shopItemsList || !eventShopItemsList) return;
  shopItemsList.innerHTML = '';
  eventShopItemsList.innerHTML = '';

  if (shopTabEvent) {
    shopTabEvent.classList.toggle('hidden', !gameState.isPrismaticRain);
  }
  if (eventShopBanner) {
    eventShopBanner.classList.toggle('hidden', !gameState.isPrismaticRain);
  }

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
    targetContainer.appendChild(c);
  });
}

function renderSeedDrawer() {
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

// ==========================================================================
// 🌧️ FUNCTIONAL HOLOGRAPHIC RAIN & 50/50 MUTATION
// ==========================================================================

function spawnHoloRaindrops() {
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
      if (Math.random() < 0.30) {
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

// ==========================================================================
// 🌾 PLOT BED & HARVEST ENGINE
// ==========================================================================

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
      const maxS = Math.min(3.5, 0.8 + Math.log10(tKg + 1) * 0.45);
      const sF = 0.3 + (plot.progress / 100) * (maxS - 0.3);
      
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
      checkCodexCompletion();
    }
    gameState.codex[p.crop.id].totalHarvested++;
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
  btnConfirmSkip.textContent = `Skip for ${formatCash(c)}`;
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
    if (currentSkipTarget.isFruit) renderVineModalContent();
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
  vineModalTitle.textContent = `${p.crop.icon || '🍇'} ${p.crop.name}`;
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
        <div class="item-icon-badge">${f.icon || '🍇'}</div>
        <div class="item-details">
          <span class="item-title">${f.name || 'Fruit'} #${i + 1}</span>
          <span class="item-sub-stat">${f.isReady ? `🌱 ${formatKg(sKg)} • <strong style="color:#2e7d32;">${formatCash(earn)}</strong>` : `🌱 ${formatKg((f.progress / 100) * sKg)}`}</span>
        </div>
      </div>
      ${f.isReady ? `<button class="btn-vine-harvest">🤠 Harvest</button>` : `<button class="btn-vine-skip">⏳ Skip (${formatTime(rS)})</button>`}
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

  if (fS > 0) {
    skipAllVineBtn.textContent = `⏳ Skip All (${formatCash(tC)})`;
    skipAllVineBtn.disabled = gameState.cash < tC;
    skipAllVineBtn.className = 'btn skip-all-vines-btn active';
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
    skipAllVineBtn.className = 'btn skip-all-vines-btn';
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
      gameState.produceInventory.push({ id: Date.now() + Math.random(), seedId: p.crop.id, name: f.name, icon: f.icon, kg: sKg, meters: p.crop.minM, value: calculateProduceEarnings(p.crop.baseSellPrice, sKg, p.crop.minKg, true, p.isHoloMutated), isHolo: p.isHoloMutated });
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

// ==========================================================================
// 🌧️ WEATHER SYNCHRONIZATION ENGINE
// ==========================================================================

function updateGlobalCycle() {
  const CYCLE_DURATION = 600000;
  const HALF_CYCLE = 300000;
  const syncedNow = getServerTime();
  
  const cycleIndex = Math.floor(syncedNow / CYCLE_DURATION);
  const nowOffset = syncedNow % CYCLE_DURATION;
  
  const wasRain = gameState.isPrismaticRain;
  const wasDay = gameState.isDay;

  if (nowOffset < HALF_CYCLE) {
    gameState.isDay = true;
    gameState.isPrismaticRain = false;
    gameState.cycleTimeLeft = Math.ceil((HALF_CYCLE - nowOffset) / 1000);
  } else {
    const nightRng = mulberry32(cycleIndex * 98765 + 13579);
    const isRainRoll = (nightRng() < 0.15);
    
    gameState.isDay = false;
    gameState.isPrismaticRain = isRainRoll;
    gameState.cycleTimeLeft = Math.ceil((CYCLE_DURATION - nowOffset) / 1000);
  }

  if (!wasRain && gameState.isPrismaticRain) {
    spawnHoloRaindrops();
    showToast("🌧️ PRISMATIC PAINT RAIN IS FALLING! Plants may mutate! Event Shop Open!");
    playSFX('mutate');
    if (shopModal && !shopModal.classList.contains('hidden')) renderShopItems();
  } else if (wasRain && !gameState.isPrismaticRain) {
    showToast("☀️ The Prismatic Rain has passed.");
    if (shopModal && !shopModal.classList.contains('hidden')) renderShopItems();
  }

  if (wasDay !== gameState.isDay && !gameState.isPrismaticRain) {
    cycleIcon.style.transform = 'rotate(360deg) scale(1.3)';
    setTimeout(() => { cycleIcon.style.transform = 'rotate(0deg) scale(1)'; }, 800);
    if (!gameState.bgmMuted) {
      if (lofiTimer) clearInterval(lofiTimer);
      playNextLofiChord();
      lofiTimer = setInterval(playNextLofiChord, gameState.isDay ? 3400 : 4500);
    }
  }
}

// ==========================================================================
// 🧪 PLAYTESTER ACCOUNT SYSTEM (TOTAL ISOLATION)
// ==========================================================================

function updatePlaytesterStatusUI() {
  if (playtesterModeStatus) {
    playtesterModeStatus.textContent = isPlaytesterMode ? "🧪 Playtester Account Active" : "🏠 Main Account Active";
    playtesterModeStatus.style.color = isPlaytesterMode ? "#00b0ff" : "#2e7d32";
  }
  if (btnTogglePlaytesterMode) {
    btnTogglePlaytesterMode.textContent = isPlaytesterMode ? "🚪 Exit Playtester Mode" : "🧪 Enter Playtester Mode";
    btnTogglePlaytesterMode.style.background = isPlaytesterMode ? "#757575" : "linear-gradient(135deg, #00b0ff, #0091ea)";
  }
}

if (btnOpenPlaytesterMenu) {
  btnOpenPlaytesterMenu.addEventListener('click', () => {
    updatePlaytesterStatusUI();
    openModal(playtesterModal);
    closeModal(settingsModal);
  });
}
if (closePlaytesterBtn) closePlaytesterBtn.addEventListener('click', () => closeModal(playtesterModal));

if (btnTogglePlaytesterMode) {
  btnTogglePlaytesterMode.addEventListener('click', () => {
    saveGame();
    isPlaytesterMode = !isPlaytesterMode;
    loadGame();
    updateFenceSkin();
    updateHUD();
    renderPlots();
    updatePlaytesterStatusUI();
    closeModal(playtesterModal);
    
    if (isPlaytesterMode) {
      showToast("🧪 Switched to isolated Playtester Account!");
    } else {
      showToast("🏠 Returned to Main Account!");
    }
  });
}

if (btnResetPlaytester) {
  btnResetPlaytester.addEventListener('click', () => {
    playtesterActionPending = 'reset';
    playtesterConfirmTitle.textContent = "♻️ RESET PLAYTESTER?";
    playtesterConfirmDesc.textContent = "This will erase Playtester progress only. Your Main Account remains 100% safe.";
    openModal(playtesterConfirmModal);
  });
}

if (btnDeletePlaytester) {
  btnDeletePlaytester.addEventListener('click', () => {
    playtesterActionPending = 'delete';
    playtesterConfirmTitle.textContent = "🗑️ DELETE PLAYTESTER?";
    playtesterConfirmDesc.textContent = "This will permanently delete the Playtester save profile. Main Account is untouched.";
    openModal(playtesterConfirmModal);
  });
}

if (btnConfirmPlaytesterAction) {
  btnConfirmPlaytesterAction.addEventListener('click', () => {
    if (playtesterActionPending === 'reset' || playtesterActionPending === 'delete') {
      localStorage.removeItem('gardenVenture2PlaytesterSave');
      if (isPlaytesterMode) {
        gameState = createDefaultGameState();
        initFields();
        updateFenceSkin();
        updateHUD();
        renderPlots();
      }
      showToast(`🧪 Playtester Account ${playtesterActionPending === 'reset' ? 'reset' : 'deleted'} successfully.`);
    }
    closeModal(playtesterConfirmModal);
    updatePlaytesterStatusUI();
  });
}

if (btnCancelPlaytesterAction) {
  btnCancelPlaytesterAction.addEventListener('click', () => {
    playtesterActionPending = null;
    closeModal(playtesterConfirmModal);
  });
}

// ==========================================================================
// 🔐 RESTORED & EXPANDED ADMIN COMMAND SUITE
// ==========================================================================

function populateAdminDropdowns() {
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

if (btnOpenAdminAuth) {
  btnOpenAdminAuth.addEventListener('click', () => {
    openModal(adminLoginModal);
    closeModal(settingsModal);
  });
}

if (btnSubmitAdmin) {
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
}

if (btnCloseAdminLogin) btnCloseAdminLogin.addEventListener('click', () => closeModal(adminLoginModal));
if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => closeModal(adminModal));

if (adminBtnGrant) {
  adminBtnGrant.addEventListener('click', () => {
    const id = adminSeedSelect.value;
    const q = parseInt(adminSeedQty.value) || 1;
    if (adminTargetScope.value === 'global' && !isPlaytesterMode) {
      db.ref('adminCommands').push({ type: 'seed', seedId: id, amount: q, ts: getServerTime() });
      showToast(`Sent Global Command: +${q} ${id}`);
    } else {
      gameState.seedInventory[id] = (gameState.seedInventory[id] || 0) + q;
      updateHUD();
      showToast(`🛡️ Granted ${q}x ${id}!`);
    }
  });
}

if (adminBtnGrantOg) {
  adminBtnGrantOg.addEventListener('click', () => {
    const q = parseInt(adminOgSeedQty.value) || 1;
    if (adminTargetScope.value === 'global' && !isPlaytesterMode) {
      db.ref('adminCommands').push({ type: 'seed', seedId: 'venturebloom', amount: q, ts: getServerTime() });
      showToast(`Sent Global Command: +${q} VentureBloom (OG)`);
    } else {
      gameState.seedInventory['venturebloom'] = (gameState.seedInventory['venturebloom'] || 0) + q;
      updateHUD();
      showToast(`🏆 Granted ${q}x VentureBloom (OG)!`);
    }
  });
}

if (adminBtnRestock) {
  adminBtnRestock.addEventListener('click', () => {
    const id = adminRestockSelect.value;
    const q = parseInt(adminRestockQty.value) || 5;
    const s = SEED_CATALOG.find(x => x.id === id);
    if (s) {
      s.currentStock = q;
      populateAdminDropdowns();
      if (!shopModal.classList.contains('hidden')) renderShopItems();
      showToast(`🛡️ Restocked ${s.name} to ${q} in Shop!`);
    }
  });
}

if (adminBtnCash) {
  adminBtnCash.addEventListener('click', () => {
    const q = parseInt(adminCashQty.value) || 0;
    if (q <= 0) return;
    if (adminTargetScope.value === 'global' && !isPlaytesterMode) {
      db.ref('adminCommands').push({ type: 'cash', amount: q, ts: getServerTime() });
      showToast(`Sent Global Command: +${formatCash(q)}`);
    } else {
      gameState.cash += q;
      playSFX('sell');
      updateHUD();
      showToast(`🛡️ Added ${formatCash(q)} Cash!`);
    }
  });
}

if (adminBtnSkipGrow) {
  adminBtnSkipGrow.addEventListener('click', () => {
    let skipped = 0;
    gameState.fields.forEach(field => {
      field.forEach(p => {
        if (p.crop && !p.isReady) {
          p.progress = 100;
          p.isReady = true;
          skipped++;
        }
      });
    });
    if (skipped > 0) {
      playSFX('sell');
      updateHUD();
      renderPlots();
      showToast("🚀 Fast-forwarded all crops!");
    } else {
      showToast("❌ No crops to skip!");
    }
  });
}

if (adminBtnBroadcast) {
  adminBtnBroadcast.addEventListener('click', () => {
    const m = adminBroadcastMsg.value;
    if (m.trim() !== '' && !isPlaytesterMode) {
      db.ref('adminCommands').push({ type: 'broadcast', message: m, ts: getServerTime() });
      showToast(`Sent Global Broadcast`);
      adminBroadcastMsg.value = '';
    }
  });
}

// ==========================================================================
// 🏆 GV1 LEGACY VETERAN VERIFICATION
// ==========================================================================

if (btnVerifyGv1) {
  btnVerifyGv1.addEventListener('click', () => {
    const code = (gv1VerifyCode.value || '').trim().toUpperCase();
    const validCodes = ['GV1VET', 'GV1VETERAN', 'OGGARDENER', 'V1LEGACY', 'PRISMATICOG'];
    
    if (validCodes.includes(code) || localStorage.getItem('gv1_veteran_key')) {
      gameState.isGv1Veteran = true;
      gameState.seedInventory['venturebloom'] = (gameState.seedInventory['venturebloom'] || 0) + 1;
      localStorage.setItem('gv1_veteran_key', 'true');
      showToast("🏆 GV1 Veteran Verified! Granted exclusive VentureBloom Seed! 🌸");
      updateHUD();
      saveGame();
      closeModal(settingsModal);
    } else {
      showToast("❌ Invalid Veteran Code. Try 'GV1VET'");
    }
  });
}

// ==========================================================================
// 🤠 HARVEST MARKET & BARGAIN SYSTEM
// ==========================================================================

btnSellAllModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) {
    showToast("❌ Seed bag empty!");
    return;
  }
  const payout = calculateCashYield(gameState.produceInventory);
  gameState.produceInventory = [];
  gameState.cash += payout;
  playSFX('sell');
  showToast(`💰 Sold All for ${formatCash(payout)}!${gameState.hasOgBadge ? ' (1.5× OG Bonus Applied!)' : ''}`);
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

function renderSellMainOptions() {
  sellMainOptions.classList.remove('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.add('hidden');
  
  const payout = calculateCashYield(gameState.produceInventory);
  const ogBonusText = gameState.hasOgBadge ? ' [1.5× OG Active]' : '';
  sellAllPayoutText.textContent = `Total Value: ${formatCash(payout)} (${gameState.produceInventory.length} items)${ogBonusText}`;
}

function renderSellItemPicker() {
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.remove('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.add('hidden');
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
        
        if (gameState.produceInventory.length === 0) closeModal(sellModal);
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
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.remove('hidden');
  bargainNpcBox.classList.add('hidden');
  
  const g = sellQuantityState.selectedCropGroup;
  if (!g || g.items.length === 0) {
    renderSellItemPicker();
    return;
  }
  
  const holoPrefix = g.isHolo ? '✨ ' : '';
  const ogPrefix = g.isOG ? '🏆 ' : '';
  qtyCropHeader.textContent = `${g.icon} ${ogPrefix}${holoPrefix}${g.name} (Owned: x${g.items.length})`;
  qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
  
  const itemsToSell = g.items.slice(0, sellQuantityState.quantityToSell);
  const p = calculateCashYield(itemsToSell);
  qtyPayoutPreview.textContent = `Payout: ${formatCash(p)}`;
}

qtyMinusBtn.addEventListener('click', () => {
  if (sellQuantityState.quantityToSell > 1) {
    sellQuantityState.quantityToSell--;
    qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
    const itemsToSell = sellQuantityState.selectedCropGroup.items.slice(0, sellQuantityState.quantityToSell);
    qtyPayoutPreview.textContent = `Payout: ${formatCash(calculateCashYield(itemsToSell))}`;
  }
});

qtyPlusBtn.addEventListener('click', () => {
  const g = sellQuantityState.selectedCropGroup;
  if (g && sellQuantityState.quantityToSell < g.items.length) {
    sellQuantityState.quantityToSell++;
    qtyDisplayNum.textContent = sellQuantityState.quantityToSell;
    const itemsToSell = g.items.slice(0, sellQuantityState.quantityToSell);
    qtyPayoutPreview.textContent = `Payout: ${formatCash(calculateCashYield(itemsToSell))}`;
  }
});

qtyConfirmSellBtn.addEventListener('click', () => {
  const g = sellQuantityState.selectedCropGroup;
  if (!g) return;
  const c = sellQuantityState.quantityToSell;
  const itemsToSell = g.items.slice(0, c);
  const totalPayout = calculateCashYield(itemsToSell);

  itemsToSell.forEach(item => {
    const idx = gameState.produceInventory.findIndex(x => x.id === item.id);
    if (idx !== -1) gameState.produceInventory.splice(idx, 1);
  });

  gameState.cash += totalPayout;
  playSFX('sell');
  showToast(`💰 Sold ${c}x for ${formatCash(totalPayout)}!`);
  updateHUD();
  saveGame();
  if (gameState.produceInventory.length === 0) closeModal(sellModal);
  else renderSellItemPicker();
});

qtyBackBtn.addEventListener('click', () => renderSellItemPicker());

btnSellBargainModal.addEventListener('click', () => {
  if (gameState.produceInventory.length === 0) {
    showToast("❌ Seed bag empty!");
    return;
  }
  sellMainOptions.classList.add('hidden');
  sellItemPicker.classList.add('hidden');
  sellQuantityPicker.classList.add('hidden');
  bargainNpcBox.classList.remove('hidden');
  
  let bv = 0;
  let hR = 0;
  gameState.produceInventory.forEach(i => {
    bv += i.value;
    if (i.seedId === 'singularity' || i.seedId === 'celestial_moon' || i.seedId === 'strawberry' || i.seedId === 'cosmic_rose' || i.isHolo || i.isOG) hR++;
  });
  
  currentBargainBase = bv;
  currentBargainFee = Math.round((bv * 0.20) + (hR * 1250000));
  isDailyDealActive = false;
  
  npcDialogueText.textContent = `Greetings traveler! I can appraise your Seed Bag for market premiums. My fee is ${formatCash(currentBargainFee)}.`;
  npcBargainFee.textContent = `Fee: ${formatCash(currentBargainFee)}`;
  npcStandardValue.textContent = `${formatCash(currentBargainBase)}`;
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
  
  let baseCalculated = calculateCashYield(gameState.produceInventory);
  currentBargainPayout = Math.round(baseCalculated * currentBargainMultiplier);
  npcBargainFee.textContent = "Appraisal Fee Paid";
  npcProjectedCash.textContent = `${formatCash(currentBargainPayout)}`;
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
    let dp = Math.round(calculateCashYield(gameState.produceInventory) * currentBargainMultiplier * 20);
    npcProjectedCash.textContent = `${formatCash(dp)}`;
    npcDialogueText.textContent = `🔥 20X DEAL APPLIED! Payout boosted to ${formatCash(dp)}!`;
    btnDailyDeal.disabled = true;
    btnDailyDeal.textContent = "🔥 20X Deal Applied!";
    playSFX('harvest');
  }
});

btnAcceptBargain.addEventListener('click', () => {
  let baseYield = calculateCashYield(gameState.produceInventory);
  let fp = isDailyDealActive ? Math.round(baseYield * currentBargainMultiplier * 20) : currentBargainPayout;
  if (fp > 0 && gameState.produceInventory.length > 0) {
    if (isDailyDealActive) gameState.dailyDealUsed = true;
    gameState.cash += fp;
    gameState.produceInventory = [];
    playSFX('sell');
    showToast(`Accepted Bargain: +${formatCash(fp)}! 🧙‍♂️`);
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

// ==========================================================================
// 🎮 INITIALIZATION & EVENT LISTENERS
// ==========================================================================

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

if (shopTabNormal) {
  shopTabNormal.addEventListener('click', () => {
    gameState.activeShopTab = 'normal';
    shopTabNormal.classList.add('active');
    if (shopTabEvent) shopTabEvent.classList.remove('active');
    renderShopItems();
  });
}

if (shopTabEvent) {
  shopTabEvent.addEventListener('click', () => {
    if (!gameState.isPrismaticRain) {
      showToast("🔒 Event Shop only opens during Prismatic Paint Rain!");
      return;
    }
    gameState.activeShopTab = 'event';
    shopTabEvent.classList.add('active');
    if (shopTabNormal) shopTabNormal.classList.remove('active');
    renderShopItems();
  });
}

decorBtn.addEventListener('click', () => {
  renderDecorShop();
  openModal(decorModal);
});
closeDecorBtn.addEventListener('click', () => closeModal(decorModal));

if (tabFenceSkinsBtn && tabSpecialSkinsBtn) {
  tabFenceSkinsBtn.addEventListener('click', () => {
    tabFenceSkinsBtn.classList.add('active');
    tabSpecialSkinsBtn.classList.remove('active');
    fenceSkinsList.classList.remove('hidden');
    specialSkinsList.classList.add('hidden');
  });

  tabSpecialSkinsBtn.addEventListener('click', () => {
    tabSpecialSkinsBtn.classList.add('active');
    tabFenceSkinsBtn.classList.remove('active');
    specialSkinsList.classList.remove('hidden');
    fenceSkinsList.classList.add('hidden');
  });
}

if (articularSkinToggleBtn) {
  articularSkinToggleBtn.addEventListener('click', () => {
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
}

settingsBtn.addEventListener('click', () => {
  statsSummaryEl.innerHTML = `<p style="font-size:13px; color:#4e342e; margin-bottom:10px;"><strong>🌟 Farm Level:</strong> ${gameState.level}<br><strong>Unlocked Fields:</strong> ${gameState.unlockedFields} / ${gameState.maxFields}<br><strong>Crops Stored:</strong> ${gameState.produceInventory.length}<br><strong>Current Cash:</strong> ${formatCash(gameState.cash)}<br><strong>OG Multiplier:</strong> ${gameState.hasOgBadge ? '1.5× Active ✨' : 'None'}<br><strong>Profile Mode:</strong> ${isPlaytesterMode ? '🧪 Playtester Account' : '🏠 Main Account'}</p>`;
  openModal(settingsModal);
});
closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));

btnUnlockField.addEventListener('click', () => {
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
if (closeIndexBtn) closeIndexBtn.addEventListener('click', () => closeModal(indexModal));
if (closeIndexBottomBtn) closeIndexBottomBtn.addEventListener('click', () => closeModal(indexModal));
closePermInfoBtn.addEventListener('click', () => closeModal(permanentInfoModal));

btnOpenResetConfirm.addEventListener('click', () => {
  openModal(resetConfirmModal);
  closeModal(settingsModal);
});

btnConfirmReset.addEventListener('click', () => {
  if (isPlaytesterMode) {
    localStorage.removeItem('gardenVenture2PlaytesterSave');
  } else {
    localStorage.removeItem('gardenVenture2Save');
    localStorage.removeItem('gv1_veteran_key');
  }
  
  gameState = createDefaultGameState();
  initFields();
  updateFenceSkin();
  updateHUD();
  renderPlots();
  
  closeModal(resetConfirmModal);
  showToast("♻️ Save Data wiped!");
  setTimeout(() => { location.reload(); }, 600);
});
btnCancelReset.addEventListener('click', () => closeModal(resetConfirmModal));

// Trade Listeners
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
  if (t && t !== myPlayerId) sendTradeRequest(t);
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
  if (currentTradeId) db.ref('trades/' + currentTradeId).update({ status: 'cancelled' });
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
        if (amIReady && t[tk] === true) db.ref('trades/' + currentTradeId).update({ status: 'completed' });
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
  if (msg !== '' && isOnline && !isPlaytesterMode) {
    db.ref('chat').push({ sender: myPlayerId, text: msg, timestamp: getServerTime() });
    chatInput.value = '';
  }
});

function sendTradeRequest(targetId) {
  if (!isOnline || isPlaytesterMode) {
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
          db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
          closeModal(tradeBackpackModal);
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
        db.ref('trades/' + currentTradeId + (isP1 ? '/p1Items' : '/p2Items')).set(myOfferedItems);
        closeModal(tradeBackpackModal);
      };
      tradePickerList.appendChild(card);
    });
  }
}

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
        showToast(`👑 Admin granted everyone ${formatCash(cmd.amount)}!`);
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
      networkStatusText.innerHTML = "Network Status: ONLINE 🟢";
      networkStatusText.style.color = "#2e7d32";
      const myRef = db.ref('players/' + myPlayerId);
      myRef.onDisconnect().remove();
      myRef.set({ level: gameState.level, online: true, inTrade: false });
    } else {
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
      
      if (!pData.inTrade) pRow.querySelector('button').addEventListener('click', () => sendTradeRequest(id));
      activePlayersList.appendChild(pRow);
    }
    if (count === 0) activePlayersList.innerHTML = `<p style="text-align:center; color:#795548; font-weight:800; font-size:14px;">No other players online.</p>`;
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
    } else if (currentTradeId) {
      db.ref('trades/' + currentTradeId).off();
      closeModal(tradeSessionModal);
      currentTradeId = null;
      db.ref('players/' + myPlayerId).update({ inTrade: false });
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
  checkHolographicRainMutations();
  
  const now = getServerTime();
  const CYCLE_3MIN = 180000;
  const sLeft = Math.max(0, Math.ceil((CYCLE_3MIN - (now % CYCLE_3MIN)) / 1000));
  if (shopRefillTimerEl) shopRefillTimerEl.textContent = formatTime(sLeft);
  
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
    setTimeout(() => { ss.style.display = 'none'; }, 500);
  });
}

// ==========================================================================
// 💾 PERSISTENT SAVE & LOAD ENGINE (ISOLATED STORAGE)
// ==========================================================================

function getStorageKey() {
  return isPlaytesterMode ? 'gardenVenture2PlaytesterSave' : 'gardenVenture2Save';
}

function saveGame() {
  try {
    const saveData = {
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
      currentFenceSkin: gameState.currentFenceSkin,
      ownedFenceSkins: gameState.ownedFenceSkins,
      isGv1Veteran: gameState.isGv1Veteran,
      hasOgBadge: gameState.hasOgBadge,
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
      gameState.currentField = d.currentField || 0;
      gameState.unlockedFields = d.unlockedFields || 1;
      gameState.bgmMuted = d.bgmMuted || false;
      gameState.sfxMuted = d.sfxMuted || false;
      gameState.dailyDealUsed = d.dailyDealUsed || false;
      gameState.articularSkinActive = d.articularSkinActive || false;
      gameState.currentFenceSkin = d.currentFenceSkin || 'classic';
      gameState.ownedFenceSkins = Array.isArray(d.ownedFenceSkins) ? d.ownedFenceSkins : ['classic'];
      gameState.isGv1Veteran = d.isGv1Veteran || (localStorage.getItem('gv1_veteran_key') === 'true');
      gameState.hasOgBadge = d.hasOgBadge || false;
      
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
    }
  } else {
    gameState = createDefaultGameState();
    initFields();
  }
}

function initGlobalShop() {
  updateShopForCurrentCycle(true);
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
  initFirebasePresence();
  
  setInterval(gameLoop, 100);
  setInterval(secondTick, 1000);
  setInterval(saveGame, 5000);
}

window.addEventListener('DOMContentLoaded', initGame);
