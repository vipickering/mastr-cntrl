const rp = require('request-promise');
const base64 = require('base64it');
const moment = require('moment');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const webhookKey = config.webmention.webhook;

exports.webmentionPost = function webmentionPost(req, res) {
    const messageContent = ':robot: Webmentions updated by Mastrl Cntrl';

    let payload;
    let options;
    let encodedContent;

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

    logger.info('Webmention Debug: ' + req.body);

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

        // use moment -> const currentTime  =  moment().format('YYYY-MM-DDTHH:mm:ss');
        const filePath = moment(webmention['wm-received'][0]).format('YYYY/MM/DD');
        // Get file name from wm-id
        const postDestination = `${github.postUrl}/contents/_data/${filePath}/${webmention['wm-id'][0]}`;
        const postFileName = `${webmention['wm-id'][0]}.json`;

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
