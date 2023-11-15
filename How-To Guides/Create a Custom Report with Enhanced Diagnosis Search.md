### What You Want To Do:

Create a custom report with client diagnosis codes (ICD-10-based) and a search bar to select clients with specific *combinations* of diagnoses, e.g., clients with both a substance use disorder and a mental health disorder, or clients with either of two diagnoses on file.

### How to Do It:
**This procedure requires the following components and techniques.**
1. Created virtual views for condensed diagnosis lists (either at the time of an event or at present)
2. Use of parameter capturing in a custom report
3. Use of `dbo.fnSplit` (a Netsmart-provided SQL function)

### `dbo.fnSplit`
