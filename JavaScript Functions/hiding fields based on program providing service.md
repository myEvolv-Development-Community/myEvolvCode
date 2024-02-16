### What You Want to Do: Hiding fields based on program providing service.

### Code to Do It:
```javascript
let columnFormLine = Form.getFormLineByColumnName('column_name'); //declares variable, pick the field you want to manipulate
const $column = $(`[form_line_id="${columnFormLine.formLinesId}"]`);
const program = getFormElement('program_providing_service');
const myCoolProgram = 'GUID'; //in place of GUID, select the program guid

if (program !== myCoolProgram) {
      $column.hide();
      columnFormLine.suppressFromPrint = true; // In case you don't want it to print either.
} else {
      $column.show();
      columnFormLine.suppressFromPrint = false;
}
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|$column |The meaning of this input to the function|string|
|program|pulls the part of the form that we are using as a trigger|string|
|myCoolProgram |GUID of the program |GUID|


### Implementation Details
1. Code should be placed in on load section of service entry

### End-User Details
Users should see, or not see, the field desired based on which program is providing service

## Credits:
Matt W. did most of the heavy lifting here. Kudos to him
Jake B. did the formatting for this post

### To-Do
On load cannot be used for treatment plans
