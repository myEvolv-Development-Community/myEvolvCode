## What you want to do

Get the oldest and most recent record for each group.

## View Definition

```
SELECT 
  people.people_id,
  earliest.event_definition_id AS earliest_event_definition_id,
  earliest.event_log_id AS earliest_event_log_id,
  earliest.date_entered AS earliest_date_entered,
  latest.event_definition_id AS latest_event_definition_id,
  latest.event_log_id AS latest_event_log_id,
  latest.date_entered AS latest_date_entered
FROM people
CROSS APPLY (
  SELECT
    people_id,
    event_definition_id,
    event_log_id,
    date_entered
  FROM event_log
  WHERE event_log.people_id = people.people_id
  ORDER BY date_entered ASC OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY
) AS earliest
CROSS APPLY (
  SELECT
    event_definition_id,
    event_log_id,
    date_entered
  FROM event_log
  WHERE event_log.people_id = earliest.people_id
  AND event_log.event_definition_id = earliest.event_definition_id -- optionally limit to same event_definition_id
  ORDER BY date_entered DESC OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY
) AS latest
-- Optional ORDER BY clause
ORDER BY earliest.date_entered -- or latest.date_entered
```

## Other Details

The "earliest" and "latest" aliases above could be joined to any table that event_log could be joined to.

In this case:
    - groups are represented by people_id and
    - age of each record is filtered using date_entered.
