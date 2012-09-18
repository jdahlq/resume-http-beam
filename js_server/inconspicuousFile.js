var http = require('http');

exports.getTwoThings = function (gttCb) {

  var things = {};

  httpGet('http://www.seomoz.org/about/team', function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    var regex = /(?:alt=)"([\s\w,\.-]+)"/g;
    var matches = [];
    var curr = null;
    while (curr = regex.exec(res.body)) matches.push(curr[1]);
    matches.shift();
    var random1 = Math.floor( Math.random() * matches.length );
    var random2 = random1;
    while (random2 === random1) random2 = Math.floor( Math.random() * matches.length );
    things.thing1 = matches[random1];
    things.thing2 = matches[random2];

    gttCb(things);
  });
};

function httpGet(route, cb) {
  var result = {};
  http.get(route, function (res) { //ewww, hardcode
    result.statusCode = res.statusCode;
    result.body = '';
    res.on('data', function (chunk) {
      result.body += chunk;
    }).on('end', function () {
      cb(null, result);
    });
  }).on('error', function (e) {
    cb(e, null);
  });
}