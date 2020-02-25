const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const tz = require('moment-timezone');
// const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.bookmark = function bookmark(micropubContent) {
    const layout = 'links';
    const category = 'Links';
    const pubDate  = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss');
    let content = '';
    let title = '';
    let tags = '';
    let tagArray = '';
    let bookmarkLink = '';
    let twitter = false;
    let syndicateArray = '';

    //Debug
    logger.info('Bookmark JSON: ' + JSON.stringify(micropubContent));

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content micropubContent.content');
    }

    try {
        title = micropubContent.name;
    } catch (e) {
        logger.info('No title micropubContent.content');
        title = '';
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
        tags += '\n- ';
        tags += 'miscellaneous';
    }

    try {
        syndicateArray = micropubContent["mp-syndicate-to"];

        for (let j = 0; j < syndicateArray.length; j++) {
            logger.info(syndicateArray[j]);
            if (syndicateArray[j] == 'https://twitter.com/vincentlistens/'){ twitter = true; }
        }
    } catch (e) {
        logger.info('No Syndication targets');
        twitter = false;
    }

    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
target: "${bookmarkLink}"
meta: "bookmark posted on ${pubDate}"
category: "${category}"
tags:${tags}
twitter: ${twitter}
twitterCard: false
---
${content}
`;
    logger.info('Bookmark formatter finished: ' + entry);
    // stringEncode.strencode(entry);
    return entry;
};
