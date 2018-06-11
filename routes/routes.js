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
        console.log(req.body); // This is how to get the content posted to the server.

        // Parse the JSON and check this is a correct post type
        // when creating the file we need more than dates now

        //properties.author.properties.name = 'Swarm'; // This is how to identify Swarm data

        // switch (req.body){
        //     case: senda;
        //     case: asd;
        //     break;
        // }

        //Turn the code in to JSON?
        // let sourceEntry =  JSON.stringify(req.body);

        const postFileName = '2018-06-10-test-post.md'; // TODO: Format file name with correct date
        const payload = github.url + postFileName;
        const blogEntry = 'Test Post';
        const blogEntryEncoded =  base64.encode(blogEntry);

        const options = {
            method : 'PUT',
            url : payload,
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

        request(options, function sendIt(error, response, body) {
            if (error) {
                console.log(body);
                throw new Error(error);
            }
        });

        // 1. ERROR HANDLING NEEDED HERE.
        // 2. Return the correct server response
        // 3. Turn content in to post
        // 4. Post content to Github on micropub branch
        // 5. Raise pull request?

        res.send('done'); // Modify this to the appropirate server response and code.
    });
};

module.exports = appRouter;
