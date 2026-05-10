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
const GUILD_ID = '1433246929588060432','1490431622930239691','1501669636700373002';

// TU ID
const OWNER_ID = '1458910126168735806';

// CLIENTE
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
    rarity: 'Rare',
    image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png'
  }
];

// ÚLTIMO PERSONAJE
let lastCharacterCode = null;

// PROBABILIDADES
const rarityChances = {
  Common: 40,
  Rare: 30,
  Epic: 20,
  Legendary: 10
};

// RANDOM
function getRandomCharacter() {

  // RANDOM 1-100
  const roll =
    Math.floor(Math.random() * 100) + 1;

  let current = 0;

  let selectedRarity = 'Common';

  // ELEGIR RAREZA
  for (const rarity in rarityChances) {

    current += rarityChances[rarity];

    if (roll <= current) {

      selectedRarity = rarity;

      break;

    }

  }

  // FILTRAR
  let filtered =
    characters.filter(
      character =>
        character.rarity === selectedRarity
    );

  // SI NO HAY
  if (filtered.length === 0) {

    filtered = characters;

  }

  // EVITAR REPETIDO
  filtered =
    filtered.filter(
      character =>
        character.code !== lastCharacterCode
    );

  // SI NO QUEDA NADA
  if (filtered.length === 0) {

    filtered = characters;

  }

  // RANDOM FINAL
  const selectedCharacter =
    filtered[
      Math.floor(
        Math.random() * filtered.length
      )
    ];

  // GUARDAR
  lastCharacterCode =
    selectedCharacter.code;

  return selectedCharacter;

}

// SPAWN ACTIVO
let activeSpawn = null;

// COMANDOS
const commands = [

  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawnea un personaje random'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawnea un personaje específico')
    .addStringOption(option =>
      option
        .setName('codigo')
        .setDescription('Código del personaje')
        .setRequired(true)
    )

].map(command => command.toJSON());

// REST
const rest =
  new REST({ version: '10' })
    .setToken(TOKEN);

// REGISTRAR COMMANDS
(async () => {

  try {

    // BORRAR VIEJOS
    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      { body: [] }
    );

    console.log('🗑️ Commands viejos borrados');

    // REGISTRAR NUEVOS
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

// INTERACCIONES
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // SOLO OWNER
  if (interaction.user.id !== OWNER_ID) {

    return interaction.reply({
      content: '❌ No puedes usar este comando.',
      flags: MessageFlags.Ephemeral
    });

  }

  try {

    // YA HAY SPAWN
    if (activeSpawn) {

      return interaction.reply({
        content: '❌ Ya hay un personaje activo.',
        flags: MessageFlags.Ephemeral
      });

    }

    let selectedCharacter;

    // /SPAWN
    if (interaction.commandName === 'spawn') {

      selectedCharacter =
        getRandomCharacter();

    }

    // /SPAWN_CHARACTER
    if (
      interaction.commandName ===
      'spawn_character'
    ) {

      const code =
        interaction.options.getString('codigo');

      // BUSCAR
      const foundCharacter =
        characters.find(
          character =>
            character.code === code
        );

      // NO EXISTE
      if (!foundCharacter) {

        return interaction.reply({
          content: '❌ Personaje no encontrado.',
          flags: MessageFlags.Ephemeral
        });

      }

      selectedCharacter =
        foundCharacter;

    }

    // GUARDAR
    activeSpawn =
      selectedCharacter;

    // PANEL
    const embed = new EmbedBuilder()
      .setTitle('✨ Un personaje ha aparecido')
      .setDescription(
`🆔 Código: ${selectedCharacter.code}
⭐ Rareza: ${selectedCharacter.rarity}

💬 Responde con el nombre correcto para reclamarlo`
      );

    // IMAGEN
    if (
      selectedCharacter.image &&
      selectedCharacter.image.startsWith('http')
    ) {

      embed.setImage(
        selectedCharacter.image
      );

    }

    // RESPUESTA INVISIBLE
    await interaction.reply({
      content: '✅',
      flags: MessageFlags.Ephemeral
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

// PORT
http.createServer((req, res) => {

  res.write('CGDex Online');
  res.end();

}).listen(process.env.PORT || 3000);
