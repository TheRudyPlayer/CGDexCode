const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  WebhookClient
} = require('discord.js');

const TOKEN = process.env.TOKEN;

const CLIENT_ID = '1498803742391406633';
const GUILD_ID = '1433246929588060432';

// WEBHOOK
const WEBHOOK_URL = 'TU_WEBHOOK_URL';

const webhook = new WebhookClient({
  url: WEBHOOK_URL
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// PERSONAJES
const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Común',
    image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png'
  },
  {
    code: '002',
    name: 'ChaloApps',
    rarity: 'Común',
    image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png'
  },
  {
    code: '003',
    name: 'Dragon Dude',
    rarity: 'Raro',
    image: 'https://i.postimg.cc/0Q7ymXsg/dragondudeiconlegacy.png'
}
];

let activeSpawn = null;

// SLASH COMMANDS
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).s,
  etToken(TOKEN);

// REGISTRAR COMMANDS
(async () => {
  try {

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Slash Commands listos');

  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`✅ Conectado como ${client.user.tag}`);
});

// SPAWN
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

    const embed = new EmbedBuilder()
      .setTitle('✨ Un personaje ha aparecido')
      .setDescription(
`🆔 Código: ${random.code} • ⭐ ${random.rarity}

💬 Responde con el nombre correcto para reclamarlo`
      )
      .setImage(random.image);

    // RESPUESTA INVISIBLE
    await interaction.reply({
      content: '✅ Personaje spawneado',
      ephemeral: true
    });

    // MENSAJE DEL WEBHOOK
    await webhook.send({
      username: 'CGDex',
      avatarURL: client.user.displayAvatarURL(),
      embeds: [embed]
    });
  }
});

// RECLAMAR
client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (!activeSpawn) return;

  const guess =
    message.content.toLowerCase().trim();

  const answer =
    activeSpawn.name.toLowerCase();

  if (guess === answer) {

    await message.reply(
`🏆 ${message.author} reclamó a ${activeSpawn.name}

🆔 Código: ${activeSpawn.code}`
    );

    activeSpawn = null;
  }
});

client.login(TOKEN);

// PORT PARA RENDER
const http = require('http');

http.createServer((req, res) => {
  res.write('CGDex Online');
  res.end();
}).listen(process.env.PORT || 3000);
