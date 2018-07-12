var mongoose=require("mongoose")
var bcrypt=require("bcrypt")
var SALT_WORK_FACTOR=10  // 加密计算强度设为10（默认值也为10）


var UserSchema=new mongoose.Schema({
  name:{
    unique:true,   // 表示不可重复
    type:String,
  },
  password:String,
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
UserSchema.pre('save',function(next){

  var user=this; // this及当前这个user

  //若为新增数据，则把它的创建时间和更新时间设置为当前时间
  if(this.isNew){
    this.meta.createAt=this.meta.updateAt=Date.now();
  }else{
    this.meta.updateAt=Date.now();
  }
  // 生成一个随机的盐
  //SALT_WORK_FACTOR参数为计算强度，计算强度越大，攻击者建立彩虹表就越困难，破解越困难
  bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
    if(err) return next(err)
    // hash加密，bcrypt.hash接收三个参数，第一个为明文密码，第二个为盐，第三个为回调
    bcrypt.hash(user.password,salt,function (err,hash) {
      if(err) return next(err)
      user.password=hash;   // 将最终加密过后的密码保存到user.password
      next();  // next 必须写在回调里，若写在bcrypt.genSalt外面，将无法加密
    })
  })
})

//添加实例方法
UserSchema.methods={
  // 第一个参数为用户提交过来的数据
  comparePassword:function (_password,cb) {
    // this指向当前实例
    bcrypt.compare(_password,this.password,function (err,isMatch) {
      if(err) return cb(err)
      cb(null,isMatch)
    })
  }
}

//添加静态方法
UserSchema.statics={
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
module.exports=UserSchema;