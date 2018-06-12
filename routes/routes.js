const request = require('request');
const base64 = require('base64it');
const config = require('../config');
const github = config.github;
const api = config.api;

const appRouter = function appRouterFunction(app) {
    app.get('/', function appRouterHome(req, res) {
    //If we need to work out file date name, do it like this:
    // let currentTime = new Date();
    // let month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
    // let day = currentTime.getDate();
    // let year = currentTime.getFullYear();
    // date = year + "-" + month + "-" + day;

        res.send('');

        // I should output a nice page here to explain what this is, what it does and its Github Repo.
    });

    // It would be good if errors got published to a webhook, picked up by Slack.
    app.post('/', function appRouterPostman(req, res) {
        const serviceIdentifier = req.body.properties.author[0].properties.name[0]; //Work out where the content came from
        const serviceContent = req.body;
        const publishedDate = req.body.properties.published[0];
        const postFileNameDate = publishedDate.slice(0, 10);
        const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9); //https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
        const postFileName = postFileNameDate + '-update-' + postFileNameTime + '.md'; // TODO: Format file name with correct date
        console.log(postFileName);
        const destination = github.url + postFileName;
        const blogEntry = 'Test Post';
        const blogEntryEncoded =  base64.encode(blogEntry);
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
                message : ':sparkles: Submitted via micropub API',
                committer : {
                    'name' : github.user,
                    'email' : github.email
                },
                content : blogEntryEncoded
            },
            json : true
        };

        // Format Swarm in to post
        function formatSwarm(content) {
            console.log('swarm detected');
            // return;
        }

        // 1. ERROR HANDLING NEEDED HERE.
        // 2. Return the correct server response
        // 3. Turn content in to post
        // 4. Post content to Github on master branch
        // Work out if this is from a service we want to post to the blog.
        switch (serviceIdentifier) {
        case 'Swarm':
            formatSwarm(serviceContent);
            // Fire POST function
            // log event
            // return service code and appropriate response.
            break;
        case 'Instagram':
            console.log('instagram detected');
            break;
        default:
            console.log('Not worked');
            console.log('serviceIdentifier ' + serviceIdentifier);
            // return service code and bad response here.
            // Exit
        }

        //Move inside switch?
        request(options, function sendIt(error, response, body) {
            if (error) {
                console.log(body);
                throw new Error(error);
            }
        });

        res.send('done'); // Modify this to the appropirate server response and code.
    });
};

module.exports = appRouter;
