### What You Want to Do:
This makes it so that only an etnry that is a valid e-maila address will be accpeted into a field. 

### Code to Do It:
```javascript
var currentvalue = getFormElement('email_address'); // this is for the email_address field on demographics, you could replace this with any other field name
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var valid = emailPattern.test(currentvalue);
if(!valid){
alert('Invalid Email format'); // this is the message for the pop-up, you can change it
setFormElement('email_address',''); // this will blank the field out if invalid, if using a differnt field change the name here too
}
```

### Implementation Details
Add this to the "on change" area of the field. 

## Credits:
Alan Arenz developed this on the Netsmart Connect Community

