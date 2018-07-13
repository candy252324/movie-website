var User=require("../models/user")

exports.showSignin=function (req,res) {
  res.render('signin',{
    title:"登陆",
  })
}

exports.showSignup=function (req,res) {
  res.render('signup',{
    title:"注册",
  })
}

exports.signup=function (req,res) {
  var _user=req.body.user;
  //查找用户名是否重复
  User.find({name:_user.name},function (err,user) {
    if(err){
      console.log(err)
    }
    //重复
    if(user.length){
      return res.redirect('/signin')  // 存在的用户，重定向到登陆页面
      //不重复
    }else{
      var user=new User(_user);    // 创建一条新数据
      user.save(function (err,user) {
        if(err){
          console.log(err)
        }
        res.redirect("/")    // 注册成功，重定向到首页
      })
    }
  })
}

exports.signin=function (req,res) {
  var _user=req.body.user;
  var name=_user.name
  var password=_user.password
  User.findOne({name:name},function (err,user) {
    if(err){
      console.log(err)
    }
    if(!user){
      return res.redirect('/signup')  // 不存在的用户，重定向到注册页面
    }
    user.comparePassword(password,function (err,isMatch) {
      if(err){
        console.log(err)
      }
      if(isMatch){
        req.session.user=user    // 将user存入session
        return res.redirect('/')
      }else{
        return res.redirect('/signin') // 密码不对，重定向到登陆页
      }
    })
  })
}

exports.logout=function (req,res) {
  delete req.session.user  // 删除session,并重定向到首页
  // delete app.locals.user   // 清空本地变量上的user
  res.redirect("/signin")
}

exports.list=function (req,res) {
  User.fetch((err,doc)=>{
    if(err){
      console.log(err)
    }
    res.render('userList',{
      title:"用户列表页",
      users:doc,
    })
  })
}

// 中间件，权限控制，必须登陆才可以往下走
exports.signinRequeired=function (req,res,next) {
  var user=req.session.user;
  if(!user){
    return res.redirect('/signin')
  }
  next()
}

// 中间件，权限控制，权限等级必须大于10才可以往下走
exports.adminRequired=function (req,res,next) {
  var user=req.session.user;
  if(user.role<=10){
    return res.redirect('/signin')
  }
  next()
}
