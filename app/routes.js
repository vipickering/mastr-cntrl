const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const RateLimit = require('ratelimit.js').RateLimit;
const ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
const redis = require("redis");
const rp = require('request-promise');
const validUrl = require('valid-url');

const logger = require(appRootDirectory + '/app/functions/bunyan');
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

//Move to functions
webmentionUrlChecker = function(req, res, next) {
    console.log(req.body);
    const sourceURL = req.body.source;
    const targetURL = req.body.target;

     function checkValidUrl(url) {
        if (validUrl.isUri(url)) {
             logger.info('Webmention ' + url + ' is valid format');
        } else {
            logger.info('Webmention ' + url + ' invalid format');
            logger.info('Webmention URL is invalid');
            res.status(400);
            res.send('Webmention URL is invalid');
        }
    }

    logger.info('Webmention source: ' + sourceURL);
    logger.info('Webmention target: ' + targetURL);
    checkValidUrl(sourceURL);
    checkValidUrl(targetURL);

    // Make sure URLs aren't identical
    if (sourceURL !== targetURL) {
        return next();
    } else {
        logger.info('Webmention Source and Target URL do not match');
        res.status(400);
        res.send('Source and Target URL should not match');
    }
}

//Move to functions
webmentionUrlValidation = function(req, res, next) {
    console.log(req.body);
    const sourceURL = req.body.source;
    const targetURL = req.body.target;

    function errorResponse(err) {
        logger.info('URL is invalid');
        logger.error(err);
        res.status(400);
        res.send('URL is invalid');
    }

    // Test that we get OK response on both URLS.
    rp(sourceURL)
        .catch(errorResponse);

    rp(targetURL)
        .catch(errorResponse);

    return next();
}

// Get Routes
router.get('/micropub', limitEndpoint, micropubGetRoute.micropubGet);
router.get('/', limitEndpoint, (req, res) => { res.json(serviceProfile); });

//POST Routes
router.post('/micropub', limitEndpoint, micropubPostRoute.micropubPost);
router.post('/webmention', limitEndpoint, webmentionUrlChecker, webmentionUrlValidation, webmentionPostRoute.webmentionPost);

module.exports = router;
