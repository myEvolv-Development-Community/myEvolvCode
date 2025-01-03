### What You Want to Do:
Advanced querying of values from subforms

### Code to Do It:
```javascript
function getSubformElements(sfValue, output_expression) {
  let output_function
  if (typeof(output_expression) === 'function') { // Output specified as ready-to-use function, most flexible usage
    output_function = output_expression
  } else if (Array.isArray(output_expression)) { // Output specified as array of column names, e.g., ['actual_date', 'end_date'] - could also be done with function specification
    output_function = row => output_expression.map(column => getFormElement(column, row))
  } else { // If specification is neither a function nor an array, assume it's a single column name to pull from each row
   output_function = row => getFormElement(output_expression, row)
  }
  if (Array.isArray(sfValue)) {
    return sfValue.map(output_function) // replace with flatMap so function specification can simulataneously filter?
    } else {return output_function(sfValue) 
  }
}
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|sfValue |The sfValue attribute from a subform (e.g., as found with `Form.getFormLineByCaption('My Subform').sfValue`) or a single entry from that sfValue array ([or an array/object that getFormElement can access](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/How-To%20Guides/Use%20getFormElement%20across%20Subform%20Rows%20and%20Treatment%20Plan%20Components.md)).|Array or Object|
|output_expression|A function to apply across subform rows to compute an output per row, an array of column names, or a single column name.|Function, Array, or String|


### Example Usage
```js
// Get all values of a single column:
getSubformElements(Form.getFormLineByCaption("Personal Address").sfValue, "street_address_1")

// Get two or more columns from a subform:
getSubformElements(Form.getFormLineByCaption("Personal Address").sfValue, ["street_address_1", "zip_code"])

// Compute an output using a function
getSubformElements(Form.getFormLineByCaption("Personal Address").sfValue, (row) => `${getFormElement("street_address_1", row)} ${getFormElement("zip_code", row)}`)
```
