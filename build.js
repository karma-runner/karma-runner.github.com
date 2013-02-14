/**
 * Generate the docs ;-)
 * TODO(vojta): refactor into a grunt task
 *
 * @author Vojta Jina <vojta.jina@gmail.com>
 */

var path = require('path');

var q = require('q');
var fs = require('q-io/fs');
var namp = require('namp');
var jade = require('jade');

// inputs
var SRC = 'src/content/';
var DST = ''
var TPL = 'src/jade/';


var urlFromFilename = function(fileName) {
  return fileName.replace(/^\d*-/, '').replace(/md$/, 'html');
};

var menuTitleFromFilename = function(fileName) {
  return fileName.replace(/^\d*-/, '').replace(/\.md$/, '').split(/[\s_-]/).map(function(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  }).join(' ');
};

var pageTitleFromFilename = menuTitleFromFilename;

var filterOnlyFiles = function(path, stat) {
  return stat.isFile();
};

var tplCache = Object.create(null);
var getJadeTpl = function(name) {
  if (!tplCache[name]) {
    var tplFileName = TPL + name + '.jade';

    tplCache[name] = fs.read(tplFileName).then(function(content) {
      return jade.compile(content, {filename: tplFileName, cache: true, pretty: true});
    });
  }

  return tplCache[name];
};

// read all the markdown files
fs.listTree(SRC, filterOnlyFiles).then(function(files) {
  return q.all(files.map(function(filePath) {
    return fs.read(filePath).then(function(content) {
      var parts = filePath.substr(SRC.length).split('/');
      var fileName = parts.pop();
      var version = parts[0];
      var section = parts[1] || null;
      var basePath = parts.join('/') + '/';
      var parsed = namp(content);

      return {
        url: basePath + urlFromFilename(fileName),
        layout: parsed.metadata.layout || 'layout',
        content: parsed.html,
        version: version,
        section: section,
        menuTitle: parsed.metadata.menuTitle || menuTitleFromFilename(fileName),
        pageTitle: parsed.metadata.pageTitle || pageTitleFromFilename(fileName)
      };
    });
  }));
}).then(function(files) {
  // construct the menu tree
  var menu = Object.create(null);
  files.forEach(function(file) {
    menu[file.version] = menu[file.version] || Object.create(null);
    menu[file.version][file.section] = menu[file.version][file.section] || [];
    menu[file.version][file.section].push(file);
  });

  // generate and write all the html files
  var versions = Object.keys(menu).sort();
  return q.all(files.map(function(file) {
    return q.all([getJadeTpl(file.layout), fs.makeTree(path.dirname(DST + file.url))]).then(function(args) {
      var jadeTpl = args[0];

      return fs.write(DST + file.url, jadeTpl({
        versions: versions,
        menu: menu[file.version],
        self: file
      }));
    });
  }));
}).then(function() {
  console.log('DONE');
}, function(e) {
  console.log(e);
});
