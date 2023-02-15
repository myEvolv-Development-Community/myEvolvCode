### What You Want to Do:

Add actions to execute when a test item is clicked, e.g., to select an option on a radio button.

### Code to Do It:
```javascript
function getTestQuestionByCode(test_header_code, question_code) {
  return Form. // The Form currently open
    formObject.
    FormLines. // The form elements on the form. Tests and assessments occupy one form line each
    find(fl => // Search through the form lines ("fl")
      fl.
      testValue?.  // Look inside each form line's testValue property. The next property may or may not exist, so we look with ?.
      test_header_code === test_header_code). // Check whether the test_header_code for the embedded test matches our searched code (again, if it exists.)
    testValue. // Take the matching testValue entry
    Questions. // Look inside the array of questions for the test
    find(q => q.output_code === question_code) // find a question with an output_code value that matches our question_code
}

function createTestAnswerOnClick(test_header_code, question_code, new_function) {
  let question = getTestQuestionByCode(test_header_code, question_code)// We need to reference the test question twice, so assigning it to a variable
  question. // Take the question we identified
    getField(). // Get the associated HTML element
    onclick = new_function // Add the function we defined as an onclick action for the response button
}
```
### Function Arguments
|Argument       |Definition |
|---            |---        |
|test_header_code |The test_header_code for the test containing the question to modifu.|
|question_code|The output_code (question_code) for the test item as specified in Test Designer.|
|new_function|A function with no arguments to execute when the test item is clicked. See example below.|

### Implementation Details
1. Use this code in the form's After Load Code.
2. Define a function to execute when the test item is clicked.

### End-User Details
When the test item is clicked (including any response option), the specified function should execute. This was originally developed to be used in conjunction with the show and hide test items code.

```js
// Assign on-click action to one test item:
createTestAnswerOnClick(
  "myTest", 
  "Question1",
  () => {
    alert("Hello, world!")
  }
)

// Assign on-click actions to multiple items with a loop (question codes are test_question1, test_question2, and so on)
for (let i = 1; i <= 20; i++) {
  let test         = "my_test_code"
  let need         = "needed"       + i
  let loc          = "location"     + i
  let intervention = "intervention" + i
  let response     = "response"     + i
  let answer = "Yes"
  
  createTestAnswerOnClick(
    test, 
    need, 
    answer, 
    () => {
      if (!Form.getTestAnswerValue(test, need, answer)) {
        hideTestItem(test, loc)
        hideTestItem(test, intervention)
        hideTestItem(test, response)
      } else {
        showTestItem(test, loc)
        showTestItem(test, intervention)
        showTestItem(test, response)
      }
    }
  )
}
```

## Credits:
Thanks to Lori Parks for collaborating and field-testing this idea.
