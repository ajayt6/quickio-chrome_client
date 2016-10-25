// Copyright (c) 2016 ajayt6. All rights reserved.
// Use of this source code is governed by a BSD-style license

var url = "http://ec2-52-42-76-33.us-west-2.compute.amazonaws.com:3000"


chrome.runtime.onMessage.addListener(function(request) {
	if (request.type === 'request_password') {
		chrome.tabs.create({
			url: chrome.extension.getURL('dialog.html'),
			active: false
		}, function(tab) {
			// After the tab has been created, open a window to inject the tab
			chrome.windows.create({
				tabId: tab.id,
				type: 'popup',
				focused: true
				// incognito, top, left, ...
			});
		});
	}
});

function setUserName(username,passkey) {
	// Do something, eg..:
	localStorage["username"] = username;
	console.log("username is " + username);
	localStorage["passkey"] = passkey;
	console.log("passkey is " + passkey);

	socket.emit("confirm user passkey",username + " " + passkey);
};


function loadScript(callback)
{
	console.log("before");

	[
		'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js',
		'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js',
		'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/aes.js',
		'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.5.0/socket.io.js'

	].forEach(function(src) {
		var script = document.createElement('script');
		script.src = src;
		script.type = 'text/javascript';
		script.async = false;
		if(script.src.toString().includes("socket"))
		{
			//console.log("inside if");
			// Then bind the event to the callback function.
			// There are several events for cross browser compatibility.
			script.onreadystatechange = callback;
			script.onload = callback;
		}
		document.head.appendChild(script);
	});

}




function doInAllTabs(tabCallback) {
	chrome.tabs.query(
		{},
		function (tabArray) {
			tabCallback(tabArray);
		}
	);

}

function doInCurrentTab(tabCallback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { tabCallback(tabArray[0]); }
    );
}



var myPrettyCode = function() {


   socket = io(url);

	var messageOrig = "Me";
	var encrypted = CryptoJS.AES.encrypt(messageOrig, "Secret");
	var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret");


	console.log("The original message is: " + messageOrig);
	console.log("The encrypted message is: " + encrypted);
	console.log("The decrypted message is: " + decrypted.toString(CryptoJS.enc.Utf8));

	localStorage.removeItem("username");
	if (localStorage["username"] == undefined)
	{
		//localStorage.removeItem("username");
		localURL = chrome.extension.getURL('dialog.html');//"first_time_setup.html"
		chrome.tabs.create({ url: localURL });

	}

  socket.on('chat message', function(msg){
	  if(msg.includes("921"))//str.includes("world")//msg == "Yo the kid authenticated alright")
	  {
			msg = msg.replace("921"," ");
			//socket.broadcast.emit('chat message','yoyomama');
			
			if(msg.includes("closeyo"))
			{
					var activeTabId;
					//doInCurrentTab( function(tab){ activeTabId = tab.id 
					//chrome.tabs.remove(activeTabId);
					//} );
					doInAllTabs( function(tabArray){
						console.log("One id of tab is: "+tabArray[0].id);
						lastIndex = tabArray.length-1;
						console.log("The last index is: "+ lastIndex);
						lastTabId = tabArray[lastIndex].id
						chrome.tabs.remove(lastTabId);
					} );
			}
			else
			{
					var newURL = "https://duckduckgo.com/?q=!ducky+site:www.youtube.com+" + msg;
					chrome.tabs.create({ url: newURL });

			}
			
			
			
	  }
	  else if(msg.includes("yahoo out"))
	  {

		  doInAllTabs( function(tabArray){
			  console.log("One id of tab is: "+tabArray[0].id);
			  lastIndex = tabArray.length-1;
			  console.log("The last index is: "+ lastIndex);
			  lastTabId = tabArray[lastIndex].id
			  myNewUrl = "https://login.yahoo.com/config/login?logout=1&.direct=2&amp;.src=cdgm&amp;.intl=in&amp;.lang=en-IN&.done=https://in.yahoo.com/";

			  chrome.tabs.update(lastTabId, {url: myNewUrl});
		  } );

	  }
	  else if(msg.includes("pass "))
	  {
		  msg = msg.replace("pass ","");

		  chrome.tabs.create({ url: "https://login.yahoo.com/config/mail?.intl=nz" }, function(tab) {

			  chrome.tabs.executeScript(tab.id, {code: "document.getElementById('login-username').value='ajayt6';" +
			  "document.getElementById('login-passwd').value='"+ msg+ "';" +
			  "  document.forms[0].submit(); "});
		  });




	  }



	  else
	  {		//This is for quicky to login to currently loaded site
		  doInCurrentTab(function(tab){
			  var codeString = "";
		  	if(tab.url.toString().includes("yahoo"))
			{
				codeString = "document.getElementById('login-username').value='ajayt6';" +
				"document.getElementById('login-passwd').value='"+ msg+ "';" +
				"  document.forms[0].submit(); ";


			}
			else if(tab.url.toString().includes("google"))
			{
				codeString = "document.getElementById('Email').value='ajayt6';" +
					"document.getElementById('Passwd-hidden').value='"+ msg+ "';" +
					"  document.forms[0].submit(); ";
			}
			  chrome.tabs.executeScript(tab.id, {code: codeString});
			  } );
		  //var newURL = "https://www.yahoo.com";
			//chrome.tabs.create({ url: newURL });
			//socket.broadcast.emit('chat message','yo yahoo');
	  }
    
	
	
  });
};


loadScript( myPrettyCode);






