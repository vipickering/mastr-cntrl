const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const moment = require('moment');
const github = config.github;
const website = config.website;
const webmention = config.webmention;
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.syndication = function syndication(req, res) {

logger.info('test');

};
