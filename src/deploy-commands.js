const path = require('node:path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { token, client_id, guild_id } = process.env;

const rest = new REST().setToken(token);

const commandsPath = path.join(__dirname, 'commands');
const commands = (require('./get-commands.js')(commandsPath))
.map(command => command.data.toJSON());

Promise.resolve(rest.put(
    Routes.applicationGuildCommands(client_id, guild_id),
    { body: commands }
))
.then(result => console.log(`SUCCESS. Reloaded ${result.length} slash commands.`))
.catch(console.error);