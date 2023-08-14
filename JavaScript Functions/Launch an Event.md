### What You Want to Do:
There might be some subreports where you would want the user to be able to click on the row item, and open up the form that actually belongs to that row item. For example, imagine you have a list of consents coming in as a subreport - and you want the user to be able to open each consent in its original form. That might be important because most consents have vastly different and specific language. You would use this script and method to achieve that level of detail.

### Implementation Details
1. Create a form in the "Event Log Only" form family. I called mine "Event Launcher".
2. Add the scripts below to the After Load form property of your "Event Launcher" form. Basically, we'll open the shortcut form with the subreport, get the real event and form info, then relaunch the event with it's proper form. Note: myEvolv's code editor does not like async/await functions. It will throw unnecessary warnings.
3. Identify the form you created as the form to launch when clicking on a subreport or report row, using `event_log_id` as key value column.

### Add the following to After Load:

First, We have to add this function to the Form object so that the launchEvent function can access it.

```javascript
Form.closeWindow = (windowToClose) => {
    // Use provided window, but if not provided try to find the rad window.
    windowToClose = windowToClose ? windowToClose : getRadWindow();

    if (windowToClose) {
        console.log('Closing rad window');
        windowToClose.close({ refresh: true });
    } else {
        console.log('Could not find a rad window, so close this window.');
        window.close({ refresh: true });
    }
};
```

Next, we need to create a function to collect the real event's information. We're using an async/await function here to tell the browser to wait for each variable, since `getDataValue()` can take some time to finish, depending on how the servers are performing. I also like to wrap this in a try/catch statement, just in case something goes wrong. Here's what that looks like:

```javascript
const getEventInfo = async (eventLogId) => {
    try {
        // Get initial variables, we have to name them oddly so they don't conflict with existing variables on the page.
        const siteProviding = await getDataValue('event_log', 'event_log_id', eventLogId, 'site_providing_service');
        const programProviding = await getDataValue('event_log', 'event_log_id', eventLogId, 'program_providing_service');
        const eventDef = await getDataValue('event_log', 'event_log_id', eventLogId, 'event_definition_id');
        const profileId = await getDataValue('event_log', 'event_log_id', eventLogId, 'group_profile_id');
        const personId = await getDataValue('event_log', 'event_log_id', eventLogId, 'people_id');
        const unitId = await getDataValue('event_log', 'event_log_id', eventLogId, 'units_id');
        const serviceTrackId = await getDataValue('event_log', 'event_log_id', eventLogId, 'service_track_event_id');
        let isGroupEvent = await getDataValue('event_view', 'event_log_id', eventLogId, 'is_group_event');
        const evName = await getDataValue('event_definition_view', 'event_definition_id', eventDef, 'event_name');
        const formHeader = await getDataValue('event_definition_view', 'event_definition_id', eventDef, isGroupEvent ? 'form_header_id_group' : 'form_header_id');

        // Fix for false-positive on isGroupEvent 10/3/2022
        if (isGroupEvent) {
            // Make sure group_profile_id is not blank
            if (!profileId) {
                console.warn('launchEvent detected that isGroupEvent is true, but the groupProfileId is null or empty.');
                if (!personId) {
                    console.error('launchEvent detected that the event people_id and group_profile_id were both null or empty, but isGroupEvent was true!');
                    return;
                } else {
                    console.warn('people_id is not blank, so isGroupEvent is a false-positive. Setting isGroupEvent to false.');
                    isGroupEvent = false;
                }
            }
        }

        // Get Form Program
        let formProg = await getDataValue('event_definition_view', 'event_definition_id', eventDef, isGroupEvent ? 'form_program_xb_group' : 'form_program_xb');

        // Form Program Fix 6/9/23 for Cases, sometimes form_program_xb_group is blank.
        formProg = formProg ? formProg : await getDataValue('event_definition_view', 'event_definition_id', eventDef, 'form_program_xb');
        
        // Determine additional variables
        let evolvModule, calledBy, parentCol, parentVal;
        
        // Account for incidents
        let isIncident = !personId && !profileId ? true : false;
        
        if (isIncident) {
            evolvModule = 'INCIDENT';
            formProg = 'FormIncidents.aspx';
            calledBy = 'FormSetMember';
            parentCol = 'incident_header_id';
            parentVal = eventLogId;
        } else {
            evolvModule = isGroupEvent ? 'CASES' : 'CLIENTS';
            calledBy = 'Listing';
            parentCol = isGroupEvent ? 'group_profile_id' : 'people_id';
            parentVal = isGroupEvent ? profileId : personId;
        }

        // Build return object & return it.
        let eventInfo = {
            eventLogId, 
            isGroupEvent, 
            isIncident,
            siteProvidingService: siteProviding, 
            programProvidingService: programProviding, 
            eventDefinition: eventDef, 
            eventName: evName,
            unitsId: unitId,
            groupProfileId: profileId, 
            peopleId: personId, 
            serviceTrackEventId: serviceTrackId, 
            formProgram: formProg, 
            formHeaderId: formHeader, 
            moduleCode: evolvModule, 
            caller: calledBy, 
            parentColumn: parentCol, 
            parentValue: parentVal
        };
        console.log('Event information retrieved:', eventInfo);
        return eventInfo;

    } catch (error) {
        console.error(error);
        return null;
    }
};
```

Next, we need to create our `launchEvent()` function that we'll use to trigger the launch. It will take a few different parameters, so look at the key below to determine what is appropriate for your use. This function essentially calls our `getEventInfo()` function, and then uses that information to build a url, which we then open as what Netsmart calls a "radwindow" (an internal popup).

```javascript
const launchEvent = async (params) => {
    // Validate parameters
    if (typeof params !== 'object') {
        console.error('launchEvent accepts only a JSON object as a single parameter, containing: {eventLogId, mode, closeWindow}.');
        return;
    }


    let {eventLogId, mode, closeWindow, isRoutingOn} = params;
    if (!eventLogId) {
        console.error('Could not launch event, no eventLogId was supplied!');
        return;
    }

    mode = mode ? mode : 'VIEW';
    closeWindow = closeWindow ? closeWindow : false;
    isRoutingOn = isRoutingOn ? isRoutingOn : false;

    let eventInfo = await getEventInfo(eventLogId);

    if (!eventInfo) {
        console.error('launchEvent did not recieve event info!', eventInfo);
        return;
    }

    // Build url
    let url = Util.relativePath + eventInfo.formProgram;
    url += "?caller=" + eventInfo.caller;
    url += "&key_value=" + eventInfo.eventLogId;
    url += "&form_header_id=" + eventInfo.formHeaderId;
    url += "&parent_value=" + eventInfo.parentValue;
    
    if (eventInfo.isIncident) {
        url += '&defaultForm=39ff3b83-e2aa-40df-91c4-c4441bcebd41';
        url += '&fsm=f1239306-5bc3-480d-8d01-b1f1412a2bbe';
        url += '&form_set_members_id=f1239306-5bc3-480d-8d01-b1f1412a2bbe';
        url += '&form_family_id=a2755da9-5776-47ca-b69a-0ffcc00a98eb';
        url += '&event_category_id=c6bedf97-f0c8-4335-ba5a-f43d87514a9';
        url += '&useEventLog=true';
        
    } else {
        url += eventInfo.isGroupEvent ? "&groupProfileId=" + eventInfo.groupProfileId : "&peopleId=" + eventInfo.peopleId;
        url += "&service_track=" + eventInfo.serviceTrack;
        url += "&unitsId=" + eventInfo.unitsId;
        url += "&event_id=" + eventInfo.eventDefinition;
    }
    
    url += "&mode=" + mode;
    url += "&module_code=" + eventInfo.moduleCode;
    url += "&is_add_allowed=" + false;
    url += "&is_edit_allowed=" + (mode === 'EDIT' ? true : false);
    url += "&is_delete_allowed=" + false;
    url += "&is_complete_scheduled_event=" + false;
    url += "&workerID=" + Form.formObject.workerID;
    url += "&events2do_id=" + eventInfo.eventLogId;
    url += "&apply_security=" + true;
    url += "&is_routing_on=" + isRoutingOn;

    console.log('Finished building URL.');

    // Start Launch!
    try {
        const thisWindow = getRadWindow();
        
        openRadWindowEx(
            eventInfo.eventName,
            url,
            {
                windowName: eventInfo.eventName + new Date().getTime()
            }
        );
        console.log('Event radwindow should now be displayed.');

        if (closeWindow) {
            if (thisWindow) {
                console.log('Form opening from a rad window, closing combo rad window...');
                Form.closeWindow(thisWindow);
            }
        }
        
    } catch (error) {
        console.error('A launch error occurred!', error, url);
        return;
    }

    
};
```

|Parameter       |Definition |Data Type|Required|
|---            |---        |---      |---      |
|eventLogId |The key value of the event we want to open.|string|yes|
|mode|The type of formAction we want the event to open as.|string|no|
|closeWindow|Determines if we will close the shortcut window or not.|boolean|no|
|isRoutingOn|A myEvolv variable to determine routing behavior|boolean|no|

Now that we have the function defined, we can call it with the parameters we want. I'll take the `eventLogId` from the `formObject`, and since I'm going to use this on a subreport, I want to close the shortcut window. If you want to use this on a custom report, you'll leave `closeWindow` as false.

```javascript
// Call the function
launchEvent({
    eventLogId: Form.formObject.keyValue,
    closeWindow: true
});
```

### Final considerations
You could easily do this without establishing each step as their own functions, but I will generally use this code in a centralized location in the system, then call it in a few different areas. In that case, my after load code would be pretty simple - just calling the `launchEvent()` function from that centralized location. I'll have a tutorial on how to do this up soon.

## Credits:
Credit to Netsmart Technologies for the rad window portion of this code. Credit to Perry Peng for originally showing me how to build URLs.
