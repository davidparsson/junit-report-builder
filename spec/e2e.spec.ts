import builderPackage, { type Builder } from '../lib/index.js';
//@ts-ignore
import rmdir from 'rimraf';
import * as fs from 'fs';

describe('JUnit Report builder', () => {
  let builder: Builder;
  beforeEach(() => {
    builder = builderPackage.newBuilder();
  });

  beforeAll(
    async () =>
      new Promise((done) =>
        rmdir('build/tmp/test_resources', (error: any) => {
          if (error) {
            throw new Error(error);
          }
          done();
        }),
      ),
  );

  const reportWith = (content: string) => '<?xml version="1.0" encoding="UTF-8"?>\n' + content;

  it('should produce a report identical to the expected one', () => {
    builder.testCase().className('root.test.Class1');
    const suite1 = builder.testSuite().name('first.Suite');
    suite1.testCase().name('Second test');
    suite1
      .testCase()
      .className('suite1.test.Class2')
      .name('Third test')
      .file('./path-to/the-test-file.coffee')
      .property('property name', 'property value');
    const suite2 = builder.testSuite().name('second.Suite');
    suite2.testCase().failure('Failure message');
    suite2.testCase().stacktrace('Stacktrace');
    suite2.testCase().skipped();

    builder.writeTo('build/tmp/test_resources/actual_report.xml');

    const actual = fs.readFileSync('build/tmp/test_resources/actual_report.xml').toString().trim();
    const expected = fs.readFileSync('spec/expected_report.xml').toString().trim();

    expect(actual).toBe(expected);
  });

  it('should produce an empty list of test suites when nothing reported', () => {
    expect(builder.build()).toBe(
      // prettier-ignore
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites tests="0" failures="0" errors="0" skipped="0"/>',
    );
  });

  it('should set testsuites name', () => {
    builder.name('testSuitesName');
    expect(builder.build()).toBe(
      // prettier-ignore
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites name="testSuitesName" tests="0" failures="0" errors="0" skipped="0"/>',
    );
  });

  it('should produce an empty test suite when a test suite reported', () => {
    builder.testSuite();

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="0" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite tests="0" failures="0" errors="0" skipped="0"/>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a root test case when reported', () => {
    builder.testCase();

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testcase/>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a root test case with failure when reported', () => {
    builder.testCase().failure('it failed');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="1" errors="0" skipped="0">\n' +
        '  <testcase>\n' +
        '    <failure message="it failed"/>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a root test case with failure and type when reported', () => {
    builder.testCase().failure('it failed', 'the type');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="1" errors="0" skipped="0">\n' +
        '  <testcase>\n' +
        '    <failure message="it failed" type="the type"/>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a root test case with error when reported', () => {
    builder.testCase().error('it errored');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="1" skipped="0">\n' +
        '  <testcase>\n' +
        '    <error message="it errored"/>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a root test case with error, type and content when reported', () => {
    builder.testCase().error('it errored', 'the type', 'the content');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="1" skipped="0">\n' +
        '  <testcase>\n' +
        '    <error message="it errored" type="the type"><![CDATA[the content]]></error>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a test suite with a test case when reported', () => {
    builder.testSuite().testCase();

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite tests="1" failures="0" errors="0" skipped="0">\n' +
        '    <testcase/>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a test suite with a failed test case when reported', () => {
    builder.testSuite().testCase().failure();

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="1" errors="0" skipped="0">\n' +
        '  <testsuite tests="1" failures="1" errors="0" skipped="0">\n' +
        '    <testcase>\n' +
        '      <failure/>\n' +
        '    </testcase>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a test suite with an errored test case when reported', () => {
    builder.testSuite().testCase().error();

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="1" skipped="0">\n' +
        '  <testsuite tests="1" failures="0" errors="1" skipped="0">\n' +
        '    <testcase>\n' +
        '      <error/>\n' +
        '    </testcase>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should produce a test suite with a skipped test case when reported', () => {
    builder.testSuite().testCase().skipped();

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="1">\n' +
        '  <testsuite tests="1" failures="0" errors="0" skipped="1">\n' +
        '    <testcase>\n' +
        '      <skipped/>\n' +
        '    </testcase>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should add the reported time to the test sute', () => {
    builder.testSuite().time(2.5);

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="0" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite time="2.5" tests="0" failures="0" errors="0" skipped="0"/>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should add the reported timestamp to the test sute', () => {
    builder.testSuite().timestamp(new Date(2015, 10, 22, 13, 37, 59, 123));

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="0" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite timestamp="2015-11-22T13:37:59" tests="0" failures="0" errors="0" skipped="0"/>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should add the reported time to the test case', () => {
    builder.testSuite().testCase().time(2.5);

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite tests="1" failures="0" errors="0" skipped="0">\n' +
        '    <testcase time="2.5"/>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should print the reported standard output log to system-out', () => {
    builder.testSuite().testCase().standardOutput('This was written to stdout!');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite tests="1" failures="0" errors="0" skipped="0">\n' +
        '    <testcase>\n' +
        '      <system-out><![CDATA[This was written to stdout!]]></system-out>\n' +
        '    </testcase>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should print the reported standard error log to system-err', () => {
    builder.testSuite().testCase().standardError('This was written to stderr!');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite tests="1" failures="0" errors="0" skipped="0">\n' +
        '    <testcase>\n' +
        '      <system-err><![CDATA[This was written to stderr!]]></system-err>\n' +
        '    </testcase>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should print the reported attachment to system-err', () => {
    builder
      .testSuite()
      .testCase()
      .standardError('This was written to stderr!')
      .errorAttachment('absolute/path/to/attachment');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testsuite tests="1" failures="0" errors="0" skipped="0">\n' +
        '    <testcase>\n' +
        '      <system-err>\n' +
        '        <![CDATA[This was written to stderr!]]>\n' +
        '        [[ATTACHMENT|absolute/path/to/attachment]]\n' +
        '      </system-err>\n' +
        '    </testcase>\n' +
        '  </testsuite>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should output test suites and test cases in the order reported', () => {
    builder.testCase().name('1');
    builder.testSuite().name('2');
    builder.testCase().name('3');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="2" failures="0" errors="0" skipped="0">\n' +
        '  <testcase name="1"/>\n' +
        '  <testsuite name="2" tests="0" failures="0" errors="0" skipped="0"/>\n' +
        '  <testcase name="3"/>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should builder supports emojis in cdata tags', () => {
    builder.testCase().standardOutput('Emoji: 🤦');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="0" skipped="0">\n' +
        '  <testcase>\n' +
        '    <system-out><![CDATA[Emoji: 🤦]]></system-out>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should escape quotes', () => {
    builder.testCase().error('it is "quoted"');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="1" skipped="0">\n' +
        '  <testcase>\n' +
        '    <error message="it is &quot;quoted&quot;"/>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });

  it('should remove invalid characters', () => {
    builder.testCase().error('Invalid\x00Characters\x08Stripped');

    expect(builder.build()).toBe(
      reportWith(
        // prettier-ignore
        '<testsuites tests="1" failures="0" errors="1" skipped="0">\n' +
        '  <testcase>\n' +
        '    <error message="InvalidCharactersStripped"/>\n' +
        '  </testcase>\n' +
        '</testsuites>',
      ),
    );
  });
});
