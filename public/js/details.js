$(function () {
  $(".comment").on("click",function(e){
    var target=$(this)
    var toId=target.data("tid")   // 被回复的人的id
    var commentId=target.data("cid")  // 被回复的评论的id
    if($("#toId").length>0){
      $("#toId").val(toId)
    }else{
      // 动态生成一个包含被回复人的id的隐藏表单域插入到#commentForm中
      $("<input>").attr({
        type:"hidden",
        id:'toId',
        name:'comment[tid]',
        value:toId,
      }).appendTo('#commentForm')
    }

    if($("#commentId").length>0){
      $("#commentId").val(commentId)
    }else{
      $("<input>").attr({
        type:"hidden",
        id:'commentId',
        name:'comment[cid]',
        value:commentId,
      }).appendTo('#commentForm')
    }

  })
})