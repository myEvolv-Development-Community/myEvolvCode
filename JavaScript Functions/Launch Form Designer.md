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
1. Create three new virtual view subreports based on
   - [Events Using a Specific Form](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/Events%20Using%20a%20Specific%20Form.sql)

| Column   | Format | Visible?| Join Field?| 
| -------- | ------ | ------- | ---------- |
| `category_name` | Regular String | Yes | No |
| `event_name` | Regular String | Yes | No |
| `form_header_id` | Foreign Key | No | Yes |

   - [Navigation Tabs Using a Specific Form](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/Formset%20Members%20Using%20a%20Form.sql)

| Column   | Format | Visible?| Join Field?| 
| -------- | ------ | ------- | ---------- |
| `breadcrumb` | Regular String | Yes | No |
| `form_header_id` | Foreign Key | No | Yes |
     
   - Form Usage as a Subform (virtual view based on `form_view`)

| Column   | Format | Visible?| Join Field?| 
| -------- | ------ | ------- | ---------- |
| `form_family_name` | Regular String | Yes | No |
| `form_name` | Regular String | Yes | No |
| `sub_form_header_id` | Foreign Key | No | Yes | 

*All the above subreports join to the parent form on `form_header_id`*
     
2. Navigate to Form Designer, and open any form.
3. Open the form header section for the form (before the form lines)
4. Right-click the expanded form_header and click Inspect
5. Navigate to the Console in the Developer Tools pane and enter the launching script above
6. Add a new variable to the form.
   - Name the variable form_header_id.
   - Set the default value to `keyValue;`
   - Mark the variable as not visible
7. Add the three subreports indicated above
8. When a form is opened in Form Designer, the subreports will indicate at a glance where and how the current form is used in the system.
   
#### Event Definitions - insert a copy button, unify the amend permission, and visibility on use in workflows
1. Create a new virtual view subreport based on
   - [Event Usage in Workflows](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/Events%20Using%20a%20Specific%20Form.sql)
| Column   | Format | Visible?| Join Field?| 
| -------- | ------ | ------- | ---------- |
| `event_use` | Regular String | Yes | No |
| `workflow_grouping` | Regular String | Yes | No |
| `workflow_caption` | Regular String | Yes | No |
| `event_definition_id` | Foreign Key | No | Yes | 

2. Navigate to Event Setup and open any event form
3. Right-click on the main form (outside any subreport and outside the Security subform) and open the form designer
4. Add a variable, formatted as a regular string or unique identifier.
   - Mark the field as not visible
   - Set the default value to `keyValue;`
6. At the end of the form, add a new variable
   - Format the variable as a Boolean field
   - Add the script from [Copy Form Contents](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/JavaScript%20Functions/Copy%20Form%20Contents.md) to the On Click box
7. Save the Form Design and return to the Event Setup form
8. Right click on a worker role in Security for Event subform, and open the form designer
9. Add a box for the Amend permission and mark the field as Visible on Subform


#### Formset Maintenance - specify security access across all navigation schemes for a formset member

#### Test Designer - Add a default value to multiple-select questions
