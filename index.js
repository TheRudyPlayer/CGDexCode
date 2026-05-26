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

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1498803742391406633';

const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002'
];

const OWNER_ID = '1458910126168735806';

/* =========================
   CLIENTE
========================= */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* =========================
   IDIOMAS
========================= */
const guildLang = new Map();

function getLang(guildId) {
  return guildLang.get(guildId) || 'English';
}

function setLang(guildId, lang) {
  guildLang.set(guildId, lang);
}

/* =========================
   TEXTOS
========================= */
const texts = {
  English: {
    spawn: "✨ A character has appeared",
    claim: "claimed",
    noActive: "No active character",
    blocked: "Not allowed",
    already: "Already active character"
  },
  Spanish: {
    spawn: "✨ ¡Un personaje apareció!",
    claim: "reclamó a",
    noActive: "No hay personaje activo",
    blocked: "No permitido",
    already: "Ya hay un personaje activo"
  },
  Portuguese: {
    spawn: "✨ Um personagem apareceu!",
    claim: "reivindicou",
    noActive: "Nenhum personagem ativo",
    blocked: "Não permitido",
    already: "Já existe um personagem ativo"
  },
  Russian: {
    spawn: "✨ Появился персонаж!",
    claim: "получил",
    noActive: "Нет активного персонажа",
    blocked: "Недоступно",
    already: "Персонаж уже активен"
  }
};

/* =========================
   PERSONAJES (SIN CAMBIOS)
========================= */
const characters = [
  { code: '001', name: 'Rudy', rarity: 'Common', image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png' },
  { code: '002', name: 'ChaloApps', rarity: 'Common', image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png' },
  { code: '003', name: 'Dragon Dude', rarity: 'Epic', image: 'https://i.postimg.cc/0Q7ymXsg/dragondudeiconlegacy.png' },
  { code: '004', name: 'Mr Meow', rarity: 'Rare', image: 'https://i.postimg.cc/nrrjGqYM/mrmeowicon.png' },
  { code: '005', name: 'MirtHD', rarity: 'Common', image: 'https://i.postimg.cc/8PrskpyV/mirthdicon.png' },
  { code: '006', name: 'TheRudyPlayer', rarity: 'Common', image: 'https://i.postimg.cc/cJdJcQ02/therudyplayericon.png' },
  { code: '007', name: 'Diego Gormaz', rarity: 'Rare', image: 'https://i.postimg.cc/2S7PfZR0/diegogormazgamericon.png' },
  { code: '008', name: 'Stiff LXR', rarity: 'Epic', image: 'https://i.postimg.cc/TY7tjJxy/stifflxricon.png' },
  { code: '009', name: 'JR Crack', rarity: 'Legendary', image: 'https://i.postimg.cc/6qHf0tkJ/jrcrackicon.png' },
  { code: '010', name: 'Spy_Gaming150', rarity: 'Rare', image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png' },
  { code: '011', name: 'Eitee', rarity: 'Rare', image: 'https://i.postimg.cc/6qdyykdg/eiteeicon.png' },
  { code: '012', name: 'Den19K', rarity: 'Legendary', image: 'https://i.postimg.cc/jdtjMk66/den19kicon.png' },
  { code: '013', name: 'Funchik', rarity: 'Epic', image: 'https://i.postimg.cc/pXCL4YkJ/funchikicon.png' },
  { code: '014', name: 'CDN', rarity: 'Rare', image: 'https://i.postimg.cc/L88RgJLt/cdnicon.png' },
  { code: '015', name: 'Pau Gamer', rarity: 'Epic', image: 'https://i.postimg.cc/0ySGC8L3/paugamericon.png' },
  { code: '016', name: 'Pizezo', rarity: 'Rare', image: 'https://i.postimg.cc/j5MyjC7H/pizezoicon.png' },
  { code: '017', name: 'Gallin', rarity: 'Rare', image: 'https://i.postimg.cc/BvxgJqpm/gallinicon.png' }
];

/* =========================
   ESTADO
========================= */
let lastCharacterCode = null;
let activeSpawn = null;

/* =========================
   RAREZAS (SIN TOCAR)
========================= */
const rarityChances = {
  Common: 40,
  Rare: 30,
  Epic: 20,
  Legendary: 10
};

/* =========================
   RANDOM
========================= */
function getRandomCharacter() {
  const roll = Math.floor(Math.random() * 100) + 1;

  let current = 0;
  let rarity = 'Common';

  for (const r in rarityChances) {
    current += rarityChances[r];
    if (roll <= current) {
      rarity = r;
      break;
    }
  }

  let list = characters.filter(c => c.rarity === rarity);
  if (!list.length) list = characters;

  list = list.filter(c => c.code !== lastCharacterCode);
  if (!list.length) list = characters;

  const picked = list[Math.floor(Math.random() * list.length)];

  lastCharacterCode = picked.code;
  return picked;
}

/* =========================
   COMMANDS
========================= */
const commands = [
  new SlashCommandBuilder().setName('spawn').setDescription('Spawn character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific character')
    .addStringOption(opt =>
      opt.setName('codigo')
        .setDescription('Character code')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change language')
    .addStringOption(opt =>
      opt.setName('lang')
        .setDescription('Language')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'English' },
          { name: 'Spanish', value: 'Spanish' },
          { name: 'Portuguese', value: 'Portuguese' },
          { name: 'Russian', value: 'Russian' }
        )
    )
].map(c => c.toJSON());

/* =========================
   REGISTER
========================= */
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  for (const g of GUILD_IDS) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, g), {
      body: commands
    });
  }
})();

/* =========================
   READY
========================= */
client.once('ready', () => {
  console.log(`✅ Online ${client.user.tag}`);
});

/* =========================
   INTERACTIONS
========================= */
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  const lang = getLang(i.guildId);
  const t = texts[lang] || texts.English;

  /* LANGUAGE */
  if (i.commandName === 'language') {
    const l = i.options.getString('lang');
    setLang(i.guildId, l);

    return i.reply({
      content: `✅ Language set to ${l}`,
      flags: MessageFlags.Ephemeral
    });
  }

  /* BLOCK IF OWNER ONLY (spawn control opcional no bloqueado) */

  if (activeSpawn && i.commandName.startsWith('spawn')) {
    return i.reply({
      content: t.already,
      flags: MessageFlags.Ephemeral
    });
  }

  /* SPAWN RANDOM */
  if (i.commandName === 'spawn') {
    activeSpawn = getRandomCharacter();
  }

  /* SPAWN SPECIFIC */
  if (i.commandName === 'spawn_character') {
    const code = i.options.getString('codigo');
    const found = characters.find(c => c.code === code);

    if (!found) {
      return i.reply({
        content: '❌ Not found',
        flags: MessageFlags.Ephemeral
      });
    }

    activeSpawn = found;
  }

  if (i.commandName === 'spawn' || i.commandName === 'spawn_character') {
    const img = String(activeSpawn.image || '').trim();

    const embed = new EmbedBuilder()
      .setTitle(t.spawn)
      .setDescription(
        `🆔 ${activeSpawn.code}\n⭐ ${activeSpawn.rarity}\n\n💬 type name to claim`
      );

    if (img.startsWith('http')) {
      embed.setImage(encodeURI(img));
    }

    await i.reply({ content: '✅', flags: MessageFlags.Ephemeral });
    await i.channel.send({ embeds: [embed] });
  }
});

/* =========================
   CLAIM
========================= */
client.on('messageCreate', async m => {
  if (m.author.bot) return;
  if (!activeSpawn) return;

  if (m.content.toLowerCase().trim() === activeSpawn.name.toLowerCase()) {
    const t = texts[getLang(m.guildId)] || texts.English;

    const c = activeSpawn;
    activeSpawn = null;

    await m.reply(`🏆 ${m.author.username} ${t.claim} ${c.name}`);
  }
});

/* =========================
   LOGIN + SERVER
========================= */
client.login(TOKEN);

http.createServer((req, res) => {
  res.end('CGDex Online');
}).listen(process.env.PORT || 3000);
