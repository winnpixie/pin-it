(function () {
    'use strict';

    let twitterAuthToken = '';
    for (let _script of document.scripts) {
        if (_script.src.includes('/main')) {
            window.fetch(_script.src).then(response => {
                if (response.ok) {
                    response.text().then(body => {
                        let tokenArea = body.substring(body.indexOf('Web-12",') + 8);
                        tokenArea = tokenArea.substring(tokenArea.indexOf('"') + 1);
                        twitterAuthToken = tokenArea.substring(0, tokenArea.indexOf('"'));

                        if (twitterAuthToken.length > 0) {
                            // https://stackoverflow.com/questions/34862749/alternative-to-ajaxcomplete-of-jquery-in-javascript-for-xmlhttprequest-or-act
                            const oldXhrSend = XMLHttpRequest.prototype.send;

                            XMLHttpRequest.prototype.send = function (...params) {
                                let oldCallback = this.onreadystatechange;
                                this.onreadystatechange = function () {
                                    if (this.readyState == XMLHttpRequest.DONE && this.responseURL.endsWith("/retweet.json")) {
                                        if (prompt('Would you like to pin this tweet to your profile? [y/N]', 'n') === 'y') {
                                            let jsonObj = JSON.parse(this.responseText);
                                            window.fetch('https://twitter.com/i/tweet/pin', {
                                                method: 'POST',
                                                cache: 'no-cache',
                                                headers: {
                                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                                    'x-twitter-active-user': 'yes'
                                                },
                                                body: `authenticity_token=${twitterAuthToken}&tweet_mode=extended&id=${jsonObj.id_str}`
                                            }).then(res => alert(res.ok ? 'Pinned! :)' : 'Could not pin tweet! :('));
                                        }
                                    }
                                    oldCallback();
                                }
                                oldXhrSend.apply(this, params);
                            }
                        }
                    });
                }
            });
            break;
        }
    }
})();