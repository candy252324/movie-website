var Movie=require("../models/movie")
var Category=require("../models/category")
var Comment=require("../models/comment")
var _=require('underscore')


exports.detail=function (req,res) {
  var id=req.params.id
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

exports.save=function (req,res) {
  var id=req.body.movie._id;
  var movieObj=req.body.movie;
  var _movie
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
    var categoryId=_movie.category;
    _movie.save((err,movie)=> {
      if(err){
        console.log(err)
      }
      // 同时将电影存入分类表中
      Category.findById(categoryId,function (err,category) {
        category.movies.push(movie._id);
        category.save(function (err,category) {
          //更新成功，页面重定向到详情页面
          res.redirect('/movie/'+movie._id)
        });
      })
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