# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# CaseHandler.py 2018/12/3 21:20
import logging

from utils.commons import required_login, required_principal
from utils.response_code import RET
from .BaseHandler import BaseHandler


class QueryHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        SELECT sc_id, sc_student_id, si_name, sc_type, sc_level, sc_date, sc_description
        FROM ms_student_case JOIN ms_student_info ON sc_student_id=si_id
        WHERE sc_student_id like %(student_id)s;
        """
        retKeys = ['id', 'student_id','student_name','type', 'level', 'date', 'description']
        self.json_args['student_id'] = '%{}%'.format(self.json_args['student_id'])
        try:
            res = await self.db_query(sql, self.json_args, retKeys)
            return self.write(dict(errcode=RET.OK, errmsg="OK", data=res))
        except Exception as e:
            logging.exception(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class EditHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        UPDATE ms_student_case
        SET sc_type=%(type)s, sc_level=%(level)s, sc_date=%(date)s, sc_description=%(description)s
        WHERE sc_id=%(id)s;
        """
        await self.execute(sql, self.json_args)


class AddHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        INSERT INTO ms_student_case
        (sc_student_id, sc_type, sc_level, sc_date, sc_description) VALUES
        (%(student_id)s, %(type)s, %(level)s, %(date)s, %(description)s);
        """
        await self.execute(sql, self.json_args)


class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        DELETE FROM ms_student_case
        WHERE sc_id=%(id)s;
        """
        await self.execute(sql, self.json_args)
