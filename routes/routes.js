var request = require("request");
var base64 = require("base64it");

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

        const encoder = require(appRootDirectory + '/functions/base64Encode');
        const postFileName = '2018-06-10-test-post.md'; // TODO: Format file name with correct date
        const githubURL = 'https://api.github.com/repos/' + process.env.GITHUB_NAME + '/' + process.env.GITHUB_REPO + '/contents/_posts/' + postFileName;
        const postContent = 'Test Post';
        const postContentEncoded =  base64.encode(postContent);

        console.log(postContentEncoded);

        let options = {
            method: 'PUT',
            url: githubURL,
            headers: {
                Authorization: 'token ' + process.env.GITHUB_KEY,
                'Content-Type': 'application/json',
                'User-Agent': process.env.GITHUB_NAME
                },
            body: {
                path: postFileName,
                branch: process.env.MICROPUB_BRANCH,
                message: ':sparkles: Submitted via micropub API',
                committer: {
                    'name' : process.env.GITHUB_USER,
                    'email' : process.env.GITHUB_USER_EMAIL
                },
                content: postContentEncoded
            },
            json: true
        };

         request(options, function (error, response, body) {
          if (error) throw new Error(error);

          console.log(body);
        });

        // 1. ERROR HANDLING NEEDED HERE.
        // 2. Return the correct server response
        // 3. Turn content in to post
        // 4. Post content to Github on micropub branch
        // 5. Raise pull request?

    });
};

module.exports = appRouter;
