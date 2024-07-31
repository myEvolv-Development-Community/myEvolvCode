### What You Want to Do:
Summarizes which events are involved in workflows as either triggers for other tasks or as scheduled by a workflow.

### View Definition
```sql
select
workflows.workflows_id,
workflows.description as workflow_grouping,
workflows_rules.workflows_rules_id,
workflows_rules.description as workflow_caption,
event_definition.event_definition_id,
event_definition.event_name,
'I' + stuff(
  iif(
    exists(
      select * 
      from workflows_event_triggers
      where
      workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
      and workflows_event_triggers.event_definition_id = event_definition.event_definition_id
    )
  , ' and is a trigger for', '') +
  iif(
    exists(
      select * 
      from workflows_event_triggers
      inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
      where
      workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
      and workflows_events.event_definition_id = event_definition.event_definition_id
    )
  , ' and is scheduled by', ''),
1, 6, '') as event_use
from workflows
inner join workflows_rules on workflows.workflows_id = workflows_rules.workflows_id
cross join event_definition
where stuff(
  iif(
    exists(
      select * 
      from workflows_event_triggers
      where
      workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
      and workflows_event_triggers.event_definition_id = event_definition.event_definition_id
    )
  , ' and is a trigger for', '') +
  iif(
    exists(
      select * 
      from workflows_event_triggers
      inner join workflows_events on workflows_event_triggers.workflows_event_triggers_id = workflows_events.workflows_event_triggers_id
      where
      workflows_event_triggers.workflows_rules_id = workflows_rules.workflows_rules_id
      and workflows_events.event_definition_id = event_definition.event_definition_id
    )
  , ' and is scheduled by', ''),
1, 5, '') <> ''

```
