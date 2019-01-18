var apiKeys = ['id', 'name', 'dean', 'address']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-editdepartmentConfirm").on('click', addOrEditComfirm)
    $("#btn-adddepartmentConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    var json_data = JSON.stringify({
        "id": $("#departmentId").val(),
        "name": $('#departmentName').val()
    })
    $.ajax({
        url: "/api/department/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true)
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询院系").attr("disabled", false)
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
                    td.innerHTML = '<a style="cursor:pointer" onclick="editClicked(this)">编辑</a>'
                }
            })
            dataTablesObject = initTable('table')
        }
    })
}

function addClicked() {
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editdepartment-" + apiKeys[i]).val("")
    }
    $("#btn-editdepartmentConfirm").hide()
    $("#btn-adddepartmentConfirm").show()
    $("#modalTitle").text("学校院系信息 添加")
    $("#editdepartmentInfoModal").modal()
    $($("#input-editdepartment-id")[0].parentElement).hide()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editdepartment-" + apiKeys[i]).val(v[i].innerHTML)
    }
    $("#btn-adddepartmentConfirm").hide()
    $("#btn-editdepartmentConfirm").show()
    $($("#input-editdepartment-id")[0].parentElement).show()
    $("#modalTitle").text("学校院系信息 修改")
    $("#editdepartmentInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-editdepartment-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-editdepartmentConfirm") {
        $.ajax({
            url: "/api/department/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-editdepartmentConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-editdepartmentConfirm').text("确认修改").attr("disabled", false);
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
    } else {
        $.ajax({
            url: "/api/department/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-adddepartmentConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-adddepartmentConfirm').text("确认添加").attr("disabled", false);
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
    if(confirm("确定删除院系信息?")){
        $.ajax({
            url: "/api/department/delete",
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
