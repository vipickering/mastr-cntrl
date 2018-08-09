const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatWebmention = require(appRootDirectory + '/app/functions/format-webmention');

exports.webmentionPost = function webmentionPost(req, res) {
    const sourceURL = req.body.source;
    const targetURL = req.body.target;
    const webmentionContent = req.body;
    let messageContent = ':robot: Webmentions updated by Mastrl Cntrl';
    let payload = formatWebmention.webmention(webmentionContent);
    let shaContent;
    let postFileName = "test.json";
    let  postDestination = github.postUrl + '/contents/_data/' + postFileName;
    // let fileLocation= 'https://api.github.com/repos/vipickering/vincentp/contents/_data/test.json';
    let apiOptions = {
        uri: postDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json: true
    };

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



    /*
    do promise 1
    . then next thing
    .then next thing
    .catch errors (return bad response)
    .finally (close anything left open and return good response)

    */

    function assignThing (req, res) {
        logger.info('shaContent' + shaContent);
        logger.info('res.body.sha' + res.body.sha);
        shaContent = req.body.sha;
        logger.info('shaContent' + shaContent);
        logger.info('res.body.sha' + res.body.sha);
    }

    rp(apiOptions)
        .then(function (repos){
              console.log(repos.sha);
            let options = {
        method : 'PUT',
        uri : postDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        body : {
            path : postFileName,
            branch : github.branch,
            message : messageContent,
            sha : repos.sha,
            committer : {
                'name' : github.user,
                'email' : github.email
            },
            content : payload
        },
        json : true
    };
            console.log(options);
                rp(options)
                 .catch(handlePatchError);
        })
        .catch(function (err) {
            logger.info('Github API Get File Failed');
            logger.error(err);
            res.status(400);
            res.send('Internal Error Please Contact Author');
        });

};


// Get sha to master
// https://api.github.com/repos/vipickering/vincentp/git/refs
// https://api.github.com/repos/vipickering/vincentp/git/trees/7770fadd9ef26e42d1c3cfa0495cbd49368399f8

//File to update
// https://api.github.com/repos/vipickering/vincentp/contents/_data/webmentions.json
// Then get sha req.body.sha
// assign to sha in PUT/PATCH request
