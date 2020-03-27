const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-content/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handlePhotos = require(appRootDirectory + functionPath + 'photos');
const handleAltText = require(appRootDirectory + functionPath + 'alt-text');
const handleTags = require(appRootDirectory + functionPath + 'tags');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets');

exports.note = function note(micropubContent) {
    logger.info('Note JSON received: ' + JSON.stringify(micropubContent)); // Debug

    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const alt = handleAltText.formatAltText(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    const photoURL = handlePhotos.formatPhotos(micropubContent);
    const targetArray = handleTargets.formatTargets(micropubContent);
    const entry = `---
title: "Note for ${pubDate}"
date: "${pubDate}"
meta: "note posted on ${pubDate}"
${photoURL}
${alt}
tags:${tags}
syndication: ${targetArray}
---
${content}
`;
    logger.info('Note formatter finished: ' + entry);
    return entry;
};
