const base64 = require('base64it');
const logger = require('../functions/bunyan');

exports.note = function note(micropubContent) {
    const layout = 'post';
    const category = 'Notes';
    // const syndication = micropubContent.properties.syndication[0]; // Might add this later
    // End

    const rawPubDate = new Date().toISOString();
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';

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
    Sample JSON
    {
      "type": "h-entry",
      "properties": {
        "name": ["Post Title"],
        "content": [
          "html": "<p>The HTML contents of your post from the editor</p>"
        ],
        "mp-slug": ["slug"],
        "category": ["foo","bar"]
      }
    }
    */

    let title ='';
    let content = '';
    let modified = '';
    let modifiedReason = '';
    let tags = '';
    let inReplyTo = '';
    let location = '';
    // let photo = '';
    let slug = '';
    let postStatus = '';

    try {
        content = micropubContent.properties.content[0].html;
    } catch (e) {
        logger.info('No content skipping..');
    }

    try {
        slug = micropubContent.mp-slug[0];
    } catch (e) {
        logger.info('No slug skipping..');
    }

    try {
        title = micropubContent.properties.name[0];
    } catch (e) {
        logger.info('No title skipping..');
    }

    try {
        postStatus = micropubContent.properties.post-status[0];
    } catch (e) {
        logger.info('No post status draft. Publishing immediately');
    }

    try {
        tags = micropubContent.properties.content; //Do we want the whole array?
    } catch (e) {
        logger.info('No tags skipping..');
    }

    try {
        content = micropubContent.properties.content[0].html;
    } catch (e) {
        logger.info('No content skipping..');
    }

    // try {
    //     photo = micropubContent.properties.content[0].html;
    // } catch (e) {
    //     logger.info('No content skipping..');
    // }

    // Meta & lat & long might need conditional
    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
meta: "${title}"
summary: "${title}"
category: "${category}"
modified:  "${modified}"
modifiedReason:  "${modifiedReason}"
twitterCard: false
tags:  "${tags}"
---
${content}
`;
    logger.info('Note content created: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
