## What you can do
There are some cases where you would like a new form to be created from another form. This can be achieved using b2e sub-forms on an event. In some cases, the new form you want tocreate has its own sub-form that cannot be set from the b2E form. This code would be used in the After Save portion of the form header in form design.

In the example below, we have a provider selection form, and if a provider is filled into our 'udf_referred_to_provider_id' field we want a referral to be generated with a status set to "Pending"

## Code to do it
```js
function CreateFormLine(column, value, udf, el, typeCode) {// setting up the CreateFormLine function: (column_name, value, does the form family ahve UDF feilds ,  does the form family have event_log fields)
    var formLine = {};
    formLine.isDirty = true;
    formLine.columnName = column;
    formLine.value = value;
    formLine.ddColumnsId = "filler";
    formLine.typeCode = typeCode|| "S";
    formLine.userDefined = udf || false;
    formLine.useEventLog = el || false;
    return formLine;
}
function CreateForm(dataTable, keyValue, formMode, extensible, useEventLog) { // setting up the CreateForm function(form_family, keyValue on the form will be New, formMode will be ADD (this will prevent a new form being made anytime the form is open), does the form family have a X table, form family uses the event_log fields) 
    var form = {};
    form.dataTable = dataTable;
    form.primaryKey = dataTable + "_id";
    form.hasData = true;
    form.formCode = null;
    form.keyValue = keyValue;
    form.isEditAllowed = true;
    form.FormLines = [];
    form.formMode = formMode;
    form.parentColumn = "";
    form.parentTable = "";
    form.dataExtensible = extensible || false;
    form.useEventLog = useEventLog || false;
    return form;
}

if (getFormElement('udf_referred_to_provider_id') !== '' && formMode == "ADD") { //checks to see if our provider referred to feild on our form has been filled in
        
        var ref2Agency = CreateForm("referrals_made","NEW","ADD", true, true); //"referrals_made" is the form family
		
		// Match all of the fields of the new form to the values you want to have defaulted        
        ref2Agency.FormLines.push(CreateFormLine("people_id",parentValue, false, true));
        ref2Agency.FormLines.push(CreateFormLine("event_agency_id",currentAgency, false, true));
        ref2Agency.FormLines.push(CreateFormLine("program_providing_service",'AC4B5ED1-E6C3-48C9-9E32-4F9CC463917E', false, true)); // we hard-coded these could use programPS if in service entry
        ref2Agency.FormLines.push(CreateFormLine("site_providing_service",'5315A742-B81C-453D-AD8A-38195F252044', false, true)); // we hard-coded these could use sitePS if in service entry
        ref2Agency.FormLines.push(CreateFormLine("program_enrollment_event_id",programEnrollment, false, true));
        ref2Agency.FormLines.push(CreateFormLine("staff_id",getFormElement("staff_id"), false, true));
        ref2Agency.FormLines.push(CreateFormLine("service_track_event_id",serviceTrack, false, true));
        ref2Agency.FormLines.push(CreateFormLine("event_definition_id",'8405D720-8549-4554-844A-6FF4F1A531A6', false, true)); //include the event definition for the first form
        ref2Agency.FormLines.push(CreateFormLine("actual_date", getFormElement("actual_date"), false, true, 'DT'));
        ref2Agency.FormLines.push(CreateFormLine("belongs_to_event", keyValue, false, true));
        
        ref2Agency.FormLines.push(CreateFormLine("group_profile_id",getFormElement("udf_referred_to_org_id_1"), false));
        ref2Agency.FormLines.push(CreateFormLine("udf_referred_to",getFormElement("udf_referred_to_provider_id"), true));
        ref2Agency.FormLines.push(CreateFormLine("problem_category_id",getFormElement("udf_referred_for"), false));
        ref2Agency.FormLines.push(CreateFormLine("modality_id",getFormElement("udf_treatment_type"), false));
        ref2Agency.FormLines.push(CreateFormLine("remarks",getFormElement("nyscri_oasasadmn4"), false));
        ref2Agency.FormLines.push(CreateFormLine("program_id",'AC4B5ED1-E6C3-48C9-9E32-4F9CC463917E', false));
        
        
        Util.saveFormObject(ref2Agency, function(ref2AgencyEvent){ //plug in the variable name from above and create a new variable name for this function to create the new sub-form
            var refStatus = CreateForm("referrals_made_status","NEW","ADD", true, true);
            
			// Match all of the fields of the new form to the values you want to have defaulted  
            refStatus.FormLines.push(CreateFormLine("belongs_to_event", ref2AgencyEvent.KeyValue, false, true));
            refStatus.FormLines.push(CreateFormLine("people_id", parentValue, false, true));
            refStatus.FormLines.push(CreateFormLine("event_definition_id","8896B3FF-D099-49BF-BD08-C26F9EB5D500", false, true)); // //include the event definition for the sub form
            refStatus.FormLines.push(CreateFormLine("referrals_made_id", ref2AgencyEvent.KeyValue, false, false));
            refStatus.FormLines.push(CreateFormLine("oc_status_id","DBB1276F-F59A-4425-A10B-30DD76F9584F", false, false));
            refStatus.FormLines.push(CreateFormLine("actual_date", getFormElement("actual_date"), false, true));
            
            Util.saveFormObject(refStatus, null, false);
        }, false);
}
```
