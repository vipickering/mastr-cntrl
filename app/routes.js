const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const RateLimit = require('ratelimit.js').RateLimit;
const ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
const redis = require('redis');

const micropubGetRoute = require(appRootDirectory + '/app/routes/get/micropub');
const webmentionUpdateGetRoute = require(appRootDirectory + '/app/routes/get/webmention-update');
const webmentionSendGetRoute = require(appRootDirectory + '/app/routes/get/webmention-send');
const micropubPostRoute = require(appRootDirectory + '/app/routes/post/micropub');
const webmentionPostRoute = require(appRootDirectory + '/app/routes/post/webmention');
let rtg;
let redisClient;
let redisClientOptions;

// Make Redis work on Heroku Or local using Redis To Go
if (process.env.REDISTOGO_URL) {
    rtg   = require('url').parse(process.env.REDISTOGO_URL);
    redisClient = redis.createClient(rtg.port, rtg.hostname);
    redisClient.auth(rtg.auth.split(':')[1]);
} else {
    redisClient = redis.createClient();
}

// Rate limit endpoints to prevent DDOS
const clientOptions = {ignoreRedisErrors : true};
const rateLimiter = new RateLimit(redisClient, [{interval : 1, limit : 10}]);
const limitMiddleware = new ExpressMiddleware(rateLimiter, redisClientOptions);
const limitEndpoint = limitMiddleware.middleware((req, res, next) => {
    res.status(429).json({message : 'rate limit exceeded'});
});

// GET Routes
router.get('/micropub', limitEndpoint, micropubGetRoute.micropubGet);
// router.get('/webmention-update', limitEndpoint, webmentionUpdateGetRoute.webmentionUpdateGet); // This will be deprecated soon.
// router.get('/webmention-send', limitEndpoint, webmentionSendGetRoute.webmentionSend);
router.get('/', limitEndpoint, (req, res) => {
    res.json(serviceProfile);
});

//POST Routes
router.post('/micropub', limitEndpoint, micropubPostRoute.micropubPost); // For sending content in to the website via PESOS
router.post('/webmention', limitEndpoint, webmentionPostRoute.webmentionPost); // For sending webmentions in to the website.
module.exports = router;
