$(document).ready(function () {
    let urlParms = getUrlParms()
    if (urlParms != null && 'role' in urlParms && urlParms.role === '2') {
        buildTeacherView()
    }
})

function buildTeacherView() {
    $('#btn-Add').hide()
    var notTeacherView = ['student.html', 'case.html', 'user.html']
    $('.nav li a').each( (index,element) => {
        var hrefStr = $(element).attr('href')
        if (notTeacherView.indexOf(hrefStr) !== -1) {
            $(element).parent().hide()
        }
        $(element).attr('href', hrefStr.replace("html", "html?role=2"))
    })
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b")
    return r ? r[1] : undefined
}

function myAlert(msg, type) {
    if (["primary", "secondary", "success", "danger", "info", "light", "dark"].indexOf(type) === -1) {
        type = "info"
    }
    $("#myModal #modalAlertType").attr("class", "alert alert-" + type)
    $("#myModal #modalAlert").text(msg)
    $("#myModal").modal()
}

function logout() {
    $.get('/api/user/logout', function (data) {
        if (data.errcode === '0') {
            window.location.href = "/"
        } else if (data.errcode === '4101') {
            alert(data.errmsg)
            window.location.href = "/"
        }
    })
}

function getUrlParms() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function initTable(id) {
    return $('#' + id).DataTable({
        dom: 'Bfrtip',
        buttons: [
            'pageLength',
            {extend: 'excelHtml5', text: "导出Excel"},
            {
                extend: 'print',
                text: '打印报表',
                title: "",
                exportOptions: {
                    modifier: {
                        page: 'current',
                        columns: ':visible',
                    }
                }
            }
        ],
        lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
        language: {
            lengthMenu: "每页 _MENU_ 条",
            zeroRecords: "无数据",
            info: "页数 第_PAGE_页 共_PAGES_页",
            infoEmpty: "无数据",
            search: "表内搜索",
            paginate: {
                "first": "首页",
                "last": "末页",
                "next": "下一页",
                "previous": "上一页"
            },
            buttons: {
                pageLength: {
                    _: "每页 %d 行",
                    '-1': "无数据"
                }
            }
        }
    })
}