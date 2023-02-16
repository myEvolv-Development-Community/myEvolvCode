### What is this:
Some functions that you can use for various projects.

### Code:
| Item | Description | Example | 
| ---- | ----------- | ------- | 
| `var` | Short for Variable. This allows you to declare the value of things you are going to use in your script | `var mydata = getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description')`; | 
| `getFormElement();`  | Gets the info from a field on a form | `getFormElement('actual_date');` | 
| `getElementFromXML(formXML, );`  | Gets the info from a field on a form - works with event_log fields before form is saved | `getElementFromXML(formXML,'program_providing_srevice');` | 
| `getDataValue();`  | Gets the info from the database (can be used to get the info about the staff who is accessing the form) - Plug your data in this order: `getDataValue('LUT name', 'field to match on', 'value to match', 'value to return')` | `getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description');` | 
| `setFormElement();`  | Sets the value of a field  | `setFormElement('udf_regularstring', mydata);` | 
| `setElementFromXML(formXML,);`  |  Sets the XML layer - used for field that are marked not-modifiable/not-visible  | `setElementFromXML(formXML, 'is_telehealth', 'on')` | 
| `getParentFormElement();`  |  Grabs the value from a parent form for use in a sub form | `getParentFormElement('activity_type');`
| `self.getElementFromXML(currentRowXML, )` | Gets data from the current row of a subform line | `self.getElementFromXML(currentRowXML,'udf_collpicklist');`
| `setSubFormElement(this.form, )` |  Sets the value of a field in the same line of a form  | `setSubFormElement(this.form, 'local_worker_supervisor', desc);`
| `programPS` |  If a form is in Service Etry, putting this value in the program_providing_service field will default the field to the current enrolled program for the service. You can plug this into Javascript formulas to reference the program providing service.  |  `getDataValue('primary_worker_assignment_view', 'people_id', parentValue, 'staff_id', 'end_date is null and program_info_id = "programPS"')`
| `sitePS` |  If a form is in Service Entry, putting this value in the site_providing_service field will default the field to the current enrolled program for the service. You can plug this into Javascript formulas to reference the site providing service  |  example
| `eventID` | You can plug this into Javascript formulas/form fields to reference the event_definition_id of the form. |  example
| `staffID` | You can plug this into Javascript formulas/form fields to reference the staff_id of the form |  example
| `workerID` |  You can plug this into Javascript formulas to reference the current staff that is interacting with the form |  `if (formAction == 'EDIT'){{setFormElement('staff_id', workerID);}}`
| `\|\|` |  Use to combine two logical operations and test whether either (or both) are true (`true \|\| false` is true, but `false \|\| false` is false)|  `getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description') === 'Yes' \|\| getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description') === 'Maybe'`
| `&&` |  Use to combine two logical operations and test whether both are true (`true && true` is true, but `true && false` is false) | `getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description') === 'Yes' && getDataValue('user_defined_lut2', 'user_defined_lut_id', 'UDF_choices', 'description') === 'Yellow'`
| `^` |  Use to combine two logical operations as an exclusive or operator (`true ^ false` is true but `true ^ true` is false) This will disable if the either (one) box is checked, but not if both are checked| `getTestAnswerValue("NPN","CO", "Care Coordination")  ^  isChecked("udf_Denies")` 
| `===` |  In myEvolv NX javascript uses 3 `=` when you want the formula to mean "Equals" |  `getFormElement('udf_refcl') === 'A1B03084-BC60-4867-98A4-2AF7F2D3879F'`
| `!` |  Use this when you want to mean "Not"  |  `getFormElement('udf_refcl') !== 'A1B03084-BC60-4867-98A4-2AF7F2D3879F'`
|`ASC` `DESC`| These are used to indicate how you want the data ordered. `ASC` means "Ascending"- smallest value first `DESC` means "Descending"- largest value first |`program_name ASC`<br> program names will be listed in ABC order<br>`actual_date DESC` <br> Dates will be listed oldest to newest| 



### Details
These are the building blocks for some of the more complex functions that you can built.  
Some can be used by themselves, all can be used in collaboration with each other.  
Pay attention to what letters are capitalized and which are not in the code, these are important. 

## Credits:
Anyone who has ever entered a piece of javaScript code onto the community. 

### To-Do
Anyone can add other pieces to this if you think it will be helpful to others.
