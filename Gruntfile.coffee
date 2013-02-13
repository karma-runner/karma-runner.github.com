module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    mincss:
      docs:
        files:
          'css/app.css': 'css/app.css'
    uglify:
      docs:
        files:
          'javascript/app.js': [
            '_src/javascript/jquery.js'
            '_src/javascript/jquery.easing.js'
            '_src/javascript/ddsmoothmenu.js'
            '_src/javascript/jquery.flexslider.js'
            '_src/javascript/colortip.js'
            '_src/javascript/selectnav.js'
            '_src/javascript/custom.js'
          ]
    less:
      docs:
        files:
          'css/app.css': '_src/less/app.less'

    jade:
      options:
        pretty: true
      docs:
        files:
          '_layouts/version.html': '_src/jade/version.jade'
          '_layouts/default.html': '_src/jade/default.jade'           
          'index.html': '_src/jade/index.jade'

    shell:
      options:
        stdout: true
        stderr: true
      server:
        command: 'jekyll --server 8000 --auto'
        options:
          async: true
      build:
        command: 'jekyll'
                
    watch:
      jade:
        files: ['_src/jade/**/*.jade']
        tasks: ['jade', 'shell:build']
      css:
        files: ['_src/less/**/*.jade']
        tasks: ['less', 'mincss', 'shell:build']
      javascript:
        files: ['_src/javascript/**/*.jade']
        tasks: ['uglify', 'shell:build']

            
  grunt.loadNpmTasks 'grunt-contrib-mincss'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-shell-spawn'

  grunt.registerTask 'build', [
    'less:docs'
    'mincss:docs'
    'uglify:docs'
    'jade:docs'
  ]
  
  grunt.registerTask 'default', ['build', 'shell:server', 'watch']

