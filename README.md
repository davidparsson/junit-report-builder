# junit-report-builder

[![Build Status](https://github.com/davidparsson/junit-report-builder/workflows/CI/badge.svg)](https://github.com/davidparsson/junit-report-builder/actions?query=workflow%3ACI)
[![Weekly Downloads](https://img.shields.io/npm/dw/junit-report-builder.svg)](https://www.npmjs.com/package/junit-report-builder)

A project aimed at making it easier to build [Jenkins](http://jenkins-ci.org/) compatible XML based JUnit reports.

## Installation

To install the latest version, run:

    npm install junit-report-builder --save

## Usage

```JavaScript
import builder from 'junit-report-builder';

// Create a test suite
let suite = builder.testSuite().name('My suite');

// Create a test case
let firstTestCase = suite.testCase()
  .className('my.test.Class')
  .name('My first test');

// Create another test case which is marked as failed
let secondTestCase = suite.testCase()
  .className('my.test.Class')
  .name('My second test')
  .failure();

builder.writeTo('test-report.xml');
```

This will create `test-report.xml` containing the following:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="2" failures="1" errors="0" skipped="0">
  <testsuite name="My suite" tests="2" failures="1" errors="0" skipped="0">
    <testcase classname="my.test.Class" name="My first test"/>
    <testcase classname="my.test.Class" name="My second test">
      <failure/>
    </testcase>
  </testsuite>
</testsuites>
```

If you want to create another report file, start by getting a new
builder instance like this:

```JavaScript
// Each builder produces a single report file
let anotherBuilder = builder.newBuilder();
```

CommonJS is also supported:

```JavaScript
let builder = require('junit-report-builder');
```

Please refer to the [e2e.spec.ts](spec/e2e.spec.ts) for more details on the usage.

## License

[MIT](LICENSE)

## Changelog

### 5.1.1

-   Change `markdown-doctest` from a dependency to a dev dependency.

### 5.1.0

-   Add support for multiline properties, where the value is stored as text content instead of in the `value` attribute. Thanks to [Sebastian Sauer](https://github.com/sebastian-sauer).

### 5.0.0

-   A re-release of 4.0.1 since that version broke the CommonJS API.
-   Remove an internal type from the public API.

### 4.0.1 (deprecated)

-   _Deprecated, since the CommonJS API was accidentally changed in 4.0.1. Re-released as 5.0.0._
-   Re-introduce CommonJS support, while keeping the ES module support. Thanks to [Harel Mazor](https://github.com/HarelM) and [Simeon Cheeseman](https://github.com/SimeonC).
-   Export all public types from `index.d.ts`. Thanks to [Harel Mazor](https://github.com/HarelM) and [Simeon Cheeseman](https://github.com/SimeonC).
-   Full typing support for TypeScript. Thanks to [Harel Mazor](https://github.com/HarelM).

### 4.0.0 (deprecated)

-   _Deprecated, since the CommonJS support was accidentally dropped. This is fixed again in 4.0.1._
-   Dropped support for node.js 14, 12, 10 and 8.
-   Full typing support for TypeScript. Thanks to [Harel Mazor](https://github.com/HarelM).

### 3.2.1

-   Update documentation.

### 3.2.0

-   Support name and test count attributes for the root test suites element. Thanks to [Simeon Cheeseman](https://github.com/SimeonC).
-   Describe parameter types and return types with JSDoc. Thanks to [Simeon Cheeseman](https://github.com/SimeonC).

### 3.1.0

-   Add support for generic properties for test cases. Thanks to [Pietro Ferrulli](https://github.com/Pi-fe).
-   Bump dependencies

### 3.0.1

-   Bump dependencies: lodash, make-dir, date-format, minimist

### 3.0.0

-   Properly prevent invalid characters from being included in the XML files.
-   Dropped support for node.js 4 and 6

### 2.1.0

-   Added support for adding a `file` attribute to a test case. Thanks to [Ben Holland](https://github.com/hollandben).

### 2.0.0

-   Replace mkdirp by make-dir to resolve [npm advisory 1179](https://www.npmjs.com/advisories/1179).
-   Dropped support for node.js 0.10.x and 0.12.x

### 1.3.3

-   Updated lodash to a version without known vulnerabilities.

### 1.3.2

-   Added support for emitting the type attribute for error and failure elements of test cases
-   Added support for emitting cdata/content for the error element of a test case

Thanks to [Robert Turner](https://github.com/rturner-edjuster).

### 1.3.1

-   Update dependencies to versions without known vulnerabilities.

### 1.3.0

-   Support [attaching files to tests](http://kohsuke.org/2012/03/13/attaching-files-to-junit-tests/). Thanks to [anto-wahanda](https://github.com/anto-wahanda).

### 1.2.0

-   Support creating XML with emojis. Thanks to [ischwarz](https://github.com/ischwarz).

### 1.1.1

-   Changed `date-format` to be a dependency. Previously it was incorrectly set to be a devDependency. Thanks to [georgecrawford](https://github.com/georgecrawford).

### 1.1.0

-   Added attributes for test count, failure count, error count and skipped test count to testsuite elements
-   Added ability to attach standard output and standard error logs to test cases
-   Added ability set execution time for test suites
-   Added ability set timestamp for test suites

### 1.0.0

-   Simplified API by making the index module export a builder instance

### 0.0.2

-   Corrected example in readme

### 0.0.1

-   Initial release
