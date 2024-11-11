
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



BindData(1);
function BindData(pageNo) {
    try {

        $('#tblData').html('');
        $('#tblData').html('');

        var thead = ``;
        thead += `<thead>`;
        thead += `<tr>`;
        thead += `<th>Name</th>`;
        thead += `<th>Status</th>`;
        thead += `<th>Total Amount</th>`;
        thead += `<th>Account</th>`;
        thead += `<th>Created On</th>`;
        thead += `</tr>`;
        thead += `</thead>`;

        $('#tblData').css('width', '100%');
        $('#tblData').append(thead);
        var tbody = ``;

        var data = [];
        var index = 1;

        data.push({ Topic: `phần mềm ghi âm`, Status: 'Draft', TotalAmount: '25,000,000.00', Account: 'IVG JSC.' , CreatedOn: '2024-05-15'}); index++;

        var tbody = ``;

        for (var i = 0; i < data.length; i++) {
            tbody += `<tr ondblclick="Detail()">`;
            tbody += `<td>${data[i].Topic}</td>`;
            tbody += `<td>${data[i].Status}</td>`;
            tbody += `<td>${data[i].TotalAmount}</td>`;
            tbody += `<td>${data[i].Account}</td>`;
            tbody += `<td>${data[i].CreatedOn}</td>`;
            tbody += `</tr>`;
        }
        tbody = `<tbody>${tbody}</tbody>`;
        $('#tblData').append(tbody);

    } catch (e) {
        console.log(e);
    }
}


function Detail(back) {
    try {
        back = back != undefined ? true : false;
        if (back) {
            $('.ivg-page-list').show();
            $('.ivg-page-detail').hide();
        }
        else {

            $('.ivg-page-list').hide();
            $('.ivg-page-detail').show();
        }
        //var rd = Math.random();
        //var url = `/app/vendor/vendor-detail.html?ver=${rd}`;
        //$('.ivg-page-content', parent.document).attr('src', url);
    } catch (e) {
        console.log(e);
    }
}


function ViewWebSite() {
    try {
        var link = $('#txtWebsite').val();
        $('#hdfLink').prop('href', link);
        document.getElementById('hdfLink').click();
    } catch (e) {
        console.log(e);
    }
}

function MailTo() {
    try {
        var link = $('#txtEmail').val();
        $('#hdfMailTo').prop('href', 'mailto:' + link);
        document.getElementById('hdfMailTo').click();
    } catch (e) {
        console.log(e);
    }
}


/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
}); 