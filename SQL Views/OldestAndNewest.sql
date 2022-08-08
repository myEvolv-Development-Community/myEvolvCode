/*
Get the oldest and most recent record for each group.

This is a rather basic example based on the event_log table.
    The "sub" alias below could be joined to any table that event_log could be joined to.

In this case:
    groups are represented by people_id and
    age of each record is filtered using date_entered.
*/

SELECT
    sub.event_log_id,
    sub.people_id,
    sub.date_entered
FROM (
    SELECT *,
        RnAsc = ROW_NUMBER() OVER(PARTITION BY  people_id ORDER BY  date_entered),
        RnDesc = ROW_NUMBER() OVER(PARTITION BY people_id  ORDER BY date_entered DESC)
    FROM event_log
) sub
WHERE
    (
        sub.RnAsc = 1
        OR sub.RnDesc = 1
    )
-- Optional ORDER BY clause
ORDER BY sub.date_entered
