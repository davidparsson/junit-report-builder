import path from 'path';
import makeDir from 'make-dir';
import fs from 'fs';
import { TestSuites } from './test_suites';

export class JUnitReportBuilder {
  private _rootTestSuites: TestSuites;
  /**
   * @param factory
   */
  constructor(private _factory: any) {
    this._rootTestSuites = new TestSuites(_factory);
  }

  /**
   * @param reportPath
   */
  writeTo(reportPath: string) {
    makeDir.sync(path.dirname(reportPath));
    fs.writeFileSync(reportPath, this.build(), 'utf8');
  }

  /**
   * @returns a string representation of the JUnit report
   */
  build(): string {
    var xmlTree = this._rootTestSuites.build();
    return xmlTree.end({ pretty: true });
  }

  /**
   * @param name
   * @returns this
   */
  name(name: string) {
    this._rootTestSuites.name(name);
    return this;
  }

  /**
   * @returns a test suite
   */
  testSuite() {
    return this._rootTestSuites.testSuite();
  }

  /**
   * @returns {import('./test_case').TestCase}
   */
  testCase() {
    return this._rootTestSuites.testCase();
  }

  /**
   * @returns this
   */
  newBuilder() {
    return this._factory.newBuilder();
  }
}
