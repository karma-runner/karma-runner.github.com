/**
 * Generate the docs ;-)
 *
 * @author Vojta Jina <vojta.jina@gmail.com>
 */

var path = require('path')

var q = require('q')
var fs = require('q-io/fs')
var namp = require('namp')
var jade = require('jade')
var semver = require('semver')

module.exports = function (grunt) {
  // Helper Methods

  var urlFromFilename = function (fileName) {
    return fileName.replace(/^\d*-/, '').replace(/md$/, 'html')
  }

  var menuTitleFromFilename = function (fileName) {
    return fileName.replace(/^\d*-/, '').replace(/\.md$/, '').split(/[\s_-]/).map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1)
    }).join(' ')
  }

  var pageTitleFromFilename = menuTitleFromFilename

  var editUrlFromFilenameAndSection = function (fileName, section) {
    return 'https://github.com/karma-runner/karma/edit/master/docs/' + section + '/' + fileName
  }

  var filterOnlyFiles = function (path, stat) {
    // ignore dot files like .DS_Store
    var filename = path.split('/').pop()
    return stat.isFile() && !filename.match(/^\./)
  }

  var sortByVersion = function (a, b) {
    if (a.split('.').length < 3) a = a + '.0'
    if (b.split('.').length < 3) b = b + '.0'
    return semver.lt(a, b) ? 1 : -1
  }

  // Register Grunt Task
  grunt.registerMultiTask('static', 'Generate a static homepage', function () {
    // Async Task
    var done = this.async()
    var options = this.options({})
    var template = options.template

    grunt.verbose.writeflags(options, 'Options')

    // Compile Jade templates and cache them.
    var tplCache = Object.create(null)
    var getJadeTpl = function (name) {
      if (!tplCache[name]) {
        var tplFileName = path.join(template, name + '.jade')

        tplCache[name] = fs.read(tplFileName).then(function (content) {
          return jade.compile(content, { filename: tplFileName, cache: true, pretty: true })
        })
      }
      return tplCache[name]
    }

    this.files.forEach(function (f) {
      // Options
      var source = f.src[0]
      var destination = f.dest[0]
      var versions

      grunt.log.writeln('Building files from "' + source + '" to "' + destination + '".')

      // Read all the markdown files
      fs.listTree(source, filterOnlyFiles).then(function (files) {
        return q.all(files.sort().map(function (filePath) {
          return fs.read(filePath).then(function (content) {
            var parts = filePath.substr(source.length).replace(/^\//, '').split('/')
            var fileName = parts.pop()
            var version = parts[0]
            var section = parts[1] || null
            var basePath = parts.join('/') + '/'
            var parsed = namp(content)

            return {
              url: basePath + urlFromFilename(fileName),
              editUrl: editUrlFromFilenameAndSection(fileName, section),
              layout: parsed.metadata.layout || 'layout',
              content: parsed.html,
              version: version,
              section: section,
              menuTitle: parsed.metadata.menuTitle || menuTitleFromFilename(fileName),
              showInMenu: parsed.metadata.showInMenu !== 'false',
              pageTitle: parsed.metadata.pageTitle || pageTitleFromFilename(fileName),
              editButton: parsed.metadata.editButton !== 'false'
            }
          })
        }))
      }).then(function (files) {
        // construct the menu tree
        var menu = Object.create(null)
        files.forEach(function (file) {
          if (!file.showInMenu) return

          menu[file.version] = menu[file.version] || Object.create(null)
          menu[file.version][file.section] = menu[file.version][file.section] || []
          menu[file.version][file.section].push(file)
        })

        // generate and write all the html files
        versions = Object.keys(menu).sort(sortByVersion)
        return q.all(files.map(function (file) {
          var fileUrl = path.join(destination, file.url)
          return q.all([getJadeTpl(file.layout), fs.makeTree(path.dirname(fileUrl))]).then(function (args) {
            var jadeTpl = args[0]

            file.newUrl = file.url
              .replace(file.version, versions[0])
              .replace('coverage.html', 'preprocessors.html')

            return fs.write(fileUrl, jadeTpl({
              versions: versions,
              oldVersion: file.version !== versions[0],
              canonicalUrl: file.newUrl,
              editButton: file.editButton && file.version === versions[0],
              menu: menu[file.version],
              self: file,
              users: [
                {
                  name: 'Mocha',
                  imgUrl: 'https://cldup.com/xFVFxOioAU.svg',
                  webUrl: 'https://mochajs.org/'
                },
                {
                  name: 'SVG',
                  imgUrl: 'https://cloud.githubusercontent.com/assets/43763/20244488/f8931606-a984-11e6-8075-a6a047e9cd2b.png',
                  webUrl: 'https://svgdotjs.github.io/'
                },
                {
                  name: 'TrustTIC',
                  imgUrl: 'https://cloud.githubusercontent.com/assets/3668245/21148402/6a37daa4-c158-11e6-91cd-25e7068bc07d.png',
                  webUrl: 'https://github.com/TrustTIC'
                },
                {
                  name: 'JetBrains',
                  imgUrl: 'https://cloud.githubusercontent.com/assets/616193/21158499/7d273660-c18e-11e6-9b85-28ff217b987c.png',
                  webUrl: 'https://www.jetbrains.com'
                },
                {
                  name: 'InfTec',
                  imgUrl: 'https://camo.githubusercontent.com/e03bacb5b51c17612e1b010aabe43e9fe050c8de/687474703a2f2f7777772e696e667465632e63682f7468656d65732f626173652f696d616765732f6c6f676f2e706e67',
                  webUrl: 'http://www.inftec.ch'
                },
                {
                  name: 'RPLAN',
                  imgUrl: 'https://cloud.githubusercontent.com/assets/1228437/16383838/08be8a26-3c87-11e6-8739-fc657cd89b3b.png',
                  webUrl: 'https://rplan.com'
                }
              ]
            }))
          })
        }))
      }).then(function () {
        return fs.remove('latest')
      }).then(function () {
        return fs.symbolicLink('latest', versions[0], 'directory')
      }).then(function () {
        done()
      }, function (e) {
        grunt.fail.fatal(e.stack)
        done(e)
      })
    })
  })
}
