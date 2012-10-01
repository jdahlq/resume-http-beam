/**
 * Author: Joe Dahlquist, 2012
 *
 * This file was designed to be run with Node 0.8.9. Previous versions of Node will probably work
 * but have not been tested.
 *
 * To see a list of command line options, use the -h flag: node server.js -h
 */

//compiles in strict mode where available
"use strict";

//check platform and version
if (typeof process === 'undefined') throw new Error('You must run server.js with Node.js.');
var v = 'v0.8.';
if (process.version.substr(0, v.length) !== v)
  console.error('Warning: Running with Node', process.version+'.', v+'x', 'is recommended.');

// ----------------------------------
// CONFIG VARS
// ----------------------------------
var config = {};

/**
 * HTTP server port.
 * @type {number}
 */
config.httpPort = 80;
config.runTests = false;

// ----------------------------------
// PROCESS COMMAND LINE ARGS
// ----------------------------------
var cli = require('commander');

cli
  .option('-p --port <port>', 'HTTP server port (default: 80)', parseInt)
  .option('-t --tests', 'Run all tests')
  .parse(process.argv);

if (cli['port']) config.httpPort = cli['port'];
if (cli['tests']) config.runTests = true;


// ----------------------------------
// SET UP HTTP SERVER
// ----------------------------------
// import 3rd party modules
var express = require('express')
  , expressCons = require('consolidate')
  , lessMiddleware = require('less-middleware')
  , path = require('path');

var ResumeApp = require('../index.js');

// create the http server
var http = express(); // create an http server


// Middleware
http.engine('html', expressCons.hogan); //templating engine
http.set('views', path.normalize(__dirname + '/../') ); //template directory
http.set('view engine', 'html');  //template extension

// Apps
var services = {expressHttp: http};
var resumeApp = new ResumeApp();
resumeApp.mount(services, '/');



http.use(http.router);  //Match routes
//Server error:
http.use(function (err, req, res, next) {
  console.error(err);
  res.send(500, 'Something catastrophic happened. See: <a href="http://homestarrunner.com/sbemail45.html">homestarrunner.com/sbemail45.html</a>')
});
//404 Not Found:
http.use(function (req, res, next) {
  res.send(404, '404 Not Found, man! See: <a href="http://mannotfounddog.ytmnd.com/">mannotfounddog.ytmnd.com</a>');
});

// listen on specified port
http.listen(config.httpPort);
console.log('HTTP server listening on port', config.httpPort);

// run tests if necessary
if (config.runTests) require('./testApi.js').run(config);