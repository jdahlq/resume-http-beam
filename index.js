var App = require('quan/core/App');
var util = require('util');
var express = require('express')
  , lessMiddleware = require('less-middleware');

// import project modules
var resume = require('./js_server/resume')
  , resumeData = require('./data/data.json');

util.inherits(ResumeApp, App);
/**
 *
 * @implements App
 */
function ResumeApp() {

}

ResumeApp.prototype.mount = function (services, mountDir) {
  var http = services.expressHttp;

  //STORE
  /**
   * Contains the resume data.
   * @type {resume.JsonStore}
   */
  var store = new resume.JsonStore(resumeData);

  // MIDDLEWARE
  http.use(lessMiddleware({  //LESS CSS middleware!
    src: __dirname + '/style',
    dest: __dirname + '/assets',
    prefix: '/assets',
    compress: false
  }));
  http.use('/assets', express.static(__dirname + '/assets')); // static file server
  http.use('/js', express.static(__dirname + '/js_client'));


  // ROUTES

  http.get(new RegExp('^' + mountDir + 'resume\\/([\\w-]+)\\.json$', 'i'), function (req, res, next) {
    //Note: req.params[0] is ([\w-]+), e.g. 'jobs' from '/jobs.json'
    var returnObj = store.getValue(req.params[0]);
    if (returnObj != null) res.json(returnObj);
    else next(); //try to match another route if no match is found in the store
  });

// serve the client app
  http.get(mountDir, function (req, res) {
    res.render(__dirname + '/views/index', store.getValue('contact'));
  });

// ??????
  http.get(mountDir + 'seomoz', function (req, res) {
    require('./js_server/inconspicuousFile.js').getTwoThings(function (things) {
      res.render(__dirname + '/views/inconceivable', things);
    });
  });
};

ResumeApp.prototype.getName = function () { return 'resume-http-beam'; };

ResumeApp.prototype.runTests = function (config) {
  require('./tests/testApi.js').run(config);
};

module.exports = ResumeApp;