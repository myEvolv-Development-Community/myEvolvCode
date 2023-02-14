### What You Want to Do:

### Code to Do It:
```javascript
//Use this for form fields and variables, which have columnName attributes
selectElementByColumnName = function(column_name) {
  return $(
    Form.
    getFormLineByColumnName(column_name).
    GetField()
  ).closest("div .form-group")
}

//Use this for labels, subforms, or subreports entered as form lines (not embedded in tests). Also works for form fields if field caption is preferred.
selectElementByCaption = function(caption) {
  return $(
    Form.
    getFormLineByCaption(caption).
    GetField()
  ).closest("div .form-group")
}

//Use this to get embedded tests by code
selectSubTest = function(test_code) {
  return $(
    Form.
    getTestFormLineByCode(test_code).
    GetField()
  ).closest("div .form-group")
}

//Use this to get a form group and its entire contents
selectFormGroup = function(group_caption) {
  return $(`#header-id-${
    Form.
    getFormLineByCaption(group_caption).
    formLinesId
  }`).
  closest("div.row")
}

//Use this to get a subreport embedded in a test
selectTestSubreport = function(subreport_caption) {
  return $(`div.QuestionContainer`).
    has(`label:contains(${subreport_caption})`)
}

//Use this to get a whole group within a test and all its contents
selectTestGroup = function(group_caption) {
  let test_groups = $("div.clearfix").
    has("[question_type_code='']")
  return test_groups.
    has(`label:contains(${group_caption})`).
    nextUntil(test_groups).
    addBack()
}
```

### End-User Details
The above return JQuery objects, which can then use common JQuery methods such as .show() and .hide().
E.g., `selectTestGroup("Group 1").hide()`

### To-Do
Confirm code for selecting label elements in form design.
