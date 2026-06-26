/**
 * @function date.getDaysBetween
 * @description Get the number of days between two dates.
 * 
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {number} - The number of days between the two dates.
 * 
 * @example
 * const startDate = new Date('2022-01-01T00:00:00');
 * const endDate = new Date('2022-01-03T00:00:00');
 * const days = Global.date.getDaysBetween(startDate, endDate);
 * console.log(days); // 2
 */
getDaysBetween: function (startDate, endDate) {
    // Validate
    if (Util.isNullOrEmpty(startDate) || Util.isNullOrEmpty(endDate)) {
        console.error(
            'getDaysBetween could not execute because a parameter was missing! Returning null.'
        );
        return null;
    }

    // Calculate
    let diff = (endDate.getTime() - startDate.getTime()) / 1000;
    diff /= 60 * 60 * 24;
    return Math.abs(Math.round(diff));
},
