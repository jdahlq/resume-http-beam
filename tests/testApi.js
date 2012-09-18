var http = require('http')
  , vows = require('vows')
  , assert = require('assert');

var host = '';

/**
 * Tests the REST API
 * @param config {Object} Server config object
 */
exports.run = function (config) {

  host = 'http://localhost:' + config.httpPort;

  vows
    .describe('REST API')
    .addBatch({
      'GET /resume/contact.json': {
        topic: api.get('/resume/contact.json'),
        'should respond with a 200': assertStatus(200),
        'should be a non-blank JSON object': assertNotEmpty(),
        'should contain my name': function (err, res) {
          assert.isDefined(res.bodyParsed.name);
          assert.equal(res.bodyParsed.name, 'Joe Dahlquist');
        }
      },
      'GET /resume/jobs.json': {
        topic: api.get('/resume/jobs.json'),
        'should respond with a 200': assertStatus(200),
        'should be a non-blank JSON object': assertNotEmpty(),
        'should contain a job title': function (err, res) {
          assert.isString(res.bodyParsed[0].title);
        }
      },
      'GET /resume/other-education.json': {
        topic: api.get('/resume/other-education.json'),
        'should respond with a 200': assertStatus(200),
        'should be a non-blank JSON object': assertNotEmpty()
      },
      'GET /resume/other-skills.json': {
        topic: api.get('/resume/other-skills.json'),
        'should respond with a 200': assertStatus(200),
        'should be a non-blank JSON object': assertNotEmpty()
      },
      'GET /resume/wrong.json': {
        topic: api.get('/resume/wrong.json'),
        'should respond with a 404': assertStatus(404)
      }
    })
    .run({reporter: require('../node_modules/vows/lib/vows/reporters/spec.js')});

};

function httpGet(route, cb) {
  var result = {};
  http.get(host + route, function (res) {
    result.statusCode = res.statusCode;
    result.body = '';
    res.on('data', function (chunk) {
      result.body += chunk;
    }).on('end', function () {
        try {
          result.bodyParsed = JSON.parse(result.body);
        } catch (e) {
          result.bodyParsed = null;
        }
       cb(null, result);
    });
  }).on('error', function (e) {
      cb(e, null);
  });
}

var api = {
  get: function (route) {
    return function () {
      httpGet(route, this.callback);
    }
  }
};

function assertStatus(status) {
  return function (err, res) {
    assert.isNull(err);
    assert.equal(res.statusCode, status);
  };
}

function assertNotEmpty() {
  return function (err, res) {
    assert.isNotNull(res.bodyParsed);
    assert.isNotEmpty(res.bodyParsed);
  }
}