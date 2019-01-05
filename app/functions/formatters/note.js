const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    const pubPrettyDate = moment(new Date()).format('YYYY-MM-DD HH:mm');
    let content = '';
    let location = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';
    let syndicationArray = '';

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    //Sometimes Quill is sending JSON in different structures. Try each to make sure we snag the data
    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No micropubContent.content');
    }

    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No micropubContent.properties.content[0]');
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info('No micropubContent.content');
    }

    try {
        title = micropubContent.properties.content[0].substring(0, 100);
    } catch (e) {
        logger.info('No micropubContent.properties.content[0]');
    }

    try {
        photoArray = micropubContent.properties.photo;

         for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info('No photo micropubContent.properties.photo');
    }

      try {
        photoArray = micropubContent.photo;

         for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info('No photo micropubContent.photo');
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += '\n- ';
            tags += tagArray[i];
        }
    } catch (e) {
        logger.info('No tags skipping');
        tagArray = 'miscellaneous';
    }

    try {
        location = micropubContent.location;
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
        logger.info('No Syndication skipping');
        syndicationArray = 'miscellaneous';
    }


    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
meta: "${title}"
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
