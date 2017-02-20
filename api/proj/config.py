#!/usr/bin/env python  
# -*- encoding: utf-8 -*-
'''
__author__ = 'top'
date = '17/2/21'
我爱学习,学习使我快乐
'''
from __future__ import absolute_import

CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/5'
BROKER_URL = 'redis://127.0.0.1:6379/6'