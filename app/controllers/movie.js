var Movie=require("../models/movie")
var Category=require("../models/category")
var Comment=require("../models/comment")
var _=require('underscore')
var fs=require('fs')   // 读取文件模块
var path=require('path')  // 路径模块

exports.detail=function (req,res) {
  var id=req.params.id
  //没查看一次详情，该电影访问量+1
  Movie.update({_id:id},{$inc:{pv:1}},function (err) {
    if(err){
      console.log(err)
    }
  })
  Movie.findById(id,(err,movie)=>{
    // 查找该电影下对应的评论
    Comment
      .find({movie:id})
      .populate("from","name")   // .populate("from",["name","role"])
      .populate("reply.from reply.to","name")
      .exec(function (err,comments) {
        res.render('detail',{
          title:movie.title,
          movie:movie,
          comments:comments,
        })
        // res.json({
        //   title:movie.title,
        //   movie:movie,
        //   comments:comments,
        // })
    })

  })
}

exports.new=function (req,res) {
  Category.find({},function (err,categories) {
    res.render('admin',{
      title:"后台录入页",
      categories,
      movie:{}
    })
  })

}

exports.update=function (req,res) {
  var id=req.params.id;
  if(id){
    Movie.findById(id,(err,movie)=>{
      Category.find({},function (err,categories) {
        res.render('admin',{
          title:"后台更新页",
          movie:movie,
          categories
        })
      })
    })
  }
}

// 由于海报的上传是异步的，需要严格控制必须上传成功之后才可以存储数据
exports.savePoster=function (req,res,next) {
  var posterData=req.files.uploadPoster;
  var filePath=posterData.path;   // 文件路径
  var originalFilename=posterData.originalFilename;   //原始名字

  //若名字存在，则认为在传文件
   if(originalFilename){
     fs.readFile(filePath,function (err,data) {
       var timestamp=Date.now();
       var type=posterData.type.split("/")[1];  //文件类型,posterData.type格式为'image/jpeg'
       var poster=timestamp+'.'+type  // 文件新名字
       var newPath=path.join(__dirname, '../../', '/public/upload/'+ poster)  // 文件存储地址
       // 写入文件
       fs.writeFile(newPath,data,function (err) {
         req.poster=poster  // 写入成功后的文件名字挂到req上
         next()
       })
     })
   }else{
     next()
   }
}

exports.save=function (req,res) {
  var id=req.body.movie._id;
  var movieObj=req.body.movie;
  var _movie

  if(req.poster){
    movieObj.poster=req.poster;
  }

  if(id){
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
    _movie=new Movie(movieObj)
    var categoryId=movieObj.category;  // 若是新增的电影分类，则这里categoryId不存在
    var categoryName=movieObj.categoryName;

    _movie.save((err,movie)=> {
      if(err){
        console.log(err)
      }
      // 将电影存入分类表中（已存在的电影分类）
      if(categoryId){
        Category.findById(categoryId,function (err,category) {
          category.movies.push(movie._id);
          category.save(function (err,category) {
            res.redirect('/movie/'+movie._id)
          });
        })
        // 将电影存入分类表中（不存在的电影分类）
      }else if(categoryName){
        var category=new Category({
          name:categoryName,
          movies:[movie._id],
        })
        //存电影分类成功之后拿到这个分类的id,并赋值给这个电影的category字段
        category.save(function (err,category) {
          movie.category=category._id;
          movie.save(function (err,movie) {
            res.redirect('/movie/'+movie._id)
          })
        })
      }
    })
  }
}

exports.list=function (req,res) {
  Movie.fetch((err,doc)=>{
    if(err){
      console.log(err)
    }
    res.render('list',{
      title:"列表页",
      movies:doc,
    })
  })
}

exports.del=function (req,res) {
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
}