/**
   * @function - validateEventTask by Matt Wills
   * @description - Identify if an event is scheduled already for a client, and the user is trying to add new instead of completing the event.
   * 
   * @param {object} [params] - The params
   * @param {string} [params.eventDefinitionId] - The eventID, defaults to the current eventID
   * @param {string} [params.peopleId] - The person to look for
   * 
   * @returns {boolean} - True if pass, False if fail.
   */
  validateEventTask: (params) => {
  // No DRY Library: 
  // const validateEventTask = (params) => {
      const {
          eventDefinitionId = eventID, 
          peopleId = parentValue || getFormElement('people_id'),
      } = params;

      // Bail if not ADD mode
      if (formAction !== 'ADD') return true;

      // Bail if we are completing the scheduled event.
      if (Form.formObject.isCompleteScheduledEvent) return true;

      // Ask the database if one exists
      const e2dId = getDataValue('events2do_view', 'people_id', peopleId, 'events2do_id', `event_definition_id = '${eventDefinitionId}' and is_completed = 0`);

      // Bail if there is no scheduled event that we should be completing.
      if (Util.isNullOrEmpty(e2dId)) return true;

      console.log('validateEventTask is returning false... the staff should be completing a scheduled event instead of whatever they are doing now.');
      return false;
  },
  // No DRY Library:
  // };

// Add this to your DRY Library (see How-To Guide) and call it from your After Load area of the form you want to check. 
// const isValid = MyDryLibrary.validateEventTask({});

// No DRY Library, call it like this from After Load:
// const isValid = validateEventTask({});

// After calling it, you can use the result to do something else!
// if (!isValid) Util.DisplayModal('This is some angry message to the user!');
