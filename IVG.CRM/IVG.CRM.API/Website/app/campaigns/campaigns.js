

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

        $('#tblData thead').html('');
        $('#tblData tbody').html('');

        var thead = ``;
        thead += `<tr>`;
        thead += `<th>Account Name</th>`;
        thead += `<th>Main Phone</th>`;
        thead += `<th>Fax</th>`;
        thead += `<th>Website</th>`;
        thead += `<th>Address 1: City</th>`;
        thead += `<th>Description</th>`;
        thead += `</tr>`;

        $('#tblData').css('width', '100%');
        $('#tblData thead').html(thead);

        var data = [];
        var index = 1;

        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;
        data.push({ AccountName: `IVG ${index}`, MainPhone: `093209991${index}`, Fax: '', Website: '', Address: '', Description: '' }); index++;

        var tbody = ``;

        for (var i = 0; i < data.length; i++) {
            tbody += `<tr ondblclick="Detail()">`;
            tbody += `<td>${data[i].AccountName}</td>`;
            tbody += `<td>${data[i].MainPhone}</td>`;
            tbody += `<td>${data[i].Fax}</td>`;
            tbody += `<td>${data[i].Website}</td>`;
            tbody += `<td>${data[i].Address}</td>`;
            tbody += `<td>${data[i].Description}</td>`;
            tbody += `</tr>`;
        }

        $('#tblData tbody').html(tbody);

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

