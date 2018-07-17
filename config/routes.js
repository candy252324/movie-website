var Index=require("../app/controllers/index")
var Movie=require("../app/controllers/movie")
var User=require("../app/controllers/user")
var Comment=require("../app/controllers/comment")
var Category=require("../app/controllers/category")

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
  app.get('/admin/user/list',User.signinRequeired, User.adminRequired, User.list)  // 权限控制，（必须登陆，且必须有权限才可以访问User.list）

  //Movie
  app.get('/movie/:id',Movie.detail)
  app.get('/admin/movie/new',User.signinRequeired, User.adminRequired,Movie.new)
  app.get('/admin/movie/update/:id',User.signinRequeired, User.adminRequired,Movie.update)
  app.post("/admin/movie",User.signinRequeired, User.adminRequired,Movie.save)
  app.get('/admin/movie/list',User.signinRequeired, User.adminRequired,Movie.list)
  app.delete("/admin/movie/list",User.signinRequeired, User.adminRequired,Movie.del)

  app.get('/admin/category/new',User.signinRequeired, User.adminRequired,Category.new)
  app.post('/admin/category',User.signinRequeired, User.adminRequired,Category.save)
  app.get('/admin/category/list',User.signinRequeired, User.adminRequired,Category.list)


  //Comment
  app.post('/user/comment',User.signinRequeired, Comment.save)

  //results
  app.get('/results',Index.search)
}


