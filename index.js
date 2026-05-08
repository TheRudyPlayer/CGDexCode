const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder
} = require('discord.js');

const http = require('http');

const TOKEN = process.env.TOKEN;

const CLIENT_ID = '1498803742391406633';
const GUILD_ID = 'TU_GUILD_ID';

// CLIENTE
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// RAREZAS
const rarities = {
  Common: 50,
  Rare: 30,
  Epic: 15,
  Legendary: 5
};

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
    name: 'ChaloApps',
    rarity: 'Common',
    image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png'
  },
  {
    code: '003',
    name: 'Dragon Dude',
    rarity: 'Rare',
    image: 'https://i.postimg.cc/0Q7ymXsg/dragondudeiconlegacy.png'
  },
  {
    code: '004',
    name: 'Mr Meow',
    rarity: 'Rare',
    image: 'https://i.postimg.cc/nrrjGqYM/mrmeowicon.png'
  },
  {
    code: '005',
    name: 'MirtHD',
    rarity: 'Common',
    image: 'https://i.postimg.cc/8PrskpyV/mirthdicon.png'
  },
  {
    code: '006',
    name: 'TheRudyPlayer',
    rarity: 'Common',
    image: 'https://i.postimg.cc/cJdJcQ02/therudyplayericon.png'
  }
];

// RANDOM POR RAREZA
function getRandomCharacter() {

  const total =
    Object.values(rarities)
      .reduce((a, b) => a + b, 0);

  // VERIFICAR 100%
  if (total !== 100) {

    console.log('❌ Las rarezas no suman 100%');

    return null;

  }

  const random =
    Math.random() * 100;

  let cumulative = 0;

  let selectedRarity = null;

  // ELEGIR RAREZA
  for (const rarity in rarities) {

    cumulative += rarities[rarity];

    if (random <= cumulative) {

      selectedRarity = rarity;

      break;

    }

  }

  // FILTRAR PERSONAJES
  const filtered =
    characters.filter(
      c => c.rarity === selectedRarity
    );

  // RANDOM ENTRE ELLOS
  return filtered[
    Math.floor(Math.random() * filtered.length)
  ];

}

// SPAWN ACTIVO
let activeSpawn = null;

// SLASH COMMANDS
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje')
].map(cmd => cmd.toJSON());

// REST
const rest = new REST({ version: '10' }).setToken(TOKEN);

// REGISTRAR COMMANDS
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

// READY
client.once('ready', () => {

  console.log(`✅ Online como ${client.user.tag}`);

});

// /SPAWN
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== 'spawn') return;

  try {

    // YA HAY PERSONAJE
    if (activeSpawn) {

      return interaction.reply({
        content: '❌ Ya hay un personaje activo.',
        ephemeral: true
      });

    }

    // RANDOM
    const random = getRandomCharacter();

    // ERROR
    if (!random) {

      return interaction.reply({
        content: '❌ Error en las rarezas.',
        ephemeral: true
      });

    }

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
      content: '✅',
      ephemeral: true
    });

    // PANEL DEL BOT
    await interaction.channel.send({
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

    // SI NO HAY SPAWN
    if (!activeSpawn) return;

    const userAnswer =
      message.content.toLowerCase().trim();

    const correctAnswer =
      activeSpawn.name.toLowerCase();

    // RESPUESTA CORRECTA
    if (userAnswer === correctAnswer) {

      // GUARDAR
      const claimedCharacter = activeSpawn;

      // ELIMINAR SPAWN
      activeSpawn = null;

      // MENSAJE
      await message.reply(
`🏆 ${message.author.username} reclamó a ${claimedCharacter.name}

🆔 Código: ${claimedCharacter.code}`
      );

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
