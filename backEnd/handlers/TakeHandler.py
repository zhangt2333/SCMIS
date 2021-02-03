# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# TakeHandler.py 2018/12/3 21:21
import logging

from utils.commons import required_login, required_principal
from utils.response_code import RET
from .BaseHandler import BaseHandler


class QueryHandler(BaseHandler):
    @required_login
    async def post(self):
        sql = """
        SELECT ct_id, ct_student_id, si_name, ct_section_id, ci_name, ct_usual_grade, ct_mid_grade,
               ct_final_grade, ct_grade, ct_GPA
        FROM ms_course_take JOIN ms_student_info ON si_id=ct_student_id
                            JOIN ms_course_section ON cs_id=ct_section_id
                            JOIN ms_course_info ON ci_id=cs_course_id 
        WHERE CONCAT(ct_id, '') like %(id)s AND
              ct_student_id like %(student_id)s AND
              ct_section_id like %(section_id)s;
        """
        ret_keys = ['id', 'student_id', 'name','section_id', 'course_name', 'usual_grade',
                   'mid_grade', 'final_grade', 'grade', 'GPA']
        self.json_args['id'] = '%{}%'.format(self.json_args['id'])
        self.json_args['student_id'] = '%{}%'.format(self.json_args['student_id'])
        self.json_args['section_id'] = '%{}%'.format(self.json_args['section_id'])
        return self.write(dict(errcode=RET.OK, errmsg="OK", data=await self.query_with_ret_key(sql, self.json_args, ret_keys)))


class EditHandler(BaseHandler):
    @required_login
    async def post(self):
        # 验证用户是否为该课授课教师或管理员
        sql1 = """
        SELECT *
        FROM ms_course_section
        WHERE cs_teacher_id=%(teacher_id)s AND
              cs_id=(SELECT ct_section_id 
                     FROM ms_course_take 
                     WHERE ct_id=%(id)s);
        """
        try:
            async with self.db.acquire() as conn:
                async with conn.cursor() as cur:
                    await cur.execute(sql1, {'id': self.json_args.get('id'), 'teacher_id': self.session.data.get('user_id')})
                    if not await cur.fetchone():
                        return self.write(dict(errcode=RET.ROLEERR, errmsg="用户非该课授课教师"))
        except Exception as e:
            logging.exception(e)
            return self.write(dict(errcode=RET.PARAMERR, errmsg="出错"))
        # 修改数据库
        sql2 = """
        UPDATE ms_course_take
        SET ct_student_id=%(student_id)s, ct_section_id=%(section_id)s, 
            ct_usual_grade=%(usual_grade)s, ct_mid_grade=%(mid_grade)s, 
            ct_final_grade=%(final_grade)s, ct_grade=%(grade)s, ct_GPA=%(GPA)s
        WHERE ct_id=%(id)s;
        """
        await self.execute(sql2, self.json_args)



class AddHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        INSERT INTO ms_course_take
        (ct_student_id, ct_section_id) VALUES
        (%(student_id)s, %(section_id)s);
        """
        await self.execute(sql, self.json_args)


class DeleteHandler(BaseHandler):
    @required_login
    @required_principal
    async def post(self):
        sql = """
        DELETE FROM ms_course_take
        WHERE ct_id=%(id)s;
        """
        await self.execute(sql, self.json_args)