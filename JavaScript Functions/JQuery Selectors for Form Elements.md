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
```

### End-User Details
The above return JQuery objects, which can then use common JQuery methods such as .show() and .hide().
E.g., `selectTestGroup("Group 1").hide()`

See [Show and Hide Test Items](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/JavaScript%20Functions/Show%20and%20Hide%20Test%20Items.md) for functions to select and hide most types of test questions.

These selectors can be seen in action using the contributed [Hide Form Elements](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/Form%20Design/Exports/Hide%20Form%20Elements.json) form upload

### To-Do

