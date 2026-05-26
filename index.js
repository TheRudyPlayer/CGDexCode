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
   SISTEMA SIMPLE DE TEXTOS
========================= */

const texts = {
  English: {
    spawn: "✨ A wild character appeared!",
    claim: "claimed",
    noActive: "❌ No active character.",
    blocked: "❌ Not allowed.",
    already: "❌ Already active character exists."
  },
  Spanish: {
    spawn: "✨ ¡Un personaje apareció!",
    claim: "reclamó a",
    noActive: "❌ No hay personaje activo.",
    blocked: "❌ No permitido.",
    already: "❌ Ya hay un personaje activo."
  }
};

/* =========================
   PERSONAJES (BASE LIMPIA)
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
   ESTADO DEL JUEGO
========================= */

const active = new Map();
const lang = new Map();

/* =========================
   HELPERS
========================= */

function getLang(gid) {
  return lang.get(gid) || "English";
}

function setLang(gid, l) {
  lang.set(gid, l);
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

function randomCharacter() {
  return characters[Math.floor(Math.random() * characters.length)];
}

/* =========================
   EMBED SYSTEM FIX FINAL
========================= */

function spawnEmbed(c, l) {
  const t = texts[l] || texts.English;

  return new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle(t.spawn)
    .setDescription(
      `🆔 ${c.code}\n` +
      `⭐ ${c.rarity}\n\n` +
      `💬 Type the name to claim`
    )
    .setImage(c.image ? encodeURI(c.image) : null);
}

/* =========================
   COMMANDS
========================= */

const commands = [
  new SlashCommandBuilder().setName("spawn").setDescription("Spawn character"),
  new SlashCommandBuilder().setName("data_character").setDescription("Owner info")
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
  console.log("Bot online clean version");
});

/* =========================
   COMMANDS LOGIC
========================= */

client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;

  const l = getLang(i.guildId);

  /* SPAWN */
  if (i.commandName === "spawn") {
    if (getActive(i.guildId)) {
      return i.reply({ content: texts[l].already, flags: 64 });
    }

    const c = randomCharacter();
    setActive(i.guildId, c);

    return i.reply({ embeds: [spawnEmbed(c, l)] });
  }

  /* DATA OWNER */
  if (i.commandName === "data_character") {
    if (i.user.id !== OWNER_ID) {
      return i.reply({ content: texts[l].blocked, flags: 64 });
    }

    const c = getActive(i.guildId);

    if (!c) {
      return i.reply({ content: texts[l].noActive, flags: 64 });
    }

    return i.reply({
      content: `CODE: ${c.code}\nNAME: ${c.name}\nRARITY: ${c.rarity}`,
      flags: 64
    });
  }
});

/* =========================
   CLAIM SYSTEM
========================= */

client.on("messageCreate", async m => {
  if (m.author.bot) return;

  const c = getActive(m.guildId);
  if (!c) return;

  if (m.content.toLowerCase().trim() === c.name.toLowerCase()) {
    clearActive(m.guildId);

    const l = getLang(m.guildId);
    const t = texts[l] || texts.English;

    await m.reply(`🏆 ${m.author.username} ${t.claim} ${c.name}`);
  }
});

/* =========================
   LOGIN + SERVER
========================= */

client.login(TOKEN);

http.createServer((req, res) => {
  res.end("OK");
}).listen(process.env.PORT || 3000);
