### What You Want to Do:
Export results of a test/assessment event in wide format, where every question is its own column, rather than long format, where questions are included in separate rows.

### View Definition
```sql
select
event_log.event_log_id,
'<root>' + replace(
  replace(
  stuff(
      (select
      char(171) + 'q' + test_setup_details.output_code + 
        iif(rtrim(test_setup_details_type.sc_code) = 'MULTILIST', 
        '_' + coalesce(test_setup_details_answers.output_code, cast(test_setup_details_answers.test_setup_answers_value as varchar), '')
        , '')
        + char(187) + 
        isnull(
          case 
            when rtrim(test_setup_details_type.sc_code) = 'NARRATIVE' then test_details_answers.narrative
            when rtrim(test_setup_details_type.sc_code) = 'NUMERIC_SCORE' then cast(test_details_answers.numeric_value as varchar)
            when rtrim(test_setup_details_type.sc_code) = 'DATE_ENTRY' then cast(test_details_answers.date_value as varchar)
            when rtrim(test_setup_details_type.sc_code) = 'PICKLIST' then (
              select top 1 user_defined_lut.description
              from user_defined_lut
              where user_defined_lut.user_defined_lut_id = test_details_answers.picklist_value
              )
            when rtrim(test_setup_details_type.sc_code) = 'SINGLELIST' then test_setup_details_answers.test_setup_answers_caption
            when rtrim(test_setup_details_type.sc_code) = 'MULTILIST' then cast(test_details_answers.is_checked as varchar)
          end,
        '') + char(171) + '/q' + test_setup_details.output_code + 
        iif(rtrim(test_setup_details_type.sc_code) = 'MULTILIST', 
        '_' + coalesce(test_setup_details_answers.output_code, cast(test_setup_details_answers.test_setup_answers_value as varchar), '')
        , '')
        + char(187)
      from test_setup_details_type
      inner join test_setup_details on test_setup_details_type.test_setup_details_type_id = test_setup_details.test_setup_details_type_id
      inner join test_setup_details as test_group on test_setup_details.test_setup_details_belongs_to = test_group.test_setup_details_id
      inner join test_setup_header on test_setup_header.test_setup_header_id = test_group.test_setup_header_id
      inner join test_multiple_link on test_multiple_link.test_setup_header_id = test_setup_header.test_setup_header_id
      inner join test_header on test_multiple_link.test_header_id = test_header.test_header_id
      inner join form_lines on test_setup_header.test_setup_header_id = form_lines.sub_test_header_id
      inner join test_setup_details_answers on test_setup_details_answers.test_setup_details_id = test_setup_details.test_setup_details_id
      inner join test_details on test_details.test_header_id = test_header.test_header_id and test_details.test_setup_details_id = test_setup_details.test_setup_details_id
      inner join test_details_answers on test_details_answers.test_details_id = test_details.test_details_id and test_details_answers.test_setup_details_answers_id = test_setup_details_answers.test_setup_details_answers_id
      where test_header.event_log_id = event_log.event_log_id
      and rtrim(test_setup_details_type.sc_code) <> 'SUB_REPORT'
      and form_lines.form_header_id = event_definition.form_header_id
      order by form_lines.line_order, test_group.test_setup_details_order, test_setup_details.test_setup_details_order, test_setup_details_answers.test_setup_answers_order
      FOR XML PATH('')
      ),
    1, 0, ''),
  char(171), '<'),
char(187), '>') + '</root>' as test_info
from event_log
inner join test_header on test_header.event_log_id = event_log.event_log_id
```

### Other Details
This query collects all the questions and responses for an event into a single field called `test_info`, which is formatted as XML and can be parsed into multiple columns using other software. The order of questions and answers in the field should mimic the ordering in the event form, and can handle multiple subtests included in the same form. The result set can be joined to other data sources, such as `report_logi_client_services` on the `event_log_id` column.

The query uses question codes to generate XML element IDs (all IDs have a letter 'q' attached to the front to ensure they result in valid XML). It uses `FOR XML PATH` to combine the results of questions, and string concatenation to combine the results into a specific format. `char(171)` and `char(187)` are guillemet characters ("French quotes") as placeholders for < and > and are replaced in the final step.


### Example Output
| event_log_id | test_info|
| ---------- | ----------- |
| 00000000-0000-0000-0000-000000000000| \<root\>\<q1\>42</q1\>\<q2\>Yes\</q2\>\<q3_breakfast\>1\</q3_breakfast/>/<q3_lunch\>0\</q3_lunch/>/<q3_dinner\>1<\/q3.dinner\>\</root\>     |
  
