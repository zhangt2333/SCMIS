# coding:utf-8
import aiomysql
import aioredis
import tornado.web
import tornado.ioloop
import tornado.options
import tornado.httpserver
import tornado.locks
import config

from urls import urls
from tornado.options import options, define

define("port", default=8000, type=int, help="run server on the given port")


class Application(tornado.web.Application):
    @classmethod
    async def create(cls, urls, app_settings, mysql_settings, redis_settings):
        self = Application(urls, **app_settings)
        self.db = await aiomysql.create_pool(**mysql_settings)
        await self.check_database()
        self.redis = await aioredis.create_redis_pool(**redis_settings)
        return self

    def __init__(self, *args, **kwargs):
        super(Application, self).__init__(*args, **kwargs)

    async def check_database(self):
        async with self.db.acquire() as conn:
            async with conn.cursor() as cur:
                try:
                    await cur.execute("SELECT COUNT(*) FROM ms_user_info LIMIT 1")
                    await cur.fetchone()
                except Exception as e:
                    print(e)
                    exit(-1)


async def main():
    if not config.app_settings['debug']:
        options.log_file_prefix = config.log_path
    options.logging = config.log_level
    tornado.options.parse_command_line()
    app = await Application.create(
        urls,
        config.app_settings,
        config.mysql_settings,
        config.redis_settings
    )
    app.listen(options.port)
    shutdown_event = tornado.locks.Event()
    await shutdown_event.wait()


if __name__ == "__main__":
    tornado.ioloop.IOLoop.current().run_sync(main)