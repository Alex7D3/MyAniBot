import { createClient } from 'redis';

const { redis_host, redis_password: password, redis_port, NODE_ENV } = process.env;
const port = Number(redis_port);
const host = NODE_ENV === 'dev' ? 'localhost' : redis_host;
const redis = createClient({
  socket: { host, port },
  password 
});

redis.on('connection', () => console.log('Redis Connection Established'));
redis.on('error', (err: Error) => console.error('Redis Client Error: ', err));

export default redis;
