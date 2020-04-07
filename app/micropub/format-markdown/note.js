const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-data/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handleTags = require(appRootDirectory + functionPath + 'tags');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets'); // This is untested. Also IndieNews isn't appearing.

// Entry to be moved in to a formatter function, and return the markdown. It needs to take inputs from all the functions outputs previously.

exports.note = function note(micropubContent) {
    logger.info('Note JSON received: ' + JSON.stringify(micropubContent));

    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    const targetArray = handleTargets.formatTargets(micropubContent);
    const entry = `---
title: "Note for ${pubDate}"
date: "${pubDate}"
meta: "note posted on ${pubDate}"
tags:${tags}
syndicationTargets: ${targetArray}
---
${content}
`;

    logger.info('Note formatter finished: ' + entry);
    return entry;
};
