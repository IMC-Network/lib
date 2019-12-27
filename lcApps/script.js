var _currentUserTemplate = {
    uid: null,
    name: null,
    email: null,
    orgName: null,
    org: null,
    orgMember: null
};

var currentUser = _currentUserTemplate;

var events = {
    userReady: []
};

function addProgramme(programme, programmeKey) {
    $("<div class='programmeTile'>")
        .text(programme.textShows != false ? programme.name : "")
        .attr("aria-label", programme.name)
        .css({
            "background-image": programme.thumbnail == null ? "url('https://imcnetwork.cf/LiveCloud/media/Blank%20App.png')" : "url('" + encodeURI(programme.thumbnail) + "')",
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover",
            "color": programme.textColour == null ? "var(--foregroundColour)" : programme.textColour
        })
        .appendTo(
            $("<a class='programmeTileLink'>")
                .attr({
                    "title": programme.name,
                    "href": window.location.href.split("?")[0] + "?prog=" + encodeURIComponent(programmeKey),
                })
                .appendTo($(".programmesList.myProgrammes"))
        )
    ;
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser.uid = user.uid;

        firebase.database().ref("users/" + currentUser.uid + "/name").once("value", function(nameSnapshot) {
            currentUser.name = nameSnapshot.val();

            $(".accountName").text(currentUser.name);

            firebase.database().ref("users/" + currentUser.uid + "/email").once("value", function(emailSnapshot) {
                currentUser.email = emailSnapshot.val();

                $(".accountEmail").text(currentUser.email);

                (".accountSignedIn").show();
                    $(".accountSignedOut").hide();

                    $("[data-menu-dropdown='account']").html("").append([
                        $(document.createTextNode(currentUser.name)),
                        $("<i class='material-icons'>")
                            .attr({
                                "aria-hidden": "true",
                                "data-menu-dropdown-icon": "account"
                            })
                            .text("arrow_drop_down")
                    ]);

                firebase.database().ref("users/" + currentUser.uid + "/org").once("value", function(orgNameSnapshot) {
                    currentUser.orgName = orgNameSnapshot.val();

                    firebase.database().ref("orgs/" + currentUser.orgName).once("value", function(orgSnapshot) {
                        currentUser.org = orgSnapshot.val();
                        currentUser.orgMember = orgSnapshot.val().members[currentUser.uid];

                        firebase.database().ref("orgs/" + currentUser.orgName + "/programmes").on("value", function(snapshot) {
                            $(".programmesList.myProgrammes").html("");

                            if (snapshot.val() == null) {
                                $(".programmesList.myProgrammes").html(`
                                    <p>
                                        It appears that you don't have any programmes
                                        yet. Add programmes in the LiveCloud app by
                                        pressing the <strong>New programme</strong>
                                        button.
                                    </p>
                                `);
                            } else {
                                for (var key in snapshot.val()) {
                                    addProgramme(snapshot.val()[key], key);
                                }
                            }
                        });

                        $(function() {
                            for (var target in events.userReady) {
                                events.userReady[target]();
                            }
                        });
                    });
                });
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
        window.location.href = "https://imcnetwork.cf/LiveCloud/index.html";
    }
});