const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

const http = require('http');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1498803742391406633';

const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002',
  '1311142612555661402'
];

const OWNER_ID = '1458910126168735806';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let botLanguage = 'English';

// 🌍 TEXTOS (NO TOCADO)
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
    inventory: 'Inventory',
    empty: 'Empty inventory',
    private: 'Private inventory',
    giftFail: '❌ You don’t have that character'
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
    inventory: 'Inventario',
    empty: 'Inventario vacío',
    private: 'Inventario privado',
    giftFail: '❌ No tienes ese personaje'
  }
};

// 🎮 PERSONAJES (TU SISTEMA COMPLETO SIN QUITAR NADA)
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
    language: 'Russian',
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
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/nrrjGqYM/mrmeowicon.png'
  },
  {
    code: '005',
    name: 'MirtHD',
    rarity: 'Common',
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
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/dtw9XRYD/stifflxricon.png'
  },
  {
    code: '009',
    name: 'JR Crack',
    rarity: 'Legendary',
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
    rarity: 'Legendary',
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
    rarity: 'Rare',
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

let activeSpawn = null;

// 💾 INVENTARIO REAL PERSISTENTE
const INVENTORY_FILE = path.join(__dirname, 'inventories.json');

let inventories = {};
let inventorySettings = {};

function loadInventory() {
  if (!fs.existsSync(INVENTORY_FILE)) return;

  const data = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf8') || '{}');

  inventories = data.inventories || {};
  inventorySettings = data.settings || {};
}

function saveInventory() {
  fs.writeFileSync(
    INVENTORY_FILE,
    JSON.stringify({
      inventories,
      settings: inventorySettings
    }, null, 2)
  );
}

loadInventory();

// 📦 HELPERS
function addItem(userId, character) {
  if (!inventories[userId]) inventories[userId] = [];

  inventories[userId].push(character);
  saveInventory();
}

function getInv(userId) {
  return inventories[userId] || [];
}

function setPrivacy(userId, value) {
  inventorySettings[userId] = value;
  saveInventory();
}

function getPrivacy(userId) {
  return inventorySettings[userId] || 'Visible';
}

// 🎲 RANDOM (NO TOCADO)
function getRandomCharacter() {
  return characters[Math.floor(Math.random() * characters.length)];
}

// 📜 COMMANDS (TODOS LOS TUYOS + NUEVOS)
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific')
    .addStringOption(o =>
      o.setName('codigo').setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Character data'),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change language')
    .addStringOption(o =>
      o.setName('idioma')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'English' },
          { name: 'Spanish', value: 'Spanish' }
        )
    ),

  new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View inventory')
    .addUserOption(o =>
      o.setName('user')
    ),

  new SlashCommandBuilder()
    .setName('inventory_config')
    .setDescription('Set inventory visibility')
    .addStringOption(o =>
      o.setName('visibility')
        .setRequired(true)
        .addChoices(
          { name: 'Visible', value: 'Visible' },
          { name: 'Private', value: 'Private' }
        )
    ),

  new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift character')
    .addUserOption(o =>
      o.setName('user').setRequired(true)
    )
    .addStringOption(o =>
      o.setName('code').setRequired(true)
    )
].map(c => c.toJSON());

// REST
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  for (const g of GUILD_IDS) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, g), {
      body: commands
    });
  }
})();

// READY
client.once('ready', () => {
  console.log(`✅ Online ${client.user.tag}`);
});

// 🔥 INTERACTIONS
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  const t = texts[botLanguage];

  // LANGUAGE
  if (i.commandName === 'language') {
    botLanguage = i.options.getString('idioma');

    return i.reply({
      content: texts[botLanguage].languageChanged,
      flags: MessageFlags.Ephemeral
    });
  }

  // INVENTORY CONFIG
  if (i.commandName === 'inventory_config') {
    setPrivacy(i.user.id, i.options.getString('visibility'));

    return i.reply({
      content: 'OK',
      flags: MessageFlags.Ephemeral
    });
  }

  // INVENTORY
  if (i.commandName === 'inventory') {
    const user = i.options.getUser('user') || i.user;

    const privacy = getPrivacy(user.id);
    const isOwner = user.id === i.user.id;

    if (!isOwner && privacy === 'Private') {
      return i.reply({
        content: t.private,
        flags: MessageFlags.Ephemeral
      });
    }

    const inv = getInv(user.id);

    if (!inv.length) {
      return i.reply({
        content: t.empty,
        flags: MessageFlags.Ephemeral
      });
    }

    const map = {};
    for (const c of inv) {
      map[c.name] = (map[c.name] || 0) + 1;
    }

    let desc = '';
    for (const k in map) {
      desc += `• ${k} x${map[k]}\n`;
    }

    return i.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${user.username} Inventory`)
          .setDescription(desc)
      ]
    });
  }

  // GIFT
  if (i.commandName === 'gift') {
    const user = i.options.getUser('user');
    const code = i.options.getString('code');

    const inv = getInv(i.user.id);
    const index = inv.findIndex(c => c.code === code);

    if (index === -1) {
      return i.reply({
        content: t.giftFail,
        flags: MessageFlags.Ephemeral
      });
    }

    const [item] = inv.splice(index, 1);
    inventories[i.user.id] = inv;

    addItem(user.id, item);
    saveInventory();

    return i.reply(
      `🎁 ${i.user.username} gifted ${item.name} to ${user.username}`
    );
  }

  // SPAWN
  if (i.commandName === 'spawn') {
    if (activeSpawn) {
      return i.reply({
        content: t.active,
        flags: MessageFlags.Ephemeral
      });
    }

    activeSpawn = getRandomCharacter();

    const embed = new EmbedBuilder()
      .setTitle(t.spawned)
      .setDescription(`${activeSpawn.name} - ${activeSpawn.rarity}`);

    if (activeSpawn.image) embed.setImage(activeSpawn.image);

    await i.reply({ content: 'ok', flags: MessageFlags.Ephemeral });
    await i.channel.send({ embeds: [embed] });
  }

});

// CLAIM
client.on('messageCreate', msg => {
  if (msg.author.bot) return;
  if (!activeSpawn) return;

  if (msg.content.toLowerCase() === activeSpawn.name.toLowerCase()) {
    addItem(msg.author.id, activeSpawn);

    msg.reply(`🏆 ${msg.author.username} ${texts[botLanguage].claimed} ${activeSpawn.name}`);

    activeSpawn = null;
  }
});

// LOGIN
client.login(TOKEN);

// SERVER
http.createServer((req, res) => {
  res.write('CGDex Online');
  res.end();
}).listen(process.env.PORT || 3000);
