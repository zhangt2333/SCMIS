# -*- coding: utf-8 -*-
# !/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# urls.py 2018/12/3 21:13

import os

import config
from handlers import user_handler, department_handler, major_handler, student_handler, case_handler, course_handler, \
    section_handler, take_handler
from handlers.static_handler import StaticHandler

urls = [
    (r"/api/user/login", user_handler.LoginHandler),
    (r"/api/user/logout", user_handler.LogoutHandler),
    (r"/api/user/query", user_handler.QueryHandler),
    (r"/api/user/edit", user_handler.EditHandler),
    (r"/api/user/add", user_handler.AddHandler),
    (r"/api/user/delete", user_handler.DeleteHandler),
    (r"/api/user/editRole", user_handler.EditRoleHandler),
    (r"/api/user/querySelf", user_handler.QuerySelfHandler),
    (r"/api/user/editSelf", user_handler.EditSelfHandler),

    (r"/api/department/query", department_handler.QueryHandler),
    (r"/api/department/edit", department_handler.EditHandler),
    (r"/api/department/add", department_handler.AddHandler),
    (r"/api/department/delete", department_handler.DeleteHandler),

    (r"/api/major/query", major_handler.QueryHandler),
    (r"/api/major/edit", major_handler.EditHandler),
    (r"/api/major/add", major_handler.AddHandler),
    (r"/api/major/delete", major_handler.DeleteHandler),

    (r"/api/student/query", student_handler.QueryHandler),
    (r"/api/student/edit", student_handler.EditHandler),
    (r"/api/student/add", student_handler.AddHandler),
    (r"/api/student/delete", student_handler.DeleteHandler),

    (r"/api/case/query", case_handler.QueryHandler),
    (r"/api/case/edit", case_handler.EditHandler),
    (r"/api/case/add", case_handler.AddHandler),
    (r"/api/case/delete", case_handler.DeleteHandler),

    (r"/api/course/query", course_handler.QueryHandler),
    (r"/api/course/edit", course_handler.EditHandler),
    (r"/api/course/add", course_handler.AddHandler),
    (r"/api/course/delete", course_handler.DeleteHandler),

    (r"/api/section/query", section_handler.QueryHandler),
    (r"/api/section/edit", section_handler.EditHandler),
    (r"/api/section/add", section_handler.AddHandler),
    (r"/api/section/delete", section_handler.DeleteHandler),

    (r"/api/take/query", take_handler.QueryHandler),
    (r"/api/take/edit", take_handler.EditHandler),
    (r"/api/take/add", take_handler.AddHandler),
    (r"/api/take/delete", take_handler.DeleteHandler),


    (r"/(.*)", StaticHandler, dict(path=config.front_end_dir, default_filename="login.html"))
]
