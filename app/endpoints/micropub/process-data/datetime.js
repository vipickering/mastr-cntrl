const moment = require('moment');
const tz = require('moment-timezone');
const config = require(appRootDirectory + '/app/config.js');

let tmz;
const yourLocation = config.timezone;

if (yourLocation.region === 'NZ') {
    tmz = moment(new Date()).tz('Pacific/Auckland');
} else {
    tmz = moment(new Date());
}

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
