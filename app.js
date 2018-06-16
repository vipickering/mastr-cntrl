const express = require('express');
require('dotenv').config(); // Add .ENV vars
const expressNunjucks = require('express-nunjucks');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const config = require(appDir + '/config');
const github = config.github;
const api = config.api;
const app = express();
const helmet = require('helmet');
const logger = require(appDir + '/functions/bunyan');
const port = api.port;
const isDev = app.get('env') === 'development';
let server;
let routes;
const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

app.set('views',__dirname + '/views');
app.use(helmet());
app.use(express.json());

routes = require(appDir + "/routes/routes.js")(app);

server = app.listen(port, function () {
    logger.info("Listening on port %s...", server.address().port);
});
