### What You Want to Do:

Collapse multiple diagnosis into a single value per person.

### View Definition
```sql
SELECT 
event_log.event_log_id,
STUFF(
  (select distinct
',' + icd10_code
from event_log as DXEL
inner join diagnosis_data on DXEL.event_log_id = diagnosis_data.event_log_id
inner join diagnoses on diagnosis_data.diagnoses_id = diagnoses.diagnoses_id
where 
DXEL.people_id = event_log.people_id
and isnull(DXEL.actual_date, '1753-01-01') <= isnull(event_log.end_date, '9999-12-31')
and isnull(DXEL.end_date, '9999-12-31') <= isnull(event_log.actual_date, '1753-01-01')
and dxel.event_definition_id = '526899D1-E158-41A0-BEE7-3AB814489ADB'
--and diagnoses.icd10_code not like('B2[0-4]%') and left(diagnoses.icd10_code, 3) <> 'Z21' -- optionally exclude diagnoses from inclusion in this list.
FOR XML PATH('')
  ), 1, 1, '') AS current_diagnoses
FROM event_log
```

### Other Details
Compatible with most SQL Server versions. SQL Server 2017 introduces a more concise STRING_AGG aggregate function, which could be adopted if your myEvolv instance runs on that backend.

This view would be join-able to any data source on `event_log_id` to get the full list of diagnoses active at the time of the event for the person.

The lists seem to generally be in alphabetical order, but this may not be guaranteed.

[Discussion and explanation how this works on Stack Overflow.](https://stackoverflow.com/questions/31211506/how-stuff-and-for-xml-path-work-in-sql-server)


### Example Output
|  event_log_id | current_diagnoses |
| ---------- | --------- | 
| 6055d1de-6a75-4fec-860f-2171fbefe82b     | F43.23       | 
| d74a9a6b-88c2-44a9-838e-3c07983ea178     | F10.21, F15.21, F17.200, F31.9, F32.9       | 
| 29651c0a-e38c-4545-b08b-6dd344ef52a4     | NULL      | 
