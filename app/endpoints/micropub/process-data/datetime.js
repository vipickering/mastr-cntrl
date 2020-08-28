const moment = require('moment');
const tz = require('moment-timezone');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const yourLocation = config.timezone.region;

/*
Convert and format time
*/

exports.formatDateTime = function formatDateTime() {
    const dateTime = moment(new Date()).tz(yourLocation).format('YYYY-MM-DDTHH:mm:ss');
    logger.info(dateTime);
    return dateTime;
};

exports.formatMediaDateTime = function formatMediaDateTime() {
    const dateTime = moment(new Date()).tz(yourLocation).format('YYYY-MM-DDTHH');
    return dateTime;
};

exports.formatfileNameDateTime = function formatfileNameDateTime() {
    const dateTime = moment(new Date()).tz(yourLocation).format('YYYY-MM-DDTHH:mm:ss+00:00');
    return dateTime;
};
