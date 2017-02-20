#!/usr/bin/env python  
# -*- encoding: utf-8 -*-
'''
__author__ = 'top'
date = '17/2/21'
我爱学习,学习使我快乐
'''
from __future__ import absolute_import
from proj.celery import app

from pymongo import MongoClient
from messager import  messager
from bson.objectid import ObjectId

@app.task
def add(username):
    client = MongoClient()
    collect = client['eve']['orders']
    msg = messager()
    collect.update_many({"send_status":"0","add_by":username},{"$set":{"send_status":"1"}})
    to_be_send = collect.find({"send_status":"1","add_by":username})
    for order in to_be_send:
        try :
            re = msg.kuaidi(order['name'],order['kuaidi'],order['order_nb'],order['phone'])
            if re !=None:
                collect.update_one({"_id":ObjectId(order['_id'])},{"$set":{"send_status":"2"}})
            else:
                collect.update_one({"_id":ObjectId(order['_id'])},{"$set":{"send_status":"0"}})
        except :
            collect.update_one({"_id":ObjectId(order['_id'])},{"$set":{"send_status":"0"}})

    return 'all_done'
