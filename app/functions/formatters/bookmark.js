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
    logger.info('Bookmark JSON: ' + JSON.stringify(micropubContent));

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

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info('No title micropubContent.content');
    }

    try {
        title = micropubContent.properties.content[0].substring(0, 100);
    } catch (e) {
        logger.info('No title micropubContent.properties.content[0]');
    }

    try {
        bookmarkLink = micropubContent['bookmark-of'];
    } catch (e) {
        logger.info('Bookmark is blank.');
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
