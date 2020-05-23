# karma-runner.github.com

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-runner.github.com) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-runner.github.com.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-runner.github.com#info=devDependencies)

> This is the source code for http://karma-runner.github.com. The
> homepage and documentation of [karma], the spectacular test runner.

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

## Maintenance

Add or update documentation content for _docs-version_ based on the content of Karma repository at _branch-or-tag-in-karma-repo_ revision:

```bash
$ ./sync-docs.sh <branch-or-tag-in-karma-repo> <docs-version>
```

Examples:

- Generate documentation for Karma 5.0 based on the v5.0.4 tag in the Karma repository:

  ```bash
     $ ./sync-docs.sh v5.0.4 5.0
  ```

- Generate documentation for Karma 5.1 based on the latest `master` branch in the Karma repository:

  ```bash
  $ ./sync-docs.sh master 5.1
  ```

[karma]: http://karma-runner.github.com
[main repo]: https://github.com/karma-runner/karma/tree/master/docs
