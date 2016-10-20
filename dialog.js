document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var username = document.getElementById('username').value;
    var passKey = document.getElementById('passKey').value;
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.setUserName(username,passKey);
        window.close();     // Close dialog
    });
};