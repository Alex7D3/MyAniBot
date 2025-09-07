import { Client, ClientOptions } from "discord.js";
import { BotCommand } from "@anibot-types/anibot-command";

export default class AnibotClient extends Client {
    commands: Map<string, BotCommand>;
    cooldowns: Map<string, number>;
    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Map();
        this.cooldowns = new Map();
    }
}
