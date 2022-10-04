### What is this:
These can be used to set a boolean field as checked or unchecked based off of other fields
### Code:
Simple: Put in the **On Change** box of the field that the user will interact with<br>
`setFormElement('is_telehealth', 'on')`<br><br>

More Complex: Check the boolean if a certain selection is picked in a LUT/Foreign Key field. Put in the **On Change** box of the field that the user will interact with<br>
`var selectedOption = getDataValue('user_defined_lut', 'user_defined_lut_id', getFormElement('udf_picklist'), 'description');`<br>
`if(selectedOption == 'Yes'){{`<br>
`setFormElement('udf_boolean', 'on');`<br>
`}}`<br>
`else {{`<br>
`setFormElement('udf_boolean', 'off');`<br>
`}}`


### Details
Note that in the function 'on' and 'off' are used to change the status of the boolean field. If you are trying to evlauate the value of a boolean field the value of a checked box is '1' and an unchecked box is '0'.
