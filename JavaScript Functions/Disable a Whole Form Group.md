### What You Want to Do:
Easily disable all fields under a single form group

### Code to Do It:
```javascript
function disableFormGroup(group_caption, disable_rule){
  var group_to_disable = Form.
    getFormLinesByTypeCode(""). //Finds all groups in the form (type codes are blank)
    find(group => group.caption == group_caption) // Find and return the first group that matches the caption provided
  
  Form.
    formObject.
    FormLines.
    forEach(fl => { // Iterate through form lines on the form
      if (fl.belongsTo?.toLowerCase() === group_to_disable.formLinesId.toLowerCase()) { // If the form line belongs to the selected group
        Form.setDisabled(fl.columnName, disable_rule, fl.formLinesId) // Apply the disable rule from above
      }
    }
  )
}
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|group_caption |The caption of the form group to disable|String|
|disable_rule|The disable rule to apply|Boolean value or JavaScript commands as a string|

### Implementation Details
The disable_rule can be a literal `true` or `false` value, a calculation, or a string which will be evaluated as JavaScript instructions by `Form.setDisabled`

Therefore, the following are equivalent:

1.
```js
var to_disable = getFormElement("variable_1") === getFormElement("variable_2") // Result is true or false
disableFormGroup("Group1", to_disable)
```
2.
```js
disableFormGroup("Group1", getFormElement("variable_1") === getFormElement("variable_2"))
```
4.
```js
disableFormGroup("Group1", `getFormElement("variable_1") === getFormElement("variable_2")`)
```

### End-User Details
Add the above function definition to a disable rule slot on the form. Wrap the actual call to the function in a `try {} catch {}` block like:
```js
try{
  disableFormGroup("Emergency Contact Information", getFormElement("udf_has_declined_contact"))
} catch {}
```

## Credits:
Acknowledge specific creators if known.

### To-Do
If there is a known issue or edge case still to work out, describe it here.
