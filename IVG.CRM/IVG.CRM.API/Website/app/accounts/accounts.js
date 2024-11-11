$(document).ready(function () {
    var url = new URL(window.location.href);

    var ID = url.searchParams.get('ID');

    if (ID == undefined || ID == null) return;

    Detail(ID);
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
        $('#loader').show();
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

                $('#loader').hide();

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
                    html += `<td>${(rs.Data[i].FullAddress != null ? rs.Data[i].FullAddress : '')}</td>`;
                    html += `<td>${(rs.Data[i].ContactName != null ? rs.Data[i].ContactName : '')}</td>`;
                    html += `<td>${(rs.Data[i].ContactEmail != null ? rs.Data[i].ContactEmail : '')}</td>`;
                    html += `</tr>`;

                    $('#tblData').append(html);

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

function Detail(ID) {
    try {
        $('#loader').show();
        $.ajax({
            url: common_api_url + 'Account/Detail',
            type: "POST",
            data: { ID: ID },
            success: function (rs) {
                $('#loader').hide();
                console.log(`Account/Detail`, rs)

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

                    $('#hdfID').val(rs.Data.AccountID);
                    $('#txtName').val(rs.Data.AccountName);
                    $('#txtMainPhone').val(rs.Data.MainPhone);
                    $('#txtOtherPhone').val(rs.Data.OtherPhone);
                    $('#txtEmail').val(rs.Data.Email);
                    $('#txtDescription').val(rs.Data.Description);
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

                    $('#lblHeader').text(rs.Data.AccountName);

                    //load primary contact
                    if (rs.Data.ContactID != null) {
                        load_primary_contact(rs.Data.ContactID);
                    }

                    //load contact list
                    load_contact_list(rs.Data.AccountID);
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
function load_primary_contact(ID) {
    try {
        $('#loader').show();
        $.ajax({
            url: common_api_url + 'Contact/Detail',
            type: "POST",
            data: {
                ID: ID
            },
            success: function (rs) {

                $('#loader').hide();
                if (rs.Data != undefined) {
                    var fullname = `${(rs.Data.FirstName != null ? rs.Data.FirstName : '')}` + ' ' + `${(rs.Data.LastName != null ? rs.Data.LastName : '')}`;
                    $('#hdfPrimaryContactID').val(rs.Data.ID);
                    $('#txtContactName').val(fullname);
                    $('#txtContactEmail').val(rs.Data.Email);
                    $('#txtContactMainPhone').val(rs.Data.MainPhone);
                }
            }
        });

    } catch (e) {

    }
}

function load_contact_list(ID) {
    try {
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Contact/ListByID',
            type: "POST",
            data: { AccountID: ID },
            success: function (rs) {
                $('#loader').hide();

                $('#tblContactList').html('');

                if (rs.Data != undefined) {
                    for (var i = 0; i < rs.Data.length; i++) {
                        var html = `<tr>`;
                        html += `<td class="table-detail" onclick="view_contact('${rs.Data[i].ContactID}')">${(rs.Data[i].FullName != null ? rs.Data[i].FullName : '')}</td>`;
                        html += `<td>${(rs.Data[i].MainPhone != null ? rs.Data[i].MainPhone : '')}</td>`;
                        html += `</tr>`;
                        $('#tblContactList').append(html);
                    }
                }
            }
        });
    } catch (e) {

    }
}

function New() {
    try {

        $.ajax({
            url: common_api_url + 'Account/New',
            type: "GET",
            success: function (rs) {

                //reset form input
                $('.form-control').val('');
                $('.btn-for-detail').hide();
                $('#lblHeader').text('CREATE NEW ACCOUNT');
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
            AccountID: $('#hdfID').val(),
            AccountName: $('#txtName').val(),
            MainPhone: $('#txtMainPhone').val(),
            OtherPhone: $('#txtOtherPhone').val(),
            Email: $('#txtEmail').val(),
            Website: $('#txtWebsite').val(),
            Description: $('#txtDescription').val(),
            ProvinceID: $('#ddlProvince option:selected').val(),
            DistrictID: $('#ddlDistrict option:selected').val(),
            WardID: $('#ddlWard option:selected').val(),
            Address: $('#txtAddress').val(),
            ContactID: $('#hdfPrimaryContactID').val(),
        };

        return data;

    } catch (e) {
        return null;
    }
}


function Save(isClose) {
    try {
        $('#loader').show();
        var data = {
            Account: get_data_save_db()
        };

        $.ajax({
            url: common_api_url + 'Account/Update',
            type: "POST",
            data: data,
            success: function (rs) {
                $('#loader').hide();
                if (rs.Success != undefined) {
                    alertSuccess(rs.Success);
                    if (isClose) back_to_list();
                }

                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }
            }
        });
    } catch (e) {

    }
}

function verify_input_required_contact() {
    $('.field-required.contact').each(function () {
        var value = $(this).val();
        if (value == '') {
            $(this).addClass('is-invalid');
        }
        else {
            $(this).removeClass('is-invalid');
        }
    });
}

function get_data_save_db_contact() {
    try {

        var data = {
            Topic: $('#txtContTopic').val(),
            FirstName: $('#txtContFirstName').val(),
            LastName: $('#txtContLastName').val(),
            JobTitle: $('#txtContJobTitle').val(),
            MainPhone: $('#txtContMainPhone').val(),
            OtherPhone: $('#txtContOtherPhone').val(),
            Email: $('#txtContEmail').val(),
            SourceID: $('#ddlSourceID option:selected').val(),
            Description: $('#txtContDescription').val(),
            AccountID: $('#hdfID').val(),
            Website: $('#txtContWebsite').val(),
            //ProvinceID: $('#ddlProvince option:selected').val(),
            //DistrictID: $('#ddlDistrict option:selected').val(),
            //WardID: $('#ddlWard option:selected').val(),
            Address: $('#txtContAddress').val(),
            ModifiedBy: common_get_myid(),
        };

        return data;

    } catch (e) {
        return null;
    }
}

function NewContact(isConfirm) {
    try {
        if (isConfirm) {

            verify_input_required_contact();

            if ($('.field-required.contact').hasClass('is-invalid')) return;

            $('#loader').show();

            $.ajax({
                url: common_api_url + 'Contact/Update',
                type: "POST",
                data: {
                    Contact: get_data_save_db_contact()
                },
                success: function (rs) {

                    $('#loader').hide();

                    if (rs.Error != undefined) {
                        alertError(rs.Error);
                    }

                    if (rs.Success != undefined) {
                        alertSuccess(rs.Success);
                        //bind lại list
                        if (rs.AccountID != undefined)
                            load_contact_list(rs.AccountID);
                        $('.btn-close').click();
                    }

                }
            });
        }
        else {
            $('.field-required.contact').removeClass('is-invalid')
            $('.field-required.contact').val('');

            $('#txtContactAccountName').val($('#txtName').val());

            $('#btnmodalCreateContact').click();
        }
    } catch (e) {

    }
}
 
 