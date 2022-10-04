### What is this:
Some funcions that you can use for various projecs

### Code:
|Item|Description|Example|
|----|-----------|-------|
|var|short for Variable. This allows you to declare the value of things you are going to use in your script|`var mydata = getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description')`;|
|getFormElement(); |Gets the info from a field on a form|`getFormElement('actual_date');`|
|getElementFromXML(formXML, ); |Gets the info from a field on a form- works with event_log fields before form is saved|`getElementFromXML(formXML,'program_providing_srevice');`|
|getDataValue(); |Gets the info from the database (can be used to get the info about the staff who is accessing the form)-Plug your data in this order: getDataValue('LUT name', 'field to match on', 'value to match', 'value to return')|`getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description');`|
|setFormElement(); |Sets the value of a field |`setFormElement('udf_regularstring', mydata);`|
|setElementFromXML(formXML,); | Sets the XML layer- used for field that are marked not-modifiable/not-visible |`setElementFromXML(formXML, 'is_telehealth', 'on')`|
|getParentFormElement(); | Grabs the value from a parent form for use in a sub form|`getParentFormElement('activity_type');`
|programPS| If a form is in Service Etry, putting this value in the program_providing_service field will default the field to the current enrolled program for the service. You can plug this into Javascript formulas to reference the program providing service. | `getDataValue('primary_worker_assignment_view', 'people_id', parentValue, 'staff_id', 'end_date is null and program_info_id = "programPS"')`
|sitePS| If a form is in Service Etry, putting this value in the site_providing_service field will default the field to the current enrolled program for the service. You can plug this into Javascript formulas to reference the site providing service | example
|eventID|You can plug this into Javascript formulas/form fields to reference the event_definition_id of the form.| example
|staffID|You can plug this into Javascript formulas/form fields to reference the staff_id of the form| example
|workerID| You can plug this into Javascript formulas to reference the current staff that is interacting with the form| `if (formAction == 'EDIT'){{setFormElement('staff_id', workerID);}}`
|&#124;&#124;| Use as "Or" when using mutiple javascript formulas| getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description') = 'Yes'; &#124;&#124; getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description') = 'Maybe'
|&&| Use as "And" when usning mutiple javascript functions|getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description') = 'Yes'; && getDataValue('user_defined_lut2', 'user_defined_lut_id', 'UDF_choices', 'description') = 'Yellow'



### Details
These are the building blocks for some of the more complex functions that you can built. 
Some can be used by themselves, all can be used in collaboration with eachother. 
Pay attention to what letters are capitailized are are not in the code, these are important. 

## Credits:
Anyone who has ever entered a piece of javaScript code onto the community. 

### To-Do
Anyone can add otherpieces to this if you think it will be helpful to others
