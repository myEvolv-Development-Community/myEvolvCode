### What You Want to Do:
Embed a link to an attached document on a form that will actually open.

### View Definition
```sql
select event_log_id,
'<a href="https://myevolv(agencyURL).netsmartcloud.com/Image.aspx?id='+cast(attached_document as nvarchar(50))+'">Attachment</a>' attachment_link
from event_log
where attached_document is not null
```

### Other Details
The `attachment_link` column should be formatted as a Memo field, which converts the text into an HTML hyperlink tag (`<a>`).

### Example Output
Should open the attachment when clikced on via the executed report. 
