const path = require('node:path');
const fs = require('node:fs');
const getCommands = require('get-commands.js');
const { redis } = require('./redis-config.js');

require('dotenv').config();
import { 
    BaseInteraction,
    CommandInteraction,
    GatewayIntentBits,
    Events 
} from 'discord.js';
import { handleCommand } from './command-handler';
import { handleAutocomplete } from './autocomplete-handler';
import AnibotClient from '../anibot-client';

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
    console.log(`Good ${
        (hour >= 18) ? 'evening' :
        (hour >= 12) ? 'afternoon' : 'morning'
    }. Logged in as ${readyClient.user.tag}`);
});

// client.pagers = new Map();
// client.collectors = new Map();

const commandsPath = path.join(__dirname, 'commands');
const commandArr = await getCommands(commandsPath);
commandArr.forEach(command => client.commands.set(command.data.name, command));

client.login(process.env.token);
redis.connect();

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if(interaction.isCommand()) {
        handleCommand(interaction);
    } else if (interaction.isAutocomplete()) {
        handleAutocomplete(interaction);
    } else {
        console.error("Unknown interaction.....");
    }
});