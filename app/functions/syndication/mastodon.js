// const rp = require('request-promise');
// const readline = require('readline');
// const Mastodon = require('megalodon');
// const logger = require(appRootDirectory + '/app/functions/bunyan');
// const config = require(appRootDirectory + '/app/config.js');
// const mastodon = config.mastodon;

exports.mastodon = function mastodon(micropubContent) {
//     const BASE_URL = mastodon.url;
//     const access_token = mastodon.accessToken;

//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout
//     });

//    const client = new Mastodon(
//         access_token,
//         BASE_URL + '/api/v1'
//     );

//     new Promise(resolve => {
//         rl.question('Toot: ', status => {
//             client.post('/statuses', {
//                 status: status
//             })
//             .then(res => {
//                 logger.info(res);
//                 rl.close();
//             })
//             .catch(err => {
//                 logger.info(err);
//                 rl.close();
//             })
//         })
//     });
logger.info('test');
};
