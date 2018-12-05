const rp = require('request-promise');
const fetch = require('node-fetch'); //Swap for RP
const request = require('request'); //Swap for RP
const moment = require('moment');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatCheckin = require(appRootDirectory + '/app/functions/formatters/swarm');
const formatInstagram = require(appRootDirectory + '/app/functions/formatters/instagram');
const formatNote = require(appRootDirectory + '/app/functions/formatters/note');

exports.micropubPost = function micropubPost(req, res) {
    let serviceIdentifier = '';
    let postFileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    let publishedDate;
    let postDestination;
    let noteType;
    let serviceType;
    let postFileNameDate;
    let postFileNameTime;
    let responseDate;
    let responseLocationTime;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    //Log packages sent, for debug
    logger.info('json body ' + JSON.stringify(req.body));

    //Some P3K services send the published date-time. Others do not. Check if it exists, and if not do it ourselves.
    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }

    //Format date time for naming file.
    postFileNameDate = publishedDate.slice(0, 10);
    postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    responseDate = postFileNameDate.replace(/-/g, '/');
    responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            logger.info(JSON.stringify(json));
            serviceIdentifier = json.client_id;
            logger.info('Service Is: ' + serviceIdentifier);

            switch (serviceIdentifier) {
            case 'https://ownyourswarm.p3k.io':
                serviceType = 'Checkin';
                noteType = 'checkins';
                logger.info('Creating Swarm checkin');
                payload = formatCheckin.checkIn(micropubContent);
                break;
            case 'https://ownyourgram.com/':
                serviceType = 'Photo';
                noteType = 'notes';
                logger.info('Creating Instagram note');
                payload = formatInstagram.instagram(micropubContent);
                break;
            case 'https://quill.p3k.io/':
                // At this point I need to look at the note types and route in to the correct formatter.
                serviceType = 'Note'; // Needs updating to different types
                noteType = 'notes'; // Separate Likes, etc?
                logger.info('Creating Quill xxx');
                payload = formatNote.note(micropubContent);
                break;
            default:
                serviceType = 'Note';
                noteType = 'notes';
                logger.info('Creating default Note');
                payload = formatNote.note(micropubContent);
            }

            messageContent = `:robot: ${serviceType}  submitted by Mastrl Cntrl`;
            postFileName = `${postFileNameDate}-${postFileNameTime}.md`;
            responseLocation = `https://vincentp.me/${noteType}/${responseDate}/${responseLocationTime}`;
            logger.info(`Response: ${responseLocation}`);
            postDestination = `${github.postUrl}/contents/_posts/${postFileName}`;
            logger.info(`Destination: ${postDestination}`);

            payloadOptions = {
                method : 'PUT',
                url : postDestination,
                headers : {
                    Authorization : `token ${github.key}`,
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
                    content : payload
                },
                json : true
            };

            // The error checking here is poor. We are not handling if GIT throws an error.
            request(payloadOptions, function sendIt(error, response, body) {
                if (error) {
                    res.status(400);
                    res.send('Error Sending Payload');
                    logger.error(`Git creation failed: ${error}`);
                    res.end('Error Sending Payload');
                    throw new Error(`Failed to send: ${error}`);
                } else {
                    logger.info('Git creation successful!  Server responded with:', body);
                    res.writeHead(201, {
                        'location' : responseLocation
                    });
                    res.end('Thanks');
                }
            });
        })
        .catch((err) => logger.error(err));
};
