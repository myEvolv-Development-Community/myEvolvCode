Here is a handy sql snippet that I use regularly.

> explanation here.

```
SELECT *
FROM event_log
WHERE people_id = (
  SELECT people_id
  FROM people
  WHERE last_name = 'Pan'
  AND first_name = 'Peter'
)
```
