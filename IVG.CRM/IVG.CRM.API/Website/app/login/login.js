
$(document).ready(function () {
    $("#loader").hide();
});


$(document).on('keypress', function (e) {
    if (e.which == 13) {
        submitLogin();
    }
});


/*Login*/
function submitLogin() {
    var result = "";
    var browserName = "";
    var browserVersion = "";
    var device = "";

    try {
        result = bowser.getParser(window.navigator.userAgent);
        browserName = result.parsedResult.browser.name;
        browserVersion = result.parsedResult.browser.version;
        device = result.parsedResult.os.name;
    } catch (e) {
        console.log(e);
    }

    var username = $("#txtUsername").val();
    if (username == null || username === "" || username === "undefined") {
        alertWarning("Vui lòng nhập tài khoản");
        return;
    }

    var password = $("#txtPassword").val();
    if (password == null || password === "" || password === "undefined") {
        alertWarning("Vui lòng nhập mật khẩu");
        return;
    }

    var settings = {
        "url": api_url + "users/login",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "username": username,
            "password": password,
            "browserName": browserName,
            "browserVersion": browserVersion,
            "device": device
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            $("#loader").hide();

            window.localStorage.setItem("localStorageList", JSON.stringify(rs));

            var full = window.location.protocol
                + '//'
                + window.location.hostname
                + (window.location.port ? ':' + window.location.port : '');

            var first = $(location).attr('pathname');
            first.indexOf(1);
            first.toLowerCase();
            first = first.split("/")[1];

            parent.window.location.href = full + "/" + first;
        } else {
            $("#loader").hide();
            alertError(rs.messVN);
            console.log(rs);
        }
    });
}


/*Alert*/
function alertError(message) {
    try {
        toastr.error("", message, { timeOut: 3000 });
    } catch (e) {
        console.log(e);
        alert(message);
    }
}

function alertSuccess(message) {
    try {
        toastr.success("", message, { timeOut: 3000 });
    } catch (e) {
        console.log(e);
        alert(message);
    }
}

function alertSuccessSpecial(message) {
    try {
        toastr.success("", message, { timeOut: 5000 });
    } catch (e) {
        console.log(e);
        alert(message);
    }
}

function alertWarning(message) {
    try {
        toastr.warning("", message, { timeOut: 3000 });
    } catch (e) {
        console.log(e);
        alert(message);
    }
}