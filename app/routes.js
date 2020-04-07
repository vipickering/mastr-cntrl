const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const RateLimit = require('ratelimit.js').RateLimit;
const ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
const redis = require('redis');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage : storage}); //Used to store the media endpoint image in memory
const syndicationOptionsGetRoute = require(appRootDirectory + '/app/endpoints/syndication/return-options');
const SendWebmentionPostRoute = require(appRootDirectory + '/app/endpoints/webmention/send');
const micropubPostRoute = require(appRootDirectory + '/app/endpoints/micropub/post-to-github');
const webmentionPostRoute = require(appRootDirectory + '/app/endpoints/webmention/post-to-github');
const mediaPostRoute = require(appRootDirectory + '/app/endpoints/media/post-to-github');
let rtg;
let redisClient;

// Make Redis work on Heroku or local; using Redis-To-Go
if (process.env.REDISTOGO_URL) {
    rtg  = require('url').parse(process.env.REDISTOGO_URL);
    redisClient = redis.createClient(rtg.port, rtg.hostname);
    redisClient.auth(rtg.auth.split(':')[1]);
} else {
    redisClient = redis.createClient();
}

// Rate limit endpoints to prevent DDOS
const redisClientOptions = {ignoreRedisErrors : true};
const rateLimiter = new RateLimit(redisClient, [{interval : 1, limit : 10}]);
const limitMiddleware = new ExpressMiddleware(rateLimiter, redisClientOptions);
const limitEndpoint = limitMiddleware.middleware((req, res) => {
    res.status(429).json({message : 'rate limit exceeded'});
});

/***
GET Routes
***/
router.get('/micropub', limitEndpoint, syndicationOptionsGetRoute.micropubGet);
router.get('/', limitEndpoint, (req, res) => {
    res.json(serviceProfile);
});

/***
POST Routes
***/
router.post('/micropub', limitEndpoint, micropubPostRoute.micropubPost);
router.post('/webmention', limitEndpoint, webmentionPostRoute.webmentionPost);
router.post('/media', limitEndpoint, upload.any(), mediaPostRoute.mediaPost);

/**
Called by a  webhook on publish.
**/

// Checks for available webmentions to send. If it finds any in the feed, it POSTs them to Telegraph.
router.post('/send-webmention', limitEndpoint, SendWebmentionPostRoute.sendWebmention);

// Checks for available webmentions to send. If it finds any in the feed, it POSTs them to Telegraph.
// router.post('/syndication', limitEndpoint, SyndicationPostRoute.syndication);

module.exports = router;
