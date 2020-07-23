const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/endpoints/micropub/process-data/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handleTags = require(appRootDirectory + functionPath + 'tags');

exports.bookmark = function bookmark(micropubContent) {
    logger.info('links (bookmark) JSON received: ' + JSON.stringify(micropubContent));

    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    let title = '';
    let target = '';

    try {
        title = micropubContent.name;
    } catch (e) {
        logger.info('No title micropubContent.content');
        title = '';
    }

    try {
        target = micropubContent['bookmark-of'];
    } catch (e) {
        logger.info('Bookmark is blank.');
    }

    const entry = `---
title: "${title}"
date: "${pubDate}"
webmentionTarget: "${target}"
meta: "bookmark posted on ${pubDate}"
tags:${tags}
---
${content}
`;
    logger.info('Bookmark formatter finished: ' + entry);
    return entry;
};
