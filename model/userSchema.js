let mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    fullname:{
        type: String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    birthday:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },pass:{
        type:String,
        required:true,
    },
    // email:{
    //     type:String,
    //     match:/.+@.+\..+/.,
    // }

});
module.exports=userSchema;