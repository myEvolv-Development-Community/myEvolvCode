### What You Want to Do:
Generate simple, random passwords for users.

### Code to Do It:
```javascript
Array.from(Array(Math.ceil(Math.random() * 3 + 2))).
  map(x => String.fromCharCode(Math.ceil(Math.random() * (0x61 - 0x7a)) + 0x7a)).
  concat(Array.from(Array(Math.ceil(Math.random() * 3 + 2))).map(x => String.fromCharCode(Math.ceil(Math.random() * (0x41 - 0x5a)) + 0x5a))).
  concat(Array.from(Array(Math.ceil(Math.random() * 3 + 2))).map(x => String.fromCharCode(Math.ceil(Math.random() * (0x30 - 0x39)) + 0x39))).
  map(value => ({ value, sort: Math.random() })).
  sort((a, b) => a.sort - b.sort).
  map(({ value }) => value).
  join("")
```

### End-User Details
This can be used in conjunction with `writeText()` to automatically copy the new password to the clipboard. The copied password can then be pasted into the password and verify password fields, and pasted into a message to the user without having to re-type anything.
