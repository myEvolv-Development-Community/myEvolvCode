### What You Want to Do:
Create a popup message when certain clients are selected. Originally intended to notify staff that a client poses a safety issue and should be treated with care (or avoided).

### Code to Do It:
```javascript
window.top.header_ribbon_bodies = 
  window.
  top.
  document.
  querySelectorAll("body iframe.module-header-selector")

window.top.visitObservers = Array(window.top.header_ribbon_bodies.length)
window.top.selectionObservers = Array(window.top.header_ribbon_bodies.length)

window.
  top.
  header_ribbon_bodies.
  forEach((ribbon, i) => {
    let win = ribbon.contentWindow

    win["target"] = 
      ribbon.
      contentDocument.
      querySelector("html")

    window.top.visitObservers[i] =  new MutationObserver((mutationList, observer) => {
      if (mutationList[0].removedNodes[0] === win.target) {
        window.top.selectionObservers[i] =  new MutationObserver((mutationList, observer) => {
          mutationList.forEach(m => {
            if (window.top.getDataValue(
                "client_current_alerts_view",
                "people_id",
                window.top.getModuleProperty("currentParent"),
                "event_name",
                "event_name = 'Safety Risk'"
                )
            ) {alert("This client presents a safety risk to staff!")}
          })
        })
        window.
          top.
          selectionObservers[i].
          observe(
            window.top.header_ribbon_bodies[i].contentDocument.querySelector("body #client-name-id"),
            {subtree: true, childList: true, characterData: true}
          )
        observer.disconnect()
      }
    })

    window.top.visitObservers[i].observe(window.top.document, {subtree: true, childList: true, characterData: true})
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
