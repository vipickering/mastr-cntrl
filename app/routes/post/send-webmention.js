const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const moment = require('moment');
const github = config.github;
const website = config.website;
const webmention = config.webmention;
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.sendWebmention = function sendWebmention(req, res) {
    const messageContent = ':robot: webmentions last sent date updated by Mastrl Cntrl';
    const webmentionsDateFileName = 'published.yml';
    const webmentionsDateFileDestination = github.postUrl + '/contents/_data/' + webmentionsDateFileName;
    const githubApIFileOptions = {
        uri : webmentionsDateFileDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json : true
    };
    const webmentionsOptions = {
        uri : website.url + '/feeds/indieweb/webmentions.json',
        headers : {
            'User-Agent' : 'Request-Promise'
        },
        json : true
    };
    let webmentionSourceDateTime;
    let options;
    let publishedTime;
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
        logger.info('published date update to Github API Failed');
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function webmentionError(err) {
        logger.info('webmentions to send list not available');
        logger.error(err);
        res.status(400);
        res.send('webmentions feed not available');
    }

    function functionFinish() {
        logger.info('Webmentions sent');
        res.status(202);
        res.send('Accepted');
    }

    logger.info(githubApIFileOptions);
    logger.info('Getting current webmention date ');

    // Get the JSON feed from live.
    // If empty, end. Otherwise proceed and update.
    rp(webmentionsOptions)
        .then(function(webmentionData) {
            logger.info(webmentionData.webmentions);
            if (isEmptyObject(webmentionData.webmentions)) {
                logger.info('No Webmentions to send');
                res.status(200);
                res.send('Done');
            } else {
                // Submit webmention to Telegraph
                logger.info('Found Webmentions to send');
                logger.info(`Webmention Source: ${webmentionData.webmentions.source}`);
                logger.info(`Webmention Target: ${webmentionData.webmentions.target}`);

                // Calculate Webmention time from return URL
                let webmentionUrlTemp = webmentionData.webmentions.source;
                let tempDateTime = webmentionUrlTemp.replace(/\D/g,'');
                let tempYear = tempDateTime.slice(0,4);
                let tempMonth = tempDateTime.slice(4,6);
                let tempDay = tempDateTime.slice(6,8);
                let tempTimeHr = tempDateTime.slice(8,10);
                let tempTimeMin = tempDateTime.slice(-2);

                let dateString =`${tempYear}-${tempMonth}-${tempDay}T${tempTimeHr}:${tempTimeMin}:00`;
                let webmentionSourceDateTime = moment(dateString).add(1, 'minutes').format(); //modify to the correct format and add 1 minute

                logger.info('time added ' + webmentionSourceDateTime);

                const telegraphOptions = {
                    method : 'POST',
                    uri : 'https://telegraph.p3k.io/webmention',
                    // uri : 'http://example.com',
                    headers : {
                        'User-Agent' : github.name
                    },
                    form : {
                        token : webmention.telegraph,
                        source : webmentionData.webmentions.source,
                        target : webmentionData.webmentions.target
                    }
                };

                logger.info(telegraphOptions);
                // POST to telegraph API
                rp(telegraphOptions)
                    .then(updateWebmentionPubDate)
                    .catch(handlePatchError);

                // Get the date file from Github, update the date to current date. POST back.
                function updateWebmentionPubDate() {
                    rp(githubApIFileOptions)
                        .then((repos) => {
                            //Get previous published time
                            publishedTime = base64.decode(repos.content);
                            logger.info('old publish time: ' + publishedTime);

                            // reassign published time with time +1 minute
                            publishedTime = `time: "${webmentionSourceDateTime}"`;
                            logger.info('Webmention YAML publish time: ' + publishedTime);

                            //Base 64 Encode for Github API
                            encodedContent = base64.encode(publishedTime);
                            logger.info('payload encoded');

                            //Configure options to PUT file back in Github API
                            options = {
                                method : 'PUT',
                                uri : webmentionsDateFileDestination,
                                headers : {
                                    Authorization : 'token ' + github.key,
                                    'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                                    'User-Agent' : github.name
                                },
                                body : {
                                    path : webmentionsDateFileName,
                                    branch : github.branch,
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
                            //Push file in to Github API.
                            rp(options)
                                .then(functionFinish)
                                .catch(handlePatchError);
                        })
                        .catch(handleGithubApiGet);
                }
            }
        })
        .catch(webmentionError);
};
