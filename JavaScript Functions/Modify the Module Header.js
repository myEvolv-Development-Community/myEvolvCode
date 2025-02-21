/** Use caution when using this! (Definitely a DEV kind of script!) */
/** You need to put this on a form that loads in order for it to work. So it works best
    if you force the users through a specific formset member that loads this form first
    before they navigate elsewhere in the module.

    Also note: this might need to be reapplied if the module header reloads (which it often does)
*/

/** 1. Add a hidden variable to the form. (i.e. my_variable_name) */
/** 2. Add this to the On Load script of that variable: */
const f = Form.getFormLineByColumnName('my_variable_name');
eval(f.onclickEvent);

/** 3. Add this to the On Click script of that same variable: */

// In my case, I'm making the header have some styling if the user is an administrator, or, hide it.
let isAllIncidents = Util.parseBoolean(getDataValue('staff', 'staff_id', workerID, 'is_all_incidents'));
let isAdmin = Admin.getIsAdmin();

// Identify the module header (this will vary by module)
let $searchHeader = window.top.$('#rpnModHeaderINCIDENT');
if ($searchHeader.length > 0) {
    if (!isAdmin && !isAllIncidents) {
        console.log('Hiding search header.');
        $searchHeader.hide();
    } else {
        console.log('User is admin or has access to all incidents, not hiding header.');

        // Some fancy styling
        $searchHeader.show().css('border', '3px dashed red');

        // Add a label (or some other content) to the header.
        let $adminHeader = $('#admin-mode-header');
        if ($adminHeader.length === 0) {
            // If label doesn't already exist (we don't want duplicates), add it.
            $adminHeader = $('<div>')
                .attr('id', 'admin-mode-header')
                .css({
                    fontWeight: '500',
                    fontSize: '22px',
                    position: 'absolute',
                    left: '40%',
                    color: 'red',
                })
                .text('Administrator Mode');
            $searchHeader.prepend($adminHeader);
        }
    }
} else {
    console.error('Could not find the search header to hide it.');
}
