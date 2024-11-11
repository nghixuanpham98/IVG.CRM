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
            url: common_api_url + 'Opportunity/List',
            type: "POST",
            data: {
                "PageIndex": pageNo,
                "PageSize": 25,
                "TableViewName": "[dbo].[vw_Opportunities]",
                "Columns": "*",
                "OrderByColumn": "CreatedOn",
                "OrderByDirection": "DESC",
            },
            success: function (rs) {
                console.log(rs)
                $('#loader').hide();

                $('#tblData').html('');

                for (var i = 0; i < rs.Data.length; i++) {
                    var checkbox = `<input type="checkbox" class="check-xs cursor-pointer ck-row" data-id="${rs.Data[i].LeadID}" />`;
                   
                    var html = ` <tr> `;
                    html += `<td class="text-center">${checkbox}</td>`;
                    html += `<td class="table-detail" onclick="Detail('${rs.Data[i].OpportunityID}')">${(rs.Data[i].Topic != null ? rs.Data[i].Topic : '')}</td>`;
                    html += `<td>${(rs.Data[i].EstimatedClosingDate != null ? formatDate(rs.Data[i].EstimatedClosingDate, 'dd-mm-yyyy hh:ss') : '')}</td>`;
                    html += `<td>${(rs.Data[i].EstimatedRevenue != null ? rs.Data[i].EstimatedRevenue : '')}</td>`;
                    html += `<td>${(rs.Data[i].AccountName != null ? rs.Data[i].AccountName : '')}</td>`;
                    html += `<td>${(rs.Data[i].ContactName != null ? rs.Data[i].ContactName : '')}</td>`;
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
                url: common_api_url + 'Opportunity/Delete',
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
 

function Detail(ID) {
    try {
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Opportunity/Detail',
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

                    if (MD.Currency != undefined) {
                        common_fill_dropdown('ddlCurrencyID', MD.Currency.map(x => ({ ID: x.Value, Name: x.Name })))
                        common_fill_dropdown('ddlCurrencyID2', MD.Currency.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                    if (MD.PurchaseTimeframe != undefined) {
                        var arr = MD.PurchaseTimeframe.map(x => ({ ID: x.Value, Name: x.Name }));
                        console.log(`PurchaseTimeframe`,arr)
                        common_fill_dropdown('ddlPurchaseTimeframeID', MD.PurchaseTimeframe.map(x => ({ ID: x.Value, Name: x.Name })))
                    } 
                    if (MD.PurchaseProcess != undefined) {
                        var arr = MD.PurchaseProcess.map(x => ({ ID: x.Value, Name: x.Name }));
                        console.log(`PurchaseProcess`, arr)
                        common_fill_dropdown('ddlPurchaseProcessID', MD.PurchaseProcess.map(x => ({ ID: x.Value, Name: x.Name })))
                    } 
                }
              
                if (rs.Data != undefined) {
                     
                    //fill data to input
                    console.log(`rs.Data`, rs.Data);
                    $('#hdfID').val(rs.Data.OpportunityID);
                    $('#txtOwnerName').val(rs.Data.OwnerName);

                    $('#txtDescription').val(rs.Data.Description);
                    $('#txtProposedSolution').val(rs.Data.ProposedSolution);
                    $('#txtCustomerNeed').val(rs.Data.CustomerNeed);
                    $('#txtCurrentSituation').val(rs.Data.CurrentSituation);
                    $('#txtBudgetAmount').val(rs.Data.BudgetAmount);
                    $('#hdfAccountID').val(rs.Data.AccountID);
                    $('#txtAccountName').val(rs.Data.AccountName);
                    $('#hdfContactID').val(rs.Data.ContactID);
                    $('#txtContactName').val(rs.Data.ContactName);
                    $('#txtTopic').val(rs.Data.Topic);
                        
                    $('#ddlPurchaseProcessID').val(rs.Data.PurchaseProcessID);
                    $('#ddlCurrencyID').val(rs.Data.CurrencyID);
                    $('#ddlPurchaseTimeframeID').val(rs.Data.PurchaseTimeframeID);
                     
                    $('.select2').select2();
                    $('#lblHeader').text(rs.Data.FullName);

                    // show hide button by status id
                     
                    $('.field-input').removeClass('ivg-input-link');
                    $('.field-input').removeClass('is-invalid');

                    $('#txtContactName').addClass('ivg-input-link');
                    $('#txtContactName').attr('onclick', `view_contact('${rs.Data.ContactID}')`);

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
    $('.field-input').prop('readonly', false);
    $('.select2').prop('disabled', false);
    $('.select2').select2();
}

function disabled_input() {
    $('.field-input').prop('readonly', true);
    $('.select2').prop('disabled', true);
    $('.select2').select2();

}

function New() {
    try {
        $('#loader').show();

        $.ajax({
            url: common_api_url + 'Opportunity/New',
            type: "GET",
            success: function (rs) {
                $('#loader').hide();

                if (rs.MasterData != undefined) {

                    console.log(`rs.MasterData`, rs.MasterData);

                    var MD = rs.MasterData;

                    if (MD.Provinces != undefined && MD.Provinces.length > 0) {
                        common_fill_dropdown('ddlProvince', MD.Provinces.map(x => ({ ID: x.ProvinceID, Name: x.ProvinceName })))
                    }

                    if (MD.Currency != undefined) {
                        common_fill_dropdown('ddlCurrencyID', MD.Currency.map(x => ({ ID: x.Value, Name: x.Name })))
                        common_fill_dropdown('ddlCurrencyID2', MD.Currency.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                    if (MD.PurchaseTimeframe != undefined) {
                        var arr = MD.PurchaseTimeframe.map(x => ({ ID: x.Value, Name: x.Name }));
                        console.log(`PurchaseTimeframe`, arr)
                        common_fill_dropdown('ddlPurchaseTimeframeID', MD.PurchaseTimeframe.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                    if (MD.PurchaseProcess != undefined) {
                        var arr = MD.PurchaseProcess.map(x => ({ ID: x.Value, Name: x.Name }));
                        console.log(`PurchaseProcess`, arr)
                        common_fill_dropdown('ddlPurchaseProcessID', MD.PurchaseProcess.map(x => ({ ID: x.Value, Name: x.Name })))
                    }
                }

                $('.field-input').removeClass('ivg-input-link');

                //select default value
                $('#ddlProvince').change();

                //reset form input
                $('.field-input').val('');
                $('.field-input').prop('disabled', false);
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
            OpportunityID: $('#hdfID').val(),
            Description: $('#txtDescription').val(),
            ProposedSolution: $('#txtProposedSolution').val(),
            CustomerNeed: $('#txtCustomerNeed').val(),
            CurrentSituation: $('#txtCurrentSituation').val(),
            BudgetAmount: $('#txtBudgetAmount').val(),
            AccountID: $('#hdfAccountID').val(),
            ContactID: $('#hdfContactID').val(),
            Topic: $('#txtTopic').val(),
            PurchaseProcessID: $('#ddlPurchaseProcessID option:selected').val(),
            CurrencyID: $('#ddlCurrencyID option:selected').val(),
            PurchaseTimeframeID: $('#ddlPurchaseTimeframeID option:selected').val(),

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
            url: common_api_url + 'Opportunity/Update',
            type: "POST",
            data: {
                Opportunity: get_data_save_db()
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
                url: common_api_url + 'Opportunity/Update',
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
