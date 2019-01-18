var apiKeys = ['id', 'name', 'email', 'mobile', 'department_id', 'permission', 'role']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-edituserConfirm").on('click', addOrEditComfirm)
    $("#btn-adduserConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    let json_data = JSON.stringify({
        "id": $("#userId").val(),
        "name": $("#userName").val(),
        "department_name": $('#userDepartmentName').val()
    })
    $.ajax({
        url: "/api/user/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true)
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询系统用户信息").attr("disabled", false)
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
            let tb = $('#table>tbody')[0]
            data['data'].forEach(function (value) {
                let tr = tb.insertRow()
                for (var i = 0; i < apiKeys.length; i++) {
                    let td = tr.insertCell()
                    td.style = "text-align: center;"
                    td.innerHTML = value[apiKeys[i]]
                    td.setAttribute("value", td.innerHTML)
                    if (apiKeys[i] === 'role') {
                        td.innerHTML = function (parm) {
                            switch (parm) {
                                case "0": return "管理员"
                                case "1": return "教务员"
                                case "2": return "教师"
                            }
                        }(td.innerHTML)
                    } else if (apiKeys[i] === 'department_id') {
                        td.innerHTML = value['department_name'] + "(" + value['department_id'] + ")"
                    }
                }
                let td = tr.insertCell()
                td.style = "text-align: center;"
                td.innerHTML = '<a style="cursor:pointer" onclick="editClicked(this)">编辑</a> ' +
                    '<a style="cursor:pointer" onclick="permissionClicked(this)">授权</a> ' +
                    '<a style="cursor:pointer" onclick="deleteClicked(this)">删除</a>'
            })
            dataTablesObject = initTable('table')
        }
    })
}

function addClicked() {
    for (let i = 0; i < apiKeys.length; i++) {
        $("#input-edituser-" + apiKeys[i]).val("")
    }
    $("#editPanel").hide()
    $("#addPanel").show()
    $("#modalTitle").text("系统用户信息 批量添加")
    $("#edituserInfoModal").modal()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (let i = 0; i < apiKeys.length; i++) {
        $("#input-edituser-" + apiKeys[i]).val(v[i].getAttribute("value"))
    }
    $("#editPanel").show()
    $("#input-edituser-id").parent().siblings('div.row').show()
    $("#input-edituser-role").parent().hide()
    $("#addPanel").hide()
    $("#modalTitle").text("系统用户信息 修改")
    $("#edituserInfoModal").modal()
}

function permissionClicked(v) {
    v = v.parentElement.parentElement.cells
    for (let i = 0; i < apiKeys.length; i++) {
        $("#input-edituser-" + apiKeys[i]).val(v[i].getAttribute("value"))
    }
    $("#editPanel").show()
    $("#addPanel").hide()
    $("#input-edituser-id").parent().siblings('div.row').hide()
    $("#input-edituser-role").parent().show()
    $("#modalTitle").text("系统用户信息 权限授予")
    $("#edituserInfoModal").modal()
}

function addOrEditComfirm() {
    if (event.srcElement.id === "btn-edituserConfirm") {
        if ($('#input-edituser-role').parent().css("display") !== 'none') {
            let data = {
                "id": $('#input-edituser-id').val(),
                "role": $('#input-edituser-role').val()
            }
            let json_data = JSON.stringify(data)
            $.ajax({
                url: "/api/user/editRole",
                type: "POST",
                data: json_data,
                contentType: "application/json",
                beforeSend: function () {
                    $('#btn-edituserConfirm').text("查询中...").attr("disabled", true);
                    NProgress.start()
                },
                complete: function () {
                    $('#btn-edituserConfirm').text("确认修改").attr("disabled", false);
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
            return
        }

        let data = {}
        for (let i = 0; i < apiKeys.length; i++) {
            data[apiKeys[i]] = $("#input-edituser-" + apiKeys[i]).val()
        }
        let json_data = JSON.stringify(data)
        $.ajax({
            url: "/api/user/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-edituserConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-edituserConfirm').text("确认修改").attr("disabled", false);
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
    } else if (event.srcElement.id === "btn-adduserConfirm") {
        let data = []
        let keys = ['id', 'password', 'name', 'department_id', 'email', 'mobile']
        let rows = $('#input-adduser').val().split("\n")
        for(let i=0;i<rows.length;i++) {
            let cols = rows[i].trim().split(" ")
            let index = 0;
            let row = {}
            for(let j=0;j<cols.length && index<keys.length;j++) {
                if(cols[j] !== "") {
                    row[keys[index++]] = cols[j]
                }
            }
            data.push(row)
        }
        let json_data = JSON.stringify(data)
        $.ajax({
            url: "/api/user/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-adduserConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-adduserConfirm').text("确认添加").attr("disabled", false);
                NProgress.done()
            },
            success: function (data) {
                if (data.errcode === "0") {
                    alert("添加成功！")
                } else {
                    alert("添加失败~")
                }
            }
        })
    }
}

function deleteClicked(v) {
    if (confirm("确定删除系统用户信息?")) {
        $.ajax({
            url: "/api/user/delete",
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
                    alert("删除成功！")
                } else {
                    alert("删除失败~")
                }
            }
        })
    }
}
