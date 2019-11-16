function save_options() {
    chrome.storage.sync.set({
        animation: document.getElementById('animation').checked,
        sensitivity: document.getElementById('sensitivity').value.animation,
        rbtn_scroll: document.getElementById('rbtn_scroll').checked,
    }, function () {
        document.getElementById("message").innerHTML = "Settings saved. Please refresh your tab to see the effect.";
    })
}

function restore_options() {
    chrome.storage.sync.get({
        animation: true,
        sensitivity: 50,
        rbtn_scroll: false
    }, function (items) {
        document.getElementById('animation').checked = items.animation;
        document.getElementById('sensitivity').value = items.sensitivity;
        document.getElementById('rbtn_scroll').checked = items.rbtn_scroll;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById('restore_defaults').addEventListener('click', function () {
    document.getElementById('settings').reset();
});