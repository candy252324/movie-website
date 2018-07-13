var Comment=require("../models/comment")



exports.save=function (req,res) {
  var _comment=req.body.comment;
  var movieId=_comment.movie;

  // 若存在cid（某评论的id）,说明是在回复别人的评论
  if(_comment.cid){
    Comment.findById(_comment.cid,function (err,comment) {
      var reply={
        from:_comment.from,
        to:_comment.tid,
        content:_comment.content
      }
      comment.reply.push(reply)
      comment.save(function (err,comment) {
        if(err){
          console.log(err)
        }
        res.redirect('/movie/'+ movieId)
      })
    })
  }else{
    //新增的评论
    var comment=new Comment(_comment);
    comment.save(function (err,comment) {
      if(err){
        console.log(err)
      }
      res.redirect('/movie/'+ movieId)
    })
  }
}
