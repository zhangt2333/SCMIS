# -*- coding: utf-8 -*-
# !/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# config.py 2018/12/3 21:13

import os

# 前端页面路径
front_end_dir = os.path.join(os.path.dirname(__file__), "../frontEnd/")

# Application配置参数
app_settings = dict(
    static_path=os.path.join(front_end_dir, "static"),
    cookie_secret="your_secret",
    xsrf_cookies=False,
    debug=True
)


# 数据库配置参数
mysql_settings = dict(
    host="192.168.152.128",
    port=33306,
    db="scmis",
    user="root",
    password="sduoj-server-mysql"
)

# Redis配置参数
redis_settings = dict(
    address="redis://192.168.152.128:6379"
)

# 日志配置
log_path = os.path.join(os.path.dirname(__file__), "logs/log")
log_level = "debug"

# 密码加密密钥
passwd_hash_key = "your_secret"
