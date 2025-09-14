import { BaseInteraction, SlashCommandBuilder, CommandInteraction, ClientEvents } from "discord.js";

export default interface Middleware {
  name: string;
  defer: boolean;
  execute: (interaction: BaseInteraction) => void | Promise<void>
}

export interface AniBotCommand {
  cooldown?: number;
  data: SlashCommandBuilder;
  middleware: Middleware[]
  execute: (interaction: CommandInteraction) => void;
}

export interface AniBotEvent {
  name: keyof ClientEvents;
  once: boolean;
  execute: (...args: any) => void;
};
