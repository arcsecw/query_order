# -*- coding: utf-8 -*-

"""
    Eve Demo (Secured)
    ~~~~~~~~~~~~~~~~~~
    This is a fork of Eve Demo (https://github.com/nicolaiarocci/eve-demo)
    intended to demonstrate how a Eve API can be secured by means of
    Flask-Sentinel.
    For demonstration purposes, besides protecting a couple API endpoints
    with a BearerToken class instance, we are also adding a static html
    endpoint an protecting with via decorator.
    :copyright: (c) 2015 by Nicola Iarocci.
    :license: BSD, see LICENSE for more details.
"""
from flask.ext.cors import CORS, cross_origin
from eve import Eve
from oauth2 import BearerAuth
from flask.ext.sentinel import ResourceOwnerPasswordCredentials, oauth
from flask import request
import json
from pymongo import MongoClient
from proj.tasks import add
import cPickle
from flask import  request,Response


users = cPickle.load(open('./users.pd','r'))
client = MongoClient()
collect = client['eve']['orders']


app = Eve(auth=BearerAuth)
ResourceOwnerPasswordCredentials(app)
app.debug = True
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

@app.route('/query_order')
@oauth.require_oauth()
def query_order():
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

@app.route('/user_info')
@oauth.require_oauth()
def user_info():
    user = request.oauth.user.username
    return json.dumps({"username":user})

@app.route('/do_it')
@oauth.require_oauth()
def do_it():
    user = request.oauth.user.username
    add.delay(user)
    return json.dumps({"status":"sending"})

@app.route('/del_all')
@oauth.require_oauth()
def del_all():
    collect.delete_many({"send_status":"0","add_by":request.oauth.user.username})
    return json.dumps({"status":"success"})

@app.route('/del_sended')
@oauth.require_oauth()
def del_sended():
    collect.delete_many({"send_status":"2","add_by":request.oauth.user.username})
    return json.dumps({"status":"success"})

from werkzeug.contrib.fixers import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)
if __name__ == '__main__':
    app.run()