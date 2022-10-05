### What is this:
Use getFormElement(); and **Column Name** of a field in the **Disable Rule** of another field to control whether that field is disabled or not.  

### Code:
Disable a field (this one is a LUT/Foreign Key) when the selected data is entered into it (LUT selection GUID)<br>
`getFormElement('udf_refcl') === 'A1B03084-BC60-4867-98A4-2AF7F2D3879F';`   

Disable a field (this one is a LUT/Foreign Key) when the selected data is NOT entered into it (LUT selection GUID)<br>
`getFormElement('udf_refcl') !== 'A1B03084-BC60-4867-98A4-2AF7F2D3879F';` 

Disable another field when the idicated field is NULL <br>
`getFormElement('udf_refcl') === '';`

Disable a field when there is an attached document on a specified Document Link field<br>
`getFormElement('attached_document') !== '';`

Disable a field when there is NOT an attached document on a specified Document Link field<br>
`getFormElement('attached_document') === '';`



### Details
In the above examples, this code would go into the **Disable Rule** box of the field in question that you want to be disabled/not disabled
