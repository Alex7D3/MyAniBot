import { createClient } from 'redis';
import process from 'process';

const redis = createClient({
    url: process.env.redis_host,
    password: process.env.redis_password
});

redis.on('connection', () => console.log('Redis Connection Established'));
redis.on('error', err => console.error('Redis Client Error: ', err));

export default redis;
