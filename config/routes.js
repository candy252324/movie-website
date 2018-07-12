
var Movie=require("../models/movie")
var User=require("../models/user")
var _=require('underscore')

module.exports=function (app) {

// 会话逻辑预处理,相当于一个全局拦截
  app.use(function (req,res,next) {
    var _user=req.session.user;
    if(_user){
      app.locals.user=_user;  // 将当前登陆的用户信息存到本地变量，供页面使用，欢迎您,xxx
    }
    return next()
  })

  app.get('/',function (req,res) {
    console.log(req.session.user)
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

// 注册
  app.post('/user/signup',function (req,res) {
    var _user=req.body.user;
    //查找用户名是否重复
    User.find({name:_user.name},function (err,user) {
      if(err){
        console.log(err)
      }
      //重复
      if(user.length){
        return res.redirect('/admin/userList')
        //不重复
      }else{
        var user=new User(_user);    // 创建一条新数据
        user.save(function (err,user) {
          if(err){
            console.log(err)
          }
          res.redirect("/admin/userList")    // 重定向到首页
        })
      }
    })

  })

// 登陆
  app.post('/user/signin',function (req,res) {
    var _user=req.body.user;
    var name=_user.name
    var password=_user.password
    User.findOne({name:name},function (err,user) {
      if(err){
        console.log(err)
      }
      if(!user){
        return res.redirect('/')
      }
      user.comparePassword(password,function (err,isMatch) {
        if(err){
          console.log(err)
        }
        if(isMatch){
          req.session.user=user    // 将user存入session
          return res.redirect('/')
        }else{
          return res.redirect('/')
        }
      })
    })

  })

//登出
  app.get("/logout",function (req,res) {
    delete req.session.user  // 删除session,并重定向到首页
    delete app.locals.user   // 清空本地变量上的user
    res.redirect("/")
  })

  app.get('/admin/userList',function (req,res) {
    User.fetch((err,doc)=>{
      if(err){
        console.log(err)
      }
      res.render('userList',{
        title:"用户列表页",
        users:doc,
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

//后台录入页
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

// 后台修改页
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

// 后台录入post提交
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



}


