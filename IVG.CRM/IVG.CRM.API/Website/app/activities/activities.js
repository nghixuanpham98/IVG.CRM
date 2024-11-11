
$(document).ready(function () {
    const quill = new Quill('#editor', {
        theme: 'snow'
    });

    const quillDetail = new Quill('#editorDetail', {
        theme: 'snow'
    });
});


/*Create*/
function viewCreate(key) {
    if (key) {
        if (key == 1) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreateTask").show();
        } else if (key == 2) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreateEmail").show();
        } else if (key == 3) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreatePhoneCall").show();
        } else if (key == 4) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreateAppointment").show();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentCreateTask").hide();
        $("#contentCreateEmail").hide();
        $("#contentCreatePhoneCall").hide();
        $("#contentCreateAppointment").hide();
        $("#contentList").show();
    }
}


/*Detail*/
function viewDetails(id) {
    if (id) {
        if (id == 1) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailTask").show();
        } else if (id == 2) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailEmail").show();
        } else if (id == 3) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailPhoneCall").show();
        } else if (id == 3) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailAppointment").show();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentDetailTask").hide();
        $("#contentDetailEmail").hide();
        $("#contentDetailPhoneCall").hide();
        $("#contentDetailAppointment").hide();
        $("#contentList").show();
    }
}



/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});

