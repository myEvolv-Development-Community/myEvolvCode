### What You Want To Do:

Create a custom report with client diagnosis codes (ICD-10-based) and a search bar to select clients with specific *combinations* of diagnoses, e.g., clients with both a substance use disorder and a mental health disorder, or clients with either of two diagnoses on file.

### How to Do It:
**This procedure requires the following components and techniques.**
1. Created virtual views for condensed diagnosis lists (either [at the time of an event](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/Condensed%20Diagnosis%20List%20at%20Time%20of%20Event.md) or at present)
2. Use of [parameter capturing in a custom report](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/How-To%20Guides/Custom%20Report%20Parameter%20Capturing%3A%20Using%20parameters%20to%20speed%20up%20secure%20Custom%20Reports.md)
3. Use of `dbo.fnSplit` (a Netsmart-provided SQL function)

### `dbo.fnSplit`
Netsmart has provided a custom SQL function called `dbo.fnSplit`, which takes a string, splits the string wherever a certain character appears, and returns a table containing one column (called `item`) and rows corrsponding to the segments of the original string.

For example, `select * from dbo.fnSplit('this', 'that', 'the other', ',')` returns:
|item|
|:---|
|this|
|that|
|the other|

### The search function
We can use this functionality to make a searchable diagnosis input like follows:

```
select *
from dbo.fnSplit(replace(replace(@p1, '&', '%'), ' ', ''), '|'),
vv_condensed_diagnoses_at_time_of_event
where
vv_condensed_diagnoses_at_time_of_event.current_diagnoses like '%' + item + '%')
```
where `@p1` is a parameter (placeholder) for a diagnosis string. This query splits the search string into segments divided by a vertical bar (|), replaces `&` with `%` so that the `LIKE` operator can perform a string comparison.

Ultimately, the above query provides a limited logical grammar to describe combinations of diagnosis codes:
- Diagnoses can be identified by parts, so 'F' will match codes from F00 to F99 (mental and behavioral health diagnoses) and 'F1' will match diagnoses F10 through F19 (substance use disorder diagnoses)
- Alternative diagnoses can be matched using "|" between diagnoses, so "F17|Z72" can identify people with nicotine dependence or nicotine use
- Pairs of diagnoses can be matched using "&", so "F&Z" would identify people with both an active behavioral health diagnosis and a Z-chapter code.

### Creating a search box
Once we have a basic understanding of the search functionality, we can implement it in a custom report. For this example, we will use the Client Services Report as the primary data source.

First, under Computed Columns in the Manage Data Sources menu, create a placeholder for the diagnosis search term, naming the calculated column something like `Diagnosis_Search_Term` and giving it a value of `p0`

Next, create a second computed column to perform the search based on the input, called something like `is_Diagnosis_Included` and having a value like:
```
case when exists (select * from dbo.fnSplit(replace(replace(@p0, '&', '%'), ' ', ''), '|') where vv_condensed_diagnoses_at_time_of_event.current_diagnoses like '%' + item + '%' and report_logi_client_services0.event_log_id = vv_condensed_diagnoses_at_time_of_event.event_log_id) then 1 else 0 end
```

Save the computed columns and open the Manage Parameters menu.

Move the `Diagnosis_Search_Term` to the top of the parameter list (to guarantee it is assigned the `@p0` slot), set the operator to "Equal To" and check "Is Used", "Visible", "Modifiable", and "Use And"

Set the `is_Diagnosis_Included` parameter to use the "Equal To" operator, give it a default value of 1, and check "Is Used" and "Use And" (it can remain not visible and not modifiable).

Save the custom report and the diagnosis search field should appear before running t
