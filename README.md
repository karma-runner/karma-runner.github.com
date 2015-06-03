# karma-runner.github.com

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-runner.github.com) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-runner.github.com.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-runner.github.com#info=devDependencies)

> This is the source code for http://karma-runner.github.com. The
> homepage and documentation of [Karma], the spectacular test runner.

If you wanna update the docs, just go the the [main repo] and update the
markdown. You can even do that directly from the github web interface.


## Building the Documentation

```bash
$ git clone https://github.com/karma-runner/karma-runner.github.com.git
$ cd karma-runner.github.com
$ npm install
$ grunt
```
Now open your browser at http://localhost:8000.

## Available Grunt Tasks

* `static`: Build the documentation
* `watch`
* `server`
* `less`
* `mincss`
* `uglify`


[Karma]: http://karma-runner.github.com
[main repo]: https://github.com/karma-runner/karma/tree/master/docs
