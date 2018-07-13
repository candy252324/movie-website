var Movie=require("../models/movie")

exports.index=function (req,res) {
  Movie.fetch((err,doc)=>{
    if(err){
      console.log(err)
    }
    res.render('index',{
      title:"首页",
      movies:doc,
    })
  })
}