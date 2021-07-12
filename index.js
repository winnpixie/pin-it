/**
 * AnyPin - Pin ANY tweet!
 * Author: Summer (https://github.com/alerithe)
 * Source: https://github.com/alerithe/anypin/
 */
(function () {
    'use strict';

    class AnyPin {
        initialize() {
            window.onXhrCompleted = [];

            // Sets the added 'uri' field to the requested URL of this XHR
            const _open = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function () {
                this.uri = arguments[1];

                _open.apply(this, arguments);
            }

            // Append the specified header and value to the added 'headers' field of this XHR
            const _setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
            XMLHttpRequest.prototype.setRequestHeader = function () {
                if (this.headers == null) {
                    this.headers = [];
                }
                this.headers[arguments[0]] = arguments[1];

                _setRequestHeader.apply(this, arguments);
            }

            // Allow global XHR completion listeners
            const _send = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                let _onreadystatechange = this.onreadystatechange;
                this.onreadystatechange = function () {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        window.onXhrCompleted.forEach(func => func(this));
                    }

                    _onreadystatechange.apply(this, arguments);
                }

                _send.apply(this, arguments);
            }

            // Register a XHR completion callback for /retweet.json
            window.onXhrCompleted.push(xhr => {
                if (xhr.uri.endsWith('/retweet.json')
                    && prompt('Would you like to pin this tweet to your profile? [y/N]', 'n') === 'y') {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let token = xhr.headers.authorization;
                    token = token.startsWith('Bearer ') ? token.substring(7) : token;

                    window.fetch('https://twitter.com/i/api/1.1/account/pin_tweet.json', {
                        credentials: 'include',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'x-twitter-active-user': 'yes',
                            'x-csrf-token': xhr.headers['x-csrf-token'],
                            'authorization': `Bearer ${token}`
                        },
                        body: `tweet_mode=extended&id=${jsonObj.id_str}`
                    }).then(res => alert(res.ok ? 'Pinned! :)' : 'Could not pin tweet! :('));
                }
            });
        }
    }

    (window.AnyPin = new AnyPin()).initialize();
})();