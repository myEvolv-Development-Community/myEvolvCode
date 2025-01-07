### What You Want to Do:
Hide the save button from a form while it is being tested, to prevent unwanted data being saved. This is especially helpful when developing test/assessment forms, which become much more difficult to modify once any data are saved in them.
### Code to Do It:
```javascript
$(`[button-id="saveform"]`).hide();
```

### Implementation Details
1. Put the above code in the form's After Load slot.

### End-User Details
The save form should disappear when the form is opened.
