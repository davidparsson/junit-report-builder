## Classes
<dl>
<dt><a href="#JUnitReportBuilder">JUnitReportBuilder</a></dt>
<dd></dd>
<dt><a href="#TestCase">TestCase</a></dt>
<dd></dd>
<dt><a href="#TestSuite">TestSuite</a></dt>
<dd></dd>
</dl>
<a name="JUnitReportBuilder"></a>
## JUnitReportBuilder
**Kind**: global class  

* [JUnitReportBuilder](#JUnitReportBuilder)
  * [new JUnitReportBuilder()](#new_JUnitReportBuilder_new)
  * [.writeTo(reportPath)](#JUnitReportBuilder+writeTo)
  * [.testSuite()](#JUnitReportBuilder+testSuite) ⇒ <code>[TestSuite](#TestSuite)</code>
  * [.testCase()](#JUnitReportBuilder+testCase) ⇒ <code>[TestCase](#TestCase)</code>
  * [.newBuilder()](#JUnitReportBuilder+newBuilder) ⇒ <code>[JUnitReportBuilder](#JUnitReportBuilder)</code>

<a name="new_JUnitReportBuilder_new"></a>
### new JUnitReportBuilder()
A builder. The entry-point.

<a name="JUnitReportBuilder+writeTo"></a>
### jUnitReportBuilder.writeTo(reportPath)
Builds and writes the report to a file.

**Kind**: instance method of <code>[JUnitReportBuilder](#JUnitReportBuilder)</code>  

| Param | Type |
| --- | --- |
| reportPath | <code>string</code> | 

<a name="JUnitReportBuilder+testSuite"></a>
### jUnitReportBuilder.testSuite() ⇒ <code>[TestSuite](#TestSuite)</code>
Adds a test suite to this report.

**Kind**: instance method of <code>[JUnitReportBuilder](#JUnitReportBuilder)</code>  
<a name="JUnitReportBuilder+testCase"></a>
### jUnitReportBuilder.testCase() ⇒ <code>[TestCase](#TestCase)</code>
Adds a test case without a test suite to this report.

**Kind**: instance method of <code>[JUnitReportBuilder](#JUnitReportBuilder)</code>  
<a name="JUnitReportBuilder+newBuilder"></a>
### jUnitReportBuilder.newBuilder() ⇒ <code>[JUnitReportBuilder](#JUnitReportBuilder)</code>
Returns a new builder instance, for creating a separate report.

**Kind**: instance method of <code>[JUnitReportBuilder](#JUnitReportBuilder)</code>  
<a name="TestCase"></a>
## TestCase
**Kind**: global class  

* [TestCase](#TestCase)
  * [new TestCase()](#new_TestCase_new)
  * [.className(className)](#TestCase+className) ⇒ <code>[TestCase](#TestCase)</code>
  * [.name(name)](#TestCase+name) ⇒ <code>[TestCase](#TestCase)</code>
  * [.time(time)](#TestCase+time) ⇒ <code>[TestCase](#TestCase)</code>
  * [.failure([message])](#TestCase+failure) ⇒ <code>[TestCase](#TestCase)</code>
  * [.stacktrace(stacktrace)](#TestCase+stacktrace) ⇒ <code>[TestCase](#TestCase)</code>
  * [.skipped()](#TestCase+skipped) ⇒ <code>[TestCase](#TestCase)</code>

<a name="new_TestCase_new"></a>
### new TestCase()
Represents a test case. Will result in a single `<testcase>` element.

<a name="TestCase+className"></a>
### testCase.className(className) ⇒ <code>[TestCase](#TestCase)</code>
Sets the class in which the test case is located.

**Kind**: instance method of <code>[TestCase](#TestCase)</code>  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="TestCase+name"></a>
### testCase.name(name) ⇒ <code>[TestCase](#TestCase)</code>
Sets the test case name.

**Kind**: instance method of <code>[TestCase](#TestCase)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="TestCase+time"></a>
### testCase.time(time) ⇒ <code>[TestCase](#TestCase)</code>
Sets the test case execution time in seconds.

**Kind**: instance method of <code>[TestCase](#TestCase)</code>  

| Param | Type |
| --- | --- |
| time | <code>string</code> | 

<a name="TestCase+failure"></a>
### testCase.failure([message]) ⇒ <code>[TestCase](#TestCase)</code>
Marks the test case as failed, with an optional failure message.

**Kind**: instance method of <code>[TestCase](#TestCase)</code>  

| Param | Type |
| --- | --- |
| [message] | <code>string</code> | 

<a name="TestCase+stacktrace"></a>
### testCase.stacktrace(stacktrace) ⇒ <code>[TestCase](#TestCase)</code>
Attach a stacktrace to the test case.

**Kind**: instance method of <code>[TestCase](#TestCase)</code>  

| Param | Type |
| --- | --- |
| stacktrace | <code>string</code> | 

<a name="TestCase+skipped"></a>
### testCase.skipped() ⇒ <code>[TestCase](#TestCase)</code>
Marks the test case as skipped.

**Kind**: instance method of <code>[TestCase](#TestCase)</code>  
<a name="TestSuite"></a>
## TestSuite
**Kind**: global class  

* [TestSuite](#TestSuite)
  * [new TestSuite()](#new_TestSuite_new)
  * [.name(name)](#TestSuite+name) ⇒ <code>[TestSuite](#TestSuite)</code>
  * [.property(name, value)](#TestSuite+property) ⇒ <code>[TestSuite](#TestSuite)</code>
  * [.testCase()](#TestSuite+testCase) ⇒ <code>[TestCase](#TestCase)</code>

<a name="new_TestSuite_new"></a>
### new TestSuite()
Represents a test suite. Will result in a single `<testsuite>` element. May contain {@TestCase}

<a name="TestSuite+name"></a>
### testSuite.name(name) ⇒ <code>[TestSuite](#TestSuite)</code>
Sets the name of this test suite.

**Kind**: instance method of <code>[TestSuite](#TestSuite)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="TestSuite+property"></a>
### testSuite.property(name, value) ⇒ <code>[TestSuite](#TestSuite)</code>
Adds a property element to this suite.

**Kind**: instance method of <code>[TestSuite](#TestSuite)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>string</code> | 

<a name="TestSuite+testCase"></a>
### testSuite.testCase() ⇒ <code>[TestCase](#TestCase)</code>
Adds a test case to this suite.

**Kind**: instance method of <code>[TestSuite](#TestSuite)</code>  
