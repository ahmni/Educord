//Login page code below
function onSignIn(googleUser){
var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); 
        console.log('Full Name: ' + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
}
  function renderButton() {
    gapi.signin2.render('my-signin2', {
      'theme': 'dark'
  });
  }