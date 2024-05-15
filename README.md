# anypin
Pin any tweet to your Twitter profile.

## !! DISCLAIMER !!
PROJECT ABANDONED.

I *believe* that \(non-quoted\) retweets are now handled differently internally, as trying to use this will return "No status found with that ID." from the API.

## Use as a UserScript
To run from a UserScript extension such as Tampermonkey or Greasemonkey, install [pin-it.user.js](pin-it.user.js).

## Use as an executable Bookmark
Save the following code block as a bookmark to run it from your Bookmarks toolbar
```javascript
javascript:(function(){let s=document.createElement('script');s.type='text/javascript';s.src='https://winnpixie.github.io/pin-it/pin-it.user.js';document.head.appendChild(s);})();
```
Note: This bookmarklet will not always work due to `Content Security Policies`. My recommendation is `javascript:` preceding a minified version of [`pin-it.user.js`](pin-it.user.js).