var _currentUserTemplate = {
    uid: null,
    name: null,
    email: null
};

var currentUser = _currentUserTemplate;

var events = {
    userReady: [],
    userSignedOut: []
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser.uid = user.uid;

            firebase.database().ref("users/" + currentUser.uid + "/name").once("value", function(nameSnapshot) {
                currentUser.name = nameSnapshot.val();

                $(".accountName").text(currentUser.name);

                firebase.database().ref("users/" + currentUser.uid + "/email").once("value", function(emailSnapshot) {
                    currentUser.email = emailSnapshot.val();

                    $(".accountEmail").text(currentUser.email);

                    for (var target in events.userReady) {
                        events.userReady[target]();
                    }
                });
            });

            try {
                firebase.storage().ref("users/" + currentUser.uid + "/account.png").getDownloadURL().then(function(url) {
                    $(".accountPictureLink").attr("src", url);
                });
            } catch (e) {
                $(".accountPictureLink").attr("src", "https://imcnetwork.cf/media/AnonymousUser.png");
            }
        } else {
            currentUser = _currentUserTemplate;

            for (var target in events.userSignedOut) {
                events.userSignedOut[target]();
            }

            if ($("body").attr("data-sign-out-redirect") != null) {
                window.location.href = $("body").attr("data-sign-out-redirect");
            }
        }
    });
});