$(document).ready(function () {

});
  
BindData(1);

function BindData(pageNo) {
    try {
        $('#loader').show();
        $.ajax({
            url: common_api_url + 'Lead/List',
            type: "POST",
            data: {
                "PageIndex": pageNo,
                "PageSize": 25,
                "TableViewName": "[dbo].[vw_Leads]",
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
                    html += `<td class="table-detail" onclick="Detail('${rs.Data[i].LeadID}')">${(rs.Data[i].FirstName != null ? rs.Data[i].FirstName : '')} ${(rs.Data[i].LastName != null ? rs.Data[i].LastName : '')}</td>`;
                    html += `<td>${(rs.Data[i].Topic != null ? rs.Data[i].Topic : '')}</td>`;
                    html += `<td>${(rs.Data[i].OwnerName != null ? rs.Data[i].OwnerName : '')}</td>`;
                    html += `<td>${(rs.Data[i].StatusName != null ? rs.Data[i].StatusName : '')}</td>`;
                    html += `<td>${(rs.Data[i].StatusReasonName != null ? rs.Data[i].StatusReasonName : '')}</td>`;
                    //html += `<td>${iconQualified}</td>`;
                    html += `<td>${(rs.Data[i].CreatedOn != null ? formatDate(rs.Data[i].CreatedOn, 'dd-mm-yyyy hh:ss') : '')}</td>`;
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
            $.ajax({
                url: common_api_url + 'Lead/Delete',
                type: "POST",
                data: { ID: $('#hdfID').val() },
                success: function (rs) {
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

function Detail(ID) {
    try {
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Lead/Detail',
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
                    $('#hdfID').val(rs.Data.LeadID);
                    $('#txtOwnerName').val(rs.Data.OwnerName);
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


                    $('.select2').select2();
                    $('#lblHeader').text(rs.Data.Topic);

                    // show hide button by status id

                    $('.btn-for-update').hide();
                    $('.form-control').removeClass('ivg-input-link');
                    $('.form-control').removeClass('is-invalid');

                    if (rs.Data.StatusID == 1) { /* OPEN */
                        enable_input();
                        $('.btn-for-update.stt-1').show();
                    }

                    else if (rs.Data.StatusID == 2) { /* QUALIFIED */

                        $('.btn-for-update.stt-2').show();
                        disabled_input();

                        $('#txtTopic').addClass('ivg-input-link');
                        $('#txtCompany').addClass('ivg-input-link');
                        $('#txtLastName').addClass('ivg-input-link');
                        $('#txtTopic').attr('onclick', `view_opportunity('${rs.Data.OpportunityID}')`);
                        $('#txtCompany').attr('onclick', `view_account('${rs.Data.AccountID}')`);
                        $('#txtLastName').attr('onclick', `view_contact('${rs.Data.ContactID}')`);

                    }

                    else { /* DISQUALIFIED */
                        $('.btn-for-update.stt-3').show();
                        disabled_input();
                    }
                }

                $('#contentList').hide();
                $('#contentDetail').show();

                document.getElementById('btnTabGeneral').click();

                NoteList();

                $('#hdfAccountID').val('');
                $('#hdfContactID').val('');

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
    $('.field-input').prop('readonly', true);
    $('.select2').prop('disabled', true);
    $('.select2').select2();

}

function ReactiveLead() {
    try {
        var ID = $('#hdfID').val();

        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Lead/Update',
            type: "POST",
            data: {
                ID: ID,
                MyID: common_get_myid(),
                IsReactive: true,
            },
            success: function (rs) {
                console.log(rs);
                $('#loader').hide();
                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }

                Detail(ID);

            }
        });
    } catch (e) {

    }

}

function Disqualify(reason) {
    try {
        var text = $(reason).attr('data-text');
        var StatusReasonID = $(reason).attr('data-id');
        var cf = confirm(`Are you sure to disqualify leads with reason ${text}`);
        if (cf) {
            $('#loader').show();

            $.ajax({
                url: common_api_url + 'Lead/Update',
                type: "POST",
                data: {
                    ID: $('#hdfID').val(),
                    MyID: common_get_myid(),
                    IntID: StatusReasonID,
                    IsDisqualified: true,
                },
                success: function (rs) {
                    console.log(rs);
                    $('#loader').hide();
                    if (rs.Error != undefined) {
                        alertError(rs.Error);
                    }


                    back_to_list();
                }
            });
        }
    } catch (e) {

    }
}

function New() {
    try {
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Lead/New',
            type: "GET",
            success: function (rs) {
                $('#loader').hide();
                if (rs.Data != undefined) {
                    if (rs.Data.Provinces != undefined) {
                        common_fill_dropdown('ddlProvince', rs.Data.Provinces.map(x => ({ ID: x.ProvinceID, Name: x.ProvinceName })))
                    }
                    if (rs.Data.LeadSource != undefined) {
                        common_fill_dropdown('ddlSourceID', rs.Data.LeadSource.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                }

                //select default value
                $('#ddlProvince').change();

                //reset form input
                $('.field-input').val('');
                $('.field-input').prop('readonly', false);
                $('.field-input').removeClass('ivg-input-link');
                $('.select2').prop('disabled', false);
                $('.select2').select2();

                $('.btn-for-update').hide();
                $('.btn-for-update.new').show();

                $('.pnlStatus').hide();
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
            url: common_api_url + 'Lead/Update',
            type: "POST",
            data: {
                Lead: get_data_save_db()
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
function Qualified_CreateNew() {
    try {

        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Lead/NewContactAccount',
            type: "POST",
            data: {
                Lead: get_data_save_db()
            },
            success: function (rs) {
                $('#loader').hide();
                if (rs.AccountID != undefined && rs.ContactID != undefined) {
                    $('#hdfAccountID').val(rs.AccountID);
                    $('#hdfContactID').val(rs.ContactID);
                    Qualified(1);
                }
                if (rs.Error != undefined) {
                    alertError(rs.Error);
                }
            }
        });
    } catch (e) {

    }
}

function Qualified(isConfirm) {

    try {
        if (isConfirm) {

            if ($('#tblDupAccount tr').length > 0) {
                var selectAcc = false;
                $('#tblDupAccount tr').each(function () {

                    var checked = $(this).find('.ckAccount').prop('checked');
                    if (!selectAcc && checked)
                        selectAcc = checked;

                });
                if (!selectAcc) {
                    alertError('Please select an Account');
                    return;
                }
            }

            if ($('#tblDupContact tr').length > 0) {
                var selectCont = false;
                $('#tblDupContact tr').each(function () {

                    var checked = $(this).find('.ckContact').prop('checked');
                    if (!selectCont && checked)
                        selectCont = checked;

                });
                if (!selectCont) {
                    alertError('Please select a Contact');
                    return;
                }
            }

            $('#loader').show();

            var data = {
                IsQualifiedLead: true,
                ID: $('#hdfID').val(),
                MyID: common_get_myid(),
                AccountID: $('#hdfAccountID').val(),
                ContactID: $('#hdfContactID').val(),
            };

            $.ajax({
                url: common_api_url + 'Lead/Update',
                type: "POST",
                data: data,
                success: function (rs) {
                    $('#loader').hide();
                    console.log(rs);
                    //bị trùng dữ liệu > hiển thị lên danh sách để chọn account hoặc contact tương ứng
                    if (rs.IsDuplicate) {

                        $('#tblDupAccount').html(``);
                        $('#tblDupContact').html(``);

                        if (rs.Account != undefined && rs.Account.length > 0) {
                            for (var i = 0; i < rs.Account.length; i++) {
                                var html = ``; 
                                html += `<tr>`;
                                html += `<td class="text-center"><input type="radio" class="ckAccount" name="ckAccount" id="ckAccount"  value="${rs.Account[i].AccountID}" onchange="SelectDupAccount(this)" /></td>`;
                                html += `<td>${(rs.Account[i].AccountName != null ? rs.Account[i].AccountName : '')}</td>`;
                                html += `<td>${(rs.Account[i].Website != null ? rs.Account[i].Website : '')}</td>`;
                                html += `<td>${(rs.Account[i].MainPhone != null ? rs.Account[i].MainPhone : '')}</td>`;
                                html += `<td>${(rs.Account[i].OtherPhone != null ? rs.Account[i].OtherPhone : '')}</td>`;
                                html += `</tr>`;
                                $('#tblDupAccount').append(html);
                            }
                        }
                        if (rs.Contact != undefined && rs.Contact.length > 0) {
                            for (var i = 0; i < rs.Contact.length; i++) {
                                var html = ``; 
                                html += `<tr>`;
                                html += `<td class="text-center"><input type="radio" class="ckContact" name="ckContact" id="ckAccount" value="${rs.Contact[i].ContactID}" onchange="SelectDupContact(this)" /></td>`;
                                html += `<td>${(rs.Contact[i].FullName != null ? rs.Contact[i].FullName : '')}</td>`;
                                html += `<td>${(rs.Contact[i].Email != null ? rs.Contact[i].Email : '')}</td>`;
                                html += `<td>${(rs.Contact[i].MainPhone != null ? rs.Contact[i].MainPhone : '')}</td>`;
                                html += `<td>${(rs.Contact[i].OtherPhone != null ? rs.Contact[i].OtherPhone : '')}</td>`;
                                html += `</tr>`;
                                $('#tblDupContact').append(html);
                            }
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
