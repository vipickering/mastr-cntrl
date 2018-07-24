const base64 = require('base64it');
const logger = require('../functions/bunyan');
const moment = require('moment');

exports.note = function note(micropubContent) {
    const layout = 'Notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');

    // const syndication = micropubContent.properties.syndication[0]; // Might add this later

    /*
    h=entry - This indicates that this is a request to create a new h-entry post.
    content - The text of your post. Your endpoint is expected to treat this as plaintext, and handle all escaping as necessary.
    category[] - This property will be repeated for each tag you've entered in the "tags" field.
    in-reply-to - If you tap the Reply button and enter a URL, the URL will be sent in this property.
    location - If you check the "location" box, then this property will be a Geo URI with the location the browser detected. You will see a preview of the value in the note interface along with a map.
    photo or photo[] - If your server supports a Media Endpoint, this will be set to the URL that your endpoint returned when it uploaded the photo. Otherwise, this will be one of the parts in the multipart request with the image file itself.
    mp-slug - If you enter a slug, this will be sent in the request. You can customize the name of this property in settings.
    mp-syndicate-to[] - Each syndication destination selected will be sent in this property. The values will be the uid that your endpoint returns. See Syndication for more details. (If you are using an older Micropub endpoint that expects syndicate-to, you can customize this property in the settings.)
    */

    /*
    "content":"quill test 3",
    "location":"geo:53.80178,-1.54731;u=65",
    "category":["test","indieweb"],
    "mp-slug":"test"

    */

    let content = '';
    let inReplyTo = '';
    let location = '';
    let photo = '';
    let tags = '';
    let tagArray = '';
    let title = '';

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content skipping');
    }

    try {
        title = micropubContent.content.substring(0, 100) + '...';
    } catch (e) {
        logger.info('No title skipping');
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += tagArray[i];
            logger.info(tags);
            tags += ' ';
            logger.info(tags);
        }
        logger.info(tags);
    } catch (e) {
        logger.info('No tags skipping');
    }

    try {
        location = micropubContent.location;
    } catch (e) {
        logger.info('No location skipping');
    }

    // try {
    //     photo = micropubContent.properties.content[0].html;
    // } catch (e) {
    //     logger.info('No content skipping..');
    // }

    // photo & location  need conditional
    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
meta: "${title}"
category: "${category}"
twitterCard: false
tags:  "${tags}"
---
${content}
`;
    logger.info('Note content created: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
