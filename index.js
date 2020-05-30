(function () {
    'use strict';

    // https://stackoverflow.com/questions/921198/get-request-url-from-xhr-object
    const _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.resource = arguments[1];
        _open.apply(this, arguments);
    }

    // https://stackoverflow.com/questions/34862749/alternative-to-ajaxcomplete-of-jquery-in-javascript-for-xmlhttprequest-or-act
    let requestCallbacks = [];
    const _send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        if (this.resource != null) {
            let _orsc = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    requestCallbacks.forEach(cb => cb(this));
                }
                _orsc.apply(this, arguments);
            }
        }
        _send.apply(this, arguments);
    }

    class AnyPin {
        constructor() {
            this.authToken = '';
        }
        initialize() {
            for (let _script of document.scripts) {
                if (_script.src.includes('/main')) {
                    window.fetch(_script.src).then(response => {
                        response.text().then(body => {
                            let tokenArea = body.substring(body.indexOf('Web-12",') + 8);
                            tokenArea = tokenArea.substring(tokenArea.indexOf('"') + 1);
                            this.authToken = tokenArea.substring(0, tokenArea.indexOf('"'));
                        });
                    });
                }
            }

            // Register the callback to listen to /retweet.json
            requestCallbacks.push(xhr => {
                if (xhr.resource.endsWith('/retweet.json')) {
                    if (prompt('Would you like to pin this tweet to your profile? [y/N]', 'n') === 'y') {
                        let jsonObj = JSON.parse(xhr.responseText);
                        window.fetch('https://twitter.com/i/tweet/pin', {
                            method: 'POST',
                            cache: 'no-cache',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'x-twitter-active-user': 'yes'
                            },
                            body: `authenticity_token=${this.authToken}&tweet_mode=extended&id=${jsonObj.id_str}`
                        }).then(res => alert(res.ok ? 'Pinned! :)' : 'Could not pin tweet! :('));
                    }
                }
            });
        }
    }

    (window.AnyPin = new AnyPin()).initialize();
})();