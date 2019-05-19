const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const tz = require('moment-timezone');
// const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.favourite = function favourite(micropubContent) {
    const layout = 'favourite';
    const category = 'Favourites';
    let pubDate  = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss');
    let like = '';
    let twitter = false;
    let mastodon = false;
    let syndicateArray = '';

    //Debug
    logger.info('Favourite JSON: ' + JSON.stringify(micropubContent));

    try {
        like = micropubContent['like-of'];
    } catch (e) {
        logger.info('No Favourite Content.');
        like = '';
    }

    try {
        syndicateArray = micropubContent["mp-syndicate-to"];

        for (let j = 0; j < syndicateArray.length; j++) {
            logger.info(syndicateArray[j]);
            if (syndicateArray[j] == 'https://twitter.com/vincentlistens/'){ twitter = true; }
            if (syndicateArray[j] == 'https://mastodon.social/@vincentlistens'){ mastodon = true; }
        }
    } catch (e) {
        logger.info('No Syndication targets');
        syndication = '';
        twitter = false;
        mastodon = false;
    }

    const entry = `---
layout: "${layout}"
title: "favourited ${like}"
date: "${pubDate}"
target: "${like}"
meta: "Vincent favourited ${like}"
category: "${category}"
twitter: ${twitter}
mastodon: ${mastodon}
twitterCard: false
---
[${like}](${like})
`;
    logger.info('Favourite formatter finished: ' + entry);
    // stringEncode.strencode(entry);
    return entry;
};
