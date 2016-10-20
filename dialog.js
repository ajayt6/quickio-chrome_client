document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var username = document.getElementById('username').value;
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.setUserName(username);
        window.close();     // Close dialog
    });
};