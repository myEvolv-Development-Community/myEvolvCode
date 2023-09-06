### The Problem:
There will probably get to a point in your myEvolv development where you end up having the same function copied and pasted to many different places in your system. Or, maybe you have a cheatsheet of codes you use in many places. The problem with this is when you have to make changes to the code, you'd have to go through every form and update each one individually - which is time consuming, to say the least.

### What You Want to Do:
Our solution is the DRY principle, or "Don't Repeat Yourself." The DRY principle emphasizes the idea of reusability and aims to reduce repitition in code, and results in you only having to makes changes in one place instead of several.

### How to do this, step-by-step:
1. Create an obscure form somewhere.
2. Create a variable on the form.
4. Write the scripting you want available across the system.
5. Add the helper script to any form you want to bring in your function library.
6. Open the form on the front end, test that your new global object works.

There are some example functions at the end of this guide, too.

### Step 1: Create an obscure form:
I say obscure, because it doesn't really matter where you put it, you'll never use it on the front end. However, you'll probably want it stashed out of the way to prevent accidental changes. I chose to make a form called "Script Master" in the **Materials Provided** form family. Again, doesn't matter a whole lot. ==Just take note of what you make the form code==. I'll use "script_master_form" for my form code. When you copy a form in the family that already exists, you can remove all of the fields that come with it - we won't need any of them. (==Just remember to make sure you're selected on your *new* form after the copy==, so you don't make accidental changes to the existing form like I have mistakenly done many, many, *many* times...)

### Step 2: Create a variable:
On your new form, create a variable ( It has the **</>** icon ) and call it whatever you want. The caption doesn't matter much, but the variable name does, remember what you name that. I'm going to call mine `script_master`

### Step 3: Add some code:
## Set the stage
In your variable, we need a place to add our function library. I've been using `On Click` out of habit, but any of them besides *On Load* should work fine (*On Load* has a character limit). First thing we're going to do is add a try/catch wrapper, *just in case*:
```javascript
try {

} catch (error) {
    // error returned is a string. Log it to the console.
    console.error(error);
}
```

## The general concept
The way this will work is we are going to define a library underneath a JSON object and store it in the `window` when we load a form. That way it can be accessed anywhere on the form without being defined. **Note:** We *aren't* going to use `window.top` here because we want the function library to refresh with every form refresh.

Objects like this are generally defined with a capital letter. You can pick whatever name you want, but try and avoid some obvious ones like "System" and "Form" and "Netsmart", etc. I have used the name of my organization before, that way I know my object name unique. So if my organization's name is "Human Services, LLC", I might call my object "Human." For this tutorial, I'm going to go with "Example."

## Add your object
Add this code *within* the `try` statement:
```javascript
try {
    const Example = { // <-- Curly bracket denotes a JSON Object starting
        
    }; // <-- Other curly bracket denotes a JSON Object ending
}
// ...
```

### Step 4: Define our function library
Now we can define the codes we want to use in multiple places. There are plenty of them available on this GitHub repository that would fit well into this model, such as [Subform Manipulation 2](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/5fb04f809915cdc6536424ea7da2ab3227a47dd6/JavaScript%20Functions/Subform%20Manipulation%202.md) and [Launch an Event](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/5fb04f809915cdc6536424ea7da2ab3227a47dd6/JavaScript%20Functions/Launch%20an%20Event.md).

Let's add some basic examples:
- A basic function structure
- A function to trigger an alert
- A function to add an array of numbers together

```javascript
    const Example = {
        // Basic function structure
        myFunctionName: function (parameterOne, parameterTwo, etc) {
            // Stuff my function does.
            return;
        }, // <--- This is a comma, not a semi-colon

        // A simple alert function.
        sendMessageToUser: function(aReallyCoolMessage) {
            alert(aReallyCoolMessage);
            console.log('A really cool message was just sent to the user:', aReallyCoolMessage);
            return;
        },

        // ADD-itional example
        additionalExample: function (arrayOfNumbers) {
            let sum = 0;

            arrayOfNumbers.forEach((number) => {
                sum += number;
                console.log(`Adding ${number} to ${sum}!`);
            });

            console.log('The total sum:', sum);

            return sum;
        }
    };
```

## Add object to window
In browsers the `window` object contains information about your session, and we're going to store our library there temporarily when we access a form in myEvolv. To make sure this happens, we need to add the following to the end of our `try` statement:
```javascript
window.Example = Example;
```

Our final script looks like this:
```javascript
try {
    // Define library
    const Example = {
        // Basic function structure
        myFunctionName: function (parameterOne, parameterTwo, etc) {
            // Stuff my function does.
            return;
        }, // <--- This is a comma, not a semi-colon

        // A simple alert function.
        sendMessageToUser: function(aReallyCoolMessage) {
            alert(aReallyCoolMessage);
            console.log('A really cool message was just sent to the user:', aReallyCoolMessage);
            return;
        },

        // ADD-itional example
        additionalExample: function (arrayOfNumbers) {
            let sum = 0;

            arrayOfNumbers.forEach((number) => {
                sum += number;
                console.log(`Adding ${number} to ${sum}!`);
            });

            console.log('The total sum:', sum);

            return sum;
        }
    };

    // Add object to window.
    window.Example = Example;
} catch (error) {
    console.error(error);
}
```

**Side note:** Another way to do this would be to *define* and *add* the library to the window object at the same time, like this:
```javascript
window.Example = {
    function1: function() {
        // stuff
    },
    function2: function() {
        // stuff
    },
    // -- etc -- //
}
```

I don't opt for this more as a personal preference, I like to see things happening in separate steps in this case.

### Step 5: 
The only thing that is actually happening in the script above, is our object of functions is being added to the window. Now let's switch gears and add the helper script to any form where we want the system to actually do that. Once the object is in the in the window, we will be able to access our functions anywhere we want.

On a front-facing form, such as a "Therapy" service entry, we need to create a *hidden* variable at the very **top** of the form to store the small script that grabs our library. We're using a variable here because we don't actually need myEvolv to store any information from here in the database, so using a *Field* or *Event Log Field* is unnecessary. Name the variable whatever you want, I'll call this example one "script_library_loader". In this new variable, add the following script to the **On Load** property.

```javascript
const addToWindow = getDataValue('form_view', 'form_code', 'my_clever_form_code', 'onclick_event', 'column_name = "my_variable_columnName"');
eval(addToWindow);
```

Here's a breakdown:
- `form_view` is the table in the database we're using to access our script library form.
- `form_code` notates to myEvolv how we'd like to look up our form.
- `my_clever_form_code` is our clever form code we used in step 1.
- `onclick_event` is where our library lives on the variable on that form. If you used a different code property, it will be something different like `onchange_event`.
- `column_name = "my_variable_columnName"` filters the results down to the column where we added our library.
- `eval` = executes the actual process of adding it to the window.

This is what my example code should look like:
```javascript
const addToWindow = getDataValue('form_view', 'form_code', 'script_master_form', 'onclick_event', 'column_name = "script_master"');
eval(addToWindow);
```

## A warning about eval
== eval() can be dangerous ==
**NEVER** execute code through eval that the end user can influence. For example, this is **BAD**:
```javascript
// On change:
const usersInput = getFormElement('udf_string_one');
eval(`alert(${usersInput})`);
```

That type of usage opens up security risks to your system. However, the type of usage below is generally okay, since the data being sent to eval() is only controlled by *you*:
```javascript
const constantScriptingThatNeverChanges = getDataValue('form_view', 'form_code', 'script_master_form', 'onclick_event', 'column_name = "script_master"');
eval(constantScriptingThatNeverChanges);
```

Once the script library is in the window, it's okay to send user input to one of your library functions, as we'll describe below.

### Step 6: Test our work!
While you're on the front-facing form, let's use one of our example scripts from our library. I'm going to call our addition example in the *After Load* form property:
```javascript
Example.additionalExample([1, 2, 3, 4, 5]);
```

And our expected output from this function in the console:
```
Adding 1 to 0!
Adding 2 to 1!
Adding 3 to 3!
Adding 4 to 6!
Adding 5 to 10!
The total sum: 15
```

## What just happened?
Let's recap: We have our addition function `Example.additionalExample()` located somewhere else in the system, but it's being loaded into our form by our eval script in that `script_library_loader` variable we created. On Load script are first to fire off when loading a form, so when we get to After Load (which is last), we can use the `Example.additionalExample()` function to add our numbers.

### Final Considerations
Now let's say we add our `Example.additionalExample()` script to multiple forms, all over our system... but we want to add a validation check to make sure that the array provided is not 0 and is indeed an array (as opposed to a string). Instead of going through all of our forms individually, we can simply update the source function in our `script_master_form` form, and everything will update automatically. Give it a try:
```javascript
additionalExample: function (arrayOfNumbers) {
    // New code
    if (!Array.isArray(arrayOfNumbers) || arrayOfNumbers.length === 0) {
        console.error('additionalExample() was provided an invalid array of numbers!');
        return;
    }
    
    // Existing code
    let sum = 0;
    arrayOfNumbers.forEach((number) => {
        sum += number;
        console.log(`Adding ${number} to ${sum}!`);
    });
    console.log('The total sum:', sum);
    return sum;
}
```

Now, if you throw `Example.additionalExample('some string')` into After Load, you should receive the error we added in the console instead of math.

**Pro tip:** Did you notice in my new example that I stated the name of the function in the beginning of the error message? This is a good practice to get in the habit of, it will make troubleshooting your forms and scripts *much* easier.

### Additional Examples
```javascript
const someExamples = {
    
    // Open Help Desk //
    launchHelpDesk: function() {
        const left = (screen.width/2)-512;
        const top = (screen.height/2)-384;
        window.open(
            'https://intranet.myagency.com/myhelpdeskendpoint/'
            , 'Help Desk'
            , 'width=1024, height=768, top='+top+', left='+left
        );
    },

    // Get the Top Window, used for finding breadcrumbs. //
    getTopWindow: function() {
        let win = window.self;
        let count = 0;
        do {
            if (win !== window.top) {
                win = win.parent;
                count++;
            }
        }
        while (win !== window.top);
        someExamples.throw('info', `Returning top window in ${count} steps...`);
        return win;
    },
    

    // Get the breadcrumb of the user's current location //
    getBreadcrumb: function() {
        try {
            const top = someExamples.getTopWindow();
            const bc = top.document.getElementById('bread-crumb-id');
            const list = [];
            $(bc).find('button.crumb-select').each((i, li) => {
                list.push($(li).text());
            });
            return list.length > 0 ? list.join(" > ") : null;
        } catch (err) {
            // Throw message to console, but not user - it's not important for them.
            someExamples.throw('warning', `Could not get breadcrumb because "${err}", returning null.`);
            return err;
        }
    },

    // Throw a styled message to both the console and (optionally) the user.
    throw: function (type, message, modalProperties, level) {
        // Usage:
        /*
            someExamples('error', 'This is an error message!', {isConfirm: false}, 0)

            type: a keyword to trigger the style/functionality I want.
            message: the content presented in the console/user.
            modalProperties: object of different modal parameters. 
                (At least 1 is required if you want the user to see it, set null to not show a modal)
            level: optionally nest messages in the console, example:
                "
                A parent message, level 0 or null.
                - This is level 1
                -- This is level 2
                --- This is level 3
                "
        */
        
        // Set color by provided type keyword.
        let color;
        switch (type.toLowerCase()) {
            case 'error':
                color = 'red';
                break;
            case 'stop':
                color = 'red';
                break;
            case 'warning':
                color = 'orange';
                break;
            case 'action':
                color = 'cyan';
                break;
            case 'success':
                color = 'limegreen';
                break;
            case 'info':
                color = 'gray';
                break;
            default:
                // Default myEvolv color
                color = '#003a5d';
                break;
        }
        
        // Set an icon based on the type, using the font-awesome library. (Netsmart uses this library in their source code.)
        let icon;
        switch (type.toLowerCase()) {
            case 'error':
                icon = 'fa-bug';
                break;
            case 'stop':
                icon = 'fa-times-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            case 'action':
                icon = 'fa-running';
                break;
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'info':
                icon = 'fa-info-circle';
                break;
            default:
                icon = 'fa-question-circle';
                break;
        }
        
        // Set title based on type //
        const title = (Util.isNullOrEmpty(type)) ? '' : type.toUpperCase();
        
        // Format level prefix //
        let printedLevel = '';

        for(let l = 0; l < level; l++) {
            printedLevel += '-';
        }

        // Send console.log //
        // Optionally, you could use an if/then to do console.warn or console.error based on type //
        console.log(`%c${level} ${type !== '' ? title + ":" : ''} ${message}`, `font-size: 12px; color: ${color}; font-weight: 900;`);
        
        // Handle modal execution //
        if (!Util.isNullOrEmpty(modalProperties)) {
            console.log(`%c>> Sending ${type} Modal <<`, 'font-size: 14px; color: magenta; font-weight: 900;');
            const modal = {
                isConfirm: modalProperties.isConfirm, // true/false
                confirmFn: (Util.isNullOrEmpty(modalProperties.confirmFn)) ? null : function() {
                    modalProperties.confirmFn();
                },
                cancelFn: (Util.isNullOrEmpty(modalProperties.cancelFn)) ? null : function() {
                    modalProperties.cancelFn();
                },
                title:      (Util.isNullOrEmpty(modalProperties.title))     ? title  : modalProperties.title,
                icon:       (Util.isNullOrEmpty(modalProperties.icon))      ? icon  : modalProperties.icon,
                customIcon: (Util.isNullOrEmpty(modalProperties.customIcon))? null  : modalProperties.customIcon,
                color:      (Util.isNullOrEmpty(modalProperties.color))     ? color : modalProperties.color,
            };
            
            // Define the HTML used for additional error instructions //
            let err = `
                        <div style="margin-top: 1em; max-width: 612px;">
                            <span>If something seems wrong and you need support, please submit a </span>
                            <a href="#" onclick="someExamples.launchHelpDesk()" style="font-weight: 700; color: blue;">Netsmart Helpdesk Ticket</a>
                            <span> with a </span>
                            <a href="https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b" target="_blank" style="font-weight: 700; color: blue;">screenshot</a>
                            <span> of this error message.</span>
                        </div>
                    `;
            
            // Grab the breadcrumb using our function above. //
            let breadcrumb = someExamples.getBreadcrumb();
            
            Util.DisplayModal(
                `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    ">
                        <div style="
                            color: ${modal.color};
                            font-size: 44px;
                            font-weight: 500;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            gap: 0.5em;
                            margin-bottom: 0.5em;
                        ">
                            ${Util.isNullOrEmpty(modal.customIcon) ? `<i class="fa ${modal.icon}"></i>` : modal.customIcon}
                            <span>${modal.title}</span>
                        </div>
                        <div style="
                            max-width: 400px;
                            font-weight: 500;
                            font-size: 1.15em;
                            text-align: center;
                            padding: 1em;
                            border: 2px dashed ${type.toLowerCase() === 'error' ? 'red' : '#16526D'};
                            box-shadow: 0 0 20px #0000001c;
                            background: whitesmoke;
                        ">
                            ${message}
                        </div>
                        ${type.toLowerCase() !== 'error' ? '' : `
                            ${Util.isNullOrEmpty(breadcrumb) ? '' : `
                                <div style="
                                    font-size: 0.75em;
                                    color: dimgray;
                                    padding: 0.1em;
                                    margin-top: 1em;
                                ">B: ${breadcrumb}</div>
                            `}
                            ${Form.formObject.moduleCode !== 'CLIENTS' ? '' : `
                                <div style="
                                    font-size: 0.75em;
                                    color: dimgray;
                                    padding: 0.1em;
                                ">C: ${parentValue}</div>
                            `}
                            <div style="
                                font-size: 0.75em;
                                color: dimgray;
                                padding: 0.1em;
                            ">E: ${Form.formObject.EventDefinition.event_name} | F: ${Form.formObject.formName}</div>
                            ${err}
                        `}
                        ${modal.isConfirm ? '<br>Do you wish to continue?' : ''}
                    </div>
                `
                , modal.isConfirm
                , modal.isConfirm ? modal.confirmFn : null
                , modal.isConfirm ? modal.cancelFn : null
            );
        }
    },

    // Pull in git hub files and execute them! //
    importGitHubFile: (filePath, execute) => {
        // Define your personal access token. GitHub has a how-to article on generating this.
        const token = 'abc_yourTokenHere0123456789abcdefghijklm';
        
        // Add file path in the repo, which should be something like "/a-cool-folder/anAwesomeScript.js"
        fetch(`https://api.github.com/repos/Your-Agency-Name${filePath}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })

        // extract json from fetch response
        .then(response => response.json())

        // decode file content
        .then(file => atob(file.content))

        // if execute parameter is supplied with a truthy value, it will use eval() to run the code.
        .then(content => { 
            if (execute) {
                // Reminder: use eval() responsibly and with security in mind!
                return eval(content);
            }
        });
    },
}
```