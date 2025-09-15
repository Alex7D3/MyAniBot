import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const { redis_host: host, redis_password: password, redis_port } = process.env;
const port = Number(redis_port);
console.log(host);
const redis = createClient({
  socket: { host, port },
  password 
});

redis.on('connection', () => console.log('Redis Connection Established'));
redis.on('error', (err: Error) => console.error('Redis Client Error: ', err));

export default redis;
