const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const http = require('http');
const admin = require('firebase-admin');

const TOKEN = process.env.TOKEN;

const CLIENT_ID = '1515526958866501652';

// SERVERS
const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002',
  '1311142612555661402',
  '1513226847712968734',
  '1482193584663953518'
];

// OWNER
const OWNER_ID = [
  '1515472742538023064',
  '1421975491891433553'
];

// CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// TEMPORADA (MODO)
let cgdexSeason = 'Classic';

// LANGUAGE
let botLanguage = 'English';
let serverLanguages = {};

// INVENTORY FILE
let inventories = {};
let inventorySettings = {};
let cgCoins = {};

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

async function loadInventories() {

  const snapshot =
    await db.ref('inventories').once('value');

  inventories =
    snapshot.val() || {};

  const settingsSnapshot =
    await db.ref('settings').once('value');

  inventorySettings =
    settingsSnapshot.val() || {};

  const coinsSnapshot =
  await db.ref('cgCoins').once('value');

cgCoins =
  coinsSnapshot.val() || {};

const languagesSnapshot =
  await db.ref('languages')
    .once('value');

serverLanguages =
  languagesSnapshot.val() || {};

}

async function saveInventories() {

  await db.ref('inventories')
    .set(inventories);

  await db.ref('settings')
    .set(inventorySettings);

  await db.ref('cgCoins')
  .set(cgCoins);

  await db.ref('languages')
  .set(serverLanguages);

}

loadInventories()
  .then(() =>
    console.log('✅ Firebase loaded')
  )
  .catch(console.error);

// TEXTS
const texts = {

  English: {
    spawned: '✨ A character has appeared',
    guess: '💬 Reply with the correct name to claim it',
    active: '❌ There is already an active character.',
    noPermission: '❌ You cannot use this command.',
    notFound: '❌ Character not found.',
    noCharacter: '❌ There is no active character.',
    claimed: 'claimed',
    data: '📖 Character Data',
    languageChanged: '✅ Language changed to English',
    inventory: '📦 Inventory',
    inventoryEmpty: '❌ Empty inventory.',
    inventoryPrivate: '❌ This inventory is private.',
    inventoryConfig: '✅ Inventory updated.',
    gifted: '🎁 Character gifted successfully.',
    giftFail: '❌ You do not own this character.',
    back: 'Back',
    next: 'Next',
    code: 'Code',
    name: 'Name',
    rarity: 'Rarity',
    language: 'Language',
    collectiontext: 'Collection',
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic',
    op: 'OP',
    admin: 'Admin',
    progresstext: 'Progress',
    totalcharacterstext: 'Total Characters',
    uniquecharacterstext: 'Unique Characters',
    nocharacterownedtext: 'You do not own this character',
    soldtext: 'Sold',
    russian: 'Russian',
    global: 'Global',
    english: 'English',
    portuguese: 'Portuguese',
    latam: 'LATAM (Latin America)',
    ukrainian: 'Ukrainian',
    page: 'Page',
    achievementstext: 'Achievements',
    firstcharacter: 'First Character',
    collector: 'Collector',
    mastercollector: 'Master Collector',
    hoarder: 'Hoarder',
    cgdexgod: 'CGDex God',
    rich: 'Rich',
    millionaire: 'Millionaire',
    lucky: 'Lucky',
    legend: 'Legend',
    own1charactertext: 'Own 1 character',
    own25characterstext: 'Own 25 characters',
    own100characterstext: 'Own 100 characters',
    own250characterstext: 'Own 250 characters',
    own500characterstext: 'Own 500 characters',
    own1000coinstext: 'Own 1000 CGCoins',
    own10000coinstext: 'Own 10000 CGCoins',
    own1mythictext: 'Own 1 Mythic character',
    own5mythicstext: 'Own 5 Mythic characters',
  },

  Spanish: {
    spawned: '✨ Un personaje ha aparecido',
    guess: '💬 Responde con el nombre correcto para reclamarlo',
    active: '❌ Ya hay un personaje activo.',
    noPermission: '❌ No puedes usar este comando.',
    notFound: '❌ Personaje no encontrado.',
    noCharacter: '❌ No hay personaje activo.',
    claimed: 'reclamó a',
    data: '📖 Datos del Personaje',
    languageChanged: '✅ Idioma cambiado a Español',
    inventory: '📦 Inventario',
    inventoryEmpty: '❌ Inventario vacío.',
    inventoryPrivate: '❌ Este inventario es privado.',
    inventoryConfig: '✅ Inventario actualizado.',
    gifted: '🎁 Personaje regalado correctamente.',
    giftFail: '❌ No tienes este personaje.',
    back: 'Atrás',
    next: 'Siguiente',
    code: 'Código',
    name: 'Nombre',
    rarity: 'Rareza',
    language: 'Idioma',
    collectiontext: 'Colección',
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
    mythic: 'Mítico',
    op: 'OP',
    admin: 'Admin',
    progresstext: 'Progreso',
    totalcharacterstext: 'Personajes Totales',
    uniquecharacterstext: 'Personajes Únicos',
    nocharacterownedtext: 'Este personaje no te pertenece',
    soldtext: 'Vendido',
    russian: 'Ruso',
    global: 'Global',
    english: 'Inglés',
    portuguese: 'Portugués',
    latam: 'LATAM (América Latina)',
    ukrainian: 'Ucraniano',
    page: 'Página',
    achievementstext: 'Logros',
    firstcharacter: 'Primer Personaje',
    collector: 'Coleccionista',
    mastercollector: 'Maestro Coleccionista',
    hoarder: 'Acumulador',
    cgdexgod: 'Dios de CGDex',
    rich: 'Rico',
    millionaire: 'Millonario',
    lucky: 'Afortunado',
    legend: 'Leyenda',
    own1charactertext: 'Posee 1 personaje',
    own25characterstext: 'Posee 25 personajes',
    own100characterstext: 'Posee 100 personajes',
    own250characterstext: 'Posee 250 personajes',
    own500characterstext: 'Posee 500 personajes',
    own1000coinstext: 'Posee 1000 CGCoins',
    own10000coinstext: 'Posee 10000 CGCoins',
    own1mythictext: 'Posee 1 personaje Mítico',
    own5mythicstext: 'Posee 5 personajes Míticos',
  },

  Portuguese: {
    spawned: '✨ Um personagem apareceu',
    guess: '💬 Responda com o nome correto para reivindicá-lo',
    active: '❌ Já existe um personagem ativo.',
    noPermission: '❌ Você não pode usar este comando.',
    notFound: '❌ Personagem não encontrado.',
    noCharacter: '❌ Não há personagem ativo.',
    claimed: 'reivindicou',
    data: '📖 Dados do Personagem',
    languageChanged: '✅ Idioma alterado para Português',
    inventory: '📦 Inventário',
    inventoryEmpty: '❌ Inventário vazio.',
    inventoryPrivate: '❌ Este inventário é privado.',
    inventoryConfig: '✅ Inventário atualizado.',
    gifted: '🎁 Personagem enviado.',
    giftFail: '❌ Você não possui esse personagem.',
    back: 'Voltar',
    next: 'Seguindo',
    code: 'Código',
    name: 'Nome',
    rarity: 'Raridade',
    language: 'Linguagem',
    collectiontext: 'Coleção',
    common: 'Comum',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Lendário',
    mythic: 'Mítico',
    op: 'OP',
    admin: 'Admin',
    progresstext: 'Progresso',
    totalcharacterstext: 'Total de Caracteres',
    uniquecharacterstext: 'Personagens Únicos',
    nocharacterownedtext: 'Você não é o dono deste personagem',
    soldtext: 'Vendido',
    russian: 'Russo',
    global: 'Global',
    english: 'Inglês',
    portuguese: 'Português',
    latam: 'América Latina',
    ukrainian: 'Ucraniano',
    page: 'Página',
    achievementstext: 'Conquistas',
    firstcharacter: 'Primeiro Personagem',
    collector: 'Colecionador',
    mastercollector: 'Mestre Colecionador',
    hoarder: 'Acumulador',
    cgdexgod: 'Deus do CGDex',
    rich: 'Rico',
    millionaire: 'Milionário',
    lucky: 'Sortudo',
    legend: 'Lenda',
    own1charactertext: 'Possua 1 personagem',
    own25characterstext: 'Possua 25 personagens',
    own100characterstext: 'Possua 100 personagens',
    own250characterstext: 'Possua 250 personagens',
    own500characterstext: 'Possua 500 personagens',
    own1000coinstext: 'Possua 1000 CGCoins',
    own10000coinstext: 'Possua 10000 CGCoins',
    own1mythictext: 'Possua 1 personagem Mítico',
    own5mythicstext: 'Possua 5 personagens Míticos',
  },

  Russian: {
    spawned: '✨ Появился персонаж',
    guess: '💬 Ответьте правильным именем, чтобы получить его',
    active: '❌ Уже есть активный персонаж.',
    noPermission: '❌ Вы не можете использовать эту команду.',
    notFound: '❌ Персонаж не найден.',
    noCharacter: '❌ Нет активного персонажа.',
    claimed: 'получил',
    data: '📖 Информация о персонаже',
    languageChanged: '✅ Язык изменен на русский',
    inventory: '📦 Инвентарь',
    inventoryEmpty: '❌ Пустой инвентарь.',
    inventoryPrivate: '❌ Инвентарь приватный.',
    inventoryConfig: '✅ Инвентарь обновлен.',
    gifted: '🎁 Персонаж подарен.',
    giftFail: '❌ У вас нет этого персонажа.',
    back: 'Назад',
    next: 'Далее',
    code: 'Код',
    name: 'Имя',
    rarity: 'Редкость',
    language: 'Язык',
    collectiontext: 'Коллекция',
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
    mythic: 'Мифический',
    op: 'OP',
    admin: 'Admin',
    progresstext: 'Прогресс',
    totalcharacterstext: 'Общее количество символов',
    uniquecharacterstext: 'Уникальные персонажи',
    nocharacterownedtext: 'Этот персонаж не принадлежит вам',
    soldtext: 'Продано',
    russian: 'Русский',
    global: 'Глобальный',
    english: 'Английский',
    portuguese: 'Португальский',
    latam: 'Латинская Америка',
    ukrainian: 'Украинский',
    page: 'Страница',
    achievementstext: 'Достижения',
    firstcharacter: 'Первый Персонаж',
    collector: 'Коллекционер',
    mastercollector: 'Мастер Коллекционер',
    hoarder: 'Накопитель',
    cgdexgod: 'Бог CGDex',
    rich: 'Богач',
    millionaire: 'Миллионер',
    lucky: 'Счастливчик',
    legend: 'Легенда',
    own1charactertext: 'Получите 1 персонажа',
    own25characterstext: 'Получите 25 персонажей',
    own100characterstext: 'Получите 100 персонажей',
    own250characterstext: 'Получите 250 персонажей',
    own500characterstext: 'Получите 500 персонажей',
    own1000coinstext: 'Имейте 1000 CGCoins',
    own10000coinstext: 'Имейте 10000 CGCoins',
    own1mythictext: 'Получите 1 Мифического персонажа',
    own5mythicstext: 'Получите 5 Мифических персонажей',
  },

  Ukrainian: {
    spawned: '✨ Зʼявився персонаж',
    guess: '💬 Відповідайте правильним ім’ям, щоб отримати його',
    active: '❌ Вже є активний персонаж.',
    noPermission: '❌ Ви не можете використовувати цю команду.',
    notFound: '❌ Персонажа не знайдено.',
    noCharacter: '❌ Немає активного персонажа.',
    claimed: 'отримав',
    data: '📖 Дані персонажа',
    languageChanged: '✅ Мову змінено на українську',
    inventory: '📦 Інвентар',
    inventoryEmpty: '❌ Інвентар порожній.',
    inventoryPrivate: '❌ Цей інвентар приватний.',
    inventoryConfig: '✅ Інвентар оновлено.',
    gifted: '🎁 Персонажа успішно подаровано.',
    giftFail: '❌ Ви не володієте цим персонажем.',
    back: 'Назад',
    next: 'Далі',
    code: 'Код',
    name: 'Ім’я',
    rarity: 'Рідкість',
    language: 'Мова',
    collectiontext: 'Колекція',
    common: 'Звичайний',
    rare: 'Рідкісний',
    epic: 'Епічний',
    legendary: 'Легендарний',
    mythic: 'Міфічний',
    op: 'OP',
    admin: 'Адмін',
    progresstext: 'Прогрес',
    totalcharacterstext: 'Усього персонажів',
    uniquecharacterstext: 'Унікальні персонажі',
    nocharacterownedtext: 'Цей персонаж вам не належить',
    soldtext: 'Продано',
    russian: 'Російська',
    global: 'Глобальний',
    english: 'Англійська',
    portuguese: 'Португальська',
    latam: 'LATAM (Латинська Америка)',
    ukrainian: 'Українська',
    page: 'Сторінка',
    achievementstext: 'Досягнення',
    firstcharacter: 'Перший персонаж',
    collector: 'Колекціонер',
    mastercollector: 'Майстер-колекціонер',
    hoarder: 'Накопичувач',
    cgdexgod: 'Бог CGDex',
    rich: 'Багатій',
    millionaire: 'Мільйонер',
    lucky: 'Щасливчик',
    legend: 'Легенда',
    own1charactertext: 'Отримайте 1 персонажа',
    own25characterstext: 'Отримайте 25 персонажів',
    own100characterstext: 'Отримайте 100 персонажів',
    own250characterstext: 'Отримайте 250 персонажів',
    own500characterstext: 'Отримайте 500 персонажів',
    own1000coinstext: 'Майте 1000 CGCoins',
    own10000coinstext: 'Майте 10000 CGCoins',
    own1mythictext: 'Отримайте 1 міфічного персонажа',
    own5mythicstext: 'Отримайте 5 міфічних персонажів',
  }

};

// CHARACTERS
const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Common',
    language: 'Global',
    image: 'https://i.postimg.cc/TwxJ164Q/rudyicon.png'
  },
  {
    code: '002',
    name: 'ChaloApps',
    rarity: 'Common',
    language: 'Global/Russian',
    image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png'
  },
  {
    code: '003',
    name: 'Dragon Dude',
    rarity: 'Epic',
    language: 'English',
    image: 'https://i.postimg.cc/85KLhQ2n/dragondudeicon.png'
  },
  {
    code: '004',
    name: 'Mr Meow',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/nrrjGqYM/mrmeowicon.png'
  },
  {
    code: '005',
    name: 'MirtHD',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/hPvhnps0/mirticon.png'
  },
  {
    code: '006',
    name: 'TheRudyPlayer',
    rarity: 'Common',
    language: 'LATAM',
    image: 'https://i.postimg.cc/cJdJcQ02/therudyplayericon.png'
  },
  {
    code: '007',
    name: 'Diego Gormaz Gamer',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/2S7PfZR0/diegogormazgamericon.png'
  },
  {
    code: '008',
    name: 'Stiff LXR',
    rarity: 'Legendary',
    language: 'LATAM',
    image: 'https://i.postimg.cc/dtw9XRYD/stifflxricon.png'
  },
  {
    code: '009',
    name: 'JR Crack',
    rarity: 'Mythic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6qHf0tkJ/jrcrackicon.png'
  },
  {
    code: '010',
    name: 'Zhura24K',
    rarity: 'Rare',
    language: 'Ukrainian',
    image: 'https://i.postimg.cc/4d0rP8Mq/zhura24kicon.png'
  },
  {
    code: '011',
    name: 'Eitee',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6qdyykdg/eiteeicon.png'
  },
  {
    code: '012',
    name: 'Den19K',
    rarity: 'Legendary',
    language: 'Ukrainian',
    image: 'https://i.postimg.cc/jdtjMk66/den19kicon.png'
  },
  {
    code: '013',
    name: 'Funchik',
    rarity: 'Epic',
    language: 'English',
    image: 'https://i.postimg.cc/pXCL4YkJ/funchikicon.png'
  },
  {
    code: '014',
    name: 'CDN',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/L88RgJLt/cdnicon.png'
  },
  {
    code: '015',
    name: 'Pau Gamer',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/0ySGC8L3/paugamericon.png'
  },
  {
    code: '016',
    name: 'Pizezo',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/j5MyjC7H/pizezoicon.png'
  },
  {
    code: '017',
    name: 'Gallin',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/BvxgJqpm/gallinicon.png'
  },
  {
    code: '018',
    name: 'ElKiwis',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/DwWWrBbS/elkiwisicon.png'
  },
  {
    code: '019',
    name: 'Dun Dun Dun',
    rarity: 'Epic',
    language: 'Global',
    image: 'https://i.postimg.cc/Gtt19GRF/dundundunicon.png'
  },
  {
    code: '020',
    name: 'Khooni Player',
    rarity: 'Rare',
    language: 'English',
    image: 'https://i.postimg.cc/mkJKDn8Z/khooniplayericon.png'
  },
  {
    code: '021',
    name: 'Pedroguimarães90K',
    rarity: 'Admin',
    language: 'Portuguese',
    image: 'https://i.postimg.cc/0yP1JT9q/pedroguimaraes90kicon.png'
  },
  {
    code: '022',
    name: 'Rudy Roblox',
    rarity: 'Common',
    language: 'Global',
    image: 'https://i.postimg.cc/g03hBLfS/rudyrobloxicon.png'
  },
  {
    code: '023',
    name: 'Rudy Plush',
    rarity: 'Rare',
    language: 'Global',
    image: 'https://i.postimg.cc/KYYztkmv/rudyplushicon.png'
  },
  {
    code: '024',
    name: 'GunGun',
    rarity: 'Epic',
    language: 'English',
    image: 'https://i.postimg.cc/7662Pt5K/gungunicon.png'
  },
  {
    code: '025',
    name: 'Vip Gurita',
    rarity: 'Mythic',
    language: 'English',
    image: 'https://i.postimg.cc/9MDkmZKJ/vipguritaicon.png'
  },
  {
    code: '026',
    name: 'Pickle Gameplay',
    rarity: 'Common',
    language: 'LATAM',
    image: 'https://i.postimg.cc/3rsqhL7N/picklegameplayicon.png'
  },
  {
    code: '027',
    name: 'Fessrepanzel',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/vZJTtwdG/fessrepanzelicon.png'
  },
  {
    code: '028',
    name: 'Zombie',
    rarity: 'Admin',
    language: 'Global',
    image: ''
  },
  {
    code: '029',
    name: 'Cerdito Verde',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/J0vbYbnp/cerditoverdeiconlegacy.png'
  },
  {
    code: '030',
    name: 'Spy_Gaming150',
    rarity: 'Admin',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png'
  },
  {
    code: '031',
    name: 'Lary Hacker',
    rarity: 'Epic',
    language: 'Global',
    image: 'https://i.postimg.cc/brWpGYpS/laryhackericon.webp'
  }
];

const worldCup2026Characters = [
  {
    code: 'WC001',
    name: 'Rudy',
    rarity: 'Common',
    language: 'Global',
    image: 'https://i.postimg.cc/Vs3qZZwH/rudyiconworldcup.png'
  },
  {
    code: 'WC002',
    name: 'ChaloApps',
    rarity: 'Common',
    language: 'Global/Russian',
    image: 'https://i.postimg.cc/0yBvFhW0/chaloappsiconworldcup.png'
  },
  {
    code: 'WC003',
    name: 'Dragon Dude',
    rarity: 'Common',
    language: 'English',
    image: ''
  },
  {
    code: 'WC004',
    name: 'TheRudyPlayer',
    rarity: 'Common',
    language: 'LATAM',
    image: 'https://i.postimg.cc/fT933M6B/therudyplayericonworldcup.png'
  },
  {
    code: 'WC005',
    name: 'Den19K',
    rarity: 'Common',
    language: 'Ukrainian',
    image: ''
  },
  {
    code: 'WC006',
    name: 'Stiff LXR',
    rarity: 'Legendary',
    language: 'LATAM',
    image: ''
  },
  {
    code: 'WC007',
    name: 'JR Crack',
    rarity: 'Mythic',
    language: 'LATAM',
    image: ''
  },
  {
    code: 'WC008',
    name: 'Funchik',
    rarity: 'Epic',
    language: 'English',
    image: ''
  },
  {
    code: 'WC009',
    name: 'Mr Meow',
    rarity: 'Rare',
    language: 'LATAM',
    image: ''
  },
  {
    code: 'WC010',
    name: 'MirtHD',
    rarity: 'Rare',
    language: 'LATAM',
    image: ''
  }
];

// FUNCION DE MODO WC2026
function getCurrentCharacters() {

  if (cgdexSeason === 'WorldCup2026') {
    return worldCup2026Characters;
  }

  return characters;

}

// TRADUCCIÓN DE RAREZAS
function getRarityName(rarity, t) {

  const rarities = {
    Common: t.common,
    Rare: t.rare,
    Epic: t.epic,
    Legendary: t.legendary,
    Mythic: t.mythic,
    OP: t.op,
    Admin: t.admin
  };

  return rarities[rarity] || rarity;

}

// TRADUCCION DE IDIOMAS DE PERSONAJES
function getLanguageName(lang, t) {

  const languages = {
    'Global': t.global,
    'Russian': t.russian,
    'English': t.english,
    'LATAM': t.latam,
    'Portuguese': t.portuguese,
    'Ukrainian': t.ukrainian,
    'Global/Russian':
      `${t.global}/${t.russian}`
  };

  return languages[lang] || lang;

}

// FUNCION DE PACKS
function randomRarity(chances) {

  const roll = Math.random() * 100;

  let current = 0;

  for (const rarity in chances) {

    current += chances[rarity];

    if (roll <= current) {
      return rarity;
    }

  }

  return Object.keys(chances)[0];

}

// LAST
let lastCharacterCode = null;

// ACTIVE
let activeSpawn = null;

// RARITY COLOR
const rarityColors = {
  Common: '#D3D3D3',
  Rare: '#0099FF',
  Epic: '#8000FF',
  Legendary: '#FFD700',
  Mythic: '#FF0000',
  OP: '#00FFFF',
  Admin: '#000000'
};

// RARITY PRICE
const sellPrices = {
  Common: 10,
  Rare: 30,
  Epic: 80,
  Legendary: 200,
  Mythic: 500,
  OP: 1500,
  Admin: 0
};

// RARITY CHANCE
const rarityChances = {
  Common: 70,
  Rare: 20,
  Epic: 9,
  Legendary: 1,
  Mythic: 0.3,
  OP: 0.07,
  Admin: 0
};

// RANDOM
function getRandomCharacter() {

  const roll =
    Math.floor(Math.random() * 100) + 1;

  let current = 0;

  let selectedRarity = 'Common';

  for (const rarity in rarityChances) {

    current += rarityChances[rarity];

    if (roll <= current) {

      selectedRarity = rarity;
      break;

    }

  }

  const currentCharacters =
  getCurrentCharacters();

let filtered =
  currentCharacters.filter(
      character =>
        character.rarity === selectedRarity
    );

  if (filtered.length === 0) {

    filtered = currentCharacters;

  }

  filtered =
    filtered.filter(
      character =>
        character.code !== lastCharacterCode
    );

  if (filtered.length === 0) {

    filtered = currentCharacters;

  }

  const selectedCharacter =
    filtered[
      Math.floor(
        Math.random() * filtered.length
      )
    ];

  lastCharacterCode =
    selectedCharacter.code;

  return selectedCharacter;

}

// INVENTORY HELPERS
async function addCharacterToInventory(
  userId,
  character
) {

  if (!inventories[userId]) {

    inventories[userId] = [];

  }

  inventories[userId].push(character);

  await saveInventories();

}

function getInventory(userId) {

  if (!inventories[userId]) {

    inventories[userId] = [];

  }

  return inventories[userId];

}

// COMMANDS
const commands = [

  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn random character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific character')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Character code')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Character data'),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change bot language')
    .addStringOption(option =>
      option
        .setName('language')
        .setDescription('Change the language of CGDex!')
        .setRequired(true)
        .addChoices(
          { name: '🇺🇸 English', value: 'English' },
          { name: '🇲🇽 Spanish', value: 'Spanish' },
          { name: '🇧🇷 Portuguese', value: 'Portuguese' },
          { name: '🇷🇺 Russian', value: 'Russian' }
        )
    ),

  new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View inventory')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User inventory')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('inventory_config')
    .setDescription('Inventory settings')
    .addStringOption(option =>
      option
        .setName('visibility')
        .setDescription('Visible or Private')
        .setRequired(true)
        .addChoices(
          { name: 'Visible', value: 'Visible' },
          { name: 'Private', value: 'Private' }
        )
    ),

  new SlashCommandBuilder()
  .setName('profile')
  .setDescription('View profile')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('User')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('visibility')
      .setDescription('Public or Private')
      .setRequired(false)
      .addChoices(
        { name: 'Public', value: 'public' },
        { name: 'Private', value: 'private' }
      )
  ),

  new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift character')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Gift user')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Character code')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
  .setName('collection')
  .setDescription('View your collection'),

  new SlashCommandBuilder()
  .setName('buy')
  .setDescription('Buy a pack')
  .addStringOption(option =>
    option
      .setName('pack')
      .setDescription('Pack')
      .setRequired(true)
      .addChoices(
        { name: 'Rare Pack', value: 'rare' },
        { name: 'Epic Pack', value: 'epic' },
        { name: 'Legendary Pack', value: 'legendary' },
        { name: 'World Cup Pack', value: 'worldcup' }
      )
  ),

  new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View rankings')
  .addStringOption(option =>
    option
      .setName('scope')
      .setDescription('Global or Server')
      .setRequired(true)
      .addChoices(
        { name: 'Global', value: 'global' },
        { name: 'Server', value: 'server' }
      )
  )
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Ranking category')
      .setRequired(true)
      .addChoices(
        { name: 'Characters', value: 'characters' },
        { name: 'CGCoins', value: 'coins' }
      )
  ),

  new SlashCommandBuilder()
  .setName('achievements')
  .setDescription('View your achievements'),

  new SlashCommandBuilder()
  .setName('shop')
  .setDescription('View CGDex shop'),

  new SlashCommandBuilder()
  .setName('sell')
  .setDescription('Sell character')
  .addStringOption(option =>
    option
      .setName('code')
      .setDescription('Character code')
      .setRequired(true)
  ),

  new SlashCommandBuilder()
  .setName('balance')
  .setDescription('View your CGCoins'),

  new SlashCommandBuilder()
  .setName('set_mode')
  .setDescription('Change CGDex mode')
  .addStringOption(option =>
    option
      .setName('mode')
      .setDescription('Mode')
      .setRequired(true)
      .addChoices(
        { name: 'Classic', value: 'Classic' },
        { name: 'World Cup 2026', value: 'WorldCup2026' }
      )
  
  ),

].map(command => command.toJSON());

// REST
const rest =
  new REST({ version: '10' })
    .setToken(TOKEN);

// REGISTER
(async () => {

  try {

    // Global Commands
    await rest.put(
      Routes.applicationCommands(
        CLIENT_ID
      ),
      { body: commands }
    );

    // Guild Commands
    for (const guildId of GUILD_IDS) {

      await rest.put(
        Routes.applicationGuildCommands(
          CLIENT_ID,
          guildId
        ),
        { body: commands }
      );

    }

    console.log(
      '✅ Global & Guild Commands Registered'
    );

  } catch (err) {

    console.error(err);

  }

})();

// READY
client.once('ready', () => {

  console.log(
    `✅ Online as ${client.user.tag}`
  );

});

// INTERACTION
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const language =
  serverLanguages[
    interaction.guild.id
  ] || 'English';

const t =
  texts[language];

  try {

    // LANGUAGE
if (
  interaction.commandName ===
  'language'
) {

  const selectedLanguage =
    interaction.options.getString(
      'language'
    );

  serverLanguages[
    interaction.guild.id
  ] = selectedLanguage;

  await saveInventories();

  return interaction.reply({
    content:
      texts[selectedLanguage]
        .languageChanged,
    flags: MessageFlags.Ephemeral
  });

}

    // INVENTORY CONFIG
    if (
      interaction.commandName ===
      'inventory_config'
    ) {

      const visibility =
        interaction.options.getString(
          'visibility'
        );

      inventorySettings[
        interaction.user.id
      ] = visibility;

      saveInventories();

      return interaction.reply({
        content: t.inventoryConfig,
        flags: MessageFlags.Ephemeral
      });

    }

    // INVENTORY
    if (
      interaction.commandName ===
      'inventory'
    ) {

      const target =
        interaction.options.getUser('user') ||
        interaction.user;

      const visibility =
        inventorySettings[target.id] ||
        'Visible';

      if (
        visibility === 'Private' &&
        target.id !== interaction.user.id
      ) {

        return interaction.reply({
          content: t.inventoryPrivate,
          flags: MessageFlags.Ephemeral
        });

      }

      const inventory =
        getInventory(target.id);

      if (inventory.length === 0) {

        return interaction.reply({
          content: t.inventoryEmpty,
          flags: MessageFlags.Ephemeral
        });

      }

      // CONTAR PERSONAJES
      const countedCharacters = {};

      for (const character of inventory) {

        if (!countedCharacters[character.name]) {

          countedCharacters[character.name] = {
            amount: 0,
            rarity: character.rarity,
            code: character.code
          };

        }

        countedCharacters[character.name]
          .amount++;

      }

      // TEXTO
      const inventoryText =
        Object.entries(countedCharacters)
          .map(([name, data]) =>
`🆔 ${data.code} • ${name} x${data.amount}
⭐ ${data.rarity}`
          )
          .join('\n\n');

      // TOTAL
      const totalCharacters =
        inventory.length;

      const totalUnique =
        Object.keys(countedCharacters)
          .length;

      const embed =
        new EmbedBuilder()
          .setTitle(
            `${target.username} ${t.inventory}`
          )
          .setDescription(
`${inventoryText}

━━━━━━━━━━━━
📦 ${t.totalcharacterstext}: ${totalCharacters}
🧩 ${t.uniquecharacterstext}: ${totalUnique}`
          );

      return interaction.reply({
        embeds: [embed]
      });

    }

    // GIFT
    if (
      interaction.commandName ===
      'gift'
    ) {

      const target =
        interaction.options.getUser(
          'user'
        );

      const code =
        interaction.options.getString(
          'code'
        );

      const inventory =
        getInventory(
          interaction.user.id
        );

      const characterIndex =
        inventory.findIndex(
          character =>
            character.code === code
        );

      if (characterIndex === -1) {

        return interaction.reply({
          content: t.giftFail,
          flags: MessageFlags.Ephemeral
        });

      }

      const giftedCharacter =
        inventory.splice(
          characterIndex,
          1
        )[0];

      if (!inventories[target.id]) {

        inventories[target.id] = [];

      }

      inventories[target.id]
        .push(giftedCharacter);

      saveInventories();

      return interaction.reply({
        content:
`${t.gifted}

🎁 ${giftedCharacter.name}
➡️ ${target.username}`
      });

    }

    // BUY
if (
  interaction.commandName ===
  'buy'
) {

  const pack =
    interaction.options.getString(
      'pack'
    );

  let price = 0;
  let character = null;

  if (pack === 'rare') {

    price = 300;

  } else if (pack === 'epic') {

    price = 800;

  } else if (pack === 'legendary') {

    price = 2000;

  } else if (pack === 'worldcup') {

    price = 500;

  }

  const coins =
    cgCoins[interaction.user.id] || 0;

  if (coins < price) {

    return interaction.reply({
      content:
        '❌ Not enough CGCoins.'
    });

  }

  cgCoins[interaction.user.id] =
    coins - price;
  if (pack === 'worldcup') {

    character =
      worldCup2026Characters[
        Math.floor(
          Math.random() *
          worldCup2026Characters.length
        )
      ];

  } else {

    let rarity;

    if (pack === 'rare') {

      rarity = randomRarity({
        Rare: 70,
        Epic: 25,
        Legendary: 5
      });

    }

    if (pack === 'epic') {

      rarity = randomRarity({
        Epic: 75,
        Legendary: 20,
        Mythic: 5
      });

    }

    if (pack === 'legendary') {

      rarity = randomRarity({
        Legendary: 80,
        Mythic: 20
      });

    }

    const possible =
      characters.filter(
        character =>
          character.rarity === rarity
      );

    character =
      possible[
        Math.floor(
          Math.random() *
          possible.length
        )
      ];

  }
  await addCharacterToInventory(
    interaction.user.id,
    character
  );

  await saveInventories();

  return interaction.reply({
    content:
`📦 Pack Opened!

🎉 You got:
🆔 ${character.code}
👤 ${character.name}
⭐ ${character.rarity}

💰 Remaining CGCoins:
${cgCoins[interaction.user.id]}`
  });

}

    // SHOP
if (
  interaction.commandName ===
  'shop'
) {

  const embed =
    new EmbedBuilder()
      .setTitle('📦 CGDex Shop')
      .setDescription(
`📦 Rare Pack
💰 300 CGCoins

📦 Epic Pack
💰 800 CGCoins

📦 Legendary Pack
💰 2000 CGCoins

⚽ World Cup Pack
💰 500 CGCoins`
      );

  return interaction.reply({
    embeds: [embed]
  });

}

    // BALANCE
if (
  interaction.commandName ===
  'balance'
) {

  const coins =
    cgCoins[interaction.user.id] || 0;

  return interaction.reply({
    content:
      `🪙 You have ${coins} CGCoins`
  });

}
    //SELL
    if (
  interaction.commandName ===
  'sell'
) {

  const code =
    interaction.options.getString(
      'code'
    );

  const inventory =
    getInventory(interaction.user.id);

  const index =
    inventory.findIndex(
      character =>
        character.code === code
    );

  if (index === -1) {

    return interaction.reply({
      content: `❌ ${t.nocharacterownedtext}.`,
      flags: MessageFlags.Ephemeral
    });

  }

  const character =
    inventory.splice(index, 1)[0];

  const value =
    sellPrices[character.rarity] || 0;

  cgCoins[interaction.user.id] =
    (cgCoins[interaction.user.id] || 0)
    + value;

  await saveInventories();

  return interaction.reply({
    content:
`💰 ${t.soldtext} ${character.name}
🪙 +${value} CGCoins`
  });

    }
    // COLLECTION
if (
  interaction.commandName ===
  'collection'
) {

  const inventory =
    getInventory(
      interaction.user.id
    );

  const ownedCodes =
    inventory.map(
      character => character.code
    );

  const allCharacters =
    getCurrentCharacters();

  const perPage = 10;

  let page = 0;

  const totalPages =
    Math.ceil(
      allCharacters.length / perPage
    );

  function createEmbed(page) {

    const start =
      page * perPage;

    const end =
      start + perPage;

    const pageCharacters =
      allCharacters.slice(
        start,
        end
      );

    const text =
      pageCharacters
        .map(character => {

          const owned =
            ownedCodes.includes(
              character.code
            );

          return owned
            ? `✅ ${character.code} • ${character.name}`
            : `❌ ${character.code} • ????????`;

        })
        .join('\n');

    return new EmbedBuilder()
      .setTitle(
        `📖 ${t.collectiontext} (${page + 1}/${totalPages})`
      )
      .setDescription(
`${text}

━━━━━━━━━━━━
📊 ${t.progresstext}: ${
  ownedCodes.length
}/${allCharacters.length}`
      );

  }

  const row =
    new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('collection_prev')
          .setLabel(t.back)
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('collection_next')
          .setLabel(t.next)
          .setStyle(ButtonStyle.Secondary)
      );

  const msg =
    await interaction.reply({
      embeds: [createEmbed(page)],
      components: [row],
      fetchReply: true
    });

  const collector =
    msg.createMessageComponentCollector({
      time: 300000
    });

  collector.on(
    'collect',
    async button => {

      if (
        button.user.id !==
        interaction.user.id
      ) {

        return button.reply({
          content:
            '❌ This is not your collection.',
          flags:
            MessageFlags.Ephemeral
        });

      }

      if (
        button.customId ===
        'collection_prev'
      ) {

        page--;

        if (page < 0) {

          page =
            totalPages - 1;

        }

      }

      if (
        button.customId ===
        'collection_next'
      ) {

        page++;

        if (
          page >= totalPages
        ) {

          page = 0;

        }

      }

      await button.update({
        embeds: [
          createEmbed(page)
        ],
        components: [row]
      });

    }
  );

}
        // LEADERBOARD
if (
  interaction.commandName ===
  'leaderboard'
) {

  const scope =
    interaction.options.getString(
      'scope'
    );

  const category =
    interaction.options.getString(
      'category'
    );

  let ranking = [];

  if (
    category ===
    'characters'
  ) {

    ranking =
      Object.entries(inventories)
        .map(
          ([userId, inventory]) => ({
            userId,
            value: inventory.length
          })
        );

  } else {

    ranking =
      Object.entries(cgCoins)
        .map(
          ([userId, coins]) => ({
            userId,
            value: coins
          })
        );

  }

  if (
    scope === 'server'
  ) {

    const memberIds =
      interaction.guild.members.cache
        .map(
          member => member.id
        );

    ranking =
      ranking.filter(
        user =>
          memberIds.includes(
            user.userId
          )
      );

  }

  ranking =
    ranking
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 10);

  const lines = [];

  for (
    const [index, user]
    of ranking.entries()
  ) {

    const fetchedUser =
      await client.users.fetch(
        user.userId
      ).catch(() => null);

    const username =
      fetchedUser
        ? fetchedUser.username
        : 'Unknown User';

    const medal =
      index === 0
        ? '🥇'
        : index === 1
        ? '🥈'
        : index === 2
        ? '🥉'
        : '🏅';

    lines.push(
      `${medal} #${index + 1} • ${username} — ${user.value}`
    );

  }

  const text =
    lines.length > 0
      ? lines.join('\n')
      : 'No data.';

  const embed =
    new EmbedBuilder()
      .setTitle(
        '🏆 Leaderboard'
      )
      .setDescription(
        text
      )
      .setFooter({
        text:
`${scope === 'global'
  ? 'Global'
  : 'Server'}
 • ${
category === 'characters'
  ? 'Characters'
  : 'CGCoins'
}`
      });

  return interaction.reply({
    embeds: [embed]
  });

}
    // PROFILE
if (
  interaction.commandName ===
  'profile'
) {

  const target =
    interaction.options.getUser('user') ||
    interaction.user;

  const visibility =
    interaction.options.getString(
      'visibility'
    ) || 'public';

  const inventory =
    getInventory(target.id);

  const coins =
    cgCoins[target.id] || 0;

  // GLOBAL CHARACTERS
  const globalCharacters =
    Object.keys(inventories)
      .map(id => ({
        id,
        total: getInventory(id).length
      }))
      .sort((a, b) => b.total - a.total);

  const globalCharactersRank =
    globalCharacters.findIndex(
      user => user.id === target.id
    ) + 1;

  // GLOBAL COINS
  const globalCoins =
    Object.keys(cgCoins)
      .map(id => ({
        id,
        coins: cgCoins[id] || 0
      }))
      .sort((a, b) => b.coins - a.coins);

  const globalCoinsRank =
    globalCoins.findIndex(
      user => user.id === target.id
    ) + 1;

  // SERVER MEMBERS
  const members =
    await interaction.guild.members.fetch();

  const serverIds =
    [...members.keys()];

  // SERVER CHARACTERS
  const serverCharacters =
    serverIds
      .map(id => ({
        id,
        total: getInventory(id).length
      }))
      .sort((a, b) => b.total - a.total);

  const serverCharactersRank =
    serverCharacters.findIndex(
      user => user.id === target.id
    ) + 1;

  // SERVER COINS
  const serverCoins =
    serverIds
      .map(id => ({
        id,
        coins: cgCoins[id] || 0
      }))
      .sort((a, b) => b.coins - a.coins);

  const serverCoinsRank =
    serverCoins.findIndex(
      user => user.id === target.id
    ) + 1;

  // RARITIES
  let rare = 0;
  let epic = 0;
  let legendary = 0;
  let mythic = 0;

  for (const character of inventory) {

    if (character.rarity === 'Rare')
      rare++;

    if (character.rarity === 'Epic')
      epic++;

    if (character.rarity === 'Legendary')
      legendary++;

    if (character.rarity === 'Mythic')
      mythic++;

  }

  const embed =
    new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(
        `👤 ${target.username}`
      )
      .setDescription(
`🪙 CGCoins: ${coins}
📦 Characters: ${inventory.length}

━━━━━━━━━━━━

🌍 GLOBAL RANKS

🪙 CGCoins: #${globalCoinsRank || 'N/A'}
📦 Characters: #${globalCharactersRank || 'N/A'}

━━━━━━━━━━━━

🏠 SERVER RANKS

🪙 CGCoins: #${serverCoinsRank || 'N/A'}
📦 Characters: #${serverCharactersRank || 'N/A'}

━━━━━━━━━━━━

⭐ RARITY STATS

🔵 ${t.rare}: ${rare}
🟣 ${t.epic}: ${epic}
🟠 ${t.legendary}: ${legendary}
🔴 ${t.mythic}: ${mythic}`
      );

  return interaction.reply({
    embeds: [embed],
    flags:
      visibility === 'private'
        ? MessageFlags.Ephemeral
        : undefined
  });

}
    // ACHIEVEMENTS
if (
  interaction.commandName ===
  'achievements'
) {

  const inventory =
    getInventory(
      interaction.user.id
    );

  const coins =
    cgCoins[
      interaction.user.id
    ] || 0;

  const mythics =
    inventory.filter(
      character =>
        character.rarity ===
        'Mythic'
    ).length;

  const achievements = [

    {
  name: t.firstcharacter,
  desc: t.own1charactertext,
  unlocked:
    inventory.length >= 1
},

{
  name: t.collector,
  desc: t.own25characterstext,
  unlocked:
    inventory.length >= 25
},

{
  name: t.mastercollector,
  desc: t.own100characterstext,
  unlocked:
    inventory.length >= 100
},

{
  name: t.hoarder,
  desc: t.own250characterstext,
  unlocked:
    inventory.length >= 250
},

{
  name: t.cgdexgod,
  desc: t.own500characterstext,
  unlocked:
    inventory.length >= 500
},

{
  name: t.rich,
  desc: t.own1000coinstext,
  unlocked:
    coins >= 1000
},

{
  name: t.millionaire,
  desc: t.own10000coinstext,
  unlocked:
    coins >= 10000
},

{
  name: t.lucky,
  desc: t.own1mythictext,
  unlocked:
    mythics >= 1
},

{
  name: t.legend,
  desc: t.own5mythicstext,
  unlocked:
    mythics >= 5
}

  ];

  const perPage = 5;

  let page = 0;

  const totalPages =
    Math.ceil(
      achievements.length /
      perPage
    );

  function createEmbed(page) {

    const start =
      page * perPage;

    const end =
      start + perPage;

    const pageAchievements =
      achievements.slice(
        start,
        end
      );

    const unlocked =
      achievements.filter(
        achievement =>
          achievement.unlocked
      ).length;

    const text =
      pageAchievements
        .map(
          achievement =>
`${achievement.unlocked ? '✅' : '🔒'} ${achievement.name}
${achievement.desc}`
        )
        .join('\n\n');

    return new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(
        `🏆 Achievements (${page + 1}/${totalPages})`
      )
      .setDescription(
`${text}

━━━━━━━━━━━━
📊 ${t.progresstext}:
${unlocked}/${achievements.length}`
      );

  }

  const row =
    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(
            'achievement_prev'
          )
          .setLabel(
            t.back
          )
          .setStyle(
            ButtonStyle.Secondary
          ),

        new ButtonBuilder()
          .setCustomId(
            'achievement_next'
          )
          .setLabel(
            t.next
          )
          .setStyle(
            ButtonStyle.Secondary
          )

      );

  const msg =
    await interaction.reply({
      embeds: [
        createEmbed(page)
      ],
      components: [row],
      fetchReply: true
    });

  const collector =
    msg.createMessageComponentCollector({
      time: 300000
    });

  collector.on(
    'collect',
    async button => {

      if (
        button.user.id !==
        interaction.user.id
      ) {

        return button.reply({
          content:
            '❌ This is not your achievements.',
          flags:
            MessageFlags.Ephemeral
        });

      }

      if (
        button.customId ===
        'achievement_prev'
      ) {

        page--;

        if (page < 0) {

          page =
            totalPages - 1;

        }

      }

      if (
        button.customId ===
        'achievement_next'
      ) {

        page++;

        if (
          page >= totalPages
        ) {

          page = 0;

        }

      }

      await button.update({
        embeds: [
          createEmbed(page)
        ],
        components: [row]
      });

    }

  );

   }
  
    // OWNER
    if (
      (
        interaction.commandName ===
          'spawn_character' ||

        interaction.commandName ===
          'data_character' ||

        interaction.commandName ===
          'set_mode'
      ) &&
      !OWNER_ID.includes(interaction.user.id)
    ) {

      return interaction.reply({
        content: t.noPermission,
        flags: MessageFlags.Ephemeral
      });

    }

    // SET MODE
if (
  interaction.commandName ===
  'set_mode'
) {

  const mode =
    interaction.options.getString(
      'mode'
    );

  cgdexSeason = mode;

  return interaction.reply({
    content:
      `✅ CGDex mode changed to: ${mode}`,
    flags: MessageFlags.Ephemeral
  });

}

    // DATA
    if (
      interaction.commandName ===
      'data_character'
    ) {

      if (!activeSpawn) {

        return interaction.reply({
          content: t.noCharacter,
          flags: MessageFlags.Ephemeral
        });

      }

      const embed =
  new EmbedBuilder()
    .setColor(
      rarityColors[
        activeSpawn.rarity
      ] || '#FFFFFF'
    )
    .setTitle(t.data)
          .setDescription(
`🆔 ${t.code}: ${activeSpawn.code}
👤 ${t.name}: ${activeSpawn.name}
⭐ ${t.rarity}: ${
  getRarityName(
    activeSpawn.rarity,
    t
  )
}
🌎 ${t.language}: ${
  getLanguageName(
    activeSpawn.language,
    t
  )
}`
          );

      if (
        activeSpawn.image &&
        activeSpawn.image.startsWith('http')
      ) {

        embed.setImage(
          activeSpawn.image
        );

      }

      return interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });

    }

    // ACTIVE
    if (activeSpawn) {

      return interaction.reply({
        content: t.active,
        flags: MessageFlags.Ephemeral
      });

    }

    let selectedCharacter;

    // SPAWN
if (
  interaction.commandName ===
  'spawn'
) {

  const selectedCharacter =
    getRandomCharacter();

  activeSpawn =
    selectedCharacter;

  const embed =
    new EmbedBuilder()
      .setColor(
        rarityColors[
          selectedCharacter.rarity
        ] || '#FFFFFF'
      )
      .setTitle(t.spawned)
      .setDescription(
`🆔 ${t.code}: ${selectedCharacter.code}
⭐ ${t.rarity}: ${
  getRarityName(
    selectedCharacter.rarity,
    t
  )
}
🌎 ${t.language}: ${
  getLanguageName(
    selectedCharacter.language,
    t
  )
}

${t.guess}`
      );

  if (
    selectedCharacter.image &&
    selectedCharacter.image.startsWith('http')
  ) {

    embed.setImage(
      selectedCharacter.image
    );

  }

  return interaction.reply({
    embeds: [embed]
  });

}
    // SPAWN CHARACTER
if (interaction.commandName === 'spawn_character') {

  const code = interaction.options.getString('code');

  const foundCharacter = getCurrentCharacters().find(
    character => character.code === code
  );

  if (!foundCharacter) {
    return interaction.reply({
      content: t.notFound,
      flags: MessageFlags.Ephemeral
    });
  }

  const selectedCharacter = foundCharacter;

  activeSpawn = selectedCharacter;

  const embed = new EmbedBuilder()
    .setColor(
      rarityColors[selectedCharacter.rarity] || '#FFFFFF'
    )
    .setTitle(t.spawned)
    .setDescription(
`🆔 ${t.code}: ${selectedCharacter.code}
⭐ ${t.rarity}: ${getRarityName(selectedCharacter.rarity, t)}
🌎 ${t.language}: ${getLanguageName(selectedCharacter.language, t)}

${t.guess}`
    );

  if (
    selectedCharacter.image &&
    selectedCharacter.image.startsWith('http')
  ) {
    embed.setImage(selectedCharacter.image);
  }

  await interaction.reply({
    content: '✅',
    flags: MessageFlags.Ephemeral
  });

  await interaction.channel.send({
    embeds: [embed]
  });
}

  } catch (err) {

    console.error(err);

  }

});
    
// CLAIM
client.on('messageCreate', async message => {

  try {

    if (message.author.bot) return;

    if (!activeSpawn) return;

    const guildLanguage =
  serverLanguages[message.guild.id] ||
  botLanguage;

const t =
  texts[guildLanguage];

    const userAnswer =
      message.content.toLowerCase().trim();

    const correctAnswer =
      activeSpawn.name.toLowerCase();

    if (userAnswer === correctAnswer) {

      const claimedCharacter =
        activeSpawn;

      await addCharacterToInventory(
  message.author.id,
  claimedCharacter
);

      activeSpawn = null;

      await message.reply(
`🏆 ${message.author.username} ${t.claimed} ${claimedCharacter.name}

🆔 ${t.code}: ${claimedCharacter.code}
⭐ ${t.rarity}: ${
  getRarityName(
    claimedCharacter.rarity,
    t
  )
}
🌎 ${t.language}: ${
  getLanguageName(
    claimedCharacter.language,
    t
  )
}`
      );

    }

  } catch (err) {

    console.error(err);

  }

});

// LOGIN
client.login(TOKEN);

// PORT
http.createServer((req, res) => {

  res.write('CGDex Online');
  res.end();

}).listen(process.env.PORT || 3000);
