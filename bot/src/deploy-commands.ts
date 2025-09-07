const path = require('node:path');
const { REST, Routes } = require('discord.js');
const getCommands = require('./get-commands');

const { token, discord_client_id, guild_id } = process.env;

const rest = new REST({ version: '10' }).setToken(token);

const commandsPath = path.join(__dirname, 'commands');

const commandDocuments = getCommands('./commands')
    .then(commands => commands.map(
        command => command.data.toJSON()
    )
);

Promise.resolve(
    rest.put(Routes.applicationGuildCommands(discord_client_id, guild_id),
    { body: commandDocuments }
))
.then(
    result => console.log(`SUCCESS. Reloaded ${result.length} (/) commands.`))
.catch(console.error);