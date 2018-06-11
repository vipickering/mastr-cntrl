var config = {}
config.github = {
    dev:
    prod:
};

config.google.id = process.env.GOOGLE_ID || ‘DEVELOPMENT.googleusercontent.com’;

module.exports = config;
