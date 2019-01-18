# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# MajorHandler.py 2018/12/3 21:20
import logging

from utils import DAO
from utils.commons import required_login, required_principal
from utils.response_code import RET
from .BaseHandler import BaseHandler

class QueryHandler(BaseHandler):
    @required_login
    def post(self):
        sql = """
        SELECT mi_id, mi_name, mi_degree, mi_study_time, mi_department_id
        FROM ms_major_info
        WHERE CONCAT(mi_id, '') like %(id)s AND
              mi_name like %(name)s;
        """.strip()
        retKeys = ['id', 'name', 'degree', 'study_time', 'department_id']
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['name'] = '%{}%'.format(self.json_args['name'])
        try:
            res = DAO.db_query(self, sql, self.json_args, retKeys)
            return self.write(dict(errcode=RET.OK, errmsg="OK", data=res))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class EditHandler(BaseHandler):
    @required_login
    @required_principal
    def post(self):
        sql = """
        UPDATE ms_major_info
        SET mi_name=%(name)s, mi_degree=%(degree)s, mi_study_time=%(study_time)s, 
            mi_department_id=%(department_id)s
        WHERE mi_id=%(id)s;
        """.strip()
        try:
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="修改成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class AddHandler(BaseHandler):
    @required_login
    @required_principal
    def post(self):
        sql = """
        INSERT INTO ms_major_info
        (mi_name, mi_degree, mi_study_time, mi_department_id) VALUES
        (%(name)s, %(degree)s, %(study_time)s, %(department_id)s);
        """.strip()
        try:
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="添加成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    def post(self):
        sql = """
        DELETE FROM ms_major_info
        WHERE mi_id=%(id)s;
        """.strip()
        try:
            DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="删除成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))
