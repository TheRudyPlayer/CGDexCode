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

const CLIENT_ID = 'TU_CLIENT_ID';

// SERVERS
const GUILD_IDS = [
  '1433246929588060432'
];

// TU ID
const OWNER_ID = 'TU_USER_ID';

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
    language: 'Global',
    image: 'https://i.postimg.cc/vB49MTQv/rudyicon.png'
  },
  {
    code: '002',
    name: 'ChaloApps',
    rarity: 'Common',
    language: 'Russian',
    image: 'https://i.postimg.cc/pT594SZJ/chaloappsicon.png'
  },
  {
    code: '003',
    name: 'Dragon Dude',
    rarity: 'Epic',
    language: 'English',
    image: 'https://i.postimg.cc/85KLhQ2n/dragondudeicon.png'
  },
  {
    code: '004',
    name: 'Mr Meow',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/nrrjGqYM/mrmeowicon.png'
  },
  {
    code: '005',
    name: 'MirtHD',
    rarity: 'Common',
    language: 'LATAM',
    image: 'https://i.postimg.cc/hPvhnps0/mirticon.png'
  },
  {
    code: '006',
    name: 'TheRudyPlayer',
    rarity: 'Common',
    language: 'LATAM',
    image: 'https://i.postimg.cc/cJdJcQ02/therudyplayericon.png'
  },
  {
    code: '007',
    name: 'Diego Gormaz',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/2S7PfZR0/diegogormazgamericon.png'
  },
  {
    code: '008',
    name: 'Stiff LXR',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/TY7tjJxy/stifflxricon.png'
  },
  {
    code: '009',
    name: 'JR Crack',
    rarity: 'Legendary',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6qHf0tkJ/jrcrackicon.png'
  },
  {
    code: '010',
    name: 'Spy_Gaming150',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png'
  },
  {
    code: '011',
    name: 'Eitee',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6qdyykdg/eiteeicon.png'
  },
  {
    code: '012',
    name: 'Den19K',
    rarity: 'Legendary',
    language: 'Russian',
    image: 'https://i.postimg.cc/jdtjMk66/den19kicon.png'
  },
  {
    code: '013',
    name: 'Funchik',
    rarity: 'Epic',
    language: 'English',
    image: 'https://i.postimg.cc/pXCL4YkJ/funchikicon.png'
  },
  {
    code: '014',
    name: 'CDN',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/L88RgJLt/cdnicon.png'
  },
  {
    code: '015',
    name: 'Pau Gamer',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/0ySGC8L3/paugamericon.png'
  },
  {
    code: '016',
    name: 'Pizezo',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/j5MyjC7H/pizezoicon.png'
  },
  {
    code: '017',
    name: 'Gallin',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/BvxgJqpm/gallinicon.png'
  },
  {
    code: '018',
    name: 'ElKiwis',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/DwWWrBbS/elkiwisicon.png'
  },
  {
    code: '019',
    name: 'Dun Dun Dun',
    rarity: 'Epic',
    language: 'Global',
    image: 'https://i.postimg.cc/Gtt19GRF/dundundunicon.png'
  },
  {
    code: '020',
    name: 'Khooni Player',
    rarity: 'Rare',
    language: 'English',
    image: 'https://i.postimg.cc/mkJKDn8Z/khooniplayericon.png'
  },
  {
    code: '021',
    name: 'Pedroguimarães90K',
    rarity: 'Admin',
    language: 'Portuguese',
    image: 'https://i.postimg.cc/0yP1JT9q/pedroguimaraes90kicon.png'
  },
  {
    code: '022',
    name: 'Rudy Roblox',
    rarity: 'Common',
    language: 'Global',
    image: 'https://i.postimg.cc/g03hBLfS/rudyrobloxicon.png'
  },
  {
    code: '023',
    name: 'Rudy Plush',
    rarity: 'Rare',
    language: 'Global',
    image: 'https://i.postimg.cc/KYYztkmv/rudyplushicon.png'
  },
  {
    code: '024',
    name: 'GunGun',
    rarity: 'Epic',
    language: 'English',
    image: 'https://i.postimg.cc/7662Pt5K/gungunicon.png'
  },
  {
    code: '025',
    name: 'Vip Gurita',
    rarity: 'Legendary',
    language: 'English',
    image: 'https://i.postimg.cc/9MDkmZKJ/vipguritaicon.png'
  },
  {
    code: '026',
    name: 'Pickle Gameplay',
    rarity: 'Common',
    language: 'LATAM',
    image: 'https://i.postimg.cc/3rsqhL7N/picklegameplayicon.png'
  },
  {
    code: '027',
    name: 'Fessrepanzel',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/vZJTtwdG/fessrepanzelicon.png'
  },
  {
    code: '028',
    name: 'Zombie',
    rarity: 'Admin',
    language: 'Global',
    image: ''
  },
  {
    code: '029',
    name: 'Cerdito Verde',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/J0vbYbnp/cerditoverdeiconlegacy.png'
    }
];

// ÚLTIMO PERSONAJE
let lastCharacterCode = null;

// PERSONAJE ACTIVO
let activeSpawn = null;

// PROBABILIDADES
const rarityChances = {
  Common: 40,
  Rare: 30,
  Epic: 20,
  Legendary: 10
};

// RANDOM
function getRandomCharacter() {

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

  // EVITAR REPETIDOS
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
    ),

  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Muestra datos del personaje activo')

].map(command => command.toJSON());

// REST
const rest =
  new REST({ version: '10' })
    .setToken(TOKEN);

// REGISTRAR COMMANDS
(async () => {

  try {

    for (const guildId of GUILD_IDS) {

      // BORRAR
      await rest.put(
        Routes.applicationGuildCommands(
          CLIENT_ID,
          guildId
        ),
        { body: [] }
      );

      // REGISTRAR
      await rest.put(
        Routes.applicationGuildCommands(
          CLIENT_ID,
          guildId
        ),
        { body: commands }
      );

      console.log(
        `✅ Commands registrados en ${guildId}`
      );

    }

  } catch (err) {

    console.error(err);

  }

})();

// READY
client.once('ready', () => {

  console.log(
    `✅ Online como ${client.user.tag}`
  );

});

// INTERACCIONES
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // SOLO OWNER
  if (
    (
      interaction.commandName ===
      'spawn_character' ||

      interaction.commandName ===
      'data_character'
    ) &&
    interaction.user.id !== OWNER_ID
  ) {

    return interaction.reply({
      content: '❌ No puedes usar este comando.',
      flags: MessageFlags.Ephemeral
    });

  }

  try {

    // DATA CHARACTER
    if (
      interaction.commandName ===
      'data_character'
    ) {

      // NO HAY PERSONAJE
      if (!activeSpawn) {

        return interaction.reply({
          content: '❌ No hay personaje activo.',
          flags: MessageFlags.Ephemeral
        });

      }

      const embed =
        new EmbedBuilder()
          .setTitle('📖 Datos del Personaje')
          .setDescription(
`🆔 Código: ${activeSpawn.code}
👤 Nombre: ${activeSpawn.name}
⭐ Rareza: ${activeSpawn.rarity}
🌎 Idioma: ${activeSpawn.language}`
          );

      // IMAGEN
      if (
        activeSpawn.image &&
        activeSpawn.image.startsWith('http')
      ) {

        embed.setImage(
          activeSpawn.image
        );

      }

      return interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });

    }

    // YA HAY SPAWN
    if (activeSpawn) {

      return interaction.reply({
        content: '❌ Ya hay un personaje activo.',
        flags: MessageFlags.Ephemeral
      });

    }

    let selectedCharacter;

    // SPAWN RANDOM
    if (
      interaction.commandName ===
      'spawn'
    ) {

      selectedCharacter =
        getRandomCharacter();

    }

    // SPAWN CHARACTER
    if (
      interaction.commandName ===
      'spawn_character'
    ) {

      const code =
        interaction.options.getString(
          'codigo'
        );

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

    // EMBED
    const embed =
      new EmbedBuilder()
        .setTitle(
          '✨ Un personaje ha aparecido'
        )
        .setDescription(
`🆔 Código: ${selectedCharacter.code}
⭐ Rareza: ${selectedCharacter.rarity}
🌎 Idioma: ${selectedCharacter.language}

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

    // RESPUESTA
    await interaction.reply({
      content: '✅',
      flags: MessageFlags.Ephemeral
    });

    // ENVIAR PANEL
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

      // ELIMINAR
      activeSpawn = null;

      await message.reply(
`🏆 ${message.author.username} reclamó a ${claimedCharacter.name}

🆔 Código: ${claimedCharacter.code}
⭐ Rareza: ${claimedCharacter.rarity}
🌎 Idioma: ${claimedCharacter.language}`
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
