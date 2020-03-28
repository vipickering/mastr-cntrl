const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const syndicationOptions = require(appRootDirectory + '/app/data/syndication.json');
let serviceIdentifier = '';

/**
 Endpoint is used to return syndication options, to authorised clients only.
 */
exports.micropubGet = function micropubGet(req, res) {
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    function authResponse(response) {
        return response.json();
    }

    function micropubResponse(json) {
        logger.info(JSON.stringify(json));
        serviceIdentifier = json.client_id;

        if (serviceIdentifier) {
            logger.info('Service Is: ' + serviceIdentifier);
        } else {
            logger.info('No Service Declared');
        }

        switch (req.query.q) {
        case ('syndicate-to') :
            res.json(syndicationOptions);
            break;
        case ('config') :
            res.json(syndicationOptions);
            break;
        default:
            res.json({});
        }
    }

    if (token) {
        logger.info('Indie Auth Token Received:');
    } else {
        logger.info('No Indie Auth Token Received');
    }

    // Verify Token. If OK send syndication options or configuration
    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(authResponse)
        .then(micropubResponse)
        .catch((err) => logger.error(err));
};
