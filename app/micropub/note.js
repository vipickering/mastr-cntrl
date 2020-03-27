const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-content/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handlePhotos = require(appRootDirectory + functionPath + 'photos');
const handleAltText = require(appRootDirectory + functionPath + 'alt-text');
const handleLayout = require(appRootDirectory + functionPath + 'note-layout');
const handleCategory = require(appRootDirectory + functionPath + 'note-category');
const handleTags = require(appRootDirectory + functionPath + 'tags');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets');

exports.note = function note(micropubContent) {
    logger.info('Note JSON received: ' + JSON.stringify(micropubContent)); // Debug

    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const alt = handleAltText.formatAltText(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    const photoURL = handlePhotos.formatPhotos(micropubContent);
    const layout = handleLayout.formatLayout(photoURL);
    const category = handleCategory.formatCategory(photoURL);
    const targetArray = handleTargets.formatTargets(micropubContent);
    const entry = `---
layout: "${layout}"
title: "Note for ${pubDate}"
date: "${pubDate}"
meta: "note posted on ${pubDate}"
category: "${category}"
${photoURL}
${alt}
tags:${tags}
targets: ${targetArray}
---
${content}
`;
    logger.info('Note formatter finished: ' + entry);
    return entry;
};
