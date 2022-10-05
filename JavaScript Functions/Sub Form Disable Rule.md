### What is this:
A function that works to disable fields within a Sub Form.

### Code:
`SubDisableRule('name_of_field’)`<br><br>
**Examples:**<br>
Disable the field if specified boolean is not checked<br>
`!SubDisableRule('is_noshow', 'checked')`<br><br>
Disable if a Foreign Key field has a certain slection<br>
`SubDisableRule('activity_type_id', '42012A26-DD40-4CAB-891F-1E824395B2C0')`

### Details
This goes into the **Disable Rule** box of the field on a Sub Form that you want to be disabled. 
