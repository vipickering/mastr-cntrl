const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.favourite = function favourite(micropubContent) {
    const layout = 'favourite';
    const category = 'Favourites';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    let like = '';

    //Debug
    logger.info('Favourite JSON: ' + JSON.stringify(micropubContent));

    try {
        like = micropubContent['like-of'];
    } catch (e) {
        logger.info('No Favourite Content. Ending');
        like = '';
        res.status(400);
        res.send('Favourite is empty');
    }

    const entry = `---
layout: "${layout}"
title: "Vincent favourited"
date: "${pubDate}"
target: "${like}"
meta: "Vincent favourited ${like}"
category: "${category}"
twitterCard: false
---
[${like}](${like})
`;
    logger.info('Favourite formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
