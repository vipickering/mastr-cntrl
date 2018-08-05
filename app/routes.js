const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');

//Define Route locations
const micropubGetRoute = require(appRootDirectory + '/app/routes/get/micropub');
const micropubPostRoute = require(appRootDirectory + '/app/routes/post/micropub');
const webmentionPostRoute = require(appRootDirectory + '/app/routes/post/webmention');

// Get Routes
router.get('/micropub', micropubGetRoute.micropubGet);
router.get('/', (req, res) => { res.json(serviceProfile); });

//POST Routes
router.post('/micropub', micropubPostRoute.micropubPost);
// router.post('/webmention', webmentionPostRoute.webmentionPost);

module.exports = router;
