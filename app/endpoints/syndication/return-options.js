const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const syndicationOptions = require(appRootDirectory + '/app/data/syndicate.js');
const config = require(appRootDirectory + '/app/config.js');
const indieauth = config.indieauth;

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

    function authResponse(response) {
        return response.json();
    }

    function micropubResponse(json) {
        logger.info(JSON.stringify(json));

        if (json.client_id) {
            logger.info('Service Is: ' + json.client_id);
        } else {
            logger.info('No Service Declared');
        }

        if (token) {
            logger.info('Indie Auth Token Received:');
            switch (req.query.q) {
            case ('syndicate-to') :
                res.json(returnOptions);
                break;
            case ('config') :
                res.json(returnOptions);
                break;
            default:
                res.json({});
            }
        } else {
            logger.info('No Indie Auth Token Received');
            res.json({});
        }
    }

    // Verify Token. If OK send syndication options or configuration
    fetch(indieauth.url, {method : 'GET', headers : authHeaders})
        .then(authResponse)
        .then(micropubResponse)
        .catch((err) => logger.error(err));
};
