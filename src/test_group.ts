import { TestNode } from './test_node.js';
import type { XMLElement } from 'xmlbuilder';
import type { TestCase } from './test_case.js';
import type { Factory } from './factory.js';
import type { TestSuite } from './test_suite.js';

export class TestGroup extends TestNode {
  protected _children: (TestCase | TestSuite)[];

  /**
   * @param factory
   * @param elementName
   */
  constructor(
    protected _factory: Factory,
    elementName: string,
  ) {
    super(elementName);
    this._children = [];
  }

  /**
   * @param timestamp
   * @returns this
   */
  timestamp(timestamp: string | Date): this {
    this._attributes.timestamp = timestamp instanceof Date ? this.formatDate(timestamp) : timestamp;
    return this;
  }

  /**
   * @returns the created test case
   */
  testCase(): TestCase {
    const testCase = this._factory.newTestCase();
    this._children.push(testCase);
    return testCase;
  }

  /**
   * @inheritdoc
   */
  override getTestCaseCount(): number {
    return this._sumTestCaseCounts((testCase: TestCase | TestSuite) => {
      return testCase.getTestCaseCount();
    });
  }

  /**
   * @inheritdoc
   */
  override getFailureCount(): number {
    return this._sumTestCaseCounts((testCase: TestCase | TestSuite) => {
      return testCase.getFailureCount();
    });
  }

  /**
   * @inheritdoc
   */
  override getErrorCount(): number {
    return this._sumTestCaseCounts((testCase: TestCase | TestSuite) => {
      return testCase.getErrorCount();
    });
  }

  /**
   * @inheritdoc
   */
  override getSkippedCount(): number {
    return this._sumTestCaseCounts((testCase: TestCase | TestSuite) => {
      return testCase.getSkippedCount();
    });
  }

  /**
   * @param counterFunction - the function to count the test cases
   * @returns the sum of the counts of the test cases
   */
  protected _sumTestCaseCounts(counterFunction: (testCase: TestCase | TestSuite) => number): number {
    const counts = this._children.map(counterFunction);
    return counts.reduce((sum, count) => sum + count, 0);
  }

  /**
   * @param parentElement - the parent element
   * @returns the newly created element
   */
  build(parentElement?: XMLElement) {
    this._attributes.tests = this.getTestCaseCount();
    this._attributes.failures = this.getFailureCount();
    this._attributes.errors = this.getErrorCount();
    this._attributes.skipped = this.getSkippedCount();
    return super.build(parentElement);
  }

  /**
   * @param element
   * @returns the built element
   */
  protected buildNode(element: XMLElement) {
    element = super.buildNode(element);
    this._children.forEach((child) => {
      child.build(element);
    });
    return element;
  }
}
