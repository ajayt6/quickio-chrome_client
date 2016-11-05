// Copyright (c) 2016 ajayt6. All rights reserved.
// Use of this source code is governed by a BSD-style license

var url = "http://ec2-52-42-76-33.us-west-2.compute.amazonaws.com:3000"
var token = "";
var userEmailID = "";

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
	else if (request.type === 'request_acceptance' && request.message=='auth_token') {
		token = request.data;
		var secretkey = request.secretkey;
		console.log("the secret key caught is: " + secretkey);


		chrome.storage.local.set({"secretkey": secretkey}, function() {
			console.log('secretkey ' + secretkey + ' saved');
			var def1 = chrome.storage.local.get("secretkey", function (items) {
				//  items = [ { "yourBody": "myBody" } ]
				var secretkey = items.secretkey;
				console.log("retrieved is: " + items.secretkey.toString());
			});

			$.when(def1).then(function () {

				if (secretkey.includes("clear")) {
					chrome.storage.local.clear(function () {
					});
				}
			});
		});


		//alert('The message has been received and data is: ' + request.data);
		console.log("The received token is: " + token);
		socket.emit("confirm_user_auth_token",token);
	}
});



function saveLoginInfo(sitename,username,password) {

	/*
	localStorage["sitename"] = sitename;
	localStorage["username"] = username;
	//console.log("username is " + username);
	localStorage["password"] = password;
	//console.log("Retrieved password is " + localStorage["password"]);
	*/

	var secretKey = "";

	//Get secretkey stored locally
	var defReturn = chrome.storage.local.get(/* String or Array */"secretkey", function(items) {
		secretKey = items.secretkey;
		console.log("retrieved is: " + items.secretkey.toString());
	});

	$.when(defReturn).then(function () {
		var encryptedUsername = CryptoJS.AES.encrypt(username, secretKey);
		var encryptedPassword = CryptoJS.AES.encrypt(password, secretKey);

		chrome.storage.local.get({userSiteDetails: {}}, function (result) {

			var userSiteDetails = result.userSiteDetails;

			userSiteDetails[sitename] = {encryptedUsername: encryptedUsername, encryptedPassword: encryptedPassword};

			chrome.storage.local.set({userSiteDetails: userSiteDetails}, function () {
				chrome.storage.local.get('userSiteDetails', function (result) {
					console.log(result.userSiteDetails)
					for (var i in result.userSiteDetails) {
						console.log("key " + i + " has value for username as " + userSiteDetails[i]["encryptedUsername"]);
					}
				});
			});
		});

	});
}

function setUserName(username,passkey,secretkey) {


	/*
	setTimeout(function () {

			//pUT SOMETHING HERE IF YOU WANT IT TO RUN AFTER TIMEOUT OF 10 SEC

	}, 10000);
	*/



	chrome.storage.local.set({"secretkey": secretkey}, function() {
		console.log('secretkey ' +secretkey+ ' saved');


		var def1 = chrome.storage.local.get("secretkey", function(items){
			//  items = [ { "yourBody": "myBody" } ]
			var secretkey = items.secretkey;
			console.log("retrieved is: " + items.secretkey.toString());

			//var dfrd = 1;//$.Deferred();
			//dfrd.resolve(items.usernameEncrypted);

			//return dfrd;//.promise();


		});



		$.when(def1).then(function () {

			if(username.includes("clear"))
			{
				chrome.storage.local.clear(function(){});
			}
		});
	});


/*


*/

	socket.emit("confirm user passkey",username + " " + passkey);

};


function loadScript(callback)
{

	[
		'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js',
		'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js',
		'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/aes.js',
		'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js',
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

	//The below commented code is for a reminder that it does not work
	//console.log("The socket info is: "+ socket);
	//console.log("the id of sicket before g sign in is: "+socket.id);

	localStorage.removeItem("username");
	if (localStorage["username"] == undefined)
	{
		//localStorage.removeItem("username");
		//localURL = chrome.extension.getURL('dialog.html');//"first_time_setup.html"
		//signInURL = chrome.extension.getURL('googleSignIn.html');
		signInURL = 'http://ec2-52-42-76-33.us-west-2.compute.amazonaws.com:3000/signin';
		//signInURLWithSocketID = signInURL + "?socket_id="+socket.id;
		//console.log("The sign in url with socket ID is: " + signInURLWithSocketID);
		chrome.tabs.create({ url: signInURL });

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
						console.log("inside yahoo branch");
						var secretkey = "";
						var encryptedUsername = "";
						var encryptedPassword = "";

						var retDef1 = chrome.storage.local.get('secretkey', function (result) {
							console.log(result.secretkey)

							secretkey = result.secretkey;

							//console.log("key " + i + " has value for username as " + userSiteDetails[i]["encryptedUsername"]);
						});

						var retDef2 = chrome.storage.local.get('userSiteDetails', function (result) {
								console.log(result.userSiteDetails);

								var userSiteDetails = result.userSiteDetails;
								encryptedUsername = userSiteDetails["yahoo"]["encryptedUsername"];
								encryptedPassword = userSiteDetails["yahoo"]["encryptedPassword"];
								//console.log("key " + i + " has value for username as " + userSiteDetails[i]["encryptedUsername"]);
						});

						$.when(retDef1,retDef2).then(function(){

							var username = CryptoJS.AES.decrypt(encryptedUsername, secretkey);
							var password = CryptoJS.AES.decrypt(encryptedPassword, secretkey);
							codeString = "document.getElementById('login-username').value='" + username.toString(CryptoJS.enc.Utf8) +"';" +
								"document.getElementById('login-passwd').value='"+ password.toString(CryptoJS.enc.Utf8) + "';" +
								"  document.forms[0].submit(); ";

							chrome.tabs.executeScript(tab.id, {code: codeString});

						});




					}
					else if(tab.url.toString().includes("facebook"))
					{
						console.log("inside facebook branch");
						var secretkey = "";
						var encryptedUsername = "";
						var encryptedPassword = "";

						var retDef1 = chrome.storage.local.get('secretkey', function (result) {
							console.log(result.secretkey)

							secretkey = result.secretkey;

							//console.log("key " + i + " has value for username as " + userSiteDetails[i]["encryptedUsername"]);
						});

						var retDef2 = chrome.storage.local.get('userSiteDetails', function (result) {
							console.log(result.userSiteDetails);

							var userSiteDetails = result.userSiteDetails;
							encryptedUsername = userSiteDetails["facebook"]["encryptedUsername"];
							encryptedPassword = userSiteDetails["facebook"]["encryptedPassword"];
							//console.log("key " + i + " has value for username as " + userSiteDetails[i]["encryptedUsername"]);
						});

						$.when(retDef1,retDef2).then(function(){

							var username = CryptoJS.AES.decrypt(encryptedUsername, secretkey);
							var password = CryptoJS.AES.decrypt(encryptedPassword, secretkey);
							codeString = "document.getElementById('email').value='" + username.toString(CryptoJS.enc.Utf8) +"';" +
								"document.getElementById('pass').value='"+ password.toString(CryptoJS.enc.Utf8) + "';" +
								"  document.forms[0].submit(); ";

							chrome.tabs.executeScript(tab.id, {code: codeString});

						});




					}
					else if(tab.url.toString().includes("google"))
					{
						codeString = "document.getElementById('Email').value='ajayt6';" +
							"document.getElementById('Passwd-hidden').value='"+ msg+ "';" +
							"  document.forms[0].submit(); ";
						chrome.tabs.executeScript(tab.id, {code: codeString});
					}


			  });
			  //var newURL = "https://www.yahoo.com";
				//chrome.tabs.create({ url: newURL });
				//socket.broadcast.emit('chat message','yo yahoo');
		  }



	  });
};


loadScript( myPrettyCode);