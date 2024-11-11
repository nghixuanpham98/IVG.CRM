
$(document).ready(function () {
    
    onLoadData(0, defaultLoadNumb);

    initAutoComplete("#txtPLItemProduct", "products/special", getDataByKey, function (selectedItem) {
        onLoadUnits(selectedItem.data.UnitGroupID, 'ddlPLItemUnit');
        $("#txtPLItemProductVal").val(selectedItem.data.ID);
        $("#hdfUnitGroup").val(selectedItem.data.UnitGroupID);
    }, 3);

    initAutoComplete("#txtPLItemDetailProduct", "products/special", getDataByKey, function (selectedItem) {
        onLoadUnits(selectedItem.data.UnitGroupID, 'ddlPLItemDetailUnit');
        $("#txtPLItemDetailProductVal").val(selectedItem.data.ID);
        $("#hdfUnitGroup").val(selectedItem.data.UnitGroupID);
    }, 3);


    // Discount
    initAutoComplete("#txtPLItemDiscount", "discount-lists", getDataByKey, function (selectedItem) {
        $("#txtPLItemDiscountVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtPLItemDetailDiscount", "discount-lists", getDataByKey, function (selectedItem) {
        $("#txtPLItemDetailDiscountVal").val(selectedItem.data.ID);
    });
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
        $("#breadcrumbType").text("Draft Price Lists");
    } else if (type == 1) {
        $("#btnFilterActive").addClass("active");
        $("#breadcrumbType").text("Active Price Lists");
    } else if (type == 2) {
        $("#btnFilterInactive").addClass("active");
        $("#breadcrumbType").text("Inactive Price Lists");
    } else {
        $("#btnFilterAll").addClass("active");
        $("#breadcrumbType").text("All Price Lists");
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
        "url": api_url + "price-lists/list",
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
                    if (data[i].Name == null || data[i].Name === "undefined" || data[i].Name === "") {
                        data[i].Name = "-";
                    }

                    var startDate = data[i].StartDate;
                    if (data[i].StartDate == null || data[i].StartDate === "undefined" || data[i].StartDate === "") {
                        startDate = "-";
                    } else {
                        startDate = formatDate(new Date(data[i].StartDate), "dd-mm-yyyy")
                    }

                    var endDate = data[i].EndDate;
                    if (data[i].EndDate == null || data[i].EndDate === "undefined" || data[i].EndDate === "") {
                        endDate = "-";
                    } else {
                        endDate = formatDate(new Date(data[i].EndDate), "dd-mm-yyyy")
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`)">`
                    html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-check cursor-pointer" /></td>`;
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Name}</span></td>`;
                    html += `<td>${startDate}</td>`;
                    html += `<td>${endDate}</td>`;

                    var status = "";
                    if (data[i].Status == null || data[i].Status === "undefined" || data[i].Status === "") {
                        html += `<td>-</td>`;
                    } else {
                        if (data[i].Status == 0) {
                            status = 'Nháp';

                            html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 1) {
                            status = 'Đang hoạt động';

                            html += `<td><span class="badge rounded-pill bg-success fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 2) {
                            status = 'Ngừng hoạt động';

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


function onLoadDataPLItems(key) {
    var id = $("#hdfDetailID").val();

    /*Paging*/
    var pageNumber = $("#pageIndexPLItem").val();
    var pageSize = $("#pageSizePLItem").val();

    if (key) {
        pageNumber = 1;
        $("#pageIndexPLItem").val(1);
        if ($('#pagingMainContentPLItem').data("twbs-pagination")) {
            $('#pagingMainContentPLItem').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "price-lists/items/list",
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
                    if (data[i].ProductName == null || data[i].ProductName === "undefined" || data[i].ProductName === "") {
                        data[i].ProductName = "-";
                    }

                    if (data[i].UnitName == null || data[i].UnitName === "undefined" || data[i].UnitName === "") {
                        data[i].UnitName = "-";
                    }

                    var amount = "";
                    if (data[i].Amount == null || data[i].Amount === "undefined" || data[i].Amount === "") {
                        amount = "-";
                    } else {
                        amount = formatNumber(data[i].Amount);
                    }

                    html += `<tr ondblclick="viewPLItemDetails(\`` + data[i].ID + `\`)">`;
                    html += `<td><span title="Xem chi tiết" onclick="viewPLItemDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].ProductName}</span></td>`;
                    html += `<td>${data[i].UnitName}</td>`;
                    html += `<td>${amount}</td>`;
                    html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeletePLItem(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyPLItem').html(html);

            pageIndexLoadPLItem(rs.paging.TotalPages, rs.paging.TotalRecords);

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

        $("#tabGeneralLink").addClass("active");
        $("#tabGeneral").addClass("active");
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
    var name = $("#txtName").val();
    var start = $("#txtStartDate").val();
    var end = $("#txtEndDate").val();
    var description = $("#txtDescription").val();

    var validationChecks = [];

    validationChecks = [
        { input: name, type: 1, element: 'text', name: 'txtName' },
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

    var settings = {
        "url": api_url + "price-lists",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "Name": name,
            "StartDate": start,
            "EndDate": end,
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


function submitCreatePLItem(typeSave) {
    var id = $("#hdfDetailID").val();
    var product = $("#txtPLItemProductVal").val();
    var unit = $("#ddlPLItemUnit").val();
    var discount = $("#txtPLItemDiscountVal").val();
    var amount = getValueWithoutCommas($("#txtPLItemAmount").val());

    var validationChecks = [];

    validationChecks = [
        { input: product, type: 1, element: 'text', name: 'txtPLItemProduct' },
        { input: unit, type: 3, name: 'ddlPLItemUnit' },
        { input: amount, type: 1, element: 'text', name: 'txtPLItemAmount' },
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

    var settings = {
        "url": api_url + "price-lists/items",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ProductID": product,
            "PriceListID": id,
            "UnitID": unit,
            "DiscountListID": discount,
            "Amount": amount,
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
                $("#modalCreatePLItem").modal("hide");
                viewPLItemDetails(data);
            } else if (typeSave == 2) {
                viewPLItemDetails();
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



/*View Detail*/
function viewDetails(id) {
    $(".nav-custom").removeClass("active");

    if (id) {
        $("#contentList").hide();
        $("#contentCreate").hide();
        $("#contentDetail").show();

        /*Go back to default nav-tab*/
        $("#tabDetailGeneralLink").addClass("active");
        $("#tabDetailGeneral").addClass("active");

        $("#hdfDetailID").val(id);

        var settings = {
            "url": api_url + "price-lists/" + id,
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

                $("#hdfPLCommon").val(data.Name);

                if (data.Status == 0) {
                    // Draft
                    $("#btnDetailActivate").hide();
                    $("#btnDetailDeactivate").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailPublish").show();

                    removeDisableDom("txtDetailName");
                    removeDisableDom("txtDetailStartDate");
                    removeDisableDom("txtDetailEndDate");
                    removeDisableDom("txtDetailDescription");
                } else if (data.Status == 1) {
                    // Activate
                    $("#btnDetailPublish").hide();
                    $("#btnDetailActivate").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailDeactivate").show();
                    $("#btnDetailAddNew").show();

                    removeDisableDom("txtDetailName");
                    removeDisableDom("txtDetailStartDate");
                    removeDisableDom("txtDetailEndDate");
                    removeDisableDom("txtDetailDescription");
                } else if (data.Status == 2) {
                    // Deactivate
                    $("#btnDetailSaveClose").hide();
                    $("#btnDetailSave").hide();
                    $("#btnDetailPublish").hide();
                    $("#btnDetailDeactivate").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailActivate").show();

                    disableDom("txtDetailName");
                    disableDom("txtDetailStartDate");
                    disableDom("txtDetailEndDate");
                    disableDom("txtDetailDescription");
                }

                $("#titleDetail").text(data.Name);
                $("#txtPLItemPriceList").val(data.Name);
                $("#txtDetailName").val(data.Name);
                $("#ddlDetailStatus").val(data.Status).trigger('change');

                var start = data.StartDate != null ? formatDate(new Date(data.StartDate), "yyyy-mm-dd") : "";
                $("#txtDetailStartDate").val(start);

                var end = data.EndDate != null ? formatDate(new Date(data.EndDate), "yyyy-mm-dd") : "";
                $("#txtDetailEndDate").val(end);

                $("#txtDetailDescription").val(data.Description);

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


function viewPLItemDetails(id) {
    if (id) {
        $("#hdfPLItemID").val(id);

        var settings = {
            "url": api_url + "price-lists/items/" + id,
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

                onLoadUnits(data.UnitGroupID, 'ddlPLItemDetailUnit', data.UnitID, true);

                $("#txtPLItemTitle").text(data.ProductName);
                $("#txtPLItemDetailPriceList").val(data.PriceListName);
                $("#txtPLItemDetailProduct").val(data.ProductCode + " - " + data.ProductName);
                $("#txtPLItemDetailProductVal").val(data.ProductID);

                var amount = data.Amount != null ? formatNumber(data.Amount) : 0;
                $("#txtPLItemDetailAmount").val(amount);

                $("#txtPLItemDetailDiscount").val(data.DiscountListName);
                $("#txtPLItemDetailDiscountVal").val(data.DiscountListID);

                $("#modalUpdatePLItem").modal("show");

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
        $("#modalCreatePLItem").modal("hide");
        $("#modalUpdatePLItem").modal("hide");

        onLoadDataPLItems(1);

        clearAllForm("contentCreatePLItem");
    }
}



/*Update*/
function submitUpdate(typeSave, status) {
    var statusPL = "";

    if (status) {
        statusPL = status;
    } else {
        statusPL = $("#ddlDetailStatus").val();
    }

    var id = $("#hdfDetailID").val();
    var name = $("#txtDetailName").val();
    var start = $("#txtDetailStartDate").val();
    var end = $("#txtDetailEndDate").val();
    var description = $("#txtDetailDescription").val();

    var validationChecks = [];

    validationChecks = [
        { input: name, type: 1, element: 'text', name: 'txtDetailName' }
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

    var settings = {
        "url": api_url + "price-lists",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "Name": name,
            "StartDate": start,
            "EndDate": end,
            "Status": statusPL,
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


function submitUpdatePLItem(typeSave) {
    var id = $("#hdfPLItemID").val();
    var priceList = $("#hdfDetailID").val();
    var product = $("#txtPLItemDetailProductVal").val();
    var unit = $("#ddlPLItemDetailUnit").val();
    var discount = $("#txtPLItemDetailDiscountVal").val();
    var amount = getValueWithoutCommas($("#txtPLItemDetailAmount").val());

    var validationChecks = [];

    validationChecks = [
        { input: product, type: 1, element: 'text', name: 'txtPLItemDetailProduct' },
        { input: unit, type: 3, name: 'ddlPLItemDetailUnit' },
        { input: amount, type: 1, element: 'text', name: 'txtPLItemDetailAmount' },
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

    var settings = {
        "url": api_url + "price-lists/items",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "ProductID": product,
            "PriceListID": priceList,
            "UnitID": unit,
            "DiscountListID": discount,
            "Amount": amount,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewPLItemDetails(id);
            } else if (typeSave == 2) {
                viewPLItemDetails();
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



/*Pagination*/
function pageIndexLoad(totalPages, totalRecords) {
    $("#totalRecords").text(formatNumber(totalRecords));

    initializePagination('pagingMainContent', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadData(0, defaultLoadNumb);
    });
}


function pageIndexLoadPLItem(totalPages, totalRecords) {
    $("#totalRecordsPLItem").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentPLItem', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataPLItems(0);
    });
}



/*Delete*/
function submitDelete() {
    var data = [];

    var idPL = $("#hdfDetailID").val();

    if (idPL != null && idPL !== "" && idPL !== "undefined") {
        data.push(idPL);
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
                        "url": api_url + "price-lists",
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


function submitDeletePLItem(idPLI) {
    var data = [];

    if (idPLI) {
        data.push(idPLI);
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
                        "url": api_url + "price-lists/items",
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
                            viewPLItemDetails();
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

    // Set default value
    var hdfPLCommon = $("#hdfPLCommon").val();

    $("#txtPLItemPriceList").val(hdfPLCommon);
}



/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');

    $("#ddlPLItemUnit").select2({
        dropdownParent: $("#modalCreatePLItem")
    });

    $("#ddlPLItemDetailUnit").select2({
        dropdownParent: $("#modalUpdatePLItem")
    });
});
