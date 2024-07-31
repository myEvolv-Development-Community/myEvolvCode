### What You Want to Do:
Set up a custom report that summarizes workflows in a (relatively) digestible form.

### View Definition
```sql
SELECT --initial events without recurrence
'initial events without recurrence' as class,
workflows.description as workflow_category,
workflows_rules.description as workflow_name,
trigger_event.event_name as [Trigger Event],
task_to_schedule.event_name as [Event to Schedule],
program_responsible.program_name as [Program Responsible for Task],
coalesce(
  worker_assignment_type.event_name,
  worker_role.description,
  people.first_name + ' '+ people.last_name) as [Worker Type Responsible for Task],
stuff(
  (
    select ';' +
    workflow_parameters.description +
    ' is ' +
    iif(workflows_qualifiers.is_exclude = 1, 'not ', '') +
    qualifier_info.description
    FROM workflows_qualifiers
    inner join workflow_parameters on workflows_qualifiers.workflows_parameters_id = workflow_parameters.workflow_parameters_id
    inner join (
      select event_definition_id as guid_value, event_name as description from event_definition
      union ALL
      select group_profile_type_id, description from group_profile_type
      union ALL
      select gender_id, description from gender
      union ALL
      select group_profile_id, profile_name from group_profile
      union ALL
      select payor_vendor_id, vendor_name from payor_vendor
      union ALL
      select billing_payment_plan_id, billing_payment_plan.plan_name from billing_payment_plan
      union ALL
      select ppg_id, description from ppg
      union ALL
      select program_info_id, program_name from program_info
      union ALL
      select program_modifier_id, description from program_modifier
      union ALL
      select program_type_info_id, description from program_type_info
    ) as qualifier_info on workflows_qualifiers.parameter_guid_value = qualifier_info.guid_value
    where
    workflows_qualifiers.is_active = 1
    and workflows_rules.workflows_rules_id = workflows_qualifiers.workflows_rules_id
    order by workflow_parameters.description desc, qualifier_info.description DESC
    FOR XML PATH('')
  )
, 1, 1, '') as [Client Criteria for Trigger to Apply],
cast(workflows_events_schedules.beginning_interval as varchar) + ' ' + beginning_indicator_tbl.description as [Time from Trigger to Event],
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'Yes', 'No') as [Is Event Recurring? (yes or no)],
cast(workflows_events_schedules.schedule_interval_amount as varchar) + ' ' + schedule_interval_type_tbl.description as [Recurrence Period],
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ),
  iif(exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'Floating', 'Fixed'), '') as [Is Recurrence Fixed (based on due date of prior event) or Floating (based on actual date)?],
'Schedule a(n) ' +
isnull(task_to_schedule.event_name , '')+ 
' to be completed by (a) ' + 
isnull(coalesce(worker_assignment_type.event_name, worker_role.description, people.first_name + ' '+ people.last_name), '') + 
' in ' + 
isnull(program_responsible.program_name, '') + 
', due ' +
isnull(cast(workflows_events_schedules.beginning_interval as varchar), '') + 
' ' +
isnull(beginning_indicator_tbl.description, '') +
' after the ' +
isnull(dd_columns.column_caption, '') +
' of a completed or initiated ' + 
isnull(trigger_event.event_name, '') + 
' in ' +
isnull(trigger_program.program_name, '') +
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), ', then recurring every ' + 
  isnull(cast(workflows_events_schedules.schedule_interval_amount as varchar), '__') +
  ' ' +
  isnull(schedule_interval_type_tbl.description, '__') +
  ' (on a ' +
  iif(exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'floating', 'fixed') + ' schedule)', '') +
iif(workflows_events_schedules.is_weekday = 1, ' (only on weekdays) ', '__') +
' for clients aged ' +
isnull(cast(workflows_events_schedules.age_from as varchar), '__') +
' to ' +
isnull(cast(workflows_events_schedules.age_to as varchar), '__') +
' ' +
isnull(age_indicator_tbl.description, '__') +
' old.' as workflow_summary
from workflows
inner join workflows_rules on workflows.workflows_id = workflows_rules.workflows_id
inner join workflows_event_triggers on workflows_rules.workflows_rules_id = workflows_event_triggers.workflows_rules_id
inner join event_definition as trigger_event on workflows_event_triggers.event_definition_id = trigger_event.event_definition_id
inner join dd_columns on workflows_event_triggers.dd_columns_id = dd_columns.dd_columns_id
inner join program_info as trigger_program on workflows_event_triggers.program_info_id = trigger_program.program_info_id
inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
inner join event_definition as task_to_schedule on workflows_events.event_definition_id = task_to_schedule.event_definition_id
left outer join worker_role on workflows_events.worker_role_responsible = worker_role.worker_role_id
left outer join event_definition as worker_assignment_type on workflows_events.worker_assignment_type_id = worker_assignment_type.event_definition_id
left outer join staff on workflows_events.staff_responsible = staff.staff_id
left outer join people on staff.people_id = people.people_id
left outer join workflows_events_programs on workflows_events.workflows_events_id = workflows_events_programs.workflows_events_id
left outer join program_info as program_responsible on workflows_events_programs.program_responsible = program_responsible.program_info_id
inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
left outer join workflows_scheduling_exceptions on workflows_events_schedules.workflows_events_schedules_id = workflows_scheduling_exceptions.workflows_events_schedules_id
left outer join event_definition as exclusion on workflows_scheduling_exceptions.event_definition_id = exclusion.event_definition_id
left outer join date_interval as beginning_milestone_interval_tbl on workflows_events_schedules.beginning_milestone_interval = beginning_milestone_interval_tbl.sc_code
left outer join date_interval as beginning_indicator_tbl on workflows_events_schedules.beginning_indicator = beginning_indicator_tbl.sc_code
left outer join date_interval as schedule_interval_type_tbl on workflows_events_schedules.schedule_interval_type = schedule_interval_type_tbl.sc_code
left outer join date_interval as age_indicator_tbl on workflows_events_schedules.age_indicator = age_indicator_tbl.sc_code
where 
  workflows_event_triggers.is_initial_trigger = 1 
  and not exists (
    SELECT *
from workflows_event_triggers
inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_event_triggers.is_initial_trigger = 0
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  )
and workflows.is_active = workflows_rules.is_active
and workflows_rules.is_active = workflows_event_triggers.is_active
and workflows_events.is_active = workflows_event_triggers.is_active
and workflows_events.is_active = workflows_events_schedules.is_active
and workflows_events_schedules.is_active = 1

union all

SELECT -- recurring events on fixed schedule
'recurring events on fixed schedule' as class,
workflows.description as workflow_category,
workflows_rules.description as workflow_name,
trigger_event.event_name as [Trigger Event],
task_to_schedule.event_name as [Event to Schedule],
program_responsible.program_name as [Program Responsible for Task],
coalesce(
  worker_assignment_type.event_name,
  worker_role.description,
  people.first_name + ' '+ people.last_name) as [Worker Type Responsible for Task],
stuff(
  (
    select ';' +
    workflow_parameters.description +
    ' is ' +
    iif(workflows_qualifiers.is_exclude = 1, 'not ', '') +
    qualifier_info.description
    FROM workflows_qualifiers
    inner join workflow_parameters on workflows_qualifiers.workflows_parameters_id = workflow_parameters.workflow_parameters_id
    inner join (
      select event_definition_id as guid_value, event_name as description from event_definition
      union ALL
      select group_profile_type_id, description from group_profile_type
      union ALL
      select gender_id, description from gender
      union ALL
      select group_profile_id, profile_name from group_profile
      union ALL
      select payor_vendor_id, vendor_name from payor_vendor
      union ALL
      select billing_payment_plan_id, billing_payment_plan.plan_name from billing_payment_plan
      union ALL
      select ppg_id, description from ppg
      union ALL
      select program_info_id, program_name from program_info
      union ALL
      select program_modifier_id, description from program_modifier
      union ALL
      select program_type_info_id, description from program_type_info
    ) as qualifier_info on workflows_qualifiers.parameter_guid_value = qualifier_info.guid_value
    where
    workflows_qualifiers.is_active = 1
    and workflows_rules.workflows_rules_id = workflows_qualifiers.workflows_rules_id
    order by workflow_parameters.description desc, qualifier_info.description DESC
    FOR XML PATH('')
  )
, 1, 1, '') as [Client Criteria for Trigger to Apply],
cast(workflows_events_schedules.beginning_interval as varchar) + ' ' + beginning_indicator_tbl.description as [Time from Trigger to Event],
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'Yes', 'No') as [Is Event Recurring? (yes or no)],
cast(workflows_events_schedules.schedule_interval_amount as varchar) + ' ' + schedule_interval_type_tbl.description as [Recurrence Period],
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ),
  iif(exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'Floating', 'Fixed'), '') as [Is Recurrence Fixed (based on due date of prior event) or Floating (based on actual date)?],
'Schedule a(n) ' +
isnull(task_to_schedule.event_name , '__')+ 
' to be completed by (a) ' + 
isnull(coalesce(worker_assignment_type.event_name, worker_role.description, people.first_name + ' '+ people.last_name), '') + 
' in ' + 
isnull(program_responsible.program_name, '__') + 
', due ' +
isnull(cast(workflows_events_schedules.beginning_interval as varchar), '__') + 
' ' +
isnull(beginning_indicator_tbl.description, '__') +
' after the ' +
isnull(dd_columns.column_caption, '__') +
' of a completed or initiated ' + 
isnull(trigger_event.event_name, '__') + 
' in ' +
isnull(trigger_program.program_name, '__') +
 ', then recurring every ' + 
  isnull(cast(workflows_events_schedules.schedule_interval_amount as varchar), '__') +
  ' ' +
  isnull(schedule_interval_type_tbl.description, '__') +
  ' (on a ' +
  iif(exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'floating', 'fixed') +
  ' schedule)' +
iif(workflows_events_schedules.is_weekday = 1, ' (only on weekdays) ', '__') +
' for clients aged ' +
isnull(cast(workflows_events_schedules.age_from as varchar), '__') +
' to ' +
isnull(cast(workflows_events_schedules.age_to as varchar), '__') +
' ' +
isnull(age_indicator_tbl.description, '__') +
' old.' as workflow_summary
from workflows
inner join workflows_rules on workflows.workflows_id = workflows_rules.workflows_id
inner join workflows_event_triggers on workflows_rules.workflows_rules_id = workflows_event_triggers.workflows_rules_id
inner join event_definition as trigger_event on workflows_event_triggers.event_definition_id = trigger_event.event_definition_id
inner join dd_columns on workflows_event_triggers.dd_columns_id = dd_columns.dd_columns_id
inner join program_info as trigger_program on workflows_event_triggers.program_info_id = trigger_program.program_info_id
inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
inner join event_definition as task_to_schedule on workflows_events.event_definition_id = task_to_schedule.event_definition_id
left outer join worker_role on workflows_events.worker_role_responsible = worker_role.worker_role_id
left outer join event_definition as worker_assignment_type on workflows_events.worker_assignment_type_id = worker_assignment_type.event_definition_id
left outer join staff on workflows_events.staff_responsible = staff.staff_id
left outer join people on staff.people_id = people.people_id
left outer join workflows_events_programs on workflows_events.workflows_events_id = workflows_events_programs.workflows_events_id
left outer join program_info as program_responsible on workflows_events_programs.program_responsible = program_responsible.program_info_id
inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
left outer join workflows_scheduling_exceptions on workflows_events_schedules.workflows_events_schedules_id = workflows_scheduling_exceptions.workflows_events_schedules_id
left outer join event_definition as exclusion on workflows_scheduling_exceptions.event_definition_id = exclusion.event_definition_id
left outer join date_interval as beginning_milestone_interval_tbl on workflows_events_schedules.beginning_milestone_interval = beginning_milestone_interval_tbl.sc_code
left outer join date_interval as beginning_indicator_tbl on workflows_events_schedules.beginning_indicator = beginning_indicator_tbl.sc_code
left outer join date_interval as schedule_interval_type_tbl on workflows_events_schedules.schedule_interval_type = schedule_interval_type_tbl.sc_code
left outer join date_interval as age_indicator_tbl on workflows_events_schedules.age_indicator = age_indicator_tbl.sc_code
where 
workflows_event_triggers.is_initial_trigger = 0 
and workflows.is_active = workflows_rules.is_active
and workflows_rules.is_active = workflows_event_triggers.is_active
and workflows_events.is_active = workflows_event_triggers.is_active
and workflows_events.is_active = workflows_events_schedules.is_active
and workflows_events_schedules.is_active = 1
and not exists (
    SELECT *
from  workflows_event_triggers
inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_event_triggers.is_initial_trigger = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  )
  
union all

SELECT -- recurring events on floating schedule
'recurring events on floating schedule' as class,
workflows.description as workflow_category,
workflows_rules.description as workflow_name,
trigger_event.event_name as [Trigger Event],
task_to_schedule.event_name as [Event to Schedule],
program_responsible.program_name as [Program Responsible for Task],
coalesce(
  worker_assignment_type.event_name,
  worker_role.description,
  people.first_name + ' '+ people.last_name) as [Worker Type Responsible for Task],
stuff(
  (
    select ';' +
    workflow_parameters.description +
    ' is ' +
    iif(workflows_qualifiers.is_exclude = 1, 'not ', '') +
    qualifier_info.description
    FROM workflows_qualifiers
    inner join workflow_parameters on workflows_qualifiers.workflows_parameters_id = workflow_parameters.workflow_parameters_id
    inner join (
      select event_definition_id as guid_value, event_name as description from event_definition
      union ALL
      select group_profile_type_id, description from group_profile_type
      union ALL
      select gender_id, description from gender
      union ALL
      select group_profile_id, profile_name from group_profile
      union ALL
      select payor_vendor_id, vendor_name from payor_vendor
      union ALL
      select billing_payment_plan_id, billing_payment_plan.plan_name from billing_payment_plan
      union ALL
      select ppg_id, description from ppg
      union ALL
      select program_info_id, program_name from program_info
      union ALL
      select program_modifier_id, description from program_modifier
      union ALL
      select program_type_info_id, description from program_type_info
    ) as qualifier_info on workflows_qualifiers.parameter_guid_value = qualifier_info.guid_value
    where
    workflows_qualifiers.is_active = 1
    and workflows_rules.workflows_rules_id = workflows_qualifiers.workflows_rules_id
    order by workflow_parameters.description desc, qualifier_info.description DESC
    FOR XML PATH('')
  )
, 1, 1, '') as [Client Criteria for Trigger to Apply],
cast(workflows_events_schedules.beginning_interval as varchar) + ' ' + beginning_indicator_tbl.description as [Time from Trigger to Event],
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'Yes', 'No') as [Is Event Recurring? (yes or no)],
cast(recurring_events_schedules.schedule_interval_amount as varchar) + ' ' + schedule_interval_type_tbl.description as [Recurrence Period],
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ),
  iif(exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'Floating', 'Fixed'), '') as [Is Recurrence Fixed (based on due date of prior event) or Floating (based on actual date)?],
'Schedule a(n) ' +
isnull(task_to_schedule.event_name , '__')+ 
' to be completed by (a) ' + 
isnull(coalesce(worker_assignment_type.event_name, worker_role.description, people.first_name + ' '+ people.last_name), '') + 
' in ' + 
isnull(program_responsible.program_name, '__') + 
', due ' +
isnull(cast(workflows_events_schedules.beginning_interval as varchar), '__') + 
' ' +
isnull(beginning_indicator_tbl.description, '__') +
' after the ' +
isnull(dd_columns.column_caption, '__') +
' of a completed or initiated ' + 
isnull(trigger_event.event_name, '__') + 
' in ' +
isnull(trigger_program.program_name, '__') +
iif(workflows_events_schedules.is_recurring_schedule = 1 or exists (
    SELECT *
    from workflows_event_triggers
    inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
    inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), ', then recurring every ' + 
  isnull(cast(recurring_events_schedules.schedule_interval_amount as varchar), '__') +
  ' ' +
  isnull(schedule_interval_type_tbl.description, '__') +
  ' (on a ' +
  iif(exists (
    SELECT *
from workflows_event_triggers
inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
    where workflows_event_triggers.event_definition_id = workflows_events.event_definition_id
    and workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
    and workflows_events.is_active = workflows_event_triggers.is_active
    and workflows_events.is_active = 1
    and workflows_events_schedules.is_recurring_schedule = 1
    and task_to_schedule.event_definition_id = workflows_events.event_definition_id
  ), 'floating', 'fixed') + ' schedule)', '') +
iif(workflows_events_schedules.is_weekday = 1, ' (only on weekdays) ', '') +
' for clients aged ' +
isnull(cast(recurring_events_schedules.age_from as varchar), '__') +
' to ' +
isnull(cast(recurring_events_schedules.age_to as varchar), '__') +
' ' +
isnull(age_indicator_tbl.description, '__') +
' old.' as workflow_summary
from workflows
inner join workflows_rules on workflows.workflows_id = workflows_rules.workflows_id
inner join workflows_event_triggers on workflows_rules.workflows_rules_id = workflows_event_triggers.workflows_rules_id
inner join event_definition as trigger_event on workflows_event_triggers.event_definition_id = trigger_event.event_definition_id
inner join dd_columns on workflows_event_triggers.dd_columns_id = dd_columns.dd_columns_id
inner join program_info as trigger_program on workflows_event_triggers.program_info_id = trigger_program.program_info_id
inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
inner join event_definition as task_to_schedule on workflows_events.event_definition_id = task_to_schedule.event_definition_id
inner join workflows_event_triggers as recurring_event_triggers on recurring_event_triggers.workflows_rules_id = workflows_event_triggers.workflows_rules_id
inner join workflows_events as recurring_events on recurring_event_triggers.workflows_event_triggers_id = recurring_events.workflows_event_triggers_id
inner join workflows_events_schedules as recurring_events_schedules on recurring_events.workflows_events_id = recurring_events_schedules.workflows_events_id
left outer join worker_role on workflows_events.worker_role_responsible = worker_role.worker_role_id
left outer join event_definition as worker_assignment_type on workflows_events.worker_assignment_type_id = worker_assignment_type.event_definition_id
left outer join staff on workflows_events.staff_responsible = staff.staff_id
left outer join people on staff.people_id = people.people_id
left outer join workflows_events_programs on workflows_events.workflows_events_id = workflows_events_programs.workflows_events_id
left outer join program_info as program_responsible on workflows_events_programs.program_responsible = program_responsible.program_info_id
inner join workflows_events_schedules on workflows_events.workflows_events_id = workflows_events_schedules.workflows_events_id
left outer join workflows_scheduling_exceptions on workflows_events_schedules.workflows_events_schedules_id = workflows_scheduling_exceptions.workflows_events_schedules_id
left outer join event_definition as exclusion on workflows_scheduling_exceptions.event_definition_id = exclusion.event_definition_id
left outer join date_interval as beginning_milestone_interval_tbl on workflows_events_schedules.beginning_milestone_interval = beginning_milestone_interval_tbl.sc_code
left outer join date_interval as beginning_indicator_tbl on workflows_events_schedules.beginning_indicator = beginning_indicator_tbl.sc_code
left outer join date_interval as schedule_interval_type_tbl on recurring_events_schedules.schedule_interval_type = schedule_interval_type_tbl.sc_code
left outer join date_interval as age_indicator_tbl on workflows_events_schedules.age_indicator = age_indicator_tbl.sc_code
where 
workflows_event_triggers.is_initial_trigger = 1 
and workflows_event_triggers.workflows_event_triggers_id <> recurring_event_triggers.workflows_event_triggers_id
and workflows_events.event_definition_id = recurring_event_triggers.event_definition_id
and recurring_event_triggers.event_definition_id = recurring_events.event_definition_id
and workflows_event_triggers.event_definition_id <> recurring_events.event_definition_id
and workflows.is_active = workflows_rules.is_active
and workflows_rules.is_active = workflows_event_triggers.is_active
and workflows_events.is_active = workflows_event_triggers.is_active
and workflows_events.is_active = workflows_events_schedules.is_active
and workflows_events_schedules.is_active = 1
```

### Other Details
This query returns a natural-language summary of a workflow task in terms of what task is scheduled, who is responsible, and in what timeframe it is to take place. For example:

> 	Schedule a(n) Wellness and Advance Crisis Plan to be completed by (a) Primary Worker Assignment in Behavioral Health, due 45 Day(s) after the Actual Date of a completed or initiated Pre-Treatment Admission Note in Therapeutic School (only on weekdays) for clients aged 0 to 999 Year(s) old.

For recurring tasks, the query distinguishes between fixed and floating schedules. Fixed schedules are the default for myEvolv, and schedule each successive task by adding a time increment to the due date of each completed task. A floating schedule adds the time increment to the actual date of the previous completed task, so that the schedule adjusts if tasks are completed before their due dates. 
Floating schedules are created by:
1. Setting an initial event to trigger the first task (initial, non-recurring workflow)
2. Setting a second rule so that the recurring task triggers another of the same recurring task (a recurring workflow)

   For example, with treatment plans, we would have an initial workflow that triggers one Treatment Plan Review 30 days after an original Treatment Plan. A second, recurring workflow, triggers each successive Treatment Plan Review 30 days after the previous Treatment Plan Review (the same event is the trigger and the task).

This report can be added to the Reports module and made available to staff, who can then use a CSV download of the report to review their programs' current workflow setups and as a worksheet to request new workflows or modifications to existing workflows.
