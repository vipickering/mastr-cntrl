const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-content/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handlePhotos = require(appRootDirectory + functionPath + 'photos');
const handleAltText = require(appRootDirectory + functionPath + 'alt-text');
const handleLayout = require(appRootDirectory + functionPath + 'note-layout');
const handleCategory = require(appRootDirectory + functionPath + 'note-category');
const handleTags = require(appRootDirectory + functionPath + 'tags');
// const handleSyndication = require(appRootDirectory + functionPath + 'syndication');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets');

exports.note = function note(micropubContent) {
    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const alt = handleAltText.formatAltText(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    const photoURL = handlePhotos.formatPhotos(micropubContent);
    const layout = handleLayout.formatLayout(photoURL);
    const category = handleCategory.formatCategory(photoURL);

    // const syndication = handleSyndication.formatSyndication(micropubContent);
    const targetArray = handleTargets.formatTargets(micropubContent);



    // Debug
    logger.info('Note JSON created: ' + JSON.stringify(micropubContent));

    // try {
    //     targetArray = micropubContent["mp-syndicate-to"];

    //     for (let j = 0; j < targetArray.length; j++) {
    //         logger.info(targetArray[j]);
    //         if (targetArray[j] === 'https://twitter.com/vincentlistens/') {
    //             // twitter = true;
    //         }
    //     }
    // } catch (e) {
    //     logger.info('No Syndication targets');
    //     // twitter = false;
    // }

    const entry = `---
layout: "${layout}"
title: "Note for ${pubDate}"
date: "${pubDate}"
meta: "note posted on ${pubDate}"
category: "${category}"
${photoURL}
${alt}
tags:${tags}
twitterCard: false
---
${content}
`;
    logger.info('Note formatter finished: ' + entry);
    return entry;
};
