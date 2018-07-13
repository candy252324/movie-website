var mongoose=require("mongoose")
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
/*
MongoDB中没有join的特性，因此无法使用join进行表的连接和关联查询，
在Mongoose中封装了populate方法，在定义一个 Schema 的时候可以指定了其中的字段（属性）是另一个Schema的引用，
在查询文档时就可以使用 populate 方法通过引用 Schema 和 id 找到关联的另一个文档或文档的指定字段值
使用：
 Comment
      .find({movie:id})  // 查找到关于某电影的所有评论
      .populate("from","name")  // 在User表中查找id值为from的数据所对应的name值
      .exec(function (err,comments) {})

*/
var CommentSchema=new Schema({
  movie:{type:ObjectId, ref:'Movie'},  //评论的是哪部电影
  from:{type:ObjectId, ref:'User'},  // 谁评论的
  to:{type:ObjectId, ref:'User'},  // 评论的谁
  content:String, // 评论的内容
  meta:{
    createAt:{
      type:Date,
      default:Date.now(),
    },
    updateAt:{
      type:Date,
      default:Date.now(),
    }
  },
})

//pre save 每次存储数据之前都要调用这个方法
CommentSchema.pre('save',function(next){
  //若为新增数据，则把它的创建时间和更新时间设置为当前时间
  if(this.isNew){
    this.meta.createAt=this.meta.updateAt=Date.now();
  }else{
    this.meta.updateAt=Date.now();
  }
  next();  // 必须调next方法才能将存储流程走下去
})

//添加静态方法
CommentSchema.statics={
  //fetch,用于查找出所有数据并按updateAt进行排序
  fetch:function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  //findById用于查找指定id的数据
  findById:function (id,cb) {
    return this
      .findOne({_id:id})
      .exec(cb)
  }
}
//导出模式
module.exports=CommentSchema;