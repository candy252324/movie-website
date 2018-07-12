var User=require("../models/user")

exports.signup=function (req,res) {
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
}

//登出
// app.get("/logout",function (req,res) {
//
// })

exports.logout=function (req,res) {
  delete req.session.user  // 删除session,并重定向到首页
  // delete app.locals.user   // 清空本地变量上的user
  res.redirect("/")
}

// app.get('/admin/userList',function (req,res) {
//
// })

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