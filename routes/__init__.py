import json

from models.session import Session
from models.todo import Todo
from utils import log
from models.user import User

import random

session = {}


def random_str():
    # 生成一个随机的字符串
    seed = 'ayuaIOjklad*dlkaj98023lfd'
    s = ''
    for i in range(16):
        
        random_index = random.randint(0, len(seed) - 2)
        s += seed[random_index]
    return s


def current_user(request):
    session_id = request.cookies.get('sid', '')
    sessions = Session.all()
    for s in sessions:
        if s.session_id == session_id:
            u = User.find_by(id=s.user_id)
            return u
    return None


def response_with_headers(headers=None, status_code=200):
    """
    Content-Type: text/html
    Set-Cookie: user=gua
    """
    # header = 'HTTP/1.x {} GUA\r\n'.format(code)
    header = 'HTTP/1.1 {} GUA\r\nContent-Type: text/html\r\n'
    header = header.format(status_code)
    if headers is not None:
        header += ''.join([
            '{}: {}\r\n'.format(k, v) for k, v in headers.items()
        ])
    return header


def redirect(location, headers=None):
    """
    浏览器在收到 302 响应的时候
    自动在 HTTP header 里面找 Location 字段并获取一个 url
    然后自动请求新的 url
    """
    h = {
        'Location': location
    }
    if headers is not None:
        h.update(headers)
    # 302 状态码的含义, Location 的作用
    header = response_with_headers(h, 302)
    r = header + '\r\n' + ''
    log('redirect r', r)
    return r.encode()


def login_required(route_function):
    """
	装饰器：修饰路由函数
	实现用户登录控制，非登录用户跳转登录界面
    """

    def f(request):
        u = current_user(request)
        if u is None:
            log('非登录用户')
            return redirect('/login')
        else:
            return route_function(request)

    return f


def error(request, code=404):
    """
    根据 code 返回不同的错误响应
    目前实现404
    """
    e = {
        404: b'HTTP/1.x 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    return e.get(code, b'')


def http_response(body, headers=None):
    """
    headers 是可选的字典格式的 HTTP 头部
    """
    header = response_with_headers(headers)
    r = header + '\r\n' + body
    return r.encode()


def json_response(data):
    """
    本函数返回 json 格式的 body 数据
    前端的 ajax 函数就可以用 JSON.parse 解析出格式化的数据
    """
    # json格式headers字段应该是 application/json 而不是 text/html
    # 但只起标识作用非必须，客户端可以忽略这个。
    header = 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n'
    # json.dumps 用于把 list 或者 dict 转化为 json 格式的字符串
    # ensure_ascii=False 正确处理中文
    # indent=2 表示格式化缩进
    body = json.dumps(data, ensure_ascii=False, indent=2)
    r = header + '\r\n' + body
    return r.encode(encoding='utf-8')
