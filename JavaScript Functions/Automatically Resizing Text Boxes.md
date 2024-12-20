### What You Want to Do:
Make one (or all) multi-line text boxes (narrative items in assessments or Remarks-formatted text fields) grow and shrink with the amount of text inside the box

### Code to Do It:
```javascript
// Use this for a single narrative assessment item. Supply the test_header_code and question_code from the specific test item.
getTestQuestionByCode(test_header_code, question_code).
  getField().
  addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    }, false);

// Use this for a single Remarks field on a form
Form.
  getFormLineByColumnName("generic_remarks").
  GetField().
  addEventListener('input', function () {
    this.classList.remove("auto-height")
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    }, false)

// Use this to apply auto-resizing to all narrative and remarks fields on the form at once.
document.
  querySelectorAll("textarea").
  forEach(el => {
    el.addEventListener('input', function () {
      el.style.height = el.scrollHeight + 'px';
      this.classList.remove("auto-height");
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }, false)
  }
)
```

### Implementation Details
1. Put the desired code in the form's After Load slot or a specific field's On Load slot.
2. In order to appropriately re-size text boxes while the form is loading, it may be necessary to use a MutationObserver to watch for the form's loading overlay to disappear before attempting to determine text box heights.


```js
var observer = new MutationObserver(function (mutations, me) {
  // `mutations` is an array of mutations that occurred 
  // `me` is the MutationObserver instance 
  if (!document.querySelector(".blockUI")) { // Run the following if the form loading overlay is gone
    document.
      querySelectorAll("textarea").
      forEach(el => {
        el.style.height = el.scrollHeight + 'px'; // immediately resize text boxes
        el.addEventListener('input', function () { // set text boxes to adjust with changes
          this.classList.remove("auto-height")
          this.style.height = 'auto';
          this.style.height = this.scrollHeight + 'px';
          }, false)
        }
      );
    me.disconnect(); // stop observing. Otherwise, the observer will keep watching and executing infinitely
    return; 
    } 
  }
);

// start observing
observer.observe(document, {
    childList: true,
    subtree: true
  }
);
```
   
### End-User Details
Each text box should maintain a default minimum size (about 5 lines of text), but if the text entered into the box exceeds the minimum height, the box will grow to fit and shrink if text is removed.

## Credits:
Gleefully stolen from [here](https://www.geeksforgeeks.org/how-to-create-auto-resize-textarea-using-javascript-jquery/)
