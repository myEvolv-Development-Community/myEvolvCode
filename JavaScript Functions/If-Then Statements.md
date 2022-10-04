### What is this:
If/then statments in a javaScript formula can create functions that trigger under circumstances that you create

### Code:
`if(the contidtion){{the outcome}} else {{the outcome if the condition is not met}}`<br><br>

Note: this can be used without the "else" and second outome if you just want one possible outcome.<br><br>
**Examples**<br>
Set the staff_id to the current worker viewing the form, if the form action is Edit or Complete<br>
`if (formAction == 'EDIT'){{setFormElement('staff_id', workerID);}} ;`<br>
`if (formAction == 'COMPLETE'){{setFormElement('staff_id', workerID);}}`<br><br>

Make an alert pop up if the actul_date is 48 hours from the current date<br>
`var actualDate = new Date(getFormElement('actual_date'));`<br>
`var nowDate = new Date();`<br>
`var hoursBetween = (nowDate - actualDate) / (60 * 60 * 1000);`<br>
` if (hoursBetween >= 48){{`<br>
`  alert2('WARNING: This date is over 48 hours old);`<br>
`}}`<br><br>

Make a field required if another is marked<br>
`if (getFormElement('udf_boolean')) {{`<br>
`  Form.makeRequiredByColumn('expiration_date');`<br>
`}} else {{`<br>
`Form.makeUnRequiredByColumn('expiration_date');`<br>
`}}`<br><br>

Query the database, if the information is treu, set a field to required, it not make it not required<br>
`if(getDataValue('client_personal_view', 'people_id', parentValue, 'age') >14) {{`<br>
`    Form.makeRequiredByColumn('attached_document');`<br>
`}} else {{`<br>
`   Form.makeUnRequiredByColumn('attached_document');`<br>
`}}`



### Details
Dpending on the purpose of the code, these could go into the **On Load Script** for a spesific field, or **Before Load Code** on the form header.
