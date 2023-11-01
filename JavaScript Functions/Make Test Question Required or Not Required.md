### What You Want to Do:

### Code to Do It:
```javascript
function makeTestQuestionRequired(test_header_code, question_code) {
  var question = getTestQuestionByCode(test_header_code, question_code) // select the test question using the test header code and question code
  
  question.is_required = true //Set property of question in the form object to be required
  
  $(question.getField()). // Use the getField method and JQuery to select the test question from the document
    closest("div.QuestionContainer"). // look for the container holding the entire question
    find("label.testQuestionLabel"). // look for the question label - required questions are indicated by a class assigned to the label caption
      addClass("testQuestionCaptionRequired") // Add a class called 'testQuestionCaptionRequired'
}

function makeTestQuestionUnRequired(test_header_code, question_code) {
  var question = getTestQuestionByCode(test_header_code, question_code) // select the test question using the test header code and question code
  
  question.is_required = false //Set property of question in the form object to be not required
  
  $(question.getField()). // Use the getField method and JQuery to select the test question from the document
    closest("div.QuestionContainer"). // look for the container holding the entire question
    find("label.testQuestionLabel"). // look for the question label - required questions are indicated by a class assigned to the label caption
      removeClass("testQuestionCaptionRequired") // Remove a class called 'testQuestionCaptionRequired'
}
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|test_header_code|The shortcut code for the test. Specified in Test Design.|String|
|question_code|The shortcut code for the specific test item.|String|


### Implementation Details
Add the above function definition to a disable rule slot on the form. Wrap the actual call to the function in a `try {} catch {}` block like:
```js
try{
  if (getFormElement("variable_1") == getFormElement("variable_2")) {
    makeTestQuestionRequired("my_test", "some_question")
  } else {
    makeTestQuestionUnRequired("my_test", "some_question")
  }
}catch {}
```

### End-User Details
As a more complex example, we can make a set of questions required if any of a previous set of questions are answered with a 'Yes'

```js
try {
var sub_test = "test_header_code" // Assuming all questions are in the same sub-test. If there are multiple sub-tests, a more complicated script is needed

var are_required = // a single true or false value indicating whether the condition to make questions required is met
  ["q1", "q2", "q3"]. // an array of question codes to check for a 'Yes'
  some(question => Form.getTestAnswerValue(sub_test, question, "Yes")) // Check whether any 'Yes' option checked on the subset of questions. May also use reduce to achieve the same effect

var questions_to_require = ["q4", "q5", "q6"] // These are the question_codes for the questions we will make required or not

if (are_required) {
    questions_to_require.forEach(question => makeTestQuestionRequired(sub_test, question))
  } else {
    questions_to_require.forEach(question => makeTestQuestionUnRequired(sub_test, question))
  }
} catch {}
```

## Credits:
Acknowledge specific creators if known.

### To-Do
If there is a known issue or edge case still to work out, describe it here.
