import { JUnitReportBuilder } from './builder.js';
import { TestSuites } from './test_suites.js';
import { TestSuite } from './test_suite.js';
import { TestCase } from './test_case.js';

export class Factory {
  /**
   * @returns a newly created builder
   */
  newBuilder(): JUnitReportBuilder {
    return new JUnitReportBuilder(this);
  }

  /**
   * @returns a newly created test suite
   */
  newTestSuite(): TestSuite {
    return new TestSuite(this);
  }

  /**
   * @returns a newly created test case
   */
  newTestCase(): TestCase {
    return new TestCase();
  }

  /**
   * @returns a newly created test suites
   */
  newTestSuites() {
    return new TestSuites(this);
  }
}
