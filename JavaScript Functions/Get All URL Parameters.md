### What You Want to Do:
Retrieve all parameters or variables from the URL (web address) of a form.

### Code to Do It:
```javascript
var parameters = Object.fromEntries(
  parent.
    location.
    href.
    match(/(?<=\?).*/)[0].
    split("&").
    map(param => param.split("="))
)
```


### End-User Details
Whenever myEvolv opens a form, that form and the specific record have a unique URL that is used to query the database and retrieve the relevant information. These URLs use a query string that looks like: 

`https://myevolvagencyxb.netsmartcloud.com/Form.aspx?defaultForm=9266c9f2-6f2b-44e4-9ab9-99176afb82ee&fsm=5d3bf42a-5e0d-4553-bd9b-e245904d868c&...nocache=0.7373015012569766&defaultFormEvents2Do=#!`

The query starts with a `?` and includes a list of `key=value` pairs, each separated with `&`. This query then populates a lot of the variables we typically work with in forms, such as `keyValue` and `parentValue`. 

The code above interprets that URL string and creates an object, called `parameters` with each of the URL parameters as its properties. Therefore, we could extract the `defaultForm` value with `parameters.defaultForm`

If we are constructing the URL ourselves, we can also add variables to the query by inserting them into the URL before the `#!` that signals the end of the query.

For example, we could insert `&favorite_flavor=strawberry` into the URL, and later use `parameters.favorite_flavor` to get a value of `'strawberry'`
 

### To-Do
If there is a known issue or edge case still to work out, describe it here.
