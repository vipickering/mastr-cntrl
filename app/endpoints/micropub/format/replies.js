const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/endpoints/micropub/process-data/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handleTags = require(appRootDirectory + functionPath + 'tags');

exports.replies = function replies(micropubContent) {
    logger.info('Reply JSON received: ' + JSON.stringify(micropubContent));

    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const tags = handleTags.formatTags(micropubContent);

    let replyTo = '';
    //Reply target
    try {
        replyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info('Reply contains no URL');
        replyTo = '';
    }

    const entry = `---
title: "reply posted on ${pubDate} to ${replyTo}"
date: "${pubDate}"
target: "${replyTo}"
meta: "reply posted on ${pubDate} to ${replyTo}"
tags:${tags}
---
${content}
`;
    logger.info('Reply formatter finished: ' + entry);
    return entry;
};
