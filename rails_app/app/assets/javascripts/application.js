// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//  = require app/dragger
//= require app/gather_tasks
//= require app/assemble_tasks

$(document).ready(function() {
  new Wheel.App();
  gatheredTasks = GatherTask.gather('ul.found_tasks');

  assembledTasks = AssembleTask.assemble([{
    name: 'Kiss the kids',
    id: 3
  }, {
    name: 'Kiss the cats',
    id: 4
  }]);

  window.assembled = new Wheel.View('ul.generate_tasks');
  window.assembled.append(assembledTasks);
});

