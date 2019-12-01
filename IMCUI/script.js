var loaderRotationAngle = 0;

function dialog(title, content, buttons = [{text: "Close", onclick: "closeDialog();", type: "primary"}], allowEscape = true) {
    $(".dialog").html(`
        <div class="dialogTitle"></div>
        <div class="dialogContent"></div>
        <div class="dialogActions"></div>
    `);

    $(".dialogTitle").text(title);
    $(".dialogContent").html(content);

    for (var i = 0; i < buttons.length; i++) {
        $(".dialogActions").html(
            $(".dialogActions").html() +
            "<button" +
            (
                buttons[i].type == "secondary" ?
                " class='secondary'" :
                (
                    buttons[i].type == "bad" ?
                    " class='bad'" :
                    (
                        buttons[i].type == "reallyBad" ?
                        " class='reallyBad'" :
                        (
                            buttons[i].type == "highlight" ?
                            " class='highlight'" :
                            ""
                        )
                    )
                )
            ) +
            " onclick='" +
            buttons[i].onclick +
            "'>" +
            buttons[i].text +
            "</button>"
        );
    }

    if (allowEscape) {
        $(".dialogBackground").attr("onclick", "closeDialog();");
    } else {
        $(".dialogBackground").attr("onclick", "");
    }

    $(".dialogBackground").fadeIn();
    $(".dialog").fadeIn();
}

function closeDialog() {
    $(".dialogBackground").fadeOut();
    $(".dialog").fadeOut();
}

function openMenu(menuName) {
    $("[data-menu='" + menuName + "']").fadeIn();

    $("[data-menu-dropdown='" + menuName + "']").attr("aria-expanded", "true");
    $("[data-menu-dropdown-icon='" + menuName + "']").text("arrow_drop_up");

    $("[data-menu='" + menuName + "']").focus();
}

function closeMenu(menuName) {
    $("[data-menu='" + menuName + "']").fadeOut();

    $("[data-menu-dropdown='" + menuName + "']").attr("aria-expanded", "false");
    $("[data-menu-dropdown-icon='" + menuName + "']").text("arrow_drop_down");
}

function toggleMenu(menuName) {
    if ($("[data-menu='" + menuName + "']").is(":visible")) {
        closeMenu(menuName);
    } else {
        openMenu(menuName);
    }
}

$(function() {
    setInterval(function() {
        loaderRotationAngle += 90;

        $(".loader").css("transform", "rotate(" + loaderRotationAngle + "deg)");

        if (loaderRotationAngle >= 360) {
            loaderRotationAngle = 0;
        }
    }, 150);
    
    $(window).click(function() {
        $("[data-menu]").each(function() {
            closeMenu($(this).attr("data-menu"));
        });
    });

    $("[data-menu], [data-menu-dropdown]").click(function() {
        event.stopPropagation();
    });

    $("body").on("mousedown", "*", function(event) {
        if (($(this).is(":focus") || $(this).is(event.target)) && $(this).css("outline-style") == "none") {
            $(this).css("outline", "none").on("blur", function() {
                $(this).off("blur").css("outline", "");
            });
        }
    });
});