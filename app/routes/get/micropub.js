const path = require('path');
const functionPath = '/app/functions/';
const appDir = path.dirname(require.main.filename);
const logger = require(appDir + functionPath + 'bunyan');
const fetch = require('node-fetch');

exports.micropub = function micropub(req, res) {
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    const syndicateOptions = {
    "syndicate-to": [{
          "uid": "https://twitter.com/vincentlistens/",
          "name": "Twitter"
        },{
          "uid": "https://micro.blog/vincentp",
          "name": "MicroBlog"
    },{
          "uid": "https://medium.com/@vincentlistens",
          "name": "Medium"
    }]
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

            if ((req.query.q == 'syndicate-to') && (serviceIdentifier == 'https://quill.p3k.io/')) {
                res.json(syndicateOptions);
            } else {
                 res.json({});
            }

      });
};
