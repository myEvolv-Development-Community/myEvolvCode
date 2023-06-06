### What You Want to Do:

Make individual test/assessment items on a form visible or hidden. See the example at the bottom for defaulting test items to hidden, and then to reveal them when certain criteria are met.

### Code to Do It:
```javascript
function getTestQuestionByCode(test_header_code, question_code) {
  try{
    var test = Form. // The Form currently open
      formObject.
      FormLines. // The form elements on the form. Tests and assessments occupy one form line each
      find(fl => // Search through the form lines ("fl")
        fl.
        testValue?.  // Look inside each form line's testValue property. The next property may or may not exist, so we look with ?.
        test_header_code === test_header_code)
    if (!test) {
      throw `No test was found with the code '${test_header_code}'`
      } else { return test }
  } catch(missing_test_error) {
    return console.error(missing_test_error)
  }
  
  try {
    var question = test.
      testValue. // Take the matching testValue entry
      Questions. // Look inside the array of questions for the test
      find(q => q.output_code === question_code) // find a question with an output_code value that matches our question_code
    if (!question) {throw `No question was found with the code '${question_code}' in test '${test_header_code}'`}
  } catch(missing_question_error) {
    return console.error(missing_question_error)
  }
  return question
}

function hideTestItem(test_header_code, question_code){
  try {
    var question_element = $( // Search this HTML element using JQuery
      getTestQuestionByCode(test_header_code, question_code). // find a question with an output_code value that matches our question_code
      GetField() // Get the associated HTML element and give it to JQuery
    ).
    closest("div.QuestionContainer"). // Get the question container (contains both the prompt and the response(s). Look up the family tree for this element and take the first div.QuestionContainer element.
    hide()
  } catch {}
}

function showTestItem(test_header_code, question_code){
  try {
    var question_element = $( // Search this HTML element using JQuery
      getTestQuestionByCode(test_header_code, question_code). // find a question with an output_code value that matches our question_code
      GetField() // Get the associated HTML element and give it to JQuery
    ).
    closest("div.QuestionContainer"). // Get the question container (contains both the prompt and the response(s). Look up the family tree for this element and take the first div.QuestionContainer element.
    show()
  } catch {}
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

// Hide multiple items with iteration
// All items belong to the same test
// Questions come in groups of 5 questions:
// First question indicates whether documentation needed (Yes or No)
// Remaining 4 questions hide on initial load, are revealed if documentation indicated as needed
// All items have question codes with a numeric suffix, e.g., doc1, doc2, doc3

var number_of_items = 20; // Total number of each category to document (test includes doc1 through doc20, etc)
var test   = "my_test_header_code";
var answer = "Yes"; // If documentation item is checked "Yes", questions will display
var need   = "doc"; //  Code for item indicating need to document other factors
const itemsToHide = ["loc", "intv", "resp", "remk"]; // Array of question code prefixes to show/hide according to respective doc item

for (let i = 1; i <= number_of_items; i++) { // Loop through 20 sections
  createTestAnswerOnClick(
    test, // test header code defined above
    need + i, // creates prefix of doc1, doc2, etc according to loop counter
    () => {
      if (!Form.getTestAnswerValue(test, need + i, answer)) {
        for (let item of itemsToHide) { // Loop through items to show/hide
          hideTestItem(test, item + i);
        }
      } else {
        for (let item of itemsToHide) {
          showTestItem(test, item + i);
        }
      }
    }
  );
  try {var hide_this_item = !Form.getTestAnswerValue(test, need + i, answer) } catch {var hide_this_item = false}; // Check whether the doc item is marked yes at load. If unchecked or not loaded, default to showing the remaining items.
  if (hide_this_item) { // On initial form load, hide these items if documentation not indicated as needed
    for (let item of itemsToHide) { // Loop through items to show/hide
      hideTestItem(test, item + i);
    }
  }
}
```

An example form export can be found [here](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/Form%20Design/Exports/Show-Hide%20Test%20Items.json) (NX-compatible only)

## Thanks to Lori Parks for collaborating and field-testing this idea.
