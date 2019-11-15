window.addEventListener("wheel", direction);

var settings = new function () {

    this.animation = true;
    this.sensitivity = 50;

    this.init = function () {
        chrome.storage.sync.get({
            animation: true,
            sensitivity: 50
        }, function (items) {
            settings.set('animation', items.animation);
            settings.set('sensitivity', items.sensitivity);
            if (items.animation) settings.inject_css();
        });
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

settings.init();

function deattach() {
    window.removeEventListener("wheel", direction);
    // Remove wheel event listener but reattach it in case the user navigates back using browser history
    // Timeout is neccessary when a user tries to navigate forward but forward history is missing
    setTimeout(function () {
        window.addEventListener("wheel", direction);
        document.body.classList.remove("swipeHistory");
    }, 1000);
}

function direction() {
    if (event.deltaX > settings.sensitivity) {
        document.body.classList.add("swipeHistory");
        deattach();
        window.history.forward();
    } else if (event.deltaX < -Math.abs(settings.sensitivity)) {
        document.body.classList.add("swipeHistory");
        deattach();
        window.history.back();
    }
}