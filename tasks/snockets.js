var Snockets = require('snockets'),
  fs = require('fs'),
  path = require('path');

/*
 * grunt-snockets
 * https://github.com/umurgedik/grunt-snockets
 *
 * Copyright (c) 2013 Umur Gedik
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md
  // my changes

  // ==========================================================================
  // TASKS
  // ==========================================================================

  var guid = function(){
    s4 = (-> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  grunt.registerMultiTask('snockets', 'Building js files with snockets.js.', function() {
    this.snocketsOptions = {
      async: (this.data.async || false),
      bare: (this.data.bare || false)
    };

    var snockets = new Snockets(this.snocketsOptions);

    // It doesn't run with empty src and dest parameters.    
    if (typeof this.data.src === 'undefined' ||
        typeof this.data.dest === 'undefined') {
      grunt.log.error('Missing Options: src and dest options necessary');
      return false;
    }

    if (fs.existsSync(path.resolve(this.data.src))) {
      try {
        js = snockets.getConcatenation(this.data.src, this.snocketsOptions);

        if (this.data.banner)
          js = this.data.banner + '\n' + js;

        fs.writeFileSync(path.resolve(this.data.dest), js);

        grunt.log.writeln('Compiled ' + this.data.src + ' to ' + this.data.dest);

        return true;
      } catch (e) {
        grunt.log.error(e);
        return false;
      }
    } else {
      grunt.log.error('Missing File: ' + this.data.src);
      return false;
    }
  });

  grunt.registerMultiTask('dynamic-snockets', function(){
    var tasks = this.files.map(function(pair){
      var task_config = { src: pair.src[0], dest: pair.dest },
          task_name   = 'snockets.compile-' + guid();
      grunt.config.set(task_name, task_config);
      return task_name;
    })

    tasks.forEach(function(task){ grunt.task.run(task.replace(/\./gi, ':')); });
  });

};
