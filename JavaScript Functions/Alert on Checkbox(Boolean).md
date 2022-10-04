### What is this:
This is a function that causes a overlapping alert box to pop-up with your indicated message in it when a box is checked/unchecked. The staff will need to click "OK" on the message before moving forward
### Code:
Box is checked by default, or checked. Staff then unchecks the box and receives the alert<br>
`if(!this.checked){alert2(‘NOTE: By unchecking this box, you are indicating that the client was not present for this session.’)}`<br><br>

Box is not checked by default or staff checks the box<br>
`if(this.checked){alert2(‘NOTE: By checking this box you are indicating that this was a telehealth session.’)}`<br><br>

This one will trigger every time the box is checked or unckecked<br>
`alert2(‘WARNING: This field has a direct impact on billing’)`

### Details
This code is placed into the **On Click Script** box on the checkbox/boolean field you want to trigger the alert
