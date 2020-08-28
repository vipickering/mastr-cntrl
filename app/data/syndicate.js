const config = require(appRootDirectory + '/app/config.js');
const syndicationTarget = require(appRootDirectory + '/app/data/targets/twitter.js');
const mastrCntrl = config.mastrCntrl;

/*
Create the return options JSON file from the .env values
*/

exports.createJSON = function createJSON() {
    const mastrCntrlURL = mastrCntrl.url;
    const syndicationTargets = syndicationTarget.twitter(); //extend later for other targets
    const jsonFile = {
        'media-endpoint' : `${mastrCntrlURL}/media`,
        'syndicate-to' : [
            syndicationTargets
        ],
        'post-types' : [{
            'type' : 'note',
            'name' : 'Note'
        },
        {
            'type' : 'article',
            'name' : 'Blog Post'
        },
        {
            'type' : 'photo',
            'name' : 'Photo'
        },
        {
            'type' : 'reply',
            'name' : 'Reply'
        },
        {
            'type' : 'like',
            'name' : 'Like'
        },
        {
            'type' : 'repost',
            'name' : 'Repost'
        },
        {
            'type' : 'rsvp',
            'name' : 'RSVP'
        },
        {
            'type' : 'bookmark',
            'name' : 'Bookmark'
        }]
    };

    return jsonFile;
};
