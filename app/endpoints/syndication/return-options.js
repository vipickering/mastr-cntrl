const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const syndicationOptions = require(appRootDirectory + '/app/data/syndicate.js');
const config = require(appRootDirectory + '/app/config.js');
const indieauth = config.indieauth;
const website = config.website;

/**
 Endpoint is used to return syndication options, to authorised clients only.
 */

exports.micropubGet = function micropubGet(req, res) {
    const token = req.headers.authorization;
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };
    const returnOptions = syndicationOptions.createJSON();
    const websiteURL = website.url + ('/');

    function authResponse(response) {
        return response.json();
    }

    function micropubResponse(json) {
        logger.info(JSON.stringify(json));
        logger.info(json.me);
        logger.info(website.url);

        if (json.me !== websiteURL) {
            logger.info('Not Authorised');
            return res.status(403); // Compare if the requester is the one who owns the website, otherwise its a breach and not authorised
        }

        logger.info('Indie Auth Token Received:');
        switch (req.query.q) {
        case ('syndicate-to') :
            res.status(200);
            return res.json(returnOptions);
        case ('config') :
            res.status(200);
            return res.json(returnOptions);
        default:
            res.status(200);
            return res.json({});
        }
    }

    // Verify Token. If OK send syndication options or configuration
    fetch(indieauth.url, {method : 'GET', headers : authHeaders})
        .then(authResponse)
        .then(micropubResponse)
        .catch((err) => logger.error(err));
};
