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

This scenario comes from a body mass index (BMI) calculation in a subform. BMI is calculated according to the ratio of a person's body weight or mass to the person's height: kg/m<sup>2</sup>, but myEvolv's height and weight fields are in English units (inches and pounds). Therefore, it is most convenient to convert the weight in pounds (`weight_in_lbs`) to kilograms (`weight_in_kg`) and height in inches (`height_inches`) to centimeters (`height_cm`) to get the BMI value. Furthermore, it may be valid for a user to enter height as inches or as centimeters, and weight as either pounds or kilograms, so editing one value in either pair should be reflected in the other before updating the BMI value (`bmi_calculated`).

The data in this case flow as follows:
```
weight_in_lbs    height_inches
     ^                ^
     |                |
     v                v
weight_in_kg     height_cm
         \      /
          v    v 
       bmi_calculated
```

In this case, simply setting the disable rule to have `weight_in_lbs` and `weight_in_kg` (or `height_inches` and `height_cm`) to mutually update each other results in an infinite loop as each edit triggers the disable rule to run again. To avoid this loop, we need a number of components to work in concert as follows (more or less in chronological order):

a. Default values on the two variables calculate appropriate conversions from English units when the form is opened:
  - `height_cm` : `Math.floor(self.getElementFromXML(currentRowXML,"height_inches")*2.54)`
  - `weight_in_kg` : `Math.floor(self.getElementFromXML(currentRowXML,"weight_in_lbs")/2.2)`
 b. The `bmi_calculated` field's On Load Script creates a listener to determine which field was last selected, and updates a global variable accordingly:
```js
['weight_in_lbs','weight_kg','height_inches','height_cm'].
  forEach(col => {
      $(self.Form.getFormLineByColumnName(col).GetField()).
      on("focus",()=>window.whatChanged=col)
  }
 )
```
c. The `bmi_calculated` Disable Rule looks at the global variable to see which subform column was last updated, then dispatches updates to the correct fields accordingly, and finally clears the global variable to await the next change.
```js
try {
  switch (window.whatChanged) {
    case 'weight_in_lbs':
      var wt = self.getElementFromXML(currentRowXML, "weight_in_lbs")
      self.setElementFromXML(currentRowXML, "weight_kg", Math.floor(wt / 2.20))
      window.whatChanged = null
      break;
    case 'height_inches':
      var ht = self.getElementFromXML(currentRowXML, "height_inches");
      self.setElementFromXML(currentRowXML, "height_cm", Math.floor(ht * 2.54))
      window.whatChanged = null
      break;
    case 'height_cm':
      var ht = self.getElementFromXML(currentRowXML, "height_cm");
      self.setElementFromXML(currentRowXML, "height_inches", Math.floor(ht / 2.54))
      window.whatChanged = null
      break;
    case 'weight_kg':
      var wt = self.getElementFromXML(currentRowXML, "weight_kg")
      self.setElementFromXML(currentRowXML, "weight_in_lbs", Math.floor(wt * 2.20))
      window.whatChanged = null
      break;
  }
  self.setElementFromXML(
    currentRowXML, 
    "bmi_calculated", 
    self.getElementFromXML(currentRowXML, "height_cm") > 0 ? parseFloat(self.getElementFromXML(currentRowXML, "weight_kg") / 
      (self.getElementFromXML(currentRowXML, "height_cm") / 100) ** 2).toPrecision(3) : "")
      window.whatChanged = null
} catch {}
```

 d. The (sub)form's After Load code ensures the BMI value is restored after any inadvertent calculations during the loading process
  ```js   
  self.setElementFromXML(
    currentRowXML, 
    "bmi_calculated", 
    self.getElementFromXML(currentRowXML, "height_cm") > 0 ? parseFloat(self.getElementFromXML(currentRowXML, "weight_in_kg") / 
      (self.getElementFromXML(currentRowXML, "height_cm") / 100) ** 2).toPrecision(3) : "")
      window.whatChanged = null
   ```

### Notes:

*A word on try {} catch {}*

The code inside the disable rules needs to be wrapped in `try catch` blocks because disable rules actually start executing *first* in the form load process, before anything else loads in the form. `try` first attempts to run the instructions inside its block of code; if anything prevents the code from executing, e.g., the necessary fields not being present yet, then the `catch` block executes. The typical format is usually 
```ja
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
