var conf = new function () {

    this.right_click_down = false;
    this.deattach_clear = true;
    this.animation = true;
    this.sensitivity = 50;
    this.rbtn_scroll = false;
    this.log = true;

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
        window.addEventListener("wheel", poll_wheel, );
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
        if (conf.rbtn_scroll) {
            conf.right_click_down = false;
            window.removeEventListener("mousedown", poll_mouse);
            document.oncontextmenu = function () { return false; }
        }
        try {
            document.body.classList.add("swipeHistory");            
        } catch (err) {
            log(err.message);
        }
        setTimeout(function () {
            window.addEventListener("wheel", poll_wheel);
            document.body.classList.remove("swipeHistory");
            conf.deattach_clear = true;
            if (conf.rbtn_scroll) {
                window.addEventListener("mousedown", poll_mouse);
                document.oncontextmenu = function () { return true; }
            }
        }, 1250);
    }
    conf.deattach_clear = false;
}

function poll_wheel(e) {
    if (e.deltaX > conf.sensitivity || conf.right_click_down && e.deltaY < 0) {
        deattach();
        window.history.forward();
    } else if (e.deltaX < -Math.abs(conf.sensitivity) || conf.right_click_down && e.deltaY > 0) {
        deattach();
        window.history.back();
    }
}

function poll_mouse(e) {
    conf.right_click_down = (e.which == 3) ? true : false;
}

function log(message) {
    if (conf.log) console.log("SwipeHistory:", message);
}

conf.init();