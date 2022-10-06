### What is this:
If/then statments in a javaScript formula can create functions that trigger under circumstances that you create

### Code:
`if(the contidtion){{the outcome}} else {{the outcome if the condition is not met}}`<br><br>

Note: this can be used without the "else" and second outome if you just want one possible outcome.<br>
Another Note: Using single `{` and `}` curly-brackets is also supported.<br>

**Examples**<br>
Set the staff_id to the current worker viewing the form, if the form action is Edit or Complete<br>
```
if (formAction == 'EDIT'){{setFormElement('staff_id', workerID);}}
if (formAction == 'COMPLETE'){{setFormElement('staff_id', workerID);}}
```
Can also be written as:
```if (formAction == 'EDIT' || formAction == 'COMPLETE'){{setFormElement('staff_id', workerID);}}```

Make an alert pop up if the actul_date is 48 hours from the current date<br>
```
var actualDate = new Date(getFormElement('actual_date'));
var nowDate = new Date();
var hoursBetween = (nowDate - actualDate) / (60 * 60 * 1000);
if (hoursBetween >= 48){{
  alert2('WARNING: This date is over 48 hours old');
}}
```

Make a field required if another is marked<br>
```
if (isChecked('udf_boolean')) {{
  Form.makeRequiredByColumn('expiration_date');
}} else {{
  Form.makeUnRequiredByColumn('expiration_date');
}}
```

Query the database, if the information is treu, set a field to required, it not make it not required<br>
```
if(getDataValue('client_personal_view', 'people_id', parentValue, 'age') >14) {{
    Form.makeRequiredByColumn('attached_document');
}} else {{
   Form.makeUnRequiredByColumn('attached_document');
}}
```

Here is an example of an if/else that uses single brackets:
```
if (formAction === 'ADD') {
  $('#leftContentWrapperId').fadeIn('slow');
} else {
  $('#leftContentWrapperId').fadeIn('fast');
}
```



### Details
Dpending on the purpose of the code, these could go into the **On Load Script** for a spesific field, or **Before Load Code** on the form header.
