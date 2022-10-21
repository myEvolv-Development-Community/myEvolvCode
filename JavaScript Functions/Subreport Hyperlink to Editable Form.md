### What You Want to Do:
Extend the subreport hyperlink functionality to open an editable version of the form. The default behavior opens a read-only form

### Code to Do It:
```javascript
var subreport_caption = 'Caption for my subreport'

// callback executed when array is found
function handleDataArray(dataArray) {
  var subreport = Form.getFormLineByCaption(subreport_caption);
  dataArray.
  forEach((row, index) => {
  
    // look up event_definition_id of the event on the specific row
    var row_event_definition_id = getDataValue( 
      "event_log", //referenced table 
      "event_log_id", //referenced column 
      row.event_log_id, //value to look up 
      "event_definition_id", //column to output 
      null, //where condition 
      null //order by condition. Search from lowest to highest value 
    );
    
    // Based on the event definition id collected, look up the form to display
    var row_form_code = getDataValue( 
      "vv_event_forms_expanded", //referenced table 
      "event_definition_id", //referenced column 
      row_event_definition_id, //value to look up 
      "form_code", //column to output 
      null, //where condition 
      null //order by condition. Search from lowest to highest value 
    );
    
    document.
    getElementById(`sr-table-${subreport.formLinesId}-${subreport.subReportHeaderId}`).
    querySelectorAll("[id^='row']")[index].
    addEventListener("click", 
      function () {OpenFormGeneric( 
        "eventform.asp", //aspx file to use, defaults to Form.aspx
        row_form_code, //form code 
        row.event_log_id, //keyValue, event_log_id for events
        "EDIT", //add, edit, or view mode
        true, //allow add? boolean
        true, //allow edit? boolean
        false, //allow delete? boolean
        false, 
        row_event_definition_id,
        parentValue, //parentValue
        serviceTrack, 
        null, 
        null, //program providing service
        null, //program enrollment id
        null, 
        false //does this complete a scheduled event? boolean
        );
      }
    );
  });
  
  // Give modified subreport a distinct style to indicate it is interactive.
  $(`[form_line_id="${Form.getFormLineByCaption('subreport').formLinesId}"]`)[0].style.fontStyle = "oblique";
  $(`[form_line_id="${Form.getFormLineByCaption('subreport').formLinesId}"]`)[0].style.color = "#26828EFF";
}

// set up the mutation observer 
var observer = new MutationObserver(function (mutations, me) { 
  // `mutations` is an array of mutations that occurred 
  // `me` is the MutationObserver instance 
  var dataArray = Form.getFormLineByCaption(subreport_caption).srValue.rawDataSource; 
  if (dataArray) { 
    handleDataArray(dataArray); 
    me.disconnect(); // stop observing. Otherwise, the observer will keep watching and executing handleDataArray infinitely
  return; 
  } 
}); 

// start observing
observer.observe(document, {
  childList: true,
  subtree: true
});

// Wrap around the default `RefreshSubReport` function to re-apply hyperlinks after refresh button is used.
Form.RefreshSubreport = (function() {
  var cached_function = Form.RefreshSubreport;
  return function() {
    observer.observe(document, {
      childList: true,
      subtree: true
      }
    );
    var result = cached_function.apply(this, arguments); // use .apply() to call it
    return result;
    };
})();
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|subreport |The caption for the subreport, as displayed on the form.|String|
|dataArray|The data values inside the subreport.|Array|

### Implementation Details
1. Set up the [vv_event_forms_expanded](https://github.com/Khoirovoskos/Example-Code-Repo/blob/main/SQL%20Functions/Event%20Forms%20View.md) view in NX Custom Reporting.
2. Define the subreport to display in the form.
  * For best results, follow Netsmart's instructions to create a hyperlinked subreport and confirm it successfully launches. 
  * Make sure the event_log_id is included in the subreport. It does not need to be visible.
2. Identify the form code for the form to launch.
3. Identify the event_definition_id for the event being edited.
4. Add the subreport to a form.
5. Adjust the contents of the `handleDataArray()` function as needed and paste it into the After Load box on the form containing the subreport.
6. If multiple subreports are to be hyperlinked, you will need to set up separate observers for each with distinct names, e.g., demographicsObserver, strengthsObserver, needsObserver or observer1, observer2, observer3 

### End-User Details
This functionality came out of a request for a streamlined process to end-date medications, diagnoses, strengths, and needs at the end of services. We were unable to find a way to link these all together using subforms, so links to forms were necessary.

Use of promises and MutationObserver were necessary because subreports signal that they are 'loaded' once the frame for the table is ready. The actual data contents arrive a little later. MutationObserver allows us to wait for the data to arrive and the table rows to populate before attempting to create hyperlinks.

Once implemented, open the form containing the subreport. If it is linked to an editable form, the subreport will render in blue-green italic type. This display can be customized as needed.

In a standard hyperlinked subreport, the link is in the Description Column for Link specified in Setup > User Tools > Sub Reports - User > User Sub Reports, rendered in blue, bold, underlined type.

![A hyperlinked subform](/JavaScript%20Functions/assets/images/Subreport%20loaded.png "Cursor hovering over the description column for link")

Clicking the linked column will bring up a read-only form corresponding to the cell clicked. Note the VIEW indicator in the top bar and the date fields are greyed out.

![A view-only form link](/JavaScript%20Functions/assets/images/Subreport%20View%20Only%20Link.png "A view-only form")

In the customized subreport, each full row is hyperlinked. Clicking on any other cell in a row will open the editable form.

![A hyperlinked subform](/JavaScript%20Functions/assets/images/Subreport%20loaded2.png "Cursor hovering over the actual date column in the subreport")

An editable form opens. Note the form is labeled as EDIT mode and the date fields are active.

![An editable form launched from a subreport](/JavaScript%20Functions/assets/images/Subreport%20Editable%20Link.png "An editable form launched from a subreport")


## Credit:
https://stackoverflow.com/questions/16149431/make-function-wait-until-element-exists
https://stackoverflow.com/questions/9134686/adding-code-to-a-javascript-function-programmatically

## To-Do

*Loop through a series of subreports on load. Something like:*

```js
var subreportList = ["First Caption", "Second Caption", "Third Caption"];

observerList = subreportList.map(subreport => {
    new MutationObserver(function (mutations, me) { 
      var dataArray = Form.getFormLineByCaption(subreport).srValue.rawDataSource; 
      if (dataArray) { 
        handleDataArray(dataArray); 
        me.disconnect();
        return; 
      }
    }
  }
)

observerList.forEach(observer => {
    observe(document, { 
      childList: true, 
      subtree: true 
      }
    ); 
  }
)
```
