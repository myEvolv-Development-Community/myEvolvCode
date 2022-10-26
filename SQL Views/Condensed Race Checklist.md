### What You Want to Do:

Collapse multiple racial identifications into a single value per person.

### View Definition
```sql
SELECT 
people.agency_id_no,
people.people_id,
STUFF(
  (
    SELECT distinct ',' + race_info.description
    FROM race inner join race_info on race.race_info_id = race_info.race_info_id
    WHERE race.people_ID = people.people_ID 
    --and race_info.description not in ('Unknown', 'Not Collected') --optionally leave out certain values if they would not be useful to report in list per se.
    FOR XML PATH('')
  ), 1, 1, '') AS race_description
FROM people
where people.agency_id_no is not null
order by agency_id_no asc
```

### Other Details
Compatible with most SQL Server versions. SQL Server 2017 introduces a more concise STRING_AGG aggregate function, which could be adopted if your myEvolv instance runs on that backend.

This view would be join-able to any data source on `people_id` to get the full list of racial identities the person reports.

The lists seem to generally be in alphabetical order, but this may not be guaranteed.

[Discussion and explanation how this works on Stack Overflow.](https://stackoverflow.com/questions/31211506/how-stuff-and-for-xml-path-work-in-sql-server)


### Example Output
| agency_id_no | people_id | race_description |
| ---------- | ----------- | --------- | 
| 00001       | 6055d1de-6a75-4fec-860f-2171fbefe82b     | Caucasian       | 
| 00002       | d74a9a6b-88c2-44a9-838e-3c07983ea178     | African-American, Asian-American       | 
| 00003       | 29651c0a-e38c-4545-b08b-6dd344ef52a4     | NULL      | 
