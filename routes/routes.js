var request = require('request');
var base64 = require('base64it');

const appRouter = function(app) {
    app.get('/', function(req, res) {
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
    app.post('/', function(req, res) {
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
        const githubURL = process.env.GITHUB_HOST + '/repos/' + process.env.GITHUB_NAME + '/' + process.env.GITHUB_REPO + '/contents/_posts/' + postFileName;
        const blogEntry = 'Test Post';
        const blogEntryEncoded =  base64.encode(blogEntry);

        const options = {
            method : 'PUT',
            url : githubURL,
            headers : {
                Authorization : 'token ' + process.env.GITHUB_KEY,
                'Content-Type' : 'application/json',
                'User-Agent' : process.env.GITHUB_NAME
            },
            body : {
                path : postFileName,
                branch : process.env.MICROPUB_BRANCH,
                message : ':sparkles: Submitted via micropub API',
                committer : {
                    'name' : process.env.GITHUB_USER,
                    'email' : process.env.GITHUB_USER_EMAIL
                },
                content : blogEntryEncoded
            },
            json : true
        };

        request(options, function(error, response, body) {
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
