const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  AttachmentBuilder,
  MessageFlags
} = require('discord.js');

const http = require('http');
const path = require('path');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1498803742391406633';

const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002'
];

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

function getLang(g) {
  return guildLang.get(g) || 'English';
}

function setLang(g, l) {
  guildLang.set(g, l);
}

/* =========================
   TEXTOS
========================= */
const texts = {
  English: { spawn: "✨ A wild character appeared!", claim: "claimed", already: "Already active" },
  Spanish: { spawn: "✨ ¡Apareció un personaje!", claim: "reclamó a", already: "Ya hay uno activo" },
  Portuguese: { spawn: "✨ Um personagem apareceu!", claim: "reivindicou", already: "Já existe ativo" },
  Russian: { spawn: "✨ Появился персонаж!", claim: "получил", already: "Ya activo" }
};

/* =========================
   PERSONAJES
========================= */
const characters = [
  { code: '001', name: 'Rudy', rarity: 'Common', image: 'rudyicon.png' },
  { code: '003', name: 'Dragon Dude', rarity: 'Epic', image: 'dragondudeiconlegacy.png' },
  { code: '006', name: 'TheRudyPlayer', rarity: 'Common', image: 'therudyplayericon.png' },
  { code: '010', name: 'Spy_Gaming150', rarity: 'Rare', image: 'spygamingicon.png' }
];

/* =========================
   ESTADO
========================= */
let activeSpawn = null;
let lastCode = null;

/* =========================
   RANDOM
========================= */
function getRandomCharacter() {
  const pool = characters.filter(c => c.code !== lastCode);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  lastCode = pick.code;
  return pick;
}

/* =========================
   IMAGEN FIX
========================= */
function getImage(character) {
  const filePath = path.resolve(process.cwd(), 'assets', character.image);

  if (!fs.existsSync(filePath)) {
    console.log("❌ Missing image:", filePath);
    return { files: [], image: null };
  }

  const file = new AttachmentBuilder(filePath);

  return {
    files: [file],
    image: `attachment://${character.image}`
  };
}

/* =========================
   EMBED (SIN NOMBRE)
========================= */
function buildEmbed(character, lang) {
  const t = texts[lang] || texts.English;

  const img = getImage(character);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle(t.spawn)
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n\n` +
      `💬 Guess the character name!`
    )
    .setFooter({ text: "CGDex System" });

  if (img.image) embed.setImage(img.image);

  return { embed, files: img.files };
}

/* =========================
   COMMANDS (FIX ERROR VALIDATOR)
========================= */
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn a random character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific character')
    .addStringOption(option =>
      option
        .setName('codigo')
        .setDescription('Character code') // ✔ FIX CLAVE
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change language')
    .addStringOption(option =>
      option
        .setName('lang')
        .setDescription('Language') // ✔ FIX CLAVE
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
   REGISTER COMMANDS
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
   INTERACTION
========================= */
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  const lang = getLang(i.guildId);
  const t = texts[lang];

  if (activeSpawn) {
    return i.reply({
      content: t.already,
      flags: MessageFlags.Ephemeral
    });
  }

  if (i.commandName === 'spawn') {
    activeSpawn = getRandomCharacter();
  }

  if (i.commandName === 'spawn_character') {
    const code = i.options.getString('codigo');
    activeSpawn = characters.find(c => c.code === code);
  }

  const { embed, files } = buildEmbed(activeSpawn, lang);

  await i.reply({ content: "✅", flags: MessageFlags.Ephemeral });

  await i.channel.send({
    embeds: [embed],
    files
  });
});

/* =========================
   CLAIM SYSTEM
========================= */
client.on('messageCreate', async m => {
  if (m.author.bot || !activeSpawn) return;

  if (m.content.toLowerCase() === activeSpawn.name.toLowerCase()) {
    const t = texts[getLang(m.guildId)];

    const c = activeSpawn;
    activeSpawn = null;

    await m.reply(
      `🏆 ${m.author.username} ${t.claim} ${c.name}`
    );
  }
});

/* =========================
   SERVER
========================= */
client.login(TOKEN);

http.createServer((req, res) => {
  res.end("CGDex Online");
}).listen(process.env.PORT || 3000);
