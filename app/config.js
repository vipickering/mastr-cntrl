/*eslint no-process-env: "off"*/
const config = {};

config.github = {
    'postUrl' : process.env.GITHUB_HOST + '/repos/' + process.env.GITHUB_NAME + '/' + process.env.GITHUB_REPO,
    'key' : process.env.GITHUB_KEY,
    'repo' : process.env.GITHUB_REPO,
    'name' : process.env.GITHUB_NAME,
    'user' : process.env.GITHUB_USER,
    'email' : process.env.GITHUB_USER_EMAIL,
    'host' : process.env.GITHUB_HOST,
    'branch' : process.env.GITHUB_BRANCH
};

config.api = {
    'port' : process.env.API_PORT
};

config.webmentionIO = {
    'webhookToken' : process.env.WEBMENTION_WEBHOOK_TOKEN
};

config.webmention = {
    'feed' : process.env.WEBMENTION_FEED
};

config.indieauth = {
    'url' : process.env.INDIEAUTH_URL
};

config.mastrCntrl = {
    'url' : process.env.MC_URL
};

config.website = {
    'url' : process.env.WEBSITE_URL
};

config.slack = {
    'token' : process.env.SLACK_TOKEN
};

config.twitter = {
    'username' : process.env.TWITTER_USERNAME
};

module.exports = config;
