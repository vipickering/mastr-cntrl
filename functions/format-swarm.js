const base64 = require('base64it');
const logger = require('../functions/bunyan');

exports.checkIn = function checkIn(micropubContent) {
    let layout = 'checkin';
    let title = 'titlehere';
    let date = '2018-06-15 07:00:00 +/-GMT';
    let summary = 'summaryhere';
    let category = 'checkin';
    let tags = 'checkin swarm foursquare';
    let photo = micropubContent.properties.photo[0];
    let pubDate = micropubContent.properties.published[0] ;
    let content = micropubContent.properties.content[0] ;
    let syndication = micropubContent.properties.syndication[0] ;
    let checkinName = micropubContent.properties.checkin[0].properties.name[0] ;
    let foursquareUrl = micropubContent.properties.checkin[0].properties.url[0] ;
    let checkinLat = micropubContent.properties.checkin[0].properties.lattitude[0] ;
    let checkinLong = micropubContent.properties.checkin[0].properties.longitude[0] ;
    let checkinCountry = micropubContent.properties.checkin[0].properties.country-name[0] ;
    let entry;
    let frontmatter = `---
    layout: ${layout}
    title: ${title}
    date: ${date}
    meta: ${summary}
    summary: ${summary}
    category: ${category}
    modified :
    modifiedReason:
    twitterCard: true
    tags: ${tags}
    ---
    `;
    let micropubContentFormatted;

    // TODO
    // Make frontmatter be everything that isn't the content

    entry =`
<h1>${checkinName}</h1>
<p>${content}</p>
<img src="${photo}" alt="">
<p>Coins?</p>
<p>${syndication}</p>
<p>${url}</p>
<p>${checkinLong}</p>
<p>${checkinLat}</p>
<p>${pubDate}</p>
`;

    entry = JSON.stringify(micropubContent);
    micropubContent = frontmatter + entry;
    logger.info('content formatted: ' + micropubContent);
    micropubContentFormatted =  base64.encode(micropubContent);
    return micropubContentFormatted;
};
