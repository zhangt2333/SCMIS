# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# SectionHandler.py 2018/12/3 21:21
import logging

from utils import DAO
from utils.commons import required_login, required_principal
from utils.response_code import RET
from .BaseHandler import BaseHandler


class QueryHandler(BaseHandler):
    @required_login
    async def post(self):
        sql = """
        SELECT cs_id, cs_course_id, ci_name, cs_semester, cs_year, cs_capacity,
               cs_teacher_id, ui_name, cs_btime, cs_etime
        FROM ms_course_section JOIN ms_course_info ON cs_course_id=ci_id
                               JOIN ms_user_info ON cs_teacher_id=ui_id
        WHERE CONCAT(cs_id, '') like %(id)s AND
              ci_name like %(name)s
        ORDER BY cs_id;
        """.strip()
        retKeys = ['id', 'course_id', 'course_name', 'semester', 'year', 'capacity',
                   'teacher_id', 'teacher_name', 'btime', 'etime']
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['name'] = '%{}%'.format(self.json_args['name'])
        try:
            res = await DAO.db_query(self, sql, self.json_args, retKeys)
            return self.write(dict(errcode=RET.OK, errmsg="OK", data=res))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class EditHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        UPDATE ms_course_section
        SET cs_course_id=%(course_id)s, cs_semester=%(semester)s, cs_year=%(year)s, cs_capacity=%(capacity)s, 
            cs_teacher_id=%(teacher_id)s, cs_btime=%(btime)s, cs_etime=%(etime)s
        WHERE cs_id=%(id)s;
        """.strip()
        try:
            await DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="修改成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class AddHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        INSERT INTO ms_course_section
        (cs_course_id, cs_semester, cs_year, cs_capacity, 
         cs_teacher_id, cs_btime, cs_etime) VALUES
        (%(course_id)s, %(semester)s, %(year)s, %(capacity)s, 
         %(teacher_id)s, %(btime)s, %(etime)s);
        """.strip()
        try:
            await DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="添加成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))


class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        DELETE FROM ms_course_section
        WHERE cs_id=%(id)s;
        """.strip()
        try:
            await DAO.db_execute(self, sql, self.json_args)
            return self.write(dict(errcode=RET.OK, errmsg="删除成功"))
        except Exception as e:
            logging.error(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))
