import { BaseInteraction, SlashCommandBuilder, ChatInputCommandInteraction, ClientEvents } from "discord.js";

export interface Middleware {
  name: string;
  defer: boolean;
  execute: (interaction: BaseInteraction) => void | Promise<void>
}

export interface AniBotCommand {
  cooldown?: number;
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface AniBotEvent {
  name: keyof ClientEvents;
  once: boolean;
  execute: (...args: ClientEvents[keyof ClientEvents]) => Promise<void>;
};
