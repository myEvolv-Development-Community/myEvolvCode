### What You Want to Do:
Toggle the availability of the save button on a form to prevent a user from saving.

### Code to Do It:
```javascript
$(`[button-id="saveform"]`).addClass("disabled").hide(); // Hide and disable save button
$(`[button-id="saveform"]`).removeClass("disabled").show(); // Re-enable save button and make it visible again
```


### Implementation Details
Add the code above to a JavaScript hook in either the form or a form line.

To prevent a form from ever saving, add `$(`[button-id="saveform"]`).addClass("disabled").hide();` to the form's AFter Load code.

You can also toggle the visibility of a field according to the contents of a form in real-time using the following code in an On Change hook or a disable rule:

```js
try {
  if (some_logical_condition) {
    $(`[button-id="saveform"]`).addClass("disabled").hide();
  } else {
    $(`[button-id="saveform"]`).removeClass("disabled").show();
  }
} catch {}
```

### End-User Details
If successfully implemented, the Save button will disappear from an open form.

## Credits:
h/t to Matt Wills for providing the JQuery approach

### To-Do
If there is a known issue or edge case still to work out, describe it here.
