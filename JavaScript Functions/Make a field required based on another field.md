### What is this:
Using this if/then function you can make a field required based off the value of another field

### Code:
`Form.makeRequiredByColumn('attached_document');`<br><br>
`Form.makeUnRequiredByColumn('attached_document');`

Example of using getDataValue(); to evaluate a statment then an if/then to make the field either required or not required<br><br>
<code>if(getDataValue('client_personal_view', 'people_id', parentValue, 'age') >14) {{
    Form.makeRequiredByColumn('attached_document');
    }} else {{
    Form.makeUnRequiredByColumn('attached_document');
    }}</code>

### Details
The above code would go into the **On Load Script** box of the field that you'd like to be requried or not required. A variation of this code could be used in an **On Change** box of a field.
