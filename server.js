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
var express = require('express')
  , resume = require('./js_server/resume')
  , resumeData = require('./data/data.json');

var http = express(); // create an http server
var store = new resume.JsonStore(resumeData); //initialize a JsonStore for the resume data

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

http.get('/', function (req, res) {
  res.send('Hello SEOmoz World');
});

// listen on specified port
http.listen(config.httpPort);
console.log('HTTP server listening on port', config.httpPort);

// run tests if necessary
if (config.runTests) require('./tests/testApi.js').run(config);