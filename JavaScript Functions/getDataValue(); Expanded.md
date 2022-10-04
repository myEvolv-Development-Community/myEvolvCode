### What is this:
getDataValue(); is a very powerful function that can be used to query the data base and bring in results in order to set the default of a field, get information to use in more complex Javascript formulas, or to use in a Disable Rule.<br>
<br>The tables that you use in these types of formulas include any database table or view, including views used for Sub Reports. 

### Code:
Basic formula <br>
`getDataValue('table_or_view_name', 'join_field', joinValue, 'form_field', 'additional where clause in SQL' )`

**Examples of use**<br><br>
Make another field disabled/not disabled based on information in the cleint's chart<br>
`getDataValue('client_personal_view', 'people_id', parentValue, 'age') >18`<br><br>

Make another field disabled if the selection of a LUT is the indicated selection<br>
`getDataValue('user_defined_lut','user_defined_lut_id', getFormElement('udf_modality'), 'description') === 'Yes';`<br><br>

Get information from the databased and put it in the Default Value box within a field<br>
`getDataValue('primary_worker_assignment_view', 'people_id', parentValue, 'staff_id', 'end_date is null and program_info_id = "programPS"')`<br><br>

Use in a more complex javascript formula<br>
`var pplid = getDataValue('referrals_made_view', 'program_enrollment_id', getElementFromXML(formXML,'program_enrollment_event_id'),'referral_contact');<br>
getDataValue('all_people_view', 'people_id', pplid, 'phone_day');`<br><br>





### Details
The getDataValue(); is a function that takes alot of effort for myEvolv to process, use them sparingly.<br><br>
keyValue and parentValue are based on the form and the module.  Example: In Service Entry keyValue is the event_log_id and parentValue is the people_id for the client.  In the Assessments, keyValue is assessment_id (or whatever the key field is on the events' key column)
