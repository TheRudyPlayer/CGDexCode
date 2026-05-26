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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* =========================
   RUDY
========================= */
const rudy = {
  code: '006',
  name: 'Rudy',
  rarity: 'Common',
  image: 'https://i.postimg.cc/cJdJcQ02/therudyplayericon.png'
};

/* =========================
   ACTIVE SPAWN
========================= */
let activeSpawn = null;

/* =========================
   EMBED BUILDER + CONSOLE
========================= */
function buildEmbed() {

  console.log("🧪 IMAGE URL RAW:", rudy.image);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle("✨ Un personaje ha aparecido")
    .setDescription(
      `🆔 Código: ${rudy.code}\n` +
      `⭐ Rareza: ${rudy.rarity}\n\n` +
      `💬 Adivina el nombre`
    )
    .setImage(rudy.image);

  console.log("🧪 EMBED IMAGE OBJECT:", embed.data.image);

  return embed;
}

/* =========================
   COMMANDS
========================= */
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea a Rudy')
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
   READY
========================= */
client.once('ready', () => {
  console.log(`✅ Online como ${client.user.tag}`);
});

/* =========================
   INTERACTION
========================= */
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    activeSpawn = rudy;

    const embed = buildEmbed();

    await interaction.reply({
      content: "✅ Spawned",
      flags: MessageFlags.Ephemeral
    });

    await interaction.channel.send({
      embeds: [embed]
    });

  } catch (err) {
    console.error("❌ ERROR SPAWN:", err);
  }
});

/* =========================
   CLAIM SYSTEM
========================= */
client.on('messageCreate', async message => {
  if (message.author.bot || !activeSpawn) return;

  const input = message.content.toLowerCase().trim();
  const target = rudy.name.toLowerCase();

  if (input === target) {

    const c = activeSpawn;
    activeSpawn = null;

    await message.reply(
      `🏆 ${message.author.username} reclamó a **${c.name}**\n` +
      `🆔 Código: ${c.code}\n` +
      `⭐ Rareza: ${c.rarity}`
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
http.createServer((req, res) => {
  res.end("CGDex Online");
}).listen(process.env.PORT || 3000);
