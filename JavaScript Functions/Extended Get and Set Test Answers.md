### What You Want to Do:
Extend the capabilities of getTestAnswerValue for multiple-select (checklist) questions and set test answers from JavaScript

### Code to Do It:
```javascript
function getTestSelections(test_code, question_code, returnCaption = true) {
  return Form. // Narrow in on the test answers, starting with the form object itself.
    getTestFormLineByCode(test_code, Form.formObject). // Find which form line holds the test, by the test_code argument
    testValue. // Get the object representing the test
    Questions. // Get the array of test questions
    filter(x => x.output_code == question_code && x.details_type_code.slice(-4) == "LIST")[0]. // Find the question that matches the question_code argument, assuming it is a single- or multi-select item (SINGLELIST or MULTILIST)
    Answers. // Get the answers for the selected question
    filter(x => x.value). // Get just the true (checked) options
    map(x => x[returnCaption ? "test_setup_answers_caption" : "test_setup_answers_value"]) // Across the array of selected options, return either the caption of the response or its numeric value.
}

function setTestAnswerValue(test_code, question_code, answer_caption, newValue) {
  let question = Form. // Narrow in on the desired question, starting with the form object itself.
    getTestFormLineByCode(test_code, Form.formObject). // Find which form line holds the test, by the test_code argument
    testValue. // Get the object representing the test
    Questions. // Get the array of test questions
    filter(q => q.output_code == question_code)[0]; / Find the question that matches the question_code argument

  let answer = question.
    Answers. // Get the answers from the selected question
    filter(a => a.test_setup_answers_caption == answer_caption)[0]; // Get the answer with a caption that matches the answer_caption argument

  if (question.details_type_code.slice(-4 == 'LIST')) { // If this is a single- or multi-select test question
    if (answer.value ^ newValue) { // If the option in the single- or multi-select question is checked, or the newValue argument is true, but not both
      question.
      getField(). // Get the HTML representation of the question
      querySelectorAll(`[test_setup_details_answers_id="${answer.test_setup_details_answers_id}"]`)[0]. // Find the HTML representation of the selected answer
      click();} // Simulate a click on the button 
  } else { // If the question is not a single- or multi-select item
    question.
    getField. // Get the HTML representation of the test item
    value = newValue; // Insert the new value in the box
  }
}
```

### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|test_code|The shortcut code for the test. Specified in Test Design.|String|
|question_code|The shortcut code for the specific test item.|String|
|returnCaption|Toggle whether to return the answer caption or the numeric answer value. |Boolean. Defaults to `true`|
|answer_caption|The caption of the response option to update.|String|
|newValue|The value to set the test answer to.|String or Boolean. Single- and multiple-select items take a Boolean value.|

### Implementation Details
These functions are modeled after the `getTestAnswerValue` function, and have the same requirements for test and question codes.

`getTestSelections` will work for both single- and multiple-select items, but the answer captions do not need to be specified in advance. The function will return an array of selections, or an empty array if none are selected.

### End-User Details
