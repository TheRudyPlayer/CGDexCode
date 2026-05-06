const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = "MTQ5ODgwMzc0MjM5MTQwNjYzMw.G4BJXu.VTeL3IJbFQLIRjJT32B5eXeW2meTr6Uvd-pNM0";
const CLIENT_ID = "TU_CLIENT_ID";
const GUILD_ID = "TU_SERVER_ID";

// personajes posibles
const characters = [
  { name: "Ninja Ruso", code: "001", image: "https://i.imgur.com/xxxxx.png" },
  { name: "Cyber Gato", code: "002", image: "https://i.imgur.com/xxxxx.png" },
  { name: "Soldado Pixel", code: "003", image: "https://i.imgur.com/xxxxx.png" }
];

// personaje activo
let activeCharacter = null;
let claimed = false;

// comando /spawn
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje para reclamar')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
})();

client.on('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'spawn') {
    activeCharacter = characters[Math.floor(Math.random() * characters.length)];
    claimed = false;

    await interaction.reply({
      content: `🚨 Un personaje ha aparecido!\n\n👤 Escribe su nombre para reclamarlo:\n\n🆔 Código: ${activeCharacter.code}`,
    });
  }
});

// detectar mensajes para reclamar
client.on('messageCreate', message => {
  if (!activeCharacter) return;
  if (message.author.bot) return;
  if (claimed) return;

  const input = message.content.trim().toLowerCase();
  const target = activeCharacter.name.toLowerCase();

  if (input === target) {
    claimed = true;

    message.reply(`🎉 ${message.author.username} reclamó a **${activeCharacter.name}** (ID ${activeCharacter.code})`);
  }
});

client.login(TOKEN);
