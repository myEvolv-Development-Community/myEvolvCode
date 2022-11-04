### What You Want to Do:

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

function hideTestItem(test_header_code, question_code){
  var question_element = $( // Search this HTML element using JQuery
    getTestQuestionByCode(test_header_code, question_code). // find a question with an output_code value that matches our question_code
    getField() // Get the associated HTML element and give it to JQuery
  ).
  parent().parent(). // Get the parent for the result, which is the question container (contains both the prompt and the response(s)
  hide() // Hide the question
}

function showTestItem(test_header_code, question_code){
  var question_element = $( // Search this HTML element using JQuery
    getTestQuestionByCode(test_header_code, question_code). // find a question with an output_code value that matches our question_code
    getField() // Get the associated HTML element and give it to JQuery
  ).
  parent().parent(). // Get the parent for the result, which is the question container (contains both the prompt and the response(s)
  show() // Make the selected question visible on the form
}
}
```
### Function Arguments
|Argument       |Definition |
|---            |---        |
|test_header_code |The test_header_code for the question to hide.|
|question_code|The output_code (question_code) for the test item as specified in Test Designer.|


### Implementation Details
1. These functions need to be defined in the form to be used.
2. There are two primary use cases:
a. Hide one or more test items when the form is loaded
b. Hide one ore more test items from a form element's on click action.

### End-User Details
The test question should appear or disappear form the form when these functions are used correctly. For example, the following code added to a form's After Load Code would hide a series of test items when the form is opened, but the items could be made visible later on. In the loop example, we assume the test items to hide are named `test_question1`, `test_question2`, and so on.

```js
// Hide one item at a time
hideTestItem("myTest", "secret_question")

// Reveal the hidden test item
showTestItem("myTest", "secret_question")

// Hide multiple items with a loop
for (let i = 1; i <= 9; i++) {
  let test = "test"
  let question = "test_question_" + i
  hideTestItem(test, question)
  }
```

## Thanks to Lori Parks for collaborating and field-testing this idea.
