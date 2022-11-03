# anypin
Pin any tweet to your Twitter profile.

## Use as a UserScript
To run from a UserScript extension such as Tampermonkey or Greasemonkey, install [anypin.user.js](anypin.user.js).

## Use as an executable Bookmark
Save the following code block as a bookmark to run it from your Bookmarks toolbar
```javascript
javascript:(function(){let s=document.createElement('script');s.type='text/javascript';s.src='https://winnpixie.github.io/anypin/index.js';document.head.appendChild(s);})();
```
Note: This bookmarklet will not always work due to `Content Security Policies`. My recommendation is `javascript:` preceding a minified version of [`index.js`](index.js).