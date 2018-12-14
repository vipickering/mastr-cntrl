const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.bookmark = function bookmark(micropubContent) {
    const layout = 'links';
    const category = 'Links';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');

    let content = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let bookmarkLink = '';

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content. Ending');
        content = '';
        res.status(400);
        res.send('content is empty');
    }

    try {
        title = micropubContent.name;
    } catch (e) {
        logger.info('No name skipping');
        title = `Bookmark for  ${pubDate}`;
    }

    //Reply targets can accept multiple if hand coded. But we will limit it to a single item array, as this isn't standard functionality.
    try {
        bookmarkLink = micropubContent['bookmark-of'];
    } catch (e) {
        logger.info('Bookmark is blank. Ending.');
        res.status(400);
        res.send('Bookmark is empty');
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

    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
target: "${bookmarkLink}"
meta: "${title}"
category: "${category}"
tags:${tags}
twitterCard: false
---
${content}
`;
    logger.info('Bookmark formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
