import Middleware from "@anibot-types/middleware";
import { BaseInteraction } from "discord.js";

export default {
    name: 'AniList Authorization',
    defer: true,
    async execute(interaction: BaseInteraction) {
        
    }
} as Middleware;