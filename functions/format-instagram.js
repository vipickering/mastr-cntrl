const base64 = require('base64it');
const logger = require('../functions/bunyan');

//UNFINISHED
exports.note = function note(serviceContent) {
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
    // 1. Format post using captured sample data
    // 2. Format Instagram post, after we capture data
    // 3.  Add test mode. Bypass routing and output JSON in to console.

    entry =`
AVATAR at Portland Community College - Southeast Campus
Portland, Oregon • Tue, June 12, 2018 4:19pm

CONTENT

PHOTO

 15 Coins <-- WEBMENTION?
Tue, Jun 12, 2018 4:19pm -07:00

SYNDICATION
<img src="${photo}" alt=""><br>
${name}<br>

${url}<br>
${pubDate}<br>
${content}
`;

        entry = JSON.stringify(micropubContent);
        micropubContent = frontmatter + entry;
        console.log(micropubContent);
        micropubContentFormatted =  base64.encode(micropubContent);
        return micropubContentFormatted;
};
