import { SlashCommandBuilder, CommandInteraction } from "discord.js"; 
import Middleware from "./middleware";

export interface AniBotCommand {
    cooldown?: number;
    data: SlashCommandBuilder;
    middleware: Middleware[]
    execute: (interaction: CommandInteraction) => void;
}