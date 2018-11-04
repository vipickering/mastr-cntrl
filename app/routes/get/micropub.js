const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const syndicateOptions = require(appRootDirectory + '/app/data/syndication.json');
let serviceIdentifier = '';

exports.micropubGet = function micropubGet(req, res) {
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    if (token) {
        logger.info('Indie Auth Token Received: ' + token);
    } else {
        logger.info('No Indie Auth Token Received');
    }

    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            serviceIdentifier = json.client_id;

            if (serviceIdentifier) {
                logger.info('Service Is: ' + serviceIdentifier);
            } else {
                logger.info('No Service Declared');
            }

            if (req.query.q === 'syndicate-to') {
                res.json(syndicateOptions);
            } else {
                res.json({});
            }
        });
};
