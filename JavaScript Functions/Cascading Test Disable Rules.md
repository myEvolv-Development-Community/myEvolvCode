### What You Want to Do:

Improve performance of test/assessment forms with disable rules and make them easier to maintain by copying ("cascading") a disable rule from one test item to one or more others.

### Code to Do It:
```javascript
Form.cascadeTestDisableRule = function (test_header_code, question_code) {   // Put this in the Form's Before Load or After Load script
  let FL = Form.
    formObject.
    FormLines.
    find(fl => fl.testValue?.test_header_code == test_header_code) // Get form line containing the test containing the specific test item
    
  return FL.isDisabled || // Test items can be disabled at the form line level or at the test item level, so need to return true if either is disabled
    FL.
      testValue.
      Questions.
      find(q => q.output_code == question_code).
      isDisabled
}

/*
In a test question, use the function like this:
try {
  Form.cascadeTestDisableRule("my_test", "some_question")
  } catch { true }
*/
```
### Function Arguments

The function usage follows the pattern established by getTestAnswerValue.

|Argument       |Definition |Data Type|
|---            |---        |---      |
|test_header_code |The test header code of the assessment as defined in Test Design.|
|question_code|The question code as defined in Test Design.|


### Implementation Details
1. Create a test
2. Assign question codes to any test questions that will be used in determining a disable rule.
3. Determine whether any test questions or form lines have the same disable criteria and therefore would need to follow the same rule.
4. For any set of questions with the same disable criteria, write the disable rule as usual for the *first* question.
5. For the remaining questions in the set, use the function in a try-catch block like the example above.
6. In Form Designer, add the function definition to the Form's Before or After Load script.

### End-User Details
It is very important to wrap the actual function usage in a try-catch block. Test items start 'listening' for their disable rules to be triggered *before*
the form's Before Load script executes, which can cause an error when the function is not yet ready for use and has the unfortunate consequence of preventing the Before Load script from ever running.

Try-catch lets the browser attempt to run the function, but default to a different value if the function produces an error (e.g., the function is not yet defined).

If the rules are properly configured, every test item using cascadeTestDisableRule will disable or enable in lock-step with the test item they are set to follow. This is particularly useful if there is a complex or time-consuming calculation going into each item's disable rule (for example, a set of questions that disable if a subscale score is above or below a certain cutoff). cascadeTestDisableRule takes about as long to run as a single call to getTestAnswerValue, no matter how complex the first item's disable rule is.

### To-Do
Considering making the function flexible enough to also reference disable rules on non-test form elements. For now, we can use `Form.getFormLineByColumnName("some_field").isDisabled`
