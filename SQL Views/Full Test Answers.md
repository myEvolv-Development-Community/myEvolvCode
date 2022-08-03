### What You Want to Do:
This query returns all test answers for a given event. Results can be ordered within their groups. Only one column contains results, with the type of question in a separate column for a cleaner view.

### View Definition
```sql
select
people.people_id,
event_log.event_log_id,
event_log.event_definition_id,
event_log.program_enrollment_event_id,
test_header.test_header_id,
test_setup_details.test_setup_details_id,
people.first_name,
people.last_name,
people.agency_id_no,
event_definition.event_name,
event_log.actual_date,
event_log.end_date,
event_log.date_entered,
staff_people.first_name as staff_first_name,
staff_people.last_name as staff_last_name,
staff.end_date as staff_end_date,
program_info.program_name,
PE_event_log.actual_date as program_start,
PE_event_log.end_date as program_end,
program_modifier.description as modifier_name,
PM_event_log.actual_date as modifier_start,
PM_event_log.end_date as modifier_end,
group_profile.profile_name as office_responsible,
test_setup_header.test_header_name,
test_group.test_setup_details_caption as question_group,
test_group.test_setup_details_order as question_group_order,
test_setup_details.test_setup_details_caption as question_caption,
test_details_na_reason.description as na_reason,
test_setup_details.test_setup_details_order as question_order,
test_setup_details_type.description as data_type,
test_details_answers.picklist_value, 
concat(test_details_answers.lut_description, 
  test_setup_details_answers.test_setup_answers_caption,
  test_details_answers.date_value,
  test_details_answers.narrative, 
  test_details_answers.numeric_value) as question_answer,
test_details_answers.is_checked,
test_setup_details_answers.output_code, 
test_details_answers.remarks
from event_log
inner join test_header on test_header.event_log_id = event_log.event_log_id
inner join test_multiple_link on test_multiple_link.test_header_id = test_header.test_header_id
inner join test_setup_header on test_multiple_link.test_setup_header_id = test_setup_header.test_setup_header_id
inner join test_setup_details as test_group on test_group.test_setup_header_id = test_setup_header.test_setup_header_id
inner join test_setup_details on test_group.test_setup_details_id = test_setup_details.test_setup_details_belongs_to
inner join test_setup_details_type on test_setup_details.test_setup_details_type_id = test_setup_details_type.test_setup_details_type_id
inner join test_details on test_details.test_header_id = test_header.test_header_id
inner join test_details_answers on test_details.test_details_id = test_details_answers.test_details_id
left outer join test_details_na_reason on test_details.test_details_na_reason_id = test_details_na_reason.test_details_na_reason_id
inner join test_setup_details_answers on test_setup_details_answers.test_setup_details_answers_id = test_details_answers.test_setup_details_answers_id
inner join people on people.people_id = event_log.people_id
inner join program_enrollment on event_log.program_enrollment_event_id = program_enrollment.event_log_id
inner join program_info on program_info.program_info_id = program_enrollment.program_info_id
inner join event_log as PE_event_log on program_enrollment.event_log_id = PE_event_log.event_log_id
inner join staff on staff.staff_id = event_log.staff_id
inner join people as staff_people on staff_people.people_id = staff.people_id
inner join group_profile on event_log.site_providing_service = group_profile.group_profile_id
inner join event_log as PM_event_log on event_log.program_enrollment_event_id = PM_event_log.program_enrollment_event_id
inner join event_definition on event_log.event_definition_id = event_definition.event_definition_id
left outer join program_modifier_enrollment on PM_event_log.event_log_id = program_modifier_enrollment.event_log_id and PM_event_log.actual_date <= event_log.actual_date and PM_event_log.end_date >= event_log.actual_date
left outer join program_modifier on program_modifier.program_modifier_id = program_modifier_enrollment.program_modifier_id
where 
test_setup_details_type.description <> 'User Defined Sub Report' and
test_details.test_setup_details_id = test_setup_details.test_setup_details_id and
not(test_setup_details_type.description = 'Multiple Choice (Multi-Select)' and test_details_answers.is_checked = 0) and
event_log.is_deleted = 0
```

### Other Details
Assessment results is not available as a data source for custom reports, so link this to the Client Services Report on `event_definition_id`
