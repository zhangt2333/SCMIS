# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# CourseHandler.py 2018/12/3 21:21

from utils.commons import required_login, required_principal
from utils.response_code import RET
from .BaseHandler import BaseHandler


class QueryHandler(BaseHandler):
    @required_login
    async def post(self):
        sql = """
        SELECT ci_id, ci_name, ci_property, ci_type, ci_period, ci_credit,
               ci_exam_type, ci_department_id, ci_description
        FROM ms_course_info
        WHERE CONCAT(ci_id, '') like %(id)s AND
              ci_name like %(name)s;
        """
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['name'] = '%{}%'.format(self.json_args['name'])
        return self.write(dict(errcode=RET.OK, errmsg="OK", data=await self.query(sql, self.json_args)))


class EditHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        UPDATE ms_course_info
        SET ci_name=%(name)s, ci_property=%(property)s, ci_type=%(type)s, ci_period=%(period)s, 
            ci_credit=%(credit)s,ci_exam_type=%(exam_type)s, ci_department_id=%(department_id)s, 
            ci_description=%(description)s
        WHERE ci_id=%(id)s;
        """
        await self.execute(sql, self.json_args)



class AddHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        INSERT INTO ms_course_info
        (ci_name, ci_property, ci_type, ci_period, ci_credit,
         ci_exam_type, ci_department_id, ci_description) VALUES
        (%(name)s, %(property)s, %(type)s, %(period)s, %(credit)s,
         %(exam_type)s, %(department_id)s, %(description)s);
        """
        await self.execute(sql, self.json_args)



class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        DELETE FROM ms_course_info
        WHERE ci_id=%(id)s;
        """
        await self.execute(sql, self.json_args)

