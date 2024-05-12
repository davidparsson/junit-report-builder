import { JUnitReportBuilder } from './builder';
import { TestSuites } from './test_suites';
import { TestSuite } from './test_suite';
import { TestCase } from './test_case';

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
