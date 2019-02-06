const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.note = function note(micropubContent) {
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    const pubPrettyDate = moment(new Date()).format('YYYY-MM-DD HH:mm');
    let layout = '';
    let category = '';
    let content = '';
    let location = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let tags = '';
    let tagArray = '';
    let syndication = '';
    let syndicationArray = '';

    // Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    // Sometimes Quill is sending JSON in different structures, depending upon including images.
    // Try each method to make sure we capture the data
    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content micropubContent.content');
    }

    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No content micropubContent.properties.content[0]');
    }

    // See if we can get photos. If we can set the layout type here?
    try {
        photoArray = micropubContent.properties.photo;
        layout = 'photos';
        category = 'Photos';

        for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info('No photo provided');
        photoURL = `photo1_url: ""`;
        alt = `photo1_alt: ""`;
        layout = 'notes';
        category = 'Notes';
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += '\n- ';
            tags += tagArray[i];
        }
    } catch (e) {
        logger.info('No tags provided assigning miscellaneous');
        tagArray = 'miscellaneous';
    }

    try {
        location = micropubContent.location;
         if (typeof location === 'undefined') {
            logger.info('Location cannot be determind');
            location = '';
        }
    } catch (e) {
        logger.info('No location provided');
        location = '';
    }

     try {
        syndicationArray = micropubContent['mp-syndicate-to'];
        for (let i = 0; i < syndicationArray.length; i++) {
            syndication += '\n- ';
            syndication += syndicationArray[i];
        }
    } catch (e) {
        logger.info('No Syndication provided');
        syndicationArray = '';
    }


    const entry = `---
layout: "${layout}"
title: "Note for ${pubDate}"
date: "${pubDate}"
meta: "note posted on ${pubDate}"
category: "${category}"
${photoURL}
${alt}
tags:${tags}
syndication: ${syndication}
location: "${location}"
twitterCard: false
---
${content}
`;
    logger.info('Note formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
