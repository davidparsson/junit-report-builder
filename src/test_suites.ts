import { TestGroup } from './test_group.js';
import type { Factory } from './factory.js';

export class TestSuites extends TestGroup {
  /**
   * @param factory
   */
  constructor(factory: Factory) {
    super(factory, 'testsuites');
  }

  /**
   * @returns a new created test suite
   */
  testSuite() {
    const suite = this._factory.newTestSuite();
    this._children.push(suite);
    return suite;
  }
}
