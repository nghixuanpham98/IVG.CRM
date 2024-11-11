
$(document).ready(function () {
    
    onLoadData(0, defaultLoadNumb);

    onLoadUnitGroups("ddlProdUnitGroup");

    onLoadSubjects();

    // Product
    initAutoComplete("#txtProdParent", "products", getDataByKey, function (selectedItem) {
        $("#txtProdParentVal").val(selectedItem.data.ID);
    }, 3);

    initAutoComplete("#txtBundleProd", "products", getDataByKey, function (selectedItem) {
        $("#txtBundleProdVal").val(selectedItem.data.ID);
    }, 1);

    initAutoComplete("#txtBundleDetailProd", "products", getDataByKey, function (selectedItem) {
        $("#txtBundleDetailProdVal").val(selectedItem.data.ID);
    }, 1);

    // Price list
    initAutoComplete("#txtProdPriceList", "price-lists", getDataByKey, function (selectedItem) {
        $("#txtProdPriceListVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtProdDetailPriceList", "price-lists", getDataByKey, function (selectedItem) {
        $("#txtProdDetailPriceListVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtPLItemPriceList", "price-lists", getDataByKey, function (selectedItem) {
        $("#txtPLItemPriceListVal").val(selectedItem.data.ID);
    });

    initAutoComplete("#txtPLItemDetailPriceList", "price-lists", getDataByKey, function (selectedItem) {
        $("#txtPLItemDetailPriceListVal").val(selectedItem.data.ID);
    });


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

    if (type == 1) {
        $("#breadcrumbType").text("Products");
        $("#btnFilterProducts").addClass("active");
    } else if (type == 2) {
        $("#breadcrumbType").text("Product Bundles");
        $("#btnFilterBundles").addClass("active");
    } else if (type == 3) {
        $("#breadcrumbType").text("Product Families");
        $("#btnFilterFamilies").addClass("active");
    } else {
        $("#breadcrumbType").text("All Products");
        $("#btnFilterAll").addClass("active");
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
            var countParent = 0;
            var data = rs.data;
            var dataLength = data.length;

            if (dataLength > 0) {
                if (type == 100) {
                    for (var i = 0; i < dataLength; i++) {
                        if (data[i].ParentID == null) {
                            countParent++;
                            delete data[i].ParentID;
                        }
                    }

                    if (countParent > 0) {
                        var dataNew = flatListToTree(data);

                        for (var i = 0; i < dataNew.length; i++) {
                            var item = dataNew[i];

                            if (item.Code == null || item.Code === "undefined" || item.Code === "") {
                                item.Code = "-";
                            }

                            var name = "";
                            if (item.Name == null || item.Name === "undefined" || item.Name === "") {
                                name = "-";
                            } else {
                                name = limitStringLength(36, item.Name);
                            }

                            var parentName = ""
                            if (item.ParentName == null || item.ParentName === "undefined" || item.ParentName === "") {
                                parentName = "-";
                            } else {
                                parentName = limitStringLength(36, item.ParentName);
                            }

                            if (item.ValidFrom == null || item.ValidFrom === "undefined" || item.ValidFrom === "") {
                                item.ValidFrom = "-";
                            } else {
                                item.ValidFrom = formatDate(new Date(item.ValidFrom), "dd-mm-yyyy");
                            }

                            if (item.ValidTo == null || item.ValidTo === "undefined" || item.ValidTo === "") {
                                item.ValidTo = "-";
                            } else {
                                item.ValidTo = formatDate(new Date(item.ValidTo), "dd-mm-yyyy");
                            }

                            if (item.level == 0) {
                                html += `<tr ondblclick="viewDetails(\`` + item.ID + `\`, \`` + item.Type + `\`)" data-node-id="${item.ID}" 
                                    data-part-level="${item.partLevel}" data-all-level="${item.allLevel}"
                                    data-level="${item.level}" data-count="${countChildren(item)}" >`;
                            } else {
                                html += `<tr ondblclick="viewDetails(\`` + item.ID + `\`, \`` + item.Type + `\`)" data-node-id="${item.ID}" 
                                    data-node-pid="${item.ParentID}" data-part-level="${item.partLevel}" data-all-level="${item.allLevel}"
                                    data-level="${item.level}" data-count="${countChildren(item)}" >`;
                            }

                            html += `<td class="text-center"><input value="${item.ID}" type="checkbox" class="ckRow icon-check cursor-pointer" /></td>`;
                            html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + item.ID + `\`, \`` + item.Type + `\`)" class="table-detail">${item.Code}</span></td>`;
                            html += `<td title="${item.Name}">${name}</td>`;
                            html += `<td title="${item.ParentName}">${parentName}</td>`;
                            html += `<td>${item.ValidFrom}</td>`;
                            html += `<td>${item.ValidTo}</td>`;

                            var status = "";
                            if (item.Status == null || item.Status === "undefined" || item.Status === "") {
                                status = "-";

                                html += `<td>${status}</td>`;
                            } else {
                                if (item.Status == 0) {
                                    status = 'Nháp';

                                    html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${status}</span></td>`;
                                } else if (item.Status == 1) {
                                    status = 'Đang kinh doanh';

                                    html += `<td><span class="badge rounded-pill bg-success fw-bold">${status}</span></td>`;
                                } else if (item.Status == 2) {
                                    status = 'Đang được sửa đổi';

                                    html += `<td><span class="badge rounded-pill bg-info fw-bold">${status}</span></td>`;
                                } else if (item.Status == 3) {
                                    status = 'Ngừng kinh doanh';

                                    html += `<td><span class="badge rounded-pill bg-danger fw-bold">${status}</span></td>`;
                                }
                            }

                            var types = "";
                            if (item.Type == null || item.Type === "undefined" || item.Type === "") {
                                types = "-";
                            } else {
                                if (item.Type == 1) {
                                    types = 'Sản phẩm';
                                } else if (item.Type == 2) {
                                    types = 'Gói sản phẩm';
                                } else if (item.Type == 3) {
                                    types = 'Nhóm sản phẩm';
                                }
                            }

                            html += `<td>${types}</td>`;
                            html += `</tr>`;
                        }
                    }

                    $('#dataBody').html(html);

                    $('#dataBody').simpleTreeTable({
                        expander: $('#expander'),
                        collapser: $('#collapser'),
                    });

                    $(".ckRow").addClass("ms-2");
                } else {
                    for (var i = 0; i < dataLength; i++) {
                        if (data[i].Code == null || data[i].Code === "undefined" || data[i].Code === "") {
                            data[i].Code = "-";
                        }

                        var name = "";
                        if (data[i].Name == null || data[i].Name === "undefined" || data[i].Name === "") {
                            name = "-";
                        } else {
                            name = limitStringLength(36, data[i].Name);
                        }

                        var parentName = ""
                        if (data[i].ParentName == null || data[i].ParentName === "undefined" || data[i].ParentName === "") {
                            parentName = "-";
                        } else {
                            parentName = limitStringLength(36, data[i].ParentName);
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

                        html += `<tr ondblclick="viewDetails(\`` + data[i].ID + `\`, \`` + data[i].Type + `\`)">`
                        html += `<td class="text-center"><input value="${data[i].ID}" type="checkbox" class="ckRow icon-check cursor-pointer ms-2" /></td>`;
                        html += `<td><span title="Xem chi tiết" onclick="viewDetails(\`` + data[i].ID + `\`, \`` + data[i].Type + `\`)" class="table-detail">${data[i].Code}</span></td>`;
                        html += `<td title="${data[i].Name}">${name}</td>`;
                        html += `<td title="${data[i].ParentName}">${parentName}</td>`;
                        html += `<td>${data[i].ValidFrom}</td>`;
                        html += `<td>${data[i].ValidTo}</td>`;

                        var status = "";
                        if (data[i].Status == null || data[i].Status === "undefined" || data[i].Status === "") {
                            html += `<td>-</td>`;
                        } else {
                            if (data[i].Status == 0) {
                                status = 'Nháp';

                                html += `<td><span class="badge rounded-pill bg-secondary fw-bold">${status}</span></td>`;
                            } else if (data[i].Status == 1) {
                                status = 'Đang kinh doanh';

                                html += `<td><span class="badge rounded-pill bg-success fw-bold">${status}</span></td>`;
                            } else if (data[i].Status == 2) {
                                status = 'Đang được sửa đổi';

                                html += `<td><span class="badge rounded-pill bg-info fw-bold">${status}</span></td>`;
                            } else if (data[i].Status == 3) {
                                status = 'Ngừng kinh doanh';

                                html += `<td><span class="badge rounded-pill bg-danger fw-bold">${status}</span></td>`;
                            } else {
                                html += `<td>-</td>`;
                            }
                        }

                        var types = "";
                        if (data[i].Type == null || data[i].Type === "undefined" || data[i].Type === "") {
                            types = "-";
                        } else {
                            if (data[i].Type == 1) {
                                types = 'Sản phẩm';
                            } else if (data[i].Type == 2) {
                                types = 'Gói sản phẩm';
                            } else if (data[i].Type == 3) {
                                types = 'Nhóm sản phẩm';
                            }
                        }

                        html += `<td>${types}</td>`;
                        html += `</tr>`;
                    }

                    $('#dataBody').html(html);

                    $(".ckRow").removeClass("ms-2");
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

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


function onLoadDataBundles(key) {
    onLoadUnits("hdfUnitGroupID", "ddlBundleUnit");

    var id = $("#hdfDetailID").val();

    /*Paging*/
    var pageNumber = $("#pageIndexBundle").val();
    var pageSize = $("#pageSizeBundle").val();

    if (key == 1) {
        pageNumber = 1;
        $("#pageIndexBundle").val(1);
        if ($('#pagingMainContentBundle').data("twbs-pagination")) {
            $('#pagingMainContentBundle').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "products/bundles/list",
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

                    if (data[i].Quantity == null || data[i].Quantity === "undefined" || data[i].Quantity === "") {
                        data[i].Quantity = "-";
                    }

                    if (data[i].UnitName == null || data[i].UnitName === "undefined" || data[i].UnitName === "") {
                        data[i].UnitName = "-";
                    }

                    var required = "";
                    if (data[i].Required == null || data[i].Required === "undefined" || data[i].Required === "") {
                        data[i].Required = "-";
                    } else {
                        if (data[i].Required == 1) {
                            required = "Không bắt buộc";
                        } else {
                            required = "Bắt buộc";
                        }
                    }

                    html += `<tr ondblclick="viewBundleDetails(\`` + data[i].ID + `\`)">`;
                    html += `<td><span title="Xem chi tiết" onclick="viewBundleDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].ProductName}</span></td>`;
                    html += `<td>${data[i].Quantity}</td>`;
                    html += `<td>${data[i].UnitName}</td>`;
                    html += `<td>${required}</td>`;
                    html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeleteBundle(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyBundle').html(html);

            pageIndexLoadBundle(rs.paging.TotalPages, rs.paging.TotalRecords);

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
    onLoadUnits("hdfUnitGroupID", "ddlPLItemUnit");

    onLoadUnits("hdfUnitGroupID", "ddlPLItemDetailUnit");

    var id = $("#hdfDetailID").val();

    /*Paging*/
    var pageNumber = $("#pageIndexPLItem").val();
    var pageSize = $("#pageSizePLItem").val();

    if (key == 1) {
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

            onLoadDataRelationships();

            var data = rs.data;
            var dataLength = data.length;

            if (dataLength > 0) {
                for (var i = 0; i < dataLength; i++) {
                    if (data[i].PriceListName == null || data[i].PriceListName === "undefined" || data[i].PriceListName === "") {
                        data[i].PriceListName = "-";
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
                    html += `<td><span title="Xem chi tiết" onclick="viewPLItemDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].PriceListName}</span></td>`;
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


function onLoadDataRelationships(key) {
    var id = $("#hdfDetailID").val();

    /*Paging*/
    var pageNumber = $("#pageIndexRelated").val();
    var pageSize = $("#pageSizeRelated").val();

    if (key == 1) {
        pageNumber = 1;
        $("#pageIndexRelated").val(1);
        if ($('#pagingMainContentRelated').data("twbs-pagination")) {
            $('#pagingMainContentRelated').twbsPagination('destroy');
        }
    }

    var settings = {
        "url": api_url + "products/relationships/list",
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
                    if (data[i].RelatedName == null || data[i].RelatedName === "undefined" || data[i].RelatedName === "") {
                        data[i].RelatedName = "-";
                    }

                    var type = "";
                    if (data[i].Type == null || data[i].Type === "undefined" || data[i].Type === "") {
                        type = "-";
                    } else {
                        if (data[i].Type == 1) {
                            type = "Bán thêm";
                        } else if (data[i].Type == 2) {
                            type = "Bán kèm theo";
                        } else if (data[i].Type == 3) {
                            type = "Linh kiện";
                        } else {
                            type = "Thay thế";
                        }
                    }

                    var direction = "";
                    if (data[i].Direction == null || data[i].Direction === "undefined" || data[i].Direction === "") {
                        direction = "-";
                    } else {
                        if (data[i].Direction == 1) {
                            direction = "Một chiều";
                        } else {
                            direction = "Hai chiều";
                        }
                    }

                    html += `<tr ondblclick="viewRelatedDetails(\`` + data[i].ID + `\`)">`;
                    html += `<td><span title="Xem chi tiết" onclick="viewRelatedDetails(\`` + data[i].ID + `\`)" class="table-detail">${data[i].RelatedName}</span></td>`;
                    html += `<td>${type}</td>`;
                    html += `<td>${direction}</td>`;
                    html += `<td class="text-center"><i title="Xóa dữ liệu" onclick="submitDeleteRelated(\`` + data[i].ID + `\`)" class="hover-delete fas fa-trash p-2"></i></td>`;
                    html += `</tr>`;
                }
            } else {
                html += `<tr class='tr-mb-style'>`;
                html += `<td class='emptytable' colspan='9999'>Không tìm thấy dữ liệu</td>`;
                html += `</tr>`;
            }

            $('#dataBodyRelated').html(html);

            pageIndexLoadRelated(rs.paging.TotalPages, rs.paging.TotalRecords);

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


function onLoadUnitGroups(domUnitGroup, unitGroupID, isDetail) {
    var settings = {
        "url": api_url + "unit-groups/list",
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

        optionHtml += `<option value="0">-- Chọn nhóm đơn vị --</option>`;

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;

            for (var i = 0; i < dataLength; i++) {
                optionHtml += `<option value="${data[i].ID}">${data[i].Name}</option>`;
            }

            $("#" + domUnitGroup).html(optionHtml);

            if (isDetail) {
                $("#" + domUnitGroup).val(unitGroupID).trigger('change');

                //var unitSelect = $("#" + domUnitGroup).closest(".form-group").next().find("select");

                //onLoadUnits(domUnitGroup, unitSelect.attr("id"), unitID, true);
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


function onLoadUnits(domUnitGroup, domUnit) {
    var id = $("#" + domUnitGroup).val();

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

        if (rs.code == 200) {
            var data = rs.data;
            var dataLength = data.length;

            if (dataLength > 0) {
                optionHtml += `<option value="0">-- Chọn đơn vị --</option>`;

                for (var i = 0; i < dataLength; i++) {
                    optionHtml += `<option value="${data[i].ID}">${data[i].Name}</option>`;
                }
            }

            $("#" + domUnit).html(optionHtml);

            var unitID = $("#hdfUnitID").val();

            if (unitID) {
                $("#" + domUnit).val(unitID).trigger('change');

                $("#hdfUnitID").val("");
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

            $("#ddlProdSubject").html(optionHtml);
            $("#ddlProdDetailSubject").html(optionHtml);

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
    $(".nav-custom").removeClass("active");

    if (key) {
        $("#contentList").hide();
        $("#contentDetail").hide();
        $("#contentCreate").show();

        /*Go back to default nav-tab*/
        $("#tabProdGeneralLink").addClass("active");
        $("#tabProductGeneral").addClass("active");

        if (key == 1) {
            $("#ddlProdUnitGroupObligatory").show();
            $("#ddlProdUnitObligatory").show();
            $("#txtProdDecimalsObligatory").show();

            $("#hdfType").val(1);
            $(".titleType").text("Product")

            $("#tabProdBundleLink").hide();
            $("#tabProdAdditionalLink").show();
        } else if (key == 2) {
            $("#ddlProdUnitGroupObligatory").show();
            $("#ddlProdUnitObligatory").show();
            $("#txtProdDecimalsObligatory").show();

            $("#hdfType").val(2);
            $(".titleType").text("Product Bundle")

            $("#tabProdBundleLink").show();
            $("#tabProdAdditionalLink").show();
        } else if (key == 3) {
            $("#ddlProdUnitGroupObligatory").hide();
            $("#ddlProdUnitObligatory").hide();
            $("#txtProdDecimalsObligatory").hide();

            $("#hdfType").val(3);
            $(".titleType").text("Product Family")

            $("#tabProdBundleLink").hide();
            $("#tabProdAdditionalLink").hide();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentList").show();

        onLoadData(0, $("#hdfTypeOnLoad").val());

        clearAllForm("contentCreate");
    }
}


function submitCreate(typeSave) {
    var type = $("#hdfType").val();
    var name = $("#txtProdName").val();
    var parent = $("#txtProdParentVal").val();
    var validFrom = $("#txtProdValidFrom").val();
    var validTo = $("#txtProdValidTo").val();
    var description = $("#txtProdDescription").val();
    var unitGroup = $("#ddlProdUnitGroup").val();
    var unit = $("#ddlProdUnit").val();
    var priceList = $("#txtProdPriceListVal").val();
    var decimals = $("#txtProdDecimals").val();
    var subject = $("#ddlProdSubject").val();

    var validationChecks = [];

    if (type == 1 || type == 2) {
        validationChecks = [
            { input: name, type: 1, element: 'text', name: 'txtProdName' },
            { input: unitGroup, type: 3, name: 'ddlProdUnitGroup' },
            { input: unit, type: 3, name: 'ddlProdUnit' },
            { input: decimals, type: 1, element: 'text', name: 'txtProdDecimals' },
        ];
    } else {
        validationChecks = [
            { input: name, type: 1, element: 'text', name: 'txtProdName' }
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
        "url": api_url + "products",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ParentID": parent,
            "UnitGroupID": unitGroup,
            "UnitID": unit,
            "PriceListID": priceList,
            "SubjectID": subject,
            "Name": name,
            "Type": type,
            "ValidFrom": validFrom,
            "ValidTo": validTo,
            "DecimalsSupported": decimals,
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
                viewDetails(data, $("#hdfType").val());
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


function submitCreateBundle(typeSave) {
    var bundle = $("#hdfDetailID").val();
    var product = $("#txtBundleProdVal").val();
    var quantity = $("#txtBundleQuantity").val();
    var required = $("#ddlBundleRequired").val();
    var unit = $("#ddlBundleUnit").val();

    var validationChecks = [];

    validationChecks = [
        { input: bundle, type: 1, element: 'text', name: 'txtProdName' },
        { input: product, type: 1, element: 'text', name: 'txtBundleProd' },
        { input: quantity, type: 1, element: 'text', name: 'txtBundleQuantity' },
        { input: required, type: 3, name: 'ddlBundleRequired' },
        { input: unit, type: 3, name: 'ddlBundleUnit' },
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
        "url": api_url + "products/bundles",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "BundleID": bundle,
            "ProductID": product,
            "UnitID": unit,
            "Quantity": quantity,
            "Required": required,
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
                $("#modalCreateProdBundle").modal("hide");
                viewBundleDetails(data);
            } else if (typeSave == 2) {
                viewBundleDetails();
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
    var product = $("#hdfDetailID").val();
    var priceList = $("#txtPLItemPriceListVal").val();
    var unit = $("#ddlPLItemUnit").val();
    var discount = $("#txtPLItemDiscountVal").val();
    var amount = getValueWithoutCommas($("#txtPLItemAmount").val());

    var validationChecks = [];

    validationChecks = [
        { input: product, type: 1, element: 'text', name: 'txtPLItemProduct' },
        { input: priceList, type: 1, element: 'text', name: 'txtPLItemPriceList' },
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
            "PriceListID": priceList,
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


function submitCreateRelated(typeSave) {
    var product = $("#hdfDetailID").val();
    var related = $("#txtRelatedProdVal").val();
    var type = $("#ddlRelatedType").val();
    var direction = $("#ddlRelatedDirection").val();

    var validationChecks = [];

    validationChecks = [
        { input: product, type: 1, element: 'text', name: 'txtRelated' },
        { input: related, type: 1, element: 'text', name: 'txtRelatedProd' },
        { input: type, type: 3, name: 'ddlRelatedType' },
        { input: direction, type: 3, name: 'ddlRelatedDirection' }
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
        "url": api_url + "products/relationships",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ProductID": product,
            "RelatedID": related,
            "Type": type,
            "Direction": direction,
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
                $("#modalCreateRelated").modal("hide");
                viewRelatedDetails(data);
            } else if (typeSave == 2) {
                viewRelatedDetails();
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
function viewDetails(id, type) {
    $(".nav-custom").removeClass("active");

    if (id) {
        initAutoComplete("#txtRelatedProd", "products/special", getDataByKey, function (selectedItem) {
            $("#txtRelatedProdVal").val(selectedItem.data.ID);
        }, 3, id);

        $("#contentList").hide();
        $("#contentCreate").hide();
        $("#contentDetail").show();

        /*Go back to default nav-tab*/
        $("#tabProdDetailGeneralLink").addClass("active");
        $("#tabDetailProductGeneral").addClass("active");

        $("#hdfDetailID").val(id);

        onLoadDataNotes();

        var settings = {
            "url": api_url + "products/" + id,
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
                
                if (type == 1) {
                    $(".titleType").text("Product");
                    $("#ddlProdDetailUnitGroupObligatory").show();
                    $("#ddlProdDetailUnitObligatory").show();
                    $("#txtProdDetailDecimalsObligatory").show();

                    removeDisableDom("ddlProdDetailUnit");
                    disableDom("ddlProdDetailUnitGroup");

                    $("#tabProdDetailBundleLink").hide();
                    $("#tabProdDetailAdditionalLink").show();

                    $("#hdfUnitGroupID").val(data.UnitGroupID);
                } else if (type == 2) {
                    $(".titleType").text("Product Bundle");
                    $("#ddlProdDetailUnitGroupObligatory").show();
                    $("#ddlProdDetailUnitObligatory").show();
                    $("#txtProdDetailDecimalsObligatory").show();

                    removeDisableDom("ddlProdDetailUnit");
                    disableDom("ddlProdDetailUnitGroup");

                    $("#tabProdDetailBundleLink").show();
                    $("#tabProdDetailAdditionalLink").show();

                    $("#hdfUnitGroupID").val(data.UnitGroupID);
                } else {
                    $(".titleType").text("Product Family");
                    $("#ddlProdDetailUnitGroupObligatory").hide();
                    $("#ddlProdDetailUnitObligatory").hide();
                    $("#txtProdDetailDecimalsObligatory").hide();

                    removeDisableDom("ddlProdDetailUnitGroup");

                    $("#tabProdDetailBundleLink").hide();
                    $("#tabProdDetailAdditionalLink").hide();
                }

                if (data.Status == 3) {
                    disableDom("txtProdDetailName");
                    disableDom("txtProdDetailValidFrom");
                    disableDom("txtProdDetailValidTo");
                    disableDom("txtProdDetailDescription");
                    disableDom("ddlProdDetailUnit");
                    disableDom("txtProdDetailPriceList");
                    disableDom("txtProdDetailDecimals");
                    disableDom("ddlProdDetailSubject");
                } else {
                    removeDisableDom("txtProdDetailName");
                    removeDisableDom("txtProdDetailValidFrom");
                    removeDisableDom("txtProdDetailValidTo");
                    removeDisableDom("txtProdDetailDescription");
                    removeDisableDom("ddlProdDetailUnit");
                    removeDisableDom("txtProdDetailPriceList");
                    removeDisableDom("txtProdDetailDecimals");
                    removeDisableDom("ddlProdDetailSubject");
                }

                if (data.Status == 0) {
                    // Draft
                    $("#btnProdDetailActivate").hide();
                    $("#btnProdDetailRevise").hide();
                    $("#btnProdDetailRetire").hide();
                    $(".btn-new").hide();
                    $("#btnProdDetailSaveClose").show();
                    $("#btnProdDetailSave").show();
                    $("#btnProdDetailPublish").show();
                } else if (data.Status == 1) {
                    // Activate
                    $("#btnProdDetailPublish").hide();
                    $("#btnProdDetailActivate").hide();
                    $("#btnProdDetailSaveClose").show();
                    $("#btnProdDetailSave").show();
                    $("#btnProdDetailRevise").show();
                    $("#btnProdDetailRetire").show();
                    $(".btn-new").show();
                } else if (data.Status == 2) {
                    // Under Revision
                    $("#btnProdDetailActivate").hide();
                    $("#btnProdDetailRevise").hide();
                    $(".btn-new").hide();
                    $("#btnProdDetailSaveClose").show();
                    $("#btnProdDetailSave").show();
                    $("#btnProdDetailPublish").show();
                    $("#btnProdDetailRetire").show();
                } else if (data.Status == 3) {
                    // Retired
                    $("#btnProdDetailSaveClose").hide();
                    $("#btnProdDetailSave").hide();
                    $("#btnProdDetailRevise").hide();
                    $("#btnProdDetailPublish").hide();
                    $("#btnProdDetailRetire").hide();
                    $(".btn-new").hide();
                    $("#btnProdDetailActivate").show();
                }

                $("#hdfType").val(data.Type);

                $("#hdfProductCommon").val(data.Code + " - " + data.Name);
                $(".prod-common").val(data.Code + " - " + data.Name);

                $("#titleProdDetail").text(data.Code);
                $("#ddlProdDetailStatus").val(data.Status).trigger('change');
                $("#txtProdDetailCode").val(data.Code);
                $("#txtProdDetailName").val(data.Name);
                $("#txtProdDetailParent").val(data.ParentName);
                $("#txtProdDetailParentVal").val(data.ParentID);

                var validFrom = data.ValidFrom != null ? formatDate(new Date(data.ValidFrom), "yyyy-mm-dd") : "";
                $("#txtProdDetailValidFrom").val(validFrom);

                var validTo = data.ValidTo != null ? formatDate(new Date(data.ValidTo), "yyyy-mm-dd") : "";
                $("#txtProdDetailValidTo").val(validTo);

                $("#txtProdDetailDescription").val(data.Description);
                $("#txtProdDetailPriceList").val(data.PriceListName);
                $("#txtProdDetailPriceListVal").val(data.PriceListID);
                $("#txtProdDetailDecimals").val(data.DecimalsSupported);

                $("#hdfUnitID").val(data.UnitID);

                onLoadUnitGroups("ddlProdDetailUnitGroup", data.UnitGroupID, true);

                $("#ddlProdDetailSubject").val(data.SubjectID).trigger('change');

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


function viewBundleDetails(id) {
    if (id) {
        $("#hdfProductBundleID").val(id);

        var settings = {
            "url": api_url + "products/bundles/" + id,
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

                $("#txtProdBundleTitle").text(data.ProductCode);
                $("#txtBundleDetail").val(data.BundleCode + " - " + data.BundleName);
                $("#txtBundleDetailProd").val(data.ProductName);
                $("#txtBundleDetailProdVal").val(data.ProductID);
                $("#txtBundleDetailQuantity").val(data.Quantity);
                $("#ddlBundleDetailRequired").val(data.Required).trigger('change');
                $("#txtBundleDetailUnit").val(data.UnitName);

                $("#modalUpdateProdBundle").modal("show");

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
        $("#modalCreateProdBundle").modal("hide");
        $("#modalUpdateProdBundle").modal("hide");

        onLoadDataBundles(1);

        clearAllForm("contentCreateBundle");
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

                $("#txtPLItemTitle").text(data.PriceListName);
                $("#txtPLItemDetailProduct").val(data.ProductCode + " - " + data.ProductName);
                $("#txtPLItemDetailProductVal").val(data.ProductID);
                $("#txtPLItemDetailPriceList").val(data.PriceListName);
                $("#txtPLItemDetailPriceListVal").val(data.PriceListID);
                $("#ddlPLItemDetailUnit").val(data.UnitID).trigger("change");

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


function viewRelatedDetails(id) {
    if (id) {
        $("#hdfRelatedID").val(id);

        var settings = {
            "url": api_url + "products/relationships/" + id,
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

                $("#txtRelatedTitle").text(data.RelatedName);
                $("#txtRelatedDetail").val(data.ProductCode + " - " + data.ProductName);
                $("#txtRelatedDetailProd").val(data.RelatedCode + " - " + data.RelatedName);
                $("#ddlRelatedDetailType").val(data.Type).trigger('change');
                $("#ddlRelatedDetailDirection").val(data.Direction).trigger('change');

                $("#modalUpdateRelated").modal("show");

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
        $("#modalCreateRelated").modal("hide");
        $("#modalUpdateRelated").modal("hide");

        onLoadDataRelationships(1);

        clearAllForm("contentCreateRelated");
    }
}



/*Update*/
function submitUpdate(typeSave, status) {
    var statusProd = "";

    if (status) {
        statusProd = status;
    } else {
        statusProd = $("#ddlProdDetailStatus").val();
    }

    var id = $("#hdfDetailID").val();
    var name = $("#txtProdDetailName").val();
    var validFrom = $("#txtProdDetailValidFrom").val();
    var validTo = $("#txtProdDetailValidTo").val();
    var description = $("#txtProdDetailDescription").val();

    var unitGroup = $("#ddlProdDetailUnitGroup").val() !== "0" && $("#ddlProdDetailUnitGroup").val() != 0 ? $("#ddlProdDetailUnitGroup").val() : null;

    var unit = $("#ddlProdDetailUnit").val();
    var priceList = $("#txtProdDetailPriceListVal").val();
    var decimals = $("#txtProdDetailDecimals").val();
    var subject = $("#ddlProdDetailSubject").val();

    var type = $("#hdfType").val();

    var validationChecks = [];

    if (type == 1 || type == 2) {
        validationChecks = [
            { input: name, type: 1, element: 'text', name: 'txtProdDetailName' },
            { input: unit, type: 3, name: 'ddlProdDetailUnit' },
            { input: decimals, type: 1, element: 'text', name: 'txtProdDetailDecimals' },
        ];
    } else {
        validationChecks = [
            { input: name, type: 1, element: 'text', name: 'txtProdDetailName' }
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
        "url": api_url + "products",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "UnitGroupID": unitGroup,
            "UnitID": unit,
            "PriceListID": priceList,
            "SubjectID": subject,
            "Name": name,
            "ValidFrom": validFrom,
            "ValidTo": validTo,
            "Status": statusProd,
            "DecimalsSupported": decimals,
            "Description": description,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewDetails(id, $("#hdfType").val());
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


function submitUpdateBundle(typeSave) {
    var id = $("#hdfProductBundleID").val();

    var product = $("#txtBundleDetailProdVal").val();
    var quantity = $("#txtBundleDetailQuantity").val();
    var required = $("#ddlBundleDetailRequired").val();

    var validationChecks = [];

    validationChecks = [
        { input: product, type: 1, element: 'text', name: 'txtBundleDetailProd' },
        { input: quantity, type: 1, element: 'text', name: 'txtBundleDetailQuantity' },
        { input: required, type: 3, name: 'ddlBundleDetailRequired' }
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
        "url": api_url + "products/bundles",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "ProductID": product,
            "Quantity": quantity,
            "Required": required,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewBundleDetails(id);
            } else if (typeSave == 2) {
                viewBundleDetails();
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
    var product = $("#txtPLItemDetailProductVal").val();
    var priceList = $("#txtPLItemDetailPriceListVal").val();
    var unit = $("#ddlPLItemDetailUnit").val();
    var discount = $("#txtPLItemDetailDiscountVal").val();
    var amount = getValueWithoutCommas($("#txtPLItemDetailAmount").val());

    var validationChecks = [];

    validationChecks = [
        { input: product, type: 1, element: 'text', name: 'txtPLItemDetailProduct' },
        { input: priceList, type: 1, element: 'text', name: 'txtPLItemDetailPriceList' },
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


function submitUpdateRelated(typeSave) {
    var id = $("#hdfRelatedID").val();

    var type = $("#ddlRelatedDetailType").val();
    var direction = $("#ddlRelatedDetailDirection").val();

    var validationChecks = [];

    validationChecks = [
        { input: type, type: 3, name: 'ddlRelatedDetailType' },
        { input: direction, type: 3, name: 'ddlRelatedDetailDirection' }
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
        "url": api_url + "products/relationships",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "ID": id,
            "Type": type,
            "Direction": direction,
            "ModifiedBy": userID
        }),
    };

    $("#loader").show();

    $.ajax(settings).done(function (rs) {
        if (rs.code == 200) {
            alertSuccess(rs.messVN);

            if (typeSave == 1) {
                viewRelatedDetails(id);
            } else if (typeSave == 2) {
                viewRelatedDetails();
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


function submitDeleteBundle(idProd) {
    var data = [];

    if (idProd) {
        data.push(idProd);
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
                        "url": api_url + "products/bundles",
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
                            viewBundleDetails();
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


function submitDeletePLItem(idProd) {
    var data = [];

    if (idProd) {
        data.push(idProd);
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


function submitDeleteRelated(idProd) {
    var data = [];

    if (idProd) {
        data.push(idProd);
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
                        "url": api_url + "products/relationships",
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
                            viewRelatedDetails();
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


function pageIndexLoadBundle(totalPages, totalRecords) {
    $("#totalRecordsBundle").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentBundle', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataBundles();
    });
}


function pageIndexLoadPLItem(totalPages, totalRecords) {
    $("#totalRecordsPLItem").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentPLItem', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataPLItems();
    });
}


function pageIndexLoadRelated(totalPages, totalRecords) {
    $("#totalRecordsRelated").text(formatNumber(totalRecords));

    initializePagination('pagingMainContentRelated', totalPages, 5, 'pageIndex', function (currentPage) {
        onLoadDataRelationships();
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

    // Set default value
    var hdfProductCommon = $("#hdfProductCommon").val();

    $(".prod-common").val(hdfProductCommon);
}


/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');

    //modalCreateProdBundle
    $("#ddlBundleRequired").select2({
        dropdownParent: $("#modalCreateProdBundle")
    });

    $("#ddlBundleUnit").select2({
        dropdownParent: $("#modalCreateProdBundle")
    });

    //modalUpdateProdBundle
    $("#ddlBundleDetailRequired").select2({
        dropdownParent: $("#modalUpdateProdBundle")
    });

    //modalCreatePLItem
    $("#ddlPLItemUnit").select2({
        dropdownParent: $("#modalCreatePLItem")
    });

    //modalUpdatePLItem
    $("#ddlPLItemDetailUnit").select2({
        dropdownParent: $("#modalUpdatePLItem")
    });

    //modalCreateRelated
    $("#ddlRelatedType").select2({
        dropdownParent: $("#modalCreateRelated")
    });

    $("#ddlRelatedDirection").select2({
        dropdownParent: $("#modalCreateRelated")
    });

    //modalUpdateRelated
    $("#ddlRelatedDetailType").select2({
        dropdownParent: $("#modalUpdateRelated")
    });

    $("#ddlRelatedDetailDirection").select2({
        dropdownParent: $("#modalUpdateRelated")
    });
});

