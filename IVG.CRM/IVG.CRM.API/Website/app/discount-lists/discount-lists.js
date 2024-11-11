
$(document).ready(function () {
    
    onLoadData(0, defaultLoadNumb);
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
        $("#breadcrumbType").text("Draft Discount Lists");
    } else if (type == 1) {
        $("#btnFilterActive").addClass("active");
        $("#breadcrumbType").text("Active Discount Lists");
    } else if (type == 2) {
        $("#btnFilterInactive").addClass("active");
        $("#breadcrumbType").text("Inactive Discount Lists");
    } else {
        $("#btnFilterAll").addClass("active");
        $("#breadcrumbType").text("All Discount Lists");
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

    if (key) {
        pageNumber = 1;
        $("#pageIndex").val(1);
        if ($('#pagingMainContent').data("twbs-pagination")) {
            $('#pagingMainContent').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "discount-lists/list",
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

                    var type = ""
                    if (data[i].Type == null || data[i].Type === "undefined" || data[i].Type === "") {
                        type = "-";
                    } else {
                        if (data[i].Type == 1) {
                            type = 'Phần trăm';
                        } else {
                            type = 'Số tiền';
                        }
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`)">`
                    html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-check cursor-pointer" /></td>`;
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Name}</span></td>`;
                    html += `<td>${type}</td>`;

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


function onLoadDataDLItems(key) {
    var id = $("#hdfDetailID").val();

    /*Paging*/
    var pageNumber = $("#pageIndexDLItem").val();
    var pageSize = $("#pageSizeDLItem").val();

    if (key) {
        pageNumber = 1;
        $("#pageIndexDLItem").val(1);
        if ($('#pagingMainContentDLItem').data("twbs-pagination")) {
            $('#pagingMainContentDLItem').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "discount-lists/items/list",
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
                    var begin = "";
                    if (data[i].BeginQuantity == null || data[i].BeginQuantity === "undefined" || data[i].BeginQuantity === "") {
                        begin = "-";
                    } else {
                        begin = formatNumber(data[i].BeginQuantity);
                    }

                    var end = "";
                    if (data[i].EndQuantity == null || data[i].EndQuantity === "undefined" || data[i].EndQuantity === "") {
                        end = "-";
                    } else {
                        end = formatNumber(data[i].EndQuantity);
                    }

                    var percent = "";
                    if (data[i].Percentage == null || data[i].Percentage === "undefined" || data[i].Percentage === "") {
                        percent = '-';
                    } else {
                        percent = formatNumber(data[i].Percentage);
                    }

                    var amount = "";
                    if (data[i].Amount == null || data[i].Amount === "undefined" || data[i].Amount === "") {
                        amount = "-";
                    } else {
                        amount = formatNumber(data[i].Amount);
                    }

                    html += `<tr ondblclick="viewDLItemDetails(\`` + data[i].ID + `\`)">`;
                    html += `<td><span title="Xem chi tiết" onclick="viewDLItemDetails(\`` + data[i].ID + `\`)" class="table-detail">${begin}</span></td>`;
                    html += `<td>${end}</td>`;
                    html += `<td>${percent}</td>`;
                    html += `<td>${amount}</td>`;
                    html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeleteDLItem(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyDLItem').html(html);

            pageIndexLoadDLItem(rs.paging.TotalPages, rs.paging.TotalRecords);

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
    var type = $("#ddlType").val();

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
        "url": api_url + "discount-lists",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "Name": name,
            "Type": type,
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


function submitCreateDLItem(typeSave) {
    var id = $("#hdfDetailID").val();
    var begin = getValueWithoutCommas($("#txtDLItemBegin").val());
    var end = getValueWithoutCommas($("#txtDLItemEnd").val());
    var amount = getValueWithoutCommas($("#txtDLItemAmount").val());
    var percent = getValueWithoutCommas($("#txtDLItemPercent").val());

    var type = $("#hdfTypeDL").val();

    var validationChecks = [];

    if (type == 1) {
        validationChecks = [
            { input: begin, type: 1, element: 'text', name: 'txtDLItemBegin' },
            { input: end, type: 1, element: 'text', name: 'txtDLItemEnd' },
            { input: percent, type: 1, element: 'text', name: 'txtDLItemPercent' },
        ];
    } else {
        validationChecks = [
            { input: begin, type: 1, element: 'text', name: 'txtDLItemBegin' },
            { input: end, type: 1, element: 'text', name: 'txtDLItemEnd' },
            { input: amount, type: 1, element: 'text', name: 'txtDLItemAmount' },
        ];
    }

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

    if (begin > end) {
        alertWarning("Số lượng cuối cùng phải lớn hơn hoặc bằng số lượng bắt đầu.");
        return;
    }

    var settings = {
        "url": api_url + "discount-lists/items",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "DiscountListID": id,
            "BeginQuantity": begin,
            "EndQuantity": end,
            "Amount": amount,
            "Percentage": percent,
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
                $("#modalCreateDLItem").modal("hide");
                viewDLItemDetails(data);
            } else if (typeSave == 2) {
                viewDLItemDetails();
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
            "url": api_url + "discount-lists/" + id,
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

                $("#hdfDLCommon").val(data.Name);

                if (data.Type == 1) {
                    disableDom("txtDLItemAmount");
                    removeDisableDom("txtDLItemPercent");
                } else {
                    disableDom("txtDLItemPercent");
                    removeDisableDom("txtDLItemAmount");
                }

                if (data.Status == 0) {
                    // Draft
                    $("#btnDetailActivate").hide();
                    $("#btnDetailDeactivate").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailPublish").show();

                    removeDisableDom("txtDetailName");
                } else if (data.Status == 1) {
                    // Activate
                    $("#btnDetailPublish").hide();
                    $("#btnDetailActivate").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailDeactivate").show();
                    $("#btnDetailAddNew").show();

                    removeDisableDom("txtDetailName");
                } else if (data.Status == 2) {
                    // Deactivate
                    $("#btnDetailSaveClose").hide();
                    $("#btnDetailSave").hide();
                    $("#btnDetailPublish").hide();
                    $("#btnDetailDeactivate").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailActivate").show();

                    disableDom("txtDetailName");
                }

                $("#titleDetail").text(data.Name);
                $("#hdfTypeDL").val(data.Type);
                $("#txtDLItemDiscountList").val(data.Name);

                $("#txtDetailName").val(data.Name);
                $("#ddlDetailStatus").val(data.Status).trigger('change');
                $("#ddlDetailType").val(data.Type).trigger('change');

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


function viewDLItemDetails(id) {
    if (id) {
        $("#hdfDLItemID").val(id);

        var settings = {
            "url": api_url + "discount-lists/items/" + id,
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

                var type = $("#hdfTypeDL").val();

                if (type == 1) {
                    disableDom("txtDLItemDetailAmount");
                    removeDisableDom("txtDLItemDetailPercent");

                    var percent = data.Percentage != null ? formatNumber(data.Percentage) : 0;
                    $("#txtDLItemDetailPercent").val(percent);

                    $("#txtDLItemDetailAmount").val("");
                } else {
                    disableDom("txtDLItemDetailPercent");
                    removeDisableDom("txtDLItemDetailAmount");

                    var amount = data.Amount != null ? formatNumber(data.Amount) : 0;
                    $("#txtDLItemDetailAmount").val(amount);

                    $("#txtDLItemDetailPercent").val("");
                }

                $("#txtDLItemTitle").text(data.DiscountListName);

                $("#txtDLItemDetailDiscountList").val(data.DiscountListName);

                var begin = data.BeginQuantity != null ? formatNumber(data.BeginQuantity) : 0;
                $("#txtDLItemDetailBegin").val(begin);

                var end = data.EndQuantity != null ? formatNumber(data.EndQuantity) : 0;
                $("#txtDLItemDetailEnd").val(end);

                $("#modalUpdateDLItem").modal("show");

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
        $("#modalCreateDLItem").modal("hide");
        $("#modalUpdateDLItem").modal("hide");

        onLoadDataDLItems(1);

        clearAllForm("contentCreateDLItem");
    }
}



/*Update*/
function submitUpdate(typeSave, status) {
    var statusDL = "";

    if (status) {
        statusDL = status;
    } else {
        statusDL = $("#ddlDetailStatus").val();
    }

    var id = $("#hdfDetailID").val();
    var name = $("#txtDetailName").val();

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
        "url": api_url + "discount-lists",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "Name": name,
            "Status": statusDL,
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


function submitUpdateDLItem(typeSave) {
    var id = $("#hdfDLItemID").val();

    var begin = getValueWithoutCommas($("#txtDLItemDetailBegin").val());
    var end = getValueWithoutCommas($("#txtDLItemDetailEnd").val());
    var percent = getValueWithoutCommas($("#txtDLItemDetailPercent").val());
    var amount = getValueWithoutCommas($("#txtDLItemDetailAmount").val());

    var type = $("#hdfTypeDL").val();

    var validationChecks = [];

    if (type == 1) {
        validationChecks = [
            { input: begin, type: 1, element: 'text', name: 'txtDLItemDetailBegin' },
            { input: end, type: 1, element: 'text', name: 'txtDLItemDetailEnd' },
            { input: percent, type: 1, element: 'text', name: 'txtDLItemDetailPercent' },
        ];
    } else {
        validationChecks = [
            { input: begin, type: 1, element: 'text', name: 'txtDLItemDetailBegin' },
            { input: end, type: 1, element: 'text', name: 'txtDLItemDetailEnd' },
            { input: amount, type: 1, element: 'text', name: 'txtDLItemDetailAmount' },
        ];
    }

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

    if (begin > end) {
        alertWarning("Số lượng cuối cùng phải lớn hơn hoặc bằng số lượng bắt đầu.");
        return;
    }

    var settings = {
        "url": api_url + "discount-lists/items",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "BeginQuantity": begin,
            "EndQuantity": end,
            "Amount": amount,
            "Percentage": percent,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewDLItemDetails(id);
            } else if (typeSave == 2) {
                viewDLItemDetails();
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


function pageIndexLoadDLItem(totalPages, totalRecords) {
    $("#totalRecordsDLItem").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentDLItem', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataDLItems(0);
    });
}



/*Delete*/
function submitDelete() {
    var data = [];

    var idDL = $("#hdfDetailID").val();

    if (idDL != null && idDL !== "" && idDL !== "undefined") {
        data.push(idDL);
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
                        "url": api_url + "discount-lists",
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


function submitDeleteDLItem(idDLI) {
    var data = [];

    if (idDLI) {
        data.push(idDLI);
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
                        "url": api_url + "discount-lists/items",
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
                            viewDLItemDetails();
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
    var hdfDLCommon = $("#hdfDLCommon").val();

    $("#txtDLItemDiscountList").val(hdfDLCommon);
}



/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});
