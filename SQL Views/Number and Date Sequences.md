### What You Want to Do:

Get a list or sequence of all numbers counting up from 0 or all dates counting back from today.

### View Definition
```sql
WITH sequence( number ) AS
(
  SELECT 0 AS number -- start counting from zero
  UNION ALL
  SELECT number + 1 -- increment the number by 1 at each step
  FROM sequence
  WHERE number < 31 -- stop incrementing once the next number in sequence is 31, produces numbers from 0 to 31
)

SELECT 
lower.number + 32 * middle.number + 1024 * upper.number AS number, -- use multiplication to get numbers from 0 to 32767 (up to 2 ^ 15)
CAST (DATEADD(dd, -1 * (lower.number + 32 * middle.number + 1024 * upper.number), GETDATE()) AS DATE) AS reference_date -- count back from today to 32767 days ago (about 85.5 years)
FROM sequence AS lower
CROSS JOIN sequence AS middle -- use cross join to get all possible multiples of the numbers from 0 to 31
CROSS JOIN sequence AS upper
```

### Other Details
This is a recursive common table expression (CTE), so the WITH clause at the beginning is necessary.

A simpler version that does not rely on CROSS JOIN and multiplication will run on the Reporting Server, but requires setting the MAXRECURSION option, which is disallowed in the Custom Reporting tool.

The numeric sequence counts from 0 to 32,767, which is the largest signed 16-bit number available. 


### Example Output
| number | reference_date |
| ---------- | ----------- |
|     0   |  2022-11-30|
|     1   |  2022-11-29|
|     2   |  2022-11-28|
|     3   |  2022-11-27|
|     4   |  2022-11-26|
|     5   |  2022-11-25|
