// Copyright (c) 2016 ajayt6. All rights reserved.
// Use of this source code is governed by a BSD-style license 




var searchUrls=[
"http://www.google.co.in/#hl=en&q=",	//Google - 0
"http://www.youtube.com/results?search_query=",	//Youtube - 1
"http://www.google.com/search?num=10&hl=en&site=imghp&tbm=isch&source=hp&q=",	//Google Images - 2
"http://www.imdb.com/find?q=",	//IMDB - 3
"http://en.wikipedia.org/w/index.php?search=",	//Wikipedia - 4
"http://grooveshark.com/#!/search/song?q=",	//Grooveshark - 5
"http://www.rottentomatoes.com/search/?search=",	//Rotten Tomatoes - 6
"https://duckduckgo.com/?q=",	//DuckDuckGo - 7
"http://www.google.co.in/#hl=en&btnI=1&q=",	//I am feeling lucky(IAFL) - 8
"http://www.google.co.in/#hl=en&btnI=1&q=inurl:imdb.com%20",	//IAFL IMDB - 9	
"http://www.google.co.in/#hl=en&btnI=1&q=inurl:en.wikipedia.org%20",	//IAFL Wikipedia - 10
"https://twitter.com/search?q=",	//Twitter - 11
"http://www.facebook.com/srch.php?nm=",	//Facebook - 12
"http://answers.yahoo.com/search/search_result;_ylt=AsUneLQBL.OofYJQHkYXVB7j1KIX;_ylv=3?submit-go=Search+Y%21+Answers&p=",	//Yahoo Answers - 13
"http://www.flipkart.com/search/a/all?query=",	//Flipkart - 14
"http://www.ebay.in/sch/i.html?_trksid=p3907.m570.l1313&_nkw=",	//Ebay - 15
"http://www.infibeam.com/search.jsp?storeName=All&query=",	//Infibeam - 16
"http://torrentz.eu/search?f="	//Torrent search - 17
]; 

var mquery=new Array();  
var multiple;
var incognito;
var role;

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

function setUserName(username) {
	// Do something, eg..:
	localStorage["username"] = username;
	console.log(username);
};


function loadScript(callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.5.0/socket.io.js';

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
/*
var imported = document.createElement('script');
imported.src = 'socket.io.js';
document.head.appendChild(imported);
 */

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

	if (localStorage["username"] == undefined)
	{
		//localStorage.removeItem("username");
		localURL = chrome.extension.getURL('dialog.html');//"first_time_setup.html"
		chrome.tabs.create({ url: localURL });

	}
   var socket = io(url);

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
	  {
		  var newURL = "https://www.yahoo.com";
			//chrome.tabs.create({ url: newURL });
			//socket.broadcast.emit('chat message','yo yahoo');
	  }
    
	
	
  });
};



loadScript( myPrettyCode);






