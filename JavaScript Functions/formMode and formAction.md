### What is this:
These are some functions that you can use in collaboration with various JavaScript formulas to trigger actions in the form only when the formMode or formAction is met.  

### Code:
This formula will set the staff_id on the form as the current worker's staff ID if they are editing the form<br>
`if (formAction == 'EDIT'){{setFormElement('staff_id', workerID);}} ;`<br><br>
Other terms that can be used are: 'COMPLETE', 'DELETE'<br><br>

This formula will clear out the actual_date of the form when it is being freshly added<br>
`if (formMode == 'ADD' ) {{setFormElement('actual_date','');}}`

### Details
Please add any other Actions/Modes that are possible/helpful
