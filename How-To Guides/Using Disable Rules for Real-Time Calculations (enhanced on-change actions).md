### What You Want To Do:
Use disable rules to watch for field changes and act as on change events. Using disable rules in this way allows administrators to define a calculation once even when multiple fields may feed into a final result and a change to any one of those fields should cause the calculation to be re-done. Another advantage is that on change events only execute when the value changes to a value different from the field's original state; changing a field once will execute the on change event, but changing it back to the original value will not.

### How to Do It:
1. Create form fields for primary data
2. Create variables to reflect the main entry as needed
3. Define the calculation to be done (see examples below)
4. Write the calculation in JavaScript for an onChange event
5. Insert the relevant calculation into variable fields so they load with the correct values initially
6. Wrap the calculation in try {} catch {} blocks and insert into just one disable rule on the form

### Example Use Cases:

1. Simple: Mirror a field throughout the form

In this case, we might have a field at the top of the form, e.g., an expiration date, which should be copied throughout the form. For example, we might set a service agreement to expire one year after the actual_date of the agreement, present the actual date and expiration date at the top of the form, and later have a field indicating the client's acknowledgement of the expiration date.

We would create


2. More Complicated: Calculate a worksheet total in real-time



3. Very Complicated: Calculate an output value with unit conversions

### To Do:

Upload working form examples.
