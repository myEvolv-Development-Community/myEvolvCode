### What You Want to Do:
Extract data from a subreport to use in a calculation.

### Code to Do It:
```javascript
querySubReport = function(subreport_caption, booleanFunction) {
  var SR = Form.getFormLineByCaption(subreport_caption)
  var SRV = SR.srValue
  var SRO = 
    SRV.
    dataSource.
    map((x, i) => 
      Object.fromEntries(
        x.
        Cells.
        map((y, j) => [SRV.columns[j].column_name, y.Value])
      )
    )
  return SRO.find(booleanFunction)
}
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|subreport_caption |The caption of the subreport as it appears on the main form.|
|booleanFunction|A function to apply to each row of the subreport, yielding a true or false value.|

## Credits:
Acknowledge specific creators if known.

### To-Do
### Implementation Details
1. Step 1
2. Step 2
3. Step 3

### End-User Details
Here is where I explain what end users should see if everything works.
