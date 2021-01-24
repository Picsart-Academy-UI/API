const redis = require('redis');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  });
  
module.exports = new RateLimit({
    store: new RedisStore({
        client: redisClient
    }),
    windowMs: 60000,
    max: 100
});