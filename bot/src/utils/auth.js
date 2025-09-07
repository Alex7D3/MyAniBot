require('dotenv').config();
const { base_token_url } = require('./config.json');
const redis = require('./redis-config');
const REFRESH_EX_SECONDS = 1_814_000;
const { client_id, client_secret } = process.env;


async function setUserToken(user_id, token_data) {
	await redis.HSET(user_id,
		'access_token', token_data.access_token,
		'refresh_token', token_data.refresh_token,
		'timestamp', new Date().getSeconds(),
		'expires_in', token_data.expires_in,
		{ EX: REFRESH_EX_SECONDS }
	);
	console.log("successful token store");
}

async function getUserToken(user_id) {
	const { access_token, timestamp, expires_in, refresh_token } = await redis.HGETALL(user_id);
	if (!access_token)
		throw new Error('Error getting access token, user is not logged in.');

	else if (new Date().getSeconds() - parseInt(timestamp) > parseInt(expires_in)) {
		const response = await fetch(base_token_url, {
			body: JSON.stringify({
				client_id,
				client_secret,
				grant_type: 'refresh_token',
				refresh_token
			})
		});

		if (!response.ok)
			throw new Error(`HTTP error refreshing token: ${response.status}.`);

		const renewed_token_data = await response.json();
		setUserToken(user_id, renewed_token_data);

		return renewed_token_data.access_token;
	}

	return access_token;
}

module.exports = { setUserToken, getUserToken };