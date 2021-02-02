# -*- coding: utf-8 -*-
#!/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# DAO.py 2018/12/4 16:34


async def db_query(handlerObject, sql, parms, ret_keys):
    # 查询多项
    ret = []
    async with handlerObject.db.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(sql, parms)
            size = len(ret_keys)
            for i in await cur.fetchall():
                one = {}
                for j in range(size):
                    one[ret_keys[j]] = str(i[j])
                ret.append(one)
    return ret


async def db_execute(handlerObject, sql, parms):
    # 无返回值执行
    async with handlerObject.db.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(sql, parms)
            await conn.commit()