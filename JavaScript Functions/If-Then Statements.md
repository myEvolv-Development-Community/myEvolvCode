### What is this:
If/Else (a.k.a. If/then) statments in JavaScript can create outcomes based on conditions or comparisons you make.

### Code:
```javascript
if (contidtion) {
  theOutcome();
} else {
  // the outcome if the condition is not met
  somethingElse();
}
```

- Note: this can be used without the "else" and second outome if you just want one possible outcome.
- Another Note: Using double `{{` and `}}` curly-brackets is also supported, but unnecessary.
- A third Note: New versions of Javascript brought the ability to omit curly-brackets entirely for simple if/else statements.

```javascript
if (condition) action();
else anotherAction();
```

### Examples
#### Set a column's value based on another value.
```javascript
const valueOne = getFormElement('column_one');
if (valueOne === 'x') {
  setFormElement('column_two', '1');
} else {
  setFormElement('column_two', '2');
}
```
If you have multiple conditions, you *could* use multiple chained if/else statements, but a switch/case statement is better:
```javascript
// If/else method:
const valueOne = getFormElement('column_one');
if (valueOne === 'x') {
  setFormElement('column_two', '1');
} else if (valueOne === 'y') {
  setFormElement('column_two', '2');
} else if (valueOne === 'z') {
  setFormElement('column_two', '3');
}

// Switch/case method (better):
const valueOne = getFormElement('column_one');
let valueToSet = ''; // this must be LET not CONST
switch (valueOne) {
  case 'x':
    valueToSet = '1';
    break;
  case 'y':
    valueToSet = '2';
    break;
  case 'z':
    valueToSet = '3';
    break;
  default: // Note, this is "default" not "case". Every switch/case statement must have a "default".
    valueToSet = 'Some default value';
    break;
}
setFormElement('column_two', valueToSet);
```

#### Make an alert pop up if the actul_date is 48 hours from the current date
```javascript
const actualDate = new Date(getFormElement('actual_date'));
const nowDate = new Date();
const hoursBetween = (nowDate - actualDate) / (60 * 60 * 1000);
if (hoursBetween >= 48) {
  alert('WARNING: This date is over 48 hours old');
}
```

#### Make a field required if another is marked
```javascript
if (isChecked('udf_boolean')) {
  Form.makeRequiredByColumn('expiration_date');
} else {
  Form.makeUnRequiredByColumn('expiration_date');
}
```

### Ternary Statements
Another kind of if/else statement is called a "ternary" statement. It's best used for simple one-liner situations. It is written like this:

`condition ? trueOutcome : falseOutcome`

So, in the "set a column's value based on another value" example above, you could write that more simply like this:
```javascript
const valueOne = getFormElement('column_one');
const valueToSet = valueOne === 'x' ? 'x' : 'y';
setFormElement('column_two', valueToSet);

// You could also just write the ternary inline with setFormElement:
setFormElement('column_two', valueOne === 'x' : 'x' : 'y');
```

### Details
Depending on the purpose of the code, these could go into the **On Load Script** for a specific field, or **Before Load Code** on the form header, or anywhere JavaScript is allowed.
