module.exports = (grunt) ->
  grunt.initConfig
    less:
      docs:
        files:
          'assets/css/app.css': 'src/less/app.less'
    mincss:
      docs:
        files:
          'assets/css/app.css': 'assets/css/app.css'
    uglify:
      docs:
        files:
          'assets/js/app.js': [
            'src/js/jquery.js'
            'src/js/jquery.easing.js'
            'src/js/ddsmoothmenu.js'
            'src/js/jquery.flexslider.js'
            'src/js/colortip.js'
            'src/js/selectnav.js'
            'src/js/custom.js'
          ]
    connect:
      server:
        options:
          base: '.'
          port: 8000
          keepalive: true

    static:
      options:
        template: 'src/jade'
      build:
        files:
          '.': 'src/content'

  grunt.loadNpmTasks 'grunt-contrib-mincss'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadTasks 'tasks'

  grunt.registerTask 'build', [
    'less:docs'
    'mincss:docs'
    'uglify:docs'
  ]
  grunt.registerTask 'server', 'connect:server'

  grunt.registerTask 'default', ['build']
