### What You Want to Do:
> So... you changed a form associated with an assessment event instead of ending access to the old form and creating a new one. Now the event form loads but the tests from before the change show up as blank, and there are now events saved with the new event form, so you can't simply change back to the old form. You screwed up. You know what you did was wrong. The question is, how are you gonna make things right? Maybe you were trying to be save time. But take it from a guy who's been frozen for 65 years... the only way to really save time is to follow the rules.

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

1. How it works
The query above works in three distinct steps:
a. Find all the subtests that should be associated with the event. `test_multiple_link` records which sub-tests (`test_setup_header_id`) should be associated with the test event (`test_header_id`)
```sql
select
test_multiple_link.test_header_id,
test_multiple_link.test_setup_header_id
from event_log
inner join test_multiple_link on event_log.event_log_id = test_multiple_link.test_header_id
```

b. Find all the forms that have historically been associated with the event definition for the assessment event using the event_definition_a (audit) table and which contain at least one of the relevant sub-tests.
```sql
select
event_definition_a.form_header_id,
event_definition_a.date_archived,
event_log.date_entered
from event_log
inner join test_multiple_link on event_log.event_log_id = test_multiple_link.test_header_id
inner join form_lines on test_multiple_link.test_setup_header_id = form_lines.sub_test_header_id
inner join event_definition_a on form_lines.form_header_id = event_definition_a.form_header_id
where event_definition_a.event_definition_id = event_log.event_definition_id
and event_log.date_entered > event_definition_a.date_archived
```

c. Keep only the forms that contain form lines for *all* of the sub-tests associated with the event instance. `NOT EXISTS (... EXCEPT ...)` re-frames this statement as something like 'There are *not any* sub-tests associated with this event occurence that are not included on the form.' If there is a subtests that should be associated with the event but it not on the form, then the form is excluded from the result.

3. Working example: redirect form after load to a compatible form from the event definition's history.

Added to the form's After Load Code
```js
if(formMode != 'ADD') { // Do this for EDIT, DELETE, or VIEW
    window.location.href = // Redirect to a different URL
        window.location.href.replace( // Use replace() to swap out the form_header_id, the only change we want to make here
            /(?<=form_header_id=)[^&]*/i, // I used a regular expression to find the GUID following the query parameter 'form_header_id=' amd up to the next parameter (indicated with an &). Now I have two problems.
            getDataValue( // Query the virtual view defined above, looking up the test event in the current window.
                "vv_Compatible_Forms_for_Assessment", 
                "test_header_id", 
                keyValue, 
                "form_header_id", // return the form_header_id to use
                null, 
                "date_archived desc" // Pull the most recently-associated form from the list.
            )
    );
}
```

When the event is opened, there is a brief delay as the system looks up and re-opens the correct form, but then the event will appear with the appropriate form, which may or may be the current form associated with the event.

### Example Output
|test_header_id	|form_header_id	|test_setup_header_id|	date_archived	date_entered|
|---|---|---|---|
|af3c5624-1969-46a2-977b-00db6011f72d	|715ba05c-9a78-4223-8e68-cc68c19f0439	|aa693ca1-0d74-47f9-94fd-b8f0c9e63054|	2/24/2016 10:01 PM|	3/4/2016 1:46 PM
|af3c5624-1969-46a2-977b-00db6011f72d	|715ba05c-9a78-4223-8e68-cc68c19f0439	|aa693ca1-0d74-47f9-94fd-b8f0c9e63054	|3/1/2016 12:34 PM	|3/4/2016 1:46 PM
