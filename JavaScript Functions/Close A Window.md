### What You Want to Do:
Imagine you have an if/then statement where if a certain condition is met, such as `formAction === 'ADD'` you'd like to close the window a user currently has open. This script expands on a Netsmart function that allows for closing pop-up windows, in addition to "rad" windows. (Rad Windows) are windows that appear within the myEvolv portal, in the same browser tab.

### Code to Do It:
```javascript
closeWindow = function() {
    var win = getRadWindow();
    if (win) {
        console.log('Closing rad window');
        win.close({ refresh: true });
    } else {
        console.log('Closing window');
        window.close({ refresh: true });
    }
};
```

Then, call the function where/when you'd like it to fire off:

```javascript
if (/** my condition */) {
    closeWindow();
}
```

### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|No arguments|X|X|


### Implementation Details
1. Define the function.
2. Call the function.

### End-User Details
Here is where I explain what end users should see if everything works.

## Credits:
Credit to Netsmart Technologies for the rad window portion of this code.

### To-Do
If there is a known issue or edge case still to work out, describe it here.
