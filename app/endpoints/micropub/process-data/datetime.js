const moment = require('moment');
const tz = require('moment-timezone');
const config = require(appRootDirectory + '/app/config.js');
const yourLocation = config.timezone.region;
const tmz = moment(new Date()).tz(`${yourLocation}`);

/*
Convert and format time
*/

exports.formatDateTime = function formatDateTime() {
    const dateTime = tmz.format('YYYY-MM-DDTHH:mm:ss');
    return dateTime;
};

exports.formatMediaDateTime = function formatMediaDateTime() {
    const dateTime = tmz.format('YYYY-MM-DDTHH');
    return dateTime;
};
