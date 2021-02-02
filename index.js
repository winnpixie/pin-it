(function () {
    'use strict';

    class AnyPin {
        startNetCaptureService() {
            window.netRequestCallbacks = [];

            // Append a 'uri' value to each XMLHttpRequest
            const _open = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function () {
                this.uri = arguments[1];
                _open.apply(this, arguments);
            }

            // Add the specified header to the map of headers for this XMLHttpRequest
            const _srh = XMLHttpRequest.prototype.setRequestHeader;
            XMLHttpRequest.prototype.setRequestHeader = function () {
                if (this.headers == null) {
                    this.headers = [];
                }
                this.headers[arguments[0]] = arguments[1];
                _srh.apply(this, arguments);
            }

            // Capture this XMLHttpRequest to call our listeners when it's completed.
            const _send = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                let _orsc = this.onreadystatechange;
                this.onreadystatechange = function () {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        netRequestCallbacks.forEach(func => func(this));
                    }
                    _orsc.apply(this, arguments);
                }
                _send.apply(this, arguments);
            }
        }
        initialize() {
            this.startNetCaptureService();

            // Register the callback to listen to /retweet.json
            netRequestCallbacks.push(xhr => {
                if (xhr.uri.endsWith('/retweet.json')) {
                    if (prompt('Would you like to pin this tweet to your profile? [y/N]', 'n') === 'y') {
                        let jsonObj = JSON.parse(xhr.responseText);
                        let token = xhr.headers['authorization'];
                        token = token.startsWith('Bearer') ? token.substring(7) : token;
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
                }
            });
        }
    }

    (window.AnyPin = new AnyPin()).initialize();
})();