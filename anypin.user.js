// ==UserScript==
// @name         anypin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pin any tweet on Twitter.com
// @author       Hannah
// @match *://twitter.com/*
// @grant        none
// ==/UserScript==

/*
 * anypin - Pin any tweet to your profile on https://twitter.com/
 * Author: Hannah (https://github.com/tivuhh)
 * Source: https://github.com/tivuhh/anypin/
 */
(function () {
    'use strict';

    // TODO: BEGIN Xhr Snooping
    window.onHttpRequestCompleted = [];

    const _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.xUrl = arguments[1];

        _open.apply(this, arguments);
    }

    const _setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function () {
        if (this.xHeaders == null) {
            this.xHeaders = [];
        }
        this.xHeaders[arguments[0]] = arguments[1];

        _setRequestHeader.apply(this, arguments);
    }

    const _send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        let _onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                window.onHttpRequestCompleted.forEach(func => func(this));
            }

            _onreadystatechange.apply(this, arguments);
        }

        _send.apply(this, arguments);
    }
    // TODO: END Xhr Snooping

    // Register a XHR completion callback for /retweet.json
    window.onHttpRequestCompleted.push(xhr => {
        if (xhr.xUrl.endsWith('/CreateRetweet')
            && prompt('Would you like to pin this tweet to your profile? [y/N]', 'n') === 'y') {
            let jsonResp = JSON.parse(xhr.responseText);
            let token = xhr.xHeaders.authorization;

            window.fetch('https://twitter.com/i/api/1.1/account/pin_tweet.json', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-twitter-active-user': 'yes',
                    'x-csrf-token': xhr.xHeaders['x-csrf-token'],
                    'authorization': `Bearer ${token.startsWith('Bearer ') ? token.substring(7) : token}`
                },
                body: `tweet_mode=extended&id=${jsonResp.data.create_retweet.retweet_results.result.rest_id}`
            }).then(res => alert(res.ok ? 'Pinned! :)' : 'Pin failed! :('));
        }
    });
})();