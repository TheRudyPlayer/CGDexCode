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
const CLIENT_ID = 'TU_CLIENT_ID';

const GUILD_IDS = ['TU_SERVER_ID'];

const OWNER_ID = 'TU_OWNER_ID';

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
const texts = {
  English: {
    spawned: "✨ A character has appeared",
    guess: "💬 Guess the name",
    claimed: "claimed",
    noActive: "❌ No active character",
    blocked: "❌ No permission",
    dataTitle: "📖 Character Data",
    languageChanged: "✅ Language set to English"
  },
  Spanish: {
    spawned: "✨ Un personaje ha aparecido",
    guess: "💬 Adivina el nombre",
    claimed: "reclamó a",
    noActive: "❌ No hay personaje activo",
    blocked: "❌ Sin permiso",
    dataTitle: "📖 Datos del personaje",
    languageChanged: "✅ Idioma cambiado a Español"
  }
};

let guildLang = new Map();

/* =========================
   PERSONAJES
========================= */
const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Common',
    language: 'Spanish',
    image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png'
  },
  {
    code: '006',
    name: 'TheRudyPlayer',
    rarity: 'Common',
    language: 'English',
    image: 'https://i.postimg.cc/cJdJcQ02/therudyplayericon.png'
  }
];

let activeSpawn = null;

/* =========================
   UTIL
========================= */
function getLang(guildId) {
  return guildLang.get(guildId) || 'English';
}

function setLang(guildId, lang) {
  guildLang.set(guildId, lang);
}

/* =========================
   EMBED
========================= */
function buildEmbed(character, lang) {
  const t = texts[lang];

  return new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle(t.spawned)
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n` +
      `🌍 Language: ${character.language}\n\n` +
      t.guess
    )
    .setImage(character.image);
}

/* =========================
   COMMANDS
========================= */
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific character')
    .addStringOption(o =>
      o.setName('code')
        .setDescription('Character code')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Show active character data'),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change language')
    .addStringOption(o =>
      o.setName('lang')
        .setDescription('English or Spanish')
        .setRequired(true)
    )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

/* =========================
   REGISTER
========================= */
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
  console.log(`✅ CGDex Online como ${client.user.tag}`);
});

/* =========================
   INTERACTIONS
========================= */
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  const lang = getLang(i.guildId);
  const t = texts[lang];

  /* LANGUAGE */
  if (i.commandName === 'language') {
    const newLang = i.options.getString('lang');
    setLang(i.guildId, newLang);

    return i.reply({
      content: texts[newLang].languageChanged,
      flags: MessageFlags.Ephemeral
    });
  }

  /* OWNER ONLY */
  if (i.commandName === 'data_character' && i.user.id !== OWNER_ID) {
    return i.reply({
      content: t.blocked,
      flags: MessageFlags.Ephemeral
    });
  }

  /* DATA CHARACTER */
  if (i.commandName === 'data_character') {
    if (!activeSpawn) {
      return i.reply({
        content: t.noActive,
        flags: MessageFlags.Ephemeral
      });
    }

    const c = activeSpawn;

    const embed = new EmbedBuilder()
      .setTitle(t.dataTitle)
      .setDescription(
        `🆔 Code: ${c.code}\n` +
        `👤 Name: ${c.name}\n` +
        `⭐ Rarity: ${c.rarity}\n` +
        `🌍 Language: ${c.language}`
      )
      .setImage(c.image);

    return i.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }

  /* SPAWN */
  if (i.commandName === 'spawn') {
    activeSpawn = characters[Math.floor(Math.random() * characters.length)];

    const embed = buildEmbed(activeSpawn, lang);

    await i.reply({
      content: "✅ Spawned",
      flags: MessageFlags.Ephemeral
    });

    return i.channel.send({ embeds: [embed] });
  }

  /* SPAWN CHARACTER */
  if (i.commandName === 'spawn_character') {
    const code = i.options.getString('code');

    const found = characters.find(c => c.code === code);

    if (!found) {
      return i.reply({
        content: "❌ Not found",
        flags: MessageFlags.Ephemeral
      });
    }

    activeSpawn = found;

    const embed = buildEmbed(found, lang);

    await i.reply({
      content: "✅ Spawned",
      flags: MessageFlags.Ephemeral
    });

    return i.channel.send({ embeds: [embed] });
  }
});

/* =========================
   CLAIM SYSTEM
========================= */
client.on('messageCreate', async message => {
  if (message.author.bot || !activeSpawn) return;

  const input = message.content.toLowerCase().trim();
  const target = activeSpawn.name.toLowerCase();

  if (input === target) {
    const c = activeSpawn;
    activeSpawn = null;

    await message.reply(
      `🏆 ${message.author.username} ${texts['English'].claimed} ${c.name}\n` +
      `🆔 Code: ${c.code}\n` +
      `⭐ Rarity: ${c.rarity}`
    );
  }
});

/* =========================
   LOGIN
========================= */
client.login(TOKEN);

/* =========================
   KEEP ALIVE
========================= */
http.createServer((req, res) => {
  res.end("CGDex Online");
}).listen(process.env.PORT || 3000);
