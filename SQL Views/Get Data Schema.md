## What you want to do

Get a list of tables, views, and their corresponding columns. Include column data types. and whether a table is a view or not.

## View Definition

```
SELECT
    IC.TABLE_NAME,
    IC.COLUMN_NAME,
    IC.DATA_TYPE,
    IC.CHARACTER_MAXIMUM_LENGTH,
    IT.TABLE_TYPE,
    CASE
        WHEN IC.TABLE_NAME like '%_view'
        THEN 'View'
        ELSE 'Non View'
    END as TYPE

FROM INFORMATION_SCHEMA.COLUMNS AS IC
LEFT JOIN INFORMATION_SCHEMA.TABLES AS IT
    ON IT.TABLE_NAME = IC.TABLE_NAME
```

## Other Details

When creating a custom report, feel free to remove columns that are not needed, such as character_maximum_length.
