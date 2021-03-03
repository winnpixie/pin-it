# anypin
Pin ANY tweet!

## Use as a UserScript
To run from a UserScript extension such as Tampermonkey or Greasemonkey, append the following to the script's headers:
```javascript
// @match *://twitter.com/*
```
Make the script's source code the content of [`index.js`](https://github.com/alerithe/anypin/blob/master/index.js).

## Use as an executable Bookmark
Save the following code block as a bookmark to run it from your Bookmarks toolbar
```javascript
javascript:(function(){let s=document.createElement('script');s.type='text/javascript';s.src='https://alerithe.github.io/anypin/index.js';document.head.appendChild(s);})();
```
Note: This bookmarklet will not always work due to `Content Security Policies`. My recommendation is `javascript:` preceding a minified version of [`index.js`](https://github.com/alerithe/anypin/blob/master/index.js).