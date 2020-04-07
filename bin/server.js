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
const app = express();
const port = api.port;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(favicon('public/images/favicon.ico'));
app.use(express.json());
app.use('/', routes);

/*eslint-disable-next-line no-process-env */
const server = app.listen(process.env.PORT || port, function serveTheThings() {
    logger.info('Mastr Cntrl Online Port:%s...', server.address().port);
});
