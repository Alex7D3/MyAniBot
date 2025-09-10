import path from 'node:path';
import url from 'node:url';
import { getCommands, registerCommands } from './utils/get-commands.js';
import redis from './utils/redis-config.js';
import { BaseInteraction, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { handleCommand } from './utils/command-handler.js';
import { handleAutocomplete } from './utils/autocomplete-handler.js';
import AnibotClient from './anibot-client.js';

const client = new AnibotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, async readyClient => {
  const hour = new Date().getHours();
  console.log(`Good ${(hour >= 18) ? 'evening' :
      (hour >= 12) ? 'afternoon' : 'morning'
    }. Logged in as ${readyClient.user.tag}`);
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, 'commands');

(async () => {
  const commandList = await getCommands(commandsPath);
  await registerCommands(commandList);
  commandList.forEach(command => client.commands.set(command.data.name, command));
});

client.login(process.env.discord_token);
redis.connect();

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
  if (interaction.isCommand()) handleCommand(interaction);
  else if (interaction.isAutocomplete()) handleAutocomplete(interaction);
  else console.error("Unknown interaction...");
});
