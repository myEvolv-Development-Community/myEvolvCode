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
    .forEach(column_index => 
      report_rows
      .forEach(row => 
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


### Implementation Details
1. This can be pasted directly into the form's After Load code slot, possibly with no modifications.

### End-User Details
This is intended to be used with [virtual view subreports that contain hyperlinks](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/SQL%20Views/Hyperlink%20to%20Editable%20Form%20(View).md), but could be used to remove any HTML tags from subreport memo columns (e.g., tags to make text *italic* or **bold**).

Subreports with columnd formatted as "Memo" fields will honor HTML formatting instructions included in the content of the field. In the example below, the Event column includes hyperlinks (`<a>` tags) which open an editable form when clicked.

![Subreport with Embedded Hyperlinks](assets/images/HTML%20Scrubbing%201.png)

However, when printed, the hyperlink is printed as plain text, resulting in a very ugly presentation.

![Subreport with Embedded Hyperlinks](assets/images/HTML%20Scrubbing%202.png)

After implementing the above code, the HTML formatting tags will be removed from the print view, but the hyperlink will remain in the editable form.

![Subreport with Embedded Hyperlinks](assets/images/HTML%20Scrubbing%203.png)
