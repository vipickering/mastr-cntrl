const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');

exports.webmention = function webmention(micropubContent) {
    // const layout = 'checkin';
    // const category = 'Checkins';
    // const rawPubDate = micropubContent.properties.published[0];
    // const rawDate = rawPubDate.slice(0, 10);
    // const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    // const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';
    // const syndication = micropubContent.properties.syndication[0];
    // const checkinName = micropubContent.properties.checkin[0].properties.name[0];
    // let content = '';
    // let photo = '';
    // let foursquare = '';
    // let addrLat = '';
    // let addrLong  = '';
    // let addrCountry = '';
    // let address   = '';
    // let locality = '';
    // let region = '';

    // try {
    //     content = micropubContent.properties.content[0];
    // } catch (e) {
    //     logger.info('No content skipping..');
    // }
    // try {
    //     photo = micropubContent.properties.photo[0];
    // } catch (e) {
    //     logger.info('No photo skipping..');
    // }
    // try {
    //     foursquare = micropubContent.properties.checkin[0].properties.url[0];
    // } catch (e) {
    //     logger.info('No foursquare link skipping..');
    // }
    // try {
    //     addrLat = micropubContent.properties.checkin[0].properties.latitude[0];
    // } catch (e) {
    //     logger.info('No lattitude link skipping..');
    // }
    // try {
    //     addrLong = micropubContent.properties.checkin[0].properties.longitude[0];
    // } catch (e) {
    //     logger.info('No longitude link skipping..');
    // }
    // try {
    //     locality = micropubContent.properties.checkin[0].properties.locality[0];
    // } catch (e) {
    //     logger.info('No locality link skipping..');
    // }
    // try {
    //     address  = micropubContent.properties.checkin[0].properties.address[0];
    // } catch (e) {
    //     logger.info('No address link skipping..');
    // }
    // try {
    //     region = micropubContent.properties.checkin[0].properties.region[0];
    // } catch (e) {
    //     logger.info('No region link skipping..');
    // }
    // try {
    //     addrCountry = micropubContent.properties.checkin[0].properties['country-name'][0];
    // } catch (e) {
    //     logger.info('No country link skipping..');
    // }

//     const entry = `---
// layout: "${layout}"
// title: "${checkinName}"
// photo: "${photo}"
// date: "${pubDate}"
// meta: "Checked in at ${checkinName}"
// category: "${category}"
// syndication: "${syndication}"
// foursquare: "${foursquare}"
// latitude: "${addrLat}"
// longitude: "${addrLong}"
// address: "${address}"
// locality: "${locality}"
// region: "${region}"
// country: "${addrCountry}"
// twitterCard: false
// ---
// ${content}
// `;
console.log("content:" + JSON.stringify(micropubContent));
const entry ={
    "links": [
        {
            "source": "https://test.com",
            "target" : "http://test2.com"
        },
        {
        "source": "https://ownyourswarm.p3k.io/checkin/5b67f6d193bd63002cdc7a1a/32c452690035aafb2f077bb8432923cf",
      "verified": true,
      "verified_date": "2018-08-06T07:21:17+00:00",
      "id": 540047,
      "private": false,
      "data": {
            "author": {
              "name": "Swarm",
              "url": "https://swarmapp.com/",
              "photo": "https://webmention.io/avatar/ss1.4sqi.net/96fe3389ef056db8717e827a9d0d136c945ab4383641feb80e6596e9ce4a5ad2.png"
            },
            "url": "https://ownyourswarm.p3k.io/checkin/5b67f6d193bd63002cdc7a1a/32c452690035aafb2f077bb8432923cf",
            "name": null,
            "content": "You're the mayor!",
            "published": "2018-08-06T08:20:49+01:00",
            "published_ts": 1533540049,
            "swarm_coins": 9
      },
      "activity": {
        "type": "reply",
        "sentence": "Swarm commented 'You're the mayor!' on a post https://vincentp.me/checkins/2018/08/06/08-20/",
        "sentence_html": "<a href=\"https://swarmapp.com/\">Swarm</a> commented 'You're the mayor!' on a post <a href=\"https://vincentp.me/checkins/2018/08/06/08-20/\">https://vincentp.me/checkins/2018/08/06/08-20/</a>"
      },
      "target": "https://vincentp.me/checkins/2018/08/06/08-20/"
    }
  ]};
    logger.info('Webmention content: ' + JSON.stringify(entry));

    const webmentionContentFormatted = base64.encode(JSON.stringify(entry));
    return webmentionContentFormatted;
};
