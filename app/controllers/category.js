var Movie=require("../models/movie")
var Comment=require("../models/comment")
var Category=require("../models/category")
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
  res.render('category_admin',{
    title:"后台分类录入页",
    category:{}
  })
}

exports.update=function (req,res) {
  var id=req.params.id;
  if(id){
    Movie.findById(id,(err,movie)=>{
      res.render('admin',{
        title:"后台更新页",
        movie:movie
      })
    })
  }
}

exports.save=function (req,res) {
  var _category=req.body.category;
  var  category=new Category(_category);
  category.save(function (err,category) {
    if(err){
      console.log(err)
    }
    res.redirect('/admin/category/list')
  })
}

exports.list=function (req,res) {
  Category.fetch((err,categories)=>{
    if(err){
      console.log(err)
    }
    res.render('category_list',{
      title:"分类列表页",
      categories:categories,
    })
  })
}

