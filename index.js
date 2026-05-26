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
  }
};

/* =========================
   PERSONAJES (NO TOCAR)
========================= */

const characters = [
  {
    code: "001",
    name: "Rudy",
    rarity: "Common",
    image: "https://i.postimg.cc/vB49MTQv/rudyicon.png"
  },
  {
    code: "002",
    name: "Dragon Dude",
    rarity: "Epic",
    image: "https://i.postimg.cc/85KLhQ2n/dragondudeicon.png"
  },
  {
    code: "003",
    name: "Spy Gaming",
    rarity: "Rare",
    image: "https://i.postimg.cc/6pB7ZZvP/spygamingicon.png"
  }
];

/* =========================
   SISTEMA
========================= */

const active = new Map();
const lang = new Map();

/* =========================
   HELPERS
========================= */

function getLang(gid) {
  return lang.get(gid) || "English";
}

function getActive(gid) {
  return active.get(gid);
}

function setActive(gid, c) {
  active.set(gid, c);
}

function clearActive(gid) {
  active.delete(gid);
}

function randomChar() {
  return characters[Math.floor(Math.random() * characters.length)];
}

/* =========================
   🔥 FIX IMAGEN DEFINITIVO
========================= */

function safeImage(url) {
  if (!url) return null;

  try {
    const clean = String(url).trim();

    // valida básico
    if (!clean.startsWith("http")) return null;

    // FIX real para Discord CDN rendering
    return clean.replaceAll(" ", "%20");
  } catch {
    return null;
  }
}

/* =========================
   EMBED
========================= */

function spawnEmbed(c, l) {
  const t = texts[l] || texts.English;

  const img = safeImage(c.image);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle(t.spawn)
    .setDescription(
      `🆔 ${c.code}\n⭐ ${c.rarity}\n\n💬 type name to claim`
    );

  if (img) {
    embed.setImage(img);
  }

  return embed;
}

/* =========================
   COMMANDS
========================= */

const commands = [
  new SlashCommandBuilder()
    .setName("spawn")
    .setDescription("Spawn character"),

  new SlashCommandBuilder()
    .setName("data_character")
    .setDescription("Owner data")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

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

client.once("ready", () => {
  console.log("Bot online FIXED IMAGE version");
});

/* =========================
   COMMANDS
========================= */

client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;

  const l = getLang(i.guildId);

  if (i.commandName === "spawn") {
    if (getActive(i.guildId)) {
      return i.reply({ content: texts[l].already, flags: 64 });
    }

    const c = randomChar();
    setActive(i.guildId, c);

    return i.reply({
      embeds: [spawnEmbed(c, l)]
    });
  }

  if (i.commandName === "data_character") {
    if (i.user.id !== OWNER_ID) {
      return i.reply
