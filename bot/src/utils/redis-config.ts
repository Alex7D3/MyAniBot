import { createClient } from 'redis';
import process from 'process';

const redis = createClient({
    url: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

redis.on('connection', () => console.log('Redis Connection Established'));
redis.on('error', err => console.error('Redis Client Error: ', err));

export default redis;