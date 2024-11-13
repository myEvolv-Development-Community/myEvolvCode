### What You Want to Do:
Embed a link to an editable version of a form in a Custom Report or Subreport, without JavaScript!

### View Definition
```sql
select
people_id,
event_log_id,
form_code, 
form_name,
event_name,
event_log.actual_date,
concat(
  '<a target="_blank" href="https://myevolvagencyxb.netsmartcloud.com/Form.aspx?caller=Listing&', -- begin creating the hyperlink, using your agency's URL
  'key_value=', event_log.event_log_id, -- key value for form is the event_log_id. Also works for any table key that is a copy of the event_log_id (e.g., test_header_id)
  '&parent_value=', event_log.people_id, -- parent value for the form is people_id. Modify if another parent value is needed
  '&form_header_id=', form_header.form_header_id, -- the form to launch, based on the event definition
  '&mode=EDIT&is_edit_allowed=true#!">', -- ensures the form is editable when launched and closes the hyperlink tag
  event_definition.event_name, ': ', event_log.actual_date, -- The text to display in the link, event name and date
  '</a>' -- closing tag
  ) as hyperlink
from form_header
inner join event_definition on event_definition.form_header_id = form_header.form_header_id
inner join event_log on event_log.event_definition_id = event_definition.event_definition_id
```

### Other Details
Can be used in either a custom report launched from the Reports module or in a virtual view subreport to embed within a form. In either case, the `hyperlink` column should be formatted as a Memo field, which converts the text into an HTML hyperlink tag (`<a>`).

Be aware that this view does not include any restrictions based on worker permissions, and could theoretically bypass a worker's role security, allowing edits or deletions where these actions would not normally be permitted.

Alternatively, we can modify the hyperlink to open as a nested myEvolv window using the following specification. The Memo formatting would still be needed.

```sql
concat(
  '<a href="#" onclick="OpenFormGeneric( 
    `eventform.asp`, //aspx file to use, defaults to Form.aspx
    `',form_code,'`, //form code 
    `',event_log_id,'`, //keyValue
    `EDIT`, //add, edit, or view mode
    true, //allow add? boolean
    true, //allow edit? boolean
    false, //allow delete? boolean
    false, 
    `',event_definition.event_definition_id,'`, // event definition id 
    `',people_id,'`, //parentValue
    `',service_track_event_id,'`, 
    null, 
    `',program_providing_service,'`, //program providing service
    `',program_enrollment_event_id,'`, //program enrollment id
    null, 
    false //does this complete a scheduled event? boolean
    );
    return false;">',
  event_definition.event_name, ': ', event_log.actual_date,
  '</a>') as hyperlink
```

### Example Output
Should look like a hyperlinked subreport, but the form that opens will be editable.
