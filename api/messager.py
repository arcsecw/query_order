#!/usr/bin/env python  
# -*- encoding: utf-8 -*-
'''
__author__ = 'top'
date = '17/2/20'
我爱学习,学习使我快乐
'''
from top import appinfo
import top.api
from top.api.rest import AlibabaAliqinFcSmsNumSendRequest as sentrequest
import json

class messager :
    url = 'gw.api.taobao.com'
    port = 80
    appkey = '23639647'
    appsecret = '93acf9266c71c6cd7dbb7a028e60fbd7'

    def _get_a_common_client(self):
        req = sentrequest(self.url,self.port)
        req.set_app_info(appinfo(self.appkey,self.appsecret))
        return req
    def _exec(self,req):
        try:
            resp= req.getResponse()
            return resp
        except Exception,e:
            raise e
    '''
    2月20日的需求发送短信
    '''
    def kuaidi(self,name,kuaidi,order_nb,phone):
        req = self._get_a_common_client()
        req.sms_type = "normal"
        req.sms_free_sign_name="梵大集团"
        req.sms_param=json.dumps({
            "AAAA":name,
            "BBBB":kuaidi,
            "CCCC":order_nb}
        )
        req.rec_num=str(phone)
        req.sms_template_code="SMS_47915110"
        return self._exec(req)

if __name__ == '__main__':
    #from pymongo import MongoClient
    #client = MongoClient()
    #collect = client['eve']['orders']
    #print [i for i in collect.find()]
    m = messager()
    try :
        re = m.kuaidi("王文超","顺丰快递","2015020273","1316110370")
    except Exception,e:
        print str(e)
