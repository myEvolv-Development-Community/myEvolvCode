## What you want to do

Get the oldest and most recent record for each group.

## View Definition

```
select 
people.people_id,
earliest.event_definition_id as earliest_event_definition_id,
earliest.event_log_id as earliest_event_log_id,
earliest.date_entered as earliest_date_entered,
latest.event_definition_id as latest_event_definition_id,
latest.event_log_id as latest_event_log_id,
latest.date_entered as latest_date_entered
from people
cross apply (
  select 
  people_id,
  event_definition_id,
  event_log_id,
  date_entered
  from event_log
  where event_log.people_id = people.people_id
  order by date_entered asc offset 0 rows fetch next 1 row only
) as earliest
cross apply (
  select 
  event_definition_id,
  event_log_id,
  date_entered
  from event_log
  where event_log.people_id = earliest.people_id
  and event_log.event_definition_id = earliest.event_definition_id -- optionally limit to same event_definition_id
  order by date_entered desc offset 0 rows fetch next 1 row only
) as latest
-- Optional ORDER BY clause
ORDER BY sub.date_entered
```

## Other Details

The "sub" alias below could be joined to any table that event_log could be joined to.

In this case:
    - groups are represented by people_id and
    - age of each record is filtered using date_entered.
