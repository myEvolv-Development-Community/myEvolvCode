### What You Want to Do:
Look up the form for editing an event by the event_name.

### View Definition
```sql
select
event_name,
form_name,
form_code,
event_definition_id,
form_header.form_header_id
from event_definition
inner join form_header on event_definition.form_header_id = form_header.form_header_id
```

### Other Details
[Useful for hyperlinking to editable forms.](https://github.com/Khoirovoskos/Example-Code-Repo/blob/main/JavaScript%20Functions/Subreport%20Hyperlink%20to%20Editable%20Form.md)
