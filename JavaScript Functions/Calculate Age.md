### What You Want to Do:

### Code to Do It:
```javascript
var end_date = new Date(getFormElement("actual_date")) // set an end point for the time interval
var start_date = new Date(getDataValue('client_personal_view', 'people_id', parentValue, 'dob')) // set a start point for the interval

// Calculate difference in years. Start by subtracting the year of the start date from the year of the end date, then deduct a year if the end date's month is less than the start date's month or if the end date and start date are in the same month, but the end date is an earlier day in the month. I.e., count the difference in years and determine whether the end date is earlier in the year and the last year is not complete yet.
​​​​​​​
var age = end_date.getFullYear() - start_date.getFullYear() -
(end_date.getMonth() < start_date.getMonth()) -
(
  end_date.getMonth() === start_date.getMonth()
  && end_date.getDate() < start_date.getDate()
)
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|start_date |The earlier date, e.g., date of birth |Date object|
|end_date|The later date, e.g., the date of the event or today's date |Date object.|
|age |Number of years between start date and end date |Numeric or integer|


### Implementation Details
1. Step 1
2. Step 2
3. Step 3

### End-User Details
Here is where I explain what end users should see if everything works.

## Credits:
Acknowledge specific creators if known.

### To-Do
If there is a known issue or edge case still to work out, describe it here.
