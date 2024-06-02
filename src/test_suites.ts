import { TestGroup } from './test_group';
import type { Factory } from './factory';

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
    var suite = this._factory.newTestSuite();
    this._children.push(suite);
    return suite;
  }
}
