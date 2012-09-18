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
  , lessMiddleware = require('less-middleware');

// import project modules
var resume = require('./js_server/resume')
  , resumeData = require('./data/data.json');

// create the http server
var http = express(); // create an http server

/**
 * Contains the resume data.
 * @type {resume.JsonStore}
 */
var store = new resume.JsonStore(resumeData);

// Middleware
http.engine('html', expressCons.hogan); //templating engine
http.set('views', __dirname + '/views'); //template directory
http.set('view engine', 'html');  //template extension
http.use(lessMiddleware({  //LESS CSS middleware!
  src: __dirname + '/style',
  dest: __dirname + '/assets',
  prefix: '/assets',
  compress: false
}));
http.use('/assets', express.static('assets')); // static file server
http.use('/js', express.static('js_client'));
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

// Routes

/**
 * Resume API Route
 * 1. Matches routes like /jobs.json
 * 2. If the store has a 'jobs' object, respond to client with a json object
 * 3. Else, signal the router to try the next route
 */
http.get(/^\/resume\/([\w-]+)\.json$/i, function (req, res, next) {
  //Note: req.params[0] is ([\w-]+), e.g. 'jobs' from '/jobs.json'
  var returnObj = store.getValue(req.params[0]);
  if (returnObj != null) res.json(returnObj);
  else next(); //try to match another route if no match is found in the store
});

// serve the client app
http.get('/', function (req, res) {
  res.render('index', store.getValue('contact'));
});

// ??????
http.get('/seomoz', function (req, res) {
  require('./js_server/inconspicuousFile.js').getTwoThings(function (things) {
    res.render('inconceivable', things);
  });
});


// listen on specified port
http.listen(config.httpPort);
console.log('HTTP server listening on port', config.httpPort);

// run tests if necessary
if (config.runTests) require('./tests/testApi.js').run(config);