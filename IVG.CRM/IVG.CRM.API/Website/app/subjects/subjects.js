
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
        $("#breadcrumbType").text("Draft Unit Groups");
    } else if (type == 1) {
        $("#btnFilterActive").addClass("active");
        $("#breadcrumbType").text("Active Unit Groups");
    } else if (type == 2) {
        $("#btnFilterInactive").addClass("active");
        $("#breadcrumbType").text("Inactive Unit Groups");
    } else {
        $("#btnFilterAll").addClass("active");
        $("#breadcrumbType").text("All Unit Groups");
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
        "url": api_url + "unit-groups/list",
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

                    if (data[i].PrimaryUnit == null || data[i].PrimaryUnit === "undefined" || data[i].PrimaryUnit === "") {
                        data[i].PrimaryUnit = "-";
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`)">`
                    html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-check cursor-pointer" /></td>`;
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Name}</span></td>`;
                    html += `<td>${data[i].PrimaryUnit}</td>`;

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


function onLoadDataUnits(key) {
    var id = $("#hdfDetailID").val();
    /*Paging*/
    var pageNumber = $("#pageIndexUnit").val();
    var pageSize = $("#pageSizeUnit").val();

    if (key) {
        pageNumber = 1;
        $("#pageIndexUnit").val(1);
        if ($('#pagingMainContentUnit').data("twbs-pagination")) {
            $('#pagingMainContentUnit').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "units/list",
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
                    if (data[i].Name == null || data[i].Name === "undefined" || data[i].Name === "") {
                        data[i].Name = "-";
                    }

                    if (data[i].BaseName == null || data[i].BaseName === "undefined" || data[i].BaseName === "") {
                        data[i].BaseName = "-";
                    }

                    if (data[i].Quantity == null || data[i].Quantity === "undefined" || data[i].Quantity === "") {
                        data[i].Quantity = "-";
                    }

                    if (data[i].BaseID == null || data[i].BaseID === "undefined" || data[i].BaseID === "") {
                        onLoadUnitBase(data[i].ID);
                    }

                    html += `<tr ondblclick="viewUnitDetails(\`` + data[i].ID + `\`)">`;
                    html += `<td><span title="Xem chi tiết" onclick="viewUnitDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Name}</span></td>`;
                    html += `<td>${data[i].BaseName}</td>`;
                    html += `<td>${data[i].Quantity}</td>`;

                    if (data[i].BaseID == null || data[i].BaseID === "undefined" || data[i].BaseID === "") {
                        html += `<td></td>`;
                    } else {
                        html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeleteUnit(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    }
                    
                    html += `</tr>`;

                    
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyUnit').html(html);

            pageIndexLoadUnit(rs.paging.TotalPages, rs.paging.TotalRecords);

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


function onLoadUnitBase(base) {
    var id = $("#hdfDetailID").val();

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

        optionHtml += `<option value="0">-- Chọn đơn vị cơ sở --</option>`;

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;

            for (var i = 0; i < dataLength; i++) {
                if (data[i].ID == base) {
                    optionHtml += `<option value="${data[i].ID}">${data[i].Name}</option>`;
                }
            }

            $("#ddlUnitBase").html(optionHtml);
            $("#ddlDetailUnitBase").html(optionHtml);

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
    var primaryUnit = $("#txtPrimaryUnit").val();
    var status = $("#ddlStatus").val();

    var validationChecks = [];

    validationChecks = [
        { input: name, type: 1, element: 'text', name: 'txtName' },
        { input: primaryUnit, type: 1, element: 'text', name: 'txtPrimaryUnit' },
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
        "url": api_url + "unit-groups",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "Name": name,
            "PrimaryUnit": primaryUnit,
            "Status": status,
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


function submitCreateUnit(typeSave) {
    var parent = $("#hdfDetailID").val();
    var base = $("#ddlUnitBase").val();
    var name = $("#txtUnitName").val();
    var quantity = getValueWithoutCommas($("#txtUnitQuantity").val());

    var validationChecks = [];

    validationChecks = [
        { input: name, type: 1, element: 'text', name: 'txtUnitName' },
        { input: quantity, type: 1, element: 'text', name: 'txtUnitQuantity' },
        { input: base, type: 3, name: 'ddlUnitBase' },
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
        "url": api_url + "units",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ParentID": parent,
            "BaseID": base,
            "Name": name,
            "Quantity": quantity,
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
                $("#modalCreateUnit").modal("hide");
                viewUnitDetails(data);
            } else if (typeSave == 2) {
                viewUnitDetails();
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
            "url": api_url + "unit-groups/" + id,
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

                if (data.Status == 0) {
                    // Draft
                    $("#btnDetailActivate").hide();
                    $("#btnDetailDeactivate").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailPublish").show();

                    removeDisableDom("txtDetailName");
                    removeDisableDom("txtDetailPrimaryUnit");
                } else if (data.Status == 1) {
                    // Activate
                    $("#btnDetailPublish").hide();
                    $("#btnDetailActivate").hide();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailSave").show();
                    $("#btnDetailDeactivate").show();
                    $("#btnDetailAddNew").show();

                    removeDisableDom("txtDetailName");
                    removeDisableDom("txtDetailPrimaryUnit");
                } else if (data.Status == 2) {
                    // Deactivate
                    $("#btnDetailSaveClose").hide();
                    $("#btnDetailSave").hide();
                    $("#btnDetailPublish").hide();
                    $("#btnDetailDeactivate").hide();
                    $("#btnDetailAddNew").hide();
                    $("#btnDetailActivate").show();

                    disableDom("txtDetailName");
                    disableDom("txtDetailPrimaryUnit");
                }

                $("#titleDetail").text(data.Name);
                $("#txtDetailName").val(data.Name);
                $("#txtDetailPrimaryUnit").val(data.PrimaryUnit);
                $("#ddlDetailStatus").val(data.Status).trigger('change');

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


function viewUnitDetails(id) {
    if (id) {
        $("#hdfUnitID").val(id);

        var settings = {
            "url": api_url + "units/" + id,
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

                if (data.BaseID == null) {
                    disableDom("ddlDetailUnitBase");
                    disableDom("txtDetailUnitQuantity");
                } else {
                    removeDisableDom("ddlDetailUnitBase");
                    removeDisableDom("txtDetailUnitQuantity");
                }

                $("#txtUnitTitle").text(data.Name);
                $("#txtDetailUnitName").val(data.Name);
                $("#txtDetailUnitQuantity").val(data.Quantity);
                $("#ddlDetailUnitBase").val(data.BaseID).trigger("change");

                $("#modalUpdateUnit").modal("show");

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
        $("#modalCreateUnit").modal("hide");
        $("#modalUpdateUnit").modal("hide");

        onLoadDataUnits(1);

        clearAllForm("contentCreateUnit");
    }
}



/*Update*/
function submitUpdate(typeSave, status) {
    var statusUnitGroup = "";

    if (status) {
        statusUnitGroup = status;
    } else {
        statusUnitGroup = $("#ddlDetailStatus").val();
    }

    var id = $("#hdfDetailID").val();
    var name = $("#txtDetailName").val();
    var primaryUnit = $("#txtDetailPrimaryUnit").val();

    var validationChecks = [];

    validationChecks = [
        { input: name, type: 1, element: 'text', name: 'txtDetailName' },
        { input: primaryUnit, type: 1, element: 'text', name: 'txtDetailPrimaryUnit' },
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
        "url": api_url + "unit-groups",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "Name": name,
            "PrimaryUnit": primaryUnit,
            "Status": statusUnitGroup,
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


function submitUpdateUnit(typeSave) {
    var parent = $("#hdfDetailID").val();
    var id = $("#hdfUnitID").val();
    var base = $("#ddlDetailUnitBase").val();
    var name = $("#txtDetailUnitName").val();
    var quantity = getValueWithoutCommas($("#txtDetailUnitQuantity").val());

    var validationChecks = [];

    if (base == null || base === "" || base === "undefined") {
        validationChecks = [
            { input: name, type: 1, element: 'text', name: 'txtDetailUnitName' }
        ];
    } else {
        validationChecks = [
            { input: name, type: 1, element: 'text', name: 'txtDetailUnitName' },
            { input: quantity, type: 1, element: 'text', name: 'txtDetailUnitQuantity' },
            { input: base, type: 3, name: 'ddlDetailUnitBase' }
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

    var settings = {
        "url": api_url + "units",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "BaseID": base,
            "Name": name,
            "ParentID": parent,
            "Quantity": quantity,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewUnitDetails(id);
            } else if (typeSave == 2) {
                viewUnitDetails();
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

    var idProd = $("#hdfDetailID").val();

    if (idProd != null && idProd !== "" && idProd !== "undefined") {
        data.push(idProd);
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
                        "url": api_url + "unit-groups",
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


function submitDeleteUnit(idUnit) {
    var data = [];

    if (idUnit) {
        data.push(idUnit);
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
                        "url": api_url + "units",
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
                            viewUnitDetails();
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


function pageIndexLoadUnit(totalPages, totalRecords) {
    $("#totalRecordsUnit").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentUnit', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataUnits(0);
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
}



/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');

    //modalCreateProdBundle
    $("#ddlUnitBase").select2({
        dropdownParent: $("#modalCreateUnit")
    });

    //modalUpdateUnit
    $("#ddlDetailUnitBase").select2({
        dropdownParent: $("#modalUpdateUnit")
    });
});
