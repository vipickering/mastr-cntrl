const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const RateLimit = require('ratelimit.js').RateLimit;
const ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
const  redis = require("redis");


const micropubGetRoute = require(appRootDirectory + '/app/routes/get/micropub');
const micropubPostRoute = require(appRootDirectory + '/app/routes/post/micropub');
const webmentionPostRoute = require(appRootDirectory + '/app/routes/post/webmention');

let rtg;
let redisClient;
let limitEndpoint;
let redisClientOptions;
let rateLimiter;
let limitMiddleware;

// Make Redis work on Heroku Or local using Redis To Go
if (process.env.REDISTOGO_URL) {
    rtg   = require("url").parse(process.env.REDISTOGO_URL);
    redisClient =redis.createClient(rtg.port, rtg.hostname);
    redisClient.auth(rtg.auth.split(":")[1]);
} else {
    redisClient = redis.createClient();
}

// Rate limit endpoints to prevent DDOS
clientOptions = { ignoreRedisErrors: true };
rateLimiter = new RateLimit(redisClient, [{interval: 1, limit: 10}]);
limitMiddleware = new ExpressMiddleware(rateLimiter, redisClientOptions);
limitEndpoint = limitMiddleware.middleware(function(req, res, next) {
    res.status(429).json({message: 'rate limit exceeded'});
});

// Get Routes
router.get('/micropub', limitEndpoint, micropubGetRoute.micropubGet);
router.get('/', limitEndpoint, (req, res) => { res.json(serviceProfile); });

//POST Routes
router.post('/micropub', limitEndpoint, micropubPostRoute.micropubPost);
// router.post('/webmention', limitEndpoint, webmentionPostRoute.webmentionPost);

module.exports = router;
