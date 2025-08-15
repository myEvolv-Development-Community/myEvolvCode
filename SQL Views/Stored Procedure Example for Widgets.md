This is an example of a stored procedure that I wrote for a cusotm widget- EL

```
(
	@staff_id Uniqueidentifier,
	@filterBy [dbo].[condition_tabletype] READONLY,
	@orderBy [dbo].[order_expr_tabletype] READONLY,
	@pageSize INT = 0,
	@pageNumber INT = 0,
	@is_debug bit = 0
)
/***************************************
*	Author: Elise Labatore
*	Date: 09/25/2024
*	ADO-12880 Incident Report Action Engine
****************************************/
As
Set NoCount On
Declare @debugging Bit
	,@tran_id Uniqueidentifier
	,@count_rec BigInt
	,@today DateTime
	,@agency_id Uniqueidentifier
	,@sensitive Bit
	,@all Bit
	,@participant uniqueidentifier 



Set @today = GetDate()

Declare @object_name varchar(100)
       ,@min_time decimal(12,2)
       ,@start_time Datetime = dbo.GetDate2(getdate())
       ,@db_object_status_tracking_id Uniqueidentifier
       ,@parameters xml

set @parameters = (
      select
            @staff_id as staff_id,
			@pageSize as page_size,
			@pageNumber as page_number
      for xml raw
)

SELECT @object_name = OBJECT_NAME(@@PROCID)

exec [dbo].[DBStartCallTracking]
          @object_name,
          @start_time,
          @min_time OUTPUT,
          @db_object_status_tracking_id OUTPUT,
          @debugging OUTPUT,
          @tran_id OUTPUT,
          @parameters 
          
-- preserve the code in a separate table so if upgrades wipes it, can be restored
exec dbo.SaveObjectText @object_name          

-- status report
If @debugging = 1
	Insert Into db_tran_status (tran_id, status) Values (@tran_id, 'GetIncidientReports go.')

-- get agency ID
Select 
	@agency_id = agency_id
From 
	staff 
Where 
	staff_id = @staff_id

-- staff security around incidents
SELECT
@all = sv.is_all_incidents
, @sensitive = sv.is_sensitive_incidents
, @participant =sv.people_id
FROM
dbo.staff sv
where sv.staff_id = @staff_id

--most recent routing history for the incident
DROP TABLE IF EXISTS #routing
select 
cast(rwi.entity_id as uniqueidentifier) event_log_id, 
rwih.date_entered,
rwih.transition_name,
CASE WHEN u_props.parent_id is not null then s_p.last_name + ', ' + s_p.first_name 
              ELSE wg.group_name END as assigned_to,
ROW_NUMBER()OVER(
			PARTITION BY rwi.entity_id
			ORDER BY rwih.date_entered DESC
			) row_num 
INTO #routing
FROM routing_workflow_instance rwi
JOIN routing_workflow_instance_history rwih
		on rwih.workflow_instance_id = rwi.workflow_instance_id
LEFT JOIN routing_property u_props On  rwi.workflow_instance_id = u_props.parent_id 
              And u_props.prop_key = 'assignee'
              And u_props.table_name = 'workflow_instance'
LEFT JOIN staff s on convert(varchar(38), s.staff_id) = u_props.text_value
LEFT JOIN people s_p on s_p.people_id = s.people_id
LEFT JOIN routing_property g_props  On g_props.parent_id = rwi.workflow_instance_id
              And g_props.prop_key = 'assign-group'
              And g_props.table_name = 'workflow_instance'
LEFT JOIN workgroups wg on wg.workgroups_id = g_props.text_value

--most recent note entered
DROP TABLE IF EXISTS #notes
SELECT
*
, ROW_NUMBER()OVER(
			PARTITION BY event_log_id
			ORDER BY date_entered DESC
			) row_num 
INTO #notes
FROM
udr.vv_incident_notes

--unioning the incident participants with the user who entered for security
DROP TABLE IF EXISTS #incident_participants

SELECT
ih.incident_header_id
,s.people_id
INTO #incident_participants
FROM
dbo.incident_header ih
JOIN event_log el on ih.incident_header_id = el.event_log_id
join staff s on el.staff_id = s.staff_id

UNION ALL

SELECT
incident_header_id
, people_id
FROM
dbo.incident_participants_view 
	where copy_event = 0

-- select fields displayed in widget 
DROP TABLE IF EXISTS #prep_table
SELECT 
ih.incident_header_id
, ev.event_name
, ev.form_header_id as event_form_header_id
, ev.program_enrollment_event_id as program_enrollment_event_id
, ev.program_providing_service as program_responsible
, ev.event_definition_id
, ev.service_track_event_id
, ev.staff_id
, ih.control_number as incident_id
, ix.udf_Incident_Summary as summary
, ev.event_name as submission_type
, ev.actual_date as date_entered
, sv.last_name + ', ' + sv.first_name as entered_by
, case when r.transition_name = 'close incident' then 'Routing Closed' else r.assigned_to end as assigned_to
, r.date_entered as route_date
, inp.description as incidient_priority
, ix.udf_due_date as due_date
, uv.last_name +', '+ uv.first_name as last_updated_by
, uv.dt_tm as last_updated_date_PT
, n.note_text as most_recent_note
, n.staff_name as note_entered_by
, incpar.people_id as participants_id
, ih.is_sensitive
INTO #prep_table
FROM
dbo.incident_header ih
JOIN dbo.incident_header_x ix on ih.incident_header_id = ix.incident_header_id
JOIN dbo.event_view ev on ix.incident_header_id = ev.event_log_id
--LEFT JOIN dbo.user_defined_lut st on ix.udf_submission_type = st.user_defined_lut_id
LEFT JOIN dbo.staff_view sv on ev.staff_id = sv.staff_id
LEFT JOIN #routing r on r.event_log_id = ih.event_log_id
	and r.row_num =1
LEFT JOIN dbo.user_defined_lut inp on ix.udf_incident_priority =inp.user_defined_lut_id
JOIN dbo.update_log_view uv on ih.update_log_id = uv.update_log_id
LEFT JOIN #notes n on ih.incident_header_id = n.event_log_id
	and n.row_num =1
LEFT JOIN #incident_participants incpar on ih.incident_header_id = incpar.incident_header_id


--filter based on security
SELECT DISTINCT
incident_header_id
, event_name
, event_form_header_id
, program_enrollment_event_id
, program_responsible
, event_definition_id
, service_track_event_id
, staff_id
, incident_id as incident_id_order
, case when assigned_to != 'Routing Closed' or assigned_to is null then	
	CASE WHEN datediff(d,isnull(route_date, dateadd(d,-2,getdate())), getdate()) > 1 AND
	      datediff(d,last_updated_date_PT, getdate()) > 1 then '<p style="color:red;">'+incident_id+'</p>'
		  else incident_id end 
	else incident_id end as incident_id 
, summary
, submission_type
, date_entered
, entered_by
, isnull(assigned_to, '<b>Not Routed yet</b>') as assigned_to
, route_date
, last_updated_by
, last_updated_date_PT
, most_recent_note
, note_entered_by
INTO #allResultsTemp
FROM
#prep_table
where
(CASE WHEN is_sensitive = 1 then 
		case when @sensitive = 1 then 1
		when @sensitive = 0 then 0 end
	when is_sensitive = 0 then 1
	end = 1)
AND 
(@all = 1 or @participant = participants_id)


-- Set the default sort if not passed in
DECLARE @orderByAll [dbo].[order_expr_tabletype] -- column_name, sortorder, ascend
INSERT INTO @orderByAll 
SELECT * 
FROM @orderBy

IF NOT EXISTS (SELECT * FROM @orderBy)
BEGIN
	INSERT INTO @orderByAll VALUES(N'incident_id_order', 1, 1, NULL) 
END

-- Get paged, sorted, and ordered results
EXEC [dbo].[GetPagedSortedOrderedData] 	@filterBy, @orderByAll, @pageSize, @pageNumber

-- status report
If @debugging = 1
	Insert Into db_tran_status (tran_id, status) Values (@tran_id, 'GetIncidientReports  ended.')

exec [dbo].[DBStopCallTracking]
         @debugging,
         @start_time ,
         @db_object_status_tracking_id ,
         @min_time,
         @tran_id,
         @parameters
```
