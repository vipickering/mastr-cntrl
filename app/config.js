/*eslint no-process-env: "off"*/
const config = {};

config.api = {
    'port' : process.env.API_PORT
};

config.github = {
    'host' : process.env.GITHUB_HOST,
    'key' : process.env.GITHUB_KEY,
    'name' : process.env.GITHUB_NAME,
    'user' : process.env.GITHUB_USER,
    'email' : process.env.GITHUB_USER_EMAIL
};

config.mastrCntrl = {
    'url' : process.env.MC_URL
};

// Your website you are saving Micropub posts in
config.website = {
    'url' : process.env.WEBSITE_URL,
    'repo' : process.env.WEBSITE_REPO,
    'branch' : process.env.WEBSITE_BRANCH,
    'postUrl' : process.env.GITHUB_HOST + '/repos/' + process.env.GITHUB_NAME + '/' + process.env.WEBSITE_REPO
};

config.indieauth = {
    'url' : process.env.INDIEAUTH_URL
};

config.slack = {
    'token' : process.env.SLACK_TOKEN
};

config.twitter = {
    'username' : process.env.TWITTER_USERNAME
};

config.timezone = {
    'region' : process.env.TIMEZONE
};

module.exports = config;
