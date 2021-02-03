# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# StudentHandler.py 2018/12/3 21:20

from utils.commons import required_login, required_principal
from utils.response_code import RET
from .BaseHandler import BaseHandler

class QueryHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """ 
        SELECT si_id, si_name, si_birthday, si_sex, si_mobile,
               si_native_place, si_enrollment_year, si_id_card, si_major_id
        FROM ms_student_info 
        WHERE si_id like %(id)s AND 
              si_name like %(name)s; 
        """
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['name'] = '%{}%'.format(self.json_args['name'])
        return self.write(dict(errcode=RET.OK, errmsg="OK", data=await self.query(sql, self.json_args)))


class EditHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        UPDATE ms_student_info
        SET si_name=%(name)s, si_birthday=%(birthday)s, si_sex=%(sex)s, si_mobile=%(mobile)s, 
            si_native_place=%(native_place)s, si_enrollment_year=%(enrollment_year)s, 
            si_id_card=%(id_card)s, si_major_id=%(major_id)s
        WHERE si_id=%(id)s;
        """
        await self.execute(sql, self.json_args)


class AddHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        INSERT INTO ms_student_info
        (si_id, si_name, si_birthday, si_sex, si_mobile, si_native_place, 
         si_enrollment_year, si_id_card, si_major_id) VALUES
        (%(id)s, %(name)s, %(birthday)s, %(sex)s, %(mobile)s, 
         %(native_place)s, %(enrollment_year)s, %(id_card)s, %(major_id)s);
        """
        await self.execute(sql, self.json_args)


class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        DELETE FROM ms_student_info
        WHERE si_id=%(id)s;
        """
        await self.execute(sql, self.json_args)
