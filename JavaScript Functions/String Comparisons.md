## What You Want to Do:
These are functions that I use as part of my larger function library for implementing some quality logic into my forms. For example:
  * Checking to see how similar an entered Profile Name is to other group profiles in myEvolv.
  * Looking for important keywords in a narrative.
  * Enforcing naming conventions.

## Code to Do It:
**Note:** The Javascript below is best used with a [DRY Library](https://github.com/myEvolv-Development-Community/myEvolvCode/blob/126ac0b41645af8d9e6a369de25be8594f93c349/How-To%20Guides/Make%20a%20DRY%20Function%20Library.md). My library consists of several main *namespaces*, these examples are located in a namespace object called `Global`. Then, for additional organizaiton, I have my string functions nested under a `string` sub-object. You don't have to organize your code like this, but it's how I do it.

### Global.string.like
#### Parameters
|Parameter      |Definition |Data Type|
|---            |---        |---      |
|`str`|The string to check|string|
|`pattern`|The pattern to match against.|string|

*@returns {boolean} - `true` if the string matches, `false` otherwise.*

#### Examples
```javascript
const test1 = Global.string.like('hello', 'h%');
console.log(test1); // Returns true
```
```javascript
const test2 = Global.string.like('hello', 'h%a');
console.log(test1); // Returns false
```

#### Definition
```javascript
const Global = () => {  
  string: {
        like: (str, pattern) => {
            // Replace SQL-like wildcards with RegExp equivalents
            // Escape special RegExp characters, then replace '%' with '.*'
            const regExpPattern = pattern
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                .replace(/%/g, '.*');
        
            // Create a RegExp, considering the pattern should match the whole string
            const regExp = new RegExp(`^${regExpPattern}$`);
        
            return regExp.test(str);
        },
```
___________

### Global.string.likeAny
#### Parameters
|Parameter      |Definition |Data Type|
|---            |---        |---      |
|`str`|The string to check|string|
|`patternArray`|An array of patterns to match against.|array|

*@returns {boolean} - `true` if the string matches any patterns, `false` otherwise.*

#### Examples
```javascript
const test1 = Global.string.likeAny('hello', ['h%', 'a%']);
console.log(test1); // Returns true
```
```javascript
const test2 = Global.string.likeAny('hello', ['a%', 'b%']);
console.log(test1); // Returns false
```

#### Definition
```javascript
        // ... previous Global.string functions
        
        likeAny: (str, patternArray) => {
            if (!Array.isArray(patternArray)) {
                console.error('An array was not provided to Global.string.likeAny().');
                return;
            }

            let isMatched = false;

            patternArray.forEach(pattern => {
                if (!isMatched) {
                    isMatched = Global.string.like(str, pattern);
                }
            });

            return isMatched;
        },
```
___________

### Global.string.compare
#### Parameters
|Parameter      |Definition |Data Type|
|---            |---        |---      |
|`string1`|The first string to compare.|string|
|`string2`|The second string to compare.|string|

*@returns {boolean} - `true` if the string matches, `false` otherwise.*

#### Examples
```javascript
Global.string.compare('hello', 'hello'); // 100
```
```javascript
Global.string.compare('hello', 'world'); // 0
```
```javascript
Global.string.compare('hello', 'helo'); // 80
```

#### Definition
```javascript
        // ... previous Global.string function

        compare: (string1, string2) => {
            const distance = Global.levenshteinDistance(string1, string2);
            const maxLength = Math.max(string1.length, string2.length);
            let similarity = (1 - distance / maxLength) * 100;
            similarity = similarity.toFixed(2);
            console.log('Similarity:', similarity);
            return similarity;
        }
    },

    // END OF STRING OBJECT //
```

#### Dependencies
⚠️ *Global.string.compare depends on the function below:*
```javascript
    // ... previous Global functions

    levenshteinDistance: (a, b) => {
        const matrix = [];
    
        // Increment along the first column of each row
        for(let i = 0; i <= b.length; i++){
            matrix[i] = [i];
        }
    
        // Increment each column in the first row
        for(let j = 0; j <= a.length; j++){
            matrix[0][j] = j;
        }
    
        // Fill in the rest of the matrix
        for(let i = 1; i <= b.length; i++){
            for(let j = 1; j <= a.length; j++){
                if(b.charAt(i - 1) === a.charAt(j - 1)){
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                            Math.min(matrix[i][j - 1] + 1, // insertion
                                                     matrix[i - 1][j] + 1)); // deletion
                }
            }
        }
    
        return matrix[b.length][a.length];
    },
};
```
