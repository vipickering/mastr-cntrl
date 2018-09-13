const fetch = require('node-fetch');
const rp = require('request-promise');
const base64 = require('base64it');
const moment = require('moment');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const webmention = config.webmention;
const github = config.github;

// Delete after solving merge issue.
const test = 'https://webmention.io/api/mentions?domain=vincentp.me&since=since=2018-09-08T10:00:00-0700&token=aSJ1xen947l7hz4e42KlYw';

// We want to run the scheduler at 1am and GET all webmentions for the previous day.
const yesterday  =  moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss+01:00');

const webmentionIO = 'https://webmention.io/api/mentions?domain=vincentp.me&since=since=' + test + '&token=' + webmention.token;
const formatWebmention = require(appRootDirectory + '/app/functions/format-webmention');

exports.webmentionUpdateGet = function webmentionUpdateGet(req, res) {
    const messageContent = ':robot: Webmentions updated by Mastrl Cntrl';
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

    function isEmptyObject(obj) {
        return !Object.keys(obj).length;
    }

    function isEmptyObject(obj) {
      for (var key in obj) {
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
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        res.status(202);
        res.send('Accepted');
    }

    logger.info(webmentionIO);


/*
Not working. I need to remove the square brackets from the code being inserted.

*/
    fetch(webmentionIO)
        .then(res => res.json())
        .then(function(json) {
            if (isEmptyObject(json.links)) {
                // There are no webmentions so quit.
                res.status(200);
                res.send('Done');
            } else {
                // There is at least one webmention
                logger.info(today);
                const webmentionsToAdd = formatWebmention.webmention(json.links);
                rp(apiOptions)
                    .then((repos) => {
                        currentWebmentions = base64.decode(repos.content);

                        // https://stackoverflow.com/questions/18884840/adding-a-new-array-element-to-a-json-object
                        // I think I need to parse the JSON currentWebmentions here, then insert the webmentionsToAdd, then stringify it to put it back.
                        let obj = JSON.parse(currentWebmentions);
                        obj['links'].push(webmentionsToAdd);
                        payload = JSON.stringify(obj);
                        // payload = currentWebmentions.slice(0, 10) + webmentionsToAdd + ',' + currentWebmentions.slice(10);
                        logger.info('combined' + payload);
                        encodedContent = base64.encode(payload);
                        logger.info('encoded');

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
            }
            return;
        });
};
