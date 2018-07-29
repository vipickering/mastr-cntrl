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
    logger.info('Token Received: ' + token);

    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        serviceIdentifier = json.client_id;
        logger.info('Service Is: ' + serviceIdentifier);

        if ((req.query.q === 'syndicate-to') && (serviceIdentifier === 'https://quill.p3k.io/')) {
            res.json(syndicateOptions);
        } else {
            res.json({});
        }
    });
};
