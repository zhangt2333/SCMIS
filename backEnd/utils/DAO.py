# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# DAO.py 2018/12/4 16:34


# 定义上下文管理器, with结束后自动关闭连接
import contextlib
@contextlib.contextmanager
def get_cursor(handlerObject):
    cursor = handlerObject.db.cursor()
    try:
        yield cursor
    finally:
        handlerObject.db.commit()
        cursor.close()

def db_query(handlerObject, sql, parms, ret_keys):
    # 查询多项
    ret = []
    with get_cursor(handlerObject) as cursor:
        cursor.execute(sql, parms)
        size = len(ret_keys)
        for i in cursor.fetchall():
            one = {}
            for j in range(size):
                one[ret_keys[j]] = str(i[j])
            ret.append(one)
    return ret

def db_execute(handlerObject, sql, parms):
    # 无返回值执行
    with get_cursor(handlerObject) as cursor:
        cursor.execute(sql, parms)
