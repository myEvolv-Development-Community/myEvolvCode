### What You Want to Do:
Query and manipulate the contents of a subform from the parent form like using `getFormElement` or `setFormElement`

### Code to Do It:
```javascript

function querySubform(subformCaption, booleanFunction, outputColumn) {
  let subform = Form.getFormLineByCaption(subformCaption);
  if (subform) {
    let cell = subform // Get the first row of the subform that satisfies the filter condition
      .sfValue.map(x => x.FormLines.reduce((a, b) => (a[b.columnName] = b.value ? b.value : b.lutValue,  a), {}))
      .filter(booleanFunction)[0];
    return cell !== undefined ? cell[outputColumn].value ?? cell[outputColumn] : undefined; // If the cell exists in the row, output the value; otherwise return undefined.
  } else return undefined; // Also return undefined if no row meets the filter criterion.
}

function updateSubform(subformCaption, booleanFunction, updateColumn, newValue) {
  let subform = Form.getFormLineByCaption(subformCaption);
  let row = subform // Get the row of the subform that meets the filter condition
        .sfValue // Array of rows
        .map(x => x.FormLines.reduce((a, b) => (a[b.columnName] = b.value ? b.value : b.lutValue,  a), {})) // Convert each row to a key:value pair
        .findIndex(booleanFunction); // Find first row that satisfies the lookup function
  let subformcell = subform.sfValue[row] // Find the cell in the relevant row corresponding to the field to update
       .FormLines // Array of fields within a row
       .filter(c => c.columnName == updateColumn)[0]; // Find the exact cell to update.

  // Overwrites the value of the cell with the new value.
  // Nedd to pass an array as the new value for lookup tables formatted as foreign keys.
  // Array should look like: [GUID, Caption, sc_code], e.g., ["14a7e914-e609-47a1-9435-d2ad77c96c97", "Unknown", "UN"]
  Array.isArray(newValue) ? subformcell.SetValue(...newValue) : subformcell.value = newValue;

  // Mark subform as dirty
  subform.isDirty = true
  subform.subFormHasData = true
  DirtyFormField._defaultChangeDetector(subformcell) // Register subform as dirty to prompt myEvolv to save
}

function insertIntoSubform(subformCaption, updateColumn, newValue) {
  let subform = Form.getFormLineByCaption(subformCaption); // Get the subform element
  let subformcell = subform. // Find the empty subform row at the end and the field to insert in it.
      sfValue.
      slice(-1)[0].
      FormLines.
      filter(c => c.columnName == updateColumn)[0];

  // Inserts the value of the cell in the new row.
  // Nedd to pass an array as the new value for lookup tables formatted as foreign keys.
  // Array should look like: [GUID, Caption, sc_code], e.g., ["14a7e914-e609-47a1-9435-d2ad77c96c97", "Unknown", "UN"]
  Array.isArray(newValue) ? subformcell.SetValue(...newValue) : subformcell.value = newValue;
}
```

### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|subformCaption |The caption for the subform as displayed on the parent form.|String|
|booleanFunction|A function to apply to each row in order to find the desired value|Function|
|outputColumn   |The columnName of the field in the subform to return.|String|
|updateColumn   |The columnName of the field in the subform to modify.|String|
|newValue       |The value to put into the updateColumn field on the subform.|An atomic variable or an array|

### Implementation Details
1. Create a subform to manipulate
    * At the moment, `updateSubform` requires a variable field called 'is_sullied' to mark the value as dirty. Future developments may remove this requirement.
    * `query` and `insert` actions do not have any special requirements.
    * The subform can be hidden - `updateSubform` briefly toggles the subform to visible in order to run its manipulations.
2. Add the above function definitions and calls to them into the *parent* form. Examples include the On Save event for the form or the On Change hook for a field.
3. `insertIntoSubform` requires a call to `Form.getFormLineByCaption(subformCaption).RefreshGrid() to commit changes.`
4. Multiple queries, insertions, and updates can be used in the same action using multiple calls to the respective functions
5. Boolean functions yield a true or false value, and are applied to each row of the subform.
    * Common forms include `entry => entry?.someField === 'some constant'` or `entry => entry?.someField === entry?.someOtherField`
    * Use '&amp;&amp;' and || to include multiple tests in a single function
    * Recommended to use `?.` to access properties, as the first and last subform rows may have null attributes.
7. Iteration makes inserting a whole subform row easier
    ```
       var address = {street_address_1:'148 Bonnie Meadow Rd', city:'New Rochelle', state:'New York', nyscri_mailing:true}
       Object.keys(address).forEach((field) => insertIntoSubform('Address', field, address[field])
       Form.getFormLineByCaption('Address').RefreshGrid() 
    ```
### End-User Details
Exact details will depend on the subform manipulated.
One promising use case is to schedule follow-up events based on an assessment reaching a critical score.

1. User enters a PHQ-9 Assessment for a client.
![An assessment being selected in the Client Service Entry Screen](/JavaScript%20Functions/assets/images/Subform%20Manipulation%201.png "An assessment being selected in the Client Service Entry Screen")

2. Client reports significant depression symptoms. The form's on save code scores the assessment, identifies the need for a follow-up  event and schedules using an Events To Do subform embedded in the assessment form. 
![An assessment form being completed](/JavaScript%20Functions/assets/images/Subform%20Manipulation%202.png "An assessment form being completed")

3. The follow-up event is scheduled to occur by the end of the next day (becomes overdue at the stroke of midnight). 
![The Client Service Entry Screen now showing the completed assessment and a follow-up task](/JavaScript%20Functions/assets/images/Subform%20Manipulation%203.png "The Client Service Entry Screen now showing the completed assessment and a follow-up task")
