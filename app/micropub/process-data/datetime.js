const moment = require('moment');

/*
Convert and format time to local Kiwi format
*/
exports.formatDateTime = function formatDateTime() {
    const dateTime = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss');
    return dateTime;
};
