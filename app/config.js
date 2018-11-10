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
    'url' : process.env.MICROPUB_SITE_URL,
    'token' : process.env.MICROPUB_TOKEN_ENDPOINT,
    'port' : process.env.MICROPUB_PORT
};

config.webmention = {
    'token' : process.env.WEBMENTION_TOKEN,
    'webhook' : process.env.WEBMENTION_WEBHOOK_TOKEN,
    'telegraph': process.env.WEBMENTION_WEBHOOK_TELEGRAPH,
};

module.exports = config;

