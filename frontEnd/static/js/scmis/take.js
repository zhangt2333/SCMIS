var apiKeys = ['id', 'student_id', 'section_id', 'usual_grade', 'mid_grade', 'final_grade', 'grade', 'GPA']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-edittakeConfirm").on('click', addOrEditComfirm)
    $("#btn-addtakeConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})

function queryClicked() {
    var json_data = JSON.stringify({
        "id": $("#takeId").val(),
        "student_id": $("#takeStudentId").val(),
        "section_id": $("#takeSectionId").val()
    })
    $.ajax({
        url: "/api/take/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true);
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询课程开课信息").attr("disabled", false);
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
                    if (apiKeys[i] === 'student_id') {
                        td.innerHTML = value['student_name'] + "(" + value['student_id'] + ")"
                    } else if (apiKeys[i] === 'section_id') {
                        td.innerHTML = value['course_name'] + "(" + value['section_id'] + ")"
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
        $("#input-edittake-" + apiKeys[i]).val("")
    }
    $("#btn-edittakeConfirm").hide()
    $("#btn-addtakeConfirm").show()
    $("#modalTitle").text("学生选课信息 添加")
    $("#edittakeInfoModal").modal()
    $($("#input-edittake-id")[0].parentElement).hide()
    $($("#input-edittake-usual_grade")[0].parentElement).hide()
    $($("#input-edittake-mid_grade")[0].parentElement).hide()
    $($("#input-edittake-final_grade")[0].parentElement).hide()
    $($("#input-edittake-grade")[0].parentElement).hide()
    $($("#input-edittake-GPA")[0].parentElement).hide()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-edittake-" + apiKeys[i]).val(v[i].getAttribute("value"))
    }
    $($("#input-edittake-id")[0].parentElement).siblings().show()
    $("#btn-addtakeConfirm").hide()
    $("#btn-edittakeConfirm").show()
    $("#modalTitle").text("学生选课信息 修改")
    $("#edittakeInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-edittake-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-edittakeConfirm") {
        $.ajax({
            url: "/api/take/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-edittakeConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-edittakeConfirm').text("确认修改").attr("disabled", false);
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
            url: "/api/take/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-addtakeConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-addtakeConfirm').text("确认添加").attr("disabled", false);
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
    if (confirm("确定删除学生选课信息?")) {
        $.ajax({
            url: "/api/take/delete",
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
