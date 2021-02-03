# -*- coding: utf-8 -*-
# !/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# major_handler.py 2018/12/3 21:20

from utils.commons import required_login, required_principal
from utils.response_code import RET
from .base_handler import BaseHandler

class QueryHandler(BaseHandler):
    @required_login
    async def post(self):
        sql = """
        SELECT mi_id, mi_name, mi_degree, mi_study_time, mi_department_id
        FROM ms_major_info
        WHERE CONCAT(mi_id, '') like %(id)s AND
              mi_name like %(name)s;
        """
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['name'] = '%{}%'.format(self.json_args['name'])
        return self.write(dict(errcode=RET.OK, errmsg="OK", data=await self.query(sql, self.json_args)))


class EditHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        UPDATE ms_major_info
        SET mi_name=%(name)s, mi_degree=%(degree)s, mi_study_time=%(study_time)s, 
            mi_department_id=%(department_id)s
        WHERE mi_id=%(id)s;
        """
        await self.execute(sql, self.json_args)


class AddHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        INSERT INTO ms_major_info
        (mi_name, mi_degree, mi_study_time, mi_department_id) VALUES
        (%(name)s, %(degree)s, %(study_time)s, %(department_id)s);
        """
        await self.execute(sql, self.json_args)


class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        DELETE FROM ms_major_info
        WHERE mi_id=%(id)s;
        """
        await self.execute(sql, self.json_args)
