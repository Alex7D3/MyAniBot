const express = require('express');
require('dotenv').config();
const db = require('./DBConfig.js');
const { base_token_url } = require('./config.json');

const app = express();
const app_state = new Map();
//collect access & refresh token
function startServer() {
    app.get('/', () => {
        console.log('uptime get request');
    });

    app.get('/oauth', async ({ query: { code, state } }, response) => {
        console.log(`The access code: ${code}`);

        if(!state) {
            console.log('link timeout');
            return;
        }
        const [code_verifier, username, prev_state] = app_state.get(state);

        if(prev_state && prev_state !== state)
            throw new Error('CSRF attack');

        const token_response = await fetch(base_token_url, {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.client_id,
                client_secret: process.env.mal_secret,
                code,
                code_verifier,
                grant_type: 'authorization_code',
            })
        });

        if (!token_response.ok) {
            console.log(token_response.url);
            throw new Error(`failed to get access token: ${token_response.status}`);
        }

        response.sendFile('./index.html', { root: 'src' });
        const token_json = await token_response.json();
        if(db) db.setUserToken(username, token_json);
    });

    app.listen(process.env.PORT || 3001, () => console.log('listening at redirect'));
}

module.exports = { startServer, app_state };
