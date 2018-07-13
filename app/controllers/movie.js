var Movie=require("../models/movie")
var _=require('underscore')


exports.detail=function (req,res) {
  var id=req.params.id
  Movie.findById(id,(err,doc)=>{
    res.render('detail',{
      title:doc.title,
      movie:doc
    })
  })
}

exports.new=function (req,res) {
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