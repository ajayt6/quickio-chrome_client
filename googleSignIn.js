function loadScript(callback)
{

    [
        "https://apis.google.com/js/platform.js"

    ].forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.async = false;
        script.onreadystatechange = callback;
        script.onload = callback;

        document.head.appendChild(script);
    });

};

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
};


loadScript( onSignIn);