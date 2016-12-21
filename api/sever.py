#!/usr/bin/env python
# -*- encoding: utf-8 -*-
'''
__author__ = 'top'
date = '16/12/19'
我爱学习,学习使我快乐
'''
import sys
from werkzeug import security
from flask import Flask, request,Response
import json
import pandas as pd
import cPickle

users = cPickle.load(open('./users.pd','r'))
'''
加载到内存
'''

app = Flask(__name__)
@app.errorhandler(404)
def page_not_found(e):
    return '{"error":"404"}'

@app.errorhandler(400)
def page_not_found(e):
    return '{"error":"parms error"}'

@app.route('/',methods=['GET','POST'])
def welcome():
    a = Response("")
    a.headers['Access-Control-Allow-Origin'] = '*'

    if request.method=='POST':
        data = request.form
    else:
        data = request.values


    try :
        phone_num = data.getlist('phone_num')
        b = users[users['phone_num']==int(phone_num[0])].get_values().tolist()
        b += users[users['phone_num']==phone_num[0]].get_values().tolist()


    except:
        b = 'your input format error'
    a.data = json.dumps({"r":b},ensure_ascii=False)
    return a


from werkzeug.contrib.fixers import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == "__main__":
    try:
        port_number = int(sys.argv[1])
    except:
        port_number = 3005
    app.run(host='0.0.0.0', port=port_number)
