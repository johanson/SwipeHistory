function save_options() {
    chrome.storage.sync.set({
        animation: document.getElementById('animation').checked,
        sensitivity: document.getElementById('sensitivity').value,
    }, function () {
        document.getElementById("message").innerHTML = "Settings saved. Please refresh your tab to see the effect.";
    })
}

function restore_options() {
    chrome.storage.sync.get({
        animation: true,
        sensitivity: 50,
    }, function (items) {
        document.getElementById('animation').checked = items.animation;
        document.getElementById('sensitivity').value = items.sensitivity;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById('restore_defaults').addEventListener('click', function () {
    document.getElementById('settings').reset();
});
