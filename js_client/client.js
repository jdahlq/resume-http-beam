"use strict";
$(function() {

  var mapIdsToApi = {
    '#experience': 'resume/jobs.json',
    '#college': 'resume/colleges.json',
    '#other-edu': 'resume/other-education.json',
    '#other-skills': 'resume/other-skills.json'
  };

  // load content  panes
  Object.keys(mapIdsToApi).forEach(function (id) {
    var uri = mapIdsToApi[id];
    $.getJSON(uri, function (data) {
      var $currentPane = $(id);
      console.log(data);
      var template = Hogan.compile($currentPane.html());
      data.forEach(function (element) {
        element = (typeof element === 'string'? {"element": element} : element);
        $(template.render(element)).removeClass('invisible').appendTo($currentPane);
      });
    });
  })

});