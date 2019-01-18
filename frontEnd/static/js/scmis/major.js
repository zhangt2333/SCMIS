var apiKeys = ['id', 'name', 'degree', 'study_time', 'department_id']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-editmajorConfirm").on('click', addOrEditComfirm)
    $("#btn-addmajorConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    var json_data = JSON.stringify({
        "id": $("#majorId").val(),
        "name": $('#majorName').val()
    })
    $.ajax({
        url: "/api/major/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true);
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询专业").attr("disabled", false)
        },
        success: function (data) {
            if(data.errcode !== '0') {
                alert(data.errmsg)
                if(data.errcode === '4101') {
                    window.location.href = '/'
                }
                return
            }
            if (typeof(dataTablesObject) !== "undefined"  && dataTablesObject !== null) {
                dataTablesObject.destroy()
            }
            $('#table>tbody tr').remove()
            var tb = $('#table>tbody')[0]
            data['data'].forEach(function (value) {
                var tr = tb.insertRow()
                for (var i = 0; i < apiKeys.length; i++) {
                    var td = tr.insertCell()
                    td.style = "text-align: center;"
                    td.innerHTML = value[apiKeys[i]]
                }
                var td = tr.insertCell()
                if ($('.nav li a').attr('href').indexOf('role=2') === -1) {
                    td.style = "text-align: center;"
                    td.innerHTML = '<a style="cursor:pointer" onclick="editClicked(this)">编辑</a> ' +
                        '<a style="cursor:pointer" onclick="deleteClicked(this)">删除</a>'
                }
            })
            dataTablesObject = initTable('table')
        }
    })
}

function addClicked() {
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editmajor-" + apiKeys[i]).val("")
    }
    $("#btn-editmajorConfirm").hide()
    $("#btn-addmajorConfirm").show()
    $("#modalTitle").text("学校专业信息 添加")
    $("#editmajorInfoModal").modal()
    $($("#input-editmajor-id")[0].parentElement).hide()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editmajor-" + apiKeys[i]).val(v[i].innerHTML)
    }
    $("#btn-addmajorConfirm").hide()
    $("#btn-editmajorConfirm").show()
    $($("#input-editmajor-id")[0].parentElement).show()
    $("#modalTitle").text("学校专业信息 修改")
    $("#editmajorInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-editmajor-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-editmajorConfirm") {
        $.ajax({
            url: "/api/major/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-editmajorConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-editmajorConfirm').text("确认修改").attr("disabled", false);
                NProgress.done()
            },
            success: function (data) {
                if (data.errcode === "0") {
                    alert("修改成功！")
                } else {
                    alert("修改失败~")
                }
            }
        })
    } else {
        $.ajax({
            url: "/api/major/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-addmajorConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-addmajorConfirm').text("确认添加").attr("disabled", false);
                NProgress.done()
            },
            success: function (data) {
                if (data.errcode === "0") {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg)
                }
            }
        })
    }
}

function deleteClicked(v) {
    if (confirm("确定删除专业信息?")) {
        $.ajax({
            url: "/api/major/delete",
            type: "POST",
            data: JSON.stringify({'id': v.parentElement.parentElement.cells[0].innerHTML}),
            contentType: "application/json",
            beforeSend: function () {
                NProgress.start()
            },
            complete: function () {
                NProgress.done()
            },
            success: function (data) {
                if (data.errcode === "0") {
                    dataTablesObject.row(v.parentElement.parentElement).remove().draw()
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg)
                }
            }
        })
    }
}
