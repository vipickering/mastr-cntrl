// Depricated. Will be moved to Netlify Function

const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const moment = require('moment');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');
const webmention = config.webmention;
const github = config.github;
const telegraph = config.telegraph;

exports.sendWebmention = function sendWebmention(req, res) {
    let webmentionSourceDateTime;
    let publishedTime;
    let payload;
    const fileName = 'pubdate.json';
    const fileLocation = github.postUrl + '/contents/src/_data/' + fileName;
    const responseLocation = fileLocation;
    const getGithubFile = {
        uri : fileLocation,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json : true
    };
    const getWebmentionFeed = {
        uri : webmention.feed,
        headers : {
            'User-Agent' : 'Request-Promise'
        },
        json : true
    };

    function handleGithubApiGet(err) {
        logger.info('Github API Get File Failed');
        logger.error(err);
        res.status(400);
        res.send('Internal Error Please Contact Author');
    }

    function githubApiPublishError(err) {
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

    // Get the date file from Github, update the date to current date. POST back.
    function updateWebmentionPubDate() {
        rp(getGithubFile)
            .then((repos) => {
                //Get previous published time
                publishedTime = base64.decode(repos.content);
                logger.info('old publish time: ' + publishedTime);

                // reassign published time with time +1 minute
                publishedTime = `{"time": "${webmentionSourceDateTime}"}`;
                logger.info('Webmention JSON publish time: ' + publishedTime);

                //Base 64 Encode for Github API
                payload = base64.encode(publishedTime);
                logger.info('payload encoded');

                githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload);
            })
            .catch(handleGithubApiGet);
    }

    logger.info(getGithubFile);
    logger.info('Getting current webmention date ');

    // Get my webmention JSON feed from the Github API
    rp(getWebmentionFeed)
        .then(function SendToTelegraph(webmentionData) {
            logger.info(`Webmentions data: ${webmentionData.webmentions}`);
            if (webmentionData.webmentions.hasOwnProperty('time')) {
                // Parse feed info and submit webmention to Telegraph
                logger.info('Found Webmentions to send');
                logger.info(`Webmention Source: ${webmentionData.webmentions.source}`);
                logger.info(`Webmention Target: ${webmentionData.webmentions.target}`);

                // Calculate Webmention time from return URL
                const webmentionUrlTemp = webmentionData.webmentions.source;
                const tempDateTime = webmentionUrlTemp.replace(/\D/g,'');
                const tempYear = tempDateTime.slice(0, 4);
                const tempMonth = tempDateTime.slice(4, 6);
                const tempDay = tempDateTime.slice(6, 8);
                const tempTimeHr = tempDateTime.slice(8, 10);
                const tempTimeMin = tempDateTime.slice(-2);

                const dateString = `${tempYear}-${tempMonth}-${tempDay}T${tempTimeHr}:${tempTimeMin}:00`;
                webmentionSourceDateTime = moment(dateString).add(1, 'minutes').format(); //modify to the correct format and add 1 minute

                logger.info('time added ' + webmentionSourceDateTime);

                const telegraphOptions = {
                    method : 'POST',
                    uri : telegraph.url,
                    headers : {
                        'User-Agent' : github.name
                    },
                    form : {
                        token : telegraph.token,
                        source : webmentionData.webmentions.source,
                        target : webmentionData.webmentions.target
                    }
                };

                logger.info(telegraphOptions);

                // POST to telegraph API
                rp(telegraphOptions)
                    .then(updateWebmentionPubDate)
                    .catch(githubApiPublishError);
            } else {
                logger.info('No Webmentions to send');
                res.status(200);
                res.send('Done');
            }
        })
        .catch(webmentionError);
};
