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
  AND all_clients_secure_view.staff_id = @staff_id
  )
```
The `EXISTS` function takes each row of the outer query and looks whether there is a corresponding result in the subquery. If any match exists, then the row from the outer query is retained; otherwise it is filtered out. This is similar to the `IN` operator, but is usually more efficient.

To take advantage of this query pattern, we do the following (for simplicity, this example uses one data source, `program_enrollment_expanded_view`, secured using `all_clients_secure_view`:

1. We identify or create any views necessary for the report and define views as needed under Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting > Virtual Views Setup
2. We create the custom report under Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting > Report Designer, selecting the tables and columns to *use* in the custom report (regardless of whether they are displayed to the user or only used in calculations or filtering parameters) under Manage Data Sources. Click Save Data Sources before moving on.
3. Still under the Manage Data Sources menu, we click on the Computed Columns tab and define the following two calculated columns:

  |Alias Name| Definition|
  |:---|:---|
  |user_id|@p0|
  |has_access_client|case when exists(select * from all_clients_secure_view where all_clients_secure_view.staff_id = @p0 and all_clients_secure_view.people_id = program_enrollment_expanded_view0.people_id) then 1 else 0 end|
  
  *Note:* The @p0 value refers to a parameter that the custom reporting engine has not yet defined. Attempting to Preview the report at this stage *will* result in an error. @p0 (and @p1, @p2, etc., are placeholders for the parameters defined in the custom report and are numbered according to their display order. We have just set up a calculated column to capture the value supplied to @p0 so we can use it in other calculations.
  
  *Also note:* The definition of `has_access_client` is quite long and it would look nicer to break this definition into multiple lines. However, for the next step to work, this definition **must** be in one line.
  
  Click Save Computed Columns before moving on.
  
  4. We add the following parameters to the report under Manage Parameters (combining all using 'And')

 |Column Definition| Filter Type| Operator| Default Value|Order to Display|
  |:---|:---|:---|:---|:---|
  |`@p0 AS [user_id]`|Regular String|Equal To| @staff_id|1|
  |`case when exists...`|Regular Numeric|Equal To|1|2|
  
  *Note:* It is important for the @p0 parameter to be listed first, even if it is not visible to the user. @p0 (and @p1, @p2, etc., are placeholders for the parameters defined in the custom report and are numbered according to their display order, so this parameter *must* appear before any others in the list (otherwise, @p0 will be assigned to a different parameter)
  
  5. Close the Manage Parameters window, save the report, test, and optionally publish it to an Evolv report.

The above method may improve report performance considerably. Using the method described here, an initial test ran `program_enrollment_expanded_view` secured with a join to `all_clients_secure_view` in about 11 minutes, and ran `program_enrollment_expanded_view` filtered using `WHERE EXISTS` an appropriate listing in `all_clients_secure_view` in about 6 minutes, a reduction of about 45%.

The above method can be expanded to use multiple conditions, and we have used this pattern to filter a result according to:
1. Clients the current user is allowed to access
2. Programs the current user is allowed to access
3. Events the current user is allowed to see
