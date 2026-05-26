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
   PERSONAJES (ASSETS)
========================= */
const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Common',
    image: 'rudyicon.png'
  },
  {
    code: '006',
    name: 'TheRudyPlayer',
    rarity: 'Common',
    image: 'therudyplayericon.png'
  },
  {
    code: '010',
    name: 'Spy_Gaming150',
    rarity: 'Rare',
    image: 'spygamingicon.png'
  }
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
   🔥 IMAGEN SEGURA (FIX REAL)
========================= */
function getImage(character) {
  const filePath = path.join(process.cwd(), 'assets', character.image);

  // ❌ si no existe NO rompe nada
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Image missing: ${character.image}`);
    return null;
  }

  return new AttachmentBuilder(filePath, {
    name: character.image
  });
}

/* =========================
   EMBED BUILDER
========================= */
function buildEmbed(character) {
  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle("✨ A wild character appeared!")
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n\n` +
      `💬 Guess the name!`
    );

  const file = getImage(character);

  // ✔ solo agrega imagen si existe
  if (file) {
    embed.setImage(`attachment://${character.image}`);
  }

  return { embed, file };
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
      content: "❌ Already active",
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

  const payload = { embeds: [embed] };

  // 💥 SOLO SI EXISTE
  if (file) {
    payload.files = [file];
  }

  await i.reply({
    content: "✅ Spawned",
    flags: MessageFlags.Ephemeral
  });

  await i.channel.send(payload);
});

/* =========================
   CLAIM
========================= */
client.on('messageCreate', async message => {
  if (message.author.bot || !activeSpawn) return;

  const norm = (t) =>
    t.toLowerCase().trim().replace(/[^a-z0-9]/gi, '');

  if (norm(message.content) === norm(activeSpawn.name)) {
    const c = activeSpawn;
    activeSpawn = null;

    await message.reply(
      `🏆 ${message.author.username} claimed **${c.name}**\n` +
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
