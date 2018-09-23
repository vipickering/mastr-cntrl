const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const URI = require('urijs');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');
    // const uri = new URI("http://www.example.org/foo/hello.html");

    let content = '';
    let inReplyTo = '';
    let location = '';
    let photo = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';
    // let replyName = uri.domain();

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    //https://gist.github.com/dougalcampbell/2024272
    function strencode( data ) {
      return unescape( encodeURIComponent( JSON.stringify( data ) ) );
    }

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content skipping');
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info('No title skipping');
    }

    try {
        inReplyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info('Not reply type skipping');
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += tagArray[i];
            tags += ' ';
        }
    } catch (e) {
        logger.info('No tags skipping');
    }

    try {
        location = micropubContent.location;
    } catch (e) {
        logger.info('No location skipping');
    }

    try {
        syndication = micropubContent['mp-syndicate-to'][0];
    } catch (e) {
        logger.info('No Syndication skipping');
    }

//Photo and location not being supported. I have no need for them.

// replyName: "${replyName}"

    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
replyUrl: "${inReplyTo}"
meta: "${title}"
category: "${category}"
tags:  "${tags}"
syndication:  "${syndication}"
twitterCard: false
---
${content}
`;
    logger.info('Note content created: ' + entry);
    strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
