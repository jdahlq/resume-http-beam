/**
 * Author: Joe Dahlquist, 2012
 *
 * This file was designed to be run with Node 0.8.9. Previous versions of Node will probably work
 * but have not been tested.
 *
 * To see a list of command line options, use the -h flag like this: node server.js -h
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

// ----------------------------------
// PROCESS COMMAND LINE ARGS
// ----------------------------------
var cli = require('commander');

cli
  .option('-p --port <port>', 'HTTP server port (default: 80)', parseInt)
  .parse(process.argv);

if (cli['port']) {
  config.httpPort = cli['port'];
}


// ----------------------------------
// SET UP HTTP SERVER
// ----------------------------------
var express = require('express');

var http = express();

// routes
http.get('/', function (req, res) {
  res.send('Hello SEOmoz World');
});

// listen on specified port
http.listen(config.httpPort);
console.log('HTTP server listening on port', config.httpPort);