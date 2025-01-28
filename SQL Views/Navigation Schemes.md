### What You Want to Do:
Get a summary of all navigation schemes in the system and the access to each breadcrumb associated with these schemes. 

### View Definition
```sql
select 
security_scheme.description, 
security_scheme_forms_access_view.*, 
sub_module_form_link_view.module_name, 
sub_module_name, set_name, 
form_set_members.tab_caption 
from 
security_scheme_forms_access_view
inner join form_set_members on security_scheme_forms_access_view.form_set_members_id =  form_set_members .form_set_members_id 
inner join  sub_module_form_link_view on form_set_members.form_sets_id =  sub_module_form_link_view.form_sets_id
inner join security_scheme on security_scheme.security_scheme_id = security_scheme_forms_access_view.security_scheme_id
```

### Other Details
Specify parameters, special forms structures to implement


### Example Output


|description	|security_scheme_id	|form_set_members_id	|modules_id	|has_access	|add_allowed	|edit_allowed|	delete_allowed|	module_name	|sub_module_name|	set_name|	tab_caption|
| ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- |
|Outpatient Support Staff Supervisors|	3eaa9dc6-74a0-4b4c-91ed-685a687a7959|	13df88d3-bd52-4111-a3c8-782471cde777	|6e7ccd2f-a8c1-44d5-982b-5ff64b1ceb0b|	1|	1|	1|	0|	Client	|Reports|	Generic Reports	|Enrollments for a Period|

