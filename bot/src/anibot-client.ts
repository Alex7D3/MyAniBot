import { Client, ClientOptions } from "discord.js";
import { AniBotCommand } from "./types/anibot-module";

export default class AnibotClient extends Client {
  commands: Map<string, AniBotCommand>;
  cooldowns: Map<string, number>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Map();
    this.cooldowns = new Map();
  }
}
