const bunyan = require('bunyan');
const streamsContent =  [
    {
        stream : process.stdout,
        level : 'debug'
    },
    {
        type : 'rotating-file',
        path : './logs/error.log',
        level : 'error',
        period : '1d',
        count : 3
    },
    {
        type : 'rotating-file',
        path : './logs/debug.log',
        level : 'debug',
        period : '1d',
        count : 3
    },
    {
        type : 'rotating-file',
        path : './logs/fatal.log',
        level : 'fatal',
        period : '1d',
        count : 3
    }
];
const logger = bunyan.createLogger({
    name : 'micropubAPI',
    serializers : {
        err : bunyan.stdSerializers.err
    },
    streams : streamsContent
});

module.exports = logger;
