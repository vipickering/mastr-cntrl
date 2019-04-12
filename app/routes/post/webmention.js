const rp = require('request-promise');
const base64 = require('base64it');
const moment = require('moment');
const tz = require('moment-timezone');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const webhookKey = config.webmention.webhook;

exports.webmentionPost = function webmentionPost(req, res) {
    const messageContent = ':robot: Webmentions updated by Mastrl Cntrl';

    let payload;
    let options;
    let encodedContent;
    let filePath;
    let postDestination;
    let postFileName;
    let webmentionDate;
    let fileName;

    function handlePatchError(err) {
        logger.info('Webmention update to Github API Failed');
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        logger.info('Webmentions complete');
        res.status(202);
        res.send('Accepted');
    }

    // CAUTION apostrophes etc still do not work in webmentions
    // TODO Investiagate if shared encoding function fixed this.
    //https://gist.github.com/dougalcampbell/2024272
    function strencode(data) {
        return unescape(encodeURIComponent(JSON.stringify(data)));
    }

    // CAUTION apostrophes etc still do not work in webmentions
    //https://gist.github.com/dougalcampbell/2024272
    // function strdecode(data) {
    //     return JSON.parse(decodeURIComponent(escape(data)));
    // }

    // logger.info('Webmention Debug: ' + JSON.stringify(req.body));

    if (req.body.secret === webhookKey) {
        logger.info('Webmention recieved');
        const webmention = req.body.post;
        logger.info('Creating Webmention: ' + strencode(webmention));

        // Prepare the code to send to Github API
        payload = strencode(webmention);
        logger.info('payload combined');

        //Base 64 Encode for Github API
        encodedContent = base64.encode(payload);
        logger.info('payload encoded');

        //Should we nest these related try catches?
        try {
            webmentionDate = webmention['wm-received'][0];
            logger.info(webmentionDate);
        } catch (e){
            logger.info('wm-received [0] failed');
        }

        try {
            webmentionDate = webmention['wm-received'];
            logger.info(webmentionDate);
        } catch (e){
            logger.info('wm-received [0] failed');
        }

        try {
            webmentionDate = webmention['published'];
            logger.info(webmentionDate);
        } catch (e){
            logger.info('published date failed');
        }

        try {
            fileName = webmention['wm-id'][0];
            logger.info(fileName);
        } catch (e){
            logger.info('wm-id [0] failed');
        }

        try {
            fileName = webmention['wm-id'];
            logger.info(fileName);
        } catch (e){
            logger.info('wm-id failed');
        }

        filePath = moment(webmentionDate).format('YYYY/MM/DD');
        logger.info("file path: " + filePath);
        postFileName = `${fileName}.json`;
        postDestination = `${github.postUrl}/contents/_data/webmention/${filePath}/${postFileName}`;

        // let webmentionAction = webmention['wm-id'];

        //GET uri, if it doesn't exist, insert file. Otherwise update and add SHA.
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
                branch : github.branch,
                message : messageContent,
                committer : {
                    'name' : github.user,
                    'email' : github.email
                },
                content : encodedContent
            },
            json : true
        };
        // Push file in to Github API.
        rp(options)
            .then(functionFinish)
            .catch(handlePatchError);
    } else {
        res.status(400);
        res.send('Secret incorrect');
    }
};
