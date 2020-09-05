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

config.mastrcntrlRepo = {
    'repo' : process.env.MASTRCNTRL_REPO,
    'branch' : process.env.MASTRCNTRL_BRANCH,
    'postUrl' : process.env.GITHUB_HOST + '/repos/' + process.env.GITHUB_NAME + '/' + process.env.MASTRCNTRL_REPO
};

config.mastrCntrl = {
    'url' : process.env.MC_URL
};

//The website you are targeting
config.website = {
    'url' : process.env.WEBSITE_URL
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
