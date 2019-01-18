var apiKeys = ['id', 'name', 'property', 'type', 'period', 'credit', 'exam_type', 'department_id', 'description']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-editcourseConfirm").on('click', addOrEditComfirm)
    $("#btn-addcourseConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    var json_data = JSON.stringify({
        "id": $("#courseId").val(),
        "name": $("#courseName").val()
    })
    $.ajax({
        url: "/api/course/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true)
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询课程设置信息").attr("disabled", false)
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
                    if (apiKeys[i] === 'property') {
                        td.innerHTML = function (parm) {
                            switch (parm) {
                                case "1": return "必修"
                                case "2": return "限选"
                                case "3": return "任选"
                                case "4": return "通识"
                            }
                        }(td.innerHTML)
                    } else if (apiKeys[i] === 'type') {
                        td.innerHTML = function (parm) {
                            switch (parm) {
                                case "1": return "学科基础课"
                                case "2": return "专业必修课"
                                case "3": return "通识必修课"
                                case "4": return "通识核心课"
                                case "5": return "通识选修课"
                            }
                        }(td.innerHTML)
                    } else if(apiKeys[i] === 'exam_type') {
                        td.innerHTML = function (parm) {
                            switch (parm) {
                                case "0": return "考试"
                                case "1": return "考察"
                            }
                        }(td.innerHTML)
                    }
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
        $("#input-editcourse-" + apiKeys[i]).val("")
    }
    $("#btn-editcourseConfirm").hide()
    $("#btn-addcourseConfirm").show()
    $("#modalTitle").text("课程设置信息 添加")
    $("#editcourseInfoModal").modal()
    $($("#input-editcourse-id")[0].parentElement).hide()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editcourse-" + apiKeys[i]).val(v[i].getAttribute("value"))
    }
    $("#btn-addcourseConfirm").hide()
    $("#btn-editcourseConfirm").show()
    $($("#input-editcourse-id")[0].parentElement).show()
    $("#modalTitle").text("课程设置信息 修改")
    $("#editcourseInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-editcourse-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-editcourseConfirm") {
        $.ajax({
            url: "/api/course/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-editcourseConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-editcourseConfirm').text("确认修改").attr("disabled", false);
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
            url: "/api/course/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-addcourseConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-addcourseConfirm').text("确认添加").attr("disabled", false);
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
    if (confirm("确定删除课程信息?")) {
        $.ajax({
            url: "/api/course/delete",
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
