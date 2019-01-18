# coding:utf-8

import os

# 前端页面路径
front_end_dir = os.path.join(os.path.dirname(__file__), "../frontEnd/")

# Application配置参数
settings = dict(
        static_path=os.path.join(front_end_dir, "static"),
        cookie_secret="T96ZtPZGRN6gLLXb219ELFYFcfYdS0VSk+XJWvpf3ac=",
        xsrf_cookies=False,
        debug=True
)


# 数据库配置参数
mysql_options = dict(
    host="127.0.0.1",
    db="scmis",
    user="root",
    password=""
)

# Redis配置参数
redis_options = dict(
    host="127.0.0.1",
    port=6379
)

# 日志配置
log_path = os.path.join(os.path.dirname(__file__), "logs/log")
log_level = "debug"

# 密码加密密钥
passwd_hash_key = "PenCpS+aS160CAD1tmfOk+tjpovbmkZzpIeiVUyhkg8="
