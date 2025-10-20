## What You Want To Do:
Sometimes events in myEvolv need added security because they contain sensitive information. This could include discussion of the client's HIV status, pregnancy, substance use, or really anything the clinician feels requires a high degree of discretion. This tutorial will show you how to add very simple functionality to your form to allow clinicians to mark something as sensitive, and then hide it from everyone else. Plus, this is completely customizable, so you can adjust this to your specific agency's needs.

<video controls autoplay loop src="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/35e5b4eb6c80e9175c798ff5b79913005c5c4d59/How-To%20Guides/assets/images/sens_step2_done.mp4" title="assets/images/sens_step2_done.mp4"></video>

## How to Do It:
### 1. Get the template
A basic starting point is <a href="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/d4f05ac26635a78078fe3b68359a627124e4267a/How-To%20Guides/assets/images/blank_for_connections.json" target="_blank">available for download here</a>, but this should work for most forms. If you use this template above, import it. You'll find it in the Activities form family.

### 2. Add a checkbox to the form
I like to call mine `is_sensitive`, but it doesn't really matter so long as you stay consistent.

### 3. Get information about the user
We need to know who the user is and what level of access they should have. I tend to use a few different variables here:
- Are they a system administrator?
- Are they the event's original author?
- Are they the author's direct supervisor? (you could also check to see if they are the program-level supervisor, up to you.)

You can use `getSystemSettings()` to get informaiton about the user. Try navigating to the console (Right Click > Inspect) to see what it gives you.

You can also just use a simple `getDataValue()` call, but using too many of these will affect performance.

### 4. Implement user information
Let's implement this into the **On Click** event of your checkbox:
```js
const sys = getSystemSettings();
const userNav = sys.staff.securitySchemeId;

// Alternatively
// const userNav = getDataValue('staff_view', 'staff_id', workerID, 'security_scheme_id');

const isAdmin = userNav === 'a0ac472d-6feb-4d37-8c48-c6efcc5827b1';

const author = getFormElement('staff_id');
const isAuthor = workerID === author;

const authorSup = getDataValue('staff_view', 'staff_id', author, 'supervisor_id');

// const variableName = condition ? ifTrue : ifFalse;
const isAuthorSup = typeof authorSup === 'string' ? workerID === authorSup.toLowerCase() : false;

console.log({isAdmin, isAuthor, isAuthorSup}); // Totally optional to keep this.
```

### 5. Add code to After Load
We want the On Click event to fire off when the form is loaded as well, so we need to add a relay to an area that executes automatically. I prefer to use After Load, but there are other areas that would work as well. Another quick note, we don't necessarily want to copy and paste the *entire* code to After Load, because that would be duplication. So what we can do is reference the On Click code, and execute it remotely.

**Add this to After Load:**
```js
const formLine = Form.getFormLineByColumnName('is_sensitive');
eval(formLine.onclickEvent);
```

### 6. Get form information
We need to know a few things about the form:
- If the form is marked sensitive or not.
- Where we want to append a mildly aggressive message.

#### Get the checkbox state
Netsmart has a built-in function for this called `isChecked()`, and we'll utilize this. `isChecked()` takes a single parameter, which is the `columnName`, and will return `true` or `false`.
```js
const isSensitive = isChecked('is_sensitive');
```

#### Where to append a sassy message?
We want to make sure we create a positive feedback loop for the user, so that the form responds to them clicking the `is_sensitive` checkbox. Something that says, "Hey, you just clicked this box. Here's what's about to happen."

**Here are some possible positions for this message:**
<video controls autoplay loop src="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/35e5b4eb6c80e9175c798ff5b79913005c5c4d59/How-To%20Guides/assets/images/append_positions.mp4" title="assets/images/append_positions.mp4"></video>

### 7. Consider the logic
We need the form to behave in a certain way, and have different states for what it should do:
- The event is sensitive, and the user is not permitted to view it.
- The event is sensitive, and the user is permitted to view it.
- The event is not sensitive.

#### When the event is sensitive, and the user is not permitted
In this case, we'd want to empty the form contents, empty the backend meta data, and provide them with a message that lets them know why myEvolv isn't behaving as they expected, otherwise, they might get confused.

To empty the form contents:
```js
// Not permitted, empty form.
$('#form-content').empty();
Form.formObject.FormLines = [];
```

To provide a sassy message, we'll use `Util.DisplayModal()` and provide it an HTML message, a boolean variable for `isConfirm`, and two callback functions (one for OK and one for CANCEL).
```js
// Util.DisplayModal(message, isConfirm, okCallBack, cancelCallback)
Util.DisplayModal(
    `<p style="max-width: 500px;">This ${Form.formObject.formName} has been marked sensitive by the author. You are not permitted to view it's contents. Please contact the author for more information.</p>`, 
    
    true, // Must be true for callbacks to work.
    
    () => {
        getRadWindow().close();
    },
    
    () => getRadWindow().close()
);
```

#### When the event is sensitive, and the user is permitted
In this case, we just want to let the user know that they shouldn't share the contents of the form (or whatever other language you want to use for legal purposes).
```js
$('#right-content-wrapper-id').prepend(`
    <div id="sensitive-warning" style="font-weight: 700; color: red; font-size: 20px;">
        Some delightfully scary message to instill fear in the user.
    </div>
`);
```

### When the event is not sensitive
At this point, nothing special should happen. We'll just remove anything special we already created. Note that the `id` attribute of the element created above is the same referenced below in jQuery.
```js
$('#sensitive-warning').remove();
```

### 8. Implement form information
Add all this at the *bottom* of what we already have in our **On Click** event on the `is_sensitive` checkbox:
```js
const isSensitive = isChecked('is_sensitive');

// Make magic happen
if (isSensitive && !isAuthor && !isAuthorSup && !isAdmin) {
    // Not permitted, empty form.
    $('#form-content').empty();
    Form.formObject.FormLines = [];
    
    Util.DisplayModal(
        `<p style="max-width: 500px;">This ${Form.formObject.formName} has been marked sensitive by the author. You are not permitted to view it's contents. Please contact the author for more information.</p>`, 
        true,
        () => getRadWindow().close(),
        () => getRadWindow().close()
    );
    
} else if (isSensitive) {
    // Permitted, but still sensitive.
    $('#right-content-wrapper-id').prepend(`
        <div id="sensitive-warning" style="font-weight: 700; color: red; font-size: 20px;">
            Hey, this is a sensitive event. Don't blast this info all over Reddit.
        </div>
    `);
    
} else {
    // Not sensitive, remove warning.
    $('#sensitive-warning').remove();
}
```

### 9. Test
<video controls autoplay loop src="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/35e5b4eb6c80e9175c798ff5b79913005c5c4d59/How-To%20Guides/assets/images/sens_step2_done.mp4" title="assets/images/sens_step2_done.mp4"></video>

### 10. Improvements
You could consider making things pretty with colors and other UI elements to really embolden that positive feedback loop for the user. I also suggest implementing the sensitive code into a <a href="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/64e19b6bb5e275c8db53bcfab46d1f2e8ffce7b7/How-To%20Guides/Make%20a%20DRY%20Function%20Library.md" target="_blank">DRY Library</a> to avoid repetition.
<video controls autoplay loop src="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/35e5b4eb6c80e9175c798ff5b79913005c5c4d59/How-To%20Guides/assets/images/sensitive_final_with_other_user.mp4" title="Final"></video>

## Final template that you can import into your system
<a href="https://github.com/myEvolv-Development-Community/myEvolvCode/blob/64e19b6bb5e275c8db53bcfab46d1f2e8ffce7b7/How-To%20Guides/assets/exports/sensitive_final_export.json" target="_blank">Click here to download the finished product.</a>