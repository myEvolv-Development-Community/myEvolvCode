What you want to do:

Configure a custom report in myEvolv to launch a different form for different events in the report, even if they do not share the same form.

How to do it:

1. Create the following view under `Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting > Virtual Views Setup` and name it `Event Form View` (the SQL name will be `vv_Event_Form_Vuew`).`

```sql
select
event_log_id,
form_code
from form_header
join event_definition on event_definition.form_header_id = form_header.form_header_id
join event_log on event_log.event_definition_id = event_definition.event_definition_id
```

2. Under either the Tests and Assessments (People) form family or the Activities (People) form family, create a new form (or upload [this](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/Form%20Design/Exports/Form%20Launcher.json) form.
- The form will contain one line for a people_id (Event Log field; "Link to Person")
- In the form's after load code, place the following JavaScript instruction: 
```js
 window.location.href = `https://${Form.formObject.serverHandling}/${Form.formObject.FormProgramXB}?form_header_id=${getDataValue("vv_event_form_view", "event_log_id", keyValue, "form_code")}&parent_value=${parentValue}&key_value=${keyValue}&is_add_allowed=false&is_edit_allowed=false&is_delete_allowed=false&mode=VIEW&isCompleteScheduledEvent=false#!`
```
- Name the form "Form Launcher"

3. (If needed) Create any custom views necessary to collect the data for the Custom Report. Make sure the event_log_id for the event is an available column in the dataset.

4. Create the custom report, making sure the event_log_id for the event is selected under "Manage Data Sources"
5. Add a table to the report, and under "Additional Properties" in the Table Columns section, select the Form Launcher under "Form to Launch" and event_log_id as the Key Value column for whichever field you want to display a hyperlink.
6. Confirm the report works as expected, with hyperlinks, and link it to an Evolv Report. The hyperlink in the custom report will open the Form Launcher to start, then immediately redirect to the view/edit form for the appropriate event.



