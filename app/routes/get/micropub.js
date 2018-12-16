const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const syndicationOptions = require(appRootDirectory + '/app/data/syndication.json');
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

    //Needs rationalising in to one function
    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(function authResponse(response) {
            return response.json();
        })
        .then(function micropubResponse(json) {
            serviceIdentifier = json.client_id;

            if (serviceIdentifier) {
                logger.info('Service Is: ' + serviceIdentifier);
            } else {
                logger.info('No Service Declared');
            }

            // What gets returned is in a state of flux at the moment. I am returning both syndication and media endpoint data for either request.
            if (req.query.q === 'syndicate-to') {
                res.json(syndicationOptions);
            } else if (req.query.q === 'config') {
                res.json(syndicationOptions);
            } else {
                res.json({});
            }
        });
};
