const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
require('dotenv').config();
const db = require('../../DBConfig');
const { base_auth_URL, base_token_URL, redirect_uri } = require('../../config.json');
const FIVE_MINUTES = 300000;

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
        //128 char * 3/4 byte/char = 96 bytes (recommended size)
        const code_verifier = base64URLEncode(crypto.randomBytes(96));

        // const code_challenge = base64URLEncode(sha256(code_verifier));
        // current API only supports simple method
        const code_challenge = code_verifier;

        const auth_params = new URLSearchParams ({
            response_type: 'code',
            client_id: process.env.mal_id,
            state: process.env.oauth_state,
            redirect_uri,
            code_challenge
        });

        const auth_request = `${new URL(base_auth_URL)}?${auth_params}`;
        const server = startRedirectServer(interaction.user.username, code_verifier);
        await interaction.reply({
            content: `Click [here](${auth_request}) to sign into myanimelist.net. This will expire after`,
            ephemeral: true
        });
        setTimeout(server.close, FIVE_MINUTES);
    }
};

function startRedirectServer(username, code_verifier) {
    const app = express();

    //collect access & refresh token
    app.get('/', async ({ query: { code } }, response) => {
        console.log(`The access code: ${code}`);
        console.log('verifier', code_verifier);
        const token_response = await fetch(base_token_URL, {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.mal_id,
                client_secret: process.env.mal_secret,
                code,
                code_verifier,
                grant_type: 'authorization_code',
                redirect_uri
            })
        });

        if(!token_response.ok) {
            console.log(token_response.url);
            throw new Error(`failed to get access token: ${token_response.status}`);
        }

        response.sendFile('index.html', { root: '.' });
        const token_json = await token_response.json();
        db.set_user_token(username, token_json);
    });
    return app.listen(process.env.PORT || 3001, () => console.log('listening at redirect'));
}