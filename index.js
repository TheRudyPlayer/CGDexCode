const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  WebhookClient
} = require('discord.js');

const http = require('http');

const TOKEN = process.env.TOKEN;

const CLIENT_ID = '1498803742391406633';
const GUILD_ID = '1433246929588060432';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1502070557896868011/ge6EuwOXJU8TQp6yNelpq5D7P0QATSiEKZeFBxYgM7dDj8kNvYFcHzakjM0PsAYOzl2H';

// CLIENTE
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// WEBHOOK
const webhook = new WebhookClient({
  url: WEBHOOK_URL
});

// PERSONAJES
const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Common',
    image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png'
  },
  {
    code: '002',
    name: 'Zombie Chicken',
    rarity: 'Rare',
    image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png'
  },
  {
    code: '003',
    name: 'Dragon Dude',
    rarity: 'Rare',
    image: 'https://i.postimg.cc/0Q7ymXsg/dragondudeiconlegacy.png'
  },
];

// SPAWN ACTIVO
let activeSpawn = null;

// COMANDOS
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje')
].map(cmd => cmd.toJSON());

// REGISTRAR COMMANDS
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {

  try {

    console.log('⌛ Registrando Slash Commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash Commands registrados');

  } catch (err) {
    console.error(err);
  }

})();

// BOT ONLINE
client.once('ready', () => {
  console.log(`✅ Online como ${client.user.tag}`);
});

// /SPAWN
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== 'spawn') return;

  try {

    // YA HAY SPAWN
    if (activeSpawn) {

      return interaction.reply({
        content: '❌ Ya hay un personaje activo.',
        ephemeral: true
      });

    }

    // RANDOM
    const random =
      characters[
        Math.floor(Math.random() * characters.length)
      ];

    activeSpawn = random;

    // PANEL
    const embed = new EmbedBuilder()
      .setTitle('✨ Un personaje ha aparecido')
      .setDescription(
`🆔 Código: ${random.code} • ⭐ ${random.rarity}

💬 Responde con el nombre correcto para reclamarlo`
      )
      .setImage(random.image);

    // RESPUESTA INVISIBLE
    await interaction.reply({
      content: '✅ Spawn realizado',
      ephemeral: true
    });

    // WEBHOOK
    await webhook.send({
      username: 'CGDex',
      avatarURL: client.user.displayAvatarURL(),
      embeds: [embed]
    });

  } catch (err) {

    console.error(err);

  }

});

// RECLAMAR
client.on('messageCreate', async message => {

  try {

    if (message.author.bot) return;

    if (!activeSpawn) return;

    const userAnswer =
      message.content.toLowerCase().trim();

    const correctAnswer =
      activeSpawn.name.toLowerCase();

    // RESPUESTA CORRECTA
    if (userAnswer === correctAnswer) {

      await message.reply(
`🏆 ${message.author.username} reclamó a ${activeSpawn.name}

🆔 Código: ${activeSpawn.code}`
      );

      activeSpawn = null;

    }

  } catch (err) {

    console.error(err);

  }

});

// LOGIN
client.login(TOKEN);

// PORT PARA RENDER
http.createServer((req, res) => {

  res.write('CGDex Online');
  res.end();

}).listen(process.env.PORT || 3000);
