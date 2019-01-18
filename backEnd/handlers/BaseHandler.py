# coding:utf-8

import json
import logging

from tornado.web import RequestHandler, StaticFileHandler
from utils.session import Session


class BaseHandler(RequestHandler):
    """自定义基类"""
    @property
    def db(self):
        """作为RequestHandler对象的db属性"""
        return self.application.db

    @property
    def redis(self):
        """作为RequestHandler对象的redis属性"""
        return self.application.redis

    def prepare(self):
        """预解析json数据"""
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.json_args = json.loads(self.request.body)
        else:
            self.json_args = {}

    def set_default_headers(self):
        """设置默认json格式"""
        self.set_header("Content-Type", "application/json; charset=UTF-8")

    def get_current_user(self):
        """判断用户是否登录"""
        self.session = Session(self)
        return self.session.data

    def is_admin(self):
        """判断用户是否为管理员"""
        if not self.session:
            user_role = self.get_current_user()['user_role']
        else:
            user_role = self.session.data['user_role']
        if user_role == '0':
            return True
        return False

    def is_principal(self):
        """判断用户是否为教务员"""
        if not self.session:
            user_role = self.get_current_user()['user_role']
        else:
            user_role = self.session.data['user_role']
        if user_role == '0' or user_role == '1':
            return True
        return False


class StaticFileBaseHandler(StaticFileHandler):
    """自定义静态文件处理类, 在用户获取html页面的时候设置_xsrf的cookie"""
    def __init__(self, *args, **kwargs):
        super(StaticFileBaseHandler, self).__init__(*args, **kwargs)
        self.xsrf_token

