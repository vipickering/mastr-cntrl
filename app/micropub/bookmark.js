const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-data/';

const moment = require('moment');
const tz = require('moment-timezone');
const handleContent = require(appRootDirectory + functionPath + 'content');

exports.bookmark = function bookmark(micropubContent) {
    const layout = 'links';
    const category = 'Links';
    const pubDate  = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss');
    const content = handleContent.formatContent(micropubContent);
    let title = '';
    let tags = '';
    let tagArray = '';
    let bookmarkLink = '';
    let twitter = false;
    let syndicateArray = '';

    // Debug
    logger.info('Bookmark(links) JSON created: ' + JSON.stringify(micropubContent));

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
    return entry;
};
