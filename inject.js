var conf = new function () {

    this.deattach_clear = true;
    this.animation = true;
    this.sensitivity = 50;
    this.log = true;

    this.init = function () {
        chrome.storage.sync.get({
            animation: true,
            sensitivity: 50,
        }, function (items) {
            for (key in items) {
                conf.set(key, items[key]);
            }
            if (items.animation) conf.inject_css();

        });
        window.addEventListener("wheel", poll_wheel);
    }
    this.set = function (name, val) {
        conf[name] = val;
    }
    this.inject_css = function () {
        window.addEventListener('DOMContentLoaded', (event) => {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync('body.swipeHistory { transition: opacity 0.2s; opacity: 0.2; overflow: hidden;' +
                'backface-visibility: hidden; pointer-events: none; }');
            document.adoptedStyleSheets = [sheet];
        });
    }
};

function deattach() {
    // Remove wheel event listener but reattach it in case the user navigates back using browser history
    // Timeout is neccessary when a user tries to navigate forward but forward history is missing
    if (conf.deattach_clear) {
        window.removeEventListener("wheel", poll_wheel);
        try {
            document.body.classList.add("swipeHistory");
        } catch (err) {
            log(err.message);
        }
        setTimeout(function () {
            window.addEventListener("wheel", poll_wheel);
            document.body.classList.remove("swipeHistory");
            conf.deattach_clear = true;
        }, 1250);
    }
    conf.deattach_clear = false;
}

function poll_wheel(e) {
    if (e.deltaX > conf.sensitivity) {
        deattach();
        window.history.forward();
    } else if (e.deltaX < -Math.abs(conf.sensitivity)) {
        deattach();
        window.history.back();
    }
}

function log(message) {
    if (conf.log) console.log("SwipeHistory:", message);
}

conf.init();
