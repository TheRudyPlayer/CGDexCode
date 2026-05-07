const {
  Client,
  GatewayIntentBits,
  REST,
  Routes
} = require('discord.js');

const TOKEN = process.env.TOKEN;

// TU CLIENT ID
const CLIENT_ID = '1498803742391406633';

// TU SERVER ID
const GUILD_ID = '1433246929588060432';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {

    console.log('🗑️ Eliminando slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Slash commands eliminados');

  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.login(TOKEN);
