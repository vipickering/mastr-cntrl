const express = require('express');
require('dotenv').config(); // Add .ENV vars
const expressNunjucks = require('express-nunjucks'); // See if we can ditch Nunjucks and go with JSON
const path = require('path');
const favicon = require('serve-favicon');
const appDir = path.dirname(require.main.filename);
const config = require(appDir + '/config');
const github = config.github;
const api = config.api;
const app = express();
const helmet = require('helmet');
const logger = require(appDir + '/functions/bunyan');
const port = api.port;
const isDev = app.get('env') === 'development';
const routes  = require(appDir + '/routes/routes.js');
const njk = expressNunjucks(app, {
    watch : isDev,
    noCache : isDev
}); // See if we can ditch Nunjucks and go with JSON

app.set('views', path.join(__dirname + '/views'));
app.use(helmet());
app.use(favicon(path.join(__dirname, 'public', '/images/favicon.ico')));
app.use(express.json());

// Routes
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if (typeof (routes) !== 'function') {
    logger.error(routes.bind);
    logger.error('Warning routes not configured correctly');
    routes.bind(app);
} else {
    app.use('/', routes);
}

/*eslint-disable-next-line no-process-env */
const server = app.listen(process.env.PORT || 3000, function() {
    logger.info('Listening on port %s...', server.address().port);
});
