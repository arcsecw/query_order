## react react-router python flask restful-api 前后端通过fetch交互数据的一个简单demo

> react+amazeui做前端，python flask 做后端api，通过fetch  发送get或者post请求交互 

**对您有帮助请亲记得回来star一下**

## demo
[订单查询online_demo](oih5vf6ii.bkt.clouddn.com)
<div align=center>
<img src="http://oih1xpa8t.bkt.clouddn.com/queryorder/iphone6.png" width="187" height="334" alt="手机版"/>
<img src="http://oih1xpa8t.bkt.clouddn.com/queryorder/web.png" width="" height="334" alt="web版"/>
</div>


### 运行详细命令
> 看不懂命令? mac用户请command+w windows用户请control+w

前端react项目运行方法：
```
git clone git@github.com:arcsecw/query_order.git
npm install gulp -g //安装过gulp就不用傻傻的再执行一遍了
cd query_order
npm install
npm start //此时应该你的默认浏览器应该已经自动打开了，开始盯着页面修改代码玩吧
//
```
后端flask运行方法：
上一个窗口已经被前端的项目占用了，再新开一个终端窗口
```
cd query_order/api
pip install -r requirements.txt

python sever.py 
或者
gunicorn -c gun.conf sever:app
```

### 前端简介
- 兼容safari chome 高级ie 等支持fetch 以及amazeui的浏览器

- 配置好了gulp 图片压缩 css压缩 es6转码 less转码 代码修改热更新

- react-router 用不用无所谓，这里用到只是为了示例react-router的用法

- 所有的图片放到 ```./app/i/``` 目录下

- 所有的样式文件放到 ```./app/less/``` 目录下

- js代码放到 ```./app/js/``` 目录下

- ```./app/dist/```目录是转码压缩后的文件存放地址 放到你web服务器上即完成发布


### 后端简介

> ``` ./api/``` 使用pandas读取users.xlsx中存储的用户信息，接收参数后用json格式返回对应用户的信息（使用pandas只是因为最近在用pandas练习数据分析^_^）使用了比较方便易用的gunicorn做服务器了。（我反正是很恶心一个github上找一个demo运行起来得配置一堆东西比如flask 搭配wsgui 或nginx之类的）

- ```python test.py ```可以把同级目录下的user.xlsx 读取后 cPickle.dump 为users.pd
> 是因为当xlsx比较大的时候每次重新读取太慢，转化为pd后很快了

- ```python sever.py``` 运行flask自带的开发服务器监听3005端口，不支持并发（多人访问会出问题）

- ```gunicorn -c gun.conf sever:app``` 运行独角兽服务器监听3005端口

-  浏览器访问```http://localhost:3005```看看接口是否正常


### 前后端交互简介

- ```./app/js/components/Call.js```包装了一个基于fetch的```m_post() m_get() 用法祥见代码吧。```
```
handle_submit(e){
        e.preventDefault(); 
        var form1 = new FormData()
        //我的参数存储到this.state.parms 里了
        for(let k in this.state.parms){
            form1.append(k,this.state.parms[k])
        }
        // '/'是你的接口地址 form1 是上面new的form对象
        //。也可以你自己想法子去dom里拿
        // re当然是结果了^_^
        m_post('/',form1,(re)=>{
          console.log(re)
          //your code balabala
        }})
    },
```


### 前端项目生产环境构建

设置 Node 环境变量为 `production` 后，HTML 中引用的 CSS 和 JS 会替换为 minify 的版本。

```
npm run build
```
