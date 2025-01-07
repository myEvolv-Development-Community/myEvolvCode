### What You Want to Do:
Turn off signature capture using the Topaz device without modifying the Topaz browser extension.

### Code to Do It:
```javascript
// Turn off Topaz signing
document.documentElement.setAttribute("sigplusextliteextension-installed", null);

// Re-enable Topaz signing
document.documentElement.setAttribute("sigplusextliteextension-installed", true);

// Toggle Topaz usage based on a (variable) form element 
// On click slot
document.documentElement.setAttribute("sigplusextliteextension-installed", getFormElement("use_topaz") ? true : null);

// Default value for use_topaz variable:
!!document.documentElement.getAttribute("sigplusextliteextension-installed");

```

### Implementation Details
1. In Form designer, add a Boolean variable field with the variable name of 'use_topaz'
2. Put the appropriate code in the variable's on click and default value slots.
3. When the box is checked, signing will use a Topaz device.
4. If a Topaz device is not plugged in, uncheck the box to sign with mouse or touch screen.

