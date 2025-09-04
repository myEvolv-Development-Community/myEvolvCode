### What You Want to Do:
Duplicate the content of a form and make a new record. This is particularly helpful for creating a new version of an existing event: This script will make a new event with the exact settings as the original event, which can then be modified before saving to update the event name and form used.

### Code to Do It:
```javascript
function resolveAfterNSeconds(n){
  return new Promise(
    (resolve) => {
      setTimeout(
        () => {resolve()},
        n)
      }
    );
  }

async function f1(n) {
  var x = await resolveAfterNSeconds(n);
  if(!newWin.document.querySelector(".blockUI")) {
    function readFormLine(fl) {
      if (fl.typeCode == "FK") {
        return [fl.lutValue.value, fl.lutValue.description, fl.lutvalue?.prompt]
      } else if (fl.typeCode == "SF") {
        return fl.
          sfValue.
          filter(row => row.formMode != "ADD" && row.formMode != "DELETE" && row.formMode != "NEW").
          map(row => 
            Object.fromEntries(row.
            FormLines.
            map(fl => [fl.columnName, readFormLine(fl)]).
            filter(entry => entry[1] !== null && !(Array.isArray(entry[1]) && entry[1].length < 1))
          )
        )
      } else {return fl.value}
    }

    newWin.updateCell = (row, keyValuePair) => {
      let subformcell = row. // Find the column in the empty subform row to update
        FormLines.
        find(c => c.columnName == keyValuePair[0]);
      if (subformcell) {
        let newValue = keyValuePair[1];
        Array.isArray(newValue) ? subformcell.SetValue(...newValue) : subformcell.value = newValue;
        subformcell.subFormHasData = true
        DirtyFormField._defaultChangeDetector(subformcell) // Register subform as dirty to prompt myEvolv to save
      } else console.warn(`This subform does not contain a ${keyValuePair[0]} field!`)
    }

    newWin.commitSubformChange = (subform, subformRow) => {
      subform.isDirty = true
      subform.subFormHasData = true
      subformRow.isDirty = true
      subformRow.hasData = true
      subformRow.subFormHasData = true
    }

    newWin.insertIntoSubformJSONById = (formLineId, cellContents) => {
      let subform = newWin.Form.getFormLineById(formLineId); // Get the subform element
      if (subform) {
        let subformRow = subform. // Find the empty subform row at the end
          sfValue.
          find(row => !row.isDirty && row.keyValue?.slice(0, 3) === 'new' && row.keyValue?.length > 3)
        Object.entries(cellContents).forEach(entry => newWin.updateCell(subformRow, entry))
        newWin.commitSubformChange(subform, subformRow)
        subform.RefreshGrid()
      } else console.warn(`No subform was found with the ID ${formLineId}`); // Also return undefined if no subform found
    }

    Form.
      formObject.
      FormLines.
      filter(fl => fl.columnName && fl.typeCode != 'RSF').
      map(fl => ({formLinesId: fl.formLinesId, typeCode: fl.typeCode, value: readFormLine(fl)})).
      filter(entry => entry[1] !== null && !(Array.isArray(entry[1]) && entry[1].length < 1)).
      forEach(entry => {
        if (entry.typeCode == 'SF') {
          entry.value.forEach(i => newWin.insertIntoSubformJSONById(entry.formLinesId, i, newWin));
        } else if (entry.typeCode == "FK") {
          newWin.Form.setFormElementById(entry.formLinesId, entry.value[0]);
        } else {
          newWin.Form.setFormElementById(entry.formLinesId, entry.value);
        }
      }
    )

// If any subform on the new form is a driving line subform, ensure that the box to enable the added rows is checked.
    newWin.
      Form.
      getSubForms().
      forEach(sf =>
        newWin.
        $($("iframe", sf.GetField()).prop("contentDocument")).
        find(`tr input.dirty`).
        closest('tr').
        find('input:not([id])').
        trigger("click")
      )

    Form.setFormElement("event_name", getFormElement("event_name") + " " + new Date().toISOString().slice(0, 10));

    newWin.Form.setFormElement("event_name", newWin.getFormElement("event_name") + " - copy")
    } else {
      f1(n);
    }
  }
var newWin = window.open(`https://${Form.formObject.serverHandling}/Form.aspx?form_header_id=${Form.formObject.formHeaderId}&parent_value=${parentValue}&key_value=&is_add_allowed=true&is_edit_allowed=true&is_delete_allowed=true&mode=ADD&isCompleteScheduledEvent=false#!`);

f1(1000);
```

### Implementation Details
1. Open the record you want to copy. This script was originally intended for user-defined event definitions, but can be applied to other types of records as needed.
2. Right-click the form and select Inspect.
3. Navigate to the Console tab in the Developer Tools pane and paste the above code into the tab.
4. Press Enter
5. A new tab should appear (if not, check your popup blocking settings and try again).
6. The new tab should populate with the information from the existing event.
7. Modify the new record as needed, and save the form.
8. Make any necessary changes to the original record and save.

### End-User Details
After saving, the new tab should refresh and be replaced with a new blank record. This is totally normal. Confirm the copied event is saved by navigating back to the main myEvolv tab.
