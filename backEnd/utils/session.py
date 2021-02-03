# -*- coding: utf-8 -*-
# !/usr/bin/env python
# Copyright 2018 ZhangT. All Rights Reserved.
# Author: ZhangT
# Author-Github: github.com/zhangt2333
# session.py 2018/12/3 21:13

import uuid
import json
import logging

from constants import SESSION_EXPIRES_SECONDS


class Session(object):
    @classmethod
    async def create(cls, handler):
        # 先判断用户是否已经有了session_id
        self = Session()
        self._handler = handler
        self.session_id = handler.get_secure_cookie("session_id")
        self.data = {}

        # 如果不存在session_id,生成session_id
        if not self.session_id:
            self.session_id = uuid.uuid4().hex
            handler.set_secure_cookie("session_id", self.session_id)
        # 如果存在session_id, 去redis中取出data
        else:
            try:
                self.session_id = str(self.session_id, encoding='utf-8') # bytes2str
                json_data = await handler.redis.get("sess_{}".format(self.session_id))
                self.data = json.loads(json_data) if json_data else {}
            except Exception as e:
                logging.exception(e)
                raise e
        return self

    def __init__(self):
        self._handler = None
        self.session_id = None
        self.data = None
        super().__init__()

    async def save(self):
        try:
            await self._handler.redis.setex(
                "sess_{}".format(self.session_id),
                SESSION_EXPIRES_SECONDS,
                json.dumps(self.data)
            )
        except Exception as e:
            logging.exception(e)
            raise e

    async def clear(self):
        try:
            await self._handler.redis.delete("sess_%s" % self.session_id)
        except Exception as e:
            logging.exception(e)
        self._handler.clear_cookie("session_id")