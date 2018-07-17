var Movie=require("../models/movie")
var Category=require("../models/category")

exports.index=function (req,res) {
  Category
    .find({})
    .populate({
      path:'movies',
      select:'title poster',
      options:{limit:6}  // 每个分类下只取6条数据
    })
    .exec(function (err,categories) {
      if(err){
        console.log(err)
      }
      res.render('index',{
        title:"首页",
        categories:categories,
      })
    })
}

//search
exports.search=function (req,res) {
  var catId=req.query.cat;
  var page=parseInt(req.query.p);
  var count=2;  // 每页数据条数
  var index=page*count;

  Category
    .find({_id:catId})
    .populate({
      path:'movies',
      select:'title poster',
      // options:{limit:6,skip:index}  // 如此分页有bug
    })
    .exec(function (err,categories) {
      if(err){
        console.log(err)
      }
      var category=categories[0]||{};
      var movies=category.movies||[];
      var results=movies.slice(index,index+count) // 分页数据

      res.render('results',{
        title:"结果列表页面",
        keyword:category.name,   // 用于搜索
        currentPage:page+1,
        query:'cat='+catId,
        totalPage:Math.ceil(movies.length/count),  // 总页数
        movies:results,
      })
    })
}