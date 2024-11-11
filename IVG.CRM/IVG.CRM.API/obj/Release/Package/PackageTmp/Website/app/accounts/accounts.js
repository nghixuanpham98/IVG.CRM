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


/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});


BindData(1);
function BindData(pageNo) {
    try {
        $.ajax({
            url: common_api_url + 'Account/List',
            type: "POST",
            data: {
                "PageIndex": pageNo,
                "PageSize": 25,
                "TableViewName": "[dbo].[vw_Accounts]",
                "Columns": "*",
                "OrderByColumn": "CreatedOn",
                "OrderByDirection": "DESC",
            },
            success: function (rs) {
                console.log(rs);

                $('#tblData').html('');

                for (var i = 0; i < rs.Data.length; i++) {
                    var checkbox = `<input type="checkbox" class="check-xs cursor-pointer ck-row" data-id="${rs.Data[i].ID}" />`;
                    var iconQualified = `<span class="badge rounded-pill bg-secondary fw-bold">Draft</span>`;
                    if (rs.Data[i].QualifiedOn != null) {
                        iconQualified = `<span class="badge rounded-pill bg-success fw-bold">Qualified</span>`;
                    }
                    var html = ` <tr> `;
                    html += `<td class="text-center">${checkbox}</td>`;
                    html += `<td class="table-detail" onclick="Detail('${rs.Data[i].AccountID}')">${(rs.Data[i].AccountName != null ? rs.Data[i].AccountName : '')}</td>`;
                    html += `<td>${(rs.Data[i].MainPhone != null ? rs.Data[i].MainPhone : '')}</td>`;
                    html += `<td>${(rs.Data[i].ContactName != null ? rs.Data[i].FullAddress : '')}</td>`;
                    html += `<td>${(rs.Data[i].ContactName != null ? rs.Data[i].ContactName : '')}</td>`;
                    html += `<td>${(rs.Data[i].ContactEmail != null ? rs.Data[i].ContactEmail : '')}</td>`;
                    html += `</tr>`;



                    //{
                    //    "AccountID": "3ef8f634-737c-4b7c-8e0e-0b1675232878",
                    //    "AccountName": "IVG",
                    //    "Website": "phungln@ivg.vn",
                    //    "Email": "phungln@ivg.vn",
                    //    "MainPhone": "0932032276",
                    //    "OtherPhone": null,
                    //    "FullAddress": "hai ba trung, Phường 13, Quận 3, Thành phố Hồ Chí Minh",
                    //    "Address": "hai ba trung",
                    //    "ProvinceID": "bddd74e3-a988-4eca-b0aa-940a3a28b6d9",
                    //    "ProvinceName": "Thành phố Hồ Chí Minh",
                    //    "DistrictID": "31446ce0-44c5-4bf2-9d24-701a178e0256",
                    //    "DistrictName": "Quận 3",
                    //    "WardID": "a6d0792a-645a-44d0-9deb-6a6e27966bb2",
                    //    "WardName": "Phường 13",
                    //    "OwnerID": null,
                    //    "OwnerName": " ",
                    //    "Description": null,
                    //    "IsActive": true,
                    //    "CreatedOn": "2024-05-29T11:05:10.773",
                    //    "CreatedBy": "00000000-0000-0000-0000-000000000000",
                    //    "CreatedByName": " ",
                    //    "ModifiedOn": null,
                    //    "ModifiedBy": null,
                    //    "ModifiedByName": " ",
                    //    "ContactID": "b7d4d8ab-8776-4dbc-914d-61be549a6c33",
                    //    "ContactName": "Phung Ly",
                    //    "ContactMainPhone": "0932032276",
                    //    "ContactOtherPhone": null,
                    //    "ContactEmail": "phungln@ivg.vn"
                    //}



                    $('#tblData').append(html);
                }
            }
        });

    } catch (e) {
        console.log(e);
    }
}


function Delete(isConfirm) {
    try {
        isConfirm = isConfirm != undefined ? true : false;
        if (isConfirm) {
            $.ajax({
                url: common_api_url + 'Account/Delete',
                type: "POST",
                data: { ID: $('#hdfID').val() },
                success: function (rs) {
                    if (rs.Success != undefined) {
                        alertSuccess(rs.Success);
                        back_to_list();
                    }
                    if (rs.Error != undefined) {
                        alertError(rs.Error);
                        $('.btn-close').click();
                    }
                }
            });

        }
        else {
            $('#btnmodalConfirmDelete').click();
        }
    } catch (e) {

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



function Detail(ID) {
    try {



        $.ajax({
            url: common_api_url + 'Account/Detail',
            type: "POST",
            data: { ID: ID },
            success: function (rs) {

                //loadinfo
                //load primary contact

                //load contact list

                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }
                if (rs.MasterData != undefined) {

                    var MD = rs.MasterData;

                    if (MD.Provinces != undefined && MD.Provinces.length > 0) {
                        common_fill_dropdown('ddlProvince', MD.Provinces.map(x => ({ ID: x.ProvinceID, Name: x.ProvinceName })))
                    }
                    if (MD.Districts != undefined && MD.Districts.length > 0) {
                        common_fill_dropdown('ddlDistrict', MD.Districts.map(x => ({ ID: x.DistrictID, Name: x.DistrictName })))
                    }
                    if (MD.Wards != undefined && MD.Wards.length > 0) {
                        common_fill_dropdown('ddlWard', MD.Wards.map(x => ({ ID: x.WardID, Name: x.WardName })))
                    }
                    if (MD.LeadSource != undefined) {
                        common_fill_dropdown('ddlSourceID', MD.LeadSource.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                    if (MD.LeadStatus != undefined) {
                        common_fill_dropdown('ddlStatusID', MD.LeadStatus.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                    console.log(`rs.MasterData`, rs.MasterData);
                }
                var isQualified = false;
                if (rs.Data != undefined) {
                    console.log(`rs.Data`, rs.Data)
                    $('#hdfID').val(rs.Data.ID);
                    $('#txtTopic').val(rs.Data.Topic);
                    $('#txtFirstName').val(rs.Data.FirstName);
                    $('#txtLastName').val(rs.Data.LastName);
                    $('#txtJobTitle').val(rs.Data.JobTitle);
                    $('#txtMainPhone').val(rs.Data.MainPhone);
                    $('#txtOtherPhone').val(rs.Data.OtherPhone);
                    $('#txtEmail').val(rs.Data.Email);
                    $('#txtDescription').val(rs.Data.Description);
                    $('#txtCompany').val(rs.Data.Company);
                    $('#txtWebsite').val(rs.Data.Website);
                    $('#txtAddress').val(rs.Data.Address);

                    $('#ddlProvince').val(rs.Data.ProvinceID);
                    $('#ddlDistrict').val(rs.Data.DistrictID);
                    $('#ddlWard').val(rs.Data.WardID);
                    $('#ddlSourceID').val(rs.Data.SourceID);
                    $('#ddlStatusID').val(rs.Data.StatusID);

                    if (rs.Data.QualifiedOn != null) {
                        isQualified = true;
                    }

                    $('.select2').select2();

                    $('#lblHeader').text(rs.Data.Name);
                }

                $('#contentList').hide();
                $('#contentDetail').show();
                $('.btn-for-detail').show();
                if (isQualified) {
                    $('.form-control').prop('disabled', true);
                    $('.select2').prop('disabled', true);
                    $('.select2').select2();
                    $('.btn-for-detail').hide();
                    $('.btn-for-update').hide();
                }
                else {
                    $('.btn-for-update').show();
                }
                NoteList();
            }
        });

    } catch (e) {
        console.log(e);
    }
}

function New() {
    try {

        $.ajax({
            url: common_api_url + 'Account/New',
            type: "GET",
            success: function (rs) {
                if (rs.Data != undefined) {
                    if (rs.Data.Provinces != undefined) {
                        common_fill_dropdown('ddlProvince', rs.Data.Provinces.map(x => ({ ID: x.ProvinceID, Name: x.ProvinceName })))
                    }
                }

                //reset form input
                $('.form-control').val('');
                $('.btn-for-detail').hide();
                $('#lblHeader').text('CREATE NEW LEAD');
                $("#contentList").hide();
                $("#contentDetail").show();
            }
        });

    } catch (e) {

    }
}

function back_to_list() {
    try {
        $("#contentList").show();
        $("#contentDetail").hide();
        BindData(1);
    } catch (e) {

    }
}

function get_data_save_db() {
    try {

        var data = {
            ID: $('#hdfID').val(),
            Topic: $('#txtTopic').val(),
            FirstName: $('#txtFirstName').val(),
            LastName: $('#txtLastName').val(),
            JobTitle: $('#txtJobTitle').val(),
            MainPhone: $('#txtMainPhone').val(),
            OtherPhone: $('#txtOtherPhone').val(),
            Email: $('#txtEmail').val(),
            SourceID: $('#ddlSourceID option:selected').val(),
            Description: $('#txtDescription').val(),
            Company: $('#txtCompany').val(),
            Website: $('#txtWebsite').val(),
            ProvinceID: $('#ddlProvince option:selected').val(),
            DistrictID: $('#ddlDistrict option:selected').val(),
            WardID: $('#ddlWard option:selected').val(),
            Address: $('#txtAddress').val(),
            StatusID: $('#ddlStatusID option:selected').val(),
        };

        return data;

    } catch (e) {
        return null;
    }
}


function Save(isClose) {
    try {
        var data = {
            Lead: get_data_save_db()
        };

        $.ajax({
            url: common_api_url + 'Account/Update',
            type: "POST",
            data: data,
            success: function (rs) {
                if (rs.Success != undefined) {
                    alertSuccess(rs.Success);
                }
                if (isClose) back_to_list();
            }
        });
    } catch (e) {

    }
}


function Qualified(isConfirm) {

    try {
        if (isConfirm) {

            var data = {
                IsQualifiedLead: true,
                ID: $('#hdfID').val(),
                MyID: common_get_myid(),
            };

            $.ajax({
                url: common_api_url + 'Account/Update',
                type: "POST",
                data: data,
                success: function (rs) {

                    if (rs.Success != undefined) {
                        alertSuccess(rs.Success);
                    }
                    if (rs.Error != undefined) {
                        alertError(rs.Error);
                    }
                    back_to_list();
                }
            });
        }
        else {
            $('#btnmodalConfirmQualify').click();
        }

    } catch (e) {

    }
}


function NoteUpdate() {
    try {
        var data = {
            ParentID: $('#hdfID').val(),
            Title: $('#txtNoteTitle').val(),
            Note: $('#txtNote').val(),
        };
        var frmData = new FormData(document.getElementById('frmAttachment'));
        frmData.append('LeadNote', JSON.stringify(data));

        $.ajax({
            url: common_api_url + 'Account/NoteUpdate',
            type: "POST",
            data: frmData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (rs) {
                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }
                document.getElementById('fileUpload').value = '';
                $('#txtNote').val('');
                $('#txtNoteTitle').val('');
                NoteList();
            }
        });

    } catch (e) {

    }
}







function NoteDelete(ID) {
    try {
        var data = {
            ID: ID
        };

        $.ajax({
            url: common_api_url + 'Account/NoteDelete',
            type: "POST",
            data: data,
            success: function (rs) {
                NoteList();
            }
        });
    } catch (e) {

    }
}



function NoteDown(ID) {
    try {
        var data = {
            ID: ID
        };

        $.ajax({
            url: common_api_url + 'Account/NoteDown',
            type: "POST",
            data: data,
            success: function (rs) {

                console.log(`New`, rs);

            }
        });
    } catch (e) {

    }
}

function NoteList() {
    try {
        var data = {
            ID: $('#hdfID').val(),
        };

        $.ajax({
            url: common_api_url + 'Account/NoteList',
            type: "POST",
            data: data,
            success: function (rs) {
                $('#tblAttach').html('');
                if (rs.Data != undefined) {
                    for (var i = 0; i < rs.Data.length; i++) {

                        var iconDel = `<button class="btn btn-sm ivg-button-danger" onclick="NoteDelete('${rs.Data[i].ID}')"><i class="fas fa-trash"></i></button>`;

                        var listFiles = '';

                        if (rs.Files != undefined) {
                            var files = rs.Files.filter(x => x.NoteID == rs.Data[i].ID);
                            if (files != undefined && files.length > 0) {
                                for (var j = 0; j < files.length; j++) {
                                    var file = `<a download="${files[j].FileName}" target="_blank" href="${files[j].FileBase64}""><i class="fas fa-paperclip"></i> ${files[j].FileName}</a>`
                                    file += `<a title="Click to delete file" href="javascript:void(0);" onclick="NoteDeleteFile('${files[j].ID}')"><b><i class="fas fa-times text-danger"></i></b></a> <br />`
                                    listFiles += file;
                                }
                            }
                        }

                        var html = ``;
                        html += `<tr>`;
                        html += `<td>${(rs.Data[i].Title != null ? rs.Data[i].Title : '')}</td>`;
                        html += `<td>${(rs.Data[i].Note != null ? rs.Data[i].Note : '')}</td>`;
                        html += `<td>${listFiles}</td>`;
                        html += `<td>${(rs.Data[i].CreatedOn != null ? formatDate(rs.Data[i].CreatedOn, 'yyyy-mm-dd hh:ss') : '')}</td>`;
                        html += `<td>${iconDel}</td>`;
                        html += `</tr>`;

                        $('#tblAttach').append(html);

                    }
                }
            }
        });
    } catch (e) {

    }
}


function NoteDeleteFile(ID) {
    try {
        var data = {
            ID: ID,
            ParentID: $('#hdfID').val(),
        };

        $.ajax({
            url: common_api_url + 'Account/NoteDeleteFile',
            type: "POST",
            data: data,
            success: function (rs) {

                console.log(`New`, rs);
            }
        });
    } catch (e) {

    }
}



