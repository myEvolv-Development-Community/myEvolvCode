### What You Want to Do:
Tracks how long between a service taking place and the documentation being entered and finalized. Uses cutoffs for timely entry specified by service and by program.

### View Definition
```sql
select -- Individual Services
SP.last_name+', '+SP.first_name worker_name,
program_name,
mn modifier_name,
profile_name managing_office,
'' group_name,
C.last_name+', '+C.first_name client_name,
C.agency_id_no,
event_name,
RNS.description no_show_reason,
iif(is_locked=0,'Open',iif(EL.is_e_signed=1,'Signed',iif(approved_date is null,'Submitted','Approved'))) document_status,
iif(due_date<EL.actual_date,'Overdue','On Time') due_status,
scheduled_date,
due_date,
EL.actual_date,
EL.end_date,
EL.date_entered,
date_locked,
isnull(fl,date_locked) first_locked,
SB.last_name+', '+SB.first_name recipient_name,
approved_date,
A.last_name+', '+A.first_name approver_name,
UDL.description cutoff,
iif(isnull(fl,date_locked) is null and (has_lock=1 or APSL.is_e_signed=1),'Open',iif(iif(has_lock=1 or APSL.is_e_signed=1,isnull(fl,date_locked),EL.date_entered)<=iif(UDL.sc_code='24h',DATEADD(d,iif(datepart(dw,el.actual_date)=6,3,1),el.actual_date),iif(UDL.sc_code='48h',DATEADD(d,iif(datepart(dw,el.actual_date)=6,3,2),el.actual_date),iif(UDL.sc_code='07d',DATEADD(d,7,el.actual_date),iif(UDL.sc_code='14d',DATEADD(d,14,el.actual_date),due_date)))),'On Time', iif(UDL.sc_code='DUE' and due_date is null, null, 'Entered Late'))) timely_ruling,
EL.program_enrollment_event_id,
PI.program_info_id,
S.group_profile_id,
C.people_id,
SR.staff_id,
EL.event_definition_id,
EL.event_log_id,
EL.actual_date filter_date,
has_lock,
apsl.is_e_signed has_sig
from user_defined_lut UDL
join agency_program_service_link_x APSLX on timeliness_cutoff=UDL.user_defined_lut_id
join agency_program_service_link APSL on APSL.agency_program_service_link_id=APSLX.agency_program_service_link_id
join agency_program_link APL on APSL.agency_program_link=APL.agency_program_link_id
join program_info PI on PI.program_info_id=APL.program_info_id
join event_log EL on EL.program_providing_service=PI.program_info_id
join event_definition ED on EL.event_definition_id=ED.event_definition_id
join event_category EC on ED.event_category_id=EC.event_category_id
join group_profile S on S.group_profile_id=EL.site_providing_service and S.group_profile_type_id=APSL.group_profile_type_id
left join staff S2 on EL.approval_sent_to=S2.staff_id
left join people SB on S2.people_id=SB.people_id
left join staff AB on EL.approved_by=AB.staff_id
left join people A on AB.people_id=A.people_id
join people C on EL.people_id=C.people_id
join staff SR on SR.staff_id=EL.staff_id
join people SP on SP.people_id=SR.people_id
left join (select min(date_locked) fl,event_log_id elid from event_log_a
group by event_log_id
) ela on EL.event_log_id=ela.elid
 left join reason_for_no_show RNS on EL.reason_for_no_show_id=RNS.reason_for_no_show_id
 left join events2do E2D on EL.from_events2do_id=E2D.events2do_id
left join (select PM.description mn,EL.actual_date ms,EL.end_date me,EL.program_enrollment_event_id pe from program_modifier PM,program_modifier_enrollment PME,event_log EL
where PM.program_modifier_id=PME.program_modifier_id and
EL.event_log_id=PME.event_log_id) M on pe=EL.program_enrollment_event_id and
ms<=EL.actual_date and
EL.actual_date<=me
where EL.is_deleted=0 and 
category_name<>'Group Activities' and 
ED.event_definition_id=APSL.event_definition_id
union
select -- Group Services
SP.last_name+', '+SP.first_name,
program_name,
'',
S.profile_name,
SG.profile_name,
'',
'',
event_name,
'',
iif(is_locked=0,'Open',iif(EL.is_e_signed=1,'Signed',iif(approved_date is null,'Submitted','Approved'))),
'',
'',
'',
EL.actual_date,
EL.end_date,
EL.date_entered,
date_locked,
isnull(fl,date_locked),
SB.last_name+', '+SB.first_name,
approved_date,
A.last_name+', '+A.first_name,
UDL.description,
iif(isnull(fl,date_locked) is null and (has_lock=1 or APSL.is_e_signed=1),'Open',iif(iif(has_lock=1 or APSL.is_e_signed=1,isnull(fl,date_locked),EL.date_entered)<=iif(UDL.sc_code='24h',DATEADD(d,iif(datepart(dw,el.actual_date)=6,3,1),el.actual_date),iif(UDL.sc_code='48h',DATEADD(d,iif(datepart(dw,el.actual_date)=6,3,2),el.actual_date),iif(UDL.sc_code='07d',DATEADD(d,7,el.actual_date),iif(UDL.sc_code='14d',DATEADD(d,14,el.actual_date),null)))),'On Time','Entered Late')),
EL.program_enrollment_event_id,
PI.program_info_id,
S.group_profile_id,
null,
SR.staff_id,
ED.event_definition_id,
EL.event_log_id,
EL.actual_date,
has_lock,
apsl.is_e_signed 
from user_defined_lut UDL
join agency_program_service_link_x APSLX on timeliness_cutoff=UDL.user_defined_lut_id
join agency_program_service_link APSL on APSL.agency_program_service_link_id=APSLX.agency_program_service_link_id
join agency_program_link APL on APSL.agency_program_link=APL.agency_program_link_id
join program_info PI on PI.program_info_id=APL.program_info_id
join event_log EL on EL.program_providing_service=PI.program_info_id
join event_definition ED on EL.event_definition_id=ED.event_definition_id
join event_category EC on ED.event_category_id=EC.event_category_id
join group_profile S on S.group_profile_id=EL.site_providing_service
left join staff S2 on EL.approval_sent_to=S2.staff_id
left join people SB on S2.people_id=SB.people_id
left join staff AB on EL.approved_by=AB.staff_id
left join people A on AB.people_id=A.people_id
join staff SR on SR.staff_id=EL.staff_id
join people SP on SP.people_id=SR.people_id
left join (select min(date_locked) fl,event_log_id elid from event_log_a group by event_log_id) ela on EL.event_log_id=ela.elid
left join group_profile SG on SG.group_profile_id=EL.group_profile_id
where S.group_profile_type_id=APSL.group_profile_type_id and
EL.is_deleted=0 and
EL.people_id is null and
ED.event_definition_id=APSL.event_definition_id
union 
select -- Overdue, uncompleted services
SP.last_name+', '+SP.first_name worker_name,
program_name,
mn,
S.profile_name,
'',
C.last_name+', '+C.first_name,
C.agency_id_no,
event_name,
'',
'Not Entered',
'Overdue',
scheduled_date,
due_date,
null,
null,
null,
null,
null,
'',
'',
'',
'By Due Date',
'Entered Late',
E2D.program_enrollment_event_id,
PI.program_info_id,
S.group_profile_id,
C.people_id,
SR.staff_id,
ED.event_definition_id,
null,
due_date filter_date,
has_lock,
apsl.is_e_signed
from user_defined_lut UDL
join agency_program_service_link_x APSLX on timeliness_cutoff=UDL.user_defined_lut_id
join agency_program_service_link APSL on APSL.agency_program_service_link_id=APSLX.agency_program_service_link_id
join agency_program_link APL on APSL.agency_program_link=APL.agency_program_link_id
join program_info PI on PI.program_info_id=APL.program_info_id
join event_definition ED on ED.event_definition_id=APSL.event_definition_id
join events2do E2D on E2D.event_definition_id=ED.event_definition_id
join event_category EC on ED.event_category_id=EC.event_category_id
join group_profile S on S.group_profile_id=site_responsible
join people C on E2D.people_id=C.people_id
join staff SR on SR.staff_id=staff_responsible 
join people SP on SP.people_id=SR.people_id
left join (select PM.description mn,EL.actual_date ms,EL.end_date me,EL.program_enrollment_event_id pe from program_modifier PM,program_modifier_enrollment PME,event_log EL
where PM.program_modifier_id=PME.program_modifier_id and
EL.event_log_id=PME.event_log_id) M on pe=E2D.program_enrollment_event_id and
ms<=due_date and
due_date<=me
where due_date<getDate() and
E2D.event_log_id is null and
S.group_profile_type_id=APSL.group_profile_type_id and
E2D.program_responsible=APL.program_info_id and
PI.program_info_id=program_responsible and 
UDL.sc_code='DUE' and
E2D.is_write_off=0
```

### Other Details
This report requires the following:
  1. A user-defined table of timely entry cutoffs
  2. A custom form under the Agency Program Services by Program Form Family
    * This form should include a user-defined field called `timeliness_cutoffs` that references the user-defined table above
    * This form should capture all types of services required for timely entry tracking, including individual services, group services, and treatment plans.
  3. A custom form under the Agency-Program Setup Form Family, based on the Agency Program Services form.
    * This form should contain the custom form from (2) as a subform

Cutoffs for timely entry are as follows:

|Description|Code|
|---|---|
|24 hours|24h|
|48 hours|48h|
|7 days|07d|
|14 days|14d|

The list condition for the form under Agency Program Services by Program is:
```
agency_program_service_link.is_system_service_link=0 and 
agency_program_service_link.is_case=0 And 
agency_program_service_link.is_drop_in=0 and 
agency_program_service_link.is_staff=0 and 
agency_program_service_link.is_outreach=0 and 
agency_program_service_link.is_incident=0
```

and the user-defined `timeliness_cutoff` field is added to the form, marked visible on subform. For safety, we made this the only editable field on the form. Everything else can and should be edited in the default service setups forms.

The form under the Agency-Program Setup family should include the previous form as a subform.

![An example form under Agency-Program Setup](/SQL%20Functions/assets/images/Agency-Program%20Setup%20-%20Timeliness.png "An example form under Agency-Program Setup, the subform is labeled 'Services'")

Add this custom form to a new formset member under the Agency Setup module, and the Agency Formset.
  * Make the custom form from the Agency-Program Setup Form Family the default form for the formset member.
  * Add the new formset member to the required navigation scheme.

![The new formset member setup](/SQL%20Functions/assets/images/Formset%20Maintenance%20-%20Timeliness.png "Setup for the new Formset Member")

The final result for setup should look like the following:
![Timely Entry setup form in use](/SQL%20Functions/assets/images/Timely%20Entry%20Criteria.png "Timely Entry setup form in use")

There are a variety of ways to set security for this report, including:
 * By client the staff can acces
 * By program enrollment the staff can access
 * By staff reporting up to the staff running the report
