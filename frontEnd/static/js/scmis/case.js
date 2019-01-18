var apiKeys = ['id', 'student_id', 'type', 'level', 'date', 'description']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-editcaseConfirm").on('click', addOrEditComfirm)
    $("#btn-addcaseConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    var json_data = JSON.stringify({
        "student_id": $("#caseStudentId").val()
    })
    $.ajax({
        url: "/api/case/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true)
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询学生奖罚信息").attr("disabled", false)
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
                    td.setAttribute("value", td.innerHTML)
                    if (apiKeys[i] === 'type') {
                        td.innerHTML = function (parm) {
                            switch (parm) {
                                case "0": return "奖励"
                                case "1": return "惩罚"
                            }
                        }(td.innerHTML)
                    } else if (apiKeys[i] === 'level') {
                        td.innerHTML = function (parm) {
                            switch (parm) {
                                case "0": return "院级"
                                case "1": return "校级"
                                case "2": return "市级"
                                case "3": return "省级"
                                case "4": return "国级"
                                case "5": return "世界级"
                            }
                        }(td.innerHTML)
                    } else if(apiKeys[i] === 'student_id') {
                        td.innerHTML = value['student_name'] + "(" + value['student_id'] + ")"
                    }
                }
                var td = tr.insertCell()
                td.style = "text-align: center;"
                td.innerHTML = '<a style="cursor:pointer" onclick="editClicked(this)">编辑</a> ' +
                    '<a style="cursor:pointer" onclick="deleteClicked(this)">删除</a>'
            })
            dataTablesObject = initTable('table')
        }
    })
}

function addClicked() {
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editcase-" + apiKeys[i]).val("")
    }
    $("#btn-editcaseConfirm").hide()
    $("#btn-addcaseConfirm").show()
    $("#modalTitle").text("学生奖罚信息 添加")
    $("#editcaseInfoModal").modal()
    $($("#input-editcase-id")[0].parentElement).hide()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editcase-" + apiKeys[i]).val(v[i].getAttribute("value"))
    }
    $("#btn-addcaseConfirm").hide()
    $("#btn-editcaseConfirm").show()
    $($("#input-editcase-id")[0].parentElement).show()
    $("#modalTitle").text("学生奖罚信息 修改")
    $("#editcaseInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-editcase-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-editcaseConfirm") {
        $.ajax({
            url: "/api/case/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-editcaseConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-editcaseConfirm').text("确认修改").attr("disabled", false);
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
            url: "/api/case/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-addcaseConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-addcaseConfirm').text("确认添加").attr("disabled", false);
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
    if (confirm("确定删除院系信息?")) {
        $.ajax({
            url: "/api/case/delete",
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
