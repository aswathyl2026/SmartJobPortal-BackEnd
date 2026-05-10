const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
   email:{
    type:String,
    required:true,
    unique:true
  },
   password:{
    type:String,
    required:true
  },
   role:{
    type:String,
    enum:['candidate','recruiter','admin'],
    default:'candidate'
  },
   status:{
    type:Boolean,
    default:true
  }
})

const users=mongoose.model("users",userSchema)
module.exports=users