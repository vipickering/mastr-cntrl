const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-data/';
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');

exports.favourite = function favourite(micropubContent) {
    logger.info('Favourite JSON received: ' + JSON.stringify(micropubContent));

    const pubDate = handleDateTime.formatDateTime();
    let like = '';

    try {
        like = micropubContent['like-of'];
    } catch (e) {
        logger.info('No Favourite Content.');
        like = '';
    }

    const entry = `---
title: "favourited ${like}"
date: "${pubDate}"
target: "${like}"
meta: "Vincent favourited ${like}"
---
[${like}](${like})
`;

    logger.info('Favourite formatter finished: ' + entry);
    return entry;
};
