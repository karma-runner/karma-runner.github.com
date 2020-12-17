module.exports = function (grunt) {
  grunt.initConfig({
    eslint: {
      target: [
        'gruntfile.js',
        'tasks/*.js'
      ]
    },

    less: {
      docs: {
        files: {
          'assets/css/app.css': 'src/less/app.less',
          'assets/css/app-dark.css': 'src/less/app-dark.less'
        }
      }
    },

    cssmin: {
      docs: {
        files: {
          'assets/css/app.css': 'assets/css/app.css',
          'assets/css/app-dark.css': 'assets/css/app-dark.css'
        }
      }
    },

    uglify: {
      docs: {
        files: {
          'assets/js/app.js': [
            'src/js/jquery.js',
            'src/js/jquery.easing.js',
            'src/js/ddsmoothmenu.js',
            'src/js/jquery.flexslider.js',
            'src/js/colortip.js',
            'src/js/selectnav.js',
            'src/js/custom.js'
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          base: '.',
          port: 8000,
          keepalive: true
        }
      }
    },

    'static': {
      options: {
        template: 'src/jade'
      },
      docs: {
        files: {
          '.': 'src/content'
        }
      }
    },

    watch: {
      less: {
        files: 'src/less/**/*.less',
        tasks: ['less:docs', 'cssmin:docs']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['uglify:docs']
      },
      jade: {
        files: ['src/content/**/*.md', 'src/jade/**/*.jade'],
        tasks: ['static:docs']
      }
    }
  })

  grunt.loadTasks('tasks')
  require('load-grunt-tasks')(grunt)

  grunt.registerTask('build', [
    'less:docs',
    'cssmin:docs',
    'uglify:docs',
    'static:docs'
  ])

  grunt.registerTask('lint', 'eslint')
  grunt.registerTask('server', 'connect:server')

  grunt.registerTask('default', [
    'lint',
    'build',
    'server',
    'watch'
  ])
}
