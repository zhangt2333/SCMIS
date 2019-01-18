# -*- coding: utf-8 -*-
# !/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# UserHandler.py 2018/12/3 21:13
import hashlib
import logging

import config
from utils import DAO
from utils.commons import required_login, required_admin
from utils.response_code import RET
from utils.session import Session
from .BaseHandler import BaseHandler


class LoginHandler(BaseHandler):
    def post(self):
        # 获取参数
        id = self.json_args.get('id')
        passwd = self.json_args.get('password')
        remember = self.json_args.get('remember')

        # 检查参数
        if not all([id, passwd, remember]):
            return self.write(dict(errcode=RET.PARAMERR, errmsg="参数错误"))

        # 检查密码正确与否
        res = None
        try:
            with self.db.cursor() as cursor:
                cursor.execute('SELECT ui_passwd, ui_role FROM ms_user_info WHERE ui_id=%(id)s', {"id": id})
                res = cursor.fetchone()
                self.db.commit()
                cursor.close()
            passwd = hashlib.sha256((passwd + config.passwd_hash_key).encode('utf-8')).hexdigest()
            if not (res and res[0] == passwd):
                return self.write(dict(errcode=RET.DATAERR, errmsg="账号或密码错误！"))
            # 成功，生成session数据
            self.session = Session(self)
            self.session.data['user_id'] = id
            self.session.data['user_role'] = str(res[1])
            self.session.save()
            return self.write(dict(errcode=RET.OK, errmsg="登录成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="账号或密码错误"))


class LogoutHandler(BaseHandler):
    @required_login
    def get(self):
        # 清除session数据
        # sesssion = Session(self)
        self.session.clear()
        self.write(dict(errcode=RET.OK, errmsg="退出成功"))


class QueryHandler(BaseHandler):
    @required_login
    @required_admin
    def post(self):
        sql = """
        SELECT ui_id, ui_name, ui_email, ui_mobile, ui_department_id, di_name, ui_permission, ui_role
        FROM ms_user_info JOIN ms_department_info ON di_id=ui_department_id
        WHERE ui_id like %(id)s AND
              ui_name like %(name)s AND
              di_name like %(department_name)s
        ORDER BY ui_id desc;
        """.strip()
        ret_keys = ['id', 'name', 'email', 'mobile', 'department_id', 'department_name', 'permission', 'role']
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['name'] = '%{}%'.format(self.json_args['name'])
        self.json_args['department_name'] = '%{}%'.format(self.json_args['department_name'])
        try:
            res = DAO.db_query(self, sql, self.json_args, ret_keys)
            return self.write(dict(errcode=RET.OK, errmsg="OK", data=res))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="参数错误"))


class EditHandler(BaseHandler):
    @required_login
    @required_admin
    def post(self):
        sql = """
        UPDATE ms_user_info
        SET ui_name=%(name)s, ui_email=%(email)s, 
            ui_mobile=%(mobile)s, ui_department_id=%(department_id)s
        WHERE ui_id=%(id)s;
        """.strip()
        try:
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="修改成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class EditRoleHandler(BaseHandler):
    """修改用户角色"""

    @required_login
    @required_admin
    def post(self):
        sql = """
        UPDATE ms_user_info
        SET ui_role=%(role)s
        WHERE ui_id=%(id)s;
        """.strip()
        try:
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="授权成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class AddHandler(BaseHandler):
    """批量录入"""

    @required_login
    @required_admin
    def post(self):
        sql = """
        INSERT INTO ms_user_info
        (ui_id, ui_passwd, ui_name, ui_department_id, ui_email, ui_mobile) VALUES
        (%(id)s, %(password)s, %(name)s, %(department_id)s, %(email)s, %(mobile)s);
        """.strip()
        try:
            with self.db.cursor() as cursor:
                for r in self.json_args:
                    # 密码加密处理
                    r['password'] = hashlib.sha256((r['password'] + config.passwd_hash_key).encode('utf-8')).hexdigest()
                    cursor.execute(sql, r)
                self.db.commit()
                cursor.close()
            return self.write(dict(errcode=RET.OK, errmsg="添加成功"))
        except Exception as e:
            self.db.rollback()
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class DeleteHandler(BaseHandler):
    """删除用户"""

    @required_login
    @required_admin
    def post(self):
        sql = """
        DELETE FROM ms_user_info
        WHERE ui_id=%(id)s;
        """.strip()
        try:
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="删除成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class QuerySelfHandler(BaseHandler):
    """查询本用户"""
    @required_login
    def post(self):
        sql = """
        SELECT ui_id, ui_name, ui_email, ui_mobile, ui_department_id, di_name, ui_permission, ui_role
        FROM ms_user_info JOIN ms_department_info ON di_id=ui_department_id
        WHERE ui_id=%(id)s
        ORDER BY ui_id desc
        LIMIT 1;
        """.strip()
        ret_keys = ['id', 'name', 'email', 'mobile', 'department_id', 'department_name', 'permission', 'role']
        try:
            res = DAO.db_query(self, sql, {'id': self.session.data['user_id']}, ret_keys)
            return self.write(dict(errcode=RET.OK, errmsg="OK", data=res))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class EditSelfHandler(BaseHandler):
    """更新本用户信息"""

    @required_login
    def post(self):
        sql = """
        UPDATE ms_user_info
        SET ui_name=%(name)s, ui_email=%(email)s, 
            ui_mobile=%(mobile)s, ui_department_id=%(department_id)s
        WHERE ui_id=%(id)s;
        """.strip()
        # 验证用户密码
        res = None
        self.json_args['id'] = self.session.data['user_id']
        try:
            with self.db.cursor() as cursor:
                cursor.execute('SELECT ui_passwd, ui_role FROM ms_user_info WHERE ui_id=%(id)s',
                               {"id": self.json_args['id']})
                res = cursor.fetchone()
                self.db.commit()
                cursor.close()
            self.json_args['password'] = hashlib.sha256(
                (self.json_args['password'] + config.passwd_hash_key).encode('utf-8')).hexdigest()
            if not (res and res[0] == self.json_args['password']):
                return self.write(dict(errcode=RET.DATAERR, errmsg="账号或密码错误！"))
            # 需要更改密码
            if self.json_args.get('newPassword'):
                sql = sql.replace('ui_name=%(name)s,', 'ui_name=%(name)s, ui_passwd=%(newPassword)s,')
                self.json_args['newPassword'] = hashlib.sha256(
                    (self.json_args['newPassword'] + config.passwd_hash_key).encode('utf-8')).hexdigest()
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="修改成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))
