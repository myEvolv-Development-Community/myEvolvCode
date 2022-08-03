### What You Want to Do:
Find a client's actual location at a given point in time. Factors in home address, care day program enrollments, and placement disruptions.

### View Definition
```sql
--Placement Disruption
select
event_log.people_id,
event_definition.event_name,
group_profile.profile_name as place_name,
event_log.actual_date,
event_log.end_date,
address.street_address_1,
address.street_address_2,
address.city,
state.description as state,
address.zip_Code,
1 as priority
from
people_history
inner join event_log on people_history.event_log_id = event_log.event_log_id
inner join people on event_log.people_id = people.people_id
inner join group_profile on people_history.group_profile_id = group_profile.group_profile_id
inner join address on address.group_profile_id = group_profile.group_profile_id
inner join event_definition on event_log.event_definition_id = event_definition.event_definition_id
left outer join state on address.state = state.state_id
union
--Care Day Program Enrollment
select
event_log.people_id,
event_definition.event_name,
program_info.program_name as place_name,
event_log.actual_date,
event_log.end_date,
address.street_address_1,
address.street_address_2,
address.city,
state.description as state,
address.zip_Code,
2 as priority
from event_definition
inner join event_log on event_definition.event_definition_id = event_log.event_definition_id
inner join program_info on event_log.program_providing_service = program_info.program_info_id
inner join group_profile on event_log.site_providing_Service = group_profile.group_profile_id
inner join address on address.group_profile_id = group_profile.group_profile_id
left outer join state on address.state = state.state_id
where
event_definition.event_name = 'Facility Placement' and
program_info.is_careday = 1
union
--Home Address
select
people.people_id,
'' as event_name,
'Home address' as place_name,
address.address_date as actual_date,
null as end_date,
address.street_address_1,
address.street_address_2,
address.city,
state.description as state, 
address.zip_Code,
3 as priority
from people
inner join address on people.people_id = address.people_id
left outer join state on address.state = state.state_id
```

### Other Details
Factors in home address, care day program enrollment, and placement disruptions. Each type of location has a priority, with placement disruptions having highest priority (3).
Join to report objects by the client's `people_id` and where event dates overlap with placement dates.
