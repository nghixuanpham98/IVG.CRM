
$(document).ready(function () {
    onLoadData(0, defaultLoadNumb);

    // Users
    initAutoComplete("#txtOwner", "users", getDataByKey, function (selectedItem) {
        $("#txtOwnerVal").val(selectedItem.data.ID);
    });

    // Accounts
    initAutoComplete("#txtAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#txtAccountVal").val(selectedItem.data.ID);

        // Bill Account
        $("#txtBillAccount").val(selectedItem.label);
        $("#txtBillAccountVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtDetailAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#txtDetailAccountVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtBillAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#txtBillAccountVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtDetailBillAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#txtDetailBillAccountVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtLineAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#txtLineAccountVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtLineDetailAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#txtLineDetailAccountVal").val(selectedItem.data.ID);
    });

    // Product
    initAutoComplete("#txtLineProduct", "products/special", getDataByKey, function (selectedItem) {
        onLoadUnits(selectedItem.data.UnitGroupID, 'ddlLineUnit');

        $("#txtLineProductVal").val(selectedItem.data.ID);
    }, 3);

    initAutoComplete("#txtLineDetailProduct", "products/special", getDataByKey, function (selectedItem) {
        onLoadUnits(selectedItem.data.UnitGroupID, 'ddlLineDetailUnit');

        $("#txtLineDetailProductVal").val(selectedItem.data.ID);
    }, 3);


    onLoadCommonProvinces("ddlProvince");

    onLoadCommonProvinces("ddlBillProvince");

    onLoadCommonProvinces("ddlLineProvince");
});



/*Load data*/
function onLoadData(key, type, orderType, orderName) {
    // Default icon order
    var icon = $(".toggle-th .order-icon.active");

    icon.text("⮟");

    // Breadcrumb
    $("#hdfTypeOnLoad").val(type);
    $(".btn-filter").removeClass("active");

    if (type == 0) {
        $("#btnFilterDraft").addClass("active");
        $("#breadcrumbType").text("Draft Contracts");
    } else if (type == 1) {
        $("#btnFilterInvoiced").addClass("active");
        $("#breadcrumbType").text("Invoiced Contracts");
    } else if (type == 2) {
        $("#btnFilterExpired").addClass("active");
        $("#breadcrumbType").text("Expired Contracts");
    } else if (type == 3) {
        $("#btnFilterHold").addClass("active");
        $("#breadcrumbType").text("On hold Contracts");
    } else if (type == 4) {
        $("#btnFilterCanceled").addClass("active");
        $("#breadcrumbType").text("Canceled Contracts");
    } else {
        $("#btnFilterAll").addClass("active");
        $("#breadcrumbType").text("All Contracts");
    }

    var orderTypeDefault = "DESC";
    var orderNameDefault = "Name";
    var keySearch = $("#txtMainSearch").val();

    if (orderType && orderName) {
        orderTypeDefault = orderType;
        orderNameDefault = orderName;
    }

    /*Paging*/
    var pageNumber = $("#pageIndex").val();
    var pageSize = $("#pageSize").val();

    if (key == 1) {
        pageNumber = 1;
        $("#pageIndex").val(1);
        if ($('#pagingMainContent').data("twbs-pagination")) {
            $('#pagingMainContent').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "contracts/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
            "keySearch": keySearch,
            "id": userID,
            "type": type,
            "orderType": orderTypeDefault,
            "orderName": orderNameDefault
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        var html = "";

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;

            if (dataLength > 0) {
                for (var i = 0; i < dataLength; i++) {
                    if (data[i].Code == null || data[i].Code === "undefined" || data[i].Code === "") {
                        data[i].Code = "-";
                    }

                    if (data[i].Name == null || data[i].Name === "undefined" || data[i].Name === "") {
                        data[i].Name = "-";
                    }

                    if (data[i].AccountName == null || data[i].AccountName === "undefined" || data[i].AccountName === "") {
                        data[i].AccountName = "-";
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`)">`
                    html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-check cursor-pointer" /></td>`;
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Code}</span></td>`;
                    html += `<td>${data[i].Name}</td>`;
                    html += `<td class="table-detail">${data[i].AccountName}</td>`;

                    var status = "";
                    if (data[i].Status == null || data[i].Status === "undefined" || data[i].Status === "") {
                        html += `<td>-</td>`;
                    } else {
                        if (data[i].Status == 0) {
                            status = 'Nháp';

                            html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 1) {
                            status = 'Đã lập hóa đơn';

                            html += `<td><span class="badge rounded-pill bg-success fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 2) {
                            status = 'Hết hạn';

                            html += `<td><span class="badge rounded-pill bg-warning fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 3) {
                            status = 'Đang chờ';

                            html += `<td><span class="badge rounded-pill bg-info fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 4) {
                            status = 'Đã hủy';

                            html += `<td><span class="badge rounded-pill bg-danger fw-bold">${status}</span></td>`;
                        } else {
                            html += `<td>-</td>`;
                        }
                    }

                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBody').html(html);

            pageIndexLoad(rs.paging.TotalPages, rs.paging.TotalRecords);

            $("#loader").hide();
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            alertError(rs.messVN);
            $("#loader").hide();
        }
    });
}


function onLoadDataLines(key) {
    var id = $("#hdfDetailID").val();

    /*Paging*/
    var pageNumber = $("#pageIndexLine").val();
    var pageSize = $("#pageSizeLine").val();

    if (key) {
        pageNumber = 1;
        $("#pageIndexLine").val(1);
        if ($('#pagingMainContentLine').data("twbs-pagination")) {
            $('#pagingMainContentLine').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "contracts/lines/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
            "id": id
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        var html = "";

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;

            if (dataLength > 0) {
                for (var i = 0; i < dataLength; i++) {
                    if (data[i].Title == null || data[i].Title === "undefined" || data[i].Title === "") {
                        data[i].Title = "-";
                    }

                    if (data[i].ProductName == null || data[i].ProductName === "undefined" || data[i].ProductName === "") {
                        data[i].ProductName = "-";
                    }

                    var remaining = "";
                    if (data[i].Remaining == null || data[i].Remaining === "undefined" || data[i].Remaining === "") {
                        remaining = "-";
                    } else {
                        remaining = formatNumber(data[i].Remaining);
                    }

                    var net = "";
                    if (data[i].Net == null || data[i].Net === "undefined" || data[i].Net === "") {
                        net = "-";
                    } else {
                        net = formatNumber(data[i].Net);
                    }

                    html += `<tr ondblclick="viewLineDetails(\`` + data[i].ID + `\`)">`;
                    html += `<td><span title="Xem chi tiết" onclick="viewLineDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Title}</span></td>`;
                    html += `<td>${data[i].ProductName}</td>`;
                    html += `<td>${remaining}</td>`;
                    html += `<td>${net}</td>`;


                    var status = $("#hdfStatus").val();

                    if (status == 0) {
                        html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeleteLine(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    } else {
                        html += `<td></td>`;
                    }
                    
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyLine').html(html);

            pageIndexLoadLine(rs.paging.TotalPages, rs.paging.TotalRecords);

            $("#loader").hide();
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            alertError(rs.messVN);
            $("#loader").hide();
        }
    });
}


function onLoadUnits(id, domUnit, unitID, isDetail) {
    if (id) {
        var settings = {
            "url": api_url + "units/list",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "isAll": true,
                "id": id
            }),
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            var optionHtml = "";

            optionHtml += `<option value="0">-- Chọn đơn vị --</option>`;

            if (rs.code == 200) {
                var data = rs.data;
                var dataLength = data.length;

                for (var i = 0; i < dataLength; i++) {
                    optionHtml += `<option value="${data[i].ID}">${data[i].Name}</option>`;
                }

                $("#" + domUnit).html(optionHtml);

                if (isDetail) {
                    $("#" + domUnit).val(unitID).trigger('change');
                }

                $("#loader").hide();
            } else if (rs.code == 310) {
                returnLogin();
            } else {
                console.log(rs);
                alertError(rs.messVN);
                $("#loader").hide();
            }
        });
    }
}



/*Create*/
function viewCreate(key) {
    if (key) {
        $("#contentList").hide();
        $("#contentDetail").hide();
        $("#contentCreate").show();

        $("#txtOwnerVal").val(userID);
        $("#txtOwner").val(userCode + " - " + userFullName);

        $("#tabGeneralLink").addClass("active");
        $("#tabGeneral").addClass("active");

        $("#tabSubPostsLink").addClass("active");
        $("#tabSubPosts").addClass("active");
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentList").show();

        $(".nav-custom").removeClass("active");

        onLoadData(0, $("#hdfTypeOnLoad").val());

        clearAllForm("contentCreate");
    }
}


function submitCreate(typeSave) {
    var owner = $("#txtOwnerVal").val();
    var name = $("#txtName").val();
    var account = $("#txtAccountVal").val();
    var start = $("#txtStartDate").val();
    var end = $("#txtEndDate").val();
    var address = $("#txtAddress").val();
    var description = $("#txtDescription").val();
    var discount = $("#ddlDiscountType").val();
    var level = $("#ddlServiceLevel").val();
    var province = $("#ddlProvince").val() !== "0" && $("#ddlProvince").val() != 0 ? $("#ddlProvince").val() : null;
    var district = $("#ddlDistrict").val() !== "0" && $("#ddlDistrict").val() != 0 ? $("#ddlDistrict").val() : null;
    var ward = $("#ddlWard").val() !== "0" && $("#ddlWard").val() != 0 ? $("#ddlWard").val() : null;

    var billAccount = $("#txtBillAccountVal").val();
    var billStart = $("#txtBillStartDate").val();
    var billEnd = $("#txtBillEndDate").val();
    var billEnd = $("#txtBillEndDate").val();
    var billFrequency = $("#ddlBillFrequency").val();
    var billCancellation = $("#txtCancellationDate").val();
    var billAddress = $("#txtBillAddress").val();
    var billProvince = $("#ddlBillProvince").val() !== "0" && $("#ddlBillProvince").val() != 0 ? $("#ddlBillProvince").val() : null;
    var billDistrict = $("#ddlBillDistrict").val() !== "0" && $("#ddlBillDistrict").val() != 0 ? $("#ddlBillDistrict").val() : null;
    var billWard = $("#ddlBillWard").val() !== "0" && $("#ddlBillWard").val() != 0 ? $("#ddlBillWard").val() : null;


    var validationChecks = [];

    validationChecks = [
        { input: owner, type: 1, element: 'text', name: 'txtOwner' },
        { input: name, type: 1, element: 'text', name: 'txtName' },
        { input: account, type: 1, element: 'text', name: 'txtAccount' },
        { input: start, type: 1, element: 'text', name: 'txtStartDate' },
        { input: end, type: 1, element: 'text', name: 'txtEndDate' },
        { input: billAccount, type: 1, element: 'text', name: 'txtBillAccount' },
    ];

    for (const check of validationChecks) {
        if (checkValidateValue(check.input, check.type)) {
            if (check.element) {
                warningInvalidValue(check.name, check.type, check.element);
            }
            else {
                warningInvalidValue(check.name, 2);
            }

            return;
        }
    }

    var days = "";

    if (start >= end) {
        alertWarning("Ngày bắt đầu phải trước ngày kết thúc");
        return;
    } else {
        days = $("#txtDays").val();
    }

    var settings = {
        "url": api_url + "contracts",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "OwnerID": owner,
            "AccountID": account,
            "Name": name,
            "ContractStartDate": start,
            "ContractEndDate": end,
            "DurationInDays": days,
            "DiscountType": discount,
            "ServiceLevel": level,
            "ContractProvinceID": province,
            "ContractDistrictID": district,
            "ContractWardID": ward,
            "ContractAddress": address,
            "BillAccountID": billAccount,
            "BillStartDate": billStart,
            "BillEndDate": billEnd,
            "BillProvinceID": billProvince,
            "BillDistrictID": billDistrict,
            "BillWardID": billWard,
            "BillAddress": billAddress,
            "BillFrequency": billFrequency,
            "CancellationDate": billCancellation,
            "Description": description,
            "CreatedBy": userID,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            var data = rs.data;

            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewDetails(data);
            } else if (typeSave == 2) {
                viewCreate();
            }

            $("#loader").hide();
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            alertError(rs.messVN);
            $("#loader").hide();
        }
    });
}


function submitCreateLine(typeSave) {
    var id = $("#hdfDetailID").val();
    var account = $("#txtLineAccountVal").val();
    var serial = $("#txtLineSerial").val();
    var title = $("#txtLineTitle").val();
    var product = $("#txtLineProductVal").val();
    var unit = $("#ddlLineUnit").val();
    var start = $("#txtLineStartDate").val();
    var end = $("#txtLineEndDate").val();
    var province = $("#ddlLineProvince").val() !== "0" && $("#ddlLineProvince").val() != 0 ? $("#ddlLineProvince").val() : null;
    var district = $("#ddlLineDistrict").val() !== "0" && $("#ddlLineDistrict").val() != 0 ? $("#ddlLineDistrict").val() : null;
    var ward = $("#ddlLineWard").val() !== "0" && $("#ddlLineWard").val() != 0 ? $("#ddlLineWard").val() : null;
    var location = $("#txtLineLocation").val();
    var quantity = getValueWithoutCommas($("#txtLineQuantity").val());
    var totalPrice = getValueWithoutCommas($("#txtLineTotalPrice").val());
    var discount = getValueWithoutCommas($("#txtLineDiscount").val());
    var percent = getValueWithoutCommas($("#txtLinePercent").val());
    var totalCase = getValueWithoutCommas($("#txtLineTotalCase").val());

    var validationChecks = [];

    validationChecks = [
        { input: account, type: 1, element: 'text', name: 'txtLineAccount' },
        { input: title, type: 1, element: 'text', name: 'txtLineTitle' },
        { input: start, type: 1, element: 'text', name: 'txtLineStartDate' },
        { input: end, type: 1, element: 'text', name: 'txtLineEndDate' },
        { input: totalPrice, type: 1, element: 'text', name: 'txtLineTotalPrice' },
        { input: totalCase, type: 1, element: 'text', name: 'txtLineTotalCase' },
    ];

    for (const check of validationChecks) {
        if (checkValidateValue(check.input, check.type)) {
            if (check.element) {
                warningInvalidValue(check.name, check.type, check.element);
            }
            else {
                warningInvalidValue(check.name, 2);
            }

            return;
        }
    }

    if (start >= end) {
        alertWarning("Ngày bắt đầu phải trước ngày kết thúc");
        return;
    }

    var settings = {
        "url": api_url + "contracts/lines",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ContractID": id,
            "ProductID": product,
            "AccountID": account,
            "UnitID": unit,
            "SerialNumber": serial,
            "Title": title,
            "StartDate": start,
            "EndDate": end,
            "Quantity": quantity,
            "TotalPrice": totalPrice,
            "Discount": discount,
            "PercentageDiscount": percent,
            "TotalCases": totalCase,
            "ProvinceID": province,
            "DistrictID": district,
            "WardID": ward,
            "Location": location,
            "CreatedBy": userID,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            var data = rs.data;

            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                $("#modalCreateLine").modal("hide");
                viewLineDetails(data);
            } else if (typeSave == 2) {
                viewLineDetails();
            }

            $("#loader").hide();
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            alertError(rs.messVN);
            $("#loader").hide();
        }
    });
}



/*Detail*/
function viewDetails(id) {
    $(".nav-custom").removeClass("active");

    if (id) {
        $("#contentList").hide();
        $("#contentCreate").hide();
        $("#contentDetail").show();

        /*Go back to default nav-tab*/
        $("#tabDetailGeneralLink").addClass("active");
        $("#tabDetailGeneral").addClass("active");

        $("#tabDetailSubPostsLink").addClass("active");
        $("#tabDetailSubPosts").addClass("active");

        $("#hdfDetailID").val(id);

        var settings = {
            "url": api_url + "contracts/" + id,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": token
            },
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            if (rs.code == 200) {
                var data = rs.data;

                $("#hdfStatus").val(data.Status);
                $("#hdfDiscountType").val(data.DiscountType);

                if (data.Status == 0) {
                    removeDisableDom("txtDetailName");
                    removeDisableDom("txtDetailAccount");
                    removeDisableDom("txtDetailStartDate");
                    removeDisableDom("txtDetailEndDate");
                    removeDisableDom("ddlDetailServiceLevel");
                    removeDisableDom("ddlDetailProvince");
                    removeDisableDom("ddlDetailDistrict");
                    removeDisableDom("ddlDetailWard");
                    removeDisableDom("txtDetailAddress");
                    removeDisableDom("txtDetailDescription");
                    removeDisableDom("txtDetailBillAccount");
                    removeDisableDom("txtDetailBillStartDate");
                    removeDisableDom("txtDetailBillEndDate");
                    removeDisableDom("ddlDetailBillFrequency");
                    removeDisableDom("ddlDetailBillProvince");
                    removeDisableDom("ddlDetailBillDistrict");
                    removeDisableDom("ddlDetailBillWard");
                    removeDisableDom("txtDetailBillAddress");
                } else {
                    disableDom("txtDetailName");
                    disableDom("txtDetailAccount");
                    disableDom("txtDetailStartDate");
                    disableDom("txtDetailEndDate");
                    disableDom("ddlDetailServiceLevel");
                    disableDom("ddlDetailProvince");
                    disableDom("ddlDetailDistrict");
                    disableDom("ddlDetailWard");
                    disableDom("txtDetailAddress");
                    disableDom("txtDetailDescription");
                    disableDom("txtDetailBillAccount");
                    disableDom("txtDetailBillStartDate");
                    disableDom("txtDetailBillEndDate");
                    disableDom("ddlDetailBillFrequency");
                    disableDom("ddlDetailBillProvince");
                    disableDom("ddlDetailBillDistrict");
                    disableDom("ddlDetailBillWard");
                    disableDom("txtDetailBillAddress");
                }

                if (data.Status == 0) {
                    // Draft
                    $("#btnDetailHold").hide();
                    $("#btnDetailRelease").hide();
                    $("#btnDetailCancel").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailInvoice").show();
                    $("#btnDetailAddNew").show();
                } else if (data.Status == 1) {
                    // Invoice
                    $("#btnDetailInvoice").hide();
                    $("#btnDetailRelease").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailHold").show();
                    $("#btnDetailCancel").show();
                } else if (data.Status == 2) {
                    // Expired
                    $("#btnDetailInvoice").hide();
                    $("#btnDetailHold").hide();
                    $("#btnDetailCancel").hide();
                    $("#btnDetailRelease").hide();
                    $("#btnDetailSaveClose").hide();
                    $("#btnDetailSave").hide();
                    $("#btnDetailAddNew").hide();
                } else if (data.Status == 3) {
                    // On hold
                    $("#btnDetailInvoice").hide();
                    $("#btnDetailHold").hide();
                    $("#btnDetailCancel").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailRelease").show();
                } else if (data.Status == 4) {
                    // Canceled
                    $("#btnDetailInvoice").hide();
                    $("#btnDetailHold").hide();
                    $("#btnDetailCancel").hide();
                    $("#btnDetailRelease").hide();
                    $("#btnDetailSaveClose").hide();
                    $("#btnDetailSave").hide();
                    $("#btnDetailAddNew").hide();
                }

                $("#titleDetail").text(data.Name);
                $("#txtDetailName").val(data.Name);
                $("#txtDetailCode").val(data.Code);
                $("#txtDetailOwner").val(data.OwnerCode + " - " + data.OwnerName);
                $("#txtDetailOwnerVal").val(data.OwnerID);
                
                $("#ddlDetailStatusReason").val(data.Status).trigger('change');

                var createdOn = data.CreatedOn != null ? formatDate(new Date(data.CreatedOn), "yyyy-mm-dd hh:ss") : "";
                $("#txtDetailCreatedOn").val(createdOn);


                $("#txtDetailAccount").val(data.AccountName);
                $("#txtDetailAccountVal").val(data.AccountID);

                var startDate = data.ContractStartDate != null ? formatDate(new Date(data.ContractStartDate), "yyyy-mm-dd") : "";
                $("#txtDetailStartDate").val(startDate);

                var endDate = data.ContractEndDate != null ? formatDate(new Date(data.ContractEndDate), "yyyy-mm-dd") : "";
                $("#txtDetailEndDate").val(endDate);

                $("#txtDetailDays").val(data.DurationInDays);

                $("#ddlDetailDiscountType").val(data.DiscountType).trigger('change');
                $("#ddlDetailServiceLevel").val(data.ServiceLevel).trigger('change');

                var province = data.ContractProvinceID == null ? null : data.ContractProvinceID;
                var district = data.ContractDistrictID == null ? null : data.ContractDistrictID;
                var ward = data.ContractWardID == null ? null : data.ContractWardID;

                onLoadCommonProvinces("ddlDetailProvince", true, province, district, ward);

                $("#txtDetailAddress").val(data.ContractAddress);
                $("#txtDetailDescription").val(data.Description);

                $("#txtDetailBillAccount").val(data.BillAccountName);
                $("#txtDetailBillAccountVal").val(data.BillAccountID);

                var billStartDate = data.BillStartDate != null ? formatDate(new Date(data.BillStartDate), "yyyy-mm-dd") : "";
                $("#txtDetailBillStartDate").val(billStartDate);

                var billEndDate = data.BillEndDate != null ? formatDate(new Date(data.BillEndDate), "yyyy-mm-dd") : "";
                $("#txtDetailBillEndDate").val(billEndDate);

                $("#ddlDetailBillFrequency").val(data.BillFrequency).trigger('change');

                var cancellationDate = data.CancellationDate != null ? formatDate(new Date(data.CancellationDate), "yyyy-mm-dd hh:ss") : "";
                $("#txtDetailCancellationDate").val(cancellationDate);

                var billProvince = data.BillProvinceID == null ? null : data.BillProvinceID;
                var billDistrict = data.BillDistrictID == null ? null : data.BillDistrictID;
                var billWard = data.BillWardID == null ? null : data.BillWardID;

                onLoadCommonProvinces("ddlDetailBillProvince", true, billProvince, billDistrict, billWard);

                $("#txtDetailBillAddress").val(data.BillAddress);

                var totalPrice = data.TotalPrice != null ? formatNumber(data.TotalPrice) : 0;
                $("#txtDetailTotalPrice").val(totalPrice);

                var totalDiscount = data.TotalDiscount != null ? formatNumber(data.TotalDiscount) : 0;
                $("#txtDetailTotalDiscount").val(totalDiscount);

                var netPrice = data.NetPrice != null ? formatNumber(data.NetPrice) : 0;
                $("#txtDetailNetPrice").val(netPrice);

                // Contract Lines
                if (data.DiscountType == 1) {
                    // Percentage
                    disableDom("txtLineDiscount");
                    removeDisableDom("txtLinePercent");
                } else {
                    // Amount
                    disableDom("txtLinePercent");
                    removeDisableDom("txtLineDiscount");
                }

                $("#txtLineAccount").val(data.AccountName);
                $("#txtLineAccountVal").val(data.AccountID);
                $("#txtLineStartDate").val(startDate);
                $("#txtLineEndDate").val(endDate);

                // Save value for default value of create contract line
                $("#hdfDetailAccount").val(data.AccountName);
                $("#hdfDetailAccountID").val(data.AccountID);
                $("#hdfDetailStartDate").val(startDate);
                $("#hdfDetailEndDate").val(endDate);

                $("#loader").hide();
            } else if (rs.code == 310) {
                returnLogin();
            } else {
                console.log(rs);
                alertError(rs.messVN);
                $("#loader").hide();
            }
        });
    } else {
        $("#contentDetail").hide();
        $("#contentList").show();

        onLoadData(1, $("#hdfTypeOnLoad").val());

        clearAllForm("contentCreate");

        $("#hdfDetailID").val("");
    }
}


function viewLineDetails(id) {
    if (id) {
        $("#hdfLineID").val(id);

        var settings = {
            "url": api_url + "contracts/lines/" + id,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": token
            },
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            if (rs.code == 200) {
                var data = rs.data;

                var status = $("#hdfStatus").val();

                if (status == 0) {
                    removeDisableDom("txtLineDetailTitle");
                    removeDisableDom("txtLineDetailStartDate");
                    removeDisableDom("txtLineDetailEndDate");
                    removeDisableDom("txtLineDetailAccount");
                    removeDisableDom("txtLineDetailSerial");
                    removeDisableDom("txtLineDetailProduct");
                    removeDisableDom("ddlLineDetailUnit");
                    removeDisableDom("ddlLineDetailProvince");
                    removeDisableDom("ddlLineDetailDistrict");
                    removeDisableDom("ddlLineDetailWard");
                    removeDisableDom("ddlLineDetailLocation");
                    removeDisableDom("txtLineDetailQuantity");
                    removeDisableDom("txtLineDetailTotalPrice");

                    var discountType = $("#hdfDiscountType").val();

                    // Contract Lines
                    if (discountType == 1) {
                        // Percentage 
                        disableDom("txtLineDetailDiscount");
                        removeDisableDom("txtLineDetailPercent");
                    } else {
                        // Amount
                        disableDom("txtLineDetailPercent");
                        removeDisableDom("txtLineDetailDiscount");
                    }

                    removeDisableDom("txtLineDetailTotalCase");

                    $("#btnLineDetailSave").show();
                    $("#btnLineDetailSaveClose").show();
                } else {
                    disableDom("txtLineDetailTitle");
                    disableDom("txtLineDetailStartDate");
                    disableDom("txtLineDetailEndDate");
                    disableDom("txtLineDetailAccount");
                    disableDom("txtLineDetailSerial");
                    disableDom("txtLineDetailProduct");
                    disableDom("ddlLineDetailUnit");
                    disableDom("ddlLineDetailProvince");
                    disableDom("ddlLineDetailDistrict");
                    disableDom("ddlLineDetailWard");
                    disableDom("txtLineDetailLocation");
                    disableDom("txtLineDetailQuantity");
                    disableDom("txtLineDetailTotalPrice");
                    disableDom("txtLineDetailDiscount");
                    disableDom("txtLineDetailPercent");
                    disableDom("txtLineDetailTotalCase");

                    $("#btnLineDetailSave").hide();
                    $("#btnLineDetailSaveClose").hide();
                }

                $("#txtLineTitleHeader").text(data.Title);

                onLoadUnits(data.UnitGroupID, 'ddlLineDetailUnit', data.UnitID, true);

                $("#txtLineDetailTitle").val(data.Title);

                var startDate = data.StartDate != null ? formatDate(new Date(data.StartDate), "yyyy-mm-dd") : "";
                $("#txtLineDetailStartDate").val(startDate);

                var endDate = data.EndDate != null ? formatDate(new Date(data.EndDate), "yyyy-mm-dd") : "";
                $("#txtLineDetailEndDate").val(endDate);

                $("#txtLineDetailAccount").val(data.AccountName);
                $("#txtLineDetailAccountVal").val(data.AccountID);

                $("#txtLineDetailSerial").val(data.SerialNumber);

                $("#txtLineDetailProduct").val(data.ProductName);
                $("#txtLineDetailProductVal").val(data.ProductID);

                var province = data.ProvinceID == null ? null : data.ProvinceID;
                var district = data.DistrictID == null ? null : data.DistrictID;
                var ward = data.WardID == null ? null : data.WardID;

                onLoadCommonProvinces("ddlLineDetailProvince", true, province, district, ward);

                $("#txtLineDetailLocation").val(data.Location);

                var quantity = data.Quantity != null ? formatNumber(data.Quantity) : 0;
                $("#txtLineDetailQuantity").val(quantity);

                var totalPrice = data.TotalPrice != null ? formatNumber(data.TotalPrice) : 0;
                $("#txtLineDetailTotalPrice").val(totalPrice);

                var discount = data.Discount != null ? formatNumber(data.Discount) : "";
                $("#txtLineDetailDiscount").val(discount);

                var percent = data.PercentageDiscount != null ? formatNumber(data.PercentageDiscount) : "";
                $("#txtLineDetailPercent").val(percent);

                var net = data.Net != null ? formatNumber(data.Net) : 0;
                $("#txtLineDetailNet").val(net);

                var rate = data.Rate != null ? formatNumber(data.Rate) : 0;
                $("#txtLineDetailRate").val(rate);

                var totalCases = data.TotalCases != null ? formatNumber(data.TotalCases) : 0;
                $("#txtLineDetailTotalCase").val(totalCases);

                var used = data.Used != null ? formatNumber(data.Used) : 0;
                $("#txtLineDetailUsed").val(used);

                var remaining = data.Remaining != null ? formatNumber(data.Remaining) : 0;
                $("#txtLineDetailRemaining").val(remaining);

                $("#modalUpdateLine").modal("show");

                $("#loader").hide();
            } else if (rs.code == 310) {
                returnLogin();
            } else {
                console.log(rs);
                alertError(rs.messVN);
                $("#loader").hide();
            }
        });
    } else {
        $("#modalCreateLine").modal("hide");
        $("#modalUpdateLine").modal("hide");

        onLoadDataLines(1);

        clearAllForm("contentCreateLine");
    }
}



/*Update*/
function submitUpdate(typeSave, status, isAssign) {
    var owner = "";
    var statusContract = "";

    if (status) {
        statusContract = status;

        owner = $("#txtDetailOwnerVal").val();
    } else {
        statusContract = $("#ddlDetailStatusReason").val();

        if (isAssign) {
            owner = $("#txtDetailAssignVal").val();
        } else {
            owner = $("#txtDetailOwnerVal").val();
        }
    }

    var id = $("#hdfDetailID").val();
    var name = $("#txtDetailName").val();
    var account = $("#txtDetailAccountVal").val();
    var start = $("#txtDetailStartDate").val();
    var end = $("#txtDetailEndDate").val();
    var address = $("#txtDetailAddress").val();
    var description = $("#txtDetailDescription").val();
    var level = $("#ddlDetailServiceLevel").val();
    var province = $("#ddlDetailProvince").val() !== "0" && $("#ddlDetailProvince").val() != 0 ? $("#ddlDetailProvince").val() : null;
    var district = $("#ddlDetailDistrict").val() !== "0" && $("#ddlDetailDistrict").val() != 0 ? $("#ddlDetailDistrict").val() : null;
    var ward = $("#ddlDetailWard").val() !== "0" && $("#ddlDetailWard").val() != 0 ? $("#ddlDetailWard").val() : null;

    var billAccount = $("#txtDetailBillAccountVal").val();
    var billStart = $("#txtDetailBillStartDate").val();
    var billEnd = $("#txtDetailBillEndDate").val();
    var billEnd = $("#txtDetailBillEndDate").val();
    var billFrequency = $("#ddlDetailBillFrequency").val();
    var billAddress = $("#txtDetailBillAddress").val();
    var billProvince = $("#ddlDetailBillProvince").val() !== "0" && $("#ddlDetailBillProvince").val() != 0 ? $("#ddlDetailBillProvince").val() : null;
    var billDistrict = $("#ddlDetailBillDistrict").val() !== "0" && $("#ddlDetailBillDistrict").val() != 0 ? $("#ddlDetailBillDistrict").val() : null;
    var billWard = $("#ddlDetailBillWard").val() !== "0" && $("#ddlDetailBillWard").val() != 0 ? $("#ddlDetailBillWard").val() : null;

    var validationChecks = [];

    validationChecks = [
        { input: owner, type: 1, element: 'text', name: 'txtDetailOwner' },
        { input: name, type: 1, element: 'text', name: 'txtDetailName' },
        { input: account, type: 1, element: 'text', name: 'txtDetailAccount' },
        { input: start, type: 1, element: 'text', name: 'txtDetailStartDate' },
        { input: end, type: 1, element: 'text', name: 'txtDetailEndDate' },
        { input: billAccount, type: 1, element: 'text', name: 'txtDetailBillAccount' },
    ];

    for (const check of validationChecks) {
        if (checkValidateValue(check.input, check.type)) {
            if (check.element) {
                warningInvalidValue(check.name, check.type, check.element);
            }
            else {
                warningInvalidValue(check.name, 2);
            }

            return;
        }
    }

    var days = "";

    if (start >= end) {
        alertWarning("Ngày bắt đầu phải trước ngày kết thúc");
        return;
    } else {
        days = $("#txtDetailDays").val();
    }

    var settings = {
        "url": api_url + "contracts",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "OwnerID": owner,
            "AccountID": account,
            "Name": name,
            "ContractStartDate": start,
            "ContractEndDate": end,
            "DurationInDays": days,
            "ServiceLevel": level,
            "Status": statusContract,
            "ContractProvinceID": province,
            "ContractDistrictID": district,
            "ContractWardID": ward,
            "ContractAddress": address,
            "BillAccountID": billAccount,
            "BillStartDate": billStart,
            "BillEndDate": billEnd,
            "BillProvinceID": billProvince,
            "BillDistrictID": billDistrict,
            "BillWardID": billWard,
            "BillAddress": billAddress,
            "BillFrequency": billFrequency,
            "Description": description,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewDetails(id);
            } else if (typeSave == 2) {
                viewDetails();
            }

            closeAssignBlock();

            $("#loader").hide();
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            alertError(rs.messVN);
            $("#loader").hide();
        }
    });
}


function submitUpdateLine(typeSave) {
    var id = $("#hdfLineID").val();
    var contractID = $("#hdfDetailID").val();
    var account = $("#txtLineDetailAccountVal").val();
    var serial = $("#txtLineDetailSerial").val();
    var title = $("#txtLineDetailTitle").val();
    var product = $("#txtLineDetailProductVal").val();
    var unit = $("#ddlLineDetailUnit").val();
    var start = $("#txtLineDetailStartDate").val();
    var end = $("#txtLineDetailEndDate").val();
    var province = $("#ddlLineDetailProvince").val() !== "0" && $("#ddlLineDetailProvince").val() != 0 ? $("#ddlLineDetailProvince").val() : null;
    var district = $("#ddlLineDetailDistrict").val() !== "0" && $("#ddlLineDetailDistrict").val() != 0 ? $("#ddlLineDetailDistrict").val() : null;
    var ward = $("#ddlLineDetailWard").val() !== "0" && $("#ddlLineDetailWard").val() != 0 ? $("#ddlLineDetailWard").val() : null;
    var location = $("#txtLineDetailLocation").val();
    var quantity = getValueWithoutCommas($("#txtLineDetailQuantity").val());
    var totalPrice = getValueWithoutCommas($("#txtLineDetailTotalPrice").val());
    var discount = getValueWithoutCommas($("#txtLineDetailDiscount").val());
    var percent = getValueWithoutCommas($("#txtLineDetailPercent").val());
    var totalCase = getValueWithoutCommas($("#txtLineDetailTotalCase").val());
    
    validationChecks = [
        { input: account, type: 1, element: 'text', name: 'txtLineDetailAccount' },
        { input: title, type: 1, element: 'text', name: 'txtLineDetailTitle' },
        { input: start, type: 1, element: 'text', name: 'txtLineDetailStartDate' },
        { input: end, type: 1, element: 'text', name: 'txtLineDetailEndDate' },
        { input: totalPrice, type: 1, element: 'text', name: 'txtLineDetailTotalPrice' },
        { input: totalCase, type: 1, element: 'text', name: 'txtLineDetailTotalCase' },
    ];

    for (const check of validationChecks) {
        if (checkValidateValue(check.input, check.type)) {
            if (check.element) {
                warningInvalidValue(check.name, check.type, check.element);
            }
            else {
                warningInvalidValue(check.name, 2);
            }

            return;
        }
    }

    if (start >= end) {
        alertWarning("Ngày bắt đầu phải trước ngày kết thúc");
        return;
    }

    var settings = {
        "url": api_url + "contracts/lines",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "ContractID": contractID,
            "ProductID": product,
            "AccountID": account,
            "UnitID": unit,
            "SerialNumber": serial,
            "Title": title,
            "StartDate": start,
            "EndDate": end,
            "Quantity": quantity,
            "TotalPrice": totalPrice,
            "Discount": discount,
            "PercentageDiscount": percent,
            "TotalCases": totalCase,
            "ProvinceID": province,
            "DistrictID": district,
            "WardID": ward,
            "Location": location,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewLineDetails(id);
            } else if (typeSave == 2) {
                viewLineDetails();
            }

            $("#loader").hide();
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            alertError(rs.messVN);
            $("#loader").hide();
        }
    });
}



/*Delete*/
function submitDelete() {
    var data = [];

    var idCont = $("#hdfDetailID").val();

    if (idCont != null && idCont !== "" && idCont !== "undefined") {
        data.push(idCont);
    } else {
        $('.ckRow').each(function () {
            if ($(this).prop('checked') == true) {
                var id = $(this).val().split('&')[0];
                data.push(id);
            }
        });
    }

    if (data.length == 0) {
        alertWarning("Vui lòng chọn thông tin");
        return;
    }
    else {
        swal({
            text: "Bạn muốn xóa dữ liệu?",
            buttons: true,
            buttons: ["Hủy", "Đồng ý"],
            dangerMode: true,
        })
            .then((doit) => {
                if (doit) {
                    var dataInput = {
                        "ID": data,
                    }

                    var settings = {
                        "url": api_url + "contracts",
                        "method": "DELETE",
                        "data": JSON.stringify(dataInput),
                        "timeout": 0,
                        "headers": {
                            "Authorization": token,
                            "Content-Type": "application/json"
                        },
                    };

                    $("#loader").show();

                    $.ajax(settings).done(function (rs) {
                        if (rs.code == 200) {
                            alertSuccess(rs.messVN);
                            viewDetails();
                            $("#loader").hide();
                        } else if (rs.code == 310) {
                            returnLogin();
                        } else {
                            console.log(rs);
                            alertError(rs.messVN);
                            $("#loader").hide();
                        }
                    });
                }
            });
    }
}


function submitDeleteLine(idLine) {
    var idContract = $("#hdfDetailID").val();

    var data = [];

    if (idLine) {
        data.push(idLine);
    }

    if (data.length == 0) {
        alertWarning("Vui lòng chọn thông tin");
        return;
    }
    else {
        swal({
            text: "Bạn muốn xóa dữ liệu?",
            buttons: true,
            buttons: ["Hủy", "Đồng ý"],
            dangerMode: true,
        })
            .then((doit) => {
                if (doit) {
                    var dataInput = {
                        "ID": data,
                    }

                    var settings = {
                        "url": api_url + "contracts/lines/" + idContract,
                        "method": "DELETE",
                        "data": JSON.stringify(dataInput),
                        "timeout": 0,
                        "headers": {
                            "Authorization": token,
                            "Content-Type": "application/json"
                        },
                    };

                    $("#loader").show();

                    $.ajax(settings).done(function (rs) {
                        if (rs.code == 200) {
                            alertSuccess(rs.messVN);
                            viewLineDetails();
                            $("#loader").hide();
                        } else if (rs.code == 310) {
                            returnLogin();
                        } else {
                            console.log(rs);
                            alertError(rs.messVN);
                            $("#loader").hide();
                        }
                    });
                }
            });
    }
}



/*Pagination*/
function pageIndexLoad(totalPages, totalRecords) {
    $("#totalRecords").text(formatNumber(totalRecords));

    initializePagination('pagingMainContent', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadData(0, defaultLoadNumb);
    });
}


function pageIndexLoadLine(totalPages, totalRecords) {
    $("#totalRecordsLine").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentLine', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataLines(0);
    });
}



/*Clear form*/
function clearAllForm(dom) {
    $("#" + dom + " :input").val('');

    $("#" + dom + " :checkbox").prop('checked', false);

    $("#" + dom + " select").val('');

    $("#" + dom + ' .select2').each(function () {
        var defaultValue = $(this).data('default-value');

        if (defaultValue !== "undefined" && defaultValue !== "" && defaultValue != null) {
            $(this).val(defaultValue).trigger('change');
        }
    });

    $("#" + dom + ' .select-card-header').each(function () {
        var defaultValue = $(this).data('default-value');

        if (defaultValue !== "undefined" && defaultValue !== "" && defaultValue != null) {
            $(this).val(defaultValue).trigger('change');
        }
    });

    var account = $("#hdfDetailAccount").val();
    var accountID = $("#hdfDetailAccountID").val();
    var startDate = $("#hdfDetailStartDate").val();
    var endDate = $("#hdfDetailEndDate").val();

    $("#txtLineAccount").val(account);
    $("#txtLineAccountVal").val(accountID);
    $("#txtLineStartDate").val(startDate);
    $("#txtLineEndDate").val(endDate);
}



/*Select2*/
$(function () {
    $('.select2').select2();

    $('.select2').css('width', '100%');

    //modalCreateLine
    $("#ddlLineUnit").select2({
        dropdownParent: $("#modalCreateLine")
    });

    $("#ddlLineProvince").select2({
        dropdownParent: $("#modalCreateLine")
    });

    $("#ddlLineDistrict").select2({
        dropdownParent: $("#modalCreateLine")
    });

    $("#ddlLineWard").select2({
        dropdownParent: $("#modalCreateLine")
    });


    //modalCreateLine
    $("#ddlLineDetailUnit").select2({
        dropdownParent: $("#modalUpdateLine")
    });

    $("#ddlLineDetailProvince").select2({
        dropdownParent: $("#modalUpdateLine")
    });

    $("#ddlLineDetailDistrict").select2({
        dropdownParent: $("#modalUpdateLine")
    });

    $("#ddlLineDetailWard").select2({
        dropdownParent: $("#modalUpdateLine")
    });
});

