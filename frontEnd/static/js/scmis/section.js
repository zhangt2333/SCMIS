var apiKeys = ['id', 'course_id', 'semester', 'year', 'capacity', 'teacher_id', 'btime', 'etime']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-editsectionConfirm").on('click', addOrEditComfirm)
    $("#btn-addsectionConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    var json_data = JSON.stringify({
        "id": $("#sectionId").val(),
        "name": $("#sectionName").val()
    })
    $.ajax({
        url: "/api/section/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true);
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询课程开课信息").attr("disabled", false)
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
                    if (apiKeys[i] === 'course_id') {
                        td.innerHTML = value['course_name'] + "(" + value['course_id'] + ")"
                    } else if (apiKeys[i] === 'teacher_id') {
                        td.innerHTML = value['teacher_name'] + "(" + value['teacher_id'] + ")"
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
        $("#input-editsection-" + apiKeys[i]).val("")
    }
    $("#btn-editsectionConfirm").hide()
    $("#btn-addsectionConfirm").show()
    $("#modalTitle").text("课程开课信息 添加")
    $("#editsectionInfoModal").modal()
    $($("#input-editsection-id")[0].parentElement).hide()
}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editsection-" + apiKeys[i]).val(v[i].getAttribute("value"))
    }
    $("#btn-addsectionConfirm").hide()
    $("#btn-editsectionConfirm").show()
    $($("#input-editsection-id")[0].parentElement).show()
    $("#modalTitle").text("课程开课信息 修改")
    $("#editsectionInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-editsection-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-editsectionConfirm") {
        $.ajax({
            url: "/api/section/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-editsectionConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-editsectionConfirm').text("确认修改").attr("disabled", false);
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
            url: "/api/section/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-addsectionConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-addsectionConfirm').text("确认添加").attr("disabled", false);
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
            url: "/api/section/delete",
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