const http = require('node:http');
const { URL } = require('node:url');
require('dotenv').config();
const { createClient } = require('redis');
const { base_token_url } = require('./config.json');
const {
	client_id,
	client_secret,
	redis_host,
	redis_port,
	redis_password
} = process.env;

const redis = createClient({
	host: redis_host,
	port: redis_port,
	password: redis_password
})
.on('connection', () => {

})
.on('error', err => {

});

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        console.log('uptime get request');
        res.end('<h1>MyAniBot</h1>');

    } else if (req.url === '/auth') {
        const params = new URL(req.url).searchParams;
        const code = params.get('code');
        const state = params.get('state');
        console.log(`The access code: ${code}`);

        if (!state) {
            console.log('link timeout');
            return;
        }
        const [code_verifier, username, prev_state] = await redis.GET(state);

        if (prev_state !== state)
            throw new Error('CSRF attack');

        const token_response = await fetch(base_token_url, {
            method: 'POST',
            body: JSON.stringify({
                client_id,
                client_secret,
                // code,
                // code_verifier,
                grant_type: 'authorization_code',
            })
        });

        if (!token_response.ok) {
            console.error(token_response.url);
            throw new Error(`failed to get access token: ${token_response.status}`);
        }

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.sendFile('./index.html', { root: 'src' });

        const token_json = await token_response.json();
        await redis.HSET(user_id,
			'access_token', token_data.access_token,
			'refresh_token', token_data.refresh_token,
			'timestamp', new Date().getSeconds(),
			'expires_in', token_data.expires_in,
			{ EX: REFRESH_EX_SECONDS }
		);
        redis.DEL(state);
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8'
        });
    }

});

redis.connect();
const PORT = process.env.port ?? 3001;
server.listen(PORT, () => console.log(`listening at port ${PORT}`));