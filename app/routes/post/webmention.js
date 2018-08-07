const bodyParser = require('body-parser');
const rp = require('request-promise');
const validUrl = require('valid-url');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatWebmention = require(appRootDirectory + '/app/functions/format-webmention');

exports.webmentionPost = function webmentionPost(req, res) {
    console.log(config);
    let sourceURL = req.body.source;
    let targetURL = req.body.target;
    const webmentionContent = req.body;
    let checkSourceDomain = false;
    let checkTargetDomain = false;
    let checkSourceDomainFormat = false;
    let checkTargetDomainFormat = false;
    let checkDifferentUrls = false;
    let messageContent = ':robot: Webmentions updated by Mastrl Cntrl';
    let payload;
    let webmentionFileName = "test.json";
    let postDestination = github.postUrl + '/contents/_data/' + webmentionFileName;
    let webmentionsOptions = {
        method : 'PATCH',
        url : postDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        body : {
            path : webmentionFileName,
            branch : github.branch,
            message : messageContent,
            committer : {
                'name' : github.user,
                'email' : github.email
            },
            content : payload
        },
        json : true
    };

    function checkStatus(res) {
        if (res.status >= 200 && res.status < 300) {
            logger.info(res);
            return res;
        } else {
            let err = new Error(res.statusText);
            err.response = res;
            throw err;
        }
    }

    function checkValidSourceFormat(url) {
        if (validUrl.isUri(url)) {
             logger.info('Webmention ' + url + ' in valid format');
             checkSourceDomainFormat = true;
        } else {
            logger.info('Webmention ' + url + ' invalid format');
            checkSourceDomainFormat = false;
        }
    }

    function checkValidTargetFormat(url) {
        if (validUrl.isUri(url)) {
             logger.info('Webmention ' + url + ' is valid format');
             checkTargetDomainFormat = true;
        } else {
            logger.info('Webmention ' + url + ' is invalid format');
            checkTargetDomainFormat = false;
        }
    }

    function checkDomainMatch(source,target) {
        if (source !== target) {
            return checkDifferentUrls = true;
        } else {
            return checkDifferentUrls = false;
        }
    }

    function processSourceUrl() {
       checkSourceDomain = true;
        logger.info('Webmention Source OK');
        rp(targetURL)
            .then(processTargetUrl)
            .catch(handleErrorTargetUrl);
    }

    function processTargetUrl() {
       checkTargetDomain = true;
        logger.info('Webmention Target OK');
        processWebmention(); // Call logic here to process request, use finally?
    }

    function handleErrorSourceUrl(err) {
        checkSourceDomain = false;
        logger.info('Webmention Source Failed');
        logger.error(err);
        res.status(400);
        res.send('Source URL is invalid');
    }

    function handleErrorTargetUrl(err) {
        checkSourceDomain = false;
        logger.info('Webmention Source Failed');
        logger.error(err);
        res.status(400);
        res.send('Target URL is invalid');
    }

    function handlePatchError(err) {
        logger.info('Webmention PATCH operation to Github API Failed');
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function processWebmention () {
        if ((checkDifferentUrls === true)  && (checkSourceDomain === true) && (checkTargetDomain === true) && (checkSourceDomainFormat === true) && (checkTargetDomainFormat === true)) {
            payload = formatWebmention.webmention(webmentionContent);
            rp(webmentionsOptions)
                .catch(handlePatchError);
            logger.info('Webmention Accepted');
            res.status(202);
            res.send('Accepted');
       } else if (checkDifferentUrls === false) {
            logger.info('Webmention Source and Target URL do not match');
            res.status(400);
            res.send('Source and Target URL should not match');
       } else if (checkSourceDomain === false) {
            logger.info('Webmention Source URL is invalid');
            res.status(400);
            res.send('Source URL is invalid');
        } else if (checkTargetDomain === false) {
            logger.info('Webmention Target URL is invalid');
            res.status(400);
            res.send('Target URL is invalid');
        } else if (checkSourceDomainFormat === false || checkTargetDomainFormat === false) {
            logger.info('Webmention URL is invalid');
            res.status(400);
            res.send('Webmention URL is invalid');
        } else {
            logger.info('bad wemention request');
            res.status(400);
            res.send('Bad Request');
        }
    }

        //Test URLs are valid format.
    logger.info('Webmention source: ' + sourceURL);
    checkValidSourceFormat(sourceURL);

    logger.info('Webmention target: ' + targetURL);
    checkValidTargetFormat(targetURL);

    // Test URLS not identical
    checkDomainMatch(sourceURL,targetURL );

    // Check that the source and target exist and are real, then process the request.
    rp(sourceURL)
        .then(processSourceUrl)
        .catch(handleErrorSourceUrl);

};
