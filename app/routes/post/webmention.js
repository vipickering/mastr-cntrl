const rp = require('request-promise');
const base64 = require('base64it');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatWebmention = require(appRootDirectory + '/app/functions/format-webmention');

exports.webmentionPost = function webmentionPost(req, res) {
    const sourceURL = req.body.source;
    const targetURL = req.body.target;
    const webmentionContent = req.body;
    const messageContent = ':robot: Webmentions updated by Mastrl Cntrl';
    const webmentionsToAdd = formatWebmention.webmention(webmentionContent);
    const postFileName = 'test.json';
    const postDestination = github.postUrl + '/contents/_data/' + postFileName;
    const apiOptions = {
        uri : postDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json : true
    };
    let payload;
    let options;
    let currentWebmentions;
    let encodedContent;

    console.log(postDestination);
    console.log(sourceURL);
    console.log(targetURL);

    function handleGithubApiGet(err) {
        logger.info('Github API Get File Failed');
        logger.error(err);
        res.status(400);
        res.send('Internal Error Please Contact Author');
    }

    function handlePatchError(err) {
        logger.info('Webmention update to Github API Failed');
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        res.status(202);
        res.send('Accepted');
    }

    rp(apiOptions)
        .then((repos) => {
            currentWebmentions = base64.decode(repos.content);
            // This is where the webmention is appended to the file. I need to change this here to find the tag to append the content on to
            payload = currentWebmentions.slice(0, 10) + webmentionsToAdd + ',' + currentWebmentions.slice(10);
            console.log('combined' + payload);
            encodedContent = base64.encode(payload);
            console.log('encoded ' + encodedContent);

            options = {
                method : 'PUT',
                uri : postDestination,
                headers : {
                    Authorization : 'token ' + github.key,
                    'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                    'User-Agent' : github.name
                },
                body : {
                    path : postFileName,
                    branch : 'master',
                    message : messageContent,
                    sha : repos.sha,
                    committer : {
                        'name' : github.user,
                        'email' : github.email
                    },
                    content : encodedContent
                },
                json : true
            };

            rp(options)
                .then(functionFinish)
                .catch(handlePatchError);
        })
        .catch(handleGithubApiGet);
};
