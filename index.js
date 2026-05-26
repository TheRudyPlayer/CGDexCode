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
   🔥 IMAGEN 100% ESTABLE (FIX REAL)
========================= */
function getImagePayload(character) {
  const filePath = path.join(process.cwd(), 'assets', character.image);

  if (!fs.existsSync(filePath)) {
    console.log("❌ Missing image:", filePath);
    return { embedImage: null, file: null };
  }

  const file = new AttachmentBuilder(filePath, {
    name: character.image
  });

  return {
    embedImage: 'attachment://' + character.image,
    file
  };
}

/* =========================
   EMBED
========================= */
function buildEmbed(character) {
  const img = getImagePayload(character);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle("✨ A wild character appeared!")
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n\n` +
      `💬 Guess the name!`
    );

  if (img.embedImage) {
    embed.setImage(img.embedImage);
  }

  return { embed, file: img.file };
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

  const { embed, file } = buildEmbed(activeSpawn);

  const payload = {
    embeds: [embed]
  };

  if (file) {
    payload.files = [file];
  }

  await i.reply({
    content: "✅",
    flags: MessageFlags.Ephemeral
  });

  await i.channel.send(payload);
});

/* =========================
   CLAIM FIX
========================= */
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!activeSpawn) return;

  const normalize = (t) =>
    t.toLowerCase().trim().replace(/[^a-z0-9]/gi, '');

  if (
    normalize(message.content) === normalize(activeSpawn.name)
  ) {
    const c = activeSpawn;
    activeSpawn = null;

    await message.reply(
      `🏆 ${message.author.username} reclamó a **${c.name}**\n` +
      `🆔 Code: ${c.code}\n` +
      `⭐ Rarity: ${c.rarity}`
    );
  }
});

/* =========================
   LOGIN
========================= */
client.login(TOKEN);

http.createServer((req, res) => {
  res.end("CGDex Online");
}).listen(process.env.PORT || 3000);
