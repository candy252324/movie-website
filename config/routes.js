var Index=require("../app/controllers/index")
var Movie=require("../app/controllers/movie")
var User=require("../app/controllers/user")

module.exports=function (app) {

// 会话逻辑预处理,相当于一个全局拦截
  app.use(function (req,res,next) {
    var _user=req.session.user;
    app.locals.user=_user;  // 将当前登陆的用户信息(如果有的话)存到本地变量，供页面使用，欢迎您,xxx
    next()
  })

  //Index
  app.get('/',Index.index)

  // User
  app.post('/user/signup',User.signup)
  app.post('/user/signin',User.signin)
  app.get("/signin",User.showSignin)
  app.get("/signup",User.showSignup)
  app.get("/logout",User.logout)
  app.get('/admin/userList',User.list)

  //Movie
  app.get('/movie/:id',Movie.detail)
  app.get('/admin/movie',Movie.new)
  app.get('/admin/update/:id',Movie.update)
  app.post("/admin/movie/new",Movie.save)
  app.get('/admin/list',Movie.list)
  app.delete("/admin/list",Movie.del)
}


