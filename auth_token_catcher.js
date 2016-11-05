/**
 * Created by ajayt on 11/5/2016.
 */

document.addEventListener("Quicky_login", function(data) {
    //alert('eventListener fired and the auth token is: ' + data.detail.id_token);
    alert('eventListener fired and the secret key is: ' + data.detail.secretkey);
    chrome.runtime.sendMessage({message:'auth_token', type:'request_acceptance', data: data.detail.id_token, secretkey: data.detail.secretkey});
});