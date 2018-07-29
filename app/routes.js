const express = require('express');
const router = new express.Router();
// const path = require('path');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer();
const serviceProfile = {
    'service' : 'Mastr Cntrl',
    'version' : '9000',
    'formatting' : 'Indie Web',
    'purpose' : 'Mastr Cntrl sees all'
};

//Define Route locations
const micropubGetRoute = require(appRootDirectory + '/app/routes/get/micropub');
const micropubPostRoute = require(appRootDirectory + '/app/routes/post/micropub');
const webmentionPostRoute = require(appRootDirectory + '/app/routes/post/webmention');

// Get Routes
router.get('/micropub', micropubGetRoute.micropubGet);
router.get('/', (req, res) => { res.json(serviceProfile); }); // Catch any illegal routes

//POST Routes
router.post('/micropub', micropubPostRoute.micropubPost);
// router.post('/webmention', webmentionPostRoute.webmentionPost);

module.exports = router;
