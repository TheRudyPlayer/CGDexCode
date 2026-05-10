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
const GUILD_ID = '1433246929588060432','1501669636700373002';

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
  },
  {
    code: '007',
    name: 'Diego Gormaz',
    rarity: 'Epic',
    image: 'https://i.postimg.cc/2S7PfZR0/diegogormazgamericon.png'
  },
  {
    code: '008',
    name: 'Stiff LXR',
    rarity: 'Epic',
    image: 'https://i.postimg.cc/TY7tjJxy/stifflxricon.png'
  },
  {
    code: '009',
    name: 'JR Crack',
    rarity: 'Epic',
    image: 'https://i.postimg.cc/6qHf0tkJ/jrcrackicon.png'
  },
  {
    code: '010',
    name: 'Spy_Gaming150',
    rarity: 'Common',
    image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png'
  }
];

// RANDOM POR RAREZA
function getRandomCharacter() {

  const rarityList = [];

  // CREA LISTA SEGÚN %
  for (const rarity in rarities) {

    const amount = rarities[rarity];

    for (let i = 0; i < amount; i++) {

      rarityList.push(rarity);

    }

  }

  // RANDOM DE RAREZA
  const selectedRarity =
    rarityList[
      Math.floor(Math.random() * rarityList.length)
    ];

  // PERSONAJES DE ESA RAREZA
  const rarityCharacters =
    characters.filter(
      character =>
        character.rarity === selectedRarity
    );

  // SI NO HAY PERSONAJES
  if (rarityCharacters.length === 0) {

    // DEVUELVE CUALQUIERA
    return characters[
      Math.floor(Math.random() * characters.length)
    ];

  }

  // RANDOM ENTRE ELLOS
  return rarityCharacters[
    Math.floor(
      Math.random() * rarityCharacters.length
    )
  ];

}

// SPAWN ACTIVO
let activeSpawn = null;

// COMANDOS
const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje')
].map(command => command.toJSON());

// REST
const rest =
  new REST({ version: '10' })
    .setToken(TOKEN);

// REGISTRAR COMMANDS
(async () => {

  try {

    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Commands registrados');

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

    // YA HAY SPAWN
    if (activeSpawn) {

      return interaction.reply({
        content: '❌ Ya hay un personaje activo.',
        ephemeral: true
      });

    }

    // RANDOM
    const random = getRandomCharacter();

    // GUARDAR
    activeSpawn = random;

    // PANEL
    const embed = new EmbedBuilder()
      .setTitle('✨ Un personaje ha aparecido')
      .setDescription(
`🆔 Código: ${random.code}
⭐ Rareza: ${random.rarity}

💬 Responde con el nombre correcto para reclamarlo`
      );

    // IMAGEN
    if (
      random.image &&
      random.image.startsWith('http')
    ) {

      embed.setImage(random.image);

    }

    // RESPUESTA INVISIBLE
    await interaction.reply({
      content: '✅',
      ephemeral: true
    });

    // PANEL
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

    if (!activeSpawn) return;

    const userAnswer =
      message.content.toLowerCase().trim();

    const correctAnswer =
      activeSpawn.name.toLowerCase();

    // CORRECTO
    if (userAnswer === correctAnswer) {

      const claimedCharacter =
        activeSpawn;

      // ELIMINAR SPAWN
      activeSpawn = null;

      await message.reply(
`🏆 ${message.author.username} reclamó a ${claimedCharacter.name}

🆔 Código: ${claimedCharacter.code}
⭐ Rareza: ${claimedCharacter.rarity}`
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
