import fs from 'node:fs';
import path from 'node:path';
import { BotCommand } from '@anibot-types/anibot-command';

function getCommands(commandsPath: string) {
    const output = [];

    function findCommands(curPath: string) {
        if (fs.statSync(curPath).isDirectory()) {
            const children = fs.readdirSync(curPath, { withFileTypes: true });
            for (const childPath of children) {
                const fullPath = path.join(curPath, childPath);
                findCommands(fullPath, output);
            }
        } else if (curPath.endsWith('.js') || curPath.endsWith('.ts')) {
            const command = require(curPath);
            output.push(command as BotCommand);
        }
    }

    findCommands(commandsPath);
    return output;
}

var x = getCommands('/home/alex_/dev/MyAniBot/src/commands');
console.log(x);