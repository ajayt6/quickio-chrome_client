document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var username = document.getElementById('username').value;
    var passKey = document.getElementById('passKey').value;
    var secretkey = document.getElementById('secretkey').value;
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.setUserName(username,passKey,secretkey);
        window.close();     // Close dialog
    });
};