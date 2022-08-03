### What You Want to Do:
Apply security to a query that mimics the security in the Client Service Entry Screen

### View Definition
```sql
select 
  staff.staff_id, 
  program_enrollment.event_log_id, 
  worker_assignment.worker_role_id,
  security_events.event_definition_id
from staff 
inner join worker_assignment on staff.staff_id = worker_assignment.staff_id
inner join event_log on worker_assignment.event_log_id = event_log.event_log_id
inner join program_enrollment on event_log.program_enrollment_event_id = program_enrollment.event_log_id
inner join security_events on worker_assignment.worker_role_id = security_events.worker_role_id 
where 
  event_log.end_date is null
  and security_events.has_access = 1
union all
select 
  staff.staff_id, 
  program_enrollment.event_log_id, 
  workgroup_enrollment.worker_role_id,
  security_events.event_definition_id
  from staff 
  inner join workgroup_enrollment on staff.staff_id = workgroup_enrollment.staff_id
  inner join workgroups on workgroup_enrollment.workgroups_id = workgroups.workgroups_id
  inner join program_enrollment on workgroups.program_info_id = program_enrollment.program_info_id
  inner join security_events on workgroup_enrollment.worker_role_id = security_events.worker_role_id
where 
  workgroup_enrollment.end_date is null
  and security_events.has_access = 1
union all
select 
  staff.staff_id, 
  program_enrollment.event_log_id, 
  workgroup_enrollment.worker_role_id,
  security_events.event_definition_id
from staff 
inner join workgroup_enrollment on staff.staff_id = workgroup_enrollment.staff_id
inner join workgroups on workgroup_enrollment.workgroups_id = workgroups.workgroups_id
inner join security_events on workgroup_enrollment.worker_role_id = security_events.worker_role_id
inner join program_enrollment on workgroups.is_admin = 1
where
  workgroup_enrollment.end_date is null
  and security_events.has_access = 1
```

### Other Details
Access to clients is defined by one of two methods:
  1. The staff is currently directly assigned to the client
  2. The staff is currently enrolled in a workgroup which is assigned to the client

In Service Entry, direct assignments give access to services visible to the appropriate worker role tied to that program enrollment event. Workgroup assignments give access to all enrollments within the specified program (including previous and later enrollments).

Administrative workgroups, e.g., the administrators and reports workgroups, are applied to all clients on enrollment. This query shortcuts their access by automatically including all enrollments for staff currently in that workgroup.

In custom reporting, link this view to the desired data object on *both* the `program_enrollment_event_id` and the `event_definition_id` for the service. In the custom report parameters, set the `staff_logi_id` parameter equal to `@staff_id`.
