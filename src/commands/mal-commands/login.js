const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const crypto = require('node:crypto');
    const express = require('express');
require('dotenv').config();
const { app_state } = require('../../server.js');
const { base_auth_url } = require('../../config.json');
const FIVE_MINUTES = 300_000;

const base64URLEncode = (buffer) =>
    buffer.toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

/* const sha256 = (str) =>
    crypto.createHash('sha256')
    .update(str)
    .digest('base64'); */


module.exports = {
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('login to MyAnimeList.net to access personal list information'),

    async execute(interaction) {
        if(!process.env.db_connection)
            return interaction.reply({
                content: 'User authentication has not been set up.',
                ephemeral: true
            });

        //128 char * 3/4 byte/char = 96 bytes
        const code_verifier = base64URLEncode(crypto.randomBytes(96));

        // const code_challenge = base64URLEncode(sha256(code_verifier));
        // current API only supports simple method
        const code_challenge = code_verifier;

        let state;
        do state = base64URLEncode(crypto.randomBytes(8));
        while(app_state.has(state));

        app_state.set(state, [code_verifier, interaction.user.username, state]);

        const { client_id } = process.env;
        const auth_params = new URLSearchParams ({
            response_type: 'code',
            client_id,
            state,
            code_challenge
        });

        const auth_request = `${new URL(base_auth_url)}?${auth_params}`;

        await interaction.reply({
            content: `Click [here](${auth_request}) to sign in to myanimelist.net. This will expire after 5 minutes.`,
            ephemeral: true
        });
        setTimeout(() => app_state.delete(state), FIVE_MINUTES);
    }
};