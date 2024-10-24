### What You Want to Do:
Remove HTML formatting from memo-formatted subreport fields, e.g., [fields with hyperlinks to forms](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/Hyperlink%20to%20Editable%20Form%20(View).md)

### Code to Do It:
```javascript
function handleSubreport(subreport) {
  let report_rows = 
    subreport
      ?.dataSource
      ?.map(row => row.Cells)

  subreport
    .columns
    .flatMap((column, index) => memos = column.type_code == 'M' ? index : [])
    .map(column_index => 
      report_rows
      .map(row => 
        row[column_index]
        .Value = row[column_index]
        .Value
        .replaceAll(/<[^>]*>/g, '') // remove anything that looks like an HTML tag (bounded by < and >)
      )
    )
}

var subreports = Form.getSubReports()

subreportObservers = Array(subreports.length)

subreports.
  forEach((report, reportIndex) => {
    subreportObservers[reportIndex] = 
      new MutationObserver(
        function (mutations, me) {
          // `mutations` is an array of mutations that occurred 
          // `me` is the MutationObserver instance 
          let hasData = report.rawDataSource; 
          if (hasData) {
            handleSubreport(report); 
            me.disconnect(); // stop observing. Otherwise, the observer will keep watching and executing handleDataArray infinitely
            return; 
          }
        }
      );
    subreportObservers[reportIndex].observe(document, {
      childList: true,
      subtree: true
      }
    );
  }
)

// Wrap around the default `RefreshSubReport` function to re-apply HTML scrubbing after refresh button is used.
Form.RefreshSubreport = (
  function() {
    let cached_function = Form.RefreshSubreport;
    return function() {
      subreportObservers.forEach(observer => {
        observer.disconnect();// disconnect each observer in case there are any still active
        observer.
          observe(document, // re-activate each observer to await reload of subreport
            {
              childList: true,
              subtree: true
            }
          );
      }
    )
      let result = cached_function.apply(this, arguments); // use .apply() to call it
      return result;
    };
  }
)();
```
### Function Arguments
|Argument       |Definition |Data Type|
|---            |---        |---      |
|first argument |The meaning of this input to the function|The type of data expected to go into the argument.|
|second argument|Tell what this argument should represent.|Default values should be mentioned here.|
|third argument |We should be able to clearly name each argument and define its use in a single sentence.|If an argument can take a variety of types, describe more fully in the implementation details.|


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
