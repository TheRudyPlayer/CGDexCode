const {
  Client,
  GatewayIntentBits,
  REST,
  Routes
} = require('discord.js');

const TOKEN = process.env.TOKEN;

const CLIENT_ID = 'TU_CLIENT_ID';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {

    console.log('🗑️ Eliminando comandos globales...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: [] }
    );

    console.log('✅ Comandos eliminados');

  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`✅ ${client.user.tag}`);
});

client.login(TOKEN);

const http = require('http');

http.createServer((req, res) => {
  res.write('Bot online');
  res.end();
}).listen(process.env.PORT || 3000);
