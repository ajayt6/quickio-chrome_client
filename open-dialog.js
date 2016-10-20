if (confirm('Open dialog for username input?'))
    chrome.runtime.sendMessage({type:'request_password'});