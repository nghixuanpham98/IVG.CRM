$(document).ready(function () {
    var url = new URL(window.location.href);

    var ID = url.searchParams.get('ID');

    if (ID == undefined || ID == null) return;

    Detail(ID);
});
  
BindData(1);

function BindData(pageNo) {
    try {
        $('#loader').show();
        $.ajax({
            url: common_api_url + 'Contact/List',
            type: "POST",
            data: {
                "PageIndex": pageNo,
                "PageSize": 25,
                "TableViewName": "[dbo].[vw_Contacts]",
                "Columns": "*",
                "OrderByColumn": "CreatedOn",
                "OrderByDirection": "DESC",
            },
            success: function (rs) {

                $('#loader').hide();

                $('#tblData').html('');

                for (var i = 0; i < rs.Data.length; i++) {
                    var checkbox = `<input type="checkbox" class="check-xs cursor-pointer ck-row" data-id="${rs.Data[i].LeadID}" />`;
                    var iconQualified = `<span class="badge rounded-pill bg-secondary fw-bold">Draft</span>`;
                    if (rs.Data[i].QualifiedOn != null) {
                        iconQualified = `<span class="badge rounded-pill bg-success fw-bold">Qualified</span>`;
                    }
                    var html = ` <tr> `;
                    html += `<td class="text-center">${checkbox}</td>`;
                    html += `<td class="table-detail" onclick="Detail('${rs.Data[i].ContactID}')">${(rs.Data[i].FullName != null ? rs.Data[i].FullName : '')}</td>`;
                    html += `<td>${(rs.Data[i].Email != null ? rs.Data[i].Email : '')}</td>`;
                    html += `<td>${(rs.Data[i].AccountName != null ? rs.Data[i].AccountName : '')}</td>`;
                    html += `<td>${(rs.Data[i].MainPhone != null ? rs.Data[i].MainPhone : '')}</td>`;
                    html += `</tr>`;

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
        $('#loader').show();
            $.ajax({
                url: common_api_url + 'Contact/Delete',
                type: "POST",
                data: { ID: $('#hdfID').val() },
                success: function (rs) {
        $('#loader').hide();
                    if (rs.Success != undefined) {
                        alertSuccess(rs.Success);
                        back_to_list();
                    }
                    if (rs.Error != undefined) {
                        alertError(rs.Error);
                    }
                    $('.btn-close').click();
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
        link = link.startsWith('http') ? link : (link.startsWith('www') ? 'https://' + link : 'https://www.' + link);
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
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Contact/Detail',
            type: "POST",
            data: { ID: ID },
            success: function (rs) {
                console.log(rs);

                $('#loader').hide();

                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }

                if (rs.MasterData != undefined) {

                    console.log(`rs.MasterData`, rs.MasterData);

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
                        common_fill_dropdown('ddlStatusID', MD.LeadStatus.map(x => ({ ID: x.StatusID, Name: x.Name })))
                    }

                    if (MD.DisqualifyStatus != undefined) {
                        $('#ddlDisqualify').html(``);

                        for (var i = 0; i < MD.DisqualifyStatus.length; i++) {
                            var html = `<li><a class="dropdown-item" href="javascript:void(0);" onclick="Disqualify(this)" data-id="${MD.DisqualifyStatus[i].StatusReasonID}" data-text="${MD.DisqualifyStatus[i].Name}">${MD.DisqualifyStatus[i].Name}</a></li>`
                            $('#ddlDisqualify').append(html);
                        }
                    }
                }

                if (rs.Data != undefined) {

                    //fill data to input
                    console.log(`rs.Data`, rs.Data);
                    $('#hdfID').val(rs.Data.ContactID);
                    $('#txtOwnerName').val(rs.Data.OwnerName);
                    $('#txtFirstName').val(rs.Data.FirstName);
                    $('#txtLastName').val(rs.Data.LastName);
                    $('#txtJobTitle').val(rs.Data.JobTitle);
                    $('#txtMainPhone').val(rs.Data.MainPhone);
                    $('#txtOtherPhone').val(rs.Data.OtherPhone);
                    $('#txtEmail').val(rs.Data.Email);
                    $('#txtDescription').val(rs.Data.Description);
                    $('#txtAccountName').val(rs.Data.AccountName);
                    $('#txtWebsite').val(rs.Data.Website);
                    $('#txtAddress').val(rs.Data.Address);

                    $('#ddlProvince').val(rs.Data.ProvinceID);
                    $('#ddlDistrict').val(rs.Data.DistrictID);
                    $('#ddlWard').val(rs.Data.WardID);
                    $('#ddlSourceID').val(rs.Data.SourceID);
                    $('#ddlStatusID').val(rs.Data.StatusID);

                    $('.select2').select2();
                    $('#lblHeader').text(rs.Data.FullName);

                    // show hide button by status id

                    $('.btn-for-update').hide();
                    $('.form-control').removeClass('ivg-input-link');
                    $('.form-control').removeClass('is-invalid');

                    $('#txtAccountName').addClass('ivg-input-link');
                    $('#txtAccountName').attr('onclick', `view_account('${rs.Data.AccountID}')`);
                     
                }

                $('#contentList').hide();
                $('#contentDetail').show();

                NoteList(); 
            }
        });

    } catch (e) {
        console.log(e);
    }
}
 

function enable_input() {
    $('.form-control').prop('readonly', false);
    $('.select2').prop('disabled', false);
    $('.select2').select2();
}

function disabled_input() {
    $('.form-control').prop('readonly', true);
    $('.select2').prop('disabled', true);
    $('.select2').select2();

}
 
function New() {
    try {
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Contact/New',
            type: "GET",
            success: function (rs) {
                $('#loader').hide();
                if (rs.Data != undefined) {
                    if (rs.Data.Provinces != undefined) {
                        common_fill_dropdown('ddlProvince', rs.Data.Provinces.map(x => ({ ID: x.ProvinceID, Name: x.ProvinceName })))
                    }
                }

                $('.form-control').removeClass('ivg-input-link');

                //select default value
                $('#ddlProvince').change();

                //reset form input
                $('.form-control').val('');
                $('.form-control').prop('disabled', false);
                $('.select2').prop('disabled', false);
                $('.select2').select2();

                $('.btn-for-update').hide();
                $('.btn-for-update.new').show();

                $('.pnlStatus').hide();
                $('#lblHeader').text('CREATE NEW CONTACT');
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
            ContactID: $('#hdfID').val(),
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
            ModifiedBy: common_get_myid(),
        };

        return data;

    } catch (e) {
        return null;
    }
}

function verify_input_required() {
    $('.field-required').each(function () {
        var value = $(this).val();
        if (value == '') {
            $(this).addClass('is-invalid');
        }
        else {
            $(this).removeClass('is-invalid');
        }
    });
}

function Save(isClose) {
    try {

        verify_input_required();

        if ($('.field-required').hasClass('is-invalid')) return;

        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Contact/Update',
            type: "POST",
            data: {
                Contact: get_data_save_db()
            },
            success: function (rs) {

                $('#loader').hide();

                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }

                if (rs.Success != undefined) {
                    alertSuccess(rs.Success);
                    if (isClose) {
                        back_to_list();
                    }
                    else {
                        Detail(rs.ID);
                    }
                }

            }
        });

    } catch (e) {

    }
}

function Qualified(isConfirm) {

    try {
        if (isConfirm) {
            $('#loader').show();

            var data = {
                IsQualifiedLead: true,
                ID: $('#hdfID').val(),
                MyID: common_get_myid(),
                AccountID: $('#hdfAccountID').val(),
                ContactID: $('#hdfContactID').val(),
            };

            $.ajax({
                url: common_api_url + 'Contact/Update',
                type: "POST",
                data: data,
                success: function (rs) {
                    $('#loader').hide();
                    console.log(rs);
                    //bị trùng dữ liệu > hiển thị lên danh sách để chọn account hoặc contact tương ứng
                    if (rs.IsDuplicate) {

                        $('#tblDupAccount').html(``);
                        $('#tblDupContact').html(``);

                        if (rs.Account != undefined) {
                            var html = ``;
                            html += `<tr>`;
                            html += `<td class="text-center"><input type="radio" name="ckAccount" id="ckAccount" checked value="${rs.Account.ID}" onchange="SelectDupAccount(this)" /></td>`;
                            html += `<td>${(rs.Account.Name != null ? rs.Account.Name : '')}</td>`;
                            html += `<td>${(rs.Account.Website != null ? rs.Account.Website : '')}</td>`;
                            html += `<td>${(rs.Account.MainPhone != null ? rs.Account.MainPhone : '')}</td>`;
                            html += `<td>${(rs.Account.OtherPhone != null ? rs.Account.OtherPhone : '')}</td>`;
                            html += `</tr>`;

                            $('#tblDupAccount').append(html);
                            $('#ckAccount').change();
                        }

                        if (rs.Contact != undefined) {
                            var html = ``;
                            html += `<tr>`;
                            html += `<td class="text-center"><input type="radio" name="ckContact" id="ckContact" checked value="${rs.Contact.ID}" onchange="SelectDupContact(this)" /></td>`;
                            html += `<td>${(rs.Contact.FirstName != null ? rs.Contact.FirstName : '')}</td>`;
                            html += `<td>${(rs.Contact.LastName != null ? rs.Contact.LastName : '')}</td>`;
                            html += `<td>${(rs.Contact.Email != null ? rs.Contact.Email : '')}</td>`;
                            html += `<td>${(rs.Contact.MainPhone != null ? rs.Contact.MainPhone : '')}</td>`;
                            html += `<td>${(rs.Contact.OtherPhone != null ? rs.Contact.OtherPhone : '')}</td>`;
                            html += `</tr>`;

                            $('#tblDupContact').append(html);
                            $('#ckContact').change();
                        }


                        $('#btnmodalDuplicateData').click();
                    }
                    else {
                        if (rs.Success != undefined) {
                            alertSuccess(rs.Success);
                        }
                        if (rs.Error != undefined) {
                            alertError(rs.Error);
                        }
                        back_to_list();
                        $('.btn-close').click();
                    }
                }
            });
        }
        else {
            $('#btnmodalConfirmQualify').click();
        }

    } catch (e) {

    }
}

function SelectDupAccount(checkbox) {
    var ck = $(checkbox).prop('checked');
    if (ck) {
        $('#hdfAccountID').val($(checkbox).val());
    }
    else {
        $('#hdfAccountID').val('');
    }
}

function SelectDupContact(checkbox) {
    var ck = $(checkbox).prop('checked');
    if (ck) {
        $('#hdfContactID').val($(checkbox).val());
    }
    else {
        $('#hdfContactID').val('');
    }
}
 