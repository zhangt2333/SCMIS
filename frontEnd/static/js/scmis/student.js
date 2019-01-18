var apiKeys = ['id', 'name', 'birthday', 'sex', 'mobile',
    'native_place', 'enrollment_year', 'id_card', 'major_id']
var dataTablesObject = null

$(document).ready(function () {
    $('#table td').css('text-align', 'center')
    $('#table th').css('text-align', 'center')
    $("#btn-Query").on('click', queryClicked)
    $('#btn-Add').on('click', addClicked)
    $("#btn-editStudentConfirm").on('click', addOrEditComfirm)
    $("#btn-addStudentConfirm").on('click', addOrEditComfirm)
    dataTablesObject = initTable('table')
})


function queryClicked() {
    var json_data = JSON.stringify({
        "id": $("#studentId").val(),
        "name": $('#studentName').val()
    })
    $.ajax({
        url: "/api/student/query",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            NProgress.start()
            $('#btn-Query').text("查询中...").attr("disabled", true);
        },
        complete: function () {
            NProgress.done()
            $('#btn-Query').text("查询学生").attr("disabled", false)
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
                if (value['sex'] === "1") value['sex'] = "男"
                else value['sex'] = "女"
                var tr = tb.insertRow()
                for (var i = 0; i < apiKeys.length; i++) {
                    var td = tr.insertCell()
                    td.style = "text-align: center;"
                    td.innerHTML = value[apiKeys[i]]
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
        $("#input-editStudent-" + apiKeys[i]).val("")
    }
    $("#btn-editStudentConfirm").hide()
    $("#btn-addStudentConfirm").show()
    $("#modalTitle").text("学生个人信息 添加")
    $("#editStudentInfoModal").modal()

}

function editClicked(v) {
    v = v.parentElement.parentElement.cells
    for (var i = 0; i < apiKeys.length; i++) {
        $("#input-editStudent-" + apiKeys[i]).val(v[i].innerHTML)
    }
    if (v[3].innerHTML === "女") $("#input-editStudent-sex").val(0)
    else $("#input-editStudent-sex").val(1)
    $("#btn-addStudentConfirm").hide()
    $("#btn-editStudentConfirm").show()
    $("#modalTitle").text("学生个人信息 修改")
    $("#editStudentInfoModal").modal()
}

function addOrEditComfirm() {
    var data = {}
    for (var i = 0; i < apiKeys.length; i++) {
        data[apiKeys[i]] = $("#input-editStudent-" + apiKeys[i]).val()
    }
    var json_data = JSON.stringify(data)
    if (event.srcElement.id === "btn-editStudentConfirm") {
        $.ajax({
            url: "/api/student/edit",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-editStudentConfirm').text("修改中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-editStudentConfirm').text("确认修改").attr("disabled", false);
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
            url: "/api/student/add",
            type: "POST",
            data: json_data,
            contentType: "application/json",
            beforeSend: function () {
                $('#btn-addStudentConfirm').text("添加中...").attr("disabled", true);
                NProgress.start()
            },
            complete: function () {
                $('#btn-addStudentConfirm').text("确认添加").attr("disabled", false);
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
    if(confirm("确定删除学生信息?")){
        $.ajax({
            url: "/api/student/delete",
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
