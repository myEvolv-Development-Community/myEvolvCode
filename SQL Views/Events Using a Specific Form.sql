select 
event_category.category_name ,
event_category.event_category_id,
event_definition.event_definition_id,
event_definition.event_name,
form_header.form_header_id,
form_header.form_name
from
form_header, event_definition
inner join event_category on event_definition.event_category_id = event_category.event_category_id
where form_header.form_header_id
 = event_definition.form_header_id_new
 or form_header.form_header_id
 = event_definition.form_header_id
