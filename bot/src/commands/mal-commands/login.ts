import { SlashCommandBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import path from 'node:path';
import crypto from 'node:crypto';

const { redis } = require('../../redis-config.js');
const FIVE_MINUTES = 300_000;
const { client_id } = process.env;

const base64URLEncode = (buffer: Buffer): string => 
    buffer.toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

/* const sha256 = (code: string): string =>
    crypto.createHash('sha256')
    .update(str)
    .digest('base64'); */

export const cooldown = 5;

export const data = new SlashCommandBuilder()
.setName('login')
.setDescription('Login to start using authenticated commands')
.addSubcommand(subcommand => subcommand.setName('login to MAL')
	
)
.addSubcommand(subcommand => subcommand.setName('login to AniList')

);

export async function execute(interaction: CommandInteraction) {
    

    if (interaction.options.get('')) {
        //128 char * 3/4 byte/char = 96 bytes
        const bytes = crypto.randomBytes(96);
        const code_verifier = base64URLEncode(bytes);

        // const code_challenge = base64URLEncode(sha256(code_verifier));
        // MAL API only supports simple method
        const code_challenge = code_verifier;
    }

    // generate random auth states, attempt to set in db, retry if already exists
    let state;
    do state = base64URLEncode(crypto.randomBytes(8));
    while (await redis.SETNX(state, `${code_verifier}:${interaction.user.id}:${state}`, { EX: FIVE_MINUTES }));

    const params = new URLSearchParams({
        response_type: 'code',
        client_id,
        state,
        code_challenge
    });

    interaction.reply({
        content: `Click [here](${base_auth_url}?${params}) to sign in to ${'myanimelist.net'}. This will expire after 5 minutes.`,
        ephemeral: true
    });
}