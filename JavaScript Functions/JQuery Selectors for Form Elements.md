### What You Want to Do:

### Code to Do It:
```javascript
//Use this for form fields and variables, which have columnName attributes
selectElementByColumnName = function(column_name) {
  return $(
    Form.
    getFormLineByColumnName(column_name).
    GetField()
  ).closest("div .form-group");
};

//Use this for labels, subforms, or subreports entered as form lines (not embedded in tests). Also works for form fields if field caption is preferred.
selectElementByCaption = function(caption) {
  return $(
    Form.
    getFormLineByCaption(caption).
    GetField()
  ).closest("div .form-group");
};

//Use this to get embedded tests by code
selectSubTest = function(test_code) {
  return $(
    Form.
    getTestFormLineByCode(test_code).
    GetField()
  ).closest("div .form-group");
};

//Use this to get a form group and its entire contents
selectFormGroup = function(group_caption) {
  return $(`#header-id-${
    Form.
    getFormLineByCaption(group_caption).
    formLinesId
  }`).
  closest("div.row");
};

//Use this to get a subreport embedded in a test
selectTestSubreport = function(test_code, subreport_caption) {
  return $(
    Form.
    getTestFormLineByCode(test_code).
    GetField()
  ).
  closest("div .form-group").
  find("div.QuestionContainer").
  has(`label.testQuestionLabel:contains(${subreport_caption})`)
}

//Use this to get a whole group within a test and all its contents
selectTestGroup = function(test_code, group_caption) {
  let test_groups = $(
      Form.
      getTestFormLineByCode(test_code).
      GetField()
    ).
    closest("div .form-group").
    find("div div.clearfix").
    has("[question_type_code='']");
    
  return test_groups.
    has(`label:contains(${group_caption})`).
    nextUntil(test_groups).
    addBack();
};

// Use this to select response options within a single- or multiple-select test question
selectResponseOptions = function(test_header_code, question_code, attribute = null, value = null) {
  return $(
    Form.
    getTestQuestionByCode(test_header_code, question_code).
    getField()
  ).
  children(
    !(attribute || value) ? 
      null : 
      `:has([${attribute}=${value}])`
    )
}

// Use this to select the client information header at the top of forms
$(".details_big").contents()
```

### End-User Details
The above return JQuery objects, which can then use common JQuery methods such as .show() and .hide().
E.g., `selectTestGroup("Group 1").hide()`

See [Show and Hide Test Items](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/JavaScript%20Functions/Show%20and%20Hide%20Test%20Items.md) for functions to select and hide most types of test questions.

Many of these selectors can be seen in action using the contributed [Hide Form Elements](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/Form%20Design/Exports/Hide%20Form%20Elements.json) form upload.

`selectResponseOptions` can be used to select and disable specific response options within a test question when a specific option is selected. `attribute` and `value` represent how the test question is to be selected. Set attribute to `test_setup_details_answers_id` to select the opton by its GUID, or to `output_code` to select according to the code specified in Form Designer. Use value then to provide the corresponding GUID or `output_code` for the response option. 

For example, we can set up a multiple-selection question with a final "None of the above" option and ensure that a user either selects "None of the above" or any of the other options, but cannot select both "None of the above" and another option:

The following goes into the disable rule of the question:

```js
try{
  selectResponseOptions("Gallery3_1", "bad_day").
    not(
      selectResponseOptions("Gallery3_1", "bad_day", "output_code", "none")
    )[
      Form.getTestAnswerValueByCode("Gallery3_1", "bad_day", "none") ? "addClass" : "removeClass"
     ]("disabled");
} catch {}
```

And the question looks like this:

![Before. All options are available](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/JavaScript%20Functions/assets/images/Response%20Options%20Before.png)

When "None of the above" is selected, the other options become disabled.

![After. The option labeled "None of the above" is selected and enabled, but the pervious four options are now disabled](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/JavaScript%20Functions/assets/images/Response%20Options%20After.png)

Clicking on "None of the above" again will de-select that option and allow the other options to be selected.

### To-Do

