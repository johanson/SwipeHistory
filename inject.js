var conf = new function () {

    this.right_click_down = false;
    this.deattach_clear = true;

    this.init = function () {
        chrome.storage.sync.get({
            animation: true,
            sensitivity: 50,
            rbtn_scroll: false
        }, function (items) {
            for (key in items) {
                conf.set(key, items[key]);
            }
            if (items.animation) conf.inject_css();
            if (items.rbtn_scroll) window.addEventListener("mousedown", poll_mouse);
        });
        window.addEventListener("wheel", poll_wheel);
    }
    this.set = function (name, val) {
        this[name] = val;
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
        if (conf.rbtn_scroll) {
            window.removeEventListener("mousedown", poll_mouse);
            document.oncontextmenu = function () { return false; }
        }
        document.body.classList.add("swipeHistory");
        setTimeout(function () {
            window.addEventListener("wheel", poll_wheel);
            document.body.classList.remove("swipeHistory");
            conf.deattach_clear = true;
            if (conf.rbtn_scroll) {
                window.removeEventListener("mousedown", poll_mouse);
                document.oncontextmenu = function () { return true; }
            }
        }, 1250);
    }
    conf.deattach_clear = false;
}

function poll_wheel() {
    if (event.deltaX > conf.sensitivity || conf.right_click_down && event.deltaY < 0) {
        deattach();
        window.history.forward();
    } else if (event.deltaX < -Math.abs(conf.sensitivity) || conf.right_click_down && event.deltaY > 0) {
        deattach();
        window.history.back();
    }
}

function poll_mouse() {
    conf.right_click_down = (event.which == 3) ? true : false;
}

conf.init();