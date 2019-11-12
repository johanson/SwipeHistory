window.addEventListener("wheel",  direction);

let sensitivity = 80;
let animation = true;

function inject_css() {    
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('body.swipeHistory { transition: opacity 0.2s; opacity: 0.2; overflow: hidden;' +
                      'backface-visibility: hidden; pointer-events: none; }');
    document.adoptedStyleSheets = [sheet];
}

if (animation) document.addEventListener('DOMContentLoaded', inject_css);

function deattach() {
    window.removeEventListener("wheel",  direction);
    // Remove wheel event listener but reattach it in case the user navigates back using browser history
    // Timeout is neccessary when a user tries to navigate forward but forward history is missing
    setTimeout(function() {
        window.addEventListener("wheel",  direction);
        if (animation) document.body.classList.remove("swipeHistory");
    }, 1000);
}

function direction() {
    let x = event.deltaX;
    if (sensitivity == 0) {
        console.log("Sensitivity must be bigger than 0")
    }
    if (x > sensitivity) {
        if (animation && document.body) document.body.classList.add("swipeHistory");
        deattach();
        window.history.forward();
    } else if (x < -Math.abs(sensitivity)) {
        if (animation && document.body) document.body.classList.add("swipeHistory");
        deattach();
        window.history.back();
    }
}