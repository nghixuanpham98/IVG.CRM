
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


function swapReportType(val, isDetail) {
    if (val.value == 1) {
        if (isDetail == 1) {
            $("#txtDetailReportTypeTitle").text("Click Report Wizard to create or modify the report");
            $("#rpDetailType2").hide();
            $("#rpDetailType3").hide();
            $("#rpDetailType1").show();
        } else {
            $("#txtReportTypeTitle").text("Click Report Wizard to create or modify the report");
            $("#rpType2").hide();
            $("#rpType3").hide();
            $("#rpType1").show();
        }
    } else if (val.value == 2) {
        if (isDetail == 1) {
            $("#txtDetailReportTypeTitle").text("File Location");
            $("#rpDetailType1").hide();
            $("#rpDetailType3").hide();
            $("#rpDetailType2").show();
        } else {
            $("#txtReportTypeTitle").text("File Location");
            $("#rpType1").hide();
            $("#rpType3").hide();
            $("#rpType2").show();
        }
    } else {
        if (isDetail == 1) {
            $("#txtDetailReportTypeTitle").text("File Location");
            $("#rpDetailType1").hide();
            $("#rpDetailType2").hide();
            $("#rpDetailType3").show();
        } else {
            $("#txtReportTypeTitle").text("Webpage URL");
            $("#rpType1").hide();
            $("#rpType2").hide();
            $("#rpType3").show();
        }
    }
}



/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});

