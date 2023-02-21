const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true,},
    img:{type:String},
    email:{type:String,required:true,unique:true},
    isAdmin:{type:Boolean,default:false}

},{timestamps:true})

module.exports = mongoose.model('User',userSchema)