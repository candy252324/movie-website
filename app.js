
var express=require('express')
var path=require('path')
var mongoose=require("mongoose")
var bodyParser = require('body-parser')  // 中间件，将post请求body中的内容格式化为一个对象
var multipart = require('connect-multiparty')  // 海报上传中间件，专门用于处理enctype='multipart/form-data'的表单提交过来的数据

var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore=require("connect-mongo")(session)

var port=process.env.PORT||3000
var app=express()   //启动web服务器

var dbUrl='mongodb://localhost/movies'
mongoose.connect(dbUrl)
mongoose.connection.on('connected',()=>{
  console.log("数据库连接成功")
})
mongoose.connection.on('error',()=>{
  console.log("数据库连接失败")
})
mongoose.connection.on('disconnected',()=>{
  console.log("数据库断开连接")
})

app.set("views","./app/views/pages")   //设置视图根目录
app.set("view engine","jade")   //设置视图模板引擎
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multipart());

app.use(cookieParser())  // session依赖于cookieParser
app.use(session({
  secret:"movieWebsite",    //secret值用于防止篡改cookie
  store:new mongoStore({
    url:dbUrl,    // 当前mongodb数据库地址
    collection:"sessions"  // 数据库中新建一个sessions集合，用于存储session
  })
}))

// 开发环境配置
if('development'===app.get("env")){
  app.set("showStackError",true)   // 输出报错信息
  var logger=require("morgan")
  app.use(logger(":method :url :status"))  // 打印每一次请求方法，地址，状态
  app.locals.pretty=true;   //开发环境代码不压缩，增强可读性
  mongoose.set("debug",true)   // 数据库报错信息
}

require("./config/routes")(app)   // 将app作为参数传入
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment=require('moment')   // 将moment方法挂到本地变量上，则在页面上可以直接使用
app.listen(port)

console.log("server started on port:"+ port)







