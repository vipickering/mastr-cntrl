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

config.webmention = {
    'token' : process.env.WEBMENTION_TOKEN,
    'webhook' : process.env.WEBMENTION_WEBHOOK_TOKEN,
    'telegraph' : process.env.WEBMENTION_TELEGRAPH,
    'feed' : process.env.WEBMENTION_FEED
};

config.website = {
    'url' : process.env.WEBSITE_URL
};

config.lastfm = {
    'token' : process.env.LASTFM_TOKEN
};

module.exports = config;
