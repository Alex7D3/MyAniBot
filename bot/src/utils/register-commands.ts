import { loadCommands } from './get-commands';
import path from 'node:path';
import url from 'node:url';
import { REST, Routes, RESTPutAPIApplicationCommandsJSONBody } from 'discord.js';
const { discord_token, discord_client_id, guild_id } = process.env;

const rest = new REST({ version: '10' }).setToken(discord_token);

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, '../commands');
const commandList = await loadCommands(commandsPath)
  .then(commandMap => [...commandMap.values()].map(command => command.data));

try {
  console.log(`Refreshing ${commandList.length} application commands`);

  const data = await rest.put(
    Routes.applicationGuildCommands(discord_client_id, guild_id),
    { body: commandList }
  ) as RESTPutAPIApplicationCommandsJSONBody;

  console.log(`Successfully registered ${data.length} application commands`);

} catch (error) {
  console.error(error);
}

