var apiKeys = ['id', 'name', 'email', 'mobile', 'department_id']

$(document).ready(function () {
    $.post('/api/user/querySelf', function (data) {
        data = data['data'][0]
        for(let i=0;i<apiKeys.length;i++) {
            $('#input-profile_' + apiKeys[i]).val(data[apiKeys[i]])
        }
        // 根据用户角色是教师视图设置nav，并且传递到href
        if (data['role'] === '2') {
            buildTeacherView()
        }
    })
    $("#btn-Save").on('click', saveClicked)
})

function saveClicked() {
    let data = {}
    for(let i=0;i<apiKeys.length;i++) {
        data[apiKeys[i]] = $('#input-profile_'+apiKeys[i]).val()
    }
    data['password'] = $('#input-profile_originPassword').val()
    data['newPassword'] =  $('#input-profile_newPassword').val()
    data['newPasswordConfirm'] = $('#input-profile_newPasswordConfirm').val()
    if (data['newPassword'] !== '') {
        if (data['newPassword'] !== data['newPasswordConfirm']) {
            myAlert('新密码和确认密码不匹配', 'danger')
            $('#input-profile_newPasswordConfirm').val('')
            return
        }
    } else {
        delete data['newPassword']
    }
    delete data['newPasswordConfirm']
    delete data['id']
    let json_data = JSON.stringify(data)
    $.ajax({
        url: "/api/user/editSelf",
        type: "POST",
        data: json_data,
        contentType: "application/json",
        beforeSend: function () {
            $('#btn-Save').text("修改中...").attr("disabled", true);
            NProgress.start()
        },
        complete: function () {
            $('#btn-Save').text("确认修改").attr("disabled", false);
            NProgress.done()
        },
        success: function (data) {
            if (data.errcode === "0") {
                myAlert(data.errmsg, 'success')
            } else {
                myAlert(data.errmsg, 'danger')
            }
        }
    })
}
