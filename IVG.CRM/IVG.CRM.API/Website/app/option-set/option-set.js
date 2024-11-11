
BindData(1);
function BindData() {
    try {
        $('#loader').show();
        $.ajax({
            url: common_api_url + 'OptionSet/List',
            type: "POST",
            success: function (rs) {

                console.log(rs);

                $('#loader').hide();

                $('#tblData').html('');

                for (var i = 0; i < rs.Data.length; i++) {

                    var checkbox = `<input type="checkbox" class="check-xs cursor-pointer ck-row" data-id="${rs.Data[i].OptionSetId}" />`;
                
                    var html = ` <tr> `;
                    html += `<td class="text-center">${checkbox}</td>`;
                    html += `<td>${(rs.Data[i].OptionSetId != null ? rs.Data[i].OptionSetId : '')}</td>`;
                    //html += `<td><input class="form-control txtOptionSetId" spellcheck="false" autocomplete="off" value="${rs.Data[i].OptionSetId}" disabled />  </td>`;
                    html += `<td class="table-detail" onclick="Detail('${rs.Data[i].OptionSetId}')">${(rs.Data[i].Name != null ? rs.Data[i].Name : '')}</td>`;
                    html += `<td>${(rs.Data[i].Description != null ? rs.Data[i].Description : '')}</td>`;
                    html += `</tr>`;

                    $('#tblData').append(html);

                }

            }
        });

    } catch (e) {
        console.log(e);
    }
}


function Detail(OptionSetId) {
    try {
        $('#loader').show();
        $.ajax({
            url: common_api_url + 'OptionSet/Detail',
            type: "POST",
            data: {
                IntID: OptionSetId
            },
            success: function (rs) {

                console.log(rs);

                $('#loader').hide();
                $('#tblDataChild').html('');

                if (rs.Data != undefined) {
                    $('#txtOptionSetId').val(rs.Data.OptionSetId);
                    $('#txtName').val(rs.Data.Name);
                    $('#txtDescription').val(rs.Data.Description);
                }


                if (rs.OptionSetValues != undefined && rs.OptionSetValues.length > 0) {
                    for (var i = 0; i < rs.OptionSetValues.length; i++) {

                        var checkbox = `<input type="checkbox" class="check-xs cursor-pointer ck-row" data-id="${rs.OptionSetValues[i].OptionSetValueId}" />`;

                        var html = ` <tr> `;
                        html += `<td class="text-center">${checkbox}</td>`;
                        html += `<td><input class="form-control txtValue" spellcheck="false" autocomplete="off" value="${rs.OptionSetValues[i].Value}" />  </td>`;
                        html += `<td><input class="form-control txtName" spellcheck="false" autocomplete="off" value="${rs.OptionSetValues[i].Name}" />  </td>`;
                        html += `</tr>`;

                        $('#tblDataChild').append(html);

                    }
                }

            }
        });
    } catch (e) {
        console.log(e);
    }
}



function NewRowChild() {
    try {
        var iconClear = `<button class="btn btn-sm btn-danger-soft" title="Delete" onclick="DeleteRowChild(this)"><i class="fas fa-times"></i></button>`;

        var html = ` <tr style="color:antiquewhite!important"> `;
        html += `<td class="text-center">${iconClear}</td>`;
        html += `<td><input class="form-control txtValue" spellcheck="false" autocomplete="off" autofocus /></td>`;
        html += `<td><input class="form-control txtName" spellcheck="false" autocomplete="off" /></td>`;
        html += `</tr>`;

        $('#tblDataChild').append(html);
    } catch (e) {

    }
}

function DeleteRowChild(row) {
    try {

    } catch (e) {

    }
}