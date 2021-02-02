# coding:utf-8

import os

import config
from handlers import UserHandler, DepartmentHandler, MajorHandler, StudentHandler, CaseHandler, CourseHandler, \
    SectionHandler, TakeHandler
from handlers.StaticHandler import StaticHandler

urls = [
    (r"/api/user/login", UserHandler.LoginHandler),
    (r"/api/user/logout", UserHandler.LogoutHandler),
    (r"/api/user/query", UserHandler.QueryHandler),
    (r"/api/user/edit", UserHandler.EditHandler),
    (r"/api/user/add", UserHandler.AddHandler),
    (r"/api/user/delete", UserHandler.DeleteHandler),
    (r"/api/user/editRole", UserHandler.EditRoleHandler),
    (r"/api/user/querySelf", UserHandler.QuerySelfHandler),
    (r"/api/user/editSelf", UserHandler.EditSelfHandler),

    (r"/api/department/query", DepartmentHandler.QueryHandler),
    (r"/api/department/edit", DepartmentHandler.EditHandler),
    (r"/api/department/add", DepartmentHandler.AddHandler),
    (r"/api/department/delete", DepartmentHandler.DeleteHandler),

    (r"/api/major/query", MajorHandler.QueryHandler),
    (r"/api/major/edit", MajorHandler.EditHandler),
    (r"/api/major/add", MajorHandler.AddHandler),
    (r"/api/major/delete", MajorHandler.DeleteHandler),

    (r"/api/student/query", StudentHandler.QueryHandler),
    (r"/api/student/edit", StudentHandler.EditHandler),
    (r"/api/student/add", StudentHandler.AddHandler),
    (r"/api/student/delete", StudentHandler.DeleteHandler),

    (r"/api/case/query", CaseHandler.QueryHandler),
    (r"/api/case/edit", CaseHandler.EditHandler),
    (r"/api/case/add", CaseHandler.AddHandler),
    (r"/api/case/delete", CaseHandler.DeleteHandler),

    (r"/api/course/query", CourseHandler.QueryHandler),
    (r"/api/course/edit", CourseHandler.EditHandler),
    (r"/api/course/add", CourseHandler.AddHandler),
    (r"/api/course/delete", CourseHandler.DeleteHandler),

    (r"/api/section/query", SectionHandler.QueryHandler),
    (r"/api/section/edit", SectionHandler.EditHandler),
    (r"/api/section/add", SectionHandler.AddHandler),
    (r"/api/section/delete", SectionHandler.DeleteHandler),

    (r"/api/take/query", TakeHandler.QueryHandler),
    (r"/api/take/edit", TakeHandler.EditHandler),
    (r"/api/take/add", TakeHandler.AddHandler),
    (r"/api/take/delete", TakeHandler.DeleteHandler),


    (r"/(.*)", StaticHandler, dict(path=config.front_end_dir, default_filename="login.html"))
]
