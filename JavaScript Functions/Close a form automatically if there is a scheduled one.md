### What You Want to Do:
I basically stole <a href="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/How-To%20Guides/How%20to%20Make%20a%20Sensitive%20Event.md" target="_blank">Matt Will's is_sensitive concept</a> and iterated on his <a href="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/main/JavaScript%20Functions/validateEventTask.js" target="_blank">validate event task function</a> to automatically check if a an event that a staff is trying to enter is already scheduled for the client. If it is, a pop-up window tells them this then the form closes. 

### Code to Do It:
```javascript
const schedED = getDataValue('events2do', 'event_definition_id', eventID, 'is_completed', 'is_completed = 0 and people_id ='+ parentValue, 'due_date, scheduled_date DESC'); 
        //true means one was scheduled and has been completed- they can enter a new form
        //false means there is one scheduled and not completed - they cannot enter a new form
        //null means there is not one scheduled- they can enter a new form 
    const isScedEvent = Form.formObject.isCompleteScheduledEvent;
        //ture this is a scheduled event
        //undefined not a scheduled event
    
    if (formMode === 'ADD' && isScedEvent !== true && schedED === 'false') {
      // Not permitted, empty form.
      $('#form-content').empty();
      Form.formObject.FormLines = [];
    
      Util.DisplayModal(
          `<p style="max-width: 500px;">This ${Form.formObject.formName} has a scheduled task, please complete this task.</p>`, 
          true,
          () => getRadWindow().close(),
          () => getRadWindow().close()
    );
    
             }
```

### Implementation Details
1. Put this into the After Load box on your form, or set it up in your DRY library


## Credits:
Matt came up with the bones, I applied it to this concept. 

