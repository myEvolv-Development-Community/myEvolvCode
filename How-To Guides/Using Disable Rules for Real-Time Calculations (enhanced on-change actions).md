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

In this case, we might have a field at the top of the form, e.g., an expiration date, which should be copied throughout the form. For example, we might set a service agreement to expire one year after the actual_date of the agreement, present the actual date and expiration date at the top of the form (the 'main field'), and later have a field indicating the client's acknowledgement of the expiration date (the 'mirror field').

The flow of data in this scenario looks as follows:
```
   expiration_date
         |
         |
         V
expiration_date_mirror
```

We would create a form with the expiration date at the top and a variable, formatted as a date or datetime to match the 'main' expiration date field, elsewhere in the form. If we set the default for the mirror variable to be `getFormElement("expiration_date")` then the variable will load with the main expiration date's value when the form is opened. 

Setting the disable rule for the mirror to be 
```js
try {
  setFormElement("expiration_date_mirror", getFormElement("expiration_date"))
} catch {}
  ``` 
will make it so that any time the expiration date is edited, that change immedately is reflected in the mirror. Furthermore, any time the mirror is changed, it reverts back to the main expiration date's value, so it cannot be altered to introduce a conflicting value.

2. More Complicated: Calculate a worksheet total in real-time


In this case, we might have one or more assessments or sets of numeric fields and want to calculate a total for certain sets of values, and possibly add those totals into a grand total at the end.

We would do this by first creating the assessment for each subscale, then embed a mirror variable to follow the assessment in the form.

```
Item 1 
       \
Item 2   ----> Subtotal 1 
       /               \
Item 3                   \
                          \
                           ----> Grand Total
Item 4                    /
       \                /  
Item 5   ----> Subtotal 2
       /
Item 6
```

For example, we might have a total income assessment (test_code "INCOME") with four numeric entry items, representing three main sources of income and an 'other' amount. A numeric variable called 'total_income' would add up the individual income entries.

The default value for total_income would be:
```js
["source_1", "source_2", "source_3", "other_income"].
  reduce((x, y) => x + (Form.getTestAnswerValue("INCOME", y) ? parseFloat(Form.getTestAnswerValue("INCOME", y)) : 0), 0)
```
and the disable rule would be:

```js
try {
  setFormElement(
    "total_income", 
    ["source_1", "source_2", "source_3", "other_income"].
      reduce((x, y) => x + (Form.getTestAnswerValue("INCOME", y) ? parseFloat(Form.getTestAnswerValue("INCOME", y)) : 0), 0)
  )
} catch {}
```

3. Very Complicated: Calculate an output value with unit conversions

### Notes:

*A word on try {} catch {}*

The code inside the disable rules needs to be wrapped in `try catch` blocks because disable rules actually start executing *first* in the form load process, before anything else loads in the form. `try` first attempts to run the instructions inside its block of code; if anything prevents the code from executing, e.g., the necessary fields not being present yet, then the `catch` block executes. The typical format is usually 
```
try {
//some code to run
} catch {
// some alternative fail-safe to run
console.log('Something went wrong!')
}
```
but in this case, leaving the `catch` block empty lets the code fail silently until it the form is ready for it to run.
### To Do:

Upload working form examples.
