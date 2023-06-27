### What You Want to Do:

Identify clients to discharge from the agency who no longer have any active program enrollments. Also identifies the last primary worker assigned to the client for accountability tracking.

### View Definition
```sql
select
people.people_id as [_01_people id],
people.agency_id_no as [_02_agency_id_no],
people.last_name as [_03_last_name],
people.first_name as [_04_first_name],
people.agency_discharge_dt as [_05_agency_discharge_dt],
readmission_date as [_06_readmission_date],
WA.last_name as [_07_worker_last_name],
WA.first_name as [_08_worker_first_name],
WA.actual_date as [_09_worker_start],
WA.end_date as [_10_worker_end],
program_name as [_11_program_name],
peel.actual_date as [_12_program_start],
peel.end_date as [_13_program_end],
modifier_name as [_14_modifier_name],
modifier_start as [_15_modifier_start],
modifier_end as [_16_modifier_end],
PEEL.event_log_id as [_17_program_enrollment_event_id]
from service_track
inner join people on people.agency_service_track_id = service_track.service_track_id
cross apply(
  select top 1
  event_log.actual_date,
  event_log.end_date,
  program_info.program_name,
  event_log.event_log_id
  from event_log
  inner join program_enrollment on event_log.event_log_id = program_enrollment.event_log_id
  inner join program_info on program_enrollment.program_info_id = program_info.program_info_id
  where people.people_id = event_log.people_id
  order by event_log.end_date desc
) as PEEL
cross apply(
  select
  count(event_log.actual_date) as num_starts,
  count(event_log.end_date) as num_ends
  from program_enrollment
  inner join event_log on event_log.event_log_id = program_enrollment.event_log_id
  where event_log.people_id = people.people_id
) as prog_count
outer apply (
  select top 1
  people.last_name,
  people.first_name,
  event_log.actual_date,
  event_log.end_date
  from people
  inner join staff on people.people_id = staff.people_id
  inner join worker_assignment on staff.staff_id = worker_assignment.staff_id
  inner join event_log on event_log.event_log_id = worker_assignment.event_log_id
  where event_log.program_enrollment_event_id = PEEL.event_log_id and worker_assignment.is_primary_worker = 1
  order by event_log.actual_date DESC
) as WA
outer apply (
  select top 1
  program_modifier.description as modifier_name,event_log.actual_date as modifier_start,
  event_log.end_date as modifier_end
  from program_modifier
  inner join program_modifier_enrollment on program_modifier.program_modifier_id = program_modifier_enrollment.program_modifier_id
  inner join event_log on event_log.event_log_id = program_modifier_enrollment.event_log_id
  where event_log.program_enrollment_event_id = PEEL.event_log_id
  order by event_log.actual_date DESC
) as PM
where people.agency_discharge_dt is null
and num_starts = num_ends
```
