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
   ESTADO
========================= */
let activeSpawn = null;
let lastCode = null;

/* =========================
   PERSONAJES
========================= */
const characters = [
  { code: '001', name: 'Rudy', rarity: 'Common', image: 'rudyicon.png' },
  { code: '006', name: 'TheRudyPlayer', rarity: 'Common', image: 'therudyplayericon.png' },
  { code: '010', name: 'Spy_Gaming150', rarity: 'Rare', image: 'spygamingicon.png' }
];

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
   🔥 FIX REAL DE IMAGEN (IMPORTANTE)
========================= */
function getImageData(character) {
  const filePath = path.resolve(process.cwd(), 'assets', character.image);

  if (!fs.existsSync(filePath)) {
    console.log("❌ Missing image:", filePath);
    return null;
  }

  return {
    filePath,
    fileName: character.image
  };
}

/* =========================
   EMBED SEGURO
========================= */
function buildEmbed(character) {
  const img = getImageData(character);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle("✨ A wild character appeared!")
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n\n` +
      `💬 Guess the name!`
    );

  return { embed, img };
}

/* =========================
   COMMANDS (FIX SAFE)
========================= */
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific')
    .addStringOption(o =>
      o.setName('codigo')
        .setDescription('Character code')
        .setRequired(true)
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
   INTERACTION
========================= */
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  if (activeSpawn) {
    return i.reply({
      content: "Already active",
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

  const { embed, img } = buildEmbed(activeSpawn);

  const payload = {
    embeds: [embed]
  };

  /* =========================
     💥 ESTE ES EL FIX CLAVE
  ========================= */
  if (img) {
    const attachment = new AttachmentBuilder(img.filePath, {
      name: img.fileName
    });

    embed.setImage(`attachment://${img.fileName}`);
    payload.files = [attachment];
  }

  await i.reply({
    content: "✅",
    flags: MessageFlags.Ephemeral
  });

  await i.channel.send(payload);
});

/* =========================
   LOGIN
========================= */
client.login(TOKEN);

http.createServer((req, res) => {
  res.end("CGDex Online");
}).listen(process.env.PORT || 3000);
