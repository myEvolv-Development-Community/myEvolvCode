### What You Want to Do:
View expected billing rates for services by service details including program prodiving service.


### View Definition
```sql
select distinct
PI.program_name, 
PM1.description as modifier_name,
GP.profile_name as site_providing_service,
CC.cost_center_description,
PU.description as program_unit_description,
PV.vendor_name,
PV.payor_vendor_id,
IT.description as insurance_type_description,
--.generic_description,
RH.rate_name,
--.rate_scheme,
BPP.plan_name,
BPP.is_in_contract,
BPP.percentage_will_pay,
RD.rate_details_id,
RPLH.rate_plan_link_history_id,
RH.rate_header_id,
RPLH.effective_date,
RPLH.end_date,
--.rate_history_description,
RM.rate_methods_id,
RPLH.is_combined,
periods.periods_id,
RPLH.divide_by,
RPLH.is_full_period_rate,
RPLH.is_one_unit_period,
RPLH.is_break_by_rate,
RPLH.is_break_by_vendor,
RPLH.is_end_period_rate,
RPLH.is_end_period_vendor,
TCH.time_chart_header_id,
RM.method_name,
RM.method_code,
periods.description as period_description,
periods.sc_code as period_code,
TCH.description as time_chart_description,
TCH.time_increment,
TCH.unit_increment,
TCH.increment_start_from,
RD.amount_charged,
RD.amount_expected,
RD.agency_rate,
RD.from_age,
RD.to_age,
--.from_age_ym,
--.to_age_ym,
RD.minimum_time,
RD.maximum_time,
--.group_profile_id,
RD.no_show,
--.reason_for_no_show_id,
--.encounter_with_id,
RD.is_client_present,
PC.procedure_code_id,
BSC.billing_staff_credentials_id,
--.activity_type_id,
RD.modifier1,
RD.modifier2,
RD.modifier3,
RD.modifier4,
PC.description as procedure_name,
PC.sc_code as procedure_code_number,
--.procedure_code,
BSC.description as billing_staff_credential,
--.activity_type,
--.encounter_with,
M1.description as modifier1_description,
M2.description as modifier2_description,
M3.description as modifier3_description,
M4.description as modifier4_description,
--.from_age_desc,
--.to_age_desc,
PI.program_info_id,
GP.group_profile_id,
CC.cost_center_id,
PU.program_unit_id
from program_modifier as pm1
inner join agency_program_modifier_link as APML on PM1.program_modifier_id = APML.program_modifier_id
inner join agency_program_link as APL on APML.agency_program_link_id = APL.agency_program_link_id
inner join agency_group_link as AGL on APL.agency_program_link_id = AGL.agency_program_link_id
inner join group_profile as GP on GP.group_profile_id = AGL.group_profile_id
inner join group_profile_type as GPT on GP.group_profile_type_id = GPT.group_profile_type_id
left outer join program_unit as PU on AGL.program_unit_id = PU.program_unit_id
left outer join cost_center as CC on AGL.cost_center_id = CC.cost_center_id
inner join agency_program_service_link as APSL on APL.agency_program_link_id = APSL.agency_program_link
inner join program_info as PI on APL.program_info_id = PI.program_info_id
inner join billing_payment_scheme_setup as BPSS on APSL.agency_program_service_link_id = BPSS.agency_program_service_link_id
inner join billing_payment_plan_scheme_link as BPPSL on BPPSL.billing_payment_scheme_setup_id = BPSS.billing_payment_scheme_setup_id
inner join billing_payment_plan as BPP on BPP.billing_payment_plan_id = BPPSL.billing_payment_plan_id
inner join rate_plan_link_details as RPLD on BPP.billing_payment_plan_id = RPLD.billing_payment_plan_id
inner join rate_plan_link_history as RPLH on RPLD.rate_plan_link_history_id = RPLH.rate_plan_link_history_id
inner join rate_details as RD on RPLH.rate_plan_link_history_id = RD.rate_plan_link_history_id
inner join billing_payment_scheme as BPS on BPSS.billing_payment_scheme_id = BPS.billing_payment_scheme_id
inner join payor_vendor as PV on PV.payor_vendor_id = BPS.payor_vendor_id
inner join insurance_type as IT on PV.insurance_type_id = IT.insurance_type_id
inner join rate_header as RH on RPLH.rate_header_id = RH.rate_header_id
left outer join time_chart_header as TCH on TCH.time_chart_header_id = RPLH.time_chart_header_id
left outer join periods on periods.periods_id = RPLH.periods_id
inner join rate_methods as RM on RM.rate_methods_id = RPLH.rate_methods_id
inner join procedure_code as PC on PC.procedure_code_id = RD.procedure_code_id
left outer join modifiers as M1 on RD.modifier1 = M1.modifiers_id
left outer join modifiers as M2 on RD.modifier2 = M2.modifiers_id
left outer join modifiers as M3 on RD.modifier3 = M3.modifiers_id
left outer join modifiers as M4 on RD.modifier4 = M4.modifiers_id
left outer join billing_staff_credentials as BSC on BSC.billing_staff_credentials_id = RD.billing_staff_credentials_id
where RH.payor_vendor_id = PV.payor_vendor_id
and BPPSL.rate_header_id = RH.rate_header_id
and BPP.billing_payment_scheme_id = BPS.billing_payment_scheme_id
and isnull(BPSS.is_active   , 1) = 1
and isnull(BPPSL.is_active  , 1) = 1
and isnull(BPP.is_active    , 1) = 1
and isnull(RPLD.is_active   , 1) = 1
and isnull(RPLH.is_active   , 1) = 1
and isnull(RD.is_active     , 1) = 1
and isnull(BPS.is_active    , 1) = 1
and isnull(PV.is_active     , 1) = 1
and isnull(RH.is_active     , 1) = 1
and isnull(TCH.is_active    , 1) = 1
and isnull(periods.is_active, 1) = 1
and isnull(RM.is_active     , 1) = 1
and isnull(PC.is_active     , 1) = 1
and isnull(M1.is_active     , 1) = 1
and isnull(M2.is_active     , 1) = 1
and isnull(M3.is_active     , 1) = 1
and isnull(M4.is_active     , 1) = 1
and isnull(BSC.is_active    , 1) = 1
and isnull(CC.is_active    , 1) = 1
and isnull(PM1.is_active    , 1) = 1
and isnull(PI.is_active    , 1) = 1
and isnull(APML.is_active    , 1) = 1
and isnull(APL.is_active    , 1) = 1
and isnull(AGL.is_active    , 1) = 1
and isnull(GP.is_active    , 1) = 1
and isnull(GPT.is_active    , 1) = 1
and PM1.program_modifier_id = isnull(BPPSL.program_modifier_id, PM1.program_modifier_id)
and isnull(AGL.program_modifier_id, PM1.program_modifier_id) = PM1.program_modifier_id
and isnull(RPLH.end_date, '9999-12-31') > getdate()
and GP.group_profile_type_id <> '00A2A2DD-5F25-4E6F-AD38-8F0ECBAD8F4F'
```

### Other Details
Returns a lot of data. Best to run for one program at a time.
