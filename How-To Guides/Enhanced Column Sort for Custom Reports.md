### What You Want To Do:

This resource is intended to improve the column sorting process in myEvolv NX Custom Reporting. By default, columns added to a custom report are sorted in alphabetical order, not in the order they appear natively in the database schema. If a report draws from multiple tables, then those tables are ordered first accoridng to how they are added into the custom report through joins in the Data Sources menu, then columns within each table are sorted alphabetically. The following process will allow useers to:
- manually re-specify the order of tables in the custom report
- order columns according to their appearance in the original tables or views
- automatically mark all columns (except unique identifiers) as visible in the report.

The user would then be able to fine-tune the ordering and visibility of columns to finish the report.

### How to Do It:
1. Upload the (Report Sorting Helper form)[https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/Form%20Design/Exports/Report%20Sorting%20Helper.json] into your myEvolv system.
2. Create a new virtual view under Reports > NX Custom Reporting > NX Custom Reporting > Custom Reporting, called "Condensed Table Columns" (the SQL name will be "vv_Condensed_Table_Columns"). Use the following SQL definition:
```sql
select 
INFORMATION_SCHEMA.TABLES.table_name,
(
    select max(information_schema.columns.ordinal_position) 
    from INFORMATION_SCHEMA.columns 
    where INFORMATION_SCHEMA.columns.table_name = INFORMATION_SCHEMA.TABLES.table_name
) as col_count
, stuff(
    (select ',' + INFORMATION_SCHEMA.COLUMNS.column_name + ':' + cast(INFORMATION_SCHEMA.COLUMNS.ordinal_position as varchar)
    from INFORMATION_SCHEMA.COLUMNS
    where INFORMATION_SCHEMA.columns.table_name = INFORMATION_SCHEMA.TABLES.table_name
    order by INFORMATION_SCHEMA.COLUMNS.ordinal_position asc
    for xml path(''))
, 1, 1, '') 
as columns
from INFORMATION_SCHEMA.TABLES
```
3. Create a new Custom Report or open a custom report you want to adjust the column sorting on. Make sure the report includes a Table.
4. In the Table section under Report Columns, right-click and select Inspect from the menu.
5. In the Developer pane that opens, select the Console tab and run the following script:
```js
function getTableInfo(table_name, output_column) { 
// wrapper to getDataValue to pull column information from a custom virtual view we created
  return getDataValue(
    "vv_condensed_table_columns",
    "table_name",
    table_name, 
    output_column)
}

function getSourceComponent(txt, index) { 
// extracts table and column information from columns that come directly from the data source.
// These columns are formatted like [table].column AS column0, so the match looks for letters, numbers, and _ between [brackets]
// Returns an array, index 0 is the table, index 1 is the column in the data source
  return txt.match(/(?<=\[)[0-z]*(?=\])/gi)[index]
}

function isDBField(source_definition) {
// Identifies columns that come directly from the data source, returning false if a calculated field
// These columns are formatted like [table].column AS column0, so the match looks for letters, numbers, and _ between [brackets]
// Returns an array, index 0 is the table, index 1 is the column in the data source
  return /^\[[0-z_]*\]\.\[[0-z_]*\] as \[[0-z_]*$/gi.test(source_definition)
}

function getCorrespondingEntry(fromObject, reference) {
// looks up a corresponding value from object that has the same name as in the reference object
  return fromObject[
      Object.keys(fromObject).
      find(key => reference.match(key))
    ]
}

function getColumnTitle(row) {
  return $(".report-designer-drag-cell :first-child", row).attr("title")
}

window.name = ("myEvolv Main")

// get all data sources into a grouped object
var data_sources = Object.groupBy( // takes an array of objects with similar properties and converts into an object with keys representing groupings and each value is an array of the original objects
  $("#report-designer-data-sources-id tbody tr"). // look for rows in the body of the data sources table
    map(function(){ // over each row of the table
      return { // get an object representing the table name, column count, and a collecton of key-value pairs representing each column and its order in the original table
        table:this.outerText,
        col_count:getTableInfo(this.textContent, "col_count"),
        cols:Object.fromEntries(
          getTableInfo(this.textContent, "columns").
            split(",").
            map(x => x.split(":"))
          )
        }
      }
    ).toArray(), // convert result from JQuery object to an array
  ({table}) => table // use table name as the grouping value and name for groups
)

var report_columns = $("#report-designer-columns-0-id tbody tr") // get rows from the report columns table

// get distinct data source aliases from table fields
// iterates through the data sources table, keeping only fields that come directly from the source table
// groups result by common source tables, then uses the grouped object keys as unique table names
// if two columns from the same table appear in the list (e.g., people1.first_name and people1.last_name), the table alias will only appear once
// if a table is used twice with separate auto-generated aliases (e.g., people1 and people2), the two instances are preserved
var aliases = 
  Object.keys(
    Object.groupBy(
      report_columns.
        map(function(i, row) {
          return getColumnTitle(row)
        }).
        filter(function(i) {
          return (isDBField(this)) 
        }).
        map(function () {
          let table = getSourceComponent(this, 0)
          let column = getSourceComponent(this, 1)
          return {table:table, column:column}
        }).
        toArray(), 
    ({ table }) => table)
  )
var running_total = 0
OpenFormGeneric(Form.formObject.serverHandling, "Sorting", null, "EDIT")
```
6. A window will appear with the names of the tables used in the current report. Drag and drop the table names to re-order them as desired, then click "Finish Sorting" and confirm you want to navigate away.
7. The window will close and the report columns will have new order numbers assigned to them. Make any final adjustments to the column ordering or visibility, then save the report.
