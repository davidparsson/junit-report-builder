import { TestGroup } from './test_group';
import type { Factory } from './factory';

export class TestSuite extends TestGroup {
  /**
   * @param factory
   */
  constructor(factory: Factory) {
    super(factory, 'testsuite');
  }
}
