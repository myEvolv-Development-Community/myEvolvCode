## What you want to do

Get a list of foreign keys and the primary keys they reference. Includes the tables on which both keys are found.

## View Definition

```
-- from: https://dba.stackexchange.com/a/31721
SELECT
    o1.name AS FK_table,
    c1.name AS FK_column,
    fk.name AS FK_name,
    o2.name AS PK_table,
    c2.name AS PK_column,
    pk.name AS PK_name,
    fk.delete_referential_action_desc AS Delete_Action,
    fk.update_referential_action_desc AS Update_Action
FROM sys.objects o1
    INNER JOIN sys.foreign_keys fk
        ON o1.object_id = fk.parent_object_id
    INNER JOIN sys.foreign_key_columns fkc
        ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.columns c1
        ON fkc.parent_object_id = c1.object_id
        AND fkc.parent_column_id = c1.column_id
    INNER JOIN sys.columns c2
        ON fkc.referenced_object_id = c2.object_id
        AND fkc.referenced_column_id = c2.column_id
    INNER JOIN sys.objects o2
        ON fk.referenced_object_id = o2.object_id
    INNER JOIN sys.key_constraints pk
        ON fk.referenced_object_id = pk.parent_object_id
        AND fk.key_index_id = pk.unique_index_id
```

## Other Details

It's recommended that you add filters for the table and column fields.

Use case:

- If I were looking at the event_log table and I wanted to know which table the event_not_performed_reason_id column references, I would filter this report / view by FK_column = event_not_performed_reason_id. I would then see that it references the column stcodes_all_codes_id on the table stcodes_all_codes.
- If I wanted to see all the tables event_log links to, I would filter the report with FK_table = event_log.
- If I wanted to see what tables link to event_log, I would filter the report with PK_table = event_log.
- If I wanted to see which columns link to event_log_id, I would filter the report with PK_column = event_log_id.
