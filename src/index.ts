import { Factory } from './factory';

export default new Factory().newBuilder();

export type { JUnitReportBuilder as Builder } from './builder';
export type { TestCase } from './test_case';
export type { TestSuite } from './test_suite';
export type { TestSuites } from './test_suites';
