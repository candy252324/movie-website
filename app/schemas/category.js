var mongoose=require("mongoose")
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId

var CategorySchema=new Schema({
  name:String,
  movies:[{type:ObjectId,ref:'Movie'}],  // 该分类下的电影的id
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
CategorySchema.pre('save',function(next){
  //若为新增数据，则把它的创建时间和更新时间设置为当前时间
  if(this.isNew){
    this.meta.createAt=this.meta.updateAt=Date.now();
  }else{
    this.meta.updateAt=Date.now();
  }
  next();  // 必须调next方法才能将存储流程走下去
})

//添加静态方法
CategorySchema.statics={
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
module.exports=CategorySchema;