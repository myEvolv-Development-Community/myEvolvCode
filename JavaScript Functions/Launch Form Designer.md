### What You Want to Do:
Launch the form designer for any form in the system.

### Code to Do It:
```javascript
window.open(`https://${Form.formObject.serverHandling||window.parent.Form.formObject.serverHandling}/FormDesigner.aspx?parent_value=${Form.formObject.formFamilyId}&form_family_id=${getDataValue("form_family", "form_family_name", 'Form Designer', 'form_family_id')}&fdmode=DEV&keyValue=${Form.formObject.formHeaderId||getDataValue("form_header", "form_code", Form.formObject.formCode, 'form_header_id')}#!`)
```

### Implementation Details
1. Open a record using the form you want to modify.
2. Right-click the form and select Inspect.
3. Navigate to the Console tab in the Developer Tools pane and paste the above code into the tab.
4. Press Enter
5. A new tab should appear (if not, check your popup blocking settings and try again).
6. The new tab will contain the form designer tool with the current form design open.
7. Modify the form as needed, and save the form.
8. Reload the open record in the original tab to see the changes take effect

### End-User Details
This script appears to work for any form in the system, including the Form Designer itself. The form design for subforms can also be launched similarly by right-clicking within any row of the subform (in collapsed, i.e., not expanded view) and selecting Inspect.

Below are some notes on UI changes I have made using this launched form designer:

#### Form Designer - visibility on where a form is used

#### Event Definitions - insert a copy button and visibility on use in workflows

#### Formset Maintenance - specify security access across all navigation schemes for a formset member

#### Test Designer - Add a default value to multiple-select questions
