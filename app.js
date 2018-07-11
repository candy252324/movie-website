
var express=require('express')
var path=require('path')
var mongoose=require("mongoose")
var Movie=require("./models/movie")
var _=require('underscore')
var bodyParser = require('body-parser')
var port=process.env.PORT||3000
var app=express()   //启动web服务器

mongoose.connect('mongodb://localhost/movies')
mongoose.connection.on('connected',()=>{
  console.log("数据库连接成功")
})
mongoose.connection.on('error',()=>{
  console.log("数据库连接失败")
})
mongoose.connection.on('disconnected',()=>{
  console.log("数据库断开连接")
})

app.set("views","./views/pages")   //设置视图根目录
app.set("view engine","jade")   //设置视图模板引擎
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment=require('moment')
app.listen(port)

console.log("server started on port:"+ port)


app.get('/',function (req,res) {
  Movie.fetch((err,doc)=>{
    if(err){
      console.log(err)
    }
    res.render('index',{
      title:"首页",
      movies:doc,
    })
  })

})
app.get('/movie/:id',function (req,res) {
  var id=req.params.id
  Movie.findById(id,(err,doc)=>{
    res.render('detail',{
      title:doc.title,
      movie:doc
    })
  })

})
app.get('/admin/movie',function (req,res) {
  res.render('admin',{
    title:"后台录入页",
    movie:{
      title:"",
      doctor:"",
      country:"",
      year:"",
      poster:"",
      language:"",
      flash:"",
      summary:"",
    }
  })
})

app.get('/admin/update/:id',(req,res)=>{
  var id=req.params.id;
  if(id){
    Movie.findById(id,(err,movie)=>{
      res.render('admin',{
        title:"后台更新页",
        movie:movie
      })
    })
  }
})

app.post("/admin/movie/new",(req,res)=>{
  var id=req.body.movie._id;
  var movieObj=req.body.movie;
  var _movie
  if(id!=='undefined'){
    Movie.findById(id,(err,movie)=>{
      if(err){
        console.log(err)
      }
      _movie=_.extend(movie,movieObj)
      _movie.save((err,movie)=> {
        if(err){
          console.log(err)
        }
        //更新成功，页面重定向到详情页面
        res.redirect('/movie/'+movie._id)
      })
    })
  }else{
    _movie=new Movie({
      doctor:movieObj.doctor,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash,
    })
    _movie.save((err,movie)=> {
      if(err){
        console.log(err)
      }
      //更新成功，页面重定向到详情页面
      res.redirect('/movie/'+movie._id)
    })
  }
})

app.get('/admin/list',function (req,res) {
  Movie.fetch((err,doc)=>{
    if(err){
      console.log(err)
    }
    res.render('list',{
      title:"列表页",
      movies:doc,
    })
  })
})


app.delete("/admin/list",function (req,res) {
  var id=req.query.id;
  if(id){
    Movie.remove({_id:id},function (err,movie) {
      if(err){
        console.log(err)
      }else{
        res.json({success:1})
      }
    })
  }
})










