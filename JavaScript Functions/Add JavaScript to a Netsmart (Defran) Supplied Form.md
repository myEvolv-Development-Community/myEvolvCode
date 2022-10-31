### What You Want to Do:

Some forms are locked from modifications by Netsmart clients because they are bundled with myEvolv in Netsmart's delivery of the software. One of the major hurdles as a result is that users are unable to add JavaScript to the load, change, etc. actions for fields on these forms. However, new field elements and variable elements can often be added to these forms anyway. The following instructions allow a way to bypass this restriction by side-loading the JavaScript using a variable element.

### Code to Do It:
```javascript
/*General version*/

// Get the Form Line of the element you want to modify:
var formLine = Form.getFormLineByColumnName('end_date')

// Determine the field action you want to modify. The On Change (`"onchangeEvent"`) and On Click (`"onclickEvent"`) actions are good candidates.
var action = "onchangeEvent"

// Define the script you want to insert. Use `=` if you want to override all the pre-defined JavaScript associated with the element, or `+=` if you just want to add to it. 
//Use [brackets] so that we can reference the property using its name and a variable. Otherwise, use the typical object.property format.

formLine[action] += // Use += \n to add this to the existing script. Uses `backticks` to allow for line breaks and string interpolation as needed

`\n
// Some JavaScript to execute goes in here
`;
```

### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|formLine |The object representing the element's form line |Reference a field's column name or caption as text in getFormLineByColumnName or getFormLineByCaption|
|action|The field event to update.|Reference an action/event by name as a string. |
|Script to insert|The JavaScript you want to execute when the specified action (e.g., change or click) occurs.|This will be a string as well. myEvolv evaluates the string when the event occurs and turns it into a function which then executes.|

### Implementation Details
1. Identify the form you want to modify
2. Define the behavior you want the form to include
3. If the form element does not allow for edits, create a variable element on the form.
  a. The variable element's data type does not matter, but I like to use Boolean (checkbox) elements. 
5. Set the variable element to be not required and not visible on the form.
6. Add the script you want to include to the On Load script for the variable.

### End-User Details
``` js
// Practical Example. Makes certain fields on the program enrollment form required at the time of discharge. Added to the on load script of a hidden variable on the form.
Form.getFormLineByColumnName('end_date').onchangeEvent = 
`
var is_program_ended = !Util.isNullOrEmpty(getFormElement('end_date'));
['opening_reason_other', 'program_objectives', 'udf_rec_discharge', 'closing_reason_id', 'outcome_id', 'type_of_discharge'].
  forEach(field => {
    if (is_program_ended) {
      Form.makeRequiredByColumn(field)
    } else {
      Form.makeUnRequiredByColumn(field)
    }
  }
)
`;

/* As an alternative approach, define the variable and put the script in the corresponding box you want to execute as normal. 
(e.g., if you want something to execute when a field changes, but the script in the variables On Change script. 
Then, put the following in the variable's On Load script to directly copy the variable's On Change script to the field's
This approach sacrifices flexibility for simplicity. */

Form.getFormLineByColumnName('end_date').onchangeEvent = Form.getFormLineByColumnName('new_variable').onchangeEvent


```
