#!/usr/bin/env python  
# -*- encoding: utf-8 -*-
'''
__author__ = 'top'
date = '16/12/20'
我爱学习,学习使我快乐
'''
#!/usr/bin/env python
# -*- coding:utf-8 -*-
import csv
import codecs

def test(filename):
    data = csv.reader(open(filename,'r'),delimiter='\t')
    re = []
    zongji = []
    for row in data:
        if u'总计' in row[1].decode('utf-8'):
            zongji = row
        else:
            re.append(row)
    re.append(zongji)
    csvfile = file(filename,'wb')
    csvfile.write(codecs.BOM_UTF8)
    writer = csv.writer(csvfile)
    for l in re:
        writer.writerow(l)
    csvfile.close()
if __name__ == '__main__':
    test('./re_daily_flow.data')

