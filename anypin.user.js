// ==UserScript==
// @name         anypin
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Pin any tweet on to your Twitter profile.
// @author       Hannah
// @match        *://twitter.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/*
 * anypin - Pin any tweet to your Twitter profile.
 * Author: Hannah (https://github.com/winnpixie)
 * Source: https://github.com/winnpixie/anypin/
 */
(function () {
    'use strict';

    // BEGIN XHR eXtensions
    window.XHRX = {
        onCompleted: []
    };

    const xhr_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.xUrl = arguments[1];
        xhr_open.apply(this, arguments);
    };

    const xhr_setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function () {
        if (this.xHeaders == null) this.xHeaders = [];

        this.xHeaders[arguments[0]] = arguments[1];
        xhr_setRequestHeader.apply(this, arguments);
    };

    const xhr_send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        const xhr_onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                window.XHRX.onCompleted.forEach(action => action(this));
            }

            if (xhr_onreadystatechange != null) xhr_onreadystatechange.apply(this, arguments);
        };

        xhr_send.apply(this, arguments);
    };
    // END XHR eXtensions

    // FIXME: This currently does not work.
    window.XHRX.onCompleted.push(xhr => {
        if (!xhr.xUrl.endsWith('/CreateRetweet')) return;
        if (prompt('Would you like to pin this tweet?', 'n') !== 'y') return;

        let json = JSON.parse(xhr.responseText);
        let token = xhr.xHeaders.authorization;

        // FIXME: This produces a 404 Not Found due to tweet id?
        window.fetch('https://twitter.com/i/api/1.1/account/pin_tweet.json', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-twitter-active-user': 'yes',
                'x-csrf-token': xhr.xHeaders['x-csrf-token'],
                'authorization': `Bearer ${token.startsWith('Bearer ') ? token.substring(7) : token}`
            },
            body: `tweet_mode=extended&id=${json.data.create_retweet.retweet_results.result.rest_id}`
        }).then(res => alert(res.ok ? 'OK!' : `FAIL!\n\nHTTP ${res.status} (${res.statusText})`));
    });
})();