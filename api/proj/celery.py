#!/usr/bin/env python  
# -*- encoding: utf-8 -*-
'''
__author__ = 'top'
date = '17/2/21'
我爱学习,学习使我快乐
'''
from __future__ import absolute_import
from celery import Celery

app = Celery('proj', include=['proj.tasks'])

app.config_from_object('proj.config')

if __name__ == '__main__':
    app.start()