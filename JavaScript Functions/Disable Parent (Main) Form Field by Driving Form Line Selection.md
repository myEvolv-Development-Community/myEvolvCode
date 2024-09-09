### What You Want to Do:

Disable one or more fields on a form containing a driving-line subform based on whether or not a given row in the subform is checked.

### Code to Do It:
```javascript
let caption_to_find = /*Displayed caption inside the driving line subform, can be a portion of the whole caption*/;
let field_to_disable = /*Column name of the field on the parent form to disable*/;
let row_with_caption = $(`tr:has(:contains(${caption_to_find}))`);
let checkbox = "input:not([id])";

function disableInMainForm(triggeringElement, disabledElement, negate = false) {
  let result = $(triggeringElement). // Call back to the element which owns this on click listener
        prop("checked"); // Whether or not the box is checked
  result = negate ? !result : result; // if negate == true, then disable if the row is unchecked and disable if checked
  parent.  // Look up to the main page holding the subform
    Form.  // From the Form object on the parent form
    setDisabled(  // Apply a disable rule...
      disabledElement, // to the field we indicated above
      result.toString()// convert Boolean result to a string reading 'true' or 'false'
    );
  }

row_with_caption. // find a subform row that has a field which contains the displayed text we want to find
  find(checkbox). // The driving line checkbox is a checkbox input without an ID value
  on("click", function () { // When the checkbox is clicked...
    disableInMainForm(this, field_to_disable);
    }
  );

disableInMainForm(row_with_caption.find(checkbox), field_to_disable);
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|triggeringElement |The subform line that will determine whether the main form is disabled.|
|disabledElement|The element in the parent form to be disabled|


### Implementation Details
1. Step 1
2. Step 2
3. Step 3

### End-User Details
Here is where I explain what end users should see if everything works.

## Credits:
Acknowledge specific creators if known.

### To-Do
If there is a known issue or edge case still to work out, describe it here.
