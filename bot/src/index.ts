import path from 'node:path';
import url from 'node:url';
import { getModules, registerCommands } from './utils/get-commands.js';
import type { AniBotCommand, AniBotEvent } from './types/anibot-module';
import redis from './utils/redis-config.js';
import { GatewayIntentBits } from 'discord.js';
import AnibotClient from './anibot-client.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new AnibotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

(async () => {
  const commandList: AniBotCommand[] = await getModules<AniBotCommand>(commandsPath);
  await registerCommands(commandList);
  commandList.forEach(command => client.commands.set(command.data.name, command));

  const events: AniBotEvent[] = await getModules<AniBotEvent>(eventsPath);
  events.forEach(event => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
})();

client.login(process.env.discord_token);
redis.connect();
