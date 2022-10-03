### What is this:
Use getDataValue(); to select a value from your attached LUT and set that as the default for the field.

### Code:
```
getDataValue('activity_type', 'sc_code', '02', 'description');
```

### Details
In the above example, the <b>Activity Type</b> field is being defaulted to the "Face-to-Face" selection.

The format for this type of code is:<p>
getDataValue('LUT name', 'field to match on', 'value to match', 'value to return');
