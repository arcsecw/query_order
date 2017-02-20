import {myConfig} from './config'
var  u = myConfig.fetch_url
var ver = myConfig.api_version
var client_id = myConfig.client_id
module.exports = {
    get_token,
    refresh_token,
    post,
    post_json,
    get,
    get_userinfo,
    logout,
}

function logout(){
    localStorage.clear()
}


    //登录函数
function get_token(username,password,cb){
        var d = new FormData()
        d.append('username',username)
        d.append('password',password)
        d.append('grant_type','password')
        d.append('client_id',client_id)
        m_post('oauth/token',d,(re)=>{
            var timestamp=new Date().getTime()                
            localStorage.access_token = re.access_token
            localStorage.refresh_token = re.refresh_token
            localStorage.expires_at = timestamp + re.expires_in * 1000
            console.log('token refreshed') 
            cb('success')
        })
    } 
function get_userinfo(){
    if(localStorage.username == undefined){
        get('user_info','',(re)=>{
            localStorage.username = re.username
        })
    }
    return localStorage.username
}    
    //刷新token函数
function refresh_token(cb){
    var timestamp=new Date().getTime()       
    if(localStorage.expires_at!=undefined && localStorage.expires_at<timestamp){
        var d = new FormData()
        d.append('grant_type','refresh_token')
        d.append('refresh_token',localStorage.refresh_token)
        d.append('client_id',client_id)
        m_post('oauth/token',d,(re)=>{
            var timestamp=new Date().getTime()                
        localStorage.access_token = re.access_token
        localStorage.refresh_token = re.refresh_token
        localStorage.expires_at = timestamp + re.expires_in * 1000
        cb()
        console.log('token refreshed') 
        })    
    }else{
        cb()
    }
}
function m_get(apipath,data,cb) {
    var myHeaders = new Headers()
    myHeaders.append('Authorization','Bearer '+localStorage.access_token)
    var url = u+'/'+apipath  +'?'     
    
    for (let k of Object.keys(data)){
        url = url + k + '=' + data[k]
    }
    fetch(url,{
        mode:'cors',
        headers:myHeaders
    })
        .then(checkStatus)
        .then(res => {
            return res.json();
        })
        .then(data => {
            cb(data)
        })
        .catch(error => {
            console.log('Request failed: ', error)
        });

}
//post 方法
function m_post(apipath,form,cb) {
    var url = u+'/'+apipath       
    //var f = document.getElementById('myform');
    //var form = new FormData(f)
    //for (let k of Object.keys(data)){
    //    form.append(k,data[k])
    //}
    //form.append("userfile", fileInputElement.files[0]);
    var myHeaders = new Headers()
    myHeaders.append('Authorization','Bearer '+localStorage.access_token) 
           
    fetch(url,{
        method:'POST',
        body:form,
        headers:myHeaders,
        mode:'cors'
    })
        .then(checkStatus)
        .then(res => {
            return res.json();
        })
        .then(data => {
            cb(data)
        })
        .catch(error => {
            console.log('Request failed: ', error)
        });

}
//post 方法
function m_post_json(apipath,json,cb) {
    var url = u+'/'+apipath       
    var myHeaders = new Headers()
    myHeaders.append('Authorization','Bearer '+localStorage.access_token) 
    myHeaders.append('Content-Type','application/json') 
           
    fetch(url,{
        method:'POST',
        body:json,
        headers:myHeaders,
        mode:'cors'
    })
        .then(checkStatus)
        .then(res => {
            return res.json();
        })
        .then(data => {
            cb(data)
        })
        .catch(error => {
            console.log('Request failed: ', error)
        });
}
//交互之前检查token是否过期

//封装后的post方法
function post (apipath,form,cb){
    refresh_token(()=>{
        m_post(apipath,form,cb)
    })
    
}
//封装后的post方法
function post_json (apipath,form,cb){
    refresh_token(()=>{
        m_post_json(apipath,form,cb)
    })
    
}
//封装后的get方法
function get (apipath,data,cb){
    refresh_token(()=>{
        m_get(apipath,data,cb)
    })
    
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}


