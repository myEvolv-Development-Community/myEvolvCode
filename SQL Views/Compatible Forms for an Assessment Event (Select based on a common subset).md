### What You Want to Do:
So... you changed a form associated with an assessment event instead of ending access to the old form and creating a new one. Now the event form loads but the tests from before the change show up as blank, and there are now events saved with the new event form, so you can't simply change back to the old form. You screwed up. You know what you did was wrong. The question is, how are you gonna make things right? Maybe you were trying to be save time. But take it from a guy who's been frozen for 65 years... the only way to really save time is to follow the rules.

![Captain America delivering a PSA](https://i.kym-cdn.com/entries/icons/original/000/026/202/america.jpg)

The following query pulls administered assessment events and finds compatible forms that have been associated with the event (from the event_definition_a audit table) and presents the form(s) that contain the subtests necessary to properly display the asssessment. Could also be used to find an alternate form to use, which may have different fields you want to display, but the same set of subtests.

### View Definition
```sql
select
test_multiple_link.test_header_id,
event_definition_a.form_header_id,
test_multiple_link.test_setup_header_id,
event_definition_a.date_archived,
event_log.date_entered
from event_log
inner join test_multiple_link on event_log.event_log_id = test_multiple_link.test_header_id
--inner join test_setup_header on test_setup_header.test_setup_header_id = test_multiple_link.test_setup_header_id
inner join form_lines on test_multiple_link.test_setup_header_id = form_lines.sub_test_header_id
inner join event_definition_a on form_lines.form_header_id = event_definition_a.form_header_id
where event_definition_a.event_definition_id = event_log.event_definition_id
and not exists(
select tsm.test_setup_header_id
from test_multiple_link as tsm
where test_multiple_link.test_header_id = tsm.test_header_id
except 
select sub_test_header_id
from form_lines
where form_lines.form_header_id = event_definition_a.form_header_id
)
and event_log.date_entered > event_definition_a.date_archived
```

### Other Details
Specify parameters, special forms structures to implement


### Example Output
|test_header_id	|form_header_id	|test_setup_header_id|	date_archived	date_entered|
|---|---|---|---|
|af3c5624-1969-46a2-977b-00db6011f72d	|715ba05c-9a78-4223-8e68-cc68c19f0439	|aa693ca1-0d74-47f9-94fd-b8f0c9e63054|	2/24/2016 10:01 PM|	3/4/2016 1:46 PM
|af3c5624-1969-46a2-977b-00db6011f72d	|715ba05c-9a78-4223-8e68-cc68c19f0439	|aa693ca1-0d74-47f9-94fd-b8f0c9e63054	|3/1/2016 12:34 PM	|3/4/2016 1:46 PM
