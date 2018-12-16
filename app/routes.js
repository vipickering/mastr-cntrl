const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const RateLimit = require('ratelimit.js').RateLimit;
const ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
const redis = require('redis');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const micropubGetRoute = require(appRootDirectory + '/app/routes/get/micropub');
const webmentionSendGetRoute = require(appRootDirectory + '/app/routes/post/webmention-send');
const micropubPostRoute = require(appRootDirectory + '/app/routes/post/micropub');
const webmentionPostRoute = require(appRootDirectory + '/app/routes/post/webmention');
const mediaPostRoute = require(appRootDirectory + '/app/routes/post/media');
let rtg;
let redisClient;
let redisClientOptions;

// Make Redis work on Heroku or local; using Redis-To-Go
if (process.env.REDISTOGO_URL) {
    rtg  = require('url').parse(process.env.REDISTOGO_URL);
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
// Called before posting to the micropub route. It provides authentication, routing to syndication and media.
router.get('/micropub', limitEndpoint, micropubGetRoute.micropubGet);

//Catch any route we don't know and return the JSON profile
router.get('/', limitEndpoint, (req, res) => {
    res.json(serviceProfile);
});

//POST Routes
// For recieving content in to the website via PESOS
router.post('/micropub', limitEndpoint, micropubPostRoute.micropubPost);

// Webmentions receiving in to the website. POSTs to the Github API
router.post('/webmention', limitEndpoint, webmentionPostRoute.webmentionPost);

// Called by a Netlify webhook on publish.
// Checks for available webmentions to send. If it finds any in the feed, it POSTs them to Telegraph.
router.post('/webmention-send', limitEndpoint, webmentionSendGetRoute.webmentionSend);

// Media Endpoint. For uploading media to the blog
router.post('/media', limitEndpoint, upload.any(), mediaPostRoute.mediaPost);
module.exports = router;
