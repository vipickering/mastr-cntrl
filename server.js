const express = require('express');
require('dotenv').config(); // Add .ENV vars
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const helmet = require('helmet');
const port = process.env.PORT || 3000;
let server;
let routes;

appRootDirectory = path.join(__dirname, '/');

app.use(helmet());
app.use(bodyParser.json());

// Do we need to accept form POSTs?
// app.use(bodyParser.urlencoded({ extended: true }));

routes = require("./routes/routes.js")(app);

server = app.listen(port, function () {
    console.log("Listening on port %s...", server.address().port);
});
