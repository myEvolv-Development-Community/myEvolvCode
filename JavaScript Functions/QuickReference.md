### What is this:
Some funcions that you can use for various projecs

### Code:
|Item|Description|Example|
|----|-----------|-------|
|var|short for Variable. This allows you to declare the value of things you are going to use in your script|var mydata = getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description');|
```
var : short for Variable. This allows you to declare the value of things you are going to use in your script
EX: var mydata = getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description');

getFormElement(); :Gets the info from a field on a form
EX: getFormElement('actual_date'); 

getElementFromXML(formXML, ); :Gets the info from a field on a form- works with event_log fields before form is saved
EX: getElementFromXML(formXML,'program_providing_srevice');

getDataValue(); :Gets the info from the database (can be used to get the info about the staff who is accessing the form)
Plug your data in this order: getDataValue(‘LUT name’, ‘field to match on’, ‘value to match’, ‘value to return’)
EX: getDataValue('user_defined_lut', 'user_defined_lut_id', 'UDF_choices', 'description');
>getDataValue are upper case in NX, Lower case in classic if using the actual guid
>getFormElement are lower case in NX, upper case in classic if using the actual guid

setFormElement(); :Sets the value of a field
EX: setFormElement('udf_regularstring', mydata);

setElementFromXML(formXML,); :Sets the XML layer- used for field that are marked not-modifiable/not-visible 
EX: setElementFromXML(formXML, 'is_telehealth', 'on')

getParentFormElement(); :Grabs the value from a parent form for use in a sub form
EX: getParentFormElement('activity_type');


```

### Details
These are the building blocks for some of the more complex functions that you can built. 
Some can be used by themselves, all can be used in collaboration with eachother. 
Pay attention to what letters are capitailized are are not in the code, these are important. 

## Credits:
Anyone who has ever entered a piece of javaScript code onto the community. 

### To-Do
If there is a known issue or edge case still to work out, describe it here.
