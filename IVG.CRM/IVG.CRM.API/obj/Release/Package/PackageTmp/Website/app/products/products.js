var localStorageInfo = JSON.parse(storageGetItem("localStorageList"));
var token = localStorageInfo.data.token.Key;
var userID = localStorageInfo.data.user.ID;


$(document).ready(function () {
    onLoadData();

    initAutoComplete("#txtGroup", "product-groups", getDataByKey, function (selectedItem) {
        $("#txtGroupVal").val(selectedItem.id);
    });

    initAutoComplete("#txtUnit", "product-units", getDataByKey, function (selectedItem) {
        $("#txtUnitVal").val(selectedItem.id);
    });

    initAutoComplete("#txtPriceList", "price-lists", getDataByKey, function (selectedItem) {
        $("#txtPriceListVal").val(selectedItem.id);
    });
});


/*Load data*/
function onLoadData(key) {
    var keySearch = $("#txtMainSearch").val();

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
        "url": api_url + "products/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
            "keySearch": keySearch
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        var html = "";

        if (rs.code == 200) {
            $("#loader").hide();

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

                    if (data[i].ValidFrom == null || data[i].ValidFrom === "undefined" || data[i].ValidFrom === "") {
                        data[i].ValidFrom = "-";
                    } else {
                        data[i].ValidFrom = formatDate(new Date(data[i].ValidFrom), "dd-mm-yyyy");
                    }

                    if (data[i].ValidTo == null || data[i].ValidTo === "undefined" || data[i].ValidTo === "") {
                        data[i].ValidTo = "-";
                    } else {
                        data[i].ValidTo = formatDate(new Date(data[i].ValidTo), "dd-mm-yyyy");
                    }

                    html += `<tr>`;
                    html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-xs cursor-pointer" /></td>`;
                    html += `<td><span onclick="viewDetails(\`` + data[i].ID + `\`, \`` + data[i].Code + `\`)" class="table-detail">${data[i].Code}</span></td>`;
                    html += `<td>${data[i].Name}</td>`;
                    html += `<td>${data[i].ValidFrom}</td>`;
                    html += `<td>${data[i].ValidTo}</td>`;

                    var status = "";

                    if (data[i].Status == null || data[i].Status === "undefined" || data[i].Status === "") {
                        data[i].Status = "-";
                    } else {
                        if (data[i].Status == 0) {
                            status = 'Nháp';

                            html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 1) {
                            status = 'Đang kinh doanh';

                            html += `<td><span class="badge rounded-pill bg-success fw-bold">${status}</span></td>`;
                        } else if (data[i].Status == 2) {
                            status = 'Ngừng kinh doanh';

                            html += `<td><span class="badge rounded-pill bg-danger fw-bold">${status}</span></td>`;
                        }
                    }
                    
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataTableBody').html(html);

            pageIndexLoad(rs.paging.TotalPages, rs.paging.TotalRecords);
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            $("#loader").hide();
            console.log(rs);
            alertError(rs.messVN);
        }
    });
}


/*Create*/
function viewCreate(key) {
    if (key) {
        $("#contentList").hide();
        $("#contentDetail").hide();
        $("#contentCreate").show();
        $("#contentCreateProduct").show();
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentCreateProduct").hide();
        $("#contentList").show();

        onLoadData();

        clearAllForm("contentCreateProduct");
    }
}


function submitCreate(key) {
    var name = $("#txtName").val();
    var validFrom = $("#txtValidFrom").val();
    var validTo = $("#txtValidTo").val();
    var unit = $("#txtUnitVal").val();
    var priceList = $("#txtPriceListVal").val();
    var group = $("#txtGroupVal").val();
    var description = $("#txtDescription").val();
    var status = $("#ddlStatus").val();

    const validationChecks = [
        { input: name, type: 1, element: 'text', name: 'txtName' },
        { input: unit, type: 1, element: 'text', name: 'txtUnit' },
        { input: priceList, type: 1, element: 'text', name: 'txtPriceList' },
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
        "url": api_url + "products",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "PriceListID": priceList,
            "UnitID": unit,
            "GroupID": group,
            "Name": name,
            "ValidFrom": validFrom,
            "ValidTo": validTo,
            "Status": status,
            "Description": description,
            "CreatedBy": userID,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            $("#loader").hide();

            if (key == 1) {
                alertSuccess(rs.messVN);
                viewCreate();
                onLoadData();
            } else if (key == 2) {
                alertSuccess(rs.messVN);
                viewCreate();
                onLoadData();
            }
        } else if (rs.code == 310) {
            returnLogin();
        } else {
            console.log(rs);
            $("#loader").hide();
            alertError(rs.messVN);
        }
    });
}


/*Detail*/
function viewDetails(id) {
    if (id) {
        if (id == 1) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailProduct").show();
        } else if (id == 2) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailProductBundle").show();
        } else if (id == 3) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailProductFamily").show();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentDetailProduct").hide();
        $("#contentDetailProductBundle").hide();
        $("#contentDetailProductFamily").hide();
        $("#contentList").show();
    }
}


/*Delete Case*/
function submitDelete() {
    var data = [];

    $('.ckRow').each(function () {
        if ($(this).prop('checked') == true) {
            var id = $(this).val().split('&')[0];
            data.push(id);
        }
    });

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
                        "url": api_url + "products",
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
                            $("#loader").hide();
                            alertSuccess(rs.messVN);
                            onLoadData();
                        } else if (rs.code == 310) {
                            returnLogin();
                        } else {
                            $("#loader").hide();
                            console.log(rs);
                            alertError(rs.messVN);
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
        onLoadData();
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
});

