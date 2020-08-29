const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage : storage}); //Used to store the media endpoint image in memory
const syndicationOptionsGetRoute = require(appRootDirectory + '/app/endpoints/syndication/return-options');
const micropubPostRoute = require(appRootDirectory + '/app/endpoints/micropub/post-to-github');
const mediaPostRoute = require(appRootDirectory + '/app/endpoints/media/post-to-github');

/***
GET Routes
***/
router.get('/micropub', syndicationOptionsGetRoute.micropubGet); //Get syndication options for Micropub client
router.get('/', (req, res) => { //Display Service Profile if called directly
    res.json(serviceProfile);
});

/***
POST Routes
***/
router.post('/micropub', micropubPostRoute.micropubPost);
router.post('/media', upload.any(), mediaPostRoute.mediaPost);

/***
CATCH ALL Route
***/
router.get('*', (req, res) => { //Display Service Profile if unknown routing called
    res.json(serviceProfile);
});

module.exports = router;
