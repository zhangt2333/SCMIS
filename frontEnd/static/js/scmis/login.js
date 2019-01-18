$(function(){
    $('#form_login').on('submit', function () {
        let data = JSON.stringify({
            "id": $('#inputId').val(),
            "password": $('#inputPassword').val(),
            "remember": $('#remember-me').is(':checked')?"1":"0"
        })

        $.ajax({
            url: "/api/user/login",
            type: "post",
            data: data,
            contentType: "application/json",
            beforeSend: function () {
                NProgress.start()
                $('#btn-submit').text("登陆中...").attr("disabled", true);
            },
            complete: function() {
                NProgress.done()
                $('#btn-submit').text("点击登录").attr("disabled", false);
            },
            success: function (data) {
                if (data.errcode === "0") {
                    window.location.href = "/profile.html"
                } else {
                    $('#inputPassword').val()
                    myAlert(data.errmsg, "danger")
                }
            }
        })
        return false
    })
})