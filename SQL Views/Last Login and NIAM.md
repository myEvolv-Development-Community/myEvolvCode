### What You Want to Do:
Monitor login dates and durations <br/>
Determine what staff have NIAM authentication

### View Definition
```
SELECT
CASE WHEN rsv.end_date IS NULL THEN 'Active'
	ELSE 'Inactive' END AS employee_status
,CASE WHEN rsv.job_title = 'Evolv Support' THEN 'Evolv Support'
	ELSE 'Staff' END AS is_evolv  
,rsv.people_id
,rsv.staff_name
,s.id_number AS staff_id_no
,rsv.title
,sv.billing_staff_credentials
,sv.staff_license
,p.dea_license_number
,rsv.gender
,rsv.email_address AS personal_email
,rsv.email AS work_email
,rsv.primary_language
,rsv.secondary_language
,rsv.job_title
,rsv.can_supervise
,rsv.start_date
,rsv.end_date
,rsv.supervisor_name
,sv.allow_multiple_logins
,rsv.staff_profile_remarks
,rsv.login_name
,s.use_eid_authentication AS NIAM_on
,s.eid_username AS NIAM_un
,rsv.security_scheme
,sv.is_administrator
,s.is_all_programs
,s.is_all_worker_roles
,ssv.first_logged_in
,ssv.last_logged_in
,ssv.last_logged_out
,ssv.logged_in_times
,ssv.total_logged_in_time_formatted


FROM rpt_staff_view rsv

JOIN (SELECT staff_id, is_administrator, billing_staff_credentials, allow_multiple_logins, staff_license FROM staff_view)sv ON rsv.staff_id = sv.staff_id
JOIN (SELECT staff_id, is_all_programs, is_all_worker_roles, use_eid_authentication, eid_username, id_number FROM staff)s ON rsv.staff_id = s.staff_id
JOIN (SELECT people_id, dea_license_number, medicaid_number, agency_other_id_number  FROM people)p ON rsv.people_id = p.people_id
LEFT OUTER JOIN use_log_staff_summary_view ssv ON rsv.staff_id = ssv.staff_id

WHERE rsv.job_title != 'Evolv Support' 
```

### Other Details
None

### Example Output - Key Fields
| employee status | is_evolv | first_logged_in | last_logged_in |last_logged_out | logged_in_times | total_logged_in_time_formatted |
| :---------------: | -------- |----------- |----------| ----------- | -------- | ----------- |
| Active | Staff | 2019-04-01 13:19:05.970 | 2021-07-16 08:54:37.123 | 2021-07-16 08:54:37.123 | 1244 | 3825:04 |
