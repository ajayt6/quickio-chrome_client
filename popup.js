  document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var sitename = document.getElementById('sitename').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.saveLoginInfo(sitename,username,password);
        window.close();     // Close dialog
    });
};

