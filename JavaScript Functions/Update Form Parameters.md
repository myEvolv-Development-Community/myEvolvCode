### What You Want to Do:
Re-open a record in a different form mode (e.g., change from EDIT to VIEW or from VIEW to DELETE), or change the form being used to display information.

### Code to Do It:
```javascript
var parameter = /*URL parameter key to replace*/
var newValue = /*New value for the parameter*/
window.location.href = window.location.href.replace(new RegExp(`(?<=${parameter}=)[^&#]*`), newValue)
```

### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|parameter |The variable in the parameter to replace|String|
|newValue|The value that the window should re-open with|String, GUID, or Number|


### Implementation Details
Run the above in the JavaScript console, or add to the form's After Load code to force a redirect

### End-User Details
Forms in myEvolv act as embedded web pages and each have their own URL with the basic functionality specified with a [URL Query String](https://en.wikipedia.org/wiki/Query_string). The URL looks something like `https://myevolvagency.netsmartcloud.com/Form.aspx?mode=EDIT&form_header_id=01234567890-abcd-abcd-abcd-0123456789ab#!`
- The `?` indicates the start of the query
- Multiple parameters are joined with `&`
- The `#!` indicates the end of the query
- Each parameter in the query is a `key=value` pairing, but some parameters may have no value and appear like `key1=&key2=&...`

The code above takes in the key for a URL parameter and uses a regular expression to search for any text following the name of that parameter until either an `&` or `#` is found. The selected text is then replaced with `newValue.` For example,

```javascript
var parameter = `mode`
var newValue = `VIEW`
window.location.href = window.location.href.replace(new RegExp(`(?<=${parameter}=)[^&#]*`), newValue)
```

will replace `mode=EDIT` with `mode=VIEW` and re-open the form in VIEW mode.
