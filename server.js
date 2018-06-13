const express = require('express');
require('dotenv').config(); // Add .ENV vars
const config = require('./config');
const github = config.github;
const api = config.api;
const app = express();
const path = require('path');
const helmet = require('helmet');
const logger = require('./functions/bunyan');
const port = api.port;
let server;
let routes;

app.use(helmet());
app.use(express.json());

// Do we need to accept form POSTs?

routes = require("./routes/routes.js")(app);

server = app.listen(port, function () {
    logger.info("Listening on port %s...", server.address().port);
});
