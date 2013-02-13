# testacular.github.com

This is the source code for http://testacular.github.com. The documentation of 
[Testacular], the spectacular test runner.

## Installation & Building

Make sure you have [Ruby], [jekyll] and [pygments] installed and in
your path, then install the modules via

```bash
$ npm install
```
Install [grunt-cli]
```bash
$ npm install -g grunt-cli
```
and startup via
```bash
$ grunt
```
Now you can open http://localhost:8000 and see all the beauty.


## YAML Front Matter

This where all the basic information is stored that we need to
generate this page dynamically. There are four basic values that need
to be set:

* `title`: The title of the page
* `layout`: Always `default` for a normal page
* `categories`: An array with the first value the version and the
  second value the section. Available sections are 
    * about
    * intro
    * config
    * plus
    * dev
* `tags`: Again this needs to be the version this belongs to.

### Example
```yaml
---
title: The title
layout: default
categories: ['0.6.0', 'about']
tags: 0.6.0
---
```



## Grunt Tasks

### `shell:server`

### `shell:build`

### `build`
* `less`: Compile all less files from `_src/less/` to `css/app.css`
* `mincss`: Minify the just compiled `app.css` file.
* `uglify`: Minify all needed js files from `_src/javascript/` into
  `javascript/app.js`.

### `watch`


[Ruby]: http://www.ruby-lang.org/en/
[jekyll]: https://github.com/mojombo/jekyll
[pygments]: http://pygments.org/
[grunt-cli]: http://github.com/gruntjs/grunt-cli
[Testacular]: https://github.com/testacular/testacular
[docs]: https://github.com/testacular/testacular/tree/master/docs
