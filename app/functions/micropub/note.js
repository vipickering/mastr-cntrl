/* eslint-disable quotes */
/* eslint-disable complexity */
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const tz = require('moment-timezone');
const determineContent = require(appRootDirectory + '/app/functions/micropub-content/content');

exports.note = function note(micropubContent) {
    const pubDate  = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss');
    let layout = '';
    let category = '';
    const content = determineContent.findContent(micropubContent); // Handle Body Conent
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let tags = '';
    let tagArray = '';
    // let twitter = false;
    let syndication = false;
    let syndicateArray = '';

    // See if we can get photos. If we can set the layout type here?
    try {
        photoArray = micropubContent.properties.photo;
        layout = 'photos';
        category = 'Photos';

        for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j + 1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j + 1}_alt: "${photoArray[j].alt}"\n`;
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
        tags += '\n- ';
        tags += 'miscellaneous';
    }

    try {
        syndicateArray = micropubContent["mp-syndicate-to"];

        for (let j = 0; j < syndicateArray.length; j++) {
            logger.info(syndicateArray[j]);
            if (syndicateArray[j] === 'https://twitter.com/vincentlistens/') {
                // twitter = true;
            }
        }
    } catch (e) {
        logger.info('No Syndication targets');
        // twitter = false;
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
twitterCard: false
---
${content}
`;
    logger.info('Note formatter finished: ' + entry);
    // stringEncode.strencode(entry);
    return entry;
};
