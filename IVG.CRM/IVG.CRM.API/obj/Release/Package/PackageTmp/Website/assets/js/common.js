var token = "";
var userID = "";
var login_url = '/Website/app/login/';
var localStorageInfo = JSON.parse(storageGetItem("localStorageList"));

var common_api_url = window.location.origin + '/api/';
var common_guid_empty = '00000000-0000-0000-0000-000000000000';


$(document).ready(function () {
    if (localStorageInfo == null) {
        returnLogin();
    } else {
        checkForUpdate();

        try {
            $(".datePickerCustom").datetimepicker({
                format: 'Y-m-d',
                timepicker: false,
            });

            $(".dateTimePickerCustom").datetimepicker({
                format: 'Y-m-d H:m',
                timepicker: false,
            });
        } catch (e) {
            console.log(e);
        }

        try {
            toastr.options.showMethod = "slideDown";
            toastr.options.hideMethod = "slideUp";
            toastr.options.closeMethod = "slideUp";
            toastr.options.progressBar = true;
            toastr.options.rtl = true;
            toastr.options.positionClass = "toast-bottom-right";
        } catch (e) {
            console.log(e);
        }
    }
});


/*Logout*/
function returnLogin() {
    if (userID != null && userID !== "" && userID !== "undefined") {
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


        var settings = {
            "url": api_url + "users/logout",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "userID": userID,
                "browserName": browserName,
                "browserVersion": browserVersion,
                "device": device
            }),
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            if (rs.code == 200) {
                console.log(rs);
                $("#loader").hide();
            } else {
                console.log(rs);
                $("#loader").hide();
            }
        });
    }

    storageClear();

    var urls = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    var urlLogin = urls + login_url;

    parent.window.location.href = urlLogin;
}


/*Check update*/
function checkForUpdate() {
    if (window.applicationCache != undefined && window.applicationCache != null) {
        window.applicationCache.addEventListener('updateready', updateApplication);
    }
}


function updateApplication(event) {
    if (window.applicationCache.status != 4) return;
    window.applicationCache.removeEventListener('updateready', updateApplication);
    window.applicationCache.swapCache();
    window.location.reload();
}


/*Local Storage*/
function storageGetItem(itemname) {
    return parent.window.localStorage.getItem(itemname);
}


function storageRemoveItem(itemname) {
    parent.window.localStorage.removeItem(itemname);
}


function storageClear() {
    storageRemoveItem("localStorageList");
    window.localStorage.clear();
}


/*Cookies*/
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


/*Format*/
function formatNumber(n) {
    try {
        var x = Math.round(n * 100) / 100;

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    } catch (e) {
        return n;
    }
}


function formatDate(date, fm) {
    date = new Date(date);
    try {
        if (fm == "yyyy-mm-dd") {
            var dateFm = + date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));

            return dateFm;
        }

        if (fm == "yyyy-mm-dd hh:ss") {
            var dateFm = + date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());

            return dateFm;
        }

        if (fm == "mm-dd-yyyy") {
            var dateFm = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
            return dateFm;
        }

        if (fm == "mm-dd-yyyy hh:ss") {
            var dateFm = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear() + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
            return dateFm;
        }

        if (fm == "dd-mm-yyyy") {
            var dateFm = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + date.getFullYear();
            return dateFm;
        }

        if (fm == "dd/mm/yyyy") {
            var dateFm = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
            return dateFm;
        }

        if (fm == "dd-mm-yyyy hh:ss") {
            var dateFm = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + date.getFullYear() + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
            return dateFm;
        }

        if (fm == "dd-mm") {
            var dateFm = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
            return dateFm;
        }

        if (fm == "hh:ss") {
            var dateFm = ((date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()));
            return dateFm;
        }

        if (fm == "mm-yyyy") {
            var dateFm = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + date.getFullYear();
            return dateFm;
        }

        return date.toLocaleString();
    } catch (e) {

        return date;
    }
}


function timeSince(seconds) {
    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " năm trước";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " tháng trước";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " ngày trước";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " giờ trước";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " phút trước";
    }
    return Math.floor(seconds) + " giây trước";
}


function timeSinceSpecial(seconds) {
    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " năm";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " tháng";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " ngày";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " giờ";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " phút";
    }
    return "< 1 phút";
}


/*Check String Is a Url*/
function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};


/*Check empty or white space*/
function checkEmptyOrWhiteSpace(str) {
    return (str.match(/^\s*$/) || []).length > 0;
}


/*Check validate value*/
function checkValidateValue(val, type, nameType) {
    if (type == 1) {
        if (val == null || val === "" || val === "undefined") {
            return true;
        }

        if (nameType === 'phone' && checkValidatePhone(val)) {
            return true;
        } else if (nameType === 'email' && checkValidateEmail(val)) {
            return true;
        }
    } else if (type == 2) {
        if (val != null && val !== "" && val !== "undefined") {
            if (nameType === 'phone' && checkValidatePhone(val)) {
                return true;
            } else if (nameType === 'email' && checkValidateEmail(val)) {
                return true;
            } else if (nameType === 'website' && checkValidateWebsite(val)) {
                return true;
            }
        }
    } else {
        if (val == 0 || val == null || val === "" || val === "undefined") {
            return true;
        }
    }
}


/*Check validate email*/
function checkValidateEmail(text) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (mailFormat.test(text) == false) {
        return true;
    } else {
        return false;
    }
}


/*Check validate phone*/
function checkValidatePhone(text) {
    var phoneFormat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (phoneFormat.test(text) == false) {
        return true;
    } else {
        return false;
    }
}


/*Check validate phone*/
function checkValidateWebsite(text) {
    var website = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    if (website.test(text) == false) {
        return true;
    } else {
        return false;
    }
}


/*Warning missing value input*/
function warningInvalidValue(dom, type, nameType) {
    var html = "";
    var title = "";

    if (type == 1) {
        if (nameType === 'text') {
            html += `<i class="fa-solid fa-circle-info me-1"></i>Vui lòng nhập đầy đủ thông tin`;
        } else if (nameType === 'email') {
            html += `<i class="fa-solid fa-circle-info me-1"></i>Email không đúng định dạng`;

            title = "Ví dụ: example@gmail.com";
        } else if (nameType === 'phone') {
            html += `<i class="fa-solid fa-circle-info me-1"></i>Số điện thoại không đúng định dạng`;

            title = "- Số điện thoại phải có ít nhất 10 ký tự số và tối đa 12 ký tự số\n- Ví dụ: 09xxxxxxxxx, +84xxxxxxxxx, (028)xxxxxxxx ...";
        } else if (nameType == 'file') {
            html += `<i class="fa-solid fa-circle-info me-1"></i>Dung lượng tệp tối đa là 2MB`;
        } else if (nameType == 'website') {
            html += `<i class="fa-solid fa-circle-info me-1"></i>Website không đúng định dạng`;

            title = "Ví dụ: www.example.com, https://example.com, ...";
        }

        $("#" + dom).focus(function () {
            $(this).css('border-color', 'red');

            $("#" + dom + "Block").attr("title", title);
        });

        $("#" + dom).blur(function () {
            $(this).css('border-color', '#e8ebf3');

            $("#" + dom + "Block" + " .warning-invalid__title").hide();

            $("#" + dom + "Block").attr("title", "");

            $("#" + dom).focus(function () {
                $(this).css('border-color', '#85a8db');
            });
        });

        $("#" + dom).trigger("focus");
    } else if (type == 2) {
        html += `<i class="fa-solid fa-circle-info me-1"></i>Vui lòng chọn thông tin`;

        $("#" + dom).next('.select2').find('.select2-selection').one('focus', function () {
            $(".select2-container--focus").css({ 'border': '1px solid red', 'border-radius': '4px' });
        })

        $("#" + dom).next('.select2').find('.select2-selection').one('blur', function () {
            $(".select2-container--focus").css('border', 'unset');

            $("#" + dom + "Block" + " .warning-invalid__title").hide();
        })

        $("#" + dom).select2("focus");
    }

    $("#" + dom + "Block" + " .warning-invalid__title").html(html);
    $("#" + dom + "Block" + " .warning-invalid__title").show();
}


/*Auto complete*/
function initAutoComplete(inputSelector, nameAPI, getData, onSelectCallback) {
    $(inputSelector).autocomplete({
        source: function (request, response) {
            getData(request.term, nameAPI, function (rs) {
                if (rs.code == 200) {
                    var data = rs.data;

                    response($.map(data, function (item) {
                        if (item.Code != null && item.Code !== "" && item.Code !== "undefined") {
                            return {
                                label: item.Code + " - " + item.Name,
                                value: item.Code + " - " + item.Name,
                                id: item.ID
                            };
                        } else {
                            return {
                                label: item.Name,
                                value: item.Name,
                                id: item.ID
                            };
                        }
                    }));
                } else {
                    alertError("Đã có lỗi xảy ra");
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            $(inputSelector).val(ui.item.value);
            onSelectCallback(ui.item);
        },
    });
}


function getDataByKey(data, nameAPI, callback) {
    var settings = {
        "url": api_url + nameAPI + "/auto-complete?key=" + data,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        callback(response);
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


function alertWarning(message) {
    try {
        toastr.warning("", message, { timeOut: 3000 });
    } catch (e) {
        console.log(e);
        alert(message);
    }
}



function common_fill_dropdown(id, data) {
    try {
        $('#' + id).html('');
        if (data.length > 0) {
            var option = `<option>---</option>`;
            for (var i = 0; i < data.length; i++) {
                option += `<option value="${data[i].ID}">${data[i].Name}</option>`;
            }
            $('#' + id).append(option);
            $('#' + id).select2();
        }
    } catch (e) {

    }
}

function common_district_by_province() {
    try {
        var ProvinceID = $('#ddlProvince option:selected').val();
        if (ProvinceID != '') {

            $.ajax({
                url: common_api_url + 'MasterData/DistByProv',
                type: "POST",
                data: { ProvinceID: ProvinceID },
                success: function (rs) {
                    $('#ddlDistrict').html('');
                    $('#ddlWard').html('');
                    if (rs.Data != undefined) {
                        common_fill_dropdown('ddlDistrict', rs.Data.map(x => ({ ID: x.DistrictID, Name: x.DistrictName })))
                    }
                }
            });

        }
    } catch (e) {

    }
}

function common_ward_by_dist_prov() {
    try {
        var ProvinceID = $('#ddlProvince option:selected').val();
        var DistrictID = $('#ddlDistrict option:selected').val();

        if (ProvinceID != '' && DistrictID != '') {
            $.ajax({
                url: common_api_url + 'MasterData/WardByDistProv',
                type: "POST",
                data: { ProvinceID: ProvinceID, DistrictID: DistrictID },
                success: function (rs) {
                    console.log(rs)
                    if (rs.Data != undefined) {
                        common_fill_dropdown('ddlWard', rs.Data.map(x => ({ ID: x.WardID, Name: x.WardName })))
                    }
                }
            });
        }
    } catch (e) {

    }
}


function common_verify_phone(id) {
    var error = '';
    var value = $('#' + id).val();
    var isNum = $.isNumeric(value);

    if (value != "" && (!isNum || value.length < 10)) {
        error = 'Số điện thoại không hợp lệ'
    }
    return error;
}

function common_verify_email(id) {
    var error = '';
    var value = $('#' + id).val();

    if (value != "") {
        if (value.indexOf(".") != -1 && value.indexOf("@@") != -1) {
            error = '';
        }
        else {
            error = 'Email không hợp lệ!';
        }
    }
    return error;
}

function common_get_myid() {
    if (localStorage.getItem("localStorageList") != null) {
        var list = JSON.parse(localStorage.getItem("localStorageList"));
        if (list.data.user.ID != undefined) {
            return list.data.user.ID;
        }
        else return common_guid_empty;
    }
    else return common_guid_empty;
}
