import path from 'node:path';
import url from 'node:url';
import { loadEvents } from './utils/get-commands.js';
import type { AniBotEvent } from './types/anibot-module';
import redis from './utils/redis-config.js';
import { GatewayIntentBits, Client } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const eventsPath = path.join(__dirname, 'events');

(async () => {
  const events: AniBotEvent[] = await loadEvents(eventsPath);
  events.forEach(event => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
})();

redis.connect();
client.login(process.env.discord_token);
