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

The query uses question codes to generate XML element IDs (all IDs have a letter 'q' attached to the front to ensure they result in valid XML). All questions must have question codes assigned in Test Design, and for best results the response options for multiple-select items should also have output codes assigned. The query uses `FOR XML PATH` to combine the results of questions, and string concatenation to combine the results into a specific format. `char(171)` and `char(187)` are guillemet characters (« and », "French quotes") as placeholders for < and > and are replaced in the final step. Each XML element will have an identifier formatted as 'q' followed by the question code. Multiple-select items will also include an underscore followed by the answer's output code. There will be one XML element for each question that takes a single answer, e.g., narrative, date entry, numeric entry, picklist, and single-select items. The value for these items will be the displayed text of the response - for single-select items, this is the answer caption. Multiple select items will have a separate XML element for each response option, and the value will be a 1 if the item was checked or a 0 if it was not. 


### Example Output
| event_log_id | test_info|
| ---------- | ----------- |
| 00000000-0000-0000-0000-000000000000| \<root\>\<q1\>42</q1\>\<q2\>Yes\</q2\>\<q3_breakfast\>1\</q3_breakfast/>/<q3_lunch\>0\</q3_lunch/>/<q3_dinner\>1<\/q3.dinner\>\</root\>     |
  
### Expanding the test_info column into multiple columns per question

You can use a variety of tools to parse the XML inside `test_info` to create multiple columns. Here, we will show how to use the [Parse XML](https://support.microsoft.com/en-us/office/parse-text-as-json-or-xml-power-query-7436916b-210a-4299-83dd-8531a1d5e945) functionality in Microsoft Excel to split the data into columns.

1. Run the report and save the results as a CSV file. Open the file in Excel and click Data > Get & Transform Data > From Table/Range 
![Click From Table/Range](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-1-From-Table-Range.png)
3. Ensure the columns containing data are selected and click OK.  
![Select the data for the table](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-2-Create-Table.png)
4. A Power Query editor window will open. Select the test_info column and click Transform > Text Column > Parse > XML 
![Use Parse XML in Power Query Editor](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-3-Parse-XML.png)
5. The XML will be converted into a nested table structure. Optionally, you can remove errors (typically caused by all questions in the assessment being unanswered) by right-clicking the test_info column header and selecting Remove Errors 
![Optionally remove errors from the result](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-4-Remove-Errors.png)
6. Click Transform > Structured Column > Expand to convert the test_info column into multiple columns
![Click Expand](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-5-Expand.png)
7. A menu will appear with a prompt to select columns. Make sure all columns are selected, and click OK
![Confirm columns to include](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-6-Select-Columns.png)
8. Click Home > Close > Close & Load to close the editor window and to load the data into an Excel sheet
![Close & Load](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/assets/images/PowerQuery-7-Close-and-Load.png)

The resulting workbook can be saved as an Excel workbook. Doing so will save the query steps and the data source can be modified in the query editor to reuse the exact steps again on a new data set.
