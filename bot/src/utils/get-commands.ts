import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js'
import type { AniBotCommand } from '../types/anibot-command.js';

const { discord_token, discord_client_id, guild_id } = process.env;

export async function getCommands(commandsPath: string) {
    const output: AniBotCommand[]  = [];
    const children = fs.readdirSync(commandsPath, { withFileTypes: true });

    async function findCommands(curPath: string): Promise<void> {
        if (fs.statSync(curPath).isDirectory()) {
            for (const childPath of children) {
                const fullPath = path.join(curPath, childPath.name);
                findCommands(fullPath);
            }
        } else if (curPath.endsWith('.ts') || curPath.endsWith('.js')) {
            const command = await import(curPath);
            output.push(command as AniBotCommand);
        }
    }

    await findCommands(commandsPath);
    return output;
}

export async function registerCommands(commandList: AniBotCommand[]) { 
  const rest = new REST({ version: '10' }).setToken(discord_token);
  try {
    console.log(`Refreshing ${commandList.length} application commands`);

    const data = await rest.put(
      Routes.applicationGuildCommands(discord_client_id, guild_id),
      { body: commandList }
    ) as AniBotCommand[];
    
    console.log(`Successfully registerd ${data.length} application commands`);
  } catch(error) {
    console.error(error);
  }
}

