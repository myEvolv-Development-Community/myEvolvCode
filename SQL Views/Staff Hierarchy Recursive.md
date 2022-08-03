### What You Want to Do:
Define security in a query around the staff hierarchy. Give supervisors access to see records associated with their own direct reports and their respective subordinates.

### View Definition
```sql
WITH DirectReports(supervisor_id, staff_id, login_name) AS
(  
    SELECT supervisor_id, staff_id, login_name
    FROM staff   
    WHERE is_self_supervisor = 1 
    UNION ALL  
    SELECT e.supervisor_id, e.staff_id, d.login_name
    FROM staff AS e  
        INNER JOIN DirectReports AS d
        ON e.supervisor_id = d.staff_id
where e.is_self_supervisor = 0
)  
SELECT DirectReports.supervisor_id, DirectReports.staff_id, DirectReports.login_name, staff.staff_id as user_id
FROM DirectReports 
    inner join staff on DirectReports.login_name = staff.login_name;
```

### Other Details
This is a recursive common table expression (CTE). CTEs define a temporary table (`WITH ...`) then query that temporary table. This recursive query compares the temporary table against itself, starting with staff who are listed as their own supervisors (`is_self_supervisor = 1`) and finding their direct reports. Then, it takes those direct reports and finds direct reports of those people repeatedly until it reaches a staff who has no derect reports.

To use, link the staff_id in this view to the staff_id column in the data object. In the custom report parameters, set the `staff_logi_id` parameter equal to `@staff_id`.
