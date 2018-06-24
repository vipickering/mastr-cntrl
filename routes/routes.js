const path = require('path');
const appDir = path.dirname(require.main.filename);
const logger = require(appDir + '/functions/bunyan');
const request = require('request');
const config = require(appDir + '/config');
const github = config.github;
const formatCheckin = require(appDir + '/functions/format-swarm');

const appRouter = function appRouterFunction(app) {
    app.get('/', (req, res) => {
        res.render('index');
    });

    // Publish Elsewhere, Syndicate (to your) Own Site Endpoint.
    app.post('/pesos', function appRouterPostman(req, res) {
        // const serviceIdentifier = req.body.properties.author[0].properties.name[0]; //Work out where the content came from
        let postFileName;
        let responseLocation;
        let payload;
        let messageContent;
        let payloadOptions;
        const token = req.header.Authorization;
        let serviceIdentifier = 'Swarm'; // TODO!
        const publishedDate = req.body.properties.published[0];
        const postFileNameDate = publishedDate.slice(0, 10);
        const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
        const responseDate = postFileNameDate.replace(/-/g, '/');
        const responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);
        const micropubContent = req.body;
        logger.info(req.header);
        // Get Indie Auth token from header, verify with https://tokens.indieauth.com
        // payloadOptions = {
        //     method : 'GET',
        //     url : 'https://tokens.indieauth.com/token',
        //     headers : {
        //         'Accept' : 'application/json',
        //         'Authorization' : token
        //     },
        //     json : true
        // };

        /*
        HTTP/1.1 200 OK
Content-Type: application/json

{
  "me": "https://aaronparecki.com/",
  "client_id": "https://ownyourgram.com",
  "scope": "post",
  "issued_at": 1399155608,
  "nonce": 501884823
}
*/
        // request(payloadOptions, function sendIt(error, response, body) {
        //     if (error) {
        //         serviceIdentifier = 'Invalid';
        //         logger.info('Invalid request:', body);
        //     } else {
        //         logger.info('header ' + req.header);
        //         logger.info('body ' + req.body);
        //         logger.info('request ' + req.header);
        //     }
        //     res.writeHead(200);
        //     res.end('Thanks\n');
        // });

        // Work out if this is from a service we want to post to the blog.
        switch (serviceIdentifier) {
        case 'Swarm':
            logger.info('Swarm detected');
            payload = formatCheckin.checkIn(micropubContent);
            messageContent = ':robot: Checkin submitted via micropub API and ownyourswarm';
            postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
            responseLocation = 'https://vincentp.me/checkins/' + responseDate + '/' + responseLocationTime + '/';
            logger.info('response location ' + responseLocation);
            break;
        case 'Instagram':
            logger.info('Instagram detected');
            messageContent = ':robot: Instagram photo submitted via micropub API  and ownyourgram';
            postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
            responseLocation = 'https://vincentp.me/instagram/' + responseDate + '/' + responseLocationTime + '/';
            logger.info('response ' + responseLocation);
            break;
        default:
            logger.info('Not worked');
            logger.info('serviceIdentifier ' + serviceIdentifier);
            // return service code and bad response here.
            // Exit
        }

        const destination = github.url + postFileName;
        logger.info('destination ' + destination);
        payloadOptions = {
            method : 'PUT',
            url : destination,
            headers : {
                Authorization : 'token ' + github.key,
                'Content-Type' : 'application/json',
                'User-Agent' : github.name
            },
            body : {
                path : postFileName,
                branch : github.branch,
                message : messageContent,
                committer : {
                    'name' : github.user,
                    'email' : github.email
                },
                content : payload
            },
            json : true
        };

        //Move inside switch?
        request(payloadOptions, function sendIt(error, response, body) {
            if (error) {
                res.status(400);
                res.send('Player 1 requires keys');
                logger.error('Git creation failed:' + error);
                throw new Error('failed to send ' + error);
            }
            logger.info('Git creation successful!  Server responded with:', body);
            res.writeHead(201, {
                'location' : responseLocation
            });
            res.end('Thanks\n');
        });
    });
};

module.exports = appRouter;
