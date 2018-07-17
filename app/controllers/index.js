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
  console.log("111111111111111111111111111111111")
  console.log(req.query)
  var catId=req.query.cat;
  var q=req.query.q;  // 搜索框内容
  var page=parseInt(req.query.p,10)||0;  // 搜索框搜索时，默认给0
  var count=2;  // 每页数据条数
  var index=page*count;
  // 某电影分类里的分页搜索
  if(catId){
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
          keyword:category.name,  // 搜索的分类名称
          currentPage:page+1,
          query:'cat='+catId,
          totalPage:Math.ceil(movies.length/count),  // 总页数
          movies:results,
        })
      })
  }
  //搜索框搜索
  else{
    Movie
      .find({title: new RegExp(q + '.*','i')})   // 使用正则，模糊匹配
      .exec(function (err,movies) {
        if(err){
          console.log(err)
        }
        var results=movies.slice(index,index+count) // 分页数据

        res.render('results',{
          title:"结果列表页面",
          keyword:q,   // 搜索框内容
          currentPage:page+1,
          query:'q='+q,
          totalPage:Math.ceil(movies.length/count),  // 总页数
          movies:results,
        })
      })
  }
}