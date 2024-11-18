### What You Want To Do:
While working in one form or treatment plan component, this article will show how to obtain information from subform entries or another treatment plan component. This is similar to the [`querySubform` functionality](), but uses the same `getFormElement` function that we would normally use in forms.

## Introduction

While working with myEvolv forms, it is common practice to use the Netsmart-supplied `getFormElement` function to retrieve the value entered into a form field. The function's first argument is the column name that corresponds to the form field. For example, `getFormElement("actual_date")` will retrieve the date that an event took place. `getFormElement` actually accepts two arguments, a column name and a form object. The form object is assumed to be the current form if the second argument is left undefined, but a form object can be manually supplied. Therefore,

 - `getFormElement("actual_date")`,
 - `getFormElement("actual_date", undefined)`, and
 - `getFormElement("actual_date", Form.formObject)`

all return the same result and operate equivalently. 

`Form.formObject` is a JavaScript representation of the data currently on the form. Crucially, `getFormElement` only looks for the second argument (if it is not `undefined`) to be an object with a `FormLines` property, an array which represents the list of fields on the form (each with at least a `columnName` and `value` property.

We can supply any suitable form object as the second argument, such as 

```js
let fakeFormObject = {FormLines : [{'columnName' : 'fake_column', 'value': 'fake output'}]}
getFormElement("fake_column", fakeFormObject) // yields 'fake output'
```

## Working with Subforms

Subforms, as their name implies, are forms embedded within a parent form. Each subform takes up one form line in the parent form and that form line has an `sfValue` property which acts an array of form objects, one per row of the subform. 

For example, consider the following subform of referral statuses.


![A subform of referral statuses. Two statuses are accepted, others pending, and one is withdrawn.](/How-To%20Guides/assets/images/Subform%20Example.png "A subform of referral statuses. Some statuses are accepted, others pending, and one is withdrawn.")

This client was referred to a program with an initial Pending status and was later Accepted. The referral was withdrawn when the client did not show for the initial appointnment. The following week, the client asked for a new appointment and the status changed to Pending again, and later finally Accepted.

### Query all subform rows

We could get all the status dates for entries in this subform by applying `getFormElement` to each entry in `sfValue` as follows:

```js
Form.getFormLineByCaption("Status of the Referral")
  .sfValue
  .map(row => getFormElement('actual_date', row))
// yields the following array: ['2019/04/25 11:34:00', '2019/04/25 11:35:00', '2019/04/25 18:46:00', '2019/05/01 08:00:00', '2019/05/01 14:00:00', '']
```

### Find one value from the subform

We could also search for a row that meets some qualifying criterion and return only one value for that row. For example, searching for a date the referral was accepted, we could do:

```js
let accepted = getDataValue("oc_status", "description", "Accepted", "oc_status_id").toLowerCase() // Find the GUID associated with an Accepted status. Done here so we only run getDataValue once
let queryFunction = row => getFormElement("oc_status_id", row).toLowerCase() == accepted // Define a function that tests whether the status of each row is Accepted
let acceptedRow = Form.getFormLineByCaption("Status of the Referral") // Find one row with an Accepted status
  .sfValue
  .find(queryFunction)
getFormElement('actual_date', acceptedRow) // Apply getFormElement to that one row.
// yields a single date: '2019/04/25 11:35:00'
```
_Note that there is no guarantee that the row found is the earliest or latest event, it is only the first one encountered._

### Filter result by the value of another column

If we wanted to get just the subset of rows with an Accepted status, e.g., to then get a count or to specifically search for the earliest record, we can use the following:

```js
let accepted = getDataValue("oc_status", "description", "Accepted", "oc_status_id").toLowerCase()
let queryFunction = row => getFormElement("oc_status_id", row).toLowerCase() == accepted ? getFormElement("actual_date", row) : []
Form.getFormLineByCaption("Status of the Referral")
    .sfValue
    .flatMap(queryFunction)
// returns two Accepted dates: ['2019/04/25 11:35:00', '2019/05/01 14:00:00']
```

## Working with Treatment Plan Components

Although Treatment Plans look more like typical forms, they actually share a key commonality with subforms in that both contain collections of forms. In Treatment Plans, each component is a form, and the components are listed out in the navigation list on the left side of the window.

![A list of Treatment Plan components, including Information, Completed Information, Current Disposition, Goals, Objectives, and Interventions. Information is highlighted in green and Completed Information is highlighted in orange.](/How-To%20Guides/assets/images/Treatment%20Plan%20Component%20List.png "A list of Treatment Plan components, including Information, Completed Information, Current Disposition, Goals, Objectives, and Interventions. Information is highlighted in green and Completed Information is highlighted in orange.")

Each component is held in an array that can be accessed by calling `parent.TreeView`. Each entry in `parent.TreeView` may contain a form object under `Parameters.FormObject`.

For example, if the first component in the `TreeView` contains an `actual_date` field, we can reference that vield value with

```js
getFormElement("actual_date", 
  parent
    .TreeView[0]
    .Parameters
    .FormObject
  )
```

One major limitation to getting data across Treatment Plan components is that `TreeView` only loads form information as needed. Until a component is visited, the `FormObject` under `Parameters` does not exist. When the user navigates to a component (e.g., by clicking on the component in the list), the corresponding form is retrieved and the `FormObject` is created. Unvisited (and unpopulated) components appear in dark grey. Once a component is opened, the text color changes to green and changes again to orange if information in the form is modified. Because of this lazy loading, there is no guarantee that any component will be accessible with `getFormElement` except the very first component at the top of the list (`parent.TreeView[0]`), which loads whenever the plan is opened. 

_All plan components can be forced to load by calling `parent.TreatmentPlan.ValidateComponents()`, but this is a time-consuming process and will check whether all required fields on every component are completed and will display a warning message if they are not._

### Search all components for a field value

We can search all currently populated components for a field using the following:

```js
parent 
  .TreeView
  .map(component => // Look through all components 
    getFormElement( // Look for an actual_date field on the component
      "actual_date",
      component
        .Parameters
        ?.FormObject // Use the optional chaining operator to pass the FormObject property if it exists
      )
    )
```

We can further refine this search to filter out null results by replacing `map` with `flatMap`

```js
parent 
  .TreeView
  .flatMap(component => // Look through all components 
    getFormElement( // Look for an actual_date field on the component
      "actual_date",
      component
        .Parameters
        ?.FormObject // Use the optional chaining operator to pass the FormObject property if it exists
      ) ?? [] // If the result is null, return an empty array that flatMap will drop from the result
    )
```

The results of these operations can also be filtered or subsetted using `find`, `filter`, and indexes (e.g., `[0]`).
