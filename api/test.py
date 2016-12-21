import pandas as pd
import cPickle
users = pd.read_excel(open('./users.xlsx'))
users.columns = ['name','phone_num','no']
cPickle.dump(users,open('users.pd','w'))
