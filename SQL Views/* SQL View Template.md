### What You Want to Do:

### View Definition
```sql
SELECT
  first_name,
  middle_name,
  last_name,
  nickname,
  'Client' as record_type
FROM clients
UNION
SELECT
  first_name,
  middle_name,
  last_name,
  nickname,
  'Staff' as record_type
FROM staff
```

### Other Details
Specify parameters, special forms structures to implement
