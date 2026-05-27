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

// CLIENTE
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// LANGUAGE
let botLanguage = 'English';

// TEXTOS
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
    inventoryEmpty: '📦 This inventory is empty.',
    inventoryPrivate: '❌ This inventory is private.',
    inventorySetVisible: '✅ Inventory visibility set to Visible.',
    inventorySetPrivate: '✅ Inventory visibility set to Private.',
    privacy: 'Privacy',
    owner: 'User',
    total: 'Total Characters'
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
    inventoryEmpty: '📦 Este inventario está vacío.',
    inventoryPrivate: '❌ Este inventario es privado.',
    inventorySetVisible: '✅ La visibilidad del inventario cambió a Visible.',
    inventorySetPrivate: '✅ La visibilidad del inventario cambió a Privado.',
    privacy: 'Privacidad',
    owner: 'Usuario',
    total: 'Total de personajes'
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
    inventoryEmpty: '📦 Este inventário está vazio.',
    inventoryPrivate: '❌ Este inventário é privado.',
    inventorySetVisible: '✅ A visibilidade do inventário foi alterada para Visível.',
    inventorySetPrivate: '✅ A visibilidade do inventário foi alterada para Privado.',
    privacy: 'Privacidade',
    owner: 'Usuário',
    total: 'Total de personagens'
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
    inventoryEmpty: '📦 Инвентарь пуст.',
    inventoryPrivate: '❌ Этот инвентарь приватный.',
    inventorySetVisible: '✅ Видимость инвентаря изменена на Visible.',
    inventorySetPrivate: '✅ Видимость инвентаря изменена на Private.',
    privacy: 'Приватность',
    owner: 'Пользователь',
    total: 'Всего персонажей'
  }

};

// PERSONAJES
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
    rarity: 'Admim',
    language: 'LATAM',
    image: 'https://i.postimg.cc/6pB7ZZvP/spygamingicon.png'
  },
  {
    code: '031',
    name: 'Lary Hacker',
    rarity: 'Epic',
    language: 'Global',
    image: 'https://i.postimg.cc/brWpGYpS/laryhackericon.webp'
  },
];

// ÚLTIMO
let lastCharacterCode = null;

// ACTIVO
let activeSpawn = null;

// INVENTARIOS
const inventories = new Map();
const inventorySettings = new Map();

const INVENTORY_FILE = path.join(__dirname, 'inventories.json');

function loadInventoryData() {
  try {
    if (!fs.existsSync(INVENTORY_FILE)) {
      return;
    }

    const raw = fs.readFileSync(INVENTORY_FILE, 'utf8');
    if (!raw.trim()) return;

    const data = JSON.parse(raw);

    inventories.clear();
    inventorySettings.clear();

    if (Array.isArray(data.inventories)) {
      for (const [userId, items] of data.inventories) {
        inventories.set(userId, Array.isArray(items) ? items : []);
      }
    }

    if (Array.isArray(data.settings)) {
      for (const [userId, privacy] of data.settings) {
        inventorySettings.set(userId, privacy);
      }
    }
  } catch (err) {
    console.error('❌ Error loading inventories.json:', err);
  }
}

function saveInventoryData() {
  try {
    const data = {
      inventories: Array.from(inventories.entries()),
      settings: Array.from(inventorySettings.entries())
    };

    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error saving inventories.json:', err);
  }
}

loadInventoryData();

// RAREZAS
const rarityChances = {
  Common: 40,
  Rare: 30,
  Epic: 20,
  Legendary: 10
};

function addCharacterToInventory(userId, character) {

  if (!inventories.has(userId)) {
    inventories.set(userId, []);
  }

  inventories.get(userId).push({
    code: character.code,
    name: character.name,
    rarity: character.rarity,
    language: character.language,
    image: character.image
  });

  saveInventoryData();

}

function getInventory(userId) {
  return inventories.get(userId) || [];
}

function getInventoryPrivacy(userId) {
  return inventorySettings.get(userId) || 'Visible';
}

function setInventoryPrivacy(userId, privacy) {
  inventorySettings.set(userId, privacy);
  saveInventoryData();
}

// RANDOM
function getRandomCharacter() {

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

  filtered = filtered.filter(
    character => character.code !== lastCharacterCode
  );

  if (filtered.length === 0) {
    filtered = characters;
  }

  const selectedCharacter = filtered[
    Math.floor(Math.random() * filtered.length)
  ];

  lastCharacterCode = selectedCharacter.code;

  return selectedCharacter;
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
    .setDescription('Show inventory')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('inventory_config')
    .setDescription('Inventory visibility')
    .addStringOption(option =>
      option
        .setName('visibility')
        .setDescription('Visible or Private')
        .setRequired(true)
        .addChoices(
          { name: 'Visible', value: 'Visible' },
          { name: 'Private', value: 'Private' }
        )
    )

].map(command => command.toJSON());

// REST
const rest = new REST({ version: '10' }).setToken(TOKEN);

// REGISTER
(async () => {

  try {

    for (const guildId of GUILD_IDS) {

      await rest.put(
        Routes.applicationGuildCommands(
          CLIENT_ID,
          guildId
        ),
        { body: [] }
      );

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

  console.log(`✅ Online as ${client.user.tag}`);

});

// INTERACTION
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const t = texts[botLanguage];

  // OWNER
  if (
    (
      interaction.commandName === 'spawn_character' ||
      interaction.commandName === 'data_character'
    ) &&
    interaction.user.id !== OWNER_ID
  ) {

    return interaction.reply({
      content: t.noPermission,
      flags: MessageFlags.Ephemeral
    });

  }

  try {

    // LANGUAGE
    if (interaction.commandName === 'language') {

      botLanguage = interaction.options.getString('idioma');

      return interaction.reply({
        content: texts[botLanguage].languageChanged,
        flags: MessageFlags.Ephemeral
      });

    }

    // INVENTORY CONFIG
    if (interaction.commandName === 'inventory_config') {

      const visibility = interaction.options.getString('visibility');
      setInventoryPrivacy(interaction.user.id, visibility);

      return interaction.reply({
        content:
          visibility === 'Visible'
            ? t.inventorySetVisible
            : t.inventorySetPrivate,
        flags: MessageFlags.Ephemeral
      });

    }

    // INVENTORY
    if (interaction.commandName === 'inventory') {

      const targetUser =
        interaction.options.getUser('user') || interaction.user;

      const privacy = getInventoryPrivacy(targetUser.id);
      const isOwnInventory = targetUser.id === interaction.user.id;
      const inventory = getInventory(targetUser.id);

      if (!isOwnInventory && privacy === 'Private') {
        return interaction.reply({
          content: t.inventoryPrivate,
          flags: MessageFlags.Ephemeral
        });
      }

      if (inventory.length === 0) {
        return interaction.reply({
          content: t.inventoryEmpty,
          flags: MessageFlags.Ephemeral
        });
      }

      const counts = new Map();

      for (const character of inventory) {
        const key = character.name;
        counts.set(key, (counts.get(key) || 0) + 1);
      }

      let description = '';

      for (const [name, count] of counts.entries()) {
        description += `• ${name} x${count}\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle(`${targetUser.username}'s ${t.inventory}`)
        .setDescription(description)
        .addFields(
          { name: t.owner, value: `<@${targetUser.id}>`, inline: true },
          { name: t.privacy, value: privacy, inline: true },
          { name: t.total, value: String(inventory.length), inline: true }
        );

      if (privacy === 'Private') {
        return interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral
        });
      }

      return interaction.reply({
        embeds: [embed]
      });

    }

    // DATA
    if (interaction.commandName === 'data_character') {

      if (!activeSpawn) {

        return interaction.reply({
          content: t.noCharacter,
          flags: MessageFlags.Ephemeral
        });

      }

      const embed = new EmbedBuilder()
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
        embed.setImage(activeSpawn.image);
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
    if (interaction.commandName === 'spawn') {

      selectedCharacter = getRandomCharacter();

    }

    // SPAWN CHARACTER
    if (interaction.commandName === 'spawn_character') {

      const code = interaction.options.getString('codigo');

      const foundCharacter = characters.find(
        character => character.code === code
      );

      if (!foundCharacter) {

        return interaction.reply({
          content: t.notFound,
          flags: MessageFlags.Ephemeral
        });

      }

      selectedCharacter = foundCharacter;

    }

    activeSpawn = selectedCharacter;

    const embed = new EmbedBuilder()
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
      embed.setImage(selectedCharacter.image);
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

    const userAnswer = message.content.toLowerCase().trim();
    const correctAnswer = activeSpawn.name.toLowerCase();

    if (userAnswer === correctAnswer) {

      const claimedCharacter = activeSpawn;

      activeSpawn = null;

      addCharacterToInventory(message.author.id, claimedCharacter);

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
