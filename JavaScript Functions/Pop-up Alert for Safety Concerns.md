### What You Want to Do:
Create a popup message when certain clients are selected. Originally intended to notify staff that a client poses a safety issue and should be treated with care (or avoided).

### Code to Do It:
```javascript
// Get the module headers from each module
// window.top is the outermost content on a web page. All content in myEvolv is 
// presented in nested iframe elements, which are effectively nested windows
// window.top.document is the outermost document element, which contains all the 
// html in the myEvolv content.
// All modules are technically available from any page view in myEvolv, and moving 
// between formsets changes which forms and formsets are visible to the user.
// Therefore, the querySelectorAll method is able to locate all module headers, 
// and assigning a variable to window.top allows the variable to be accessible 
// the same way from any module or form during the user session.

window.top.header_ribbon_bodies = 
  window.
  top.
  document. 
  querySelectorAll("body iframe.module-header-selector")

// Create two arrays to hold MutationObservers. The first set of observers will
// watch for the user to visit a given module. On initial login, the module is 
// available through window.top.document, but the content is an empty <html> element.
// Once the user visits a module, the content of the module and the module header
// are populated, including a spot to display the selected client. The second
// set of observers will then watch that select client element for indication that
// a different client or person has been selected.

window.top.visitObservers = Array(window.top.header_ribbon_bodies.length)
window.top.selectionObservers = Array(window.top.header_ribbon_bodies.length)

// header_ribbon_bodies is a NodeList, not a typical array, so we use forEach to
// iterate over the module headers it contains.

window.
  top.
  header_ribbon_bodies.
  forEach((ribbon, i) => {

    let win = ribbon.contentWindow // get the nested window that corresponds to each module header ribbon

    win["target"] = // set a target for the MutationObserver to watch the <html> placeholder on the (empty) module header
      ribbon.
      contentDocument.
      querySelector("html")

    window.top.visitObservers[i] = // Define the observer to watch for a visit to each module
    new MutationObserver((mutationList, observer) => {
      if (mutationList[0].removedNodes[0] === win.target) { // On first visiting the module, the empty html placeholder is removed and replaced with a populated module header document. Here we watch for the target we indicated to appear as a removed element in the list of document mutations
        window.top.selectionObservers[i] =  new MutationObserver((mutationList, observer) => { // If the module is visited, create a new MutationObserver on the same module to watch for a client being selected.
          // Each time this MutationObserver is triggered, check whether the selected person has a safety risk alert on file
          mutationList.forEach(m => {
            if (window.top.getDataValue( // check for safety alerts
                "client_current_alerts_view",
                "people_id",
                window.top.getModuleProperty("currentParent"),
                "event_name",
                "event_name = 'Safety Risk'"
                )
            ) {alert("This client presents a safety risk to staff!")} // If found, halt loading the page and show this message in a popup window
          })
        })

        // Once the observer has been created, tell it to start watching the document
        // specifically watch for the displayed client name to be changed
        //(this includes selecting a different person with the same name)
        window.
          top.
          selectionObservers[i].
          observe( 
            window.
              top.
              header_ribbon_bodies[i].
              contentDocument
              .querySelector("body #client-name-id"),
            {subtree: true, childList: true, characterData: true}
          )

        // Once the observer watching for client selections is active, tell the
        // observer watching for visits to a module to stop watching, so it does
        // not continue to trigger and create duplicate observers
        observer.disconnect()
      }
    })

    // Now that we have defined the behavior for the observer to execute once a
    // module has been visited, we tell each visit observer to watch the outermost
    // document for any changes. Each visit observer will run once and then activate
    // the corresponding selection observer
    window.
      top.
      visitObservers[i].
      observe(
        window.top.document,
        {subtree: true, childList: true, characterData: true}
      )
  })
```


### To-Do
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|first argument |The meaning of this input to the function|The type of data expected to go into the argument.|
|second argument|Tell what this argument should represent.|Default values should be mentioned here.|
|third argument |We should be able to clearly name each argument and define its use in a single sentence.|If an argument can take a variety of types, describe more fully in the implementation details.|


### Implementation Details
1. Step 1
2. Step 2
3. Step 3

### End-User Details
Here is where I explain what end users should see if everything works.

## Credits:
Acknowledge specific creators if known.
