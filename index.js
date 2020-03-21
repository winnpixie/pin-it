(function () {
    'use strict';

    // TODO: Work on a less hacky way to get the authentication token
    let authToken = '';
    for (let _script of document.scripts) {
        if (_script.src.indexOf('abs.twimg.com/responsive-web/web/main') !== -1) {
            console.log("main script found!");

            window.fetch(_script.src).then(res => {
                if (res.ok) {
                    res.text().then(txt => {
                        let line = txt.substring(txt.indexOf('Web-12",') + 8);
                        line = line.substring(line.indexOf('"') + 1);
                        authToken = line.substring(0, line.indexOf('"'));
                    });
                }
            });
            break;
        }
    }

    if (authToken.length > 0) {
        console.log("auth token not empty!")
        // https://stackoverflow.com/questions/34862749/alternative-to-ajaxcomplete-of-jquery-in-javascript-for-xmlhttprequest-or-act
        const oldXhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function (...params) {
            let oldCallback = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE && this.responseURL == 'https://api.twitter.com/1.1/statuses/retweet.json') {
                    if (prompt('Would you like to pin this tweet to your profile? [y/N]', 'n') === 'y') {
                        let jsonObj = JSON.parse(this.responseText);
                        window.fetch('https://twitter.com/i/tweet/pin', {
                            method: 'POST',
                            cache: 'no-cache',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'x-twitter-active-user': 'yes'
                            },
                            body: `authenticity_token=${authToken}&tweet_mode=extended&id=${jsonObj.id_str}`
                        }).then(res => alert(res.ok ? 'Pinned!' : 'Could not pin tweet!'));
                    }
                }
                oldCallback();
            }
            oldXhrSend.apply(this, params);
        }

        console.log("anypin active!");
    }
})();