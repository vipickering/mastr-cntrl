const config = require(appRootDirectory + '/app/config.js');
const twitterDetails = config.twitter;

exports.twitter = function twitter() {
    const twitterUsername = twitterDetails.username;
    const twitterTarget = {
        'uid' : 'Twitter',
        'name' : 'Twitter',
        'service' : {
            'name' : 'twitter',
            'url' : 'https://twitter.com',
            'photo' : 'https://abs.twimg.com/responsive-web/web/icon-ios.8ea219d4.png'
        },
        'user' : {
            'name' : `${twitterUsername}`,
            'url' : `https://twitter.com/${twitterUsername}/`,
            'photo' : 'https://abs.twimg.com/favicons/twitter.ico'
        }
    };

    if (twitterUsername) {
        return twitterTarget;
    } else {
        return {};
    }
};
