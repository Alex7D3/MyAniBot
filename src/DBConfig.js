const { createClient } = require('redis');
require('dotenv').config();
const { base_token_url } = require('./config.json');
const { db_connection, mal_id, mal_secret } = process.env;
const REFRESH_EX_SECONDS = 1_814_000;

let client;
(async () => {
    if(!db_connection?.length) return;
    client = createClient({ url: db_connection })
        .on('connection', () => console.log('Redis Connection Established'))
        .on('error', e => console.error('Redis Client Error: ', e));

    await client.connect();
})();

const setUserToken = async (user, token_data) =>
    client.HSET(user,
        'access', token_data.access_token,
        'refresh', token_data.refresh_token,
        'timestamp', new Date().getSeconds(),
        'expires_in', token_data.expires_in,
        { EX: REFRESH_EX_SECONDS }
    );

const getUserToken = async function(user) {
    const { token, timestamp, expires_in, refresh_token } = await client.HGETALL(user);
    if(token && new Date().getSeconds() - timestamp > expires_in) {
        fetch(new URL(base_token_url), {
            body: new URLSearchParams({
                client_id: mal_id,
                client_secret: mal_secret,
                grant_type: 'refresh_token',
                refresh_token
            }),
        })
        .then(response => setUserToken(user, response))
        .catch(console.log);
    }
    return token;
};

module.exports = { setUserToken, getUserToken };
