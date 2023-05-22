## What You Want To Do:
Improve the performance (speed) of custom reports that are 'secured' (e.g., by referencing `all_clients_secure_view`) by using calculated columns and parameters instead of a join.

## How to Do It:

### Background

Custom reports in myEvolv can be configured to limit report results according to the current user's system access. Specifically, a built-in view called `all_clients_secure_view` registers which staff are allowed access to which clients in the Client module and a column called `staff_logi_id` appears in most `report_logi_` datasets to ensure the content of the report matches what the user requests in the Client module. Properly limiting report results to only the data that the current user has permission to view is referred to as '*securing*' the report.

To use `all_clients_secure_view` to secure a report, we normally follow these steps:

1. We identify or create any views necessary for the report and define views as needed under Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting > Virtual Views Setup
2. We then register joins between any required views and tables under Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting > Join Relation Setup
3. We register a join between one of the tables to be used and `all_clients_secure_view`, linking the two data sources on `people_id`
4. We create the custom report under Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting > Report Designer, selecting the tables and columns to *use* in the custom report (regardless of whether they are displayed to the user or only used in calculations or filtering parameters) under Manage Data Sources.
5. We add a parameter to the report such that `[all_clients_secure_view].people_id` is equal to `@staff_id`. The `@staff_id` variable pulls in the staff_id of the current user for the session and this parameter therefore limits the report results to clients this staff can see.
6. Save, test, and optionally attach the report to a myEvolv report.

### The Parameter Trick: An Alternative

The above method more or less corresponds to writing a SQL Query like: 
```sql
SELECT *
FROM some_table
INNER JOIN all_clients_secure_view ON some_table.people_id = all_clients_secure_view.people_id
WHERE all_clients_secure_view.staff_id = @staff_id
```

However, joins are sometimes not the fastest way to filter a dataset, and there are times when moving the entire filter condition to the WHERE clause is more efficient. This query would look like this:

```sql
SELECT *
FROM some_table
WHERE EXISTS (
  SELECT *
  FROM all_clients_secure_view
  WHERE some_table.people_id = all_clients_secure_view.people_id
  )
AND all_clients_secure_view.staff_id = @staff_id
```

