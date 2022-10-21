### What You Want to Do:

Get information such as a date or client information from a window open in the background.

### Code to Do It:
```javascript
var formCode = "some_form"
var parentWindow = window.parent; 
var i = 0; 
var window_array = []; 

while (window.parent.hasOwnProperty(i)) {
  window_array.push(parentWindow[i]); 
  i++
}

var other_window = window_array.find(win => win.Form?.formObject.formCode == formCode)
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|formCode |The code of a form to look for among the windows open in the background, as speficied in Form Designer.|


### Implementation Details
1. This code depends on knowing at least two forms. The first is the form open in the background, the second the form open in the foreground (the current, active form)
2. Take note of the form code for the background form. This code depends on that form being open in the background when the foreground form opens.
3. Paste the above code in a script slot in the foreground form. The specific background form will now be available for extracting data.

### End-User Details
Data in `other_window` can be referenced much like data in the current window. For example, we could pull an `actual_date` from the background window using `other_window.Form.getFormElement("actual_date")`.

**Example**: We have a custom alert window that launches when a worker records a PHQ-9 assessment with a clinically significant score, alerting staff to follow up with a suicide risk screening. The alert's `message` field pre-populates with a the client's name, ID number, the date of the assessment, and a hyperlink to the assessment using the following default value:

```js
var parentWindow = window.parent; 
var i = 0; 
var window_array = []; 
while (window.parent.hasOwnProperty(i)) {
  window_array.push(parentWindow[i]); 
  i++;
}

var form = window_array.find(win => win.Form?.formObject.formCode == 'PHQ9_FollowUp').Form;

var actual_date =  form.getFormElement("actual_date");
var where_clause = `actual_date = \\'${actual_date}\\' and event_definition_id = \\'${form.formObject.eventID}\\'`;

`<p 
  style=
    "padding:3px; 
    border:1px solid; 
    color:blue; 
    text-decoration:underline; 
    cursor:pointer; 
    display:inline-block;"  
  onclick=
    "openAlertEventWindow('
      ${form.formObject.formHeaderId}', 
      getDataValue(
        'event_log', 
        'people_id', 
        '${form.formObject.parentValue}', 
        'event_log_id', 
        '${where_clause}'
      ),
      '${form.formObject.eventID}', 
      '${form.formObject.serviceTrack}',
      '');
  ">
<img 
  src="images/Open.gif" 
  style="cursor:pointer; padding:5px"
  >  ${
  getDataValue("people", "people_id", parentValue, "first_name")
  } ${
  getDataValue("people", "people_id", parentValue, "last_name")
  } (ID# ${
  getDataValue("people", "people_id", parentValue, "agency_id_no")
  }) screened positive for suicide risk on ${
  actual_date
  }. Please follow-up on this case immediately.</p>`;
  
  // resulting message: Some Client (ID# 12345) screened positive for suicide risk on 2022-01-01 12:00. Please follow-up on this case immediately.
```
