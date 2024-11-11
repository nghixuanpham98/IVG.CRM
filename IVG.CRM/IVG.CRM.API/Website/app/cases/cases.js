
$(document).ready(function () {
    onLoadData(0, defaultLoadNumb);

    onLoadSubjects();

    onLoadTimeMinutes();

    // Users
    initAutoComplete("#txtOwner", "users", getDataByKey, function (selectedItem) {
        $("#txtOwnerVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtTaskOwner", "users", getDataByKey, function (selectedItem) {
        $("#txtTaskOwnerVal").val(selectedItem.data.ID);
    });

    // Accounts
    initAutoComplete("#txtAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#lblAccountName").addClass("fw-bold text-uppercase");
        $("#lblAccountName").text(selectedItem.data.Name);
        $("#txtAccountEmail").val(selectedItem.data.Email);
        $("#txtAccountPhone").val(selectedItem.data.MainPhone);
        $("#txtAccountVal").val(selectedItem.data.ID);

        onLoadContacts(selectedItem.data.ID);
    });

    initAutoComplete("#txtDetailAccount", "accounts", getDataByKey, function (selectedItem) {
        $("#lblAccountName").addClass("fw-bold text-uppercase");
        $("#lblAccountName").text(selectedItem.data.Name);

        $("#txtDetailAccountEmail").val(selectedItem.data.Email);
        $("#txtDetailAccountPhone").val(selectedItem.data.MainPhone);
        $("#txtDetailAccountVal").val(selectedItem.data.ID);

        onLoadContacts(selectedItem.data.ID, true, "");

        onLoadContracts(selectedItem.data.ID);
    });

    // Products
    initAutoComplete("#txtProduct", "products/special", getDataByKey, function (selectedItem) {
        $("#txtProductVal").val(selectedItem.data.ID);
    }, 3);

    initAutoComplete("#txtDetailProduct", "products/special", getDataByKey, function (selectedItem) {
        $("#txtDetailProductVal").val(selectedItem.data.ID);
    }, 3);

    // Cases
    initAutoComplete("#txtParent", "cases", getDataByKey, function (selectedItem) {
        $("#txtParentVal").val(selectedItem.data.ID);
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
        $("#btnFilterActive").addClass("active");
        $("#breadcrumbType").text("Active Cases");
    } else if (type == 1) {
        $("#btnFilterResolved").addClass("active");
        $("#breadcrumbType").text("Resolved Cases");
    } else if (type == 2) {
        $("#btnFilterCanceled").addClass("active");
        $("#breadcrumbType").text("Canceled Cases");
    } else {
        $("#btnFilterAll").addClass("active");
        $("#breadcrumbType").text("All Cases");
    }

    var orderTypeDefault = "DESC";
    var orderNameDefault = "Title";
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
        "url": api_url + "cases/list",
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
        var optionHtml = "";
        var optionHtmlResolve = "";
        var optionHtmlCancel = "";

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;
            var dataStatus = rs.status.reason;
            var dataStatusLength = dataStatus.length;

            if (dataStatusLength > 0) {
                var item = dataStatus.filter(x => x.StatusID == 0);

                for (var j = 0; j < item.length; j++) {
                    optionHtml += `<option value="${item[j].StatusReasonID}">${item[j].NameVI}</option>`;
                }

                $("#ddlStatusReason").html(optionHtml);

                // Resolve
                var itemResolve = dataStatus.filter(x => x.StatusID == 1);
                var defaultResolveVal = "";

                for (var k = 0; k < itemResolve.length; k++) {
                    defaultResolveVal = itemResolve[0].StatusReasonID;

                    optionHtmlResolve += `<option value="${itemResolve[k].StatusReasonID}">${itemResolve[k].NameVI}</option>`;
                }

                $("#ddlResolutionType").html(optionHtmlResolve);

                $("#ddlResolutionType").data('default-value', defaultResolveVal);

                // Cancel
                var itemCancel = dataStatus.filter(x => x.StatusID == 2);
                var defaultCancelVal = "";

                for (var n = 0; n < itemCancel.length; n++) {
                    defaultCancelVal = itemCancel[0].StatusReasonID;

                    optionHtmlCancel += `<option value="${itemCancel[n].StatusReasonID}">${itemCancel[n].NameVI}</option>`;
                }

                $("#ddlCancleType").html(optionHtmlCancel);

                $("#ddlCancleType").data('default-value', defaultCancelVal);
            }
            
            if (dataLength > 0) {
                for (var i = 0; i < dataLength; i++) {
                    if (data[i].Code == null || data[i].Code === "undefined" || data[i].Code === "") {
                        data[i].Code = "-";
                    }

                    if (data[i].Title == null || data[i].Title === "undefined" || data[i].Title === "") {
                        data[i].Title = "-";
                    }

                    if (data[i].AccountName == null || data[i].AccountName === "undefined" || data[i].AccountName === "") {
                        data[i].AccountName = "-";
                    }

                    var createdOn = "";
                    if (data[i].CreatedOn == null || data[i].CreatedOn === "undefined" || data[i].CreatedOn === "") {
                        createdOn = "-";
                    } else {
                        createdOn = formatDate(new Date(data[i].CreatedOn), "dd-mm-yyyy hh:ss");
                    }

                    var priority = "";
                    if (data[i].Priority == null || data[i].Priority === "undefined" || data[i].Priority === "") {
                        priority = "-";
                    } else {
                        if (data[i].Priority == 1) {
                            priority = "Rất thấp";
                        } else if (data[i].Priority == 2) {
                            priority = "Thấp";
                        } else if (data[i].Priority == 3) {
                            priority = "Trung bình";
                        } else if (data[i].Priority == 4) {
                            priority = "Cao";
                        } else {
                            priority = "Rất cao";
                        }
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`)">`
                    html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-check cursor-pointer" /></td>`;
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].Code}</span></td>`;
                    html += `<td>${data[i].Title}</td>`;
                    html += `<td>${priority}</td>`;
                    html += `<td class="table-detail">${data[i].AccountName}</td>`;

                    if (data[i].StatusName == null || data[i].StatusName === "undefined" || data[i].StatusName === "") {
                        html += `<td>-</td>`;
                    } else {
                        if (data[i].Status == 0) {
                            html += `<td><span class="badge rounded-pill bg-success fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 1) {
                            html += `<td><span class="badge rounded-pill bg-info fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 2) {
                            html += `<td><span class="badge rounded-pill bg-danger fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 3) {
                            html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${data[i].StatusName}</span></td>`;
                        } else {
                            html += `<td><span class="badge rounded-pill bg-primary fw-bold">${data[i].StatusName}</span></td>`;
                        }
                    }
                    html += `<td>${data[i].StatusReasonName}</td>`;
                    html += `<td>${createdOn}</td>`;
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


function onLoadSubjects() {
    var settings = {
        "url": api_url + "subjects/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "isAll": true
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        var optionHtml = "";

        optionHtml += `<option value="0">-- Chọn danh mục --</option>`;

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;

            for (var i = 0; i < dataLength; i++) {
                optionHtml += `<option value="${data[i].ID}">${data[i].Title}</option>`;
            }

            $("#ddlSubject").html(optionHtml);
            $("#ddlDetailSubject").html(optionHtml);

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


function onLoadContacts(idCus, isDetail, idCont) {
    if (idCus) {
        var settings = {
            "url": api_url + "contacts/list",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "id": idCus,
                "isAll": true
            }),
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            var optionHtml = "";

            optionHtml += `<option value="0">-- Chọn người liên hệ --</option>`;

            if (rs.code == 200) {
                var data = rs.data;
                var dataLength = data.length;

                if (dataLength > 0) {
                    for (var i = 0; i < dataLength; i++) {
                        optionHtml += `<option value="${data[i].ContactID}">${data[i].FullName}</option>`;
                    }

                    if (isDetail) {
                        $("#ddlDetailContact").html(optionHtml);

                        if (idCont) {
                            $("#ddlDetailContact").val(idCont).trigger("change");
                        }
                    } else {
                        $("#ddlContact").html(optionHtml);
                    }
                } else {
                    $("#ddlContact").html("");

                    $("#ddlDetailContact").html("");
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


function onLoadContracts(idCus, idCont) {
    if (idCus) {
        var settings = {
            "url": api_url + "contracts/list",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "id": idCus,
                "isAll": true
            }),
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            var optionHtml = "";

            optionHtml += `<option value="0">-- Chọn hợp đồng --</option>`;

            if (rs.code == 200) {
                var data = rs.data;
                var dataLength = data.length;

                for (var i = 0; i < dataLength; i++) {
                    optionHtml += `<option value="${data[i].ID}">${data[i].Name}</option>`;
                }

                $("#ddlDetailContract").html(optionHtml);

                if (idCont) {
                    $("#ddlDetailContract").val(idCont).trigger("change");
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


function onLoadContractLines() {
    var idCont = $("#ddlDetailContract").val();

    if (idCont != null && idCont !== "" && idCont !== "undefined" && idCont != 0) {
        var settings = {
            "url": api_url + "contracts/lines/list",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "id": idCont,
                "isAll": true
            }),
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            var optionHtml = "";

            optionHtml += `<option value="0">-- Chọn chi tiết đơn hàng --</option>`;

            if (rs.code == 200) {
                var data = rs.data;
                var dataLength = data.length;

                for (var i = 0; i < dataLength; i++) {
                    optionHtml += `<option value="${data[i].ID}">${data[i].Title}</option>`;
                }

                $("#ddlDetailContractLine").html(optionHtml);

                var contLineID = $("#hdfContractLineID").val();

                if (contLineID) {
                    $("#ddlDetailContractLine").val(contLineID).trigger("change");

                    $("#hdfContractLineID").val("");
                }

                $("#loader").hide();
            } else if (rs.code == 310) {
                returnLogin();
            } else {
                console.log(rs);
                alertError(rs.messVN);
                $("#loader").hidConte();
            }
        });
    } else {
        $("#ddlDetailContractLine").html("");
    }
}


function onLoadTimeMinutes() {
    var settings = {
        "url": api_url + "configs/time-minutes/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "isAll": true
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        var optionHtml = "";

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;
            var defaultVal = "";

            for (var i = 0; i < dataLength; i++) {
                defaultVal = data[0].ID;

                optionHtml += `<option value="${data[i].ID}">${data[i].TitleVN}</option>`;
            }

            $("#ddlBillableTime").html(optionHtml);

            $("#ddlBillableTime").data('default-value', defaultVal);

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


function onLoadRelationships() {
    onLoadDataChildren();

    onLoadDataRecents();
}


function onLoadDataChildren(key) {
    var id = $("#hdfDetailID").val();

    var orderTypeDefault = "DESC";
    var orderNameDefault = "Title";

    /*Paging*/
    var pageNumber = $("#pageIndexChild").val();
    var pageSize = $("#pageSizeChild").val();

    if (key == 1) {
        pageNumber = 1;
        $("#pageIndexChild").val(1);
        if ($('#pagingMainContentChild').data("twbs-pagination")) {
            $('#pagingMainContentChild').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "cases/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
            "parentID": id,
            "type": defaultLoadNumb,
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
                    if (data[i].Title == null || data[i].Title === "undefined" || data[i].Title === "") {
                        data[i].Title = "-";
                    }

                    if (data[i].OwnerName == null || data[i].OwnerName === "undefined" || data[i].OwnerName === "") {
                        data[i].OwnerName = "-";
                    }

                    var modifiedOn = "";
                    if (data[i].ModifiedOn == null || data[i].ModifiedOn === "undefined" || data[i].ModifiedOn === "") {
                        modifiedOn = "-";
                    } else {
                        modifiedOn = formatDate(new Date(data[i].ModifiedOn), "dd-mm-yyyy hh:ss")
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`, \`` + id + `\`)">`
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`, \`` + id + `\`)" class="table-detail">${data[i].Title}</span></td>`;

                    if (data[i].StatusName == null || data[i].StatusName === "undefined" || data[i].StatusName === "") {
                        html += `<td>-</td>`;
                    } else {
                        if (data[i].Status == 0) {
                            html += `<td><span class="badge rounded-pill bg-success fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 1) {
                            html += `<td><span class="badge rounded-pill bg-info fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 2) {
                            html += `<td><span class="badge rounded-pill bg-danger fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 3) {
                            html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${data[i].StatusName}</span></td>`;
                        } else {
                            html += `<td><span class="badge rounded-pill bg-primary fw-bold">${data[i].StatusName}</span></td>`;
                        }
                    }
                    html += `<td class="table-detail">${data[i].OwnerName}</td>`;
                    html += `<td>${modifiedOn}</td>`;
                    html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeleteChild(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyChild').html(html);

            pageIndexLoadChild(rs.paging.TotalPages, rs.paging.TotalRecords);

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


function onLoadDataRecents(key) {
    var id = $("#hdfDetailID").val();
    var accountID = $("#txtDetailAccountVal").val();

    var orderTypeDefault = "DESC";
    var orderNameDefault = "Title";

    /*Paging*/
    var pageNumber = $("#pageIndexRecent").val();
    var pageSize = $("#pageSizeRecent").val();

    if (key == 1) {
        pageNumber = 1;
        $("#pageIndexRecent").val(1);
        if ($('#pagingMainContentRecent').data("twbs-pagination")) {
            $('#pagingMainContentRecent').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "cases/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
            "accountID": accountID,
            "type": defaultLoadNumb,
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
                    if (data[i].Title == null || data[i].Title === "undefined" || data[i].Title === "") {
                        data[i].Title = "-";
                    }

                    if (data[i].OwnerName == null || data[i].OwnerName === "undefined" || data[i].OwnerName === "") {
                        data[i].OwnerName = "-";
                    }

                    var modifiedOn = "";
                    if (data[i].ModifiedOn == null || data[i].ModifiedOn === "undefined" || data[i].ModifiedOn === "") {
                        modifiedOn = "-";
                    } else {
                        modifiedOn = formatDate(new Date(data[i].ModifiedOn), "dd-mm-yyyy hh:ss")  
                    }

                    html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`, \`` + id + `\`)">`
                    html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`, \`` + id + `\`)" class="table-detail">${data[i].Title}</span></td>`;

                    if (data[i].StatusName == null || data[i].StatusName === "undefined" || data[i].StatusName === "") {
                        html += `<td>-</td>`;
                    } else {
                        if (data[i].Status == 0) {
                            html += `<td><span class="badge rounded-pill bg-success fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 1) {
                            html += `<td><span class="badge rounded-pill bg-info fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 2) {
                            html += `<td><span class="badge rounded-pill bg-danger fw-bold">${data[i].StatusName}</span></td>`;
                        } else if (data[i].Status == 3) {
                            html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${data[i].StatusName}</span></td>`;
                        } else {
                            html += `<td><span class="badge rounded-pill bg-primary fw-bold">${data[i].StatusName}</span></td>`;
                        }
                    }
                    html += `<td class="table-detail">${data[i].OwnerName}</td>`;
                    html += `<td>${modifiedOn}</td>`;
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyRecent').html(html);

            pageIndexLoadRecent(rs.paging.TotalPages, rs.paging.TotalRecords);

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
function viewCreate(key, id) {
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

        if (id) {
            clearAllForm("contentCreate");

            $("#txtOwnerVal").val(userID);
            $("#txtOwner").val(userCode + " - " + userFullName);

            var parentName = $("#txtDetailTitle").val();
            var accountName = $("#txtDetailAccount").val();
            var accountID = $("#txtDetailAccountVal").val();

            $("#txtAccount").val(accountName);
            $("#txtAccountVal").val(accountID);
            $("#txtParent").val(parentName);
            $("#txtParentVal").val(id);

            onLoadContacts(accountID);

            disableDom("txtParent");
            $("#txtParentIcon").show();
        } else {
            $("#txtAccount").val("");
            $("#txtAccountVal").val("");
            $("#txtParent").val("");
            $("#txtParentVal").val("");

            removeDisableDom("txtParent");
            $("#txtParentIcon").hide();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentList").show();

        $(".nav-custom").removeClass("active");

        onLoadData(0, $("#hdfTypeOnLoad").val());

        clearAllForm("contentCreate");
    }
}


function viewCreateChild() {
    var id = $("#hdfDetailID").val();

    var html = "";

    html += `<tr class='tr-mb-style'>`;
    html += `<td class='emptytable' colspan='9999'>`;
    html += `<div class="input-group">`;
    html += `<input id="txtChild" name="txtChild" class="form-control" autofocus spellcheck="false" autocomplete="off" type="text" />`;
    html += `<span data-bs-placement="right" data-bs-toggle="tooltip" aria-label="Tìm kiếm" data-bs-original-title="Tìm kiếm" class="input-group-text cursor-pointer ivg-button"><i class="icon-xs fa-solid fa-search"></i></span>`;
    html += `<input id="txtChildVal" type="hidden" />`;
    html += `</div>`;
    html += `</td>`;
    html += `</tr>`;

    $("#dataBodyChild").html(html);

    initAutoComplete("#txtChild", "cases", getDataByKey, function (selectedItem) {
        $("#txtChildVal").val(selectedItem.data.ID);

        submitCreateParent(selectedItem.data.ID);
    }, null, id);
}



function submitCreate(typeSave) {
    var priority = $("#ddlPriority").val();
    var statusReason = $("#ddlStatusReason").val();
    var owner = $("#txtOwnerVal").val();
    var title = $("#txtTitle").val();
    var account = $("#txtAccountVal").val();

    var contact = $("#ddlContact").val() !== "0" && $("#ddlContact").val() != 0 ? $("#ddlContact").val() : null;

    var product = $("#txtProductVal").val();
    var description = $("#txtDescription").val();
    var serial = $("#txtSerialNumber").val();
    var parent = $("#txtParentVal").val();
    var escalated = $("#ddlEscalated").val();
    var followUpBy = $("#txtFollowUpBy").val();
    var firstResponseSent = $("#ddlFirstResponseSent").val();

    var subject = $("#ddlSubject").val() !== "0" && $("#ddlSubject").val() != 0 ? $("#ddlSubject").val() : null;
    var origin = $("#ddlOrigin").val() !== "0" && $("#ddlOrigin").val() != 0 ? $("#ddlOrigin").val() : null;
    var level = $("#ddlServiceLevel").val() !== "0" && $("#ddlServiceLevel").val() != 0 ? $("#ddlServiceLevel").val() : null;
    var serviceType = $("#ddlType").val() !== "0" && $("#ddlType").val() != 0 ? $("#ddlType").val() : null;

    var validationChecks = [];

    validationChecks = [
        { input: owner, type: 1, element: 'text', name: 'txtOwner' },
        { input: title, type: 1, element: 'text', name: 'txtTitle' },
        { input: account, type: 1, element: 'text', name: 'txtAccount' },
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
        "url": api_url + "cases",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ParentID": parent,
            "OwnerID": owner,
            "AccountID": account,
            "ContactID": contact,
            "ProductID": product,
            "SubjectID": subject,
            "SerialNumber": serial,
            "Title": title,
            "Origin": origin,
            "ServiceType": serviceType,
            "ServiceLevel": level,
            "Priority": priority,
            "StatusReason": statusReason,
            "Escalated": escalated,
            "FollowUpBy": followUpBy,
            "FirstResponseSent": firstResponseSent,
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


function submitCreateParent(id) {
    if (id) {
        var parentID = $("#hdfDetailID").val();

        var settings = {
            "url": api_url + "cases/parents",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                'ID': id,
                "ParentID": parentID,
                "ModifiedBy": userID
            }),
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            if (rs.code == 200) {
                alertSuccess(rs.messVN);
                onLoadDataChildren();
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



/*Detail*/
function viewDetails(id, idSub) {
    if (idSub) {
        $("#btnDetailClose").attr("onclick", "viewDetails('" + idSub + "')");
    } else {
        $("#btnDetailClose").attr("onclick", "viewDetails()");
    }

    $(".nav-custom").removeClass("active");

    if (id) {
        initAutoComplete("#txtDetailParent", "cases", getDataByKey, function (selectedItem) {
            $("#txtDetailParentVal").val(selectedItem.data.ID);
        }, "", id);

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
            "url": api_url + "cases/" + id,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": token
            },
        };

        $("#loader").show();

        $.ajax(settings).done(function (rs) {
            var optionHtml = "";

            if (rs.code == 200) {
                var data = rs.data;
                var dataStatus = rs.status.reason;
                var dataStatusLength = dataStatus.length;

                $("#hdfStatus").val(data.Status);
                $("#hdfStatusReason").val(data.StatusReason);

                if (dataStatusLength > 0) {
                    var item = dataStatus.filter(x => x.StatusID == data.Status);

                    for (var j = 0; j < item.length; j++) {
                        optionHtml += `<option value="${item[j].StatusReasonID}">${item[j].NameVI}</option>`;
                    }

                    $("#ddlDetailStatusReason").html(optionHtml);

                    $("#ddlDetailStatusReason").val(data.StatusReason).trigger('change');
                }
                
                if (data.Status == 0) {
                    var checkDad = rs.isDad;

                    if (checkDad) {
                        disableDom("txtDetailParent");
                        $(".btn-new").show();
                        $("#btnDetailChild").show();
                    } else {
                        if (data.ParentID) {
                            removeDisableDom("txtDetailParent");
                            $(".btn-new").hide();
                            $("#btnDetailChild").hide();
                        } else {
                            removeDisableDom("txtDetailParent");
                            $(".btn-new").show();
                            $("#btnDetailChild").show();
                        }
                    }

                    removeDisableDom("ddlDetailPriority");
                    removeDisableDom("ddlDetailStatusReason");
                    removeDisableDom("txtDetailTitle");
                    removeDisableDom("txtDetailAccount");
                    removeDisableDom("ddlDetailSubject");
                    removeDisableDom("ddlDetailOrigin");
                    removeDisableDom("ddlDetailContact");
                    removeDisableDom("txtDetailProduct");
                    removeDisableDom("txtDetailDescription");
                    removeDisableDom("ddlDetailContract");
                    removeDisableDom("ddlDetailContractLine");
                    removeDisableDom("txtDetailSerialNumber");
                    removeDisableDom("ddlDetailServiceLevel");
                    removeDisableDom("ddlDetailType");
                    removeDisableDom("ddlDetailEscalated");
                    removeDisableDom("txtDetailFollowUpBy");
                    removeDisableDom("ddlDetailFirstResponseSent");
                } else {
                    disableDom("ddlDetailPriority");
                    disableDom("ddlDetailStatusReason");
                    disableDom("txtDetailTitle");
                    disableDom("txtDetailAccount");
                    disableDom("ddlDetailSubject");
                    disableDom("ddlDetailOrigin");
                    disableDom("ddlDetailContact");
                    disableDom("txtDetailProduct");
                    disableDom("txtDetailDescription");
                    disableDom("ddlDetailContract");
                    disableDom("ddlDetailContractLine");
                    disableDom("txtDetailSerialNumber");
                    disableDom("ddlDetailServiceLevel");
                    disableDom("ddlDetailType");
                    disableDom("txtDetailParent");
                    disableDom("ddlDetailEscalated");
                    disableDom("txtDetailFollowUpBy");
                    disableDom("ddlDetailFirstResponseSent");

                    $(".btn-new").hide();
                }

                if (data.Status == 0) {
                    // Active
                    $("#btnDetailSave").show();
                    $("#btnDetailSaveClose").show();
                    $("#btnDetailResolve").show();
                    $("#btnDetailCancel").show();
                    $("#btnDetailReactivate").hide();
                } else {
                    $("#btnDetailSave").hide();
                    $("#btnDetailSaveClose").hide();
                    $("#btnDetailResolve").hide();
                    $("#btnDetailCancel").hide();
                    $("#btnDetailReactivate").show();
                }

                $("#titleDetail").text(data.Title);
                $("#ddlDetailPriority").val(data.Priority).trigger("change");
                $("#ddlDetailStatus").val(data.Status).trigger("change");
                $("#txtDetailOwner").val(data.OwnerCode + " - " + data.OwnerName);
                $("#txtDetailOwnerVal").val(data.OwnerID);

                var createdOn = data.CreatedOn != null ? formatDate(new Date(data.CreatedOn), "yyyy-mm-dd hh:ss") : "";
                $("#txtDetailCreatedOn").val(createdOn);

                $("#txtDetailCode").val(data.Code);
                $("#txtDetailTitle").val(data.Title);
                $("#txtDetailAccount").val(data.AccountName);
                $("#txtDetailAccountVal").val(data.AccountID);
                $("#ddlDetailSubject").val(data.SubjectID).trigger("change");
                $("#ddlDetailOrigin").val(data.Origin).trigger("change");

                var contact = data.ContactID == null ? 1 : data.ContactID;

                onLoadContacts(data.AccountID, true, contact);

                if (data.ProductCode != null) {
                    $("#txtDetailProduct").val(data.ProductCode + " - " + data.ProductName);
                } else {
                    $("#txtDetailProduct").val("");
                }
                
                $("#txtDetailProductVal").val(data.ProductID);
                $("#txtDetailDescription").val(data.Description);

                $("#lblDetailAccountName").text(data.AccountName);

                $("#txtDetailAccountEmail").val(data.Email);
                $("#txtDetailAccountPhone").val(data.MainPhone);
                $("#txtDetailSerialNumber").val(data.SerialNumber);
                $("#ddlDetailServiceLevel").val(data.ServiceLevel).trigger("change");
                $("#ddlDetailType").val(data.ServiceType).trigger("change");
                $("#txtDetailParent").val(data.ParentTitle);
                $("#txtDetailParentVal").val(data.ParentID);

                $("#ddlDetailEscalated").val(data.Escalated.toString()).trigger("change");

                var escalatedOn = data.EscalatedOn != null ? formatDate(new Date(data.EscalatedOn), "yyyy-mm-dd hh:ss") : "";
                $("#txtDetailEscalatedOn").val(escalatedOn);

                var followUpBy = data.FollowUpBy != null ? formatDate(new Date(data.FollowUpBy), "yyyy-mm-dd") : "";
                $("#txtDetailFollowUpBy").val(followUpBy);

                $("#ddlDetailFirstResponseSent").val(data.FirstResponseSent.toString()).trigger("change");

                var contractID = data.ContractID == null ? null : data.ContractID;
                var contractLineID = data.ContractLineID == null ? null : data.ContractLineID;

                $("#hdfContractLineID").val(contractLineID);

                onLoadContracts(data.AccountID, contractID);

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



/*Update*/
function submitUpdate(typeSave, status
    , statusReason, isAssign) {

    var owner = "";
    var statusReasonCase = "";

    if (statusReason) {
        statusReasonCase = statusReason;
    } else {
        statusReasonCase = $("#ddlDetailStatusReason").val();
    }

    if (isAssign) {
        owner = $("#txtDetailAssignVal").val();
    } else {
        owner = $("#txtDetailOwnerVal").val();
    }

    var id = $("#hdfDetailID").val();
    
    var settings = {};

    var validationChecks = [];

    if (status == 0) {
        var priority = $("#ddlDetailPriority").val();
        var title = $("#txtDetailTitle").val();
        var account = $("#txtDetailAccountVal").val();

        var contact = $("#ddlDetailContact").val() !== "0" && $("#ddlDetailContact").val() != 0 ? $("#ddlDetailContact").val() : null;

        var product = $("#txtDetailProductVal").val();
        var description = $("#txtDetailDescription").val();
        var serial = $("#txtDetailSerialNumber").val();
        var parent = $("#txtDetailParentVal").val();
        var escalated = $("#ddlDetailEscalated").val();
        var followUpBy = $("#txtDetailFollowUpBy").val();
        var firstResponseSent = $("#ddlDetailFirstResponseSent").val();

        var contract = $("#ddlDetailContract").val() !== "0" && $("#ddlDetailContract").val() != 0 ? $("#ddlDetailContract").val() : null;
        var contractLine = $("#ddlDetailContractLine").val() !== "0" && $("#ddlDetailContractLine").val() != 0 ? $("#ddlDetailContractLine").val() : null;
        var subject = $("#ddlDetailSubject").val() !== "0" && $("#ddlDetailSubject").val() != 0 ? $("#ddlDetailSubject").val() : null;
        var origin = $("#ddlDetailOrigin").val() !== "0" && $("#ddlDetailOrigin").val() != 0 ? $("#ddlDetailOrigin").val() : null;
        var level = $("#ddlDetailServiceLevel").val() !== "0" && $("#ddlDetailServiceLevel").val() != 0 ? $("#ddlDetailServiceLevel").val() : null;
        var serviceType = $("#ddlDetailType").val() !== "0" && $("#ddlDetailType").val() != 0 ? $("#ddlDetailType").val() : null;

        validationChecks = [
            { input: owner, type: 1, element: 'text', name: 'txtDetailOwner' },
            { input: title, type: 1, element: 'text', name: 'txtDetailTitle' },
            { input: account, type: 1, element: 'text', name: 'txtDetailAccount' },
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

        settings = {
            "url": api_url + "cases",
            "method": "PUT",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "ID": id,
                "ParentID": parent,
                "OwnerID": owner,
                "AccountID": account,
                "ContactID": contact,
                "ContractID": contract,
                "ContractLineID": contractLine,
                "ProductID": product,
                "SubjectID": subject,
                "SerialNumber": serial,
                "Title": title,
                "Origin": origin,
                "ServiceType": serviceType,
                "ServiceLevel": level,
                "Priority": priority,
                "Status": status,
                "StatusReason": statusReasonCase,
                "Escalated": escalated,
                "FollowUpBy": followUpBy,
                "FirstResponseSent": firstResponseSent,
                "Description": description,
                "ModifiedBy": userID
            }),
        };
    } else if (status == 1) {
        var resolutionType = $("#ddlResolutionType").val();
        var resolution = $("#txtResolution").val();
        var billableTime = $("#ddlBillableTime").val();
        var remarks = $("#txtRemarks").val();

        validationChecks = [
            { input: resolution, type: 1, element: 'text', name: 'txtResolution' },
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

        settings = {
            "url": api_url + "cases",
            "method": "PUT",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "ID": id,
                "Status": status,
                "StatusReason": statusReasonCase,
                "ResolutionType": resolutionType,
                "Resolution": resolution,
                "ResolvedBy": userID,
                "BillableTimeID": billableTime,
                "Remarks": remarks,
                "ModifiedBy": userID
            }),
        };
    } else if (status == 2) {
        settings = {
            "url": api_url + "cases",
            "method": "PUT",
            "timeout": 0,
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "ID": id,
                "Status": status,
                "StatusReason": statusReasonCase,
                "CanceledBy": userID,
                "ModifiedBy": userID
            }),
        };
    }

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewDetails(id);
            } else if (typeSave == 2) {
                viewDetails();
            } else if (typeSave == 3) {
                $("#modalResolveCase").modal("hide");
                clearAllForm('contentResolveCase');
                viewDetails(id);
            } else if (typeSave == 4) {
                $("#cancelBlock").hide();
                clearAllForm('contentCancelCase');
                viewDetails(id);
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
                        "url": api_url + "cases",
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


function submitDeleteChild(id) {
    var data = [];

    if (id) {
        data.push(id);
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
                        "url": api_url + "cases/parents",
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
                            onLoadRelationships();
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


function pageIndexLoadRecent(totalPages, totalRecords) {
    $("#totalRecordsRecent").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentRecent', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataRecents();
    });
}


function pageIndexLoadChild(totalPages, totalRecords) {
    $("#totalRecordsChild").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentChild', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataChildren();
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
            if (typeof defaultValue === "boolean") {
                $(this).val(defaultValue.toString()).trigger('change');
            } else {
                $(this).val(defaultValue).trigger('change');
            }
        }
    });

    $("#" + dom + ' .select-card-header').each(function () {
        var defaultValue = $(this).data('default-value');

        if (defaultValue !== "undefined" && defaultValue !== "" && defaultValue != null) {
            $(this).val(defaultValue).trigger('change');
        }
    });

    $("#" + dom + ' .select-activity').each(function () {
        var defaultValue = $(this).data('default-value');

        if (defaultValue !== "undefined" && defaultValue !== "" && defaultValue != null) {
            $(this).val(defaultValue).trigger('change');
        }
    });

    // Set default value
    $("#lblAccountName").removeClass("fw-bold text-uppercase");
    $("#lblAccountName").text("To enable this content, select customer first");

    $("#ddlContact").html("");

    $("#ddlDetailContact").html("");
}



/*Select2*/
$(function () {
    $('.select2').select2();

    $('.select2').css('width', '100%');

    $("#ddlResolutionType").select2({
        dropdownParent: $("#modalResolveCase")
    });

    $("#ddlBillableTime").select2({
        dropdownParent: $("#modalResolveCase")
    });
});



/*Cancel block*/
function openCancelBlock() {
    $(".detail-sub-block").hide();
    $("#cancelBlock").show();
}


function closeCancelBlock() {
    $("#cancelBlock").hide();
    clearAllForm('contentCancelCase');
}
