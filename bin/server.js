const express = require('express');
require('dotenv').config();
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const bodyParser = require('body-parser');
appRootDirectory = path.join(__dirname, '/..');
const config = require(appRootDirectory + '/app/config.js');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const routes = require(appRootDirectory + '/app/routes.js');
const api = config.api;
const port = api.port;
const app = express();
// const isDev = app.get('env') === 'development';

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(favicon('public/images/favicon.ico'));
app.use(express.json());
app.use('/', routes);

/*eslint-disable-next-line no-process-env */
const server = app.listen(port, function serveTheThings() {
    logger.info('Mastr Cntrl Online Port:%s...', server.address().port);
});
