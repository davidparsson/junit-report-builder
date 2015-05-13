junit-report-builder
====================

A project aimed at making it easier to build Jenkins compatible XML based JUnit report files.

Installation
------------

To install the latest version, run:

    npm install junit-report-builder --save

Usage
-----

```JavaScript
var builder = require('junit-report-builder').createBuilder();

// Create a test suite
var suite = builder.testSuite().name('My suite');

// Create a test case
var testCase = suite.testCase()
  .className('my.test.Class')
  .name('My first test');

// Create another test case which is marked as failed
var testCase = suite.testCase()
  .className('my.test.Class')
  .name('My second test')
  .failure();

builder.writeTo('test-report.xml');
```

This will create `test-report.xml` containing the following:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="My suite">
    <testcase classname="my.test.Class" name="My first test"/>
    <testcase classname="my.test.Class" name="My second test">
      <failure/>
    </testcase>
  </testsuite>
</testsuites>
```

License
-------

MIT. See [LICENSE](https://github.com/davidparsson/junit-report-builder/blob/master/LICENSE).

Changelog
---------

### 0.0.2
- Corrected example in readme

### 0.0.1
- Initial release
