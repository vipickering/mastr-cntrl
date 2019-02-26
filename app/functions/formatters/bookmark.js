const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.bookmark = function bookmark(micropubContent) {
    const layout = 'links';
    const category = 'Links';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    let content = '';
    let title = '';
    let tags = '';
    let tagArray = '';
    let twitter = false;
    let mastodon = false;
    let syndicateArray = '';
    let bookmarkLink = '';

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
        tagArray = 'miscellaneous';
    }

    try {
        syndicateArray = micropubContent["mp-syndicate-to"];

        for (let j = 0; j < syndicateArray.length; j++) {
            if  (syndicateArray[j].value == 'https://twitter.com/vincentlistens/'){ twitter = true; }
            if  (syndicateArray[j].value == 'https://mastodon.social/@vincentlistens'){ mastodon = true; }
        }
    } catch (e) {
        logger.info('No Syndication targets');
        syndication = '';
        twitter = false;
        mastodon = false;
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
mastodon: ${mastodon}
twitterCard: false
---
${content}
`;
    logger.info('Bookmark formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
