# coding:utf-8

import uuid
import json
import logging

from constants import SESSION_EXPIRES_SECONDS


class Session(object):
    @classmethod
    async def create(cls, request_handler_obj):
        # 先判断用户是否已经有了session_id
        self = Session()
        self._request_handler = request_handler_obj
        self.session_id = request_handler_obj.get_secure_cookie("session_id")
        # 如果不存在session_id,生成session_id
        if not self.session_id:
            self.session_id = uuid.uuid4().hex
            self.data = {}
            request_handler_obj.set_secure_cookie("session_id", self.session_id)

        # 如果存在session_id, 去redis中取出data
        else:
            try:
                self.session_id = str(self.session_id, encoding='utf-8') # bytes2str
                json_data = await request_handler_obj.redis.get("sess_%s" % self.session_id)

            except Exception as e:
                logging.error(e)
                raise e
            if not json_data:
                self.data = {}
            else:
                self.data = json.loads(json_data)
        return self

    async def save(self):
        json_data = json.dumps(self.data)
        try:
            await self._request_handler.redis.setex("sess_%s" % self.session_id,
                                             SESSION_EXPIRES_SECONDS, json_data)
        except Exception as e:
            logging.error(e)
            raise e

    async def clear(self):
        try:
            await self._request_handler.redis.delete("sess_%s" % self.session_id)
        except Exception as e:
            logging.error(e)
        self._request_handler.clear_cookie("session_id")


"""
class xxxxhandler(RequestHandler):
    def post(self):

        session = Session(self)
        session.session_id
        session.data["username"] = "abc"
        session.data["mobile"] = "abc"
        session.save()

    def get(self):
        session = Session(self)
        session.data["username"] = "def"
        session.save()



    def get(self):
        session = Session(self)
        session.clear()

        session.clear()

redis中的数据：
key:    session_id
value:  data
"""
