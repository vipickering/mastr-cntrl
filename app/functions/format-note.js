const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const URI = require('urijs');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');

    let content = '';
    let replyTo = '';
    let location = '';
    // let photo = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';
    let replyName = '';
    let entryMeta= '';

    // Create content flags. Assume we have all content supplied. If we don't have it, omit it.
    // If we go this route we need to work out how to output the whole content.
    // Could we litterally loop through and say if X = true Append, otherwise nothing?
    // E.g. var str = 'blah blah blah'; str += ' blah';

    let titleFlag = true;
    let replyFlag = true;
    let tagFlag = true;
    let locationFlag = true;
    let syndicationFlag = true;

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    //https://gist.github.com/dougalcampbell/2024272
    function strencode(data) {
        return unescape(encodeURIComponent(JSON.stringify(data)));
    }

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info(e);
        logger.info('No content skipping');
        content = '';
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info(e);
        logger.info('No title skipping');
        title = '';
        titleFlag = false;
    }

    try {
        replyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info(e);
        logger.info('Not reply type skipping');
        replyTo = '';
        replyFlag = false;
    }

    try {
        const uri = new URI(replyTo);
        if (typeof uri !== 'undefined') {
            replyName = uri.domain();
        }
    } catch (e) {
        logger.info(e);
        logger.info('No reply name skipping');
        replyTo = '';
        replyFlag = false;
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += tagArray[i];
            tags += ' ';
        }
    } catch (e) {
        logger.info(e);
        logger.info('No tags skipping');
        tagArray = '';
        tagFlag = false;
    }

    try {
        location = micropubContent.location;
         if (typeof location === 'undefined') {
            logger.info('No location provided');
            location ='';
        }
    } catch (e) {
        logger.info(e);
        logger.info('No location skipping');
        location = '';
        locationFlag = false;
    }

    try {
        syndication = micropubContent['mp-syndicate-to'][0];
    } catch (e) {
        logger.info(e);
        logger.info('No Syndication skipping');
        syndication = '';
        syndicationFlag = false;
    }

let entry = `---
layout: "${layout}"
date: "${pubDate}"
meta: "${title}"
category: "${category}"
twitterCard: false
${entryMeta}
---
${content}
`;

if (titleFlag === true){ entryMeta += 'title: "${title}"'}
if (replyFlag === true){ entryMeta += 'replyUrl: "${replyTo}" replyName: "${replyName}"'}
if (tagFlag === true){ entryMeta += 'tags:  "${tags}"' }
if (locationFlag === true){ entryMeta += 'location: "${location}"'}
if (syndicationFlag === true){ entryMeta += 'syndication:  "${syndication}"'}

//     let entry = `---
// layout: "${layout}"
// title: "${title}"
// date: "${pubDate}"
// replyUrl: "${replyTo}"
// replyName: "${replyName}"
// meta: "${title}"
// category: "${category}"
// tags:  "${tags}"
// syndication:  "${syndication}"
// location: "${location}"
// twitterCard: false
// ---
// ${content}
// `;

    logger.info('Note content finished: ' + entry);
    strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
