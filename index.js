const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes
} = require('discord.js');

const TOKEN = process.env.TOKEN;

// ID de aplicación
const CLIENT_ID = '1498803742391406633';

// ID de servidor
const GUILD_ID = '1433246929588060432';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Personajes
const characters = [
  {
    code: '001',
    name: 'Rudy',
    image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png'
  },
  {
    code: '002',
    name: 'ChaloApps',
    image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png'
  }
];

// Spawn activo
let activeSpawn = null;

// Base de datos simple
const claimed = {};

const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje')
].map(command => command.toJSON());

// Registrar slash command
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Slash command registrado');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`✅ Conectado como ${client.user.tag}`);
});

// Comando /spawn
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'spawn') {

    if (activeSpawn) {
      return interaction.reply({
        content: '❌ Ya hay un personaje activo.',
        ephemeral: true
      });
    }

    const random =
      characters[Math.floor(Math.random() * characters.length)];

    activeSpawn = random;

    await interaction.reply({
      content:
`🎉 ¡Un personaje apareció!

🆔 Código: ${random.code}

💬 Responde con el nombre correcto para reclamarlo.`,
    });

    await interaction.channel.send(random.image);
  }
});

// Reclamar personaje
client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (!activeSpawn) return;

  const guess = message.content.toLowerCase().trim();
  const answer = activeSpawn.name.toLowerCase();

  if (guess === answer) {

    if (!claimed[message.author.id]) {
      claimed[message.author.id] = [];
    }

    claimed[message.author.id].push(activeSpawn);

    await message.reply(
`🏆 ¡Reclamaste a ${activeSpawn.name}!

🆔 Código: ${activeSpawn.code}`
    );

    activeSpawn = null;
  }
});

client.login(TOKEN);
