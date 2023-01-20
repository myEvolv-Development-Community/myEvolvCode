### What You Want to Do:
Query and manipulate the contents of a subform from the parent form like using `getFormElement` or `setFormElement`

This page contains an updated implementation of the manipulation functions in a more modular style and better error handling

### Code to Do It:
```javascript

function querySubform(subformCaption, booleanFunction, outputColumn) {
  let subform = Form.getFormLineByCaption(subformCaption);
  if (subform) {
    let subformRow = findSubformRow(subform, booleanFunction)
    if (subformRow) {
    let cell = subformRow.FormLines.find(field => field.columnName === outputColumn)
    if (cell) {
      return cell.value ?? cell.lutValue
      } else console.warn(`The ${subformCaption} subform does not have a field called '${outputColumn}'`) // Also return undefined if the field was not found
    } else console.warn(`No row was found in the subform meeting the condition: ${booleanFunction.toString()}`) // Also return undefined if no qualifying row found
  } else console.warn(`No subform was found with the caption ${subformCaption}`); // Also return undefined if no subform found
}

function insertIntoSubformJSON(subformCaption, cellContents) {
  let subform = Form.getFormLineByCaption(subformCaption); // Get the subform element
  if (subform) {
    let subformRow = subform. // Find the empty subform row at the end
      sfValue.
      find(row => !row.isDirty && row.keyValue?.slice(0, 3) === 'new')
    Object.entries(cellContents).forEach(entry => updateCell(subformRow, entry))
    commitSubformChange(subform, subformRow)
  } else console.warn(`No subform was found with the caption ${subformCaption}`); // Also return undefined if no subform found
}

function updateSubformJSON(subformCaption, booleanFunction, cellContents) {
  let subform = Form.getFormLineByCaption(subformCaption); // Get the subform element
  if (subform) {
    let subformRow = findSubformRow(subform, booleanFunction)
    if (subformRow) {
      Object.entries(cellContents).forEach(entry => updateCell(subformRow, entry))
      commitSubformChange(subform, subformRow)
    } else console.warn(`No row was found in the subform meeting the condition: ${booleanFunction.toString()}`) // Also return undefined if no qualifying row found
  } else console.warn(`No subform was found with the caption ${subformCaption}`); // Also return undefined if no subform found
}

function deleteSubformRow(subform, booleanFunction) {
  let subform = Form.getFormLineByCaption(subformCaption); // Get the subform element
  if (subform) {
    let subformRow = findSubformRow(subform, booleanFunction)
    subformRow.formMode = 'DELETE'
    commitSubformChange(subform, subformRow)
  } else console.warn(`No subform was found with the caption ${subformCaption}`); // Also return undefined if no subform found
}

function findSubformRow(subform, booleanFunction) {
  let rowIndex = subform // Get the first row of the subform that satisfies the filter condition
    .sfValue
    .map(x => x.FormLines.reduce((a, b) => (a[b.columnName] = b.value ? b.value : b.lutValue,  a), {}))
    .findIndex(booleanFunction);
  return subform.sfValue[rowIndex]
}

function updateCell(row, keyValuePair) {
  let subformcell = row. // Find the column in the empty subform row to update
    FormLines.
    find(c => c.columnName == keyValuePair[0]);
  if (subformcell) {
    let newValue = keyValuePair[1];
    Array.isArray(newValue) ? subformcell.SetValue(...newValue) : subformcell.value = newValue;
    DirtyFormField._defaultChangeDetector(subformcell) // Register subform as dirty to prompt myEvolv to save
 } else console.warn(`This subform does not contain a ${keyValuePair[0]} field!`)
}

function commitSubformChange(subform, subformRow) {
  subform.isDirty = true
  subform.subFormHasData = true
  subformRow.isDirty = true
  subform.refreshGrid()
}
```

### Function Arguments
|Argument           |Definition |Data Type|
|---                |---        |---      |
|subformCaption     |The caption for the subform as displayed on the parent form.       |String|
|booleanFunction    |A function to apply to each row in order to find the desired value|Function|
|outputColumn       |The columnName of the field in the subform to return.              |String|
|updateColumn       |The columnName of the field in the subform to modify.              |String|
|cellContents       |The value to put into the updateColumn field on the subform.       |A JavaScript Object defined in JSON. The key should be a column name in the subform.|

### Implementation Details
1. Create a subform to manipulate
    * The subform can be hidden - `updateSubform` briefly toggles the subform to visible in order to run its manipulations.
2. Add the above function definitions and calls to them into the *parent* form. Examples include the On Save event for the form or the On Change hook for a field.
    * The functions that start with `query`, `insert`, `update`, and `delete` are the main functions to call in scripts
    * The remaining functions are utilities shared among the other functions. See the table below to see which utilities need to be defined for each main function.
4. Multiple queries, insertions, and updates can be used in the same action using multiple calls to the respective functions
5. Boolean functions yield a true or false value, and are applied to each row of the subform.
    * Common forms include `entry => entry?.someField === 'some constant'` or `entry => entry?.someField === entry?.someOtherField`
    * Use '&amp;&amp;' and || to include multiple tests in a single function
    * Recommended to use `?.` to access properties, as the first and last subform rows may have null attributes.
7. Cell contents for the `insert` and `update` functions should be formatted as key:value pairs like the following:
    ```
       var new_address = {street_address_1:'148 Bonnie Meadow Rd', city:'New Rochelle', state:'New York', nyscri_mailing:true}
       insertIntoSubformJSON("Personal Address", new_address) 
    ```
    
  #### Function dependencies
  
  |                     |`querySubform`    | `insertIntoSubform`|`updateSubformJSON`|`deleteSubformRow`|
  |  :---               |     :---:        | :---:              |:---:              |:---:             |
  |`findSubformRow`     |    X             |                    |   X               |     X            |
  |`updateCell`         |                  |  X                 |   X               |                  |
  |`commitSubformChange`|                  |  X                 |   X               |     X            |
  
  *X = The above function depends on this utility. The script must have this utility defined*
    
### End-User Details
Exact details will depend on the subform manipulated.
One promising use case is to schedule follow-up events based on an assessment reaching a critical score.

1. User enters a PHQ-9 Assessment for a client.
![An assessment being selected in the Client Service Entry Screen](/JavaScript%20Functions/assets/images/Subform%20Manipulation%201.png "An assessment being selected in the Client Service Entry Screen")

2. Client reports significant depression symptoms. The form's on save code scores the assessment, identifies the need for a follow-up  event and schedules using an Events To Do subform embedded in the assessment form. 
![An assessment form being completed](/JavaScript%20Functions/assets/images/Subform%20Manipulation%202.png "An assessment form being completed")

3. The follow-up event is scheduled to occur by the end of the next day (becomes overdue at the stroke of midnight). 
![The Client Service Entry Screen now showing the completed assessment and a follow-up task](/JavaScript%20Functions/assets/images/Subform%20Manipulation%203.png "The Client Service Entry Screen now showing the completed assessment and a follow-up task")
