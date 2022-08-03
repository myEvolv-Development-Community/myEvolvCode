### What You Want To Do:
Determine whether two more more sets of dates overlap. For example, does a service fall within the span of a particular program modifier, benefit assignment, or other program enrollment?

### How to Do It:
First, note that the vast majority of events have a listing in the `event_log`, so queries will often visit that table multiple times. We will treat each event as a time interval with a defined start time (`actual_date`) and end time (`end_date`).

Two time intervals overlap if they each **begin before the other interval ends.**

For example, consider the following sets of dates. Suppose we want to know which events overlap with Event A. For example, Event A might be a program enrollment and events B through F are diagnoses on file for the client - we might want to know which diagnoses were known and active during the enrollment. 

Event A is highlighted and runs from May to August. Events B, C, and D overlap event A (and vice versa). Events E and F fall outside of Event A's range. Note, however, Events B and C *do not* overlap with each other.

![A set of date ranges](assets/images/Date%20Intervals%201.svg "A set of date ranges. The time covered by one event is highlighted, and some ranges overlap this interval.")

*Figure 1.* Example date ranges. 

The relevant comparisons to make are to compare Event A's `actual_date` to the other events' `end_date`s and to compare the other events' `actual_date`s to Event A's `end_date`.

![A set of date ranges with reference lines for comparisons.](assets/images/Date%20Intervals%203.svg "A set of date ranges. Dashed lines connect Event A's actual date to other events' end dates and solid lines connect Event A's end date to other events' actual dates.")

*Figure 2.* Connecting the start and end times.

In SQL, this comparison looks like:

```sql
WHERE
  first_event_log.actual_date <= second_event_log.end_date
  and second_event_log.actual_date <= first_event_log.end_date 
```
*N.B.* Use meaningful aliases for each table to help with later updates.

## Ongoing Events

Sometimes we do not know when the event starts or ends. This happens most often when the event is still in progress (e.g., a current program enrollment) and no end date is provided. In these cases, we can use `isnull` to substitute a default value for the null,

```sql
WHERE
  first_event_log.actual_date <= isnull(second_event_log.end_date, '9999-12-31')
  and second_event_log.actual_date <= isnull(first_event_log.end_date, '9999-12-31')
```

Here we set the default to December 31 of the year 9999 - the latest date SQL currently supports, until the Y10K rollover breaks all our code. Incidentally, the earliest supported date (e.g., to substitute for a missing `actual_date`) is `'1753-01-01'` for somewhat interesting reasons.

## Looking for Multiple Overlaps

The pattern above can be extended to accommodate multiple overlapping dates. For example, we might have a service in one program, and want to know whether the client was:

1. Enrolled with a given program modifier,
2. Concurrently enrolled in a specific other program,
3. Covered by a certain benefit assignment, and
4. Had a particular diagnosis active at the time of service.

![Multiple overlapping date ranges.](assets/images/Date%20Intervals%202.svg "A set of date ranges. The darkest region in the center overlaps with all three ranges.")

*Figure 3.* Multiple overlapping date ranges. The middle, darkest region overlaps with all three displayed ranges.

To find which events all overlap with each other, we will use our earlier pattern *for each pair of events.*

```sql
WHERE
  -- Event A overlaps with Event B
  first_event_log.actual_date <= isnull(second_event_log.end_date, '9999-12-31')
  and second_event_log.actual_date <= isnull(first_event_log.end_date, '9999-12-31') 
  -- Event A overlaps with Event C
  first_event_log.actual_date <= isnull(third_event_log.end_date, '9999-12-31')
  and third_event_log.actual_date <= isnull(first_event_log.end_date, '9999-12-31') 
  -- Event B overlaps with Event C
  second_event_log.actual_date <= isnull(third_event_log.end_date, '9999-12-31')
  and third_event_log.actual_date <= isnull(second_event_log.end_date, '9999-12-31')
```

The number of pairs grows quickly. The following table shows how many pairs of events should be compared to make sure all events overlap:

|Number of events|Total number of pairs|
|---|---|
|2|1|
|3|3|
|4|6|
|5|10|
|6|15|
|7|21|
|8|28|
|9|36|
|10|45|
