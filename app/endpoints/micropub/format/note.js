const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/endpoints/micropub/process-data/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleTags = require(appRootDirectory + functionPath + 'tags');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets');

// Entry to be moved in to a formatter function, and return the markdown. It needs to take inputs from all the functions outputs previously.

exports.note = function note(publishedDate, micropubContent) {
    logger.info('Note JSON received: ' + JSON.stringify(micropubContent));

    const pubDate = publishedDate;
    const content = handleContent.formatContent(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    const targetArray = handleTargets.formatTargets(micropubContent);
    const entry = `---
title: "Note for ${pubDate}"
date: "${pubDate}"
meta: "note posted on ${pubDate}"
tags:${tags}
${targetArray}
---
${content}
`;

    logger.info('Note formatter finished: ' + entry);
    return entry;
};
