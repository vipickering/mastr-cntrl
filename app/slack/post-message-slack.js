const { IncomingWebhook } = require('@slack/webhook');
const config = require(appRootDirectory + '/app/config.js');
const logger = require(appRootDirectory + '/app/logging/bunyan');
exports.sendMessage = function sendMessage(message) {
    const slackToken = config.slack.token;
    if (slackToken){
        logger.info('hello');
        const url = `https://hooks.slack.com/services/${slackToken}`;
        const webhook = new IncomingWebhook(url);

        // Send the notification
        (async () => {
            await webhook.send({
            text: message,
            });
        })();
    }
};
