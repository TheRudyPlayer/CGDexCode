const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder
} = require('discord.js');

const http = require('http');

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

/* =========================
   TEXTOS
========================= */

const texts = {
  English: {
    spawnedTitle: '✨ A character has appeared',
    guessText: '💬 Reply with the correct name to claim it',
    dataTitle: '📖 Character Data',
    claimed: 'claimed',
    code: 'Code',
    name: 'Name',
    rarity: 'Rarity',
    language: 'Language',
    blocked: '❌ You cannot use this command.',
    noActive: '❌ No active character.',
    notFound: '❌ Character not found.',
    activeExists: '❌ There is already an active character.',
    languageChanged: '✅ Language changed to English'
  },
  Spanish: {
    spawnedTitle: '✨ Un personaje ha aparecido',
    guessText: '💬 Responde con el nombre correcto para reclamarlo',
    dataTitle: '📖 Datos del Personaje',
    claimed: 'reclamó a',
    code: 'Código',
    name: 'Nombre',
    rarity: 'Rareza',
    language: 'Idioma',
    blocked: '❌ No puedes usar este comando.',
    noActive: '❌ No hay personaje activo.',
    notFound: '❌ Personaje no encontrado.',
    activeExists: '❌ Ya hay un personaje activo.',
    languageChanged: '✅ Idioma cambiado a Español'
  }
};

/* =========================
   PERSONAJES (NO TOCADO)
========================= */

const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Common',
    language: 'Global',
    image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png'
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
  }
  // 🔥 TU LISTA ORIGINAL SIGUE IGUAL
];

/* =========================
   RAREZAS (NO TOCADO)
========================= */

const rarityChances = {
  Common: 40,
  Rare: 30,
  Epic: 20,
  Legendary: 10
};

/* =========================
   SISTEMA
========================= */

const activeSpawns = new Map();
const guildLanguages = new Map();

/* =========================
   HELPERS
========================= */

function getLang(guildId) {
  return guildLanguages.get(guildId) || 'English';
}

function setLang(guildId, lang) {
  guildLanguages.set(guildId, lang);
}

function getSpawn(guildId) {
  return activeSpawns.get(guildId);
}

function setSpawn(guildId, char) {
  activeSpawns.set(guildId, structuredClone(char));
}

function clearSpawn(guildId) {
  activeSpawns.delete(guildId);
}

function getRandomCharacter() {
  const list = Object.values(characters);
  return list[Math.floor(Math.random() * list.length)];
}

/* =========================
   EMBEDS (FIX IMAGEN 100%)
========================= */

function buildSpawnEmbed(character, lang) {
  const t = texts[lang] || texts.English;

  return new EmbedBuilder()
    .setTitle(t.spawnedTitle)
    .setDescription(
      `🆔 ${t.code}: ${character.code}\n` +
      `⭐ ${t.rarity}: ${character.rarity}\n` +
      `🌎 ${t.language}: ${character.language}\n\n` +
      `${t.guessText}`
    )
    .setImage(character.image ? character.image.replace(/ /g, '%20') : null);
}

function buildDataEmbed(character, lang) {
  const t = texts[lang] || texts.English;

  return new EmbedBuilder()
    .setTitle(t.dataTitle)
    .setDescription(
      `🆔 ${t.code}: ${character.code}\n` +
      `👤 ${t.name}: ${character.name}\n` +
      `⭐ ${t.rarity}: ${character.rarity}\n` +
      `🌎 ${t.language}: ${character.language}`
    )
    .setImage(character.image ? character.image.replace(/ /g, '%20') : null);
}

/* =========================
   COMMANDS
========================= */

const commands = [
  new SlashCommandBuilder().setName('spawn').setDescription('Spawn character'),
  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Character info (owner only)')
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  for (const g of GUILD_IDS) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, g), {
      body: commands
    });
  }
})();

/* =========================
   BOT READY
========================= */

client.once('ready', () => {
  console.log('Bot online');
});

/* =========================
   INTERACTIONS
========================= */

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const lang = getLang(interaction.guildId);

  try {
    /* OWNER ONLY */
    if (
      interaction.commandName === 'data_character' &&
      interaction.user.id !== OWNER_ID
    ) {
      return interaction.reply({
        content: texts[lang].blocked,
        flags: 64
      });
    }

    /* SPAWN */
    if (interaction.commandName === 'spawn') {
      if (getSpawn(interaction.guildId)) {
        return interaction.reply({
          content: texts[lang].activeExists,
          flags: 64
        });
      }

      const char = getRandomCharacter();
      setSpawn(interaction.guildId, char);

      return interaction.reply({
        embeds: [buildSpawnEmbed(char, lang)]
      });
    }

    /* DATA */
    if (interaction.commandName === 'data_character') {
      const spawn = getSpawn(interaction.guildId);

      if (!spawn) {
        return interaction.reply({
          content: texts[lang].noActive,
          flags: 64
        });
      }

      return interaction.reply({
        embeds: [buildDataEmbed(spawn, lang)],
        flags: 64
      });
    }
  } catch (e) {
    console.log(e);
  }
});

/* =========================
   CLAIM SYSTEM
========================= */

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const spawn = getSpawn(message.guildId);
  if (!spawn) return;

  if (
    message.content.toLowerCase().trim() ===
    spawn.name.toLowerCase().trim()
  ) {
    clearSpawn(message.guildId);

    await message.reply(
      `🏆 ${message.author.username} claimed ${spawn.name}\n` +
      `🆔 ${spawn.code} | ⭐ ${spawn.rarity}`
    );
  }
});

/* =========================
   LOGIN
========================= */

client.login(TOKEN);

/* =========================
   SERVER
========================= */

http
  .createServer((req, res) => {
    res.end('OK');
  })
  .listen(process.env.PORT || 3000);
