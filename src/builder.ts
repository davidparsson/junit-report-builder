import * as path from 'path';
import * as fs from 'fs';
import { TestSuites } from './test_suites.js';
import { TestCase } from './test_case.js';
import { TestSuite } from './test_suite.js';
import { Factory } from './factory.js';

export class JUnitReportBuilder {
  private _rootTestSuites: TestSuites;
  /**
   * @param factory
   */
  constructor(private _factory: Factory) {
    this._rootTestSuites = new TestSuites(_factory);
  }

  /**
   * @param reportPath
   */
  writeTo(reportPath: string) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, this.build(), 'utf8');
  }

  /**
   * @returns a string representation of the JUnit report
   */
  build(): string {
    const xmlTree = this._rootTestSuites.build();
    return xmlTree.end({ pretty: true });
  }

  /**
   * @param name
   * @returns this
   */
  name(name: string): this {
    this._rootTestSuites.name(name);
    return this;
  }

  /**
   * @returns a test suite
   */
  testSuite(): TestSuite {
    return this._rootTestSuites.testSuite();
  }

  /**
   * @returns a test case
   */
  testCase(): TestCase {
    return this._rootTestSuites.testCase();
  }

  /**
   * @returns a new builder
   */
  newBuilder(): JUnitReportBuilder {
    return this._factory.newBuilder();
  }
}
