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
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TOKEN;

const CLIENT_ID = '1498803742391406633';

// SERVERS
const GUILD_IDS = [
  '1433246929588060432',
  '1490431622930239691',
  '1501669636700373002',
  '1311142612555661402'
];

// OWNER
const OWNER_ID = '1458910126168735806';

// CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// LANGUAGE
let botLanguage = 'English';

// INVENTORY FILE
const INVENTORY_FILE = path.join(
  __dirname,
  'inventories.json'
);

// LOAD INVENTORY
let inventories = {};
let inventorySettings = {};

function loadInventories() {

  try {

    if (!fs.existsSync(INVENTORY_FILE)) {

      fs.writeFileSync(
        INVENTORY_FILE,
        JSON.stringify({
          inventories: {},
          settings: {}
        }, null, 2)
      );

    }

    const data = JSON.parse(
      fs.readFileSync(INVENTORY_FILE, 'utf8')
    );

    inventories = data.inventories || {};
    inventorySettings = data.settings || {};

  } catch (err) {

    console.error(err);

  }

}

function saveInventories() {

  try {

    fs.writeFileSync(
      INVENTORY_FILE,
      JSON.stringify({
        inventories,
        settings: inventorySettings
      }, null, 2)
    );

  } catch (err) {

    console.error(err);

  }

}

loadInventories();

// TEXTS
const texts = {

  English: {
    spawned: '✨ A character has appeared',
    guess: '💬 Reply with the correct name to claim it',
    active: '❌ There is already an active character.',
    noPermission: '❌ You cannot use this command.',
    notFound: '❌ Character not found.',
    noCharacter: '❌ There is no active character.',
    claimed: 'claimed',
    data: '📖 Character Data',
    languageChanged: '✅ Language changed to English',
    inventory: '📦 Inventory',
    inventoryEmpty: '❌ Empty inventory.',
    inventoryPrivate: '❌ This inventory is private.',
    inventoryConfig: '✅ Inventory updated.',
    gifted: '🎁 Character gifted successfully.',
    giftFail: '❌ You do not own this character.'
  },

  Spanish: {
    spawned: '✨ Un personaje ha aparecido',
    guess: '💬 Responde con el nombre correcto para reclamarlo',
    active: '❌ Ya hay un personaje activo.',
    noPermission: '❌ No puedes usar este comando.',
    notFound: '❌ Personaje no encontrado.',
    noCharacter: '❌ No hay personaje activo.',
    claimed: 'reclamó a',
    data: '📖 Datos del Personaje',
    languageChanged: '✅ Idioma cambiado a Español',
    inventory: '📦 Inventario',
    inventoryEmpty: '❌ Inventario vacío.',
    inventoryPrivate: '❌ Este inventario es privado.',
    inventoryConfig: '✅ Inventario actualizado.',
    gifted: '🎁 Personaje regalado correctamente.',
    giftFail: '❌ No tienes este personaje.'
  },

  Portuguese: {
    spawned: '✨ Um personagem apareceu',
    guess: '💬 Responda com o nome correto para reivindicá-lo',
    active: '❌ Já existe um personagem ativo.',
    noPermission: '❌ Você não pode usar este comando.',
    notFound: '❌ Personagem não encontrado.',
    noCharacter: '❌ Não há personagem ativo.',
    claimed: 'reivindicou',
    data: '📖 Dados do Personagem',
    languageChanged: '✅ Idioma alterado para Português',
    inventory: '📦 Inventário',
    inventoryEmpty: '❌ Inventário vazio.',
    inventoryPrivate: '❌ Este inventário é privado.',
    inventoryConfig: '✅ Inventário atualizado.',
    gifted: '🎁 Personagem enviado.',
    giftFail: '❌ Você não possui esse personagem.'
  },

  Russian: {
    spawned: '✨ Появился персонаж',
    guess: '💬 Ответьте правильным именем, чтобы получить его',
    active: '❌ Уже есть активный персонаж.',
    noPermission: '❌ Вы не можете использовать эту команду.',
    notFound: '❌ Персонаж не найден.',
    noCharacter: '❌ Нет активного персонажа.',
    claimed: 'получил',
    data: '📖 Информация о персонаже',
    languageChanged: '✅ Язык изменен на русский',
    inventory: '📦 Инвентарь',
    inventoryEmpty: '❌ Пустой инвентарь.',
    inventoryPrivate: '❌ Инвентарь приватный.',
    inventoryConfig: '✅ Инвентарь обновлен.',
    gifted: '🎁 Персонаж подарен.',
    giftFail: '❌ У вас нет этого персонажа.'
  }

};

// CHARACTERS
const characters = [
  {
    code: '001',
    name: 'Rudy',
    rarity: 'Common',
    language: 'Global',
    image: 'https://i.postimg.cc/TwxJ164Q/rudyicon.png'
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
    name: 'Diego Gormaz Gamer',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/2S7PfZR0/diegogormazgamericon.png'
  },
  {
    code: '008',
    name: 'Stiff LXR',
    rarity: 'Epic',
    language: 'LATAM',
    image: 'https://i.postimg.cc/dtw9XRYD/stifflxricon.png'
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
    name: 'Zhura24K',
    rarity: 'Rare',
    language: 'Ukrainian',
    image: 'https://i.postimg.cc/4d0rP8Mq/zhura24kicon.png'
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
    language: 'Ukrainian',
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
  },
  {
    code: '030',
    name: 'Spy_Gaming150',
    rarity: 'Rare',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png'
  },
  {
    code: '031',
    name: 'Lary Hacker',
    rarity: 'Epic',
    language: 'Global',
    image: 'https://i.postimg.cc/brWpGYpS/laryhackericon.webp'
  }
];

// LAST
let lastCharacterCode = null;

// ACTIVE
let activeSpawn = null;

// RARITY
const rarityChances = {
  Common: 70,
  Rare: 20,
  Epic: 9,
  Legendary: 1
};

// RANDOM
function getRandomCharacter() {

  const roll =
    Math.floor(Math.random() * 100) + 1;

  let current = 0;

  let selectedRarity = 'Common';

  for (const rarity in rarityChances) {

    current += rarityChances[rarity];

    if (roll <= current) {

      selectedRarity = rarity;
      break;

    }

  }

  let filtered =
    characters.filter(
      character =>
        character.rarity === selectedRarity
    );

  if (filtered.length === 0) {

    filtered = characters;

  }

  filtered =
    filtered.filter(
      character =>
        character.code !== lastCharacterCode
    );

  if (filtered.length === 0) {

    filtered = characters;

  }

  const selectedCharacter =
    filtered[
      Math.floor(
        Math.random() * filtered.length
      )
    ];

  lastCharacterCode =
    selectedCharacter.code;

  return selectedCharacter;

}

// INVENTORY HELPERS
function addCharacterToInventory(userId, character) {

  if (!inventories[userId]) {

    inventories[userId] = [];

  }

  inventories[userId].push(character);

  saveInventories();

}

function getInventory(userId) {

  if (!inventories[userId]) {

    inventories[userId] = [];

  }

  return inventories[userId];

}

// COMMANDS
const commands = [

  new SlashCommandBuilder()
    .setName('spawn')
    .setDescription('Spawn random character'),

  new SlashCommandBuilder()
    .setName('spawn_character')
    .setDescription('Spawn specific character')
    .addStringOption(option =>
      option
        .setName('codigo')
        .setDescription('Character code')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('data_character')
    .setDescription('Character data'),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change bot language')
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
    ),

  new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View inventory')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User inventory')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('inventory_config')
    .setDescription('Inventory settings')
    .addStringOption(option =>
      option
        .setName('visibility')
        .setDescription('Visible or Private')
        .setRequired(true)
        .addChoices(
          { name: 'Visible', value: 'Visible' },
          { name: 'Private', value: 'Private' }
        )
    ),

  new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift character')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Gift user')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Character code')
        .setRequired(true)
    )

].map(command => command.toJSON());

// REST
const rest =
  new REST({ version: '10' })
    .setToken(TOKEN);

// REGISTER
(async () => {

  try {

    for (const guildId of GUILD_IDS) {

      await rest.put(
        Routes.applicationGuildCommands(
          CLIENT_ID,
          guildId
        ),
        { body: commands }
      );

    }

    console.log('✅ Commands registered');

  } catch (err) {

    console.error(err);

  }

})();

// READY
client.once('ready', () => {

  console.log(
    `✅ Online as ${client.user.tag}`
  );

});

// INTERACTION
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const t = texts[botLanguage];

  try {

    // LANGUAGE
    if (
      interaction.commandName ===
      'language'
    ) {

      botLanguage =
        interaction.options.getString(
          'idioma'
        );

      return interaction.reply({
        content:
          texts[botLanguage]
            .languageChanged,
        flags: MessageFlags.Ephemeral
      });

    }

    // INVENTORY CONFIG
    if (
      interaction.commandName ===
      'inventory_config'
    ) {

      const visibility =
        interaction.options.getString(
          'visibility'
        );

      inventorySettings[
        interaction.user.id
      ] = visibility;

      saveInventories();

      return interaction.reply({
        content: t.inventoryConfig,
        flags: MessageFlags.Ephemeral
      });

    }

    // INVENTORY
    if (
      interaction.commandName ===
      'inventory'
    ) {

      const target =
        interaction.options.getUser('user') ||
        interaction.user;

      const visibility =
        inventorySettings[target.id] ||
        'Visible';

      if (
        visibility === 'Private' &&
        target.id !== interaction.user.id
      ) {

        return interaction.reply({
          content: t.inventoryPrivate,
          flags: MessageFlags.Ephemeral
        });

      }

      const inventory =
        getInventory(target.id);

      if (inventory.length === 0) {

        return interaction.reply({
          content: t.inventoryEmpty,
          flags: MessageFlags.Ephemeral
        });

      }

      const inventoryText =
        inventory.map(character =>
`🆔 ${character.code} • ${character.name} • ${character.rarity}`
        ).join('\n');

      const embed =
        new EmbedBuilder()
          .setTitle(
            `${target.username} ${t.inventory}`
          )
          .setDescription(
            inventoryText
          );

      return interaction.reply({
        embeds: [embed]
      });

    }

    // GIFT
    if (
      interaction.commandName ===
      'gift'
    ) {

      const target =
        interaction.options.getUser(
          'user'
        );

      const code =
        interaction.options.getString(
          'code'
        );

      const inventory =
        getInventory(
          interaction.user.id
        );

      const characterIndex =
        inventory.findIndex(
          character =>
            character.code === code
        );

      if (characterIndex === -1) {

        return interaction.reply({
          content: t.giftFail,
          flags: MessageFlags.Ephemeral
        });

      }

      const giftedCharacter =
        inventory.splice(
          characterIndex,
          1
        )[0];

      if (!inventories[target.id]) {

        inventories[target.id] = [];

      }

      inventories[target.id]
        .push(giftedCharacter);

      saveInventories();

      return interaction.reply({
        content:
`${t.gifted}

🎁 ${giftedCharacter.name}
➡️ ${target.username}`
      });

    }

    // OWNER
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
        content: t.noPermission,
        flags: MessageFlags.Ephemeral
      });

    }

    // DATA
    if (
      interaction.commandName ===
      'data_character'
    ) {

      if (!activeSpawn) {

        return interaction.reply({
          content: t.noCharacter,
          flags: MessageFlags.Ephemeral
        });

      }

      const embed =
        new EmbedBuilder()
          .setTitle(t.data)
          .setDescription(
`🆔 Code: ${activeSpawn.code}
👤 Name: ${activeSpawn.name}
⭐ Rarity: ${activeSpawn.rarity}
🌎 Language: ${activeSpawn.language}`
          );

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

    // ACTIVE
    if (activeSpawn) {

      return interaction.reply({
        content: t.active,
        flags: MessageFlags.Ephemeral
      });

    }

    let selectedCharacter;

    // SPAWN
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

      if (!foundCharacter) {

        return interaction.reply({
          content: t.notFound,
          flags: MessageFlags.Ephemeral
        });

      }

      selectedCharacter =
        foundCharacter;

    }

    activeSpawn =
      selectedCharacter;

    const embed =
      new EmbedBuilder()
        .setTitle(t.spawned)
        .setDescription(
`🆔 Code: ${selectedCharacter.code}
⭐ Rarity: ${selectedCharacter.rarity}
🌎 Language: ${selectedCharacter.language}

${t.guess}`
        );

    if (
      selectedCharacter.image &&
      selectedCharacter.image.startsWith('http')
    ) {

      embed.setImage(
        selectedCharacter.image
      );

    }

    await interaction.reply({
      content: '✅',
      flags: MessageFlags.Ephemeral
    });

    await interaction.channel.send({
      embeds: [embed]
    });

  } catch (err) {

    console.error(err);

  }

});

// CLAIM
client.on('messageCreate', async message => {

  try {

    if (message.author.bot) return;

    if (!activeSpawn) return;

    const t = texts[botLanguage];

    const userAnswer =
      message.content.toLowerCase().trim();

    const correctAnswer =
      activeSpawn.name.toLowerCase();

    if (userAnswer === correctAnswer) {

      const claimedCharacter =
        activeSpawn;

      addCharacterToInventory(
        message.author.id,
        claimedCharacter
      );

      activeSpawn = null;

      await message.reply(
`🏆 ${message.author.username} ${t.claimed} ${claimedCharacter.name}

🆔 Code: ${claimedCharacter.code}
⭐ Rarity: ${claimedCharacter.rarity}
🌎 Language: ${claimedCharacter.language}`
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
