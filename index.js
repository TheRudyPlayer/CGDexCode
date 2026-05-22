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

// Si después quieres más servers, añade sus IDs aquí.
const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002',
  '1311142612555661402'
];

const OWNER_ID = '1458910126168735806';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const texts = {
  English: {
    commandBlocked: '❌ You cannot use this command.',
    activeCharacter: '❌ There is already an active character.',
    notFound: '❌ Character not found.',
    noCharacter: '❌ There is no active character.',
    spawnedTitle: '✨ A character has appeared',
    guessText: '💬 Reply with the correct name to claim it',
    dataTitle: '📖 Character Data',
    languageChanged: '✅ Language changed to English',
    claimed: 'claimed'
  },
  Spanish: {
    commandBlocked: '❌ No puedes usar este comando.',
    activeCharacter: '❌ Ya hay un personaje activo.',
    notFound: '❌ Personaje no encontrado.',
    noCharacter: '❌ No hay personaje activo.',
    spawnedTitle: '✨ Un personaje ha aparecido',
    guessText: '💬 Responde con el nombre correcto para reclamarlo',
    dataTitle: '📖 Datos del Personaje',
    languageChanged: '✅ Idioma cambiado a Español',
    claimed: 'reclamó a'
  },
  Portuguese: {
    commandBlocked: '❌ Você não pode usar este comando.',
    activeCharacter: '❌ Já existe um personagem ativo.',
    notFound: '❌ Personagem não encontrado.',
    noCharacter: '❌ Não há personagem ativo.',
    spawnedTitle: '✨ Um personagem apareceu',
    guessText: '💬 Responda com o nome correto para reivindicá-lo',
    dataTitle: '📖 Dados do Personagem',
    languageChanged: '✅ Idioma alterado para Português',
    claimed: 'reivindicou'
  },
  Russian: {
    commandBlocked: '❌ Вы не можете использовать эту команду.',
    activeCharacter: '❌ Уже есть активный персонаж.',
    notFound: '❌ Персонаж не найден.',
    noCharacter: '❌ Нет активного персонажа.',
    spawnedTitle: '✨ Появился персонаж',
    guessText: '💬 Ответьте правильным именем, чтобы получить его',
    dataTitle: '📖 Информация о персонаже',
    languageChanged: '✅ Язык изменен на Russian',
    claimed: 'получил'
  }
};

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

const rarityChances = {
  Common: 40,
  Rare: 30,
  Epic: 20,
  Legendary: 10
};

const activeSpawns = new Map();      // guildId -> character
const lastCharacterCodes = new Map(); // guildId -> last code
const guildLanguages = new Map();     // guildId -> English / Spanish / Portuguese / Russian

function getGuildLanguage(guildId) {
  return guildLanguages.get(guildId) || 'English';
}

function setGuildLanguage(guildId, language) {
  guildLanguages.set(guildId, language);
}

function getActiveSpawn(guildId) {
  return activeSpawns.get(guildId) || null;
}

function setActiveSpawn(guildId, character) {
  activeSpawns.set(guildId, character);
}

function clearActiveSpawn(guildId) {
  activeSpawns.delete(guildId);
}

function getLastCharacterCode(guildId) {
  return lastCharacterCodes.get(guildId) || null;
}

function setLastCharacterCode(guildId, code) {
  lastCharacterCodes.set(guildId, code);
}

function normalizeImage(url) {
  if (typeof url !== 'string') return '';
  return url.trim();
}

function getRandomCharacter(guildId) {
  const roll = Math.floor(Math.random() * 100) + 1;

  let current = 0;
  let selectedRarity = 'Common';

  for (const rarity in rarityChances) {
    current += rarityChances[rarity];
    if (roll <= current) {
      selectedRarity = rarity;
      break;
    }
  }

  let filtered = characters.filter(
    character => character.rarity === selectedRarity
  );

  if (filtered.length === 0) {
    filtered = characters;
  }

  const lastCode = getLastCharacterCode(guildId);

  let available = filtered.filter(
    character => character.code !== lastCode
  );

  if (available.length === 0) {
    available = characters.filter(
      character => character.code !== lastCode
    );
  }

  if (available.length === 0) {
    available = characters;
  }

  const selectedCharacter =
    available[Math.floor(Math.random() * available.length)];

  setLastCharacterCode(guildId, selectedCharacter.code);

  return selectedCharacter;
}

function buildSpawnEmbed(character, language) {
  const t = texts[language] || texts.English;

  const embed = new EmbedBuilder()
    .setTitle(t.spawnedTitle)
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `⭐ Rarity: ${character.rarity}\n` +
      `🌎 Language: ${character.language}\n\n` +
      `${t.guessText}`
    );

  const img = normalizeImage(character.image);
  if (img) {
    embed.setImage(img);
  }

  return embed;
}

function buildDataEmbed(character, language) {
  const t = texts[language] || texts.English;

  const embed = new EmbedBuilder()
    .setTitle(t.dataTitle)
    .setDescription(
      `🆔 Code: ${character.code}\n` +
      `👤 Name: ${character.name}\n` +
      `⭐ Rarity: ${character.rarity}\n` +
      `🌎 Language: ${character.language}`
    );

  const img = normalizeImage(character.image);
  if (img) {
    embed.setImage(img);
  }

  return embed;
}

const commands = [
  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn a random character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn a specific character')
    .addStringOption(option =>
      option
        .setName('codigo')
        .setDescription('Character code')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Show the active character data'),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the bot language')
    .addStringOption(option =>
      option
        .setName('idioma')
        .setDescription('Language')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'English' },
          { name: 'Spanish', value: 'Spanish' },
          { name: 'Portuguese', value: 'Portuguese' },
          { name: 'Russian', value: 'Russian' }
        )
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    for (const guildId of GUILD_IDS) {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guildId),
        { body: [] }
      );

      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guildId),
        { body: commands }
      );

      console.log(`✅ Commands registered in ${guildId}`);
    }
  } catch (err) {
    console.error(err);
  }
})();

client.once('ready', () => {
  console.log(`✅ Online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const guildId = interaction.guildId;
  if (!guildId) return;

  const language = getGuildLanguage(guildId);
  const t = texts[language] || texts.English;

  try {
    if (interaction.commandName === 'language') {
      const newLanguage = interaction.options.getString('idioma');
      setGuildLanguage(guildId, newLanguage);

      return interaction.reply({
        content: texts[newLanguage].languageChanged,
        ephemeral: true
      });
    }

    if (
      (interaction.commandName === 'spawn_character' ||
       interaction.commandName === 'data_character') &&
      interaction.user.id !== OWNER_ID
    ) {
      return interaction.reply({
        content: t.commandBlocked,
        ephemeral: true
      });
    }

    if (interaction.commandName === 'data_character') {
      const activeSpawn = getActiveSpawn(guildId);

      if (!activeSpawn) {
        return interaction.reply({
          content: t.noCharacter,
          ephemeral: true
        });
      }

      const embed = buildDataEmbed(activeSpawn, language);

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    if (interaction.commandName === 'spawn' || interaction.commandName === 'spawn_character') {
      const activeSpawn = getActiveSpawn(guildId);

      if (activeSpawn) {
        return interaction.reply({
          content: t.activeCharacter,
          ephemeral: true
        });
      }

      let selectedCharacter = null;

      if (interaction.commandName === 'spawn') {
        selectedCharacter = getRandomCharacter(guildId);
      }

      if (interaction.commandName === 'spawn_character') {
        const code = interaction.options.getString('codigo');

        const foundCharacter = characters.find(
          character => character.code === code
        );

        if (!foundCharacter) {
          return interaction.reply({
            content: t.notFound,
            ephemeral: true
          });
        }

        selectedCharacter = foundCharacter;
        setLastCharacterCode(guildId, selectedCharacter.code);
      }

      setActiveSpawn(guildId, selectedCharacter);

      const embed = buildSpawnEmbed(selectedCharacter, language);

      await interaction.reply({
        content: '✅',
        ephemeral: true
      });

      await interaction.channel.send({
        embeds: [embed]
      });

      return;
    }
  } catch (err) {
    console.error(err);
  }
});

client.on('messageCreate', async message => {
  try {
    if (message.author.bot) return;
    if (!message.guildId) return;

    const activeSpawn = getActiveSpawn(message.guildId);
    if (!activeSpawn) return;

    const userAnswer = message.content.toLowerCase().trim();
    const correctAnswer = activeSpawn.name.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      const claimedCharacter = activeSpawn;
      clearActiveSpawn(message.guildId);

      const language = getGuildLanguage(message.guildId);
      const t = texts[language] || texts.English;

      await message.reply(
        `🏆 ${message.author.username} ${t.claimed} ${claimedCharacter.name}\n\n` +
        `🆔 Code: ${claimedCharacter.code}\n` +
        `⭐ Rarity: ${claimedCharacter.rarity}\n` +
        `🌎 Language: ${claimedCharacter.language}`
      );
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);

http.createServer((req, res) => {
  res.write('CGDex Online');
  res.end();
}).listen(process.env.PORT || 3000);
