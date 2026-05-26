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

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1498803742391406633';

const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002'
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
   IDIOMAS
========================= */
const guildLang = new Map();

const texts = {
  English: {
    spawn: "✨ A wild character appeared!",
    claim: "claimed",
    noActive: "No active character",
    already: "Already active character"
  },
  Spanish: {
    spawn: "✨ ¡Apareció un personaje salvaje!",
    claim: "reclamó a",
    noActive: "No hay personaje activo",
    already: "Ya hay un personaje activo"
  },
  Portuguese: {
    spawn: "✨ Um personagem apareceu!",
    claim: "reivindicou",
    noActive: "Nenhum personagem ativo",
    already: "Já existe um personagem ativo"
  },
  Russian: {
    spawn: "✨ Появился персонаж!",
    claim: "получил",
    noActive: "Нет активного персонажа",
    already: "Уже есть активный персонаж"
  }
};

function getLang(gid) {
  return guildLang.get(gid) || 'English';
}

function setLang(gid, lang) {
  guildLang.set(gid, lang);
}

/* =========================
   PERSONAJES (SIN CAMBIOS)
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
let lastCharacterCode = null;

/* =========================
   RANDOM (igual lógica)
========================= */
function getRandomCharacter() {
  const list = characters.filter(c => c.code !== lastCharacterCode);
  const pick = list[Math.floor(Math.random() * list.length)];
  lastCharacterCode = pick.code;
  return pick;
}

/* =========================
   EMBED BONITO
========================= */
async function buildEmbed(character, lang) {
  const t = texts[lang] || texts.English;

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle(t.spawn)
    .setDescription(
      `🎮 **${character.name}**\n` +
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n\n` +
      `💬 Type the name to claim it`
    )
    .setFooter({ text: "CGDex System" });

  const filePath = path.join(__dirname, 'assets', character.image);

  const file = new AttachmentBuilder(filePath);

  embed.setImage(`attachment://${character.image}`);

  return { embed, file };
}

/* =========================
   COMMANDS
========================= */
const commands = [
  new SlashCommandBuilder().setName('spawn').setDescription('Spawn character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific character')
    .addStringOption(o =>
      o.setName('codigo').setDescription('Code').setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Set language')
    .addStringOption(o =>
      o.setName('lang')
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
  console.log(`✅ Online as ${client.user.tag}`);
});

/* =========================
   INTERACTION
========================= */
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  const lang = getLang(i.guildId);
  const t = texts[lang];

  if (i.commandName === 'language') {
    const l = i.options.getString('lang');
    setLang(i.guildId, l);

    return i.reply({
      content: `🌍 Language set to ${l}`,
      flags: MessageFlags.Ephemeral
    });
  }

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

  const { embed, file } = await buildEmbed(activeSpawn, lang);

  await i.reply({ content: "🎯 Spawned!", flags: MessageFlags.Ephemeral });

  await i.channel.send({
    embeds: [embed],
    files: [file]
  });
});

/* =========================
   CLAIM
========================= */
client.on('messageCreate', async m => {
  if (m.author.bot) return;
  if (!activeSpawn) return;

  if (m.content.toLowerCase() === activeSpawn.name.toLowerCase()) {
    const t = texts[getLang(m.guildId)];

    const c = activeSpawn;
    activeSpawn = null;

    await m.reply(
      `🏆 **${m.author.username}** ${t.claim} **${c.name}**\n` +
      `⭐ ${c.rarity}`
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
