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
        const serviceIdentifier = 'Swarm';
        const publishedDate = req.body.properties.published[0];
        const postFileNameDate = publishedDate.slice(0, 10);
        const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9); //https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
        const postFileName = postFileNameDate + '-update-' + postFileNameTime + '.md';

        const destination = github.url + postFileName;
        // const destination = github.url + 'test.md';
        const micropubContent = req.body;
        let payload;

        // 1. ERROR HANDLING NEEDED HERE.
        // Work out if this is from a service we want to post to the blog.
        switch (serviceIdentifier) {
        case 'Swarm':
            logger.info('swarm detected');
            payload = formatCheckin.checkIn(micropubContent);
            logger.info(payload);
            break;
        case 'Instagram':
            logger.info('instagram detected');
            break;
        default:
            logger.info('Not worked');
            logger.info('serviceIdentifier ' + serviceIdentifier);
            // return service code and bad response here.
            // Exit
        }

        const options = {
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
                message : ':robot: Submitted via micropub API',
                committer : {
                    'name' : github.user,
                    'email' : github.email
                },
                content : payload
            },
            json : true
        };

        //Move inside switch?
        request(options, function sendIt(error, response, body) {
            if (error) {
                res.status(400);
                res.send('Player 1 requires keys');
                logger.error('upload failed:' + error);
                throw new Error('failed to send ' + error);
            }
            logger.info('Upload successful!  Server responded with:', body);
            res.status(200);
            res.send('Content received, have a nice day');
        });
    });
};

module.exports = appRouter;
