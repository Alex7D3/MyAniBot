import fs from 'node:fs';
import type { PathLike } from 'node:fs';
import path from 'node:path';
import type { AniBotCommand, AniBotEvent } from '../types/anibot-module.js';

export async function getModules<ModuleType>(rootPath: PathLike) {
  const output: ModuleType[] = [];

  const entries = await fs.promises.readdir(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    const subPath = path.join(String(rootPath), entry.name);

    if (entry.isDirectory()) {
      const subDirFiles = await getModules<ModuleType>(subPath);
      output.push(...subDirFiles);
    } else if (subPath.endsWith('.ts')) {
      // TODO: Implement type checking with library, cast is unsafe
      const module: ModuleType = await import(subPath);
      output.push(module);
    }
  }

  return output;
}

export async function loadCommands(rootPath: PathLike): Promise<Map<string, AniBotCommand>> {
  const commandList = await getModules<AniBotCommand>(rootPath);
  return commandList.reduce((acc, cur) => acc.set(cur.data.name, cur), new Map<string, AniBotCommand>);
}

export async function loadEvents(rootPath: PathLike): Promise<AniBotEvent[]> {
  return await getModules<AniBotEvent>(rootPath);
}

