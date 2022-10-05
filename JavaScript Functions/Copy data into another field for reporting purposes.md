### What is this:
In some cases fields that you are using are not availible in sub reprots or canned reports that your agency us using. Using this method you can take the data from one or more fields and plug into into another one. 
### Code:
Copy data from a LUT field into the generic_remarks field.<br>
`var newState = getElementFromXML(formXML, 'udf_state');`<br>
`var newDescription = getDataValue('state', 'state_id', newState, 'description');`<br>
`setFormElement('generic_remarks', newDescription);`<br>
`setElementFromXML(formXML, 'generic_remarks', newDescription);`<br><br>

Copy data from mutiple memo fields and put it into a field that is in a view that the Sub Reports use.<br>
`var adj = getFormElement('UDF_FormallyCharged');`<br>
`var hea = getFormElement('UDF_Adjudication');`<br>
`var mh = getFormElement('UDF_Alleged_Crime');`<br>
`var edu = getFormElement('udf_memo1');`<br>
`var earl = getFormElement('udf_memo2');`<br>
`var saf = getFormElement('udf_memo3');`<br>
`var oth = getFormElement('udf_memo4');`<br>
`setFormElement('referral_reason_other','<b>1. Adjustment Goal:</b> '+ adj +'<br><br><b>2. Health Goal:</b> ' + hea + '<br><br><b>3. Mental Health Goal:</b> ' + mh + '<br><br><b>4. Educational Goal:</b> ' + edu + '<br><br><b>5. Early Intervention Goal:</b> ' + earl + '<br><br><b>6. Safety Goal:</b> ' + saf + '<br><br><b>7. Other Goal:</b> ' + oth)`



### Details
These types of code can go into the **Before Save Code** box of the Form Header, or the **On Change/On Click Scrip** box of a certain field the staff will interact with.<br><br>
Note that HTML code can be used in the value portion of the setFormElement();
