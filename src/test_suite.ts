import { TestGroup } from './test_group.js';
import type { Factory } from './factory.js';

export class TestSuite extends TestGroup {
  /**
   * @param factory
   */
  constructor(factory: Factory) {
    super(factory, 'testsuite');
  }
}
