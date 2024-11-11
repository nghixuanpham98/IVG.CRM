
$(document).ready(function () {

});


/*Create*/
function viewCreate(key) {
    if (key) {
        $("#contentList").hide();
        $("#contentDetail").hide();
        $("#contentCreate").show();
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentList").show();
    }
}


/*Detail*/
function viewDetails(id) {
    if (id) {
        $("#contentList").hide();
        $("#contentDetail").show();
    } else {
        $("#contentList").show();
        $("#contentDetail").hide();
    }
}



/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});

