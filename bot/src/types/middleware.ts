import { BaseInteraction } from "discord.js";

export default interface Middleware {
    name: string;
    defer: boolean;
    execute: (interaction: BaseInteraction) => void | Promise<void>
}