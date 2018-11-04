const fetch = require('node-fetch');
const rp = require('request-promise');
const base64 = require('base64it');
const moment = require('moment');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

// Get from https://vincentp.me/feeds/indieweb/webmentions.json
// Post date back to https://github.com/vipickering/vincentp/blob/master/_data/published.yml

exports.webmentionSend = function webmentionSend(req, res) {
    const messageContent = ':robot: Webmentions sent by Mastrl Cntrl';
    const postFileName = 'webmentions.json';

    const postDestination = github.postUrl + '/feeds/indieweb/' + postFileName;
    const githubApIGetOptions = {
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
    // let currentWebmentions;
    let encodedContent;

    function isEmptyObject(obj) {
        return !Object.keys(obj).length;
    }

    function isEmptyObject(obj) {
        let key;

        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    function handleGithubApiGet(err) {
        logger.info('Github API Get File Failed');
        logger.error(err);
        res.status(400);
        res.send('Internal Error Please Contact Author');
    }

    function handlePatchError(err) {
        logger.info('Webmention update to Github API Failed');
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        logger.info('Webmentions sent');
        res.status(202);
        res.send('Accepted');
    }

    //https://gist.github.com/dougalcampbell/2024272
    function strencode(data) {
        return unescape(encodeURIComponent(JSON.stringify(data)));
    }

    //https://gist.github.com/dougalcampbell/2024272
    function strdecode(data) {
        return JSON.parse(decodeURIComponent(escape(data)));
    }

    logger.info(githubApIGetOptions);
    logger.info('Getting pending webmention feed ');

// When pinged
//  GET JSON file
    // Check if array is 0 and only proceed if it is not.
    // Loop through Webmentions
        //POST each one sequentially to Telegram
    // Update published date to  current date/time


 rp(githubApIGetOptions)
        .then((repos) => {
            currentWebmentions = base64.decode(repos.content);
            logger.info(currentWebmentions);
            logger.info(strdecode(currentWebmentions));

            // const currentWebmentionsParsed = strdecode(currentWebmentions);
                // currentWebmentionsParsed['links'].push(webmentionsToAdd);

                // Prepare the code to send to Github API
                // payload = strencode(currentWebmentionsParsed);
                // logger.info('payload combined');

                //Base 64 Encode for Github API
                // encodedContent = base64.encode(payload);
                // logger.info('payload encoded');

                // Configure options to PUT file back in Github API
                // options = {
                //     method : 'PUT',
                //     uri : postDestination,
                //     headers : {
                //         Authorization : 'token ' + github.key,
                //         'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                //         'User-Agent' : github.name
                //     },
                //     body : {
                //         path : postFileName,
                //         branch : github.branch,
                //         message : messageContent,
                //         sha : repos.sha,
                //         committer : {
                //             'name' : github.user,
                //             'email' : github.email
                //         },
                //         content : encodedContent
                //     },
                //     json : true
                // };
                // Push file in to Github API.
                // rp(options)
                // .then(functionFinish)
                // .catch(handlePatchError);
            })
        // .catch(handleGithubApiGet);

logger.info('success!');
res.status(200);
res.send('Done');
};
